import { Card, CardContent } from '@/lib/ui/Card';
import { ExternalLink } from 'lucide-react';
import type { GdeltArticle } from '@/lib/gdelt';
import { articleDate } from '@/lib/gdelt';

function relTime(d: Date): string {
  const s = Math.floor((Date.now() - d.getTime()) / 1000);
  if (s < 60) return `${s}s ago`;
  if (s < 3600) return `${Math.floor(s / 60)}m ago`;
  if (s < 86400) return `${Math.floor(s / 3600)}h ago`;
  return `${Math.floor(s / 86400)}d ago`;
}

export function NewsCard({ article }: { article: GdeltArticle }) {
  const date = articleDate(article);
  return (
    <a href={article.url} target="_blank" rel="noreferrer" className="block transition-colors duration-150 ease-out">
      <Card className="transition-colors duration-150 ease-out hover:border-primary/40">
        <CardContent className="flex items-start justify-between gap-4 py-4">
          <div className="space-y-1.5">
            <p className="text-body leading-snug text-foreground">{article.title}</p>
            <div className="flex items-center gap-2 text-micro text-muted-foreground">
              <span className="font-mono">{article.domain}</span>
              <span>&middot;</span>
              <span className="tabular-nums">{relTime(date)}</span>
            </div>
          </div>
          <ExternalLink size={16} className="mt-1 shrink-0 text-muted-foreground" />
        </CardContent>
      </Card>
    </a>
  );
}
