import { useNavigate, useLocation } from '@tanstack/react-router';
import { useInternetIdentity } from '../../hooks/useInternetIdentity';
import { useQueryClient } from '@tanstack/react-query';
import { Button } from '@/components/ui/button';
import { ArrowLeft, LogOut } from 'lucide-react';

export default function Header() {
  const navigate = useNavigate();
  const location = useLocation();
  const { clear, identity } = useInternetIdentity();
  const queryClient = useQueryClient();

  const showBackButton = location.pathname === '/profile' || location.pathname === '/admin';

  const handleLogout = async () => {
    await clear();
    queryClient.clear();
    navigate({ to: '/login' });
  };

  return (
    <header className="sticky top-0 z-50 w-full border-b border-border bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60" style={{ paddingTop: 'env(safe-area-inset-top, 0)' }}>
      <div className="container mx-auto flex h-16 items-center justify-between px-4 max-w-7xl">
        <div className="flex items-center gap-4">
          {showBackButton ? (
            <Button
              variant="ghost"
              size="icon"
              onClick={() => navigate({ to: '/' })}
            >
              <ArrowLeft className="h-5 w-5" />
            </Button>
          ) : (
            <img
              src="/assets/generated/evrvest-wordmark.dim_1200x300.png"
              alt="EVRVEST"
              className="h-8 w-auto cursor-pointer"
              onClick={() => navigate({ to: '/' })}
            />
          )}
        </div>

        {identity && (
          <Button
            variant="ghost"
            size="icon"
            onClick={handleLogout}
            title="Logout"
          >
            <LogOut className="h-5 w-5" />
          </Button>
        )}
      </div>
    </header>
  );
}
