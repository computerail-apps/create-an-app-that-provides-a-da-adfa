import { useQuery } from '@tanstack/react-query';
import { Container } from '@/lib/ui/Container';
import { Card, CardContent } from '@/lib/ui/Card';
import { CenteredSpinner } from '@/lib/ui/Spinner';
import { Alert, AlertTitle, AlertDescription } from '@/lib/ui/Alert';
import { Button } from '@/lib/ui/Button';
import { EmptyState } from '@/lib/ui/EmptyState';
import { TrendBadge } from '@/components/TrendBadge';
import { Sparkline } from '@/components/Sparkline';
import { TRACKED_SERIES } from '@/lib/series';
import { fetchObservations } from '@/lib/fred';
import { computeTrend } from '@/lib/trend';
import { CalendarRange } from 'lucide-react';

export default function WeeklySummary() {
  const { data, isLoading, error, refetch } = useQuery({
    queryKey: ['fred-weekly-summary'],
    queryFn: async () => {
      const results = await Promise.all(
        TRACKED_SERIES.map(async (s) => {
          const obs = await fetchObservations(s.id, 24);
          return { series: s, trend: computeTrend(obs) };
        })
      );
      return results;
    },
    staleTime: 10 * 60 * 1000,
  });

  return (
    <Container>
      <div className="space-y-8">
        <div className="space-y-2">
          <h1 className="text-display text-foreground">Weekly Summary</h1>
          <p className="max-w-2xl text-body text-muted-foreground">
            Period-over-period change for each tracked indicator, computed directly from the latest FRED
            observations — real deltas, no invented narrative.
          </p>
        </div>

        {isLoading ? (
          <CenteredSpinner label="Computing weekly deltas" />
        ) : error ? (
          <Alert variant="destructive">
            <AlertTitle>Couldn&apos;t load weekly data</AlertTitle>
            <AlertDescription className="flex flex-col gap-3">
              <span>{(error as Error).message}</span>
              <Button size="sm" variant="outline" onClick={() => refetch()}>Try again</Button>
            </AlertDescription>
          </Alert>
        ) : !data || data.length === 0 ? (
          <EmptyState icon={<CalendarRange size={20} />} title="No data available" description="FRED returned no observations for the tracked indicators." />
        ) : (
          <Card>
            <CardContent className="divide-y divide-border p-0">
              {data.map(({ series, trend }) => (
                <div key={series.id} className="flex flex-wrap items-center gap-4 px-6 py-4">
                  <div className="min-w-[180px] flex-1">
                    <div className="text-body text-foreground">{series.label}</div>
                    <div className="text-micro text-muted-foreground">{series.frequencyLabel} · {series.unit}</div>
                  </div>
                  {trend ? (
                    <>
                      <div className="text-right tabular-nums">
                        <div className="text-body text-foreground">
                          {trend.latest.value.toLocaleString(undefined, { maximumFractionDigits: 2 })}
                        </div>
                        <div className="text-micro text-muted-foreground">
                          prev {trend.previous.value.toLocaleString(undefined, { maximumFractionDigits: 2 })}
                        </div>
                      </div>
                      <div className="w-24 text-right tabular-nums text-small text-muted-foreground">
                        {trend.change >= 0 ? '+' : ''}{trend.change.toLocaleString(undefined, { maximumFractionDigits: 2 })}
                        {trend.percentChange !== null && (
                          <div className="text-micro">
                            {trend.percentChange >= 0 ? '+' : ''}{trend.percentChange.toFixed(2)}%
                          </div>
                        )}
                      </div>
                      <Sparkline data={trend.sparkline} direction={trend.direction} />
                      <div className="flex flex-col items-end gap-1">
                        <TrendBadge direction={trend.direction} label={trend.direction === 'up' ? 'Rising' : trend.direction === 'down' ? 'Falling' : 'Flat'} />
                        <span className="text-micro text-muted-foreground">{trend.accelerationLabel}</span>
                      </div>
                    </>
                  ) : (
                    <span className="text-small text-muted-foreground">Not enough history yet</span>
                  )}
                </div>
              ))}
            </CardContent>
          </Card>
        )}
      </div>
    </Container>
  );
}
