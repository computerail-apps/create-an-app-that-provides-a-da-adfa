import type { FredObservation } from './fred';

export type Direction = 'up' | 'down' | 'flat';

export interface TrendResult {
  latest: FredObservation;
  previous: FredObservation;
  change: number;
  percentChange: number | null;
  direction: Direction;
  accelerationLabel: string;
  sparkline: FredObservation[];
}

/**
 * Computes a real period-over-period trend from FRED observations.
 * No invented commentary — direction, magnitude and acceleration are all
 * derived arithmetically from the observed values.
 */
export function computeTrend(obs: FredObservation[]): TrendResult | null {
  if (obs.length < 2) return null;
  const sparkline = obs.slice(-12);
  const latest = obs[obs.length - 1];
  const previous = obs[obs.length - 2];
  const change = latest.value - previous.value;
  const percentChange = previous.value !== 0 ? (change / Math.abs(previous.value)) * 100 : null;
  const epsilon = Math.abs(previous.value) * 0.0005;
  const direction: Direction = Math.abs(change) <= epsilon ? 'flat' : change > 0 ? 'up' : 'down';

  let accelerationLabel = 'Not enough history';
  if (obs.length >= 3) {
    const prior = obs[obs.length - 3];
    const priorChange = previous.value - prior.value;
    const delta2 = Math.abs(change) - Math.abs(priorChange);
    if (direction === 'flat') {
      accelerationLabel = 'Holding steady';
    } else {
      accelerationLabel = delta2 > 0 ? 'Accelerating' : delta2 < 0 ? 'Decelerating' : 'Steady pace';
    }
  }

  return { latest, previous, change, percentChange, direction, accelerationLabel, sparkline };
}
