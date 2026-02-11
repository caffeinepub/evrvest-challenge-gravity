import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import type { Exercise } from '../../lib/exercises';

interface ExerciseCardProps {
  exercise: Exercise;
  onClick: () => void;
}

export default function ExerciseCard({ exercise, onClick }: ExerciseCardProps) {
  return (
    <Card className="cursor-pointer transition-all hover:border-[oklch(0.488_0.243_264.376)]" onClick={onClick}>
      <CardHeader>
        <CardTitle className="text-lg">{exercise.title}</CardTitle>
        <div className="flex gap-2">
          <Badge variant="outline" className="capitalize">
            {exercise.sport}
          </Badge>
          <Badge variant="secondary" className="capitalize">
            {exercise.difficulty}
          </Badge>
        </div>
      </CardHeader>
      <CardContent>
        <p className="text-sm text-muted-foreground line-clamp-2">{exercise.coachingCue}</p>
      </CardContent>
    </Card>
  );
}
