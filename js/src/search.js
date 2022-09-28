import React from "react";
import ReactDOM from "react-dom";
import { Provider } from "react-redux";
import store from "./search/redux/store";
import App from './search/App';

ReactDOM.render(
  <Provider store={store}>
    <App />
  </Provider>,
  document.getElementById('root')
);