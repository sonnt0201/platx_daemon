

import colors from 'colors';


colors.enable()

const S = "\n__TBAuth: " // name of target service (with ": " postfix )

/**
 * Normal log for service
 * @param msg any msg to log
 */
export const __Log = (msg: string) => {
    console.log(
        S.blue, msg
    )
}


/**
 * log as error for service
 * @param msg any msg to log
 */
export const __LogE = (msg: string) => {
    console.log(
        S.blue, msg.red
    )


}

/**
 * Log as success for service
 * @param msg 
 */
export const __LogSuccess = (msg: string) => {
    console.log(
        S.blue, msg.green
    )


}