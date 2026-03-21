import { Button } from '@/components/ui/Button';
import { Card } from '@/components/ui/Card';
import { useNavigate } from "react-router-dom";

export function GuestMode() {
  const navigate = useNavigate();

  return (
    <Card title="Playing as Guest" variant="outlined">
      <p className="text-sm text-brand-dark-gray">
        Sign in to sync progress across devices and keep your streak safe.
      </p>
      <Button variant="secondary" size="sm" className="mt-4" onClick={() => { navigate('/settings'); }}>
        Sign In
      </Button>
    </Card>
  );
}

export default GuestMode;
