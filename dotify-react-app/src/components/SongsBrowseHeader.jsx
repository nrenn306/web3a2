/**
 * SongBrowseHeader component to display header section for songs browse page
 * 
 * props:
 * @param {string|null} loadNotice - optional message to display (ex. partial data warning)
 * @param {string} sortBy - current selected sort option
 * @param {Function} onSortChange - callback triggered when sort option changes
 */
function SongsBrowseHeader({ loadNotice, sortBy, onSortChange }) {
  return (
    <>
    {/* page title */}
      <header className="mb-6 text-center">
        <h1 className="text-2xl font-bold text-[var(--dark)] sm:text-3xl">Songs</h1>
      </header>

      {/* optional notice */}
      {loadNotice ? (
        <div role="alert" className="mb-4 rounded border border-amber-200 bg-amber-50 px-3 py-2 text-sm text-amber-950">
          {loadNotice}
        </div>
      ) : null}

      {/* sort control */}
      <div className="mb-4 flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-end">
        <label className="inline-flex items-center gap-2 text-sm sm:ml-auto">
          <span className="text-[var(--dark)]">Sort by</span>
          <select
            value={sortBy}
            onChange={(e) => onSortChange(e.target.value)}
            className="min-w-[10rem] rounded border border-gray-300 bg-white px-2 py-1 text-sm text-[var(--text)]"
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
