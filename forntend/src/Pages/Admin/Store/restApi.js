import axios from "../../../Common/InterCeptors";
const headers = {
  'Content-Type': 'application/json'
}

export const addTrainRoutes=(creds)=>{
  return axios.post('/trains/cTrnRts',creds,{ headers });
};

export const getTrainRoutes=(creds)=>{
  return axios.post('/trains/gTrnRts',creds,{ headers });
};

export const removeTrainRoutes=(creds)=>{
  return axios.post('/trains/rTrnRts',creds,{ headers });
};

export const menuAuths=(creds)=>{
  return axios.post('/mnAuth',creds,{ headers });
};
export const weekdays=(creds)=>{
  return axios.get('/days',creds,{ headers });
};