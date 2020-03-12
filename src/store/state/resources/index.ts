import {
  normalize,
  schema,
} from 'normalizr';
import { REQUEST, ActionTypes } from '../network';

import { Resources, ResourcesState } from './utils';

export * from './utils';

const initialState: ResourcesState = null;

const user = new schema.Entity<Resources['users']>('users');
const resourceShemas = { users: [user] };

export default (
  state = initialState,
  action: ActionTypes,
): ResourcesState => {
  switch (action.type) {
    case REQUEST.SUCCESS:
      /* eslint-disable no-case-declarations */
      const resourceName = Object.keys(resourceShemas)
        .find((name) => action.payload?.path.includes(name)) as keyof Resources | undefined;
      /* eslint-enable */

      if (resourceName) {
        return (
          normalize<
          Resources[typeof resourceName],
          ResourcesState
          >({ [resourceName]: action.result }, resourceShemas)
        ).entities || null;
      }

      return state;
    default: return state;
  }
};
