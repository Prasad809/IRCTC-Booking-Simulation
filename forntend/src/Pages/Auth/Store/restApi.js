import axios from "../../../Common/InterCeptors";
const headers = {
  'Content-Type': 'application/json'
}

export const auth =(creds)=>{
  return axios.post('/auth',creds,{ headers });
};
export const register =(creds)=>{
  return axios.post('/signUp',creds,{ headers });
};
export const logout =(creds)=>{
  return axios.post('/logout',creds,{ headers });
};