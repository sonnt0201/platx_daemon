/**
 * Independent service.
 */

import { getTBToken } from "../__tbauth";
import {__LogE, __Log} from "./__SchedulerLog";
import { DeviceScheduleManager } from "./_Manager";
import {  tbPostDeviceSharedAttribute } from "./_TBAPIsClient";

__LogE("hello from scheduler");





const SMART_SOCKET_DEVICE_ID = "b7ca6200-ab97-11ef-89ae-b1b32c7b1fa7"
const turnoff = () => {
    
    // post to thingsboard
    tbPostDeviceSharedAttribute<boolean>(SMART_SOCKET_DEVICE_ID, "dataWriting", false)

}


const smartSocketManager = new DeviceScheduleManager(SMART_SOCKET_DEVICE_ID)

const checker = setInterval(
    () => {
        smartSocketManager.pushJob({
            operation: "checktimer",
        })
    }, 60000 // check every 60 seconds
)

smartSocketManager.pushJob({
    operation: "create",
    scheduleDaily: {
        name: "turnoff",
        id: "",
        control: "turnoff",
        hour: 17,
        minute: 5,
        second: 0,
        incoming: 0
    }
})

smartSocketManager.onScheduledTimeCome("turnoff",() => {
    
    tbPostDeviceSharedAttribute(SMART_SOCKET_DEVICE_ID, "dataWriting", false)

})
