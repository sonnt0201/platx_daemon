/**
 * Independent service.
 */

import { Router } from "express";
import { getTBToken } from "../__tbauth";
import { __LogE, __Log, __LogSuccess } from "./__SchedulerLog";
import { _DeviceScheduleManager } from "./_DeviceScheduleManager";

import { tbPostDeviceSharedAttribute } from "./_TBAPIsClient";
import { DeviceID } from "./interface";
import { userConfig } from "./userConfig";

__Log("hello from scheduler");





const SMART_SOCKET_DEVICE_ID = "b7ca6200-ab97-11ef-89ae-b1b32c7b1fa7"


const ScheduleManagersMap: Map<DeviceID, _DeviceScheduleManager> = new Map();


// init with userconfig
userConfig.defaultDeviceConfigs?.forEach(deviceConfig => {


    // init if device manager does not exist in map
    let manager = ScheduleManagersMap.get(deviceConfig.id);

    if (!manager) {

        const manager = new _DeviceScheduleManager(deviceConfig.id);

        manager.syncData().then(() => {

            deviceConfig.eventHandler?.forEach(event => {
                manager.eventHandlers.set(event.control, event.action)
            })

            manager.startTimer();
       
        });



        ScheduleManagersMap.set(deviceConfig.id, manager)
    }







})


/**
 * ## Expose Router as http api
 * 
 * ### Create new scheduler
 * 
 * `POST /service/scheduler/:deviceId/daily`
 * 
 * Json body: 
 * 
 * ```ts
 * {
 *  control: string,
 *  hour? : number,
 *  minute? : number,
 *  second? : number,
 * }
 * ```
*/
const SchedulerRouter: Router = Router();

SchedulerRouter.get("/service/scheduler", (req, res) => {
    return res.json({
        msg: "connection oke!"
    })
})

/**
 * Endpoint to create daily schedule
 */
SchedulerRouter.post("/service/scheduler/:deviceId/daily", async (req, res) => {

    const { deviceId } = req.params;

    if (!ScheduleManagersMap.get(deviceId)) {
        return res.status(400).json({
            msg: "Service has no specified device"
        })
    }

    const manager = ScheduleManagersMap.get(deviceId);


   

    const data = req.body as {
        control: string,
        hour?: number,
        minute?: number,
        second?: number,

    }

    __Log(`Incoming req body: `)
    console.log(data)

    try {
        await manager?.addScheduleDaily(data.control, data.hour, data.minute, data.second);

        return res.json({ msg: "oke" })
    } catch (err) {

        __LogE((err as Error).message);

        return res.status(500).json();
    }



})

export { SchedulerRouter }
