import { useParams, useNavigate } from '@tanstack/react-router';
import { getExerciseById } from '../lib/exercises';
import { useGetCallerUserProfile } from '../hooks/useCurrentUser';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { ArrowLeft } from 'lucide-react';
import LoadRecommendationCard from '../components/exercises/LoadRecommendationCard';
import MediaPlaceholder from '../components/exercises/MediaPlaceholder';

export default function ExerciseDetailPage() {
  const { exerciseId } = useParams({ from: '/exercises/$exerciseId' });
  const navigate = useNavigate();
  const { data: profile } = useGetCallerUserProfile();
  
  const exercise = getExerciseById(exerciseId);

  if (!exercise) {
    return (
      <div className="flex min-h-[50vh] items-center justify-center">
        <p className="text-muted-foreground">Exercise not found.</p>
      </div>
    );
  }

  return (
    <div className="space-y-6 pb-24">
      <Button
        variant="ghost"
        onClick={() => navigate({ to: '/exercises' })}
        className="mb-4"
      >
        <ArrowLeft className="mr-2 h-4 w-4" />
        Back to Exercises
      </Button>

      <div>
        <div className="mb-4 flex items-start justify-between">
          <div>
            <h1 className="text-3xl font-bold">{exercise.title}</h1>
            <div className="mt-2 flex gap-2">
              <Badge variant="outline" className="capitalize">
                {exercise.sport}
              </Badge>
              <Badge variant="secondary" className="capitalize">
                {exercise.difficulty}
              </Badge>
            </div>
          </div>
        </div>

        <MediaPlaceholder type="image" label="Exercise demonstration" />
      </div>

      {profile && (
        <LoadRecommendationCard
          exercise={exercise}
          bodyweightKg={profile.bodyweightKg}
          experienceLevel={profile.experienceLevel}
        />
      )}

      <div className="space-y-4">
        <div>
          <h3 className="mb-2 font-bold">Primary Muscles</h3>
          <div className="flex flex-wrap gap-2">
            {exercise.primaryMuscles.map((muscle) => (
              <Badge key={muscle} variant="outline">
                {muscle}
              </Badge>
            ))}
          </div>
        </div>

        <div>
          <h3 className="mb-2 font-bold">Coaching Cue</h3>
          <p className="text-muted-foreground">{exercise.coachingCue}</p>
        </div>

        <MediaPlaceholder type="video" label="Technique video" />
      </div>
    </div>
  );
}
