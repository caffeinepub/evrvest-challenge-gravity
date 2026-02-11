export interface WorkoutExercise {
  exerciseId: string;
  sets: number;
  reps: number;
  restSeconds: number;
  loadKg: number;
}

export function calculateSessionVolume(exercises: WorkoutExercise[]): number {
  return exercises.reduce((total, ex) => {
    return total + (ex.sets * ex.reps * ex.loadKg);
  }, 0);
}

export function calculateIntensityScore(exercises: WorkoutExercise[], bodyweightKg: number): number {
  if (exercises.length === 0) return 0;
  
  const avgLoadPercent = exercises.reduce((sum, ex) => {
    return sum + (ex.loadKg / bodyweightKg);
  }, 0) / exercises.length;
  
  const totalSets = exercises.reduce((sum, ex) => sum + ex.sets, 0);
  
  const score = (avgLoadPercent * 100) * (totalSets / 10);
  
  return Math.round(score * 10) / 10;
}
