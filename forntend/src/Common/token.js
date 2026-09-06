function token(){
    let tokens={};
    let expryTm={};
    let piData=null;
    let groupDtls={};
    let boCode="";
    let userLoginDtls={};
    let draftBookingDtls={};
    let bookingDtls={};

    const getTokens=()=>tokens;
    const getExpryTm=()=>expryTm;
    const getPiData=()=>piData;
    const getGroupDtls=()=>groupDtls;
    const getBoCode=()=>boCode;
    const getUserLoginDtls=()=>userLoginDtls;
    const getDraftBookingDtls=()=>draftBookingDtls;
    const getBookingDtls=()=>bookingDtls;

    const setTokens=(token)=>{
        tokens = token;
        return true;
    };
    const setExpryTm=(token)=>{
        expryTm = token;
        return true;
    };
    const setPiData=(token)=>{
        piData = token;
        return true;
    };
    const setGroupDtls=(token)=>{
        groupDtls = token;
        return true;
    };
    const setBoCode=(token)=>{
        boCode = token;
        return true;
    };
    const setUserLoginDtls=(token)=>{
        userLoginDtls = token;
        return true;
    };
    const setDraftBookingDtls=(token)=>{
        draftBookingDtls = token;
        return true;
    };
    const setBookingDtls=(token)=>{
        bookingDtls = token;
        return true;
    };
    return {
        setTokens,
        getTokens,
        setExpryTm,
        getExpryTm,
        getPiData,
        setPiData,
        getGroupDtls,
        setGroupDtls,
        getBoCode,
        setBoCode,
        getUserLoginDtls,
        setUserLoginDtls,
        getDraftBookingDtls,
        setDraftBookingDtls,
        getBookingDtls,
        setBookingDtls
    }
}

export default token();