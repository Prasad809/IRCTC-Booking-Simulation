let initialValues = {
    error: false,
    user: null,
    errMsg: ""
}

export const getUserReducer = (state = initialValues, action) => {
    switch (action.type) {
        case "GET_USER":
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

export const updateUserReducer = (state = initialValues, action) => {
    switch (action.type) {
        case "UPDATE_USER":
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