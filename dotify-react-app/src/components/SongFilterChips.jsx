// Shows active filters and Clear all
function SongFilterChips({ chips, hasActiveFilters, onClearAll }) {
  return (
    <div className="mb-4 rounded-lg border border-gray-200 bg-white p-3">

      {/* Header row */}
      <div className="mb-2 flex flex-wrap items-center gap-2">
        <span className="text-sm font-semibold text-[var(--dark)]">
          Results
        </span>

        {hasActiveFilters ? (
          <button
            type="button"
            onClick={onClearAll}
            className="text-sm text-[var(--red)] hover:underline"
          >
            Clear all
          </button>
        ) : null}
      </div>

      {/* Each chip calls remove() for that filter */}
      {chips.length > 0 ? (
        <div className="flex flex-wrap gap-2">
          {chips.map((c) => (
            <button
              key={c.key}
              type="button"
              onClick={c.remove}
              className="inline-flex items-center gap-1 rounded border border-gray-300 bg-gray-50 px-2 py-1 text-sm text-[var(--dark)] hover:bg-gray-100"
              aria-label={`Remove filter ${c.label}`}
            >
              <span>{c.label}</span>
              <span className="text-gray-500" aria-hidden>×</span>
            </button>
          ))}
        </div>
      ) : (
        <p className="text-sm text-[var(--muted)]">No active filters</p>
      )}
    </div>
  );
}

export default SongFilterChips;
