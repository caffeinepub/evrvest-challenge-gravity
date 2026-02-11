import { SportFocus, ExperienceLevel } from '../backend';

export interface Exercise {
  id: string;
  title: string;
  sport: SportFocus;
  difficulty: 'beginner' | 'intermediate' | 'advanced' | 'elite';
  primaryMuscles: string[];
  coachingCue: string;
  imageUrl?: string;
  videoUrl?: string;
  modeMultiplier: number;
  exerciseMultiplier: number;
  modeMinPct: number;
  modeMaxPct: number;
  explanationText: string;
}

export const MOCK_EXERCISES: Exercise[] = [
  {
    id: 'ex-1',
    title: 'Weighted Vest Push-Ups',
    sport: SportFocus.bodyweight,
    difficulty: 'intermediate',
    primaryMuscles: ['Chest', 'Triceps', 'Shoulders'],
    coachingCue: 'Maintain rigid plank position. Control descent. Explosive push.',
    modeMultiplier: 0.8,
    exerciseMultiplier: 1.0,
    modeMinPct: 0.05,
    modeMaxPct: 0.12,
    explanationText: 'Push-ups with vest load challenge upper body strength and core stability. Start conservative.'
  },
  {
    id: 'ex-2',
    title: 'Weighted Vest Pull-Ups',
    sport: SportFocus.bodyweight,
    difficulty: 'advanced',
    primaryMuscles: ['Lats', 'Biceps', 'Core'],
    coachingCue: 'Full range. Dead hang to chin over bar. Control eccentric.',
    modeMultiplier: 0.7,
    exerciseMultiplier: 1.2,
    modeMinPct: 0.03,
    modeMaxPct: 0.10,
    explanationText: 'Pull-ups are high-intensity. Vest load amplifies shoulder and grip stress. Progress slowly.'
  },
  {
    id: 'ex-3',
    title: 'Weighted Vest Running',
    sport: SportFocus.running,
    difficulty: 'intermediate',
    primaryMuscles: ['Legs', 'Cardiovascular'],
    coachingCue: 'Maintain natural stride. Avoid overstriding. Monitor heart rate.',
    modeMultiplier: 1.0,
    exerciseMultiplier: 0.9,
    modeMinPct: 0.05,
    modeMaxPct: 0.15,
    explanationText: 'Running with vest increases impact forces. Build volume gradually to protect joints.'
  },
  {
    id: 'ex-4',
    title: 'HYROX SkiErg Intervals',
    sport: SportFocus.hyrox,
    difficulty: 'intermediate',
    primaryMuscles: ['Full Body', 'Cardiovascular'],
    coachingCue: 'Explosive pull. Full extension. Consistent pace.',
    modeMultiplier: 0.6,
    exerciseMultiplier: 1.0,
    modeMinPct: 0.04,
    modeMaxPct: 0.10,
    explanationText: 'SkiErg with vest challenges upper body endurance. Moderate loads maintain technique.'
  },
  {
    id: 'ex-5',
    title: 'Weighted Vest Lunges',
    sport: SportFocus.hyrox,
    difficulty: 'beginner',
    primaryMuscles: ['Quads', 'Glutes', 'Core'],
    coachingCue: 'Vertical torso. Knee tracks over toe. Drive through heel.',
    modeMultiplier: 0.9,
    exerciseMultiplier: 0.8,
    modeMinPct: 0.05,
    modeMaxPct: 0.12,
    explanationText: 'Lunges with vest load improve single-leg strength and stability. Control is key.'
  },
  {
    id: 'ex-6',
    title: 'Weighted Vest Burpees',
    sport: SportFocus.hyrox,
    difficulty: 'advanced',
    primaryMuscles: ['Full Body', 'Cardiovascular'],
    coachingCue: 'Fast transitions. Chest to deck. Explosive jump.',
    modeMultiplier: 0.7,
    exerciseMultiplier: 1.1,
    modeMinPct: 0.04,
    modeMaxPct: 0.10,
    explanationText: 'Burpees with vest are high-impact. Limit load to preserve movement quality and reduce injury risk.'
  },
  {
    id: 'ex-7',
    title: 'Incline Treadmill Walk',
    sport: SportFocus.hyrox,
    difficulty: 'beginner',
    primaryMuscles: ['Legs', 'Cardiovascular'],
    coachingCue: 'Upright posture. Controlled pace. Breathe rhythmically.',
    modeMultiplier: 1.1,
    exerciseMultiplier: 0.9,
    modeMinPct: 0.06,
    modeMaxPct: 0.15,
    explanationText: 'Incline walking with vest builds aerobic base and leg endurance with lower impact than running.'
  },
  {
    id: 'ex-8',
    title: 'Stairmaster Progression',
    sport: SportFocus.hyrox,
    difficulty: 'intermediate',
    primaryMuscles: ['Legs', 'Glutes', 'Cardiovascular'],
    coachingCue: 'Full step. Upright torso. Steady rhythm.',
    modeMultiplier: 1.0,
    exerciseMultiplier: 0.95,
    modeMinPct: 0.05,
    modeMaxPct: 0.14,
    explanationText: 'Stairmaster with vest challenges leg endurance and cardiovascular capacity. Moderate loads recommended.'
  },
  {
    id: 'ex-9',
    title: 'Trail Hiking',
    sport: SportFocus.trail,
    difficulty: 'beginner',
    primaryMuscles: ['Legs', 'Core', 'Cardiovascular'],
    coachingCue: 'Stable footing. Controlled descent. Enjoy the terrain.',
    modeMultiplier: 1.2,
    exerciseMultiplier: 0.85,
    modeMinPct: 0.06,
    modeMaxPct: 0.16,
    explanationText: 'Trail hiking with vest builds endurance and stability on uneven terrain. Start with familiar trails.'
  },
  {
    id: 'ex-10',
    title: 'Weighted Vest Squats',
    sport: SportFocus.gym,
    difficulty: 'intermediate',
    primaryMuscles: ['Quads', 'Glutes', 'Core'],
    coachingCue: 'Depth to parallel. Chest up. Drive through heels.',
    modeMultiplier: 0.8,
    exerciseMultiplier: 1.0,
    modeMinPct: 0.05,
    modeMaxPct: 0.12,
    explanationText: 'Squats with vest load increase core demand and leg strength. Maintain form under fatigue.'
  }
];

export function getExerciseById(id: string): Exercise | undefined {
  return MOCK_EXERCISES.find(ex => ex.id === id);
}

export function filterExercises(
  exercises: Exercise[],
  sport?: SportFocus,
  difficulty?: string
): Exercise[] {
  return exercises.filter(ex => {
    if (sport && ex.sport !== sport) return false;
    if (difficulty && ex.difficulty !== difficulty) return false;
    return true;
  });
}
