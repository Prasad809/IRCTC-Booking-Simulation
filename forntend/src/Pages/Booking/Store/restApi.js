import axios from "../../../Common/InterCeptors";
const headers = {
  'Content-Type': 'application/json'
}

export const bookingTickets =(creds)=>{
  return axios.post('/bookings/cnfmTkt',creds,{ headers });
};

export const getBookingTickets =(creds)=>{
  return axios.post('/bookings/gtBkTkt',creds,{ headers });
};

export const cancelBookedTkt =(creds)=>{
  return axios.post('/bookings/cnclBkTkt',creds,{ headers });
};

export const getQuotas =(creds)=>{
  return axios.get('/trnQta',creds,{ headers });
};

export const getClasses =(creds)=>{
  return axios.get('/trnCls',creds,{ headers });
};
