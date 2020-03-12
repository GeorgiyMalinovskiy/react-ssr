import db from '-node/mock_db.json';

type DB = typeof db;
export type Resources = {
  [K in keyof DB]: Record<string, DB[K][number]>;
};

export type ResourcesState = Resources | null;
