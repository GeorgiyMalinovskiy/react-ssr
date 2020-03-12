import { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useRouteMatch, generatePath } from 'react-router';

import {
  setRequest,
  removeRequest,
  REQUEST,
  Request,
  RequestPayload,
} from 'store/state/network';
import { getRequest } from 'store/state/network/selectors';

export const useRequest = ({
  payload = {},
  fetchOnMount = true,
  removeOnUnmount = false,
}: {
  payload?: Partial<RequestPayload>;
  fetchOnMount?: boolean;
  removeOnUnmount?: boolean;
  displayError?: boolean;
} = {}): {
  isLoading: boolean;
  error: string | null;
  request: Request | null;
} => {
  const match = useRouteMatch();
  const requestPayload: RequestPayload = {
    method: 'get',
    ...match,
    ...payload,
  };

  const url = requestPayload.url
  || generatePath(requestPayload.path, requestPayload.params || {});
  const request = useSelector(getRequest(url));
  const isLoaded = request?.status === REQUEST.SUCCESS;

  const dispatch = useDispatch();
  useEffect(() => {
    if (fetchOnMount && !isLoaded) dispatch(setRequest(requestPayload));
    return () => {
      if (removeOnUnmount) dispatch(removeRequest(url));
    };
  }, [fetchOnMount, removeOnUnmount]);

  const isLoading = request?.status === REQUEST.FETCHING;
  const error = request?.status === REQUEST.FAILURE
    ? request.statusText || `Request error for: ${url}`
    : null;

  return { isLoading, error, request };
};
