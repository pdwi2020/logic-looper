import { afterEach, describe, expect, it, vi } from 'vitest';

import type { DailyActivity } from '@/db/schemas';
import { getUnsyncedActivities, markAsSynced } from '@/db/operations';
import {
  isOnline,
  setupOnlineListener,
  shouldSync,
  syncUnsyncedActivities,
} from '@/services/syncService';

vi.mock('@/db/operations', () => ({
  getUnsyncedActivities: vi.fn(),
  markAsSynced: vi.fn(),
}));

const mockedGetUnsyncedActivities = vi.mocked(getUnsyncedActivities);
const mockedMarkAsSynced = vi.mocked(markAsSynced);

const createMockActivity = (
  overrides: Partial<DailyActivity> = {},
): DailyActivity => ({
  date: '2026-03-06',
  solved: true,
  score: 88,
  timeTaken: 300,
  difficulty: 2,
  synced: false,
  ...overrides,
});

describe('services/syncService', () => {
  afterEach(() => {
    vi.restoreAllMocks();
    vi.clearAllMocks();
    vi.unstubAllGlobals();
  });

  it('shouldSync(5, 5) returns true', () => {
    expect(shouldSync(5, 5)).toBe(true);
  });

  it('shouldSync(10, 5) returns true', () => {
    expect(shouldSync(10, 5)).toBe(true);
  });

  it('shouldSync(3, 5) returns false', () => {
    expect(shouldSync(3, 5)).toBe(false);
  });

  it('shouldSync(0, 5) returns false', () => {
    expect(shouldSync(0, 5)).toBe(false);
  });

  it('shouldSync(5, 0) returns false (edge case)', () => {
    expect(shouldSync(5, 0)).toBe(false);
  });

  it('isOnline returns a boolean based on navigator.onLine', () => {
    const onlineGetter = vi
      .spyOn(window.navigator, 'onLine', 'get')
      .mockReturnValue(true);

    expect(isOnline()).toBe(true);
    onlineGetter.mockReturnValue(false);
    expect(isOnline()).toBe(false);
    expect(typeof isOnline()).toBe('boolean');
  });

  it('setupOnlineListener returns a cleanup function', () => {
    const callback = vi.fn();
    const addListenerSpy = vi.spyOn(window, 'addEventListener');
    const removeListenerSpy = vi.spyOn(window, 'removeEventListener');

    const cleanup = setupOnlineListener(callback);

    expect(typeof cleanup).toBe('function');
    expect(addListenerSpy).toHaveBeenCalledWith('online', callback);

    cleanup();

    expect(removeListenerSpy).toHaveBeenCalledWith('online', callback);
  });

  it('syncUnsyncedActivities returns zero counts when nothing is pending', async () => {
    mockedGetUnsyncedActivities.mockResolvedValue([]);
    const fetchMock = vi.fn();
    vi.stubGlobal('fetch', fetchMock);

    const result = await syncUnsyncedActivities();

    expect(result).toEqual({ synced: 0, failed: 0 });
    expect(fetchMock).not.toHaveBeenCalled();
    expect(mockedMarkAsSynced).not.toHaveBeenCalled();
  });

  it('syncUnsyncedActivities posts entries and marks dates as synced on success', async () => {
    const activities = [
      createMockActivity({
        date: '2026-03-01',
        score: 95,
        timeTaken: 120,
        difficulty: 3,
      }),
      createMockActivity({
        date: '2026-03-02',
        score: 80,
        timeTaken: 210,
        difficulty: 1,
      }),
    ];
    mockedGetUnsyncedActivities.mockResolvedValue(activities);
    const fetchMock = vi.fn().mockResolvedValue({ ok: true });
    vi.stubGlobal('fetch', fetchMock);

    const result = await syncUnsyncedActivities();

    expect(result).toEqual({ synced: 2, failed: 0 });
    expect(fetchMock).toHaveBeenCalledTimes(1);
    expect(fetchMock).toHaveBeenCalledWith(
      '/api/sync/daily-scores',
      expect.objectContaining({
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
      }),
    );

    const requestBody = (fetchMock.mock.calls[0][1] as { body: string }).body;
    expect(JSON.parse(requestBody)).toEqual({
      entries: [
        {
          date: '2026-03-01',
          score: 95,
          timeTaken: 120,
          difficulty: 3,
        },
        {
          date: '2026-03-02',
          score: 80,
          timeTaken: 210,
          difficulty: 1,
        },
      ],
    });
    expect(mockedMarkAsSynced).toHaveBeenCalledWith([
      '2026-03-01',
      '2026-03-02',
    ]);
  });

  it('syncUnsyncedActivities returns failed count when API responds with non-OK status', async () => {
    mockedGetUnsyncedActivities.mockResolvedValue([
      createMockActivity({ date: '2026-03-01' }),
      createMockActivity({ date: '2026-03-02' }),
    ]);
    const fetchMock = vi.fn().mockResolvedValue({ ok: false });
    vi.stubGlobal('fetch', fetchMock);

    const result = await syncUnsyncedActivities();

    expect(result).toEqual({ synced: 0, failed: 2 });
    expect(mockedMarkAsSynced).not.toHaveBeenCalled();
  });

  it('syncUnsyncedActivities returns failed count when fetch throws', async () => {
    mockedGetUnsyncedActivities.mockResolvedValue([
      createMockActivity({ date: '2026-03-01' }),
    ]);
    vi.stubGlobal(
      'fetch',
      vi.fn().mockRejectedValue(new Error('Network down')),
    );

    const result = await syncUnsyncedActivities();

    expect(result).toEqual({ synced: 0, failed: 1 });
    expect(mockedMarkAsSynced).not.toHaveBeenCalled();
  });
});
