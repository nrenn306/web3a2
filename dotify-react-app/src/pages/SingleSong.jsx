import { useEffect, useState } from "react";
import { Link, useParams } from "react-router-dom";

import SongRadarChart from "../components/SongRadarChart";
import { PlaylistToast, usePlaylistToast } from "../components/PlaylistToast";
import { fetchSongPageData } from "../services/musicData";

/**
 * formats numeric values for display in song detail page 
 */
function fmtNum(v, digits) {
  if (v == null || v === "") return "—";

  const n = Number(v);

  if (Number.isNaN(n)) return "—";
  
  if (digits) return n.toFixed(digits);

  return String(Math.round(n));
}

/**
 * SingleSong page which displays full metadata for a single song
 */
function SingleSong() {
  const { id } = useParams();
  const [loadState, setLoadState] = useState("loading"); // state for async fetch lifecycle 
  const [error, setError] = useState(null); // error message if fetch fails 
  const [song, setSong] = useState(null); // main song object
  const [related, setRelated] = useState([]); // related songs 
  const [joinNotice, setJoinNotice] = useState(null); // optional join warning
  const [artistImgFailed, setArtistImgFailed] = useState(false); // track fallback if artist image fails to load
  const { toast, addToPlaylist } = usePlaylistToast(); // playlist system

  
  // fetch song page data whenever route ID changes 
  useEffect(() => {
    let cancelled = false;

    setArtistImgFailed(false);
    setLoadState("loading");
    setError(null);
    setSong(null);
    setRelated([]);
    setJoinNotice(null);

    fetchSongPageData(id ?? "")
      .then((r) => {
        if (cancelled) return;

        setJoinNotice(r.joinNotice);

        if (r.error) {
          setError(r.error);
          setLoadState("error");
          return;
        }

        setSong(r.song);
        setRelated(r.related || []);
        setLoadState("ready");
      })
      .catch(() => {
        if (cancelled) return;

        setError("Could not load song.");
        setLoadState("error");
      });

    return () => {
      cancelled = true;
    };

  }, [id]);

  const labelClass = "text-xs font-semibold uppercase tracking-wide text-[var(--muted)] mb-1";
  const linkClass = "text-[var(--accent)] font-medium hover:text-[var(--red)] hover:underline underline-offset-2";

  return (
    <div className="max-w-5xl mx-auto px-4 sm:px-6 py-10 sm:py-12">

      {/* loading state */}
      {loadState === "loading" && (
        <p className="text-center text-[var(--muted)] py-16">Loading song…</p>
      )}

      {/* error state */}
      {loadState === "error" && (
        <div className="rounded border border-red-200 bg-red-50 px-4 py-6 text-center text-[var(--dark)]">
          <p className="font-medium text-[var(--red)] mb-3">{error}</p>
          <Link to="/songs" className="text-[var(--accent)] font-semibold hover:text-[var(--red)] underline underline-offset-2">
            Back to songs
          </Link>
        </div>
      )}

      {/* main content */}
      {loadState === "ready" && song && (
        <>
          {/* optional SQL join warning/info banner */}
          {joinNotice && (
            <div className="mb-4 rounded border border-amber-200 bg-amber-50 px-3 py-2 text-sm text-amber-950">{joinNotice}</div>
          )}

          {/* main layout */}
          <div className="mb-10 grid items-start gap-8 lg:grid-cols-2">
            {/* left column: song metadata */}
            <div className="min-w-0">
              <h1 className="text-3xl font-bold leading-tight text-[var(--dark)] sm:text-4xl">{song.title}</h1>

              <dl className="mt-8 space-y-5 text-[var(--text)]">

                {/* artist */}
                <div>
                  <dt className={labelClass}>Artist</dt>
                  <dd className="text-lg">
                    {song.artistId ? (
                      <Link to={`/artists/${song.artistId}`} className={linkClass}>
                        {song.artistName}
                      </Link>
                    ) : (
                      song.artistName
                    )}
                  </dd>
                </div>

                {/* year */}
                <div>
                  <dt className={labelClass}>Year</dt>
                  <dd className="text-lg tabular-nums">{song.year ?? "—"}</dd>
                </div>

                {/* genre */}
                <div>
                  <dt className={labelClass}>Genre</dt>
                  <dd className="text-lg">
                    {song.genreId ? (
                      <Link to={`/genres/${song.genreId}`} className={linkClass}>
                        {song.genreName}
                      </Link>
                    ) : (
                      song.genreName
                    )}
                  </dd>
                </div>

                {/* audio metrics */}
                <div>
                  <dt className={labelClass}>Bpm, popularity, loudness</dt>
                  <dd className="text-lg tabular-nums leading-relaxed">
                    {fmtNum(song.bpm)} bpm · popularity{" "}
                    {fmtNum(song.popularity)} · loudness{" "}
                    {fmtNum(song.loudness, 1)} dB
                  </dd>
                </div>

              </dl>

              {/* add to playlist action */}
              <button
                type="button"
                onClick={() =>
                  addToPlaylist({
                    id: song.id,
                    title: song.title,
                    year: song.year,
                    artistId: song.artistId,
                    artistName: song.artistName,
                  })
                }
                className="mt-6 inline-flex items-center justify-center rounded-lg border-2 border-[var(--accent)] bg-[var(--accent)] px-5 py-2.5 text-base font-bold text-[var(--black)] hover:bg-[var(--dark)] hover:border-[var(--dark)] hover:text-white"
              >
                + Add to Playlist
              </button>
            </div>


            {/* right column: artist image + radar chart */}
            <div className="flex flex-col items-center gap-8 lg:items-end">
              
              {/* artist image with fallback */}
              <div className="flex aspect-square w-full max-w-xs items-center justify-center overflow-hidden rounded-lg border border-gray-200 bg-gray-100">
                {song.artistImageUrl && !artistImgFailed ? (
                  <img
                    src={song.artistImageUrl}
                    alt={song.artistName && song.artistName !== "—" ? song.artistName : "Artist"}
                    className="h-full w-full object-cover"
                    onError={() => setArtistImgFailed(true)}
                  />
                ) : (
                  <span className="text-5xl sm:text-6xl font-bold text-[var(--dark)]/25 select-none">
                    {song.artistName && song.artistName !== "—" ? song.artistName.trim().charAt(0).toUpperCase() : "?"}
                  </span>
                )}
              </div>

              {/* radar chart visualization */}
              <div className="w-full max-w-md rounded-lg border border-gray-200 bg-white p-4">
                <SongRadarChart values={song.metrics} />
              </div>
            </div>
          </div>


          {/* related songs section */}
          <section className="border-t border-gray-200 pt-8">
            <h2 className="mb-4 text-center text-xl font-bold text-[var(--dark)]">Related Songs</h2>
            
            {related.length === 0 ? (
              <p className="text-center text-sm text-[var(--muted)]">
                No related songs found.
              </p>
            ) : (
              <ul className="grid grid-cols-2 gap-3 sm:grid-cols-4 sm:gap-4">
                {related.map((r) => (
                  <li key={r.id}>
                    <Link to={`/songs/${r.id}`} className="block h-full rounded border border-gray-200 bg-white p-3 text-center hover:border-gray-400">
                      <span className="mb-1 block line-clamp-2 text-sm font-medium text-[var(--dark)]">{r.title}</span>
                      <span className="block line-clamp-2 text-xs text-[var(--muted)]">{r.artistName || "—"}</span>
                    </Link>
                  </li>
                ))}
              </ul>
            )}
          </section>

        </>
      )}

      {/* playlist toast notification */}
      <PlaylistToast message={toast} />
    </div>
  );
}


export default SingleSong;
