import { Area, AreaChart, CartesianGrid, ResponsiveContainer, Tooltip, XAxis, YAxis } from 'recharts';
import { activitySeries } from '../../data/intelData';
import SectionHeading from '../ui/SectionHeading';

export default function ActivityChart() {
  return (
    <section className="panel rounded-[1.9rem] p-6">
      <SectionHeading title="Correlation Activity" subtitle="campaign / artifact trend" />
      <div className="h-80 text-xs">
        <ResponsiveContainer width="100%" height="100%">
          <AreaChart data={activitySeries}>
            <defs>
              <linearGradient id="correlatedFill" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor="rgba(221,183,106,0.85)" stopOpacity={0.7} />
                <stop offset="95%" stopColor="rgba(221,183,106,0)" stopOpacity={0} />
              </linearGradient>
              <linearGradient id="maliciousFill" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor="rgba(255,108,95,0.8)" stopOpacity={0.55} />
                <stop offset="95%" stopColor="rgba(255,108,95,0)" stopOpacity={0} />
              </linearGradient>
            </defs>
            <CartesianGrid stroke="rgba(255,255,255,0.07)" vertical={false} />
            <XAxis dataKey="week" tick={{ fill: '#ad9f87', fontSize: 12 }} axisLine={false} tickLine={false} />
            <YAxis tick={{ fill: '#ad9f87', fontSize: 12 }} axisLine={false} tickLine={false} />
            <Tooltip
              contentStyle={{
                background: 'rgba(9,9,10,0.94)',
                border: '1px solid rgba(221,183,106,0.18)',
                borderRadius: '16px',
                color: '#f6efdf',
              }}
            />
            <Area type="monotone" dataKey="correlated" stroke="rgba(221,183,106,0.95)" fill="url(#correlatedFill)" strokeWidth={2.2} />
            <Area type="monotone" dataKey="malicious" stroke="rgba(255,108,95,0.95)" fill="url(#maliciousFill)" strokeWidth={2} />
          </AreaChart>
        </ResponsiveContainer>
      </div>
    </section>
  );
}
