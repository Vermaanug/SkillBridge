export function LoadingState({ label = "Loading" }: { label?: string }) {
  return (
    <div className="flex items-center gap-3 py-10 text-graphite-400" role="status">
      <span className="h-2 w-2 animate-pulse rounded-full bg-amber-400" />
      <span className="font-mono text-sm">{label}…</span>
    </div>
  );
}

export function EmptyState({ title, hint }: { title: string; hint?: string }) {
  return (
    <div className="rounded-xl border border-dashed border-graphite-600 bg-graphite-800/40 p-8 text-center">
      <p className="font-display text-base text-graphite-100">{title}</p>
      {hint && <p className="mt-1 text-sm text-graphite-400">{hint}</p>}
    </div>
  );
}

export function ErrorState({ message, onRetry }: { message: string; onRetry?: () => void }) {
  return (
    <div className="rounded-xl border border-red-500/30 bg-red-500/5 p-6">
      <p className="font-display text-sm text-red-300">Couldn't load that.</p>
      <p className="mt-1 text-sm text-graphite-400">{message}</p>
      {onRetry && (
        <button
          onClick={onRetry}
          className="mt-3 rounded-lg border border-graphite-600 px-3 py-1.5 text-sm text-graphite-100 hover:border-amber-400 hover:text-amber-400"
        >
          Try again
        </button>
      )}
    </div>
  );
}
