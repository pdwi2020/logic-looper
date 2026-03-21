import { useState } from 'react';
import { motion } from 'framer-motion';

import { Button } from '@/components/ui/Button';
import { Card } from '@/components/ui/Card';
import {
  clearAllData,
  getAchievements,
  getAllActivities,
} from '@/db/operations';

type ThemeMode = 'light' | 'dark';

function applyTheme(mode: ThemeMode) {
  if (mode === 'dark') {
    document.documentElement.classList.add('dark');
  } else {
    document.documentElement.classList.remove('dark');
  }
  localStorage.setItem('theme', mode);
}

export default function Settings() {
  const [themeMode, setThemeMode] = useState<ThemeMode>(
    () => (localStorage.getItem('theme') as ThemeMode | null) ?? 'light',
  );
  const [statusMessage, setStatusMessage] = useState<string | null>(null);
  const [isStatusError, setIsStatusError] = useState(false);
  const [confirmClear, setConfirmClear] = useState(false);
  const [isWorking, setIsWorking] = useState(false);

  const handleExportData = async () => {
    setIsWorking(true);
    setStatusMessage(null);
    try {
      const [activities, achievements] = await Promise.all([
        getAllActivities(),
        getAchievements(),
      ]);
      const payload = JSON.stringify({ activities, achievements }, null, 2);
      const blob = new Blob([payload], { type: 'application/json' });
      const url = URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `logic-looper-${new Date().toISOString().slice(0, 10)}.json`;
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      URL.revokeObjectURL(url);
      setIsStatusError(false);
      setStatusMessage(
        `Exported ${activities.length} puzzle records and ${achievements.length} achievements.`,
      );
    } catch {
      setIsStatusError(true);
      setStatusMessage('Export failed. Please try again.');
    } finally {
      setIsWorking(false);
    }
  };

  const handleClearLocalData = async () => {
    if (!confirmClear) {
      setConfirmClear(true);
      setIsStatusError(false);
      setStatusMessage(
        'This will permanently erase all puzzle history and badges. Click "Confirm Clear" to proceed.',
      );
      return;
    }

    setIsWorking(true);
    setConfirmClear(false);
    try {
      await clearAllData();
      setIsStatusError(false);
      setStatusMessage('All local data cleared. Your history has been reset.');
    } catch {
      setIsStatusError(true);
      setStatusMessage('Clear failed. Please try again.');
    } finally {
      setIsWorking(false);
    }
  };

  const handleCancelClear = () => {
    setConfirmClear(false);
    setStatusMessage(null);
  };

  return (
    <div className="space-y-6">
      <motion.section
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, amount: 0.2 }}
        transition={{ duration: 0.4, ease: 'easeOut' }}
      >
        <Card title="Theme" variant="default">
          <p className="text-sm text-brand-dark-gray">
            Choose your preferred display mode. Your selection is saved locally
            and applied on every visit.
          </p>

          <div className="mt-4 flex flex-wrap gap-3">
            <Button
              variant={themeMode === 'light' ? 'primary' : 'ghost'}
              size="sm"
              onClick={() => {
                setThemeMode('light');
                applyTheme('light');
              }}
            >
              Light
            </Button>
            <Button
              variant={themeMode === 'dark' ? 'secondary' : 'ghost'}
              size="sm"
              onClick={() => {
                setThemeMode('dark');
                applyTheme('dark');
              }}
            >
              Dark
            </Button>
          </div>
        </Card>
      </motion.section>

      <motion.section
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, amount: 0.2 }}
        transition={{ duration: 0.42, ease: 'easeOut' }}
      >
        <Card title="Data Management" variant="outlined">
          <p className="text-sm text-brand-dark-gray">
            Manage local progress data stored on this device.
          </p>

          <div className="mt-4 flex flex-wrap gap-3">
            <Button
              variant="primary"
              onClick={() => void handleExportData()}
              disabled={isWorking}
            >
              Export Data
            </Button>

            {confirmClear ? (
              <>
                <Button
                  variant="accent"
                  onClick={() => void handleClearLocalData()}
                  disabled={isWorking}
                >
                  Confirm Clear
                </Button>
                <Button variant="ghost" onClick={handleCancelClear}>
                  Cancel
                </Button>
              </>
            ) : (
              <Button
                variant="accent"
                onClick={() => void handleClearLocalData()}
                disabled={isWorking}
              >
                Clear Local Data
              </Button>
            )}
          </div>

          {statusMessage ? (
            <motion.p
              className={`mt-4 rounded-lg border px-3 py-2 text-xs ${
                isStatusError
                  ? 'border-brand-accent/40 bg-brand-accent/10 text-brand-accent'
                  : 'border-brand-light-periwinkle bg-brand-light-lavender text-brand-dark-gray'
              }`}
              initial={{ opacity: 0, y: 4 }}
              animate={{ opacity: 1, y: 0 }}
            >
              {statusMessage}
            </motion.p>
          ) : null}
        </Card>
      </motion.section>

      <motion.section
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, amount: 0.2 }}
        transition={{ duration: 0.42, ease: 'easeOut' }}
      >
        <Card title="Account" variant="elevated">
          <p className="text-sm text-brand-dark-gray">
            Account creation and authentication are in progress. Sign in will
            unlock cloud sync, leaderboard identity, and cross-device
            continuity.
          </p>

          <Button variant="secondary" className="mt-4">
            Sign In (Coming Soon)
          </Button>
        </Card>
      </motion.section>
    </div>
  );
}
