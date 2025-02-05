// import { ISchedule } from '@/models/client/Schedule';

import { __Log, __LogE, __LogSuccess } from "./__SchedulerLog";
import { getSchedulesList, postSchedulesList, tbGetDeviceSharedAttribute } from "./_TBAPIsClient";
import { ControlLabel, ISchedule, SchedulesAttributeKey, TimestampOptions } from "./interface";
import { v4 as uuidv4 } from "uuid";

/**
 * Used to fetch, add, edit, save schedules list of a specific DEVICE.
 * 
 * Specified by DEVICE ID (each TB device goes with one Schedule manager)
 * 
 * When init, fetch schedules from thingsboard
 * 
 * keep checking the list to figure out what schedule time comes. Fire attached callback and edit new incommingTime
 * 
 * Whenever changes happen, save it to thingsboard.
 * 
 * Exposes function to crud schedules list
 * 
 */
export class _DeviceScheduleManager {

    private _deviceId: string = "";

    get deviceId(): string { return this._deviceId }


    private _schedulesList: ISchedule[] = [];

    get schedulesList() { return this._schedulesList }

    private _checkerInterval: NodeJS.Timeout | undefined

    /**
     * defined what to do when the scheduled time comes
     * 
     * each element is callback mapped with `control` string
     */
    eventHandlers: Map<ControlLabel, () => void> = new Map();


    /**
     * Check if data is sync from the TB server when object initialization
     */
    private _firstDataSync: boolean = false

    /**
     * Save current `_schedulesList` to thingsboard server
     * 
     * Should be called after CRUD operations
     */
    async saveToThingsboard() {
        try {
            await postSchedulesList(this._deviceId, this._schedulesList)
        } catch (e) {
            __LogE("Error happened when saving schedules")
            __LogE((e as Error).message)
        }

    }

    /**
     * Init a new manager instance
     * 
     * Must call syncData() method right after init
     * 
     * @param deviceId 
     */
    constructor(deviceId: string) {
        this._deviceId = deviceId;



    }

    /**
     * Must be called right after init
     * 
     * sync the schedules list data with thingsboard server
     * 
     * Data is fetched (one way) from Thingsboard
     */
    async syncData() {

        try {
            const res = await tbGetDeviceSharedAttribute(this._deviceId, SchedulesAttributeKey);

            if (res.data && Array.isArray(res.data) && res.data.length > 0 && res.data[0].value) {
                this._schedulesList = res.data[0].value as ISchedule[]

                __LogSuccess("Fetch TB Device attributes:")
                console.log(res.data[0].value)


                __LogSuccess("Data sync successfully.")


            } else {
                __Log("Empty data from server, init with empty array")
            }

            this._firstDataSync = true;

        } catch (e) {
            __LogE("Cannot sync data")
        }


    }

    async addScheduleDaily(control: string, hour: number = 0, minute: number = 0, second: number = 0): Promise<void> {

        if (!this._firstDataSync) {
            __LogE("Data is not sync yet, call syncData() first")
        }



        const id = uuidv4();

        // Calculate the incoming timestamp (in milliseconds) matching the hour, minute, and second
        const now = new Date();
        let incoming = new Date();
        incoming.setHours(hour, minute, second, 0);

        // If the calculated time is in the past, move to the next day
        if (incoming.getTime() < now.getTime()) {
            incoming.setDate(incoming.getDate() + 1);
        }

        const newSchedule: ISchedule = {
            id: id,
            control: control,
            repeatCount: -1,
            incomingTime: incoming.getTime(),
            repeatTime: 1000 * 60 * 60 * 24 // one day
        };

        // Push the new schedule into the list
        this._schedulesList.push(newSchedule);



        __LogSuccess("Added a schedule, new list: ")
        console.log(this._schedulesList)


        // save to thingsboard server
        await postSchedulesList(this._deviceId, this._schedulesList)


    }



    /**
     * Delete a schedule.
     * @param id id of the schedule to be deleted.
     * 
     */
    async deleteSchedule(id: string) {
        this._schedulesList = this._schedulesList.filter(schedule => schedule.id !== id);
        this.saveToThingsboard();
    }

