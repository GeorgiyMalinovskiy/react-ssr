import { RootState } from '..';
import { createDeepEqualSelector } from '../utils';

export const getRequests = (state: RootState) => state.network.requests;

export const getRequest = (pathname: string) => createDeepEqualSelector(
  getRequests,
  (requests) => (
    requests
      ? requests[pathname]
      : null
  ),
);
