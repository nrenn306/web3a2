// Left column: search + checkbox filters for browse page
function SongsFiltersSidebar({
  songs,
  titleQuery,
  onTitleQueryChange,
  years,
  selectedYears,
  onToggleYear,
  artistFilterNames,
  selectedArtistNames,
  onToggleArtistName,
  genreFilterOptions,
  selectedGenres,
  onToggleGenre,
}) {
  return (
    <aside className="w-full shrink-0 border-b border-gray-200 bg-gray-50 p-4 lg:w-72 lg:border-b-0 lg:border-r">
      <h2 className="mb-4 text-lg font-bold text-[var(--dark)]">Filters</h2>

      <div className="space-y-5">
        {/* Live title search + datalist */}
        <div>
          <label className="mb-1 block text-sm text-[var(--muted)]">
            Title
          </label>
          <div className="relative">
            <input
              type="search"
              value={titleQuery}
              onChange={(e) => onTitleQueryChange(e.target.value)}
              placeholder="Search title…"
              className="w-full rounded border border-gray-300 bg-white px-2 py-2 pr-14 text-sm text-[var(--text)]"
              list="song-title-hints"
            />
            <datalist id="song-title-hints">
              {songs.map((s) => (
                <option key={s.id} value={s.title} />
              ))}
            </datalist>
            {titleQuery ? (
              <button
                type="button"
                aria-label="Clear title"
                onClick={() => onTitleQueryChange("")}
                className="absolute right-8 top-1/2 -translate-y-1/2 rounded p-1 text-gray-500 hover:bg-gray-100 hover:text-[var(--red)]"
              >
                ×
              </button>
            ) : null}
            <span
              className="pointer-events-none absolute right-2 top-1/2 -translate-y-1/2 text-xs text-gray-400"
              aria-hidden
            >
              ▾
            </span>
          </div>
        </div>

        <fieldset className="space-y-1 rounded border border-gray-200 bg-white p-3">
          <legend className="mb-1 px-1 text-sm font-medium text-[var(--muted)]">
            Years
          </legend>
          <ul className="max-h-40 space-y-1 overflow-y-auto pr-1">
            {years.map((y) => (
              <li
                key={y}
                className="flex items-center gap-2 rounded px-1 py-0.5 hover:bg-gray-50"
              >
                <label className="flex min-w-0 flex-1 cursor-pointer items-center gap-2 text-sm text-[var(--text)]">
                  <input
                    type="checkbox"
                    checked={selectedYears.has(y)}
                    onChange={() => onToggleYear(y)}
                    className="size-4 rounded border-gray-300 text-[var(--accent)]"
                  />
                  <span
                    className={
                      selectedYears.has(y)
                        ? "font-semibold text-[var(--dark)]"
                        : ""
                    }
                  >
                    {y}
                  </span>
                </label>
                {selectedYears.has(y) ? (
                  <button
                    type="button"
                    aria-label={`Remove year ${y}`}
                    onClick={() => onToggleYear(y)}
                    className="shrink-0 rounded px-1.5 py-0.5 text-sm text-gray-500 hover:bg-gray-100 hover:text-[var(--red)]"
                  >
                    ×
                  </button>
                ) : null}
              </li>
            ))}
          </ul>
        </fieldset>

        {/* Artist name checkboxes */}
        <fieldset className="space-y-1 rounded border border-gray-200 bg-white p-3">
          <legend className="mb-1 px-1 text-sm font-medium text-[var(--muted)]">
            Artists
          </legend>
          {artistFilterNames.length === 0 ? (
            <p className="px-1 py-1 text-sm text-[var(--muted)]">
              No artists available to filter.
            </p>
          ) : (
            <ul className="max-h-44 space-y-1 overflow-y-auto pr-1">
              {artistFilterNames.map((name) => (
                <li
                  key={name}
                  className="flex items-center gap-2 rounded px-1 py-0.5 hover:bg-gray-50"
                >
                  <label className="flex min-w-0 flex-1 cursor-pointer items-center gap-2 text-sm text-[var(--text)]">
                    <input
                      type="checkbox"
                      checked={selectedArtistNames.has(name)}
                      onChange={() => onToggleArtistName(name)}
                      className="size-4 rounded border-gray-300 text-[var(--accent)]"
                    />
                    <span
                      className={
                        selectedArtistNames.has(name)
                          ? "font-semibold text-[var(--dark)]"
                          : ""
                      }
                    >
                      {name}
                    </span>
                  </label>
                  {selectedArtistNames.has(name) ? (
                    <button
                      type="button"
                      aria-label={`Remove artist ${name}`}
                      onClick={() => onToggleArtistName(name)}
                      className="shrink-0 rounded px-1.5 py-0.5 text-sm text-gray-500 hover:bg-gray-100 hover:text-[var(--red)]"
                    >
                      ×
                    </button>
                  ) : null}
                </li>
              ))}
            </ul>
          )}
        </fieldset>

        {/* Genre checkboxes */}
        <fieldset className="space-y-1 rounded border border-gray-200 bg-white p-3">
          <legend className="mb-1 px-1 text-sm font-medium text-[var(--muted)]">
            Genres
          </legend>
          {genreFilterOptions.length === 0 ? (
            <p className="px-1 py-1 text-sm text-[var(--muted)]">
              No genres available to filter.
            </p>
          ) : (
            <ul className="max-h-44 space-y-1 overflow-y-auto pr-1">
              {genreFilterOptions.map((g) => (
                <li
                  key={g}
                  className="flex items-center gap-2 rounded px-1 py-0.5 hover:bg-gray-50"
                >
                  <label className="flex min-w-0 flex-1 cursor-pointer items-center gap-2 text-sm text-[var(--text)]">
                    <input
                      type="checkbox"
                      checked={selectedGenres.has(g)}
                      onChange={() => onToggleGenre(g)}
                      className="size-4 rounded border-gray-300 text-[var(--accent)]"
                    />
                    <span
                      className={
                        selectedGenres.has(g)
                          ? "font-semibold text-[var(--dark)]"
                          : ""
                      }
                    >
                      {g}
                    </span>
                  </label>
                  {selectedGenres.has(g) ? (
                    <button
                      type="button"
                      aria-label={`Remove genre ${g}`}
                      onClick={() => onToggleGenre(g)}
                      className="shrink-0 rounded px-1.5 py-0.5 text-sm text-gray-500 hover:bg-gray-100 hover:text-[var(--red)]"
                    >
                      ×
                    </button>
                  ) : null}
                </li>
              ))}
            </ul>
          )}
        </fieldset>
      </div>
    </aside>
  );
}

export default SongsFiltersSidebar;
