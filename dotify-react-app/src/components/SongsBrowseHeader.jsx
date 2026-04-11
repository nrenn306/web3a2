/** Page title, optional data notice, and sort control for the Songs browse view. */
function SongsBrowseHeader({ loadNotice, sortBy, onSortChange }) {
  return (
    <>
      <header className="text-center mb-8">
        <h1 className="text-2xl sm:text-3xl font-bold tracking-tight text-[var(--dark)]">
          Songs
        </h1>
        <div
          className="mx-auto mt-3 h-1 w-14 rounded-full bg-[var(--accent)]"
          aria-hidden
        />
      </header>

      {loadNotice ? (
        <div
          role="alert"
          className="mb-6 rounded-xl border border-[var(--accent)]/35 bg-[color-mix(in_srgb,var(--accent)_10%,var(--white))] px-4 py-3 text-sm text-[var(--dark)] leading-relaxed shadow-sm"
        >
          {loadNotice}
        </div>
      ) : null}

      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-end gap-3 mb-6">
        <label className="inline-flex items-center gap-2.5 text-sm text-[var(--muted)] sm:ml-auto">
          <span className="font-semibold whitespace-nowrap text-[var(--dark)]">
            Sort by
          </span>
          <select
            value={sortBy}
            onChange={(e) => onSortChange(e.target.value)}
            className="cursor-pointer rounded-xl border border-[var(--dark)]/12 bg-[var(--white)] px-3.5 py-2 text-[var(--text)] text-sm font-medium shadow-sm focus:outline-none focus:ring-2 focus:ring-[var(--accent)] focus:border-transparent min-w-[10rem] transition-shadow hover:border-[var(--accent)]/40"
          >
            <option value="title">Title</option>
            <option value="year">Year</option>
            <option value="artist">Artist name</option>
          </select>
        </label>
      </div>
    </>
  );
}

export default SongsBrowseHeader;
