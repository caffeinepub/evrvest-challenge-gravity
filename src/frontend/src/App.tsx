import { RouterProvider, createRouter, createRoute, createRootRoute, Outlet, redirect } from '@tanstack/react-router';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { ThemeProvider } from 'next-themes';
import { Toaster } from '@/components/ui/sonner';
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
import AppLoadingScreen from './components/routing/AppLoadingScreen';
import RouteErrorFallback from './components/routing/RouteErrorFallback';

const queryClient = new QueryClient();

// Root route with error boundary
const rootRoute = createRootRoute({
  component: () => <Outlet />,
  errorComponent: ({ error }) => <RouteErrorFallback error={error} />,
  pendingComponent: AppLoadingScreen,
});

// Login route - redirects authenticated users
const loginRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: '/login',
  component: LoginPage,
});

// Onboarding route - requires auth, redirects if profile exists
const onboardingRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: '/onboarding',
  component: OnboardingPage,
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
});

declare module '@tanstack/react-router' {
  interface Register {
    router: typeof router;
  }
}

export default function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <ThemeProvider attribute="class" defaultTheme="dark" enableSystem={false} forcedTheme="dark">
        <RouterProvider router={router} />
        <Toaster />
      </ThemeProvider>
    </QueryClientProvider>
  );
}
