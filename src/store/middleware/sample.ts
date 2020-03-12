/* eslint-disable */

import { Middleware, MiddlewareAPI } from 'redux';

import { ActionTypes } from 'store/state/network';

const sampleMiddleware = (): Middleware => {
  const middleware: Middleware = (
    { dispatch }: MiddlewareAPI,
  ) => (next) => (
    action: ActionTypes,
  ): void => {
    next(action);
  };

  return middleware;
};

export default sampleMiddleware();
