import { postWithAuth } from '../__tbauth';
import { __Log } from './__SchedulerLog';
import { tbPostDeviceSharedAttribute } from './_TBAPIsClient';
import { UserConfig } from './interface';


/**
 * Exposed configs for user
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

                        postWithAuth("/api/rpc/oneway/b7ca6200-ab97-11ef-89ae-b1b32c7b1fa7", {
                            "method": "setState",
                            "params": false,
                            "persistent": false,
                            "timeout": 5000
                        })

                    }


                },

                {
                    control: "load-on",
                    action: async () => {

                        postWithAuth("/api/rpc/oneway/b7ca6200-ab97-11ef-89ae-b1b32c7b1fa7", {
                            "method": "setState",
                            "params": true,
                            "persistent": false,
                            "timeout": 5000
                        })

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