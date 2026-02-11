import { useGetCallerUserProfile } from '../hooks/useCurrentUser';
import { useNavigate } from '@tanstack/react-router';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Lock } from 'lucide-react';
import ProGate from '../components/subscription/ProGate';

const MOCK_PLANS = [
  {
    id: 'hyrox-4week',
    title: '4-Week HYROX Foundation',
    description: 'Build base fitness with progressive vest load. Includes SkiErg, lunges, burpees, and running.',
    weeks: 4,
    sessionsPerWeek: 4,
    difficulty: 'intermediate'
  },
  {
    id: 'hyrox-6week',
    title: '6-Week HYROX Performance',
    description: 'Structured progression with deload week. Row intervals, stairmaster, incline work.',
    weeks: 6,
    sessionsPerWeek: 4,
    difficulty: 'advanced'
  },
  {
    id: 'hyrox-8week',
    title: '8-Week HYROX Competition Prep',
    description: 'Peak for race day. Full HYROX simulation workouts with RPE-based load adjustment.',
    weeks: 8,
    sessionsPerWeek: 5,
    difficulty: 'advanced'
  }
];

export default function PlansPage() {
  const { data: profile } = useGetCallerUserProfile();
  const navigate = useNavigate();

  const isPro = profile?.subscriptionTier === 'pro' || profile?.subscriptionTier === 'annualPro';

  return (
    <ProGate>
      <div className="space-y-6 pb-24">
        <div>
          <h1 className="text-3xl font-bold">Training Plans</h1>
          <p className="text-muted-foreground">Structured HYROX programs with progressive overload.</p>
        </div>

        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
          {MOCK_PLANS.map((plan) => (
            <Card key={plan.id} className="relative">
              {!isPro && (
                <div className="absolute inset-0 z-10 flex items-center justify-center rounded-lg bg-background/80 backdrop-blur-sm">
                  <div className="text-center">
                    <Lock className="mx-auto mb-2 h-8 w-8 text-muted-foreground" />
                    <p className="text-sm font-medium">Pro Feature</p>
                  </div>
                </div>
              )}
              <CardHeader>
                <CardTitle>{plan.title}</CardTitle>
                <CardDescription>{plan.description}</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="mb-4 flex gap-2">
                  <Badge variant="outline">{plan.weeks} weeks</Badge>
                  <Badge variant="outline">{plan.sessionsPerWeek}x/week</Badge>
                  <Badge variant="secondary" className="capitalize">
                    {plan.difficulty}
                  </Badge>
                </div>
                <Button
                  onClick={() => navigate({ to: `/plans/${plan.id}` })}
                  disabled={!isPro}
                  className="w-full bg-[oklch(0.488_0.243_264.376)] hover:bg-[oklch(0.4_0.243_264.376)]"
                >
                  View Plan
                </Button>
              </CardContent>
            </Card>
          ))}
        </div>

        {!isPro && (
          <Card className="border-[oklch(0.488_0.243_264.376)]">
            <CardHeader>
              <CardTitle>Unlock Training Plans</CardTitle>
              <CardDescription>
                Get access to structured HYROX programs with progressive overload and RPE-based adjustments.
              </CardDescription>
            </CardHeader>
            <CardContent>
              <Button
                onClick={() => navigate({ to: '/upgrade' })}
                className="bg-[oklch(0.488_0.243_264.376)] hover:bg-[oklch(0.4_0.243_264.376)]"
              >
                Upgrade to Pro
              </Button>
            </CardContent>
          </Card>
        )}
      </div>
    </ProGate>
  );
}
