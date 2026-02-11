import { useNavigate, useLocation } from '@tanstack/react-router';
import { Home, Dumbbell, Calendar, Hammer, User } from 'lucide-react';

const tabs = [
  { path: '/', label: 'Dashboard', icon: Home },
  { path: '/exercises', label: 'Exercises', icon: Dumbbell },
  { path: '/plans', label: 'Plans', icon: Calendar },
  { path: '/builder', label: 'Builder', icon: Hammer },
  { path: '/profile', label: 'Profile', icon: User }
];

export default function BottomTabs() {
  const navigate = useNavigate();
  const location = useLocation();

  const isActive = (path: string) => {
    if (path === '/') return location.pathname === '/';
    return location.pathname.startsWith(path);
  };

  return (
    <nav className="fixed bottom-0 left-0 right-0 z-50 border-t border-border bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60" style={{ paddingBottom: 'env(safe-area-inset-bottom, 0)' }}>
      <div className="container mx-auto flex h-16 items-center justify-around px-4 max-w-7xl">
        {tabs.map((tab) => {
          const Icon = tab.icon;
          const active = isActive(tab.path);
          return (
            <button
              key={tab.path}
              onClick={() => navigate({ to: tab.path })}
              className={`flex flex-col items-center justify-center gap-1 transition-colors ${
                active ? 'text-[oklch(0.488_0.243_264.376)]' : 'text-muted-foreground hover:text-foreground'
              }`}
            >
              <Icon className="h-5 w-5" />
              <span className="text-xs font-medium">{tab.label}</span>
            </button>
          );
        })}
      </div>
    </nav>
  );
}
