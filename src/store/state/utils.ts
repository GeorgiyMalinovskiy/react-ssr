import { ActionCreator, AnyAction } from 'redux';
import { createSelectorCreator, defaultMemoize } from 'reselect';
import isEqual from 'lodash/isEqual';

export type InferActionTypes<T> = T extends { [key: string]: infer U }
  ? U extends ActionCreator<AnyAction>
    ? ReturnType<U>
    : never
  : never;

export const createDeepEqualSelector = createSelectorCreator(
  defaultMemoize,
  isEqual,
);
