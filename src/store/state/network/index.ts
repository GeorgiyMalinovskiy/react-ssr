import omit from 'lodash/omit';

import { InferActionTypes } from '../utils';
import {
  REQUEST,
  REMOVE_REQUEST,
  NETWORK,
  NetworkState,
} from './utils';
import * as actions from './actions';

export * from './utils';
export * from './actions';

export const initialState: NetworkState = {
  requests: null,
  status: NETWORK.PENDING,
};

export type ActionTypes = InferActionTypes<typeof actions>;

export default (
  state = initialState,
  action: ActionTypes,
): NetworkState => {
  switch (action.type) {
    case REQUEST.FETCHING:
    case REQUEST.SUCCESS:
    case REQUEST.FAILURE:
      return {
        ...state,
        requests: {
          ...state.requests,
          [action.payload.url]: {
            ...action.payload,
            status: action.type,
          },
        },
      };
    case REMOVE_REQUEST:
      return state.requests
        ? {
          ...state,
          requests: omit(state.requests, action.url),
        }
        : state;
    case NETWORK.PENDING:
    case NETWORK.ONLINE:
    case NETWORK.OFFLINE:
      return {
        ...state,
        status: action.type,
      };
    default: return state;
  }
};
