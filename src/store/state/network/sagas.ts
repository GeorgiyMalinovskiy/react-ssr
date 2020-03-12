import {
  call,
  put,
  takeEvery,
  takeLatest,
} from 'redux-saga/effects';

import {
  fetchAPI,
  REQUEST,
  setRequest,
  setRequestSuccess,
  setRequestFailure,
} from '.';

function* request(action: ReturnType<typeof setRequest>) {
  try {
    const result = yield call(fetchAPI, action.payload);
    yield put(setRequestSuccess(action.payload, result));
  } catch (error) {
    yield put(setRequestFailure({
      ...action.payload,
      statusText: error.message,
    }));
  }
}

export default function* () {
  yield takeEvery(REQUEST.FETCHING, request);
}
