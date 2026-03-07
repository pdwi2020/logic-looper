import { useState } from 'react';
import { motion } from 'framer-motion';

import { Button } from '@/components/ui/Button';
import { Card } from '@/components/ui/Card';

type ThemeMode = 'light' | 'dark';

export default function Settings() {
  const [themeMode, setThemeMode] = useState<ThemeMode>('light');
  const [statusMessage, setStatusMessage] = useState<string | null>(null);

  const handleExportData = () => {
    setStatusMessage(
      'Export data will be available after account sync is enabled.',
    );
  };

  const handleClearLocalData = () => {
    setStatusMessage(
      'Clear local data will be added with a safe confirmation step.',
    );
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
            Theme switching is currently a placeholder. Choose your preferred
            mode for future personalization.
          </p>

          <div className="mt-4 flex flex-wrap gap-3">
            <Button
              variant={themeMode === 'light' ? 'primary' : 'ghost'}
              size="sm"
              onClick={() => {
                setThemeMode('light');
              }}
            >
              Light
            </Button>
            <Button
              variant={themeMode === 'dark' ? 'secondary' : 'ghost'}
              size="sm"
              onClick={() => {
                setThemeMode('dark');
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
            <Button variant="primary" onClick={handleExportData}>
              Export Data
            </Button>
            <Button variant="accent" onClick={handleClearLocalData}>
              Clear Local Data
            </Button>
          </div>

          {statusMessage ? (
            <p className="mt-4 rounded-lg border border-brand-light-periwinkle bg-brand-light-lavender px-3 py-2 text-xs text-brand-dark-gray">
              {statusMessage}
            </p>
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
