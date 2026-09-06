
let initialValues={
    error:false,
    user:null,
    errMsg:""
}

export const authReducer=(state=initialValues,action)=>{
    switch(action.type){
        case "LOGIN":
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

export const RegisterReducer=(state=initialValues,action)=>{
    switch(action.type){
        case "SIGNUP":
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
export const logoutReducer=(state=initialValues,action)=>{
    switch(action.type){
        case "LOGOUT":
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
