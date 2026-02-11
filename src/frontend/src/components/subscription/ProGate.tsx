import { ReactNode } from 'react';
import { useNavigate } from '@tanstack/react-router';
import { useGetCallerUserProfile } from '../../hooks/useCurrentUser';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Lock } from 'lucide-react';

interface ProGateProps {
  children: ReactNode;
}

export default function ProGate({ children }: ProGateProps) {
  const { data: profile } = useGetCallerUserProfile();
  const navigate = useNavigate();

  const isPro = profile?.subscriptionTier === 'pro' || profile?.subscriptionTier === 'annualPro';

  if (!isPro) {
    return (
      <div className="flex min-h-[50vh] items-center justify-center pb-24">
        <Card className="w-full max-w-md border-[oklch(0.488_0.243_264.376)]">
          <CardHeader className="text-center">
            <Lock className="mx-auto mb-4 h-12 w-12 text-[oklch(0.488_0.243_264.376)]" />
            <CardTitle>Pro Feature</CardTitle>
            <CardDescription>
              Upgrade to Pro to access training plans, GravityAI coach, and advanced analytics.
            </CardDescription>
          </CardHeader>
          <CardContent>
            <Button
              onClick={() => navigate({ to: '/upgrade' })}
              className="w-full bg-[oklch(0.488_0.243_264.376)] hover:bg-[oklch(0.4_0.243_264.376)]"
            >
              Upgrade to Pro
            </Button>
          </CardContent>
        </Card>
      </div>
    );
  }

  return <>{children}</>;
}
