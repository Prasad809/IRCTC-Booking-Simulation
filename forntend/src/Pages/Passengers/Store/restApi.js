import axios from "../../../Common/InterCeptors";
const headers = {
  'Content-Type': 'application/json'
}

export const addPasnger=(creds)=>{
  return axios.post('/passenger/aPsMst',creds,{ headers });
};

export const removePasnger=(creds)=>{
  return axios.post('/passenger/rPsMst',creds,{ headers });
};

export const getPasngers=(creds)=>{
  return axios.post('/passenger/gPsMst',creds,{ headers });
};

export const getGenders=(creds)=>{
  return axios.get('/gnds',creds,{ headers });
};

export const getBreths=(creds)=>{
  return axios.get('/trnBrt',creds,{ headers });
};