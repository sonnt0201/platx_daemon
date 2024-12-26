

import  express from "express";
import { SchedulerRouter } from "./services/scheduler";
import http from "http";
import { __Log, __LogSuccess } from "./DaemonLog";

import cors from 'cors';


const HTTP_API_PORT = process.env.HTTP_API_PORT || 1212

/**
 * Expose http APIs from all services 
 */
const MasterHttpApp = express();

// Middleware to parse JSON requests
MasterHttpApp.use(express.json());

/**
 * remove CORS
 */
MasterHttpApp.use(cors({ origin: '*' })); 

MasterHttpApp.use("/",SchedulerRouter);




// create http server
const httpMasterServer = http.createServer(MasterHttpApp);

// run master http server
httpMasterServer.listen(HTTP_API_PORT, () => {
    __LogSuccess(`Server is running on http://localhost:${HTTP_API_PORT}`)
})

