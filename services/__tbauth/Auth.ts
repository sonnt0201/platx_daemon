'use client'


import axios from "axios";
import { __env } from "./__env";

const UserConstants = {
    THINGSBOARD_HOST: __env.tbHost
}


const HTTP_AUTH_HEADER = "X-Authorization"

/**
 * State include username, token and refresh token of general auth object
 * 
 */
interface IAuthState {
    username: string,
    token: string,
    refreshToken: string
}

const EMPTY_AUTH_STATE: IAuthState = {
    username: "",
    token: "",
    refreshToken: ""

}


export interface IAuth {



    state: (IAuthState | undefined),
    httpHeaderKey: string,
    login: (email: string, password: string) => Promise<
        {
            token: string | null,

            error: Error | null
        }>
    tokenInfo?: ITokenInfo
    logOut: () => void
}


export enum AuthError {
    RUN_ON_SERVERSIDE,
    UNAUTHORIZED,
    TOKEN_EXPIRED,
    UNKNOWN

}

/**
 * Token info after decoding JWT
 */
export interface ITokenInfo {

    sub: string; // Subject, typically the user email
    userId: string; // User ID
    scopes: string[]; // Array of scopes/roles
    sessionId: string; // Session ID
    exp: number; // Expiration time (Unix timestamp in seconds)
    iss: string; // Issuer
    iat: number; // Issued at time (Unix timestamp in seconds)
    enabled: boolean; // Indicates if the user is enabled
    isPublic: boolean; // Indicates if the user is public
    tenantId: string; // Tenant ID
    customerId: string; // Customer ID

}


/**
 * Perform auth operations
 * 
 * Have tools to do login, check auth and refresh token, etc..
 */
class AuthClass implements IAuth {

    // state: IAuthState = EMPTY_AUTH_STATE;
    state: IAuthState | undefined;


    get httpHeaderKey() { return HTTP_AUTH_HEADER }

    async login(email: string, password: string): Promise<
        {
            token: string | null,

            error: Error | null
        }> {
        const url = UserConstants.THINGSBOARD_HOST + "/api/auth/login"
        console.log(url)

        try {
            const res = await axios.post(url, {
                username: email,
                password: password
            })

            if (res.status === 200) {
                const data = res.data;
                // console.log(res.data);

                this.state = {
                    username: email,
                    token: data.token,
                    refreshToken: data.refreshToken
                }

                // console.log(this.state)

                return {
                    token: this.state.token,

                    error: null
                }

            } else {
                return {
                    token: null,

                    error: Error(res.status.toString())
                }
            }


        } catch (e) {
            console.log((e as Error).message);
            return {
                token: null,


                error: e as Error
            }
        }

    }

    get tokenInfo() {



        const token = this.state?.token;

        if (!token) return undefined;
        try {
            const [, payload] = token.split('.');
            const info = JSON.parse(atob(payload)) as ITokenInfo;

            return info;
        } catch (e) {
            console.error((e as Error).message);
            return undefined
        }
    }

    get refreshTokenInfo() {
        const token = this.state?.token;
        if (!token) return undefined;
        try {
            const [, payload] = token.split('.');
            const info = JSON.parse(atob(payload)) as ITokenInfo;

            return info;
        } catch (e) {
            console.error((e as Error).message);
            return undefined
        }
    }

    logOut() {
        this.state = {
            username: "",
            token: "",
            refreshToken: ""
        }

    }

    clearAuth() {
        this.state = {
            username: "",
            token: "",
            refreshToken: ""
        }
    }

    shouldDoLogin(): boolean {

        if (!this.state
            || !this.state.username
            || !this.state.token
            || !this.state.refreshToken) return true;

        if (this.isExpired(this.state.refreshToken)) return true;

        return false;


    }

    shouldDoRefreshToken(): boolean {
        return (
            this.state?.refreshToken !== undefined
            && this.state.refreshToken !== ""
            && this.isExpired(this.state.token)
            && !this.isExpired(this.state.refreshToken)
        )
    }

    async doRefreshToken(): Promise<{
        error?: AuthError,
        state?: IAuthState,
    }> {


        const refreshToken = this.state?.refreshToken
        if (!refreshToken || this.isExpired(refreshToken)) {

            return { error: AuthError.TOKEN_EXPIRED }
        }

        // do refresh
        try {
            const url = UserConstants.THINGSBOARD_HOST + `/api/auth/token`
            const res = await axios.post(url, { refreshToken: refreshToken });
            if (res.status === 200) {
                const data = res.data;
                // console.log(res.data);



                this.state = {
                    username: this.state?.username || "",
                    token: data.token,
                    refreshToken: data.refreshToken
                }

                return {
                    state: this.state
                }

            }

            //else: error handle

            return {

                error: AuthError.UNAUTHORIZED
            }
        } catch (err) {

            console.log((err as Error).message);

            return {
                error: AuthError.UNKNOWN
            }
        }


    }


    isExpired(token: string): boolean {
        const decoded = JSON.parse(atob(token.split('.')[1])); // Decode JWT payload
        const currentTime = Math.floor(Date.now() / 1000); // Current time in seconds
        return (decoded.exp - 60) < currentTime;
    }



    constructor() {
        // this.state = EMPTY_AUTH_STATE;

    }




}

// singleton instance
export const Auth = new AuthClass();
