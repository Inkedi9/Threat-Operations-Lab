import { cn, toneMap } from '../../lib/utils';

export default function StatusBadge({ tone = 'gold', children }) {
  const toneClasses = toneMap[tone] ?? toneMap.gold;

  return (
    <span
      className={cn(
        'inline-flex items-center gap-2 rounded-full border px-3 py-2 text-[10px] font-medium uppercase tracking-[0.25em]',
        toneClasses.border,
        toneClasses.bg,
        toneClasses.text,
      )}
    >
      <span className={cn('h-2 w-2 rounded-full', toneClasses.text, toneClasses.glow, 'bg-current')} />
      {children}
    </span>
  );
}
