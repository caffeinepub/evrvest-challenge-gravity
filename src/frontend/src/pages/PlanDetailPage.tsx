import { useParams, useNavigate } from '@tanstack/react-router';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { ArrowLeft, CheckCircle2 } from 'lucide-react';

export default function PlanDetailPage() {
  const { planId } = useParams({ from: '/plans/$planId' });
  const navigate = useNavigate();

  const mockWeeks = [
    { week: 1, focus: 'Foundation', vestLoad: '6-8%', deload: false },
    { week: 2, focus: 'Volume Build', vestLoad: '8-10%', deload: false },
    { week: 3, focus: 'Intensity', vestLoad: '10-12%', deload: false },
    { week: 4, focus: 'Deload', vestLoad: '5-6%', deload: true }
  ];

  return (
    <div className="space-y-6 pb-24">
      <Button
        variant="ghost"
        onClick={() => navigate({ to: '/plans' })}
        className="mb-4"
      >
        <ArrowLeft className="mr-2 h-4 w-4" />
        Back to Plans
      </Button>

      <div>
        <h1 className="text-3xl font-bold">4-Week HYROX Foundation</h1>
        <p className="text-muted-foreground">Progressive vest load with structured recovery.</p>
      </div>

      <div className="space-y-4">
        {mockWeeks.map((week) => (
          <Card key={week.week}>
            <CardHeader>
              <div className="flex items-center justify-between">
                <CardTitle>Week {week.week}: {week.focus}</CardTitle>
                {week.deload && <Badge variant="secondary">Deload</Badge>}
              </div>
            </CardHeader>
            <CardContent>
              <div className="space-y-2">
                <p className="text-sm">
                  <span className="font-medium">Vest Load:</span> {week.vestLoad} bodyweight
                </p>
                <p className="text-sm text-muted-foreground">
                  4 sessions: 2x strength, 2x conditioning
                </p>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      <Card className="border-[oklch(0.488_0.243_264.376)]">
        <CardHeader>
          <CardTitle>RPE Feedback</CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-sm text-muted-foreground mb-4">
            After each workout, rate your perceived exertion (1-10). The plan adjusts future loads based on your feedback.
          </p>
          <Button className="bg-[oklch(0.488_0.243_264.376)] hover:bg-[oklch(0.4_0.243_264.376)]">
            Start Plan
          </Button>
        </CardContent>
      </Card>
    </div>
  );
}
