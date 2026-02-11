import { useInternetIdentity } from '../hooks/useInternetIdentity';
import { useGetCallerUserProfile } from '../hooks/useCurrentUser';
import { Button } from '@/components/ui/button';
import { useNavigate } from '@tanstack/react-router';
import { useEffect } from 'react';
import AppLoadingScreen from '../components/routing/AppLoadingScreen';

export default function LoginPage() {
  const { login, loginStatus, identity, isInitializing } = useInternetIdentity();
  const { data: userProfile, isLoading: profileLoading, isFetched } = useGetCallerUserProfile();
  const navigate = useNavigate();

  // Handle authenticated user redirects
  useEffect(() => {
    if (!identity || isInitializing || (profileLoading && !isFetched)) {
      return;
    }

    // User is authenticated and profile state is resolved
    if (userProfile === null) {
      // No profile - go to onboarding
      navigate({ to: '/onboarding' });
    } else {
      // Has profile - go to dashboard
      navigate({ to: '/' });
    }
  }, [identity, isInitializing, userProfile, profileLoading, isFetched, navigate]);

  // Show loading while checking auth state
  if (isInitializing || (identity && (profileLoading && !isFetched))) {
    return <AppLoadingScreen />;
  }

  // If already authenticated, show loading while redirect happens
  if (identity) {
    return <AppLoadingScreen />;
  }

  const isLoggingIn = loginStatus === 'logging-in';

  return (
    <div className="flex min-h-screen flex-col items-center justify-center bg-background px-4">
      <div className="w-full max-w-md text-center">
        <img
          src="/assets/generated/evrvest-wordmark.dim_1200x300.png"
          alt="EVRVEST"
          className="mx-auto mb-12 h-16 w-auto"
        />
        
        <h1 className="mb-4 text-4xl font-bold tracking-tight">Challenge Gravity</h1>
        <p className="mb-8 text-lg text-muted-foreground">
          Progressive overload training for weighted vest athletes.
        </p>

        <Button
          onClick={login}
          disabled={isLoggingIn}
          size="lg"
          className="w-full bg-[oklch(0.488_0.243_264.376)] hover:bg-[oklch(0.4_0.243_264.376)] text-white font-bold"
        >
          {isLoggingIn ? 'Connecting...' : 'Sign In'}
        </Button>

        <div className="mt-12 space-y-2 text-sm text-muted-foreground">
          <p className="font-bold">The weight is real.</p>
          <p>Built to move. Not to hold you back.</p>
        </div>
      </div>
    </div>
  );
}
