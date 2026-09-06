import axios from "../../../Common/InterCeptors";
const headers = {
  'Content-Type': 'application/json'
}

export const getTrainsList=(creds)=>{
  return axios.get('/trains/gTrnsLst',creds,{ headers });
};
export const getTrainsSearch=(creds)=>{
  return axios.post('/trains/gTrnsSrch',creds,{ headers });
};

