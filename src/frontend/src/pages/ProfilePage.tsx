import { useState } from 'react';
import { useNavigate } from '@tanstack/react-router';
import { useGetCallerUserProfile, useUpdateProfile, useDeleteProfile } from '../hooks/useCurrentUser';
import { useInternetIdentity } from '../hooks/useInternetIdentity';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Textarea } from '@/components/ui/textarea';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle, AlertDialogTrigger } from '@/components/ui/alert-dialog';
import { Badge } from '@/components/ui/badge';
import { ArrowLeft, Trash2 } from 'lucide-react';
import { toast } from 'sonner';
import { useQueryClient } from '@tanstack/react-query';
import { ExperienceLevel, SportFocus } from '../backend';

export default function ProfilePage() {
  const navigate = useNavigate();
  const { clear } = useInternetIdentity();
  const queryClient = useQueryClient();
  const { data: profile } = useGetCallerUserProfile();
  const updateProfile = useUpdateProfile();
  const deleteProfile = useDeleteProfile();

  const [bodyweight, setBodyweight] = useState(profile?.bodyweightKg.toString() || '');
  const [height, setHeight] = useState(profile?.heightCm.toString() || '');
  const [experience, setExperience] = useState<ExperienceLevel>(profile?.experienceLevel || ExperienceLevel.beginner);
  const [sport, setSport] = useState<SportFocus>(profile?.sportFocus || SportFocus.general);
  const [goals, setGoals] = useState(profile?.goals || '');
  const [frequency, setFrequency] = useState(profile?.weeklyTrainingFrequency.toString() || '3');

  const handleUpdate = async () => {
    try {
      await updateProfile.mutateAsync({
        bodyweightKg: parseFloat(bodyweight),
        heightCm: parseFloat(height),
        experienceLevel: experience,
        sportFocus: sport,
        goals,
        weeklyTrainingFrequency: BigInt(frequency)
      });
      toast.success('Profile updated');
    } catch (error) {
      toast.error('Failed to update profile');
    }
  };

  const handleDelete = async () => {
    try {
      await deleteProfile.mutateAsync();
      await clear();
      queryClient.clear();
      navigate({ to: '/login' });
    } catch (error) {
      toast.error('Failed to delete profile');
    }
  };

  if (!profile) {
    return (
      <div className="flex min-h-[50vh] items-center justify-center">
        <p className="text-muted-foreground">Loading profile...</p>
      </div>
    );
  }

  return (
    <div className="space-y-6 pb-24">
      <Button
        variant="ghost"
        onClick={() => navigate({ to: '/' })}
        className="mb-4"
      >
        <ArrowLeft className="mr-2 h-4 w-4" />
        Back
      </Button>

      <div>
        <h1 className="text-3xl font-bold">Profile Settings</h1>
        <p className="text-muted-foreground">Manage your athlete profile.</p>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Subscription</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex items-center justify-between">
            <div>
              <Badge variant={profile.subscriptionTier === 'free' ? 'outline' : 'default'} className="mb-2">
                {profile.subscriptionTier === 'free' ? 'Free' : profile.subscriptionTier === 'annualPro' ? 'Annual Pro' : 'Pro'}
              </Badge>
              {profile.annualDiscountEligible && (
                <p className="text-sm text-muted-foreground">10% shop discount active</p>
              )}
            </div>
            {profile.subscriptionTier === 'free' && (
              <Button
                onClick={() => navigate({ to: '/upgrade' })}
                className="bg-[oklch(0.488_0.243_264.376)] hover:bg-[oklch(0.4_0.243_264.376)]"
              >
                Upgrade
              </Button>
            )}
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Athlete Data</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid gap-4 sm:grid-cols-2">
            <div>
              <Label htmlFor="bodyweight">Bodyweight (kg)</Label>
              <Input
                id="bodyweight"
                type="number"
                value={bodyweight}
                onChange={(e) => setBodyweight(e.target.value)}
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
                className="mt-2"
              />
            </div>
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
              className="mt-2 min-h-[100px]"
            />
          </div>

          <Button
            onClick={handleUpdate}
            disabled={updateProfile.isPending}
            className="w-full bg-[oklch(0.488_0.243_264.376)] hover:bg-[oklch(0.4_0.243_264.376)]"
          >
            {updateProfile.isPending ? 'Updating...' : 'Update Profile'}
          </Button>
        </CardContent>
      </Card>

      <Card className="border-destructive">
        <CardHeader>
          <CardTitle>Danger Zone</CardTitle>
          <CardDescription>
            Permanently delete your account and all associated data. This action cannot be undone.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <AlertDialog>
            <AlertDialogTrigger asChild>
              <Button variant="destructive" className="w-full">
                <Trash2 className="mr-2 h-4 w-4" />
                Delete Account
              </Button>
            </AlertDialogTrigger>
            <AlertDialogContent>
              <AlertDialogHeader>
                <AlertDialogTitle>Are you absolutely sure?</AlertDialogTitle>
                <AlertDialogDescription>
                  This will permanently delete your account, profile, workout history, and all associated data.
                  This action cannot be undone.
                </AlertDialogDescription>
              </AlertDialogHeader>
              <AlertDialogFooter>
                <AlertDialogCancel>Cancel</AlertDialogCancel>
                <AlertDialogAction onClick={handleDelete} className="bg-destructive hover:bg-destructive/90">
                  Delete Account
                </AlertDialogAction>
              </AlertDialogFooter>
            </AlertDialogContent>
          </AlertDialog>
        </CardContent>
      </Card>
    </div>
  );
}
