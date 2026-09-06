import { genId, dayNameFromDate } from "../../../Common/utils";
import { getTrainsList,getTrainsSearch } from "./restApi";

const delay = (ms = 350) => new Promise((res) => setTimeout(res, ms));

export const searchTrainsAction = (criteria) => {
  return async (dispatch, getState) => {
    await delay();
    const { trainsReducer } = getState();
    const day = dayNameFromDate(criteria.date);
    const results = trainsReducer.list.filter(
      (t) =>
        t.source.toLowerCase() === criteria.source.toLowerCase() &&
        t.destination.toLowerCase() === criteria.destination.toLowerCase() &&
        t.runDays.includes(day)
    );
    dispatch({ type: "SEARCH_TRAINS_SUCCESS", payload: { criteria, results } });
    return results;
  };
};

export const addTrainAction = (trainData) => {
  return (dispatch) => {
    const train = {
      id: genId("TRN"),
      ...trainData,
    };
    dispatch({ type: "ADD_TRAIN", payload: train });
    return train;
  };
};

export const removeTrainAction = (trainId) => ({
  type: "REMOVE_TRAIN",
  payload: trainId,
});



export const getTrainsListAct = (creds) => {
    return async (dispatch) => {
        try {
            const getTrainsListRes = await getTrainsList(creds);
            return dispatch({
                type: "GET_TRAINS_LIST",
                payload: getTrainsListRes
            });
        }
        catch (error) {
            dispatch({
                type: "GET_TRAINS_LIST",
                payload: error?.message || null
            });
        }
    }
};
export const getTrainsSearchAct = (creds) => {
    return async (dispatch) => {
        try {
            const getTrainsSearchRes = await getTrainsSearch(creds);
            return dispatch({
                type: "GET_TRAINS_SEARCH",
                payload: getTrainsSearchRes
            });
        }
        catch (error) {
            dispatch({
                type: "GET_TRAINS_SEARCH",
                payload: error?.message || null
            });
        }
    }
};