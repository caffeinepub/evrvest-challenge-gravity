import { useState } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { MOCK_EXERCISES } from '../../lib/exercises';
import { Search } from 'lucide-react';

interface ExercisePickerProps {
  onSelect: (exerciseId: string, exerciseName: string) => void;
  onClose: () => void;
}

export default function ExercisePicker({ onSelect, onClose }: ExercisePickerProps) {
  const [search, setSearch] = useState('');

  const filteredExercises = MOCK_EXERCISES.filter((ex) =>
    ex.title.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <Dialog open onOpenChange={onClose}>
      <DialogContent className="max-w-2xl max-h-[80vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>Select Exercise</DialogTitle>
        </DialogHeader>

        <div className="relative">
          <Search className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
          <Input
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search exercises..."
            className="pl-9"
          />
        </div>

        <div className="space-y-2">
          {filteredExercises.map((exercise) => (
            <Button
              key={exercise.id}
              variant="outline"
              className="w-full justify-start"
              onClick={() => onSelect(exercise.id, exercise.title)}
            >
              {exercise.title}
            </Button>
          ))}
        </div>
      </DialogContent>
    </Dialog>
  );
}
