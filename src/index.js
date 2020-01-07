import React from "react";
import ReactDOM from "react-dom";
import { BrowserRouter } from "react-router-dom";
import { Provider } from "react-redux";
import { createStore, combineReducers, applyMiddleware, compose } from "redux";
import thunk from "redux-thunk";
import createSagaWiddleware from "redux-saga";
import "./index.css";
import App from "./App";
import * as serviceWorker from "./serviceWorker";
import burgerBuilder from "./store/reducers/burgerBuilder";
import orderReducer from "./store/reducers/order";
import auth from "./store/reducers/auth";
import { watchAuth } from "./store/sagas/index";

const composeEnhancers =
  process.env.NODE_ENV === "development" //with this redux dev tools will only be available in the development environment
    ? window.__REDUX_DEVTOOLS_EXTENSION_COMPOSE__
    : null || compose;

const rootReducer = combineReducers({
  burgerBuilder: burgerBuilder,
  order: orderReducer,
  auth: auth
});

const sagaMiddleware = createSagaWiddleware();

const store = createStore(
  rootReducer,
  composeEnhancers(applyMiddleware(thunk, sagaMiddleware))
);

sagaMiddleware.run(watchAuth);

const app = (
  <Provider store={store}>
    <BrowserRouter>
      <App />
    </BrowserRouter>
  </Provider>
);

ReactDOM.render(app, document.getElementById("root"));

// If you want your app to work offline and load faster, you can change
// unregister() to register() below. Note this comes with some pitfalls.
// Learn more about service workers: https://bit.ly/CRA-PWA
serviceWorker.unregister();
