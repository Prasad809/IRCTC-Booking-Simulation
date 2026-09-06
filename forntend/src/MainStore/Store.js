import { applyMiddleware, createStore } from "redux";
import { thunk } from "redux-thunk";
import rootReducers from "./Reducers";


export const Store = createStore(rootReducers,applyMiddleware(thunk));

