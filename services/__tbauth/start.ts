import { __env } from "./__env";
import { __Log, __LogE, __LogSuccess } from "./__TBAuthLog";
import { Auth } from "./Auth";


export const DEFAULT_TIME_INTERVAL = 1000; // 1 second

let started = false; // if service is started

const _start: (timeInterval?: number) => void = (timeInterval) => {

    if (started) {
        __LogE("Service is already started");
    }

    if (!__env.username || !__env.password) {
        __Log("Username and password not found in .env")
    } 


   

    const interval = setInterval(async () => {

        if (Auth.shouldDoLogin()) { // should do login

        __Log("Logging in for you ...");

          const result = await Auth.login( // login
                __env.username,
                __env.password
            )



            // check if error when logi
            if (result.error) {

                __LogE("Cannot login, check your username, password or thingsboard server");

                clearInterval(interval);

                return ; 
            }

            __LogSuccess("Login successfully.")

        } else if (Auth.shouldDoRefreshToken()) { // if shouldnt login but refresh token

            __Log("Refresh token for you...");

            const ret = await Auth.doRefreshToken();

            if (ret.error) {
                __LogE("Cannot refresh token, may be because of the TB server.");

                clearInterval(interval);

                return;

            }

            __LogSuccess("Refresh token successfully")
            
        } 

            
        if (!started) { started = true;}


    },(timeInterval)? timeInterval:  DEFAULT_TIME_INTERVAL)
} 