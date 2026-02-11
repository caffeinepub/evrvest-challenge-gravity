import { ExperienceLevel } from '../backend';

export function getExperienceBasePercentage(level: ExperienceLevel): number {
  switch (level) {
    case ExperienceLevel.beginner:
      return 0.06;
    case ExperienceLevel.intermediate:
      return 0.09;
    case ExperienceLevel.advanced:
      return 0.12;
    case ExperienceLevel.elite:
      return 0.15;
    default:
      return 0.06;
  }
}

export function calculateRecommendedLoadRange(
  bodyweightKg: number,
  experienceLevel: ExperienceLevel
): { min: number; max: number; warning?: string } {
  const basePercent = getExperienceBasePercentage(experienceLevel);
  
  let minPercent: number;
  let maxPercent: number;
  let warning: string | undefined;

  switch (experienceLevel) {
    case ExperienceLevel.beginner:
      minPercent = 0.05;
      maxPercent = 0.08;
      break;
    case ExperienceLevel.intermediate:
      minPercent = 0.08;
      maxPercent = 0.12;
      break;
    case ExperienceLevel.advanced:
      minPercent = 0.10;
      maxPercent = 0.15;
      break;
    case ExperienceLevel.elite:
      minPercent = 0.15;
      maxPercent = 0.20;
      warning = 'Elite loads up to 20% bodyweight require advanced conditioning and proper progression.';
      break;
    default:
      minPercent = 0.05;
      maxPercent = 0.08;
  }

  return {
    min: Math.round(bodyweightKg * minPercent * 2) / 2,
    max: Math.round(bodyweightKg * maxPercent * 2) / 2,
    warning
  };
}
