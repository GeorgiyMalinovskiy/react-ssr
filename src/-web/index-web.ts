import { createElement } from 'react';
import ReactDOM from 'react-dom';
import { BrowserRouter as Router } from 'react-router-dom';
import { loadableReady } from '@loadable/component';

import createStore from 'store';
import sagaMiddleware, { runSaga } from 'store/middleware/saga';
import { isPreloadedStatePresent, isRDExtenstionPresent } from 'store/state';

import Root from './Root';

const { NODE_ENV } = process.env;
const IS_PROD = NODE_ENV === 'production';

type ModuleHot = NodeModule & {
  hot: { accept: () => void };
}

const isModuleHot = (
  arg: NodeModule | ModuleHot,
): arg is ModuleHot => (
  'hot' in arg
);

if (isModuleHot(module)) {
  module.hot.accept();
}

let preloadedState;
if (isPreloadedStatePresent(window)) {
  preloadedState = window.__PRELOADED_STATE__;
}

let enhancers;
if (isRDExtenstionPresent(window)) {
  enhancers = [window.__REDUX_DEVTOOLS_EXTENSION__()];
}

// TODO add offline support https://medium.com/@addyosmani/progressive-web-apps-with-react-js-part-3-offline-support-and-network-resilience-c84db889162c
const store = createStore(
  preloadedState,
  enhancers,
  [sagaMiddleware],
);

runSaga();

const rootProps = {
  store,
  Router,
};

const renderRoot = (): void => {
  ReactDOM[
    process.env.NODE_ENV === 'production'
      ? 'hydrate'
      : 'render'
  ](
    createElement(Root, rootProps),
    document.getElementById('root'),
  );
};

if (IS_PROD) {
  loadableReady(renderRoot);
} else {
  renderRoot();
}
