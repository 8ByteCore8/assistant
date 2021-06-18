import React from 'react';
import ReactDOM from 'react-dom';
import {CookiesProvider} from "react-cookie";
import {Provider} from "react-redux";
import {BrowserRouter as Router} from "react-router-dom";

import './index.css';
import 'bootstrap/dist/css/bootstrap.min.css';
import App from './App';
import {store} from "./reducers";

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