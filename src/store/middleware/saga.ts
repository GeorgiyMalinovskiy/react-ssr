import createSagaMiddleware from 'redux-saga';

import networkSaga from '../state/network/sagas';

const sagaMiddleware = createSagaMiddleware();

export const runSaga = () => sagaMiddleware.run(networkSaga);
export default sagaMiddleware;
