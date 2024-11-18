import net from 'net';
import { Room } from './Room';
import axios from 'axios';


const server = net.createServer();

server.listen(process.env.PORT, () => {
    
    console.log('Listening on port ' + process.env.PORT);
})

server.on('connection', (sock: net.Socket) => {
    // console.log('CONNECTED: ' + sock.remoteAddress + ':' + sock.remotePort)

    try {
        const room = new Room(sock, async (msg) => {
            console.log({
                room: room.deviceToken,
                msg: msg
            })

            try {
                const url = process.env.THINGSBOARD_HOST + `/api/v1/${room.deviceToken}/telemetry`
                 const res = await axios.post(url, msg)
                    console.log("Post telemetry stutus: ", res.status)
            } catch(e) {
                console.log((e as Error).message)
            }
           
           

        });


    } catch (err) {
        console.error((err as Error).message)
        sock.end("goodbye")
        sock.destroy();
    }



})