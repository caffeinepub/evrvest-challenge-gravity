import type { ExperienceLevel } from '../backend';
import { getExperienceBasePercentage } from './loadAlgorithms';

export interface ExerciseDynamicLoadConfig {
  modeMultiplier: number;
  exerciseMultiplier: number;
  modeMinPct: number;
  modeMaxPct: number;
  explanationText: string;
}

export function calculateDynamicLoad(
  bodyweightKg: number,
  experienceLevel: ExperienceLevel,
  config: ExerciseDynamicLoadConfig
): {
  recommendedLoad: number;
  safeMin: number;
  safeMax: number;
} {
  const basePercent = getExperienceBasePercentage(experienceLevel);
  const baseLoad = bodyweightKg * basePercent;
  
  const recRaw = baseLoad * config.modeMultiplier * config.exerciseMultiplier;
  
  const safeMin = bodyweightKg * config.modeMinPct;
  const safeMax = bodyweightKg * config.modeMaxPct;
  
  let recommendedLoad = Math.max(safeMin, Math.min(recRaw, safeMax));
  
  const globalMax = bodyweightKg * 0.20;
  if (recommendedLoad > globalMax) {
    recommendedLoad = globalMax;
  }
  
  return {
    recommendedLoad: Math.round(recommendedLoad * 2) / 2,
    safeMin: Math.round(safeMin * 2) / 2,
    safeMax: Math.round(safeMax * 2) / 2
  };
}
