import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { useGetCallerUserProfile } from '../hooks/useCurrentUser';
import { calculateSessionVolume, calculateIntensityScore } from '../lib/workoutMetrics';
import { Plus, Trash2 } from 'lucide-react';
import ExercisePicker from '../components/builder/ExercisePicker';
import { toast } from 'sonner';

interface WorkoutExercise {
  exerciseId: string;
  exerciseName: string;
  sets: number;
  reps: number;
  restSeconds: number;
  loadKg: number;
}

export default function WorkoutBuilderPage() {
  const { data: profile } = useGetCallerUserProfile();
  const [exercises, setExercises] = useState<WorkoutExercise[]>([]);
  const [showPicker, setShowPicker] = useState(false);

  const handleAddExercise = (exerciseId: string, exerciseName: string) => {
    setExercises([
      ...exercises,
      {
        exerciseId,
        exerciseName,
        sets: 3,
        reps: 10,
        restSeconds: 60,
        loadKg: profile ? profile.bodyweightKg * 0.08 : 5
      }
    ]);
    setShowPicker(false);
  };

  const handleRemoveExercise = (index: number) => {
    setExercises(exercises.filter((_, i) => i !== index));
  };

  const handleUpdateExercise = (index: number, field: keyof WorkoutExercise, value: number) => {
    const updated = [...exercises];
    updated[index] = { ...updated[index], [field]: value };
    setExercises(updated);
  };

  const sessionVolume = calculateSessionVolume(exercises);
  const intensityScore = profile ? calculateIntensityScore(exercises, profile.bodyweightKg) : 0;

  const handleSave = () => {
    toast.success('Workout template saved');
  };

  return (
    <div className="space-y-6 pb-24">
      <div>
        <h1 className="text-3xl font-bold">Workout Builder</h1>
        <p className="text-muted-foreground">Create custom workouts with vest load.</p>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Session Metrics</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-2 gap-4">
            <div>
              <p className="text-sm text-muted-foreground">Volume</p>
              <p className="text-2xl font-bold">{sessionVolume} kg</p>
            </div>
            <div>
              <p className="text-sm text-muted-foreground">Intensity Score</p>
              <p className="text-2xl font-bold">{intensityScore}</p>
            </div>
          </div>
        </CardContent>
      </Card>

      <div className="space-y-4">
        {exercises.map((exercise, index) => (
          <Card key={index}>
            <CardHeader>
              <div className="flex items-center justify-between">
                <CardTitle className="text-lg">{exercise.exerciseName}</CardTitle>
                <Button
                  variant="ghost"
                  size="icon"
                  onClick={() => handleRemoveExercise(index)}
                >
                  <Trash2 className="h-4 w-4" />
                </Button>
              </div>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label>Sets</Label>
                  <Input
                    type="number"
                    value={exercise.sets}
                    onChange={(e) => handleUpdateExercise(index, 'sets', parseInt(e.target.value) || 0)}
                    className="mt-1"
                  />
                </div>
                <div>
                  <Label>Reps</Label>
                  <Input
                    type="number"
                    value={exercise.reps}
                    onChange={(e) => handleUpdateExercise(index, 'reps', parseInt(e.target.value) || 0)}
                    className="mt-1"
                  />
                </div>
                <div>
                  <Label>Rest (sec)</Label>
                  <Input
                    type="number"
                    value={exercise.restSeconds}
                    onChange={(e) => handleUpdateExercise(index, 'restSeconds', parseInt(e.target.value) || 0)}
                    className="mt-1"
                  />
                </div>
                <div>
                  <Label>Load (kg)</Label>
                  <Input
                    type="number"
                    step="0.5"
                    value={exercise.loadKg}
                    onChange={(e) => handleUpdateExercise(index, 'loadKg', parseFloat(e.target.value) || 0)}
                    className="mt-1"
                  />
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      <Button
        onClick={() => setShowPicker(true)}
        variant="outline"
        className="w-full"
      >
        <Plus className="mr-2 h-4 w-4" />
        Add Exercise
      </Button>

      {exercises.length > 0 && (
        <Button
          onClick={handleSave}
          className="w-full bg-[oklch(0.488_0.243_264.376)] hover:bg-[oklch(0.4_0.243_264.376)]"
        >
          Save Template
        </Button>
      )}

      {showPicker && (
        <ExercisePicker
          onSelect={handleAddExercise}
          onClose={() => setShowPicker(false)}
        />
      )}
    </div>
  );
}
