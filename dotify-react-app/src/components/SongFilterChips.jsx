// Shows active filters and Clear all
function SongFilterChips({ chips, hasActiveFilters, onClearAll }) {
  return (
    <div className="mb-6 rounded-xl border border-[var(--dark)]/10 bg-[var(--white)] px-4 py-4 shadow-sm ring-1 ring-[var(--dark)]/[0.04]">
      <div className="flex flex-wrap items-center gap-3 mb-3">
        <span className="text-sm font-bold text-[var(--dark)] tracking-tight">
          Results
        </span>
        {hasActiveFilters ? (
          <button
            type="button"
            onClick={onClearAll}
            className="text-sm font-semibold text-[var(--red)] hover:underline underline-offset-2 transition-colors"
          >
            Clear all
          </button>
        ) : null}
      </div>
      {chips.length > 0 ? (
        <div className="flex flex-wrap gap-2">
          {chips.map((c) => (
            <button
              key={c.key}
              type="button"
              onClick={c.remove}
              className="inline-flex items-center gap-1.5 rounded-full border border-[var(--dark)]/12 bg-[color-mix(in_srgb,var(--accent)_8%,var(--white))] pl-3.5 pr-2.5 py-1.5 text-sm font-medium text-[var(--dark)] shadow-sm cursor-pointer transition-colors hover:border-[var(--red)]/35 hover:bg-[var(--red)]/10 hover:text-[var(--red)]"
              aria-label={`Remove filter ${c.label}`}
            >
              <span>{c.label}</span>
              <span className="text-[var(--dark)]/45" aria-hidden>
                ×
              </span>
            </button>
          ))}
        </div>
      ) : (
        <p className="text-sm text-[var(--dark)]/45">No active filters</p>
      )}
    </div>
  );
}

export default SongFilterChips;
