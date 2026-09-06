import React from "react";
import ReactDOM from "react-dom/client";
import { Provider } from "react-redux";
import { HashRouter } from "react-router-dom";
import "bootstrap/dist/css/bootstrap.min.css";
import "./style.css";
import App from "./App";
import { Store } from "./MainStore/Store";

const root = ReactDOM.createRoot(document.getElementById("root"));
root.render(
    <Provider store={Store}>
      <HashRouter>
        <App />
      </HashRouter>
    </Provider>
);
