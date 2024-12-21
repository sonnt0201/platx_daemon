
import { __Log, __LogE, __LogSuccess } from "./__SchedulerLog";
import { getSchedulesList, postSchedulesList, tbGetDeviceSharedAttribute } from "./_TBAPIsClient";
import { ControlLabel, ISchedule, SchedulesAttributeKey } from "./interface";
import { v4 as uuidv4 } from "uuid";

/**
 * Used to fetch, add, edit, save schedules list of a specific DEVICE.
 * 
 * When init, fetch schedules from thingsboard
 * 
 * keep checking the list to figure out what schedule time comes. Fire attached callback and edit new incommingTime
 * 
 * Whenever changes happen, save it to thingsboard.
 * 
 * Exposes function to crud schdules list
 * 
 */
export class _DeviceScheduleManager {

    private _deviceId: string = "";

    get deviceId(): string { return this._deviceId }


    private _schedulesList: ISchedule[] = [];

    get schedulesList () { return this._schedulesList}

    private _checkerInterval: NodeJS.Timeout | undefined

    /**
     * defined what to do when the scheduled time comes
     * 
     * each element is callback mapped with `control` string
     */
    eventHandlers: Map<ControlLabel, () => void> = new Map();


   private _firstDataSync: boolean = false

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
     */
    async syncData() {

        try {
            const res = await tbGetDeviceSharedAttribute(this._deviceId, SchedulesAttributeKey);

            if (res.data && Array.isArray(res.data) && res.data.length > 0 && res.data[0].value) {
                this._schedulesList = res.data[0].value as ISchedule[]

                __LogSuccess("Data sync successfully.")

            } else {
                __Log("Empty data from server, init with empty array")
            }

            this._firstDataSync = true;

        } catch (e) {
            __LogE("Cannot sync data")
        }


    }

    async addScheduleDaily( control: string, hour: number = 0, minute: number = 0, second: number = 0): Promise<void> {

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

            incomingTime: incoming.getTime(),
            repeatTime: 1000 * 60 * 60 * 24 // one day
        };

        // Push the new schedule into the list
        this._schedulesList.push(newSchedule);

       

        __LogSuccess("Added a schedule, new list: ")
        console.log(this.schedulesList)


        // save to thingsboard server
        await postSchedulesList(this._deviceId, this._schedulesList)

    }

    /**
     * Call after init and sync data
     * 
     * set interval to loop through the schedule list to check if sheduled time has come
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
                    if (current >= schedule.incomingTime) {

                        // add schedule
                        schedule.incomingTime += schedule.repeatTime;
                        __Log("Event happened: " )
                        console.log({
                           device:  this.deviceId,
                           control: schedule.control
                        })

                        // fire event handler
                       const callback = this.eventHandlers.get(schedule.control);
                       if (callback) callback();

                       // save new list to thingsboard
                       this.saveToThingsboard();

                    }

                })


            }, 5000) // check each 5 second 

            __LogSuccess("Checker interval started!");

        } else {

            __LogE("Time checker has already been started")
        }


    }









}