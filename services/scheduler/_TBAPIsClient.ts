import { getWithAuth, postWithAuth, TBHost } from "../__tbauth";
import { __Log, __LogE } from "./__SchedulerLog";

import { ISchedule, SchedulesAttributeKey } from "./interface";

import colors from 'colors';

/**
 * Retrieves a shared attribute for a specific device from ThingsBoard.
 * Build on top of __tbauth `getWithAuth`
 * @param deviceId - The unique ID of the device.
 * @param key - The key for the shared attribute to fetch.
 * @returns A promise that resolves with the attribute data.
 */
export const tbGetDeviceSharedAttribute = (deviceId: string, key: string) => {
    // Define the endpoint to fetch the shared attribute for the device
    const endpoint = '/api/plugins/telemetry/DEVICE/' + deviceId + '/values/attributes/SHARED_SCOPE';

    // Perform an authenticated GET request with the provided key as a query parameter
    return getWithAuth(endpoint + '?keys=' + key);
};

/**
 * Updates a shared attribute for a specific device on ThingsBoard.
 * Build on top of __tbauth `postWithAuth`
 * @template T - The type of the value being sent.
 * @param deviceId - The unique ID of the device.
 * @param key - The key for the shared attribute to update.
 * @param value - The value to assign to the shared attribute.
 * @returns A promise that resolves when the update is complete.
 */
export const tbPostDeviceSharedAttribute = <T>(deviceId: string, key: string, value: T) => {
    // Define the endpoint to update the shared attribute for the device
    const endpoint = `/api/plugins/telemetry/DEVICE/${deviceId}/SHARED_SCOPE`;

    // Create the payload object dynamically with the key and value
    const payload: { [index: string]: T } = {};
    payload[key] = value;

    // Perform an authenticated POST request with the payload
    return postWithAuth(endpoint, payload);
};







/**
 * Fetches the daily schedules for a specific device.
 * build on top of `tbGetDeviceSharedAttribute`
 * @param deviceId - The unique ID of the device.
 * @returns A promise that resolves with an array of IScheduleDaily objects.
 */
export const getSchedulesList: (deviceId: string) => Promise<ISchedule[]> = async (id) => {


    try {
        // Retrieve the shared attribute for daily schedules
        const res = await tbGetDeviceSharedAttribute(id, SchedulesAttributeKey) as { data: { [key: string]: any }[] };

        // Validate the response to ensure it contains the expected data
        if (!res || !res.data || !res.data[0].value) return [];

        // If the value is already an array, return it directly
        if (Array.isArray(res.data[0].value)) return res.data[0].value;

        // If the value is a JSON string that represents an array, parse and return it
        if (Array.isArray(JSON.parse(res.data[0].value))) return JSON.parse(res.data[0].value);

        return [];

    } catch (e) {

        __LogE("getSchedulesList".bold +   (e as Error).message)

        // Return an empty array if no valid data is found
        return [];
    }


};




export const postSchedulesList: (deviceId: string, list: ISchedule[]) => Promise<number> = async (deviceId, list) => {


    try {
          const res = await tbPostDeviceSharedAttribute(deviceId,SchedulesAttributeKey, list);

          return res?.status? res.status : -1

    } catch (e) {
        
        __LogE((e as Error).message)

        return -1
    }


}

