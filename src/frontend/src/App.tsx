import { RouterProvider, createRouter, createRoute, createRootRoute, Outlet, redirect } from '@tanstack/react-router';
import { ThemeProvider } from 'next-themes';
import { Toaster } from '@/components/ui/sonner';
import { useEffect } from 'react';
import { useInternetIdentity } from './hooks/useInternetIdentity';
import { useGetCallerUserProfile } from './hooks/useCurrentUser';
import { routerAuthStore } from './lib/routerAuthStore';
import AppLayout from './components/layout/AppLayout';
import LoginPage from './pages/LoginPage';
import OnboardingPage from './pages/OnboardingPage';
import DashboardPage from './pages/DashboardPage';
import ExercisesPage from './pages/ExercisesPage';
import ExerciseDetailPage from './pages/ExerciseDetailPage';
import PlansPage from './pages/PlansPage';
import PlanDetailPage from './pages/PlanDetailPage';
import WorkoutBuilderPage from './pages/WorkoutBuilderPage';
import GravityAIPage from './pages/GravityAIPage';
import ProfilePage from './pages/ProfilePage';
import UpgradePage from './pages/UpgradePage';
import AdminPanelPage from './pages/AdminPanelPage';
import NotFoundPage from './pages/NotFoundPage';
import AppLoadingScreen from './components/routing/AppLoadingScreen';
import RouteErrorFallback from './components/routing/RouteErrorFallback';

// Root route with error boundary
const rootRoute = createRootRoute({
  component: RootComponent,
  errorComponent: ({ error }) => <RouteErrorFallback error={error} />,
  pendingComponent: AppLoadingScreen,
  notFoundComponent: NotFoundPage,
});

// Login route - redirects authenticated users with profiles
const loginRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: '/login',
  component: LoginPage,
  beforeLoad: async () => {
    const state = await routerAuthStore.waitUntilResolved();
    
    if (state.identity && state.userProfile !== null) {
      throw redirect({ to: '/' });
    }
  },
});

// Onboarding route - requires auth, redirects if profile exists
const onboardingRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: '/onboarding',
  component: OnboardingPage,
  beforeLoad: async () => {
    const state = await routerAuthStore.waitUntilResolved();
    
    if (!state.identity) {
      throw redirect({ to: '/login' });
    }
    
    if (state.userProfile !== null) {
      throw redirect({ to: '/' });
    }
  },
});

// Layout route for authenticated app pages
const layoutRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: '/',
  component: () => (
    <AppLayout>
      <Outlet />
    </AppLayout>
  ),
  beforeLoad: async () => {
    const state = await routerAuthStore.waitUntilResolved();
    
    if (!state.identity) {
      throw redirect({ to: '/login' });
    }
    
    if (state.userProfile === null) {
      throw redirect({ to: '/onboarding' });
    }
  },
});

const dashboardRoute = createRoute({
  getParentRoute: () => layoutRoute,
  path: '/',
  component: DashboardPage,
});

const exercisesRoute = createRoute({
  getParentRoute: () => layoutRoute,
  path: '/exercises',
  component: ExercisesPage,
});

const exerciseDetailRoute = createRoute({
  getParentRoute: () => layoutRoute,
  path: '/exercises/$exerciseId',
  component: ExerciseDetailPage,
});

const plansRoute = createRoute({
  getParentRoute: () => layoutRoute,
  path: '/plans',
  component: PlansPage,
});

const planDetailRoute = createRoute({
  getParentRoute: () => layoutRoute,
  path: '/plans/$planId',
  component: PlanDetailPage,
});

const builderRoute = createRoute({
  getParentRoute: () => layoutRoute,
  path: '/builder',
  component: WorkoutBuilderPage,
});

const gravityAIRoute = createRoute({
  getParentRoute: () => layoutRoute,
  path: '/gravity-ai',
  component: GravityAIPage,
});

const profileRoute = createRoute({
  getParentRoute: () => layoutRoute,
  path: '/profile',
  component: ProfilePage,
});

const upgradeRoute = createRoute({
  getParentRoute: () => layoutRoute,
  path: '/upgrade',
  component: UpgradePage,
});

const adminRoute = createRoute({
  getParentRoute: () => layoutRoute,
  path: '/admin',
  component: AdminPanelPage,
});

const routeTree = rootRoute.addChildren([
  loginRoute,
  onboardingRoute,
  layoutRoute.addChildren([
    dashboardRoute,
    exercisesRoute,
    exerciseDetailRoute,
    plansRoute,
    planDetailRoute,
    builderRoute,
    gravityAIRoute,
    profileRoute,
    upgradeRoute,
    adminRoute,
  ]),
]);

const router = createRouter({
  routeTree,
  defaultPendingComponent: AppLoadingScreen,
  defaultErrorComponent: ({ error }) => <RouteErrorFallback error={error} />,
  defaultNotFoundComponent: NotFoundPage,
});

declare module '@tanstack/react-router' {
  interface Register {
    router: typeof router;
  }
}

// Root component that updates the auth store and gates startup
function RootComponent() {
  const { identity, isInitializing } = useInternetIdentity();
  const { data: userProfile, isLoading: profileLoading, isFetched: profileFetched } = useGetCallerUserProfile();
  
  // Update the router auth store whenever auth/profile state changes
  useEffect(() => {
    // Log startup phase diagnostics (production-safe, no sensitive data)
    if (isInitializing) {
      console.warn('[Startup] Internet Identity initializing...');
    } else if (identity && profileLoading && !profileFetched) {
      console.warn('[Startup] User authenticated, loading profile...');
    } else if (identity && profileFetched) {
      console.warn('[Startup] Profile loaded, startup complete');
    } else if (!identity && !isInitializing) {
      console.warn('[Startup] No authenticated user, startup complete');
    }

    routerAuthStore.setState({
      isInitializing,
      identity,
      profileLoading,
      profileFetched,
      userProfile: userProfile ?? null,
    });
  }, [isInitializing, identity, profileLoading, profileFetched, userProfile]);
  
  // Startup gate: show full-screen loading until auth/profile resolution is complete
  // This prevents black screens on initial load regardless of route
  const isStartupPending = isInitializing || (identity && profileLoading && !profileFetched);
  
  if (isStartupPending) {
    return <AppLoadingScreen />;
  }
  
  return <Outlet />;
}

export default function App() {
  return (
    <ThemeProvider attribute="class" defaultTheme="dark" enableSystem={false} forcedTheme="dark">
      <RouterProvider router={router} />
      <Toaster />
    </ThemeProvider>
  );
}
