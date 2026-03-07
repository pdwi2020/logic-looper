import { Button } from '@/components/ui/Button';
import { Card } from '@/components/ui/Card';

export function GuestMode() {
  return (
    <Card title="Playing as Guest" variant="outlined">
      <p className="text-sm text-brand-dark-gray">
        Sign in to sync progress across devices and keep your streak safe.
      </p>
      <Button variant="secondary" size="sm" className="mt-4">
        Sign In
      </Button>
    </Card>
  );
}

export default GuestMode;
