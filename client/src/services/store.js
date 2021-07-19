import { createStore, applyMiddleware } from 'redux';
import thunk from 'redux-thunk';
import socketMiddleware from './socketMiddleware';
import rootReducer from './rootReducer';
import { composeWithDevTools } from 'redux-devtools-extension';

export default createStore(rootReducer, composeWithDevTools(applyMiddleware(thunk, socketMiddleware())));