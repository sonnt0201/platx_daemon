

enum DayOfWeek {
    MONDAY,
    TUESDAY,
    WEDNESDAY,
    THURSDAY,
    FRIDAY,
    SATURDAY,
    SUNDAY,

}

interface IHasIncoming {

    /**
     * incomming scheduled time at which timer going off
     */
    incoming: number ;
}

export interface IScheduleMonthly extends IHasIncoming {
    name: string;
    id: string;
    /**
    * What to do when the time comes
    */ 
    control: string; 
    date: number;
    hour: number;
    minute: number;
    second: number;
   

}

export interface IScheduleWeekly extends IHasIncoming  {
    id: string
    name: string;
    /**
    * What to do when the time comes
    */ 
    control: string
    day: DayOfWeek;
    hour: number;
    minute: number;
    second: number;

}

export interface IScheduleDaily extends IHasIncoming {
    name: string;
    id: string;
    /**
    * What to do when the time comes
    */ 
    control: string;
    hour: number;
    minute: number;
    second: number;

}

export interface IScheduleCustom  {
    name: string;
    id: string;
    /**
    * What to do when the time comes
    */ 
    control: string;
    timestamp: number; // as seconds since epoch
}

export enum ScheduleAttributeKey {
    // YEARLY= "ScheduleYearlyList",
    MONTHLY = "ScheduleMonthlyList",
    
    WEEKLY = "ScheduleWeeklyList",
    
    DAILY = "ScheduleDailyList",
    
    CUSTOM = "ScheduleCustomList",

}

/**
 * Job to be put in jobs queue
 */
export interface IScheduleJob {
    
    /**
     * create, read, update or delete one or more schedules
     * 
     * checktimer to check the schedule and do operations when the time goes off
     */
    operation: "create" | "read" | "update" | "delete" | "checktimer";

    // deviceId: string;

    scheduleMonthly?: IScheduleMonthly

    scheduleWeekly? : IScheduleWeekly

    scheduleDaily? : IScheduleDaily

    scheduleCustom? : IScheduleCustom


}

/**
 * name of control for the schedule
 */
export type ScheduleControl = string 
