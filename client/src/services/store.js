import { createStore, applyMiddleware } from 'redux';
import thunk from 'redux-thunk';
import socketMiddleware from './socketMiddleware';
import rootReducer from './rootReducer';
import { composeWithDevTools } from 'redux-devtools-extension';

const DEVELOPMENT_MODE = false;

let store;
if (DEVELOPMENT_MODE) {
    store = createStore(rootReducer, composeWithDevTools(applyMiddleware(thunk, socketMiddleware())));
} else {
    store = createStore(rootReducer, applyMiddleware(thunk, socketMiddleware()));
}

export default store;
