import { Store } from 'redux';
import { BrowserRouter, StaticRouter } from 'react-router-dom';

import { RootState } from 'store/state';

export interface Root {
  store: Store<RootState>;
  Router: typeof BrowserRouter & typeof StaticRouter;
}
