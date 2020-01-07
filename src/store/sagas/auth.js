import axios from "axios";
import { delay } from "redux-saga/effects";
import { put, call } from "redux-saga/effects";
import * as actions from "../actions/index";

//generator
export function* logoutSaga(action) {
  // yield call([localStorage, "removeItem"], "token"); //this make this testable
  yield localStorage.removeItem("token"); //yield will execute everything synchronously
  yield localStorage.removeItem("expirationDate");
  yield localStorage.removeItem("userId");
  yield put(actions.logoutSuceed());
}

export function* checkAuthTimeoutSaga(action) {
  yield delay(action.expirationTime * 1000);
  yield put(actions.logout());
}

export function* authUserSaga(action) {
  yield put(actions.authStart());
  const authData = {
    email: action.email,
    password: action.password,
    returnSecureToken: true
  };

  let url =
    "https://identitytoolkit.googleapis.com/v1/accounts:signUp?key=AIzaSyA5HBglP7WNrrKrwbMQWTGXrca6uCgyAMo";
  if (!action.isSignup) {
    url =
      "https://identitytoolkit.googleapis.com/v1/accounts:signInWithPassword?key=AIzaSyA5HBglP7WNrrKrwbMQWTGXrca6uCgyAMo";
  }
  try {
    const res = yield axios.post(url, authData);

    const datAuth = {
      idToken: res.data.idToken,
      userId: res.data.localId
    };

    const expirationDate = yield new Date(
      new Date().getTime() + res.data.expiresIn * 1000
    );

    yield localStorage.setItem("token", res.data.idToken);
    yield localStorage.setItem("expirationDate", expirationDate);
    yield localStorage.setItem("userId", res.data.localId);
    yield put(actions.authSuccess(datAuth));
    yield put(actions.checkAuthTimeout(res.data.expiresIn));
  } catch (err) {
    yield put(actions.authFail(err.response.data.error.message));
  }
}

export function* authCheckStateSaga(action) {
  const token = yield localStorage.getItem("token");
  if (!token) {
    yield put(actions.logout());
  } else {
    const expirationDate = new Date(localStorage.getItem("expirationDate"));
    if (expirationDate <= new Date()) {
      yield put(actions.logout());
    } else {
      const userId = yield localStorage.getItem("userId");
      const authData = {
        idToken: token,
        userId: userId
      };
      yield put(actions.authSuccess(authData));
      yield put(
        actions.checkAuthTimeout(
          (expirationDate.getTime() - new Date().getTime()) / 1000
        )
      );
    }
  }
}
