/**
 * SongListTable component for reusable table to display songs across multiple pages 
 * 
 * Props:
 * @param {Array<Object>} rows - array of song objects to display
 * @param {string} loadState - current loading state: "loading", "error", "ready"
 * @param {string|null} loadError - error message (if loadState is "error")
 * @param {boolean} showCatalogEmpty - true when no songs exist in database
 * @param {boolean} showFilterEmpty - true when filters return no results
 * @param {Function} onClearFilters - clears active filters (optional UI action)
 * @param {Map} artistNameById - map of artist IDs to artist names
 * @param {Function} onAddToPlaylist - optional callback to add a song to playlist
 * @param {string} noRowsMessage - message shown when no rows exist
 */
import { Link } from "react-router-dom";

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

  const showAdd = typeof onAddToPlaylist === "function"; // determine whether the "add" column should be shown
  const colSpan = showAdd ? 4 : 3; // adjust column span depending on optional add column 

  return (
    <div className="overflow-hidden rounded-lg border border-gray-200 bg-white">
      <div className="overflow-x-auto">
        <table className="w-full min-w-[520px] text-left text-sm">

          {/* table header */}
          <thead>
            <tr className="border-b border-gray-200 bg-gray-50">
              <th className="px-4 py-2 font-semibold text-[var(--dark)]">Title</th>
              <th className="px-4 py-2 font-semibold text-[var(--dark)]">Artist</th>
              <th className="px-4 py-2 font-semibold text-[var(--dark)] w-24">Year</th>

              {showAdd ? (
                <th
                  className="w-16 px-4 py-2 text-center font-semibold text-[var(--dark)]"
                  aria-label="Add to playlist"
                >
                  Add
                </th>
              ) : null}

            </tr>
          </thead>

          <tbody className="divide-y divide-gray-200">
            
            {/* loading state */}
            {loadState === "loading" && (
              <tr>
                <td colSpan={colSpan} className="px-4 py-12 text-center text-[var(--muted)]">
                  <span className="inline-flex items-center gap-2">
                    <span className="size-2 animate-pulse rounded-full bg-[var(--accent)]" />Loading songs…</span>
                </td>
              </tr>
            )}

            {/* error state */}
            {loadState === "error" && (
              <tr>
                <td colSpan={colSpan} className="px-4 py-12 text-center text-[var(--red)]">
                  {loadError}
                </td>
              </tr>
            )}

            {/* empty database state */}
            {loadState === "ready" && showCatalogEmpty && (
              <tr>
                <td colSpan={colSpan} className="px-4 py-12 text-center text-[var(--muted)]">
                  No songs found in your database.
                </td>
              </tr>
            )}

            {/* no results from filters */}
            {loadState === "ready" && showFilterEmpty && (
              <tr>
                <td colSpan={colSpan} className="px-4 py-12 text-center text-[var(--muted)]">
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

            {/* default empty state */}
            {loadState === "ready" && !showCatalogEmpty && !showFilterEmpty && rows.length === 0 && (
                <tr>
                  <td colSpan={colSpan} className="px-4 py-12 text-center text-[var(--muted)]">
                    {noRowsMessage}
                  </td>
                </tr>
              )}

            {/* song rows */}
            {loadState === "ready" && !showCatalogEmpty && !showFilterEmpty && rows.length > 0 && rows.map((song) => {
                const artistLabel = (song.artistName ?? "").trim() || artistNameById.get(String(song.artistId)) || "";

                return (
                  <tr key={song.id} className="hover:bg-gray-50">
                    <td className="px-4 py-2">
                      <Link to={`/songs/${song.id}`} className="font-medium text-[var(--accent)] hover:text-[var(--red)] hover:underline">
                        {song.title}
                      </Link>
                    </td>

                    <td className="px-4 py-2">
                      {song.artistId ? (
                        <Link to={`/artists/${song.artistId}`} className="text-[var(--text)] hover:text-[var(--accent)] hover:underline">
                          {artistLabel || "—"}
                        </Link>
                      ) : (
                        <span className="text-[var(--muted)]">{artistLabel || "—"}</span>
                      )}
                    </td>

                    <td className="px-4 py-2 tabular-nums text-[var(--muted)]">{song.year ?? "—"}</td>

                    {showAdd ? (
                      <td className="px-4 py-2 text-center">
                        <button
                          type="button"
                          onClick={() => onAddToPlaylist(song)}
                          className="inline-flex h-9 w-9 items-center justify-center rounded-lg border border-[var(--accent)] bg-[var(--accent)] text-lg text-[var(--black)] hover:bg-[var(--dark)] hover:border-[var(--dark)] hover:text-white"
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
