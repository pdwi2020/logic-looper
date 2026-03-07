import { type DBSchema, type IDBPDatabase, openDB } from 'idb';

import { DB_CONFIG } from '@/config/performance';
import type { Achievement, DailyActivity } from '@/db/schemas';

export interface LogicLooperDBSchema extends DBSchema {
  dailyActivity: {
    key: string;
    value: DailyActivity;
  };
  achievements: {
    key: string;
    value: Achievement;
  };
}

let dbPromise: Promise<IDBPDatabase<LogicLooperDBSchema>> | null = null;

export function initDB(): Promise<IDBPDatabase<LogicLooperDBSchema>> {
  if (!dbPromise) {
    dbPromise = openDB<LogicLooperDBSchema>(
      DB_CONFIG.dbName,
      DB_CONFIG.version,
      {
        upgrade(db) {
          if (!db.objectStoreNames.contains('dailyActivity')) {
            db.createObjectStore('dailyActivity', { keyPath: 'date' });
          }

          if (!db.objectStoreNames.contains('achievements')) {
            db.createObjectStore('achievements', { keyPath: 'id' });
          }
        },
      },
    );
  }

  return dbPromise;
}
