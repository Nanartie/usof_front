import { createStore, combineReducers, applyMiddleware } from "redux";
import { composeWithDevTools } from 'redux-devtools-extension';
import thunk from "redux-thunk";

import verifyAuth from "../reducers/verifyAuth";

const rootReducer = combineReducers({
    auth: verifyAuth
});

export const store = createStore(
    rootReducer, 
    composeWithDevTools(applyMiddleware(thunk))
);