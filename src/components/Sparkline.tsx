import { LineChart, Line, ResponsiveContainer, YAxis } from 'recharts';
import type { FredObservation } from '@/lib/fred';

export function Sparkline({ data, direction }: { data: FredObservation[]; direction: 'up' | 'down' | 'flat' }) {
  const stroke = direction === 'up' ? '#f87171' : direction === 'down' ? '#34d399' : '#94a3b8';
  return (
    <div className="h-10 w-28">
      <ResponsiveContainer width="100%" height="100%">
        <LineChart data={data}>
          <YAxis hide domain={['dataMin', 'dataMax']} />
          <Line type="monotone" dataKey="value" stroke={stroke} strokeWidth={2} dot={false} isAnimationActive={false} />
        </LineChart>
      </ResponsiveContainer>
    </div>
  );
}