    /**
     * Edit (update) a schedule
     * 
     * can be used for PUT operations
     * 
     * @param id id of the schedule 
     * 
     * @param options keys and values of updated schedule's properties.
     * 
     */
    async editSchedule(id: string, options: Omit<ISchedule, 'id'>) {

        this._schedulesList = this._schedulesList.map(s => {

            // guard
            if (s.id !== id) return s;

            // main logic

            // loop through edited properties
            Object.keys(options).forEach(key => {
                // Type assertion to fix indexing issue
                if (key in s) {
                    (s as any)[key] = options[key as keyof typeof options];
                }


            });

            return s;
        }) // end "map" callback

        // save new schedule list
        this.saveToThingsboard();


    }


    /**
   * 
   * @param options options for the scheduler (actually `ISchedule` properties except `id`, 'cause `id` is auto-generated)
   * 
   * See [ISchdule](interface.ts)
   *  
   */
    async addCustomSchedule(options: Omit<ISchedule, "id">) {

        if (!this._firstDataSync) {
            __LogE("Data is not sync yet, call syncData() first")
        }



        const id = uuidv4();

        // Calculate the incoming timestamp (in milliseconds) matching the hour, minute, and second
        const now = new Date();



        // check valid options
        if (!options.repeatTime || options.repeatTime <= TimestampOptions.ONE_MIN) { // if invalid
            __LogE("Invalid repeatTime when adding a custom schedule ")
            console.log({

                deviceId: this.deviceId
            })
        }

        /**
         * new schedule to create
         */
        const newSchedule: ISchedule = {
            incomingTime: options.incomingTime ?? Date.now(),
            repeatTime: options.repeatTime,
            repeatCount: options.repeatCount ?? -1,
            id: id,
            control: options.control
        }

        this._schedulesList.push(newSchedule)

        __LogSuccess("Added a schedule, new list: ")
        console.log(this._schedulesList)


        // save to thingsboard server
        await postSchedulesList(this._deviceId, this._schedulesList)


    }




    /**
     * Call after init and sync data
     * 
     * set interval to loop through the schedule list to check if sheduled dealine has come
     */
    async startTimer() {

        if (!this._firstDataSync) {
            __LogE("Data is not sync yet, call syncData() first")
        }

        if (!this._checkerInterval) {
            // repeat to check all of schedule objects 
            this._checkerInterval = setInterval(() => {

                this._schedulesList.forEach((schedule) => {


                    const current = Date.now();

                    // __Log("Compare time now - scheduleTime: " 
                    //     + current.toString() 
                    //     + "-" + schedule.incomingTime.toString()
                    //     + `\nSeconds until next scheduled time: ${(schedule.incomingTime - current)/1000} secs`
                    // )

                    // when scheduled time comes, fire mapped event handler
                    if (current >= schedule.incomingTime 
                        && schedule.repeatCount !== 0 // equal -1 (indefinitely) or possitive
                    
                    ) {

                        // calculate next scheduled time
                        schedule.incomingTime += schedule.repeatTime * (
                            Math.floor((Date.now() - schedule.incomingTime) / schedule.repeatTime) // ensure next scheduled time jumps over current time
                            + 1
                        );



                        

                        // fire event handler
                        const callback = this.eventHandlers.get(schedule.control);

                        try {
                            if (callback)   callback(); // FIRE EVENT
                        } catch (e) {
                            console.log((e as Error).message)
                        }

                        // decreate time counter
                        if (schedule.repeatCount > 0) schedule.repeatCount--;
                        __Log("Event happened: ")
                        console.log({
                            device: this.deviceId,
                            control: schedule.control,
                            repeatCount: schedule.repeatCount
                        })


                       // save new list to thingsboard
                       this.saveToThingsboard();

                    }

                })


            }, 1000) // check each 1 seconds 

            __LogSuccess("Checker interval started!");

        } else {

            __LogE("Time checker has already been started")
        }


    }









}