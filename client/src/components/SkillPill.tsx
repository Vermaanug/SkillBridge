export function SkillPill({ label, variant }: { label: string; variant: "matched" | "missing" }) {
  const styles =
    variant === "matched"
      ? "border-teal-500/40 bg-teal-500/10 text-teal-400"
      : "border-graphite-600 bg-graphite-800 text-graphite-400";
  return (
    <span className={`inline-flex items-center rounded-full border px-2.5 py-1 font-mono text-xs ${styles}`}>
      {label}
    </span>
  );
}
