
import { RootState } from '..';
import { createDeepEqualSelector } from '../utils';

import { Resources } from './utils';

export const getResources = (state: RootState) => state.resources;
export const getResource = (key: keyof Resources) => createDeepEqualSelector(
  getResources,
  (resources) => (
    resources
      ? resources[key]
      : null
  ),
);

export const getResourceList = (key: keyof Resources) => createDeepEqualSelector(
  getResources,
  (resources) => (
    resources
      ? Object.values(resources[key])
      : null
  ),
);
