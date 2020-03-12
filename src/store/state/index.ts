import { combineReducers, StoreEnhancer } from 'redux';

import resources from './resources';
import network from './network';

export const rootReducer = combineReducers({ resources, network });
export type RootState = ReturnType<typeof rootReducer>;

type WindowWithPreloadedState = Window & {
  __PRELOADED_STATE__: RootState;
}

export const isPreloadedStatePresent = (
  arg: Window | WindowWithPreloadedState,
): arg is WindowWithPreloadedState => (
  '__PRELOADED_STATE__' in arg
);

type WindowWithDevTools = Window & {
  __REDUX_DEVTOOLS_EXTENSION__: () => StoreEnhancer<RootState, {}>;
}

export const isRDExtenstionPresent = (
  arg: Window | WindowWithDevTools,
): arg is WindowWithDevTools => (
  '__REDUX_DEVTOOLS_EXTENSION__' in arg
);
