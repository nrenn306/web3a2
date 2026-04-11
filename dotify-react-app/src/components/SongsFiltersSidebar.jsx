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
    <aside className="lg:w-[min(100%,300px)] xl:w-[320px] shrink-0 border-b lg:border-b-0 lg:border-r border-[var(--dark)]/10 bg-[color-mix(in_srgb,var(--dark)_3%,var(--white))] p-6 sm:p-7">
      <div className="mb-6">
        <h2 className="text-lg font-bold tracking-tight text-[var(--dark)]">
          Filters
        </h2>
        <div
          className="mt-2 h-0.5 w-10 rounded-full bg-[var(--accent)]"
          aria-hidden
        />
      </div>

      <div className="space-y-7">
        <div>
          <label className="block text-xs font-semibold uppercase tracking-wide text-[var(--muted)]/80 mb-2">
            Title
          </label>
          <div className="relative">
            <input
              type="search"
              value={titleQuery}
              onChange={(e) => onTitleQueryChange(e.target.value)}
              placeholder="Search title…"
              className="w-full rounded-xl border border-[var(--dark)]/12 bg-[var(--white)] px-3.5 py-2.5 pr-16 text-[var(--text)] text-sm shadow-sm placeholder:text-[var(--dark)]/35 focus:outline-none focus:ring-2 focus:ring-[var(--accent)] focus:border-transparent transition-shadow"
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
                className="absolute right-9 top-1/2 -translate-y-1/2 rounded-md p-1 text-[var(--dark)]/40 hover:bg-[var(--dark)]/5 hover:text-[var(--red)] transition-colors"
              >
                ×
              </button>
            ) : null}
            <span
              className="pointer-events-none absolute right-3 top-1/2 -translate-y-1/2 text-[var(--dark)]/30 text-xs"
              aria-hidden
            >
              ▾
            </span>
          </div>
        </div>

        <fieldset className="space-y-2 rounded-xl border border-[var(--dark)]/8 bg-[var(--white)]/90 p-3 shadow-sm">
          <legend className="text-xs font-semibold uppercase tracking-wide text-[var(--muted)]/80 mb-1 px-0.5">
            Years
          </legend>
          <ul className="space-y-1 max-h-40 overflow-y-auto pr-1">
            {years.map((y) => (
              <li
                key={y}
                className="flex items-center gap-2 rounded-lg px-1 py-0.5 hover:bg-[var(--dark)]/[0.04]"
              >
                <label className="flex items-center gap-2.5 cursor-pointer text-sm text-[var(--text)] flex-1 min-w-0">
                  <input
                    type="checkbox"
                    checked={selectedYears.has(y)}
                    onChange={() => onToggleYear(y)}
                    className="size-4 rounded border-[var(--dark)]/25 text-[var(--accent)] focus:ring-[var(--accent)] focus:ring-offset-0"
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
                    className="shrink-0 rounded-md px-1.5 py-0.5 text-sm text-[var(--dark)]/40 hover:bg-[var(--red)]/10 hover:text-[var(--red)] transition-colors"
                  >
                    ×
                  </button>
                ) : null}
              </li>
            ))}
          </ul>
        </fieldset>

        <fieldset className="space-y-2 rounded-xl border border-[var(--dark)]/8 bg-[var(--white)]/90 p-3 shadow-sm">
          <legend className="text-xs font-semibold uppercase tracking-wide text-[var(--muted)]/80 mb-1 px-0.5">
            Artists
          </legend>
          {artistFilterNames.length === 0 ? (
            <p className="text-sm text-[var(--dark)]/45 px-1 py-1">
              No artists available to filter.
            </p>
          ) : (
            <ul className="space-y-1 max-h-44 overflow-y-auto pr-1">
              {artistFilterNames.map((name) => (
                <li
                  key={name}
                  className="flex items-center gap-2 rounded-lg px-1 py-0.5 hover:bg-[var(--dark)]/[0.04]"
                >
                  <label className="flex items-center gap-2.5 cursor-pointer text-sm text-[var(--text)] flex-1 min-w-0">
                    <input
                      type="checkbox"
                      checked={selectedArtistNames.has(name)}
                      onChange={() => onToggleArtistName(name)}
                      className="size-4 rounded border-[var(--dark)]/25 text-[var(--accent)] focus:ring-[var(--accent)] focus:ring-offset-0"
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
                      className="shrink-0 rounded-md px-1.5 py-0.5 text-sm text-[var(--dark)]/40 hover:bg-[var(--red)]/10 hover:text-[var(--red)] transition-colors"
                    >
                      ×
                    </button>
                  ) : null}
                </li>
              ))}
            </ul>
          )}
        </fieldset>

        <fieldset className="space-y-2 rounded-xl border border-[var(--dark)]/8 bg-[var(--white)]/90 p-3 shadow-sm">
          <legend className="text-xs font-semibold uppercase tracking-wide text-[var(--muted)]/80 mb-1 px-0.5">
            Genres
          </legend>
          {genreFilterOptions.length === 0 ? (
            <p className="text-sm text-[var(--dark)]/45 px-1 py-1">
              No genres available to filter.
            </p>
          ) : (
            <ul className="space-y-1 max-h-44 overflow-y-auto pr-1">
              {genreFilterOptions.map((g) => (
                <li
                  key={g}
                  className="flex items-center gap-2 rounded-lg px-1 py-0.5 hover:bg-[var(--dark)]/[0.04]"
                >
                  <label className="flex items-center gap-2.5 cursor-pointer text-sm text-[var(--text)] flex-1 min-w-0">
                    <input
                      type="checkbox"
                      checked={selectedGenres.has(g)}
                      onChange={() => onToggleGenre(g)}
                      className="size-4 rounded border-[var(--dark)]/25 text-[var(--accent)] focus:ring-[var(--accent)] focus:ring-offset-0"
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
                      className="shrink-0 rounded-md px-1.5 py-0.5 text-sm text-[var(--dark)]/40 hover:bg-[var(--red)]/10 hover:text-[var(--red)] transition-colors"
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
