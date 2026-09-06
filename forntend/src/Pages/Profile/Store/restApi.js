import axios from "../../../Common/InterCeptors";
const headers = {
  'Content-Type': 'application/json'
}

export const getUser=(creds)=>{
  return axios.post('/gtUsr',creds,{ headers });
};

export const updateUser=(creds)=>{
  return axios.post('/upUsr',creds,{ headers });
};