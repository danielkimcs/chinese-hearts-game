import React from 'react';
import ReactDOM from 'react-dom';
import { Provider } from 'react-redux';
import store from './services/store';
import './index-base.css';
import './index-components.css';
import './index-utilities.css';
import App from './App';
import { downloadAssets } from './shared/assets';
import reportWebVitals from './reportWebVitals';

Promise.all([
  downloadAssets(),
]).then(() => {
  ReactDOM.render(
    <Provider store={store}>
      <App />
    </Provider>,
    document.getElementById('root')
  );
});

// If you want to start measuring performance in your app, pass a function
// to log results (for example: reportWebVitals(console.log))
// or send to an analytics endpoint. Learn more: https://bit.ly/CRA-vitals
reportWebVitals();
