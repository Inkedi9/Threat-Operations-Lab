export default function SectionHeading({ title, subtitle }) {
  return (
    <div className="mb-4 flex items-center justify-between gap-4">
      <h2 className="text-lg font-semibold tracking-tight text-ivory sm:text-xl">{title}</h2>
      <span className="text-xs text-muted">{subtitle}</span>
    </div>
  );
}
