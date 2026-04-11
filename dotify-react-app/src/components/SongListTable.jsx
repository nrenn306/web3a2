import { Link } from "react-router-dom";

// Same table on Songs page, artist page, genre page
function SongListTable({
  rows,
  loadState,
  loadError = null,
  showCatalogEmpty = false,
  showFilterEmpty = false,
  onClearFilters,
  artistNameById = new Map(),
  onAddToPlaylist,
  noRowsMessage = "No songs to show.",
}) {
  const showAdd = typeof onAddToPlaylist === "function";
  const colSpan = showAdd ? 4 : 3;

  return (
    <div className="rounded-2xl border border-[var(--dark)]/10 bg-[var(--white)] overflow-hidden shadow-md shadow-[var(--dark)]/5 ring-1 ring-[var(--dark)]/[0.05]">
      <div className="overflow-x-auto">
        <table className="w-full text-sm text-left min-w-[520px]">
          <thead>
            <tr className="border-b border-[var(--dark)]/10 bg-[color-mix(in_srgb,var(--dark)_6%,var(--white))]">
              <th className="px-5 py-3.5 text-xs font-bold uppercase tracking-wider text-[var(--dark)]">
                Title
              </th>
              <th className="px-5 py-3.5 text-xs font-bold uppercase tracking-wider text-[var(--dark)]">
                Artist
              </th>
              <th className="px-5 py-3.5 text-xs font-bold uppercase tracking-wider text-[var(--dark)] w-24">
                Year
              </th>
              {showAdd ? (
                <th
                  className="px-5 py-3.5 w-16 text-center text-xs font-bold uppercase tracking-wider text-[var(--dark)]"
                  aria-label="Add to playlist"
                >
                  Add
                </th>
              ) : null}
            </tr>
          </thead>
          <tbody className="divide-y divide-[var(--dark)]/[0.06]">
            {loadState === "loading" && (
              <tr>
                <td
                  colSpan={colSpan}
                  className="px-5 py-16 text-center text-[var(--muted)]/80"
                >
                  <span className="inline-flex items-center gap-2">
                    <span className="size-2 animate-pulse rounded-full bg-[var(--accent)]" />
                    Loading songs…
                  </span>
                </td>
              </tr>
            )}
            {loadState === "error" && (
              <tr>
                <td
                  colSpan={colSpan}
                  className="px-5 py-14 text-center text-[var(--red)] font-medium"
                >
                  {loadError}
                </td>
              </tr>
            )}
            {loadState === "ready" && showCatalogEmpty && (
              <tr>
                <td
                  colSpan={colSpan}
                  className="px-5 py-14 text-center text-[var(--muted)]/85"
                >
                  No songs found in your database.
                </td>
              </tr>
            )}
            {loadState === "ready" && showFilterEmpty && (
              <tr>
                <td
                  colSpan={colSpan}
                  className="px-5 py-14 text-center text-[var(--muted)]/85"
                >
                  No songs match your filters. Try adjusting or{" "}
                  {onClearFilters ? (
                    <button
                      type="button"
                      onClick={onClearFilters}
                      className="font-semibold text-[var(--accent)] hover:text-[var(--red)] underline underline-offset-2"
                    >
                      clear all
                    </button>
                  ) : (
                    <span>clear your selection</span>
                  )}
                  .
                </td>
              </tr>
            )}
            {loadState === "ready" &&
              !showCatalogEmpty &&
              !showFilterEmpty &&
              rows.length === 0 && (
                <tr>
                  <td
                    colSpan={colSpan}
                    className="px-5 py-14 text-center text-[var(--muted)]/85"
                  >
                    {noRowsMessage}
                  </td>
                </tr>
              )}
            {loadState === "ready" &&
              !showCatalogEmpty &&
              !showFilterEmpty &&
              rows.length > 0 &&
              rows.map((song, i) => {
                const artistLabel =
                  (song.artistName ?? "").trim() ||
                  artistNameById.get(String(song.artistId)) ||
                  "";
                const stripe =
                  i % 2 === 1 ? "bg-[color-mix(in_srgb,var(--dark)_3.5%,var(--white))]" : "";
                return (
                  <tr
                    key={song.id}
                    className={`${stripe} transition-colors hover:bg-[color-mix(in_srgb,var(--accent)_7%,var(--white))]`}
                  >
                    <td className="px-5 py-3.5">
                      <Link
                        to={`/songs/${song.id}`}
                        className="font-medium text-[var(--accent)] hover:text-[var(--red)] hover:underline underline-offset-2"
                      >
                        {song.title}
                      </Link>
                    </td>
                    <td className="px-5 py-3.5">
                      {song.artistId ? (
                        <Link
                          to={`/artists/${song.artistId}`}
                          className="text-[var(--text)] hover:text-[var(--accent)] hover:underline underline-offset-2"
                        >
                          {artistLabel || "—"}
                        </Link>
                      ) : (
                        <span className="text-[var(--muted)]/75">
                          {artistLabel || "—"}
                        </span>
                      )}
                    </td>
                    <td className="px-5 py-3.5 text-[var(--muted)]/80 tabular-nums">
                      {song.year ?? "—"}
                    </td>
                    {showAdd ? (
                      <td className="px-5 py-3.5 text-center">
                        <button
                          type="button"
                          onClick={() => onAddToPlaylist(song)}
                          className="inline-flex h-9 w-9 items-center justify-center rounded-xl border border-[var(--dark)]/15 bg-[var(--white)] text-lg font-light leading-none text-[var(--dark)] shadow-sm hover:bg-[var(--accent)] hover:text-[var(--black)] hover:border-[var(--accent)] hover:shadow-md transition-all active:scale-95"
                          aria-label={`Add ${song.title} to playlist`}
                        >
                          +
                        </button>
                      </td>
                    ) : null}
                  </tr>
                );
              })}
          </tbody>
        </table>
      </div>
    </div>
  );
}

export default SongListTable;
