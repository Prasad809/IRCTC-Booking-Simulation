import { addPasnger,removePasnger,getPasngers, getGenders, getBreths } from "./restApi";

export const addPasngerAction = (creds) => {
    return async (dispatch) => {
        try {
            const addPasngerRes = await addPasnger(creds);
            return dispatch({
                type: "ADD_PASSGER",
                payload: addPasngerRes
            });
        }
        catch (error) {
            dispatch({
                type: "ADD_PASSGER",
                payload: error?.message || null
            });
        }
    }
};

export const removePasngerAction = (creds) => {
    return async (dispatch) => {
        try {
            const removePasngerRes = await removePasnger(creds);
            return dispatch({
                type: "REMOVE_PASSGER",
                payload: removePasngerRes
            });
        }
        catch (error) {
            dispatch({
                type: "REMOVE_PASSGER",
                payload: error?.message || null
            });
        }
    }
};

export const getPasngerAction = (creds) => {
    return async (dispatch) => {
        try {
            const getPasngerRes = await getPasngers(creds);
            return dispatch({
                type: "GET_PASSGERS",
                payload: getPasngerRes
            });
        }
        catch (error) {
            dispatch({
                type: "GET_PASSGERS",
                payload: error?.message || null
            });
        }
    }
};

export const getGendersAction = (creds) => {
    return async (dispatch) => {
        try {
            const getGendersRes = await getGenders(creds);
            return dispatch({
                type: "GET_GENDERS",
                payload: getGendersRes
            });
        }
        catch (error) {
            dispatch({
                type: "GET_GENDERS",
                payload: error?.message || null
            });
        }
    }
};

export const getTrainBerthsAction = (creds) => {
    return async (dispatch) => {
        try {
            const getTrainBerthsRes = await getBreths(creds);
            return dispatch({
                type: "GET_TRAIN_BERTHS",
                payload: getTrainBerthsRes
            });
        }
        catch (error) {
            dispatch({
                type: "GET_TRAIN_BERTHS",
                payload: error?.message || null
            });
        }
    }
};
