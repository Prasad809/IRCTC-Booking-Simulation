import { addTrainRoutes,removeTrainRoutes,getTrainRoutes, menuAuths, weekdays } from "./restApi";

export const addTrainRoutesAction = (creds) => {
    return async (dispatch) => {
        try {
            const addTrainRtsRes = await addTrainRoutes(creds);
            return dispatch({
                type: "ADD_TRAIN_RTS",
                payload: addTrainRtsRes
            });
        }
        catch (error) {
            dispatch({
                type: "ADD_TRAIN_RTS",
                payload: error?.message || null
            });
        }
    }
};

export const removeTrainRoutesAction = (creds) => {
    return async (dispatch) => {
        try {
            const removeTrainRtsRes = await removeTrainRoutes(creds);
            return dispatch({
                type: "REMOVE_TRAIN_RTS",
                payload: removeTrainRtsRes
            });
        }
        catch (error) {
            dispatch({
                type: "REMOVE_TRAIN_RTS",
                payload: error?.message || null
            });
        }
    }
};

export const getTrainRoutesAction = (creds) => {
    return async (dispatch) => {
        try {
            const getTrainRtsRes = await getTrainRoutes(creds);
            return dispatch({
                type: "GET_TRAIN_RTS",
                payload: getTrainRtsRes
            });
        }
        catch (error) {
            dispatch({
                type: "GET_TRAIN_RTS",
                payload: error?.message || null
            });
        }
    }
};

export const menuAuthsAction = (creds) => {
    return async (dispatch) => {
        try {
            const menuAuthsRes = await menuAuths(creds);
            return dispatch({
                type: "MENU_AUTHS",
                payload: menuAuthsRes
            });
        }
        catch (error) {
            dispatch({
                type: "MENU_AUTHS",
                payload: error?.message || null
            });
        }
    }
};

export const weekDaysAction = (creds) => {
    return async (dispatch) => {
        try {
            const weekDaysRes = await weekdays(creds);
            return dispatch({
                type: "ALL_DAYS",
                payload: weekDaysRes
            });
        }
        catch (error) {
            dispatch({
                type: "ALL_DAYS",
                payload: error?.message || null
            });
        }
    }
};
