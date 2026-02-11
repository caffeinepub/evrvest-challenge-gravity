import { ReactNode } from 'react';
import Header from './Header';
import BottomTabs from '../navigation/BottomTabs';

interface AppLayoutProps {
  children: ReactNode;
}

export default function AppLayout({ children }: AppLayoutProps) {
  return (
    <div className="flex min-h-screen flex-col bg-background">
      <Header />
      <main className="flex-1 container mx-auto px-4 py-6 max-w-7xl">
        {children}
      </main>
      <BottomTabs />
    </div>
  );
}
