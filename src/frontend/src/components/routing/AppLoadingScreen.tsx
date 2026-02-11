import React from 'react';

export default function AppLoadingScreen() {
  return (
    <div className="flex h-screen items-center justify-center bg-background">
      <div className="text-center">
        <div className="mb-4 h-12 w-12 animate-spin rounded-full border-4 border-primary border-t-transparent mx-auto" />
        <p className="text-lg font-medium text-foreground mb-1">Starting EVRVEST</p>
        <p className="text-sm text-muted-foreground">Loading your authentication and profile...</p>
      </div>
    </div>
  );
}
