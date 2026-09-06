let initialValues={
    error:false,
    user:null,
    errMsg:""
}

export const addPaymentMthdsReducer=(state=initialValues,action)=>{
    switch(action.type){
        case "ADD_PAY_MTDS":
            // if(action){
                return state = {
                    ...state,
                    user:action.payload.data,
                    error:false,
                    errMsg:""
                }
            // }
            case "SETERR":
                return state={
                    ...state,
                    user:null,
                    error:true,
                    errMsg:action.payload.data.message?.[0]?.description
                }
            default:
                return state
    }
};

export const removePaymentMthdsReducer=(state=initialValues,action)=>{
    switch(action.type){
        case "REMOVE_PAY_MTDS":
            // if(action){
                return state = {
                    ...state,
                    user:action.payload.data,
                    error:false,
                    errMsg:""
                }
            // }
            case "SETERR":
                return state={
                    ...state,
                    user:null,
                    error:true,
                    errMsg:action.payload.data.message?.[0]?.description
                }
            default:
                return state
    }
};

export const getPaymentMthdsReducer=(state=initialValues,action)=>{
    switch(action.type){
        case "GET_PAY_MTDS":
            // if(action){
                return state = {
                    ...state,
                    user:action.payload.data,
                    error:false,
                    errMsg:""
                }
            // }
            case "SETERR":
                return state={
                    ...state,
                    user:null,
                    error:true,
                    errMsg:action.payload.data.message?.[0]?.description
                }
            default:
                return state
    }
};

