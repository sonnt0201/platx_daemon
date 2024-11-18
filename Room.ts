import axios from 'axios';

import net from 'net';

import { doNothing } from './utils';
import { Constants } from './constants';



/**
   * Room is a tcp message-handler model, specifically designed for IoT Platfrom project.
   * Room do authentication first to check if device token is valid, then upgrade the connection if auth is successful.
**/
export class Room {

    private _socket: net.Socket
    private _upgrade: boolean = false
    private _incomingDataFormat: "bin" | "json" = "json"
    private _deviceToken: string = ""
    private _messageHandler: (msg: Object) => void = doNothing;


    constructor(socket: net.Socket, callback: (msg: Object) => void) {
        this._socket = socket;

        this._socket.on("data", (data: Buffer) => {

            // if first messsage, not verified
            if (!this._upgrade) {
                let firstMsg = data

                while (firstMsg[firstMsg.length - 1] < 32) {
                    firstMsg = firstMsg.slice(0, firstMsg.length - 1);
                }
                // first msg has format `${device_token}/${json | bin}`
                this._verifySocket(firstMsg.toString()).then((auth) => {

                    if (auth.valid === true && auth.format && auth.token) {

                        this._messageHandler = callback;
                        this._doUpgrade({
                            token: auth.token,
                            format: auth.format,
                        });



                    } else {
                        this._handleAuthFail(firstMsg.toString());
                    }

                }).catch((_) => {
                    this._handleAuthFail(firstMsg.toString());
                })



            }


            // if verified, msg is a folowing message
            this._socket.on("error", (e: Error) => {
                console.error(e.message);
            })
        })

    }

    public get deviceToken() {
        return this._deviceToken
    }

    // onMessage(callback: (msg: IJsonTelementry) => void) {

    // }

    /** Call at the first msg received to verify device token
    * if verification succeeds, upgrade the connection
    * return true with token & format if verification succeeded, false otherwise
    **/
    private async _verifySocket(firstMsg: string): Promise<{
        valid: boolean,
        token?: string,
        format?: "bin" | "json"
    }> {

        try {



            if (firstMsg.length > 0 && firstMsg[0] === '/') firstMsg = firstMsg.slice(1)
            const chunks = firstMsg.split(`/`);
            if (chunks.length !== 2) return {
                valid: false

            }

            const token = chunks[0];
            const format = chunks[1];

            console.log("on auth: ", {
                token,
                format
            })

            if (format !== 'json' && format !== "bin") return { valid: false };

            const url = process.env.THINGSBOARD_HOST + `/api/v1/${token}/telemetry`;
          
            //  connect to thingsboard server to verify device token
            const res = await axios.post(url, {})


            if (res.status !== 200) {
                console.log("not ok")
                return { valid: false };

            }
            return {
                valid: true,
                token: token,
                format: format
            };
        } catch (e) {
            console.error((e as Error).message)
            return {
                valid: false
            }
        }

    }


    private _doUpgrade(auth: {
        token: string,
        format: "bin" | "json"
    }) {
        this._deviceToken = auth.token;
        this._incomingDataFormat = auth.format

        this._upgrade = true;

        this._socket.write(Constants.GWReturnStatus.UPGRADED, () => {

            // When upgraded
            console.log(`\n\x1b[32m` + JSON.stringify({
                startTs: Date.now(),
                client: this._socket.address,
                deviceToken: this._deviceToken,
                format: this._incomingDataFormat
            }) + '\x1b[0m')
            
            this._socket.on('error', () => {
                this._closeSocket();
            })

            this._socket.on('close', () => {
                console.log("Client left the room: ", {
                    clientAddress: this._socket.remoteAddress + ":" + this._socket.remotePort
                })
            })

            // bind message handler
            this._socket.removeAllListeners('data')
            this._socket.on('data', (data: Buffer) => {
               

                // json payload
                if (this._incomingDataFormat === 'json') {
                    try {
                        let obj = JSON.parse(data.toString())

                      
                            this._messageHandler(obj);
                      

                    } catch (e) {

                        this._closeSocket((e as Error).message)
                    }
                }

                //TO-DO: bin payload
                if (this._incomingDataFormat === 'bin') doNothing();
            })




        }); // upgrading done



    }



    private _handleAuthFail(msg: string) {
        try {
            this._socket.end(Constants.GWReturnStatus.AUTH_FAILED, () => {
                console.error("Auth failed: ", {
                    client: this._socket.remoteAddress + ":" + this._socket.remotePort,
                    path: msg.toString(),
                })
            })

            this._socket.destroy();
        } catch (e) {
            console.error((e as Error).message);

        }


    }



    private _closeSocket(msg?: string) {
        try {
            this._socket.end(Constants.GWReturnStatus.WRONG_FORMAT, () => {
                console.error("Wrong format: ", {
                    client: this._socket.remoteAddress + ":" + this._socket.remotePort,
                    msg: msg?.toString(),
                })
            })

            this._socket.destroy();
        } catch (e) {
            console.error((e as Error).message);

        }
    }

}