interface Item {
  id: string;
  title: string;
  subtitle: string;
}

export function EntityPicker({
  items,
  selectedId,
  onSelect,
}: {
  items: Item[];
  selectedId: string | null;
  onSelect: (id: string) => void;
}) {
  return (
    <div className="flex flex-wrap gap-2">
      {items.map((item) => {
        const active = item.id === selectedId;
        return (
          <button
            key={item.id}
            onClick={() => onSelect(item.id)}
            className={`rounded-xl border px-4 py-2.5 text-left transition-colors ${
              active
                ? "border-amber-400 bg-amber-400/10"
                : "border-graphite-600 bg-graphite-800 hover:border-graphite-400"
            }`}
          >
            <div className="font-display text-sm font-medium text-graphite-100">{item.title}</div>
            <div className="text-xs text-graphite-400">{item.subtitle}</div>
          </button>
        );
      })}
    </div>
  );
}
