export default function TagChip({ children, mono = false }) {
  return (
    <span
      className={`rounded-full border border-gold/14 bg-white/4 px-3 py-1.5 text-[11px] text-ivory ${mono ? 'font-mono' : ''}`}
    >
      {children}
    </span>
  );
}
