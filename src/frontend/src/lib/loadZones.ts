export type LoadZone = 'green' | 'yellow' | 'red';

export function getLoadZone(load: number, safeMax: number): LoadZone {
  if (load <= safeMax) return 'green';
  if (load <= safeMax * 1.15) return 'yellow';
  return 'red';
}

export function getZoneStatusText(zone: LoadZone): string {
  switch (zone) {
    case 'green':
      return 'Optimal load for this movement.';
    case 'yellow':
      return 'Advanced load. Increased fatigue and tendon stress.';
    case 'red':
      return 'High injury risk for this activity.';
  }
}

export function getZoneColor(zone: LoadZone): string {
  switch (zone) {
    case 'green':
      return 'oklch(0.696 0.17 162.48)';
    case 'yellow':
      return 'oklch(0.828 0.189 84.429)';
    case 'red':
      return 'oklch(0.704 0.191 22.216)';
  }
}
