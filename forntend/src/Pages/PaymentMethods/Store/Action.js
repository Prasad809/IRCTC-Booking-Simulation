import { addPaymentMthds,removePaymentMthds,getPaymentMthds } from "./restApi";

export const addPaymentMthdsAction = (creds) => {
    return async (dispatch) => {
        try {
            const addPayMthsRes = await addPaymentMthds(creds);
            return dispatch({
                type: "ADD_PAY_MTDS",
                payload: addPayMthsRes
            });
        }
        catch (error) {
            dispatch({
                type: "ADD_PAY_MTDS",
                payload: error?.message || null
            });
        }
    }
};

export const removePaymentMthdsAction = (creds) => {
    return async (dispatch) => {
        try {
            const removePayMthsRes = await removePaymentMthds(creds);
            return dispatch({
                type: "REMOVE_PAY_MTDS",
                payload: removePayMthsRes
            });
        }
        catch (error) {
            dispatch({
                type: "REMOVE_PAY_MTDS",
                payload: error?.message || null
            });
        }
    }
};

export const getPaymentMthdsAction = (creds) => {
    return async (dispatch) => {
        try {
            const getPayMthsRes = await getPaymentMthds(creds);
            return dispatch({
                type: "GET_PAY_MTDS",
                payload: getPayMthsRes
            });
        }
        catch (error) {
            dispatch({
                type: "GET_PAY_MTDS",
                payload: error?.message || null
            });
        }
    }
};
