import { auth, logout, register } from "./restApi";

export const authAction = (creds) => {
    return async (dispatch) => {
        try {
            const authRes = await auth(creds);
            return dispatch({
                type: "LOGIN",
                payload: authRes
            });
        }
        catch (error) {
            dispatch({
                type: "LOGIN",
                payload: error?.message || null
            });
        }
    }
};
export const registerAction = (creds) => {
    return async (dispatch) => {
        try {
            const registerRes = await register(creds);
            return dispatch({
                type: "SIGNUP",
                payload: registerRes
            });
        }
        catch (error) {
            dispatch({
                type: "SIGNUP",
                payload: error?.message || null
            });
        }
    }
};
export const logoutAction = (creds) => {
    return async (dispatch) => {
        try {
            const registerRes = await logout(creds);
            return dispatch({
                type: "LOGOUT",
                payload: registerRes
            });
        }
        catch (error) {
            dispatch({
                type: "LOGOUT",
                payload: error?.message || null
            });
        }
    }
};