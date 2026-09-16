import { CardTitle, CardDescription } from '@/lib/ui/Card';
import { EmptyState } from '@/lib/ui/EmptyState';
import { NewsCard } from '@/components/NewsCard';
import { Newspaper } from 'lucide-react';
import type { GdeltArticle } from '@/lib/gdelt';

export function TopicSection({ topic, articles }: { topic: string; articles: GdeltArticle[] }) {
  return (
    <section className="space-y-3">
      <div>
        <CardTitle className="text-h3">{topic}</CardTitle>
        <CardDescription>{articles.length} headline{articles.length === 1 ? '' : 's'} in the last 2 days</CardDescription>
      </div>
      {articles.length === 0 ? (
        <EmptyState icon={<Newspaper size={20} />} title="No headlines found" description="GDELT has no recent coverage for this topic right now." />
      ) : (
        <div className="space-y-2">
          {articles.map((a) => (
            <NewsCard key={a.url} article={a} />
          ))}
        </div>
      )}
    </section>
  );
}
