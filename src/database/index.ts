import { Database } from '@nozbe/watermelondb';
import SQLiteAdapter from '@nozbe/watermelondb/adapters/sqlite';

import { schemas } from './schemas';
import { models } from './models';
import { migrations } from './migrations';

import { synchronize } from '@nozbe/watermelondb/sync';

import data from './seeds/data.json';

export async function mySync() {
  await synchronize({
    database,

    pullChanges: async () => {
      const { changes, timestamp } = await data;

      return { changes, timestamp };
    },

    // eslint-disable-next-line @typescript-eslint/no-empty-function
    pushChanges: async () => {},
  });
}

const adapter = new SQLiteAdapter({
  schema: schemas,
  migrations,
});

export const database = new Database({
  adapter,
  modelClasses: models,
});
