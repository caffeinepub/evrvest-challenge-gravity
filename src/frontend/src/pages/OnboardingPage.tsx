import { useState, useEffect } from 'react';
import { useNavigate } from '@tanstack/react-router';
import { useInternetIdentity } from '../hooks/useInternetIdentity';
import { useCreateProfile, useGetCallerUserProfile } from '../hooks/useCurrentUser';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Textarea } from '@/components/ui/textarea';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { calculateRecommendedLoadRange } from '../lib/loadAlgorithms';
import { ExperienceLevel, SportFocus } from '../backend';
import { AlertTriangle } from 'lucide-react';
import AppLoadingScreen from '../components/routing/AppLoadingScreen';

export default function OnboardingPage() {
  const navigate = useNavigate();
  const { identity, isInitializing } = useInternetIdentity();
  const { data: userProfile, isLoading: profileLoading, isFetched } = useGetCallerUserProfile();
  const createProfile = useCreateProfile();
  
  const [step, setStep] = useState(1);
  const [bodyweight, setBodyweight] = useState('');
  const [height, setHeight] = useState('');
  const [experience, setExperience] = useState<ExperienceLevel>(ExperienceLevel.beginner);
  const [sport, setSport] = useState<SportFocus>(SportFocus.general);
  const [goals, setGoals] = useState('');
  const [frequency, setFrequency] = useState('3');

  // Redirect if not authenticated or already has profile
  useEffect(() => {
    if (isInitializing || (identity && profileLoading && !isFetched)) {
      return;
    }

    if (!identity) {
      navigate({ to: '/login' });
      return;
    }

    if (userProfile !== null) {
      navigate({ to: '/' });
    }
  }, [identity, isInitializing, userProfile, profileLoading, isFetched, navigate]);

  const handleSubmit = async () => {
    try {
      await createProfile.mutateAsync({
        bodyweightKg: parseFloat(bodyweight),
        heightCm: parseFloat(height),
        experienceLevel: experience,
        sportFocus: sport,
        goals,
        weeklyTrainingFrequency: BigInt(frequency)
      });
      navigate({ to: '/' });
    } catch (error) {
      console.error('Profile creation failed:', error);
    }
  };

  // Show loading while checking auth/profile state
  if (isInitializing || (identity && profileLoading && !isFetched)) {
    return <AppLoadingScreen />;
  }

  // Show loading while redirecting
  if (!identity || userProfile !== null) {
    return <AppLoadingScreen />;
  }

  const loadRange = bodyweight ? calculateRecommendedLoadRange(parseFloat(bodyweight), experience) : null;

  if (step === 1) {
    return (
      <div className="flex min-h-screen flex-col items-center justify-center bg-background px-4">
        <div className="w-full max-w-md">
          <h1 className="mb-2 text-3xl font-bold">Welcome to EVRVEST</h1>
          <p className="mb-8 text-muted-foreground">Let's build your athlete profile.</p>

          <div className="space-y-6">
            <div>
              <Label htmlFor="bodyweight">Bodyweight (kg)</Label>
              <Input
                id="bodyweight"
                type="number"
                value={bodyweight}
                onChange={(e) => setBodyweight(e.target.value)}
                placeholder="75"
                className="mt-2"
              />
            </div>

            <div>
              <Label htmlFor="height">Height (cm)</Label>
              <Input
                id="height"
                type="number"
                value={height}
                onChange={(e) => setHeight(e.target.value)}
                placeholder="175"
                className="mt-2"
              />
            </div>

            <div>
              <Label htmlFor="experience">Experience Level</Label>
              <Select value={experience} onValueChange={(v) => setExperience(v as ExperienceLevel)}>
                <SelectTrigger className="mt-2">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value={ExperienceLevel.beginner}>Beginner</SelectItem>
                  <SelectItem value={ExperienceLevel.intermediate}>Intermediate</SelectItem>
                  <SelectItem value={ExperienceLevel.advanced}>Advanced</SelectItem>
                  <SelectItem value={ExperienceLevel.elite}>Elite</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <Button
              onClick={() => setStep(2)}
              disabled={!bodyweight || !height}
              className="w-full bg-[oklch(0.488_0.243_264.376)] hover:bg-[oklch(0.4_0.243_264.376)]"
            >
              Continue
            </Button>
          </div>
        </div>
      </div>
    );
  }

  if (step === 2) {
    return (
      <div className="flex min-h-screen flex-col items-center justify-center bg-background px-4">
        <div className="w-full max-w-md">
          <h1 className="mb-2 text-3xl font-bold">Training Profile</h1>
          <p className="mb-8 text-muted-foreground">Tell us about your training.</p>

          <div className="space-y-6">
            <div>
              <Label htmlFor="sport">Primary Sport Focus</Label>
              <Select value={sport} onValueChange={(v) => setSport(v as SportFocus)}>
                <SelectTrigger className="mt-2">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value={SportFocus.hyrox}>HYROX</SelectItem>
                  <SelectItem value={SportFocus.bodyweight}>Bodyweight</SelectItem>
                  <SelectItem value={SportFocus.running}>Running</SelectItem>
                  <SelectItem value={SportFocus.trail}>Trail</SelectItem>
                  <SelectItem value={SportFocus.gym}>Gym</SelectItem>
                  <SelectItem value={SportFocus.rehab}>Rehab</SelectItem>
                  <SelectItem value={SportFocus.general}>General Fitness</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div>
              <Label htmlFor="frequency">Weekly Training Frequency</Label>
              <Select value={frequency} onValueChange={setFrequency}>
                <SelectTrigger className="mt-2">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="2">2 sessions/week</SelectItem>
                  <SelectItem value="3">3 sessions/week</SelectItem>
                  <SelectItem value="4">4 sessions/week</SelectItem>
                  <SelectItem value="5">5 sessions/week</SelectItem>
                  <SelectItem value="6">6 sessions/week</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div>
              <Label htmlFor="goals">Training Goals</Label>
              <Textarea
                id="goals"
                value={goals}
                onChange={(e) => setGoals(e.target.value)}
                placeholder="Build endurance, improve strength, prepare for competition..."
                className="mt-2 min-h-[100px]"
              />
            </div>

            <Button
              onClick={() => setStep(3)}
              disabled={!goals}
              className="w-full bg-[oklch(0.488_0.243_264.376)] hover:bg-[oklch(0.4_0.243_264.376)]"
            >
              Continue
            </Button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="flex min-h-screen flex-col items-center justify-center bg-background px-4">
      <div className="w-full max-w-md">
        <h1 className="mb-2 text-3xl font-bold">Your Recommended Load</h1>
        <p className="mb-8 text-muted-foreground">Based on your profile.</p>

        {loadRange && (
          <div className="space-y-6">
            <div className="rounded-lg border border-[oklch(0.488_0.243_264.376)] bg-card p-6">
              <div className="mb-4 text-center">
                <div className="text-5xl font-bold text-[oklch(0.488_0.243_264.376)]">
                  {loadRange.min}–{loadRange.max} kg
                </div>
                <div className="mt-2 text-sm text-muted-foreground">
                  {Math.round((loadRange.min / parseFloat(bodyweight)) * 100)}–
                  {Math.round((loadRange.max / parseFloat(bodyweight)) * 100)}% bodyweight
                </div>
              </div>

              <p className="text-center text-sm">
                Start at the lower end. Progress by 2-5% weekly if recovery is solid.
              </p>
            </div>

            {loadRange.warning && (
              <Alert variant="destructive">
                <AlertTriangle className="h-4 w-4" />
                <AlertDescription>{loadRange.warning}</AlertDescription>
              </Alert>
            )}

            <Button
              onClick={handleSubmit}
              disabled={createProfile.isPending}
              className="w-full bg-[oklch(0.488_0.243_264.376)] hover:bg-[oklch(0.4_0.243_264.376)]"
            >
              {createProfile.isPending ? 'Creating Profile...' : 'Complete Setup'}
            </Button>
          </div>
        )}
      </div>
    </div>
  );
}
