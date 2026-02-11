import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Slider } from '@/components/ui/slider';
import { calculateDynamicLoad } from '../../lib/dynamicLoad';
import { getLoadZone, getZoneStatusText, getZoneColor } from '../../lib/loadZones';
import type { Exercise } from '../../lib/exercises';
import type { ExperienceLevel } from '../../backend';

interface LoadRecommendationCardProps {
  exercise: Exercise;
  bodyweightKg: number;
  experienceLevel: ExperienceLevel;
}

export default function LoadRecommendationCard({
  exercise,
  bodyweightKg,
  experienceLevel
}: LoadRecommendationCardProps) {
  const { recommendedLoad, safeMin, safeMax } = calculateDynamicLoad(bodyweightKg, experienceLevel, {
    modeMultiplier: exercise.modeMultiplier,
    exerciseMultiplier: exercise.exerciseMultiplier,
    modeMinPct: exercise.modeMinPct,
    modeMaxPct: exercise.modeMaxPct,
    explanationText: exercise.explanationText
  });

  const [manualLoad, setManualLoad] = useState(recommendedLoad);
  const zone = getLoadZone(manualLoad, safeMax);
  const statusText = getZoneStatusText(zone);
  const zoneColor = getZoneColor(zone);

  const maxSlider = safeMax * 1.3;

  return (
    <Card className="border-[oklch(0.488_0.243_264.376)]">
      <CardHeader>
        <CardTitle>Load Recommendation</CardTitle>
      </CardHeader>
      <CardContent className="space-y-6">
        <div className="text-center">
          <div className="text-5xl font-bold" style={{ color: zoneColor }}>
            {manualLoad} kg
          </div>
          <div className="mt-2 text-sm text-muted-foreground">
            Safe range: {safeMin}–{safeMax} kg
          </div>
        </div>

        <div className="space-y-2">
          <Slider
            value={[manualLoad]}
            onValueChange={(v) => setManualLoad(Math.round(v[0] * 2) / 2)}
            min={0}
            max={maxSlider}
            step={0.5}
            className="w-full"
          />
          <div className="flex justify-between text-xs text-muted-foreground">
            <span>0 kg</span>
            <span className="text-[oklch(0.696_0.17_162.48)]">{safeMax} kg</span>
            <span>{Math.round(maxSlider)} kg</span>
          </div>
        </div>

        <div
          className="rounded-lg p-4 text-center text-sm font-medium"
          style={{ backgroundColor: `${zoneColor}20`, color: zoneColor }}
        >
          {statusText}
        </div>

        <div className="rounded-lg bg-muted p-4">
          <p className="text-sm selectable-text">{exercise.explanationText}</p>
        </div>
      </CardContent>
    </Card>
  );
}
