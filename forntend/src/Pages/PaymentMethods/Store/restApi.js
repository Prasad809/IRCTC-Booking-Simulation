import axios from "../../../Common/InterCeptors";
const headers = {
  'Content-Type': 'application/json'
}

export const addPaymentMthds=(creds)=>{
  return axios.post('/payments/addpayMthds',creds,{ headers });
};

export const removePaymentMthds=(creds)=>{
  return axios.post('/payments/rempayMthds',creds,{ headers });
};

export const getPaymentMthds=(creds)=>{
  return axios.post('/payments/getMthds',creds,{ headers });
};