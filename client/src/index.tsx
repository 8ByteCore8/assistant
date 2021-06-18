import React from 'react';
import ReactDOM from 'react-dom';
import App from './App';
import './index.css';
import {CookiesProvider} from "react-cookie";
import {store} from "./reducers";
import {Provider} from "react-redux";
import {BrowserRouter as Router} from "react-router-dom";

ReactDOM.render(
    <Provider store={store}>
        <CookiesProvider>
            <Router>
                <App/>
            </Router>
        </CookiesProvider>
    </Provider>,
    document.getElementById('root')
);