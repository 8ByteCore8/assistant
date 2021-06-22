import {combineReducers} from "redux";
import {createStore, applyMiddleware} from "redux";
import userReducer from "./userReducer";
import projectReducer from "./projectReducer";
import { composeWithDevTools } from 'redux-devtools-extension';
import thunk from "redux-thunk";

const rootReducer = combineReducers({
    user: userReducer,
    projects: projectReducer,
});

export const store = createStore(rootReducer, composeWithDevTools(applyMiddleware(thunk)));