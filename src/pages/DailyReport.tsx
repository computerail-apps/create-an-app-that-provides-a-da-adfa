import { useQuery } from '@tanstack/react-query';
import { Container } from '@/lib/ui/Container';
import { CenteredSpinner } from '@/lib/ui/Spinner';
import { Alert, AlertTitle, AlertDescription } from '@/lib/ui/Alert';
import { Button } from '@/lib/ui/Button';
import { TopicSection } from '@/components/TopicSection';
import { fetchDailyReport, TOPICS } from '@/lib/gdelt';
import { RefreshCw } from 'lucide-react';

export default function DailyReport() {
  const { data, isLoading, error, refetch, isFetching } = useQuery({
    queryKey: ['gdelt-daily-report'],
    queryFn: fetchDailyReport,
    staleTime: 5 * 60 * 1000,
  });

  return (
    <Container>
      <div className="space-y-8">
        <div className="flex flex-wrap items-start justify-between gap-4">
          <div className="space-y-2">
            <h1 className="text-display text-foreground">Daily Report</h1>
            <p className="max-w-2xl text-body text-muted-foreground">
              Today&apos;s global economic headlines, pulled live from GDELT and grouped by topic — inflation, trade,
              central banks and markets.
            </p>
          </div>
          <Button variant="secondary" size="sm" onClick={() => refetch()} disabled={isFetching}>
            <RefreshCw size={16} className={isFetching ? 'animate-spin' : ''} />
            Refresh
          </Button>
        </div>

        {isLoading ? (
          <CenteredSpinner label="Loading today's headlines" />
        ) : error ? (
          <Alert variant="destructive">
            <AlertTitle>Couldn&apos;t load headlines</AlertTitle>
            <AlertDescription className="flex flex-col gap-3">
              <span>{(error as Error).message}</span>
              <Button size="sm" variant="outline" onClick={() => refetch()}>Try again</Button>
            </AlertDescription>
          </Alert>
        ) : (
          <div className="space-y-10">
            {TOPICS.map((topic) => (
              <TopicSection key={topic} topic={topic} articles={data?.[topic] ?? []} />
            ))}
          </div>
        )}
      </div>
    </Container>
  );
}
