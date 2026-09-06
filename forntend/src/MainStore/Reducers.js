import { combineReducers } from "redux";
import { authReducer, RegisterReducer,logoutReducer } from "../Pages/Auth/Store/Reducer";
import { addPaymentMthdsReducer, getPaymentMthdsReducer, removePaymentMthdsReducer } from "../Pages/PaymentMethods/Store/Reducer";
import { addPasngerReducer, getGendersReducer, getPasngerReducer, getTrainBerthsReducer, removePasngerReducer } from "../Pages/Passengers/Store/Reducer";
import { getTrainsListReducer,getTrainsSearchReducer } from "../Pages/Trains/Store/Reducer";
import { getUserReducer,updateUserReducer } from "../Pages/Profile/Store/Reducer";
import { bookedTktsReducer, bookingTktReducer, cancelTktsReducer, getClassesReducer, getQuotaReducer } from "../Pages/Booking/Store/Reducer";
import { menuAuthsReducer } from "../Pages/Admin/Store/Reducer";

const rootReducers = combineReducers({
  authReducer,
  RegisterReducer,
  logoutReducer,
  addPasngerReducer,
  getPasngerReducer,
  removePasngerReducer,
  getPaymentMthdsReducer,
  addPaymentMthdsReducer,
  removePaymentMthdsReducer,
  getUserReducer,
  updateUserReducer,
  getTrainsListReducer,
  getTrainsSearchReducer,
  bookingTktReducer,
  bookedTktsReducer,
  cancelTktsReducer,
  getQuotaReducer,
  getClassesReducer,
  menuAuthsReducer,
  getGendersReducer,
  getTrainBerthsReducer
});

export default rootReducers;
