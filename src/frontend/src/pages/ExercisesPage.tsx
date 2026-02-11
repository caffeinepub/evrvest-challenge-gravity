import { useState } from 'react';
import { useNavigate } from '@tanstack/react-router';
import { MOCK_EXERCISES, filterExercises } from '../lib/exercises';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import ExerciseCard from '../components/exercises/ExerciseCard';
import PullToRefresh from '../components/refresh/PullToRefresh';
import type { SportFocus } from '../backend';

export default function ExercisesPage() {
  const navigate = useNavigate();
  const [sportFilter, setSportFilter] = useState<SportFocus | 'all'>('all');
  const [difficultyFilter, setDifficultyFilter] = useState<string>('all');

  const filteredExercises = filterExercises(
    MOCK_EXERCISES,
    sportFilter === 'all' ? undefined : sportFilter,
    difficultyFilter === 'all' ? undefined : difficultyFilter
  );

  const handleRefresh = async () => {
    await new Promise(resolve => setTimeout(resolve, 1000));
  };

  return (
    <PullToRefresh onRefresh={handleRefresh}>
      <div className="space-y-6 pb-24">
        <div>
          <h1 className="text-3xl font-bold">Exercises</h1>
          <p className="text-muted-foreground">Exercise catalog with load guidance.</p>
        </div>

        <div className="grid gap-4 sm:grid-cols-2">
          <div>
            <Select value={sportFilter} onValueChange={(v) => setSportFilter(v as SportFocus | 'all')}>
              <SelectTrigger>
                <SelectValue placeholder="Filter by sport" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Sports</SelectItem>
                <SelectItem value="hyrox">HYROX</SelectItem>
                <SelectItem value="bodyweight">Bodyweight</SelectItem>
                <SelectItem value="running">Running</SelectItem>
                <SelectItem value="trail">Trail</SelectItem>
                <SelectItem value="gym">Gym</SelectItem>
                <SelectItem value="rehab">Rehab</SelectItem>
                <SelectItem value="general">General</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div>
            <Select value={difficultyFilter} onValueChange={setDifficultyFilter}>
              <SelectTrigger>
                <SelectValue placeholder="Filter by difficulty" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Levels</SelectItem>
                <SelectItem value="beginner">Beginner</SelectItem>
                <SelectItem value="intermediate">Intermediate</SelectItem>
                <SelectItem value="advanced">Advanced</SelectItem>
                <SelectItem value="elite">Elite</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>

        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {filteredExercises.map((exercise) => (
            <ExerciseCard
              key={exercise.id}
              exercise={exercise}
              onClick={() => navigate({ to: `/exercises/${exercise.id}` })}
            />
          ))}
        </div>

        {filteredExercises.length === 0 && (
          <div className="py-12 text-center text-muted-foreground">
            No exercises match your filters.
          </div>
        )}
      </div>
    </PullToRefresh>
  );
}
