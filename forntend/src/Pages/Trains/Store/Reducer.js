import { seedTrains } from "../../../Common/seedData";

const trainsInit = { list: seedTrains };

export const trainsReducer = (state = trainsInit, action) => {
  switch (action.type) {
    case "ADD_TRAIN":
      return { ...state, list: [...state.list, action.payload] };
    case "REMOVE_TRAIN":
      return { ...state, list: state.list.filter((t) => t.id !== action.payload) };
    default:
      return state;
  }
};

const searchInit = {
  criteria: null,
  results: [],
};

export const searchReducer = (state = searchInit, action) => {
  switch (action.type) {
    case "SEARCH_TRAINS_SUCCESS":
      return { ...state, criteria: action.payload.criteria, results: action.payload.results };
    default:
      return state;
  }
};


let initialValues = {
    error: false,
    user: null,
    errMsg: ""
}

export const getTrainsListReducer = (state = initialValues, action) => {
    switch (action.type) {
        case "GET_TRAINS_LIST":
            // if(action){
            return state = {
                ...state,
                user: action.payload.data,
                error: false,
                errMsg: ""
            }
        // }
        case "SETERR":
            return state = {
                ...state,
                user: null,
                error: true,
                errMsg: action.payload.data.message?.[0]?.description
            }
        default:
            return state
    }
};
export const getTrainsSearchReducer = (state = initialValues, action) => {
    switch (action.type) {
        case "GET_TRAINS_SEARCH":
            // if(action){
            return state = {
                ...state,
                user: action.payload.data,
                error: false,
                errMsg: ""
            }
        // }
        case "SETERR":
            return state = {
                ...state,
                user: null,
                error: true,
                errMsg: action.payload.data.message?.[0]?.description
            }
        default:
            return state
    }
};
