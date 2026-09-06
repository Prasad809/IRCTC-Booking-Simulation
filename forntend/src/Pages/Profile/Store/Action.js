import { getUser,updateUser } from "./restApi";

export const getUserDtlsAct = (creds) => {
    return async (dispatch) => {
        try {
            const getUserRes = await getUser(creds);
            return dispatch({
                type: "GET_USER",
                payload: getUserRes
            });
        }
        catch (error) {
            dispatch({
                type: "GET_USER",
                payload: error?.message || null
            });
        }
    }
};

export const UpdateUserAct = (creds) => {
    return async (dispatch) => {
        try {
            const updateUserRes = await updateUser(creds);
            return dispatch({
                type: "UPDATE_USER",
                payload: updateUserRes
            });
        }
        catch (error) {
            dispatch({
                type: "UPDATE_USER",
                payload: error?.message || null
            });
        }
    }
};