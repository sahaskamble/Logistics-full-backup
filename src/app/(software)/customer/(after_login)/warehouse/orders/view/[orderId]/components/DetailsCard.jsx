export default function DetailCard({ label, value, full = false, color = 'foreground', status = false }) {
  if (!value) return null;

  const colorMap = {
    foreground: 'text-[color:var(--foreground)]',
    primary: 'text-[color:var(--primary)]',
    secondary: 'text-[color:var(--secondary)]',
  };

  return (
    <div className={`space-y-1 ${full ? 'col-span-1 md:col-span-2' : ''}`}>
      <p className="text-sm text-[color:var(--secondary)]">{label}</p>
      <p className={`text-base font-medium ${colorMap[color]}`}><span className={`${status ? 'bg-[var(--primary)] text-accent px-2 py-1 rounded-lg' : ''}`}>{value}</span></p>
    </div>
  );
}
