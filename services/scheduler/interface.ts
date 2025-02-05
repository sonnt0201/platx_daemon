
/**
 * Interface for a schedule
 * 
 * Can belong to any device
 * 
 * Specified by schedule's id
 */
export interface ISchedule {

    /**
     * In milliseconds, the next scheduled time
     * 
     * If current timestamp is equal or greater than incoming timestamp, scheduled event must be fired
     * and the next incoming timestamp must be set, depend on repeat time
     */
    incomingTime: number;

    /**
     * period of schedule in milliseconds
     * 
     * must be at least one minute (60000)
     */
    repeatTime: number;


    /**
        * - The number of times the schedule will repeat.
        * - Each time the deadline passes, `repeatCount` decreases by 1.
        * - If `repeatCount` is `-1`, the schedule repeats indefinitely.
     */
    repeatCount: number;

    /**
     * Id of the schedule
     */
    id: string;

    /**
     * name for the event that happened when the time come
     */
    control: string;
}

/**
 * name of attribute key for thingsboard
 */
export const SchedulesAttributeKey = "_schedules"

export enum TimestampOptions {
    ONE_MIN = 1000 * 60,
    ONE_DAY = 1000 * 60 * 60 * 24,
    ONE_HOUR = 1000 * 60 * 60,
    ONE_WEEK = 1000 * 60 * 60 * 24 * 7
}

export type ControlLabel = string;

export type DeviceID = string;

export interface UserConfig {

    /**
     * Custom alias names
     * 
     */
    alias?: {
        [index: string]: any
    }

    /**
     * List of default devices config that are initialized when service starts 
     * 
     * 
     */
    defaultDeviceConfigs?: {

        /** ID of device (from thingsboard server) */
        id: DeviceID;

        /** Triggered event handler when scheduled time comes */
        eventHandler?: {

            /** Scheduler control label as string, example: "on", "off" */
            control: string,

            /** Function called when scheduled time come */
            action: () => void
        }[]

    }[]


}
