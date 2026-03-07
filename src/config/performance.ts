export interface BundleBudgets {
  initialBundle: number;
  firstLoad: number;
  maxChunkSize: number;
}

export interface PerformanceTargets {
  tti: number;
  puzzleGeneration: number;
  lighthouseScore: number;
}

export interface SyncConfig {
  batchSize: number;
  maxWritesPerDay: number;
  syncIntervalMs: number;
}

export interface DbConfig {
  dbName: string;
  version: number;
}

export const BUNDLE_BUDGETS: Readonly<BundleBudgets> = {
  initialBundle: 50_000,
  firstLoad: 100_000,
  maxChunkSize: 30_000,
};

export const PERFORMANCE_TARGETS: Readonly<PerformanceTargets> = {
  tti: 3_000,
  puzzleGeneration: 100,
  lighthouseScore: 95,
};

export const SYNC_CONFIG: Readonly<SyncConfig> = {
  batchSize: 5,
  maxWritesPerDay: 10,
  syncIntervalMs: 30_000,
};

export const DB_CONFIG: Readonly<DbConfig> = {
  dbName: 'logicLooperDB',
  version: 1,
};
