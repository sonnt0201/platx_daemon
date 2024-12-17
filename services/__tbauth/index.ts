
/**
 * Define exposed interface of the service (exposed function, http router)
 * 
 * Have double underscore means that its the base for other services
 * 
 * Other services need auth will use this base service
 * 
 * Auth with THINGSBOARD TENANT privilede
 * 
 */



import axios from "axios";
import { __env } from "./__env";
import { __Log, __LogE, __LogSuccess } from "./__TBAuthLog";
import { Auth, ITokenInfo } from "./Auth";
// import { _start } from "./start";


// _start();


/**
 * Current auth token
 * @returns token as string
 * 
 */
export async  function getTBToken (): Promise<string> {
  

    if (Auth.shouldDoLogin()) { // should do login

        __Log("Logging in for you ...");

          const result = await Auth.login( // login
                __env.username,
                __env.password
            )



            // check if error when login
            if (result.error || !result.token) {

                __LogE("Cannot login, check your username, password or thingsboard server");

               

                return ""; 
            }

            __LogSuccess("Login successfully.")

            return result.token;

            

        } else if (Auth.shouldDoRefreshToken()) { // if shouldnt login but refresh token

            __Log("Refresh token for you...");

            const ret = await Auth.doRefreshToken();


            // in case error happens
            if (ret.error ||  !ret.state) {
                __LogE("Cannot refresh token, may be because of the TB server.");

               

                return "";

            }

            __LogSuccess("Refresh token successfully")

            return ret.state?.token
            
        } else {

            return Auth.state?.token || ""

        }
    
}

/**
 * Decoded token infos
 * @returns info as ItokenInfo object
 * 
 */
export const getTBTokenInfo: () => Promise<ITokenInfo | undefined> = async  () => {

    const info = Auth.tokenInfo;

    if (!info) __LogE("Unknown error happened with auth service")

    return info


}

/**
 * Built on top of axios
 * 
 * Send post request with Auth header to configured thingsboard server 
 * @param endpoint : endpoin only etc: /api/v1/devices
 * @param payload 
 * @param headers 
 * @returns Promise of response object
 */
export const postWithAuth = async (endpoint: string,
    payload: object,
    headers?: object
) => axios.post(
    __env.tbHost + endpoint,
    payload,

    {
        headers: {
            "X-Authorization": `Bearer ${await getTBToken()}`,
            ...headers
        }
    }
)

/**
 * Built on top of axios
 * 
 * Send post request with Auth header to configured thingsboard server 
 * @param endpoint : endpoint only etc: /api/v1/devices 
 * @param headers 
 * @returns Promise of response object
 */
export const getWithAuth = async (endpoint: string,
    headers?: object
) => axios.get(
    __env.tbHost + endpoint,
    {
        headers: {
            "X-Authorization": `Bearer ${await getTBToken()}`,
            ...headers
        }
    }
)

export const TBHost = __env.tbHost

// const checker = setInterval(() => {
//     __Log(getTBToken());
// }, 1000)


