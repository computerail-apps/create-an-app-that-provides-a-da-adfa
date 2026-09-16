const BASE = 'https://api.stlouisfed.org/fred';

export interface FredObservation {
  date: string;
  value: number;
}

export interface FredSeriesMeta {
  title: string;
  lastUpdated: string;
  units: string;
}

function apiKey(): string {
  const key = import.meta.env.VITE_FRED_API_KEY as string | undefined;
  if (!key) {
    throw new Error(
      'Missing FRED API key. Set VITE_FRED_API_KEY in your environment to load live Federal Reserve data.'
    );
  }
  return key;
}

/**
 * Returns the most recent `limit` observations for a series, ascending by date
 * (oldest first) so they can be charted directly.
 */
export async function fetchObservations(seriesId: string, limit = 60): Promise<FredObservation[]> {
  const params = new URLSearchParams({
    series_id: seriesId,
    api_key: apiKey(),
    file_type: 'json',
    sort_order: 'desc',
    limit: String(limit),
  });
  const res = await fetch(`${BASE}/series/observations?${params.toString()}`);
  if (!res.ok) {
    throw new Error(`FRED request failed (${res.status}) for ${seriesId}`);
  }
  const json = await res.json();
  const raw = (json.observations ?? []) as Array<{ date: string; value: string }>;
  return raw
    .filter((o) => o.value !== '.')
    .map((o) => ({ date: o.date, value: Number(o.value) }))
    .reverse();
}

export async function fetchSeriesMeta(seriesId: string): Promise<FredSeriesMeta> {
  const params = new URLSearchParams({
    series_id: seriesId,
    api_key: apiKey(),
    file_type: 'json',
  });
  const res = await fetch(`${BASE}/series?${params.toString()}`);
  if (!res.ok) {
    throw new Error(`FRED metadata request failed (${res.status}) for ${seriesId}`);
  }
  const json = await res.json();
  const s = json.seriess?.[0];
  return {
    title: s?.title ?? seriesId,
    lastUpdated: s?.last_updated ?? '',
    units: s?.units ?? '',
  };
}
