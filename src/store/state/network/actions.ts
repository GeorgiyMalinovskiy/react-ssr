import {
  REQUEST,
  REMOVE_REQUEST,
  NETWORK,
  RequestPayload,
  ResponsePayload,
} from './utils';

export const setRequest = (payload: RequestPayload) => ({
  type: REQUEST.FETCHING,
  payload,
} as const);

export const removeRequest = (url: string) => ({
  type: REMOVE_REQUEST,
  url,
} as const);

export const setRequestSuccess = (
  payload: ResponsePayload,
  result: unknown,
) => ({
  type: REQUEST.SUCCESS,
  payload,
  result,
} as const);

export const setRequestFailure = (payload: ResponsePayload) => ({
  type: REQUEST.FAILURE,
  payload,
} as const);

export const setNetworkPending = () => ({
  type: NETWORK.PENDING,
} as const);

export const setNetworkOnline = () => ({
  type: NETWORK.ONLINE,
} as const);

export const setNetworkOffline = () => ({
  type: NETWORK.OFFLINE,
} as const);
