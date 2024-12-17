
import { IScheduleDaily, IScheduleJob, ScheduleControl } from "./_interfaces";
import { getSchedulesDailyList, postSchedulesDailyList } from "./_TBAPIsClient";
import { v4 as uuidv4 } from "uuid";




/**
 * Ensure tasks are performed one by one
 */
class ScheduleJobsQueue {
    private _queue: IScheduleJob[] = [];

    push(job: IScheduleJob) {

        // put to the end of array
        this._queue.push(job)
    }

    pop(): IScheduleJob | undefined {

        // get the first item of array
        if (this._queue.length > 0) return this._queue.shift(); else return undefined;


    }

    size(): number {
        return this._queue.length
    }

}



/**
 * Do CRUD operations with each type of schedule
 * 
 * give functions to add task (also exposed function as http api)
 */
export class DeviceScheduleManager {

    /**
     * Called when the scheduled time has come
     * configurable
     */
    private _callback: Map<ScheduleControl, () => void> = new Map();


    private _jobsQueue: ScheduleJobsQueue = new ScheduleJobsQueue();

    private _deviceId: string = "";

    // check if every schedule's each second
    // private _scheduleCheckerInterval: NodeJS.Timeout 

    private async _addScheduleDaily(name: string, control: string, hour: number = 0, minute: number = 0, second: number = 0): Promise<void> {

        // Fetch the current list of daily schedules
        const list = await getSchedulesDailyList(this._deviceId);

        const id = uuidv4();

        // Calculate the incoming timestamp (in milliseconds) matching the hour, minute, and second
        const now = new Date();
        let incoming = new Date();
        incoming.setHours(hour, minute, second, 0);

        // If the calculated time is in the past, move to the next day
        if (incoming.getTime() < now.getTime()) {
            incoming.setDate(incoming.getDate() + 1);
        }

        const newSchedule: IScheduleDaily = {
            name: name,
            id: id,
            control: control,
            hour: hour,
            minute: minute,
            second: second,
            incoming: incoming.getTime(), // Incoming timestamp in milliseconds
        };

        // Push the new schedule into the list
        list.push(newSchedule);


        await postSchedulesDailyList(this._deviceId, list)

    }


    /**
     * Check if the DAILY scheduled time has come, if yes, call the matched callback
     * 
     */
    private async _checkScheduleDailyDueTime() {
        // Fetch the current list of daily schedules
        const list = await getSchedulesDailyList(this._deviceId);

        const now = new Date().getTime(); // Current time in milliseconds

        for (const schedule of list) {
            if (now >= schedule.incoming) {
                // Call the callback if it exists for the control
                const callback = this._callback.get(schedule.control as ScheduleControl);
                if (callback) callback();

                // Update the incoming time to the next day
                const nextIncoming = new Date(schedule.incoming);
                nextIncoming.setDate(nextIncoming.getDate() + 1);
                schedule.incoming = nextIncoming.getTime();
            }
        }

        // Post the updated schedule list back to the server
        await postSchedulesDailyList(this._deviceId, list);
    }








    constructor(deviceId: string) {

        this._deviceId = deviceId;

        setInterval(() => {
             this._workJobs();
        }, 100)

       

    }

    /**
     * Keep loop through all job of queue to do job
     */
    private async _workJobs() {
      
            const job = this._jobsQueue.pop();

            if (!job) return;


            switch (job.operation) {
                case "create":
                    if (job.scheduleDaily) {
                        await this._addScheduleDaily(

                            job.scheduleDaily.name,
                            job.scheduleDaily.control,
                            job.scheduleDaily.hour,
                            job.scheduleDaily.minute,
                            job.scheduleDaily.second,

                        )
                    };
                    break;

                case "checktimer":
                   await this._checkScheduleDailyDueTime();
                   break;

                default:
                    break;





            }


        

    }


    /**
     * Other code outside class can only call this method to request manager to do something
     * 
     * */
    pushJob(job: IScheduleJob) {
        this._jobsQueue.push(job);
    }

    onScheduledTimeCome(control: ScheduleControl, callback: () => void ) {
        this._callback.set(control, callback);
    }



}   