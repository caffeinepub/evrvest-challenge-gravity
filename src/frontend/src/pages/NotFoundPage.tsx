import { Button } from '@/components/ui/button';
import { AlertTriangle } from 'lucide-react';
import { useNavigate } from '@tanstack/react-router';
import { useInternetIdentity } from '../hooks/useInternetIdentity';

export default function NotFoundPage() {
  const navigate = useNavigate();
  const { identity } = useInternetIdentity();
  
  const handleGoBack = () => {
    if (identity) {
      navigate({ to: '/' });
    } else {
      navigate({ to: '/login' });
    }
  };

  return (
    <div className="flex h-screen items-center justify-center bg-background px-4">
      <div className="w-full max-w-md text-center">
        <div className="mb-6 flex justify-center">
          <div className="rounded-full bg-muted p-4">
            <AlertTriangle className="h-12 w-12 text-muted-foreground" />
          </div>
        </div>
        
        <h1 className="mb-2 text-4xl font-bold">404</h1>
        <h2 className="mb-2 text-2xl font-semibold">Page Not Found</h2>
        <p className="mb-6 text-muted-foreground">
          The page you're looking for doesn't exist or has been moved.
        </p>
        
        <Button
          onClick={handleGoBack}
          className="bg-[oklch(0.488_0.243_264.376)] hover:bg-[oklch(0.4_0.243_264.376)]"
        >
          {identity ? 'Go to Dashboard' : 'Go to Login'}
        </Button>
      </div>
    </div>
  );
}
