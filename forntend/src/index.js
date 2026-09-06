import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './App';
import reportWebVitals from './reportWebVitals';
import { Provider } from 'react-redux'
import { Store } from './MainStore/Store';
import { HashRouter } from 'react-router-dom';
import "bootstrap/dist/css/bootstrap.min.css";
import "./style.css";

const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(
    <HashRouter>
    <Provider store={Store}>
    <App />
    </Provider>
    </HashRouter>
);

reportWebVitals();
