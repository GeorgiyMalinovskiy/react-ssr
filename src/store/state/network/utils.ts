import { generatePath, match as Match } from 'react-router';
import axios, { Method } from 'axios';

export const REQUEST = {
  FETCHING: 'REQUEST_FETCHING',
  FAILURE: 'REQUEST_FAILURE',
  SUCCESS: 'REQUEST_SUCCESS',
} as const;

export const REMOVE_REQUEST = 'REMOVE_REQUEST' as const;

type RequestStatus = typeof REQUEST[keyof typeof REQUEST];

export type RequestPayload = { method?: Method } & Match;
export type ResponsePayload = { statusText?: string } & RequestPayload;
export type Request = { status: RequestStatus } & ResponsePayload;

export const NETWORK = {
  PENDING: 'NETWORK_PENDING',
  ONLINE: 'NETWORK_ONLINE',
  OFFLINE: 'NETWORK_OFFLINE',
} as const;

export type NetworkStatus = typeof NETWORK[keyof typeof NETWORK];

export interface NetworkState {
  requests: Record<string, Request> | null;
  status: NetworkStatus;
}

type WindowWithApiConfig = Window & {
  __API__: { [key: string]: string };
}

const isApiConfigPresent = (
  arg: Window | WindowWithApiConfig,
): arg is WindowWithApiConfig => (
  '__API__' in arg
);

const { API_HOST, API_PORT } = (
  typeof window !== 'undefined'
  && isApiConfigPresent(window)
)
  ? window.__API__
  : process.env;

// TODO http://www.redotheweb.com/2015/11/09/api-security.html
export const fetchAPI = async ({
  path,
  params,
  method = 'GET',
}: RequestPayload): Promise<unknown> => {
  const url = `http://${API_HOST}:${API_PORT}/api${generatePath(path, params)}`;
  const headers = {
    Accept: 'application/json',
    'Content-type': 'application/json',
  };

  const requestConfig = {
    url,
    method,
    headers,
  };

  return axios(requestConfig).then(({ status, statusText, data }) => {
    if (statusText !== 'OK') {
      throw new Error(`${status}: ${statusText}`);
    }

    return data;
  });
};
