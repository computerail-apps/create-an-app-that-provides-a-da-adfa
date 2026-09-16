import { Badge } from '@/lib/ui/Badge';
import { ArrowUpRight, ArrowDownRight, Minus } from 'lucide-react';
import type { Direction } from '@/lib/trend';

export function TrendBadge({ direction, label }: { direction: Direction; label?: string }) {
  if (direction === 'up') {
    return (
      <Badge variant="destructive">
        <ArrowUpRight size={12} className="mr-1" />{label ?? 'Rising'}
      </Badge>
    );
  }
  if (direction === 'down') {
    return (
      <Badge variant="success">
        <ArrowDownRight size={12} className="mr-1" />{label ?? 'Falling'}
      </Badge>
    );
  }
  return (
    <Badge variant="outline">
      <Minus size={12} className="mr-1" />{label ?? 'Flat'}
    </Badge>
  );
}
