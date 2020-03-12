import {
  compose,
  createStore,
  applyMiddleware,
  AnyAction,
  Dispatch,
  Middleware,
  PreloadedState,
  Store,
  StoreEnhancer,
} from 'redux';

import { RootState, rootReducer } from './state';

export default (
  preloadedState?: PreloadedState<RootState> | undefined,
  enhancers?: StoreEnhancer<RootState>[],
  middlewares?: Middleware<unknown, RootState, Dispatch<AnyAction>>[],
): Store<RootState> => {
  let middlewareEnhancer;
  if (middlewares) {
    middlewareEnhancer = applyMiddleware(...middlewares);
  }

  const composedEnhancers = middlewareEnhancer && enhancers
    ? compose(
      middlewareEnhancer,
      ...enhancers,
    )
    : middlewareEnhancer;

  return createStore(
    rootReducer,
    preloadedState,
    composedEnhancers,
  );
};
