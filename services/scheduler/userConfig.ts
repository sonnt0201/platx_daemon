import { getTBToken, postWithAuth } from '../__tbauth';
import { __env } from '../__tbauth/__env';
import { __Log, __LogE } from './__SchedulerLog';
import { tbPostDeviceSharedAttribute } from './_TBAPIsClient';
import { UserConfig } from './interface';


/**
 * Exposed configs for user
 * 
 * Used for define callback function when scheduled time comes
 */
export const userConfig: UserConfig = {



    defaultDeviceConfigs: [
        {

            // Smart Socket - Dung
            id: "b7ca6200-ab97-11ef-89ae-b1b32c7b1fa7",

            eventHandler: [

                {
                    control: "off",
                    action: () => {

                        __Log("Changing the dataWriting device attribute ...")

                        tbPostDeviceSharedAttribute("b7ca6200-ab97-11ef-89ae-b1b32c7b1fa7", "dataWriting", false).then(() => {
                            __Log("Device turned off")
                        })
                    }

                },

                {
                    control: "on",
                    action: () => {

                        __Log("Changing the dataWriting device attribute to true ...")

                        tbPostDeviceSharedAttribute(
                            "b7ca6200-ab97-11ef-89ae-b1b32c7b1fa7",
                            "dataWriting",
                            true
                        ).then(() => {
                            __Log("Device turned on")
                        })
                    }

                },

                {
                    control: "load-off",
                    action: async () => {
                       
                            try {
                               await axios.post(
                                    __env.tbHost + "/api/rpc/oneway/b7ca6200-ab97-11ef-89ae-b1b32c7b1fa7",
                                    {
                                        "method": "setState",
                                        "params": false,
                                        "persistent": false
                                    },
                                    {
                                        headers: {
                                            "X-Authorization": `Bearer ${await getTBToken()}`
                                        },
                                        validateStatus: () => true // Prevent axios from throwing errors on non-2xx status
                                    }
                                ).catch((error) => {
                                    // Silently handle any error without logging it
                                    __LogE("Thingsboard server: Error happened, maybe Firmware device is not connected");
                                });
                            } catch (_) {
                                // Handle any other unexpected errors
                                __LogE("Thingsboard server: Firmware device is not connected");
                            }
                       


                    }


                },

                {
                    control: "load-on",
                    action: async () => {
                       
                            try {
                               await axios.post(
                                    __env.tbHost + "/api/rpc/oneway/b7ca6200-ab97-11ef-89ae-b1b32c7b1fa7",
                                    {
                                        "method": "setState",
                                        "params": true,
                                        "persistent": false
                                    },
                                    {
                                        headers: {
                                            "X-Authorization": `Bearer ${await getTBToken()}`
                                        },
                                        validateStatus: () => true // Prevent axios from throwing errors on non-2xx status
                                    }
                                ).catch((error) => {
                                    // Silently handle any error without logging it
                                    __LogE("Thingsboard server: Error happened, maybe Firmware device is not connected");
                                });
                            } catch (_) {
                                // Handle any other unexpected errors
                                __LogE("Thingsboard server: Firmware device is not connected");
                            }
                      


                    }

                },



            ]

        },

        {

            // PIR Array - Mung
            id: "a18623b0-9bea-11ef-a03a-b1b32c7b1fa7",

            eventHandler: [

                {
                    control: "off",
                    action: () => {

                        __Log("Changing the dataWriting device attribute ...")

                        tbPostDeviceSharedAttribute("a18623b0-9bea-11ef-a03a-b1b32c7b1fa7", "dataWriting", false).then(() => {
                            __Log("Device turned off")
                        })
                    }

                },

                {
                    control: "on",
                    action: () => {

                        __Log("Changing the dataWriting device attribute to true ...")

                        tbPostDeviceSharedAttribute(
                            "a18623b0-9bea-11ef-a03a-b1b32c7b1fa7",
                            "dataWriting",
                            true
                        ).then(() => {
                            __Log("Device turned on")
                        })
                    }

                },

            ]

        }
    ]

}