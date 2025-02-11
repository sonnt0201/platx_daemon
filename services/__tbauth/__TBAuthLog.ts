import colors from 'colors';
import path from 'path';

// Enable colors
colors.enable();
/** Service name */
const S = "__TBAuth: "; // Name of target service (with ": " postfix)

/**
 * Helper function to get the calling file path
 */
function getCallerFile(): string {
    const originalPrepareStackTrace = Error.prepareStackTrace;

    try {
        // Temporarily override prepareStackTrace to access structured stack trace
        Error.prepareStackTrace = (_, stack) => stack;

        const err = new Error();
        const stack = err.stack as unknown as NodeJS.CallSite[];

        // Stack[0] -> this function itself
        // Stack[1] -> the function (__Log, __LogE, etc.)
        // Stack[2] -> the caller of the log function
        const caller = stack[2];
        const filename = caller.getFileName();

        return filename ? path.basename(filename) : "unknown";
    } catch (error) {
        return "unknown";
    } finally {
        // Restore the original prepareStackTrace
        Error.prepareStackTrace = originalPrepareStackTrace;
    }
}

/**
 * Normal log for service
 * @param msg string  message header to log
 * @param content other information as msg body
 */
export const __Log = (msg: string, content?: any) => {
    const filename = getCallerFile();
    const currentDate = new Date().toLocaleString();
    console.log(`\n[${currentDate}]`.blue , S.blue.bold, filename.bold, msg);

    content &&  console.log(content)
};

/**
 * Log as error for service
 * @param msg string header message to log
 *  @param content other information as msg body
 */
export const __LogE = (msg: string, content?: any) => {
    const filename = getCallerFile();
    const currentDate = new Date().toLocaleString();
    console.log(`\n[${currentDate}]`.blue , S.blue.bold, filename.bold, msg.red);

   content && console.log(content)
};

/**
 * Log as success for service
 * @param msg string message to log
 *  @param content other information as msg body
 */
export const __LogSuccess = (msg: string, content?: any) => {
    const filename = getCallerFile();
    const currentDate = new Date().toLocaleString();
    console.log(`\n[${currentDate}]`.blue, S.blue.bold, filename.bold, msg.green);

    content &&  console.log(content)
};
