import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { Container } from '@/lib/ui/Container';
import { Card, CardHeader, CardTitle, CardDescription, CardContent, CardFooter } from '@/lib/ui/Card';
import { CenteredSpinner } from '@/lib/ui/Spinner';
import { Alert, AlertTitle, AlertDescription } from '@/lib/ui/Alert';
import { Button } from '@/lib/ui/Button';
import { Badge } from '@/lib/ui/Badge';
import { SeriesHistoryChart } from '@/components/SeriesHistoryChart';
import { TRACKED_SERIES } from '@/lib/series';
import { fetchObservations, fetchSeriesMeta } from '@/lib/fred';
import { computeTrend } from '@/lib/trend';
import { TrendBadge } from '@/components/TrendBadge';
import { supabase, getUserId, WATCHLIST_TABLE } from '@/lib/supabase';
import { Bookmark, BookmarkCheck } from 'lucide-react';

function SeriesCard({ seriesId, label, unit, frequencyLabel, description }: { seriesId: string; label: string; unit: string; frequencyLabel: string; description: string }) {
  const qc = useQueryClient();
  const { data, isLoading, error, refetch } = useQuery({
    queryKey: ['fred-series', seriesId],
    queryFn: async () => {
      const [obs, meta] = await Promise.all([fetchObservations(seriesId, 60), fetchSeriesMeta(seriesId)]);
      return { obs, meta };
    },
    staleTime: 10 * 60 * 1000,
  });

  const { data: watchlisted } = useQuery({
    queryKey: ['watchlist-check', seriesId],
    queryFn: async () => {
      const userId = await getUserId();
      const { data, error } = await supabase
        .from(WATCHLIST_TABLE)
        .select('id')
        .eq('user_id', userId)
        .eq('series_id', seriesId)
        .limit(1);
      if (error) throw error;
      return (data ?? []).length > 0;
    },
  });

  const bookmark = useMutation({
    mutationFn: async () => {
      const userId = await getUserId();
      const { error } = await supabase.from(WATCHLIST_TABLE).insert({ user_id: userId, series_id: seriesId, label });
      if (error) throw error;
    },
    onSuccess: () => qc.invalidateQueries({ queryKey: ['watchlist-check', seriesId] }),
  });

  const trend = data ? computeTrend(data.obs) : null;

  return (
    <Card>
      <CardHeader className="flex flex-row items-start justify-between gap-4">
        <div>
          <CardTitle>{label}</CardTitle>
          <CardDescription>{description}</CardDescription>
        </div>
        <Button
          variant={watchlisted ? 'secondary' : 'ghost'}
          size="sm"
          onClick={() => bookmark.mutate()}
          disabled={bookmark.isPending || !!watchlisted}
          aria-label="Bookmark series"
        >
          {watchlisted ? <BookmarkCheck size={16} /> : <Bookmark size={16} />}
          <span className="hidden sm:inline">{watchlisted ? 'Watching' : 'Watch'}</span>
        </Button>
      </CardHeader>
      <CardContent className="space-y-4">
        {isLoading ? (
          <CenteredSpinner label="Loading series" />
        ) : error ? (
          <Alert variant="destructive">
            <AlertTitle>Couldn&apos;t load {label}</AlertTitle>
            <AlertDescription className="flex flex-col gap-3">
              <span>{(error as Error).message}</span>
              <Button size="sm" variant="outline" onClick={() => refetch()}>Try again</Button>
            </AlertDescription>
          </Alert>
        ) : (
          <>
            <div className="flex flex-wrap items-baseline gap-3">
              <span className="text-h1 tabular-nums text-foreground">
                {data?.obs[data.obs.length - 1]?.value.toLocaleString(undefined, { maximumFractionDigits: 2 })}
              </span>
              <span className="text-small text-muted-foreground">{unit}</span>
              {trend && <TrendBadge direction={trend.direction} />}
            </div>
            <SeriesHistoryChart data={data?.obs ?? []} />
          </>
        )}
      </CardContent>
      <CardFooter className="flex items-center justify-between text-micro text-muted-foreground">
        <span>{frequencyLabel}</span>
        <span>Last updated: {data?.meta.lastUpdated ? data.meta.lastUpdated.slice(0, 16) : '—'}</span>
      </CardFooter>
    </Card>
  );
}

export default function MacroDashboard() {
  return (
    <Container>
      <div className="space-y-8">
        <div className="space-y-2">
          <h1 className="text-display text-foreground">Macro Dashboard</h1>
          <p className="max-w-2xl text-body text-muted-foreground">
            Live US macroeconomic indicators sourced directly from the Federal Reserve&apos;s FRED database.
            Bookmark any series to track it on your watchlist.
          </p>
        </div>
        <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
          {TRACKED_SERIES.map((s) => (
            <SeriesCard key={s.id} seriesId={s.id} label={s.label} unit={s.unit} frequencyLabel={s.frequencyLabel} description={s.description} />
          ))}
        </div>
      </div>
    </Container>
  );
}
