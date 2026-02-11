import React from 'react';
import { Button } from '@/components/ui/button';
import { AlertTriangle } from 'lucide-react';
import { clearAllStartupState } from '@/utils/urlParams';

interface RouteErrorFallbackProps {
  error?: Error;
  reset?: () => void;
}

export default function RouteErrorFallback({ error, reset }: RouteErrorFallbackProps) {
  const handleReload = () => {
    // Clear all startup-related session state before reloading
    clearAllStartupState();
    
    if (reset) {
      reset();
    } else {
      window.location.reload();
    }
  };

  // Determine if this is a startup/auth error
  const isStartupError = error?.message?.includes('startup') || 
                         error?.message?.includes('authentication') || 
                         error?.message?.includes('profile');

  return (
    <div className="flex h-screen items-center justify-center bg-background px-4">
      <div className="w-full max-w-md text-center">
        <div className="mb-6 flex justify-center">
          <div className="rounded-full bg-destructive/10 p-4">
            <AlertTriangle className="h-12 w-12 text-destructive" />
          </div>
        </div>
        
        <h1 className="mb-2 text-2xl font-bold text-foreground">
          {isStartupError ? 'Startup Error' : 'Something Went Wrong'}
        </h1>
        <p className="mb-6 text-muted-foreground">
          {error?.message || 'An unexpected error occurred while loading the application.'}
        </p>
        
        <Button
          onClick={handleReload}
          className="bg-[oklch(0.488_0.243_264.376)] hover:bg-[oklch(0.4_0.243_264.376)]"
        >
          Reload Application
        </Button>
        
        {isStartupError && (
          <p className="mt-4 text-xs text-muted-foreground">
            This will clear your session and restart the application.
          </p>
        )}
      </div>
    </div>
  );
}
