import React from 'react';
import ReactDOM from 'react-dom';
import App from './App';
import './index.css';
import {CookiesProvider} from "react-cookie";
import {store} from "./reducers";
import {Provider} from "react-redux";

ReactDOM.render(
    <Provider store={store}>
        <CookiesProvider>
            <App/>
        </CookiesProvider>
    </Provider>,
    document.getElementById('root')
);