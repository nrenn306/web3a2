import { useEffect, useState } from "react";
import { Link, useParams } from "react-router-dom";

import SongRadarChart from "../components/SongRadarChart";
import { PlaylistToast, usePlaylistToast } from "../hooks/usePlaylistToast";
import { fetchSongPageData } from "../services/musicData";

function fmtNum(v, digits) {
  if (v == null || v === "") return "—";
  const n = Number(v);
  if (Number.isNaN(n)) return "—";
  if (digits) return n.toFixed(digits);
  return String(Math.round(n));
}

function SingleSong() {
  const { id } = useParams();
  const [loadState, setLoadState] = useState("loading");
  const [error, setError] = useState(null);
  const [song, setSong] = useState(null);
  const [related, setRelated] = useState([]);
  const [joinNotice, setJoinNotice] = useState(null);
  const [artistImgFailed, setArtistImgFailed] = useState(false);
  const { toast, addToPlaylist } = usePlaylistToast();

  // Load song when URL id changes
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

  const labelClass =
    "text-xs font-semibold uppercase tracking-wide text-[var(--muted)] mb-1";
  const linkClass =
    "text-[var(--accent)] font-medium hover:text-[var(--red)] hover:underline underline-offset-2";

  return (
    <div className="max-w-5xl mx-auto px-4 sm:px-6 py-10 sm:py-12">
      {loadState === "loading" && (
        <p className="text-center text-[var(--muted)] py-16">Loading song…</p>
      )}

      {loadState === "error" && (
        <div className="rounded-xl border border-[var(--red)]/30 bg-[var(--red)]/5 px-4 py-6 text-center text-[var(--dark)]">
          <p className="font-medium text-[var(--red)] mb-3">{error}</p>
          <Link
            to="/songs"
            className="text-[var(--accent)] font-semibold hover:text-[var(--red)] underline underline-offset-2"
          >
            Back to songs
          </Link>
        </div>
      )}

      {loadState === "ready" && song && (
        <>
          {joinNotice && (
            <div className="mb-6 rounded-xl border border-[var(--accent)]/35 bg-[color-mix(in_srgb,var(--accent)_10%,var(--white))] px-4 py-3 text-sm text-[var(--dark)] shadow-sm">
              {joinNotice}
            </div>
          )}

          <div className="grid gap-10 lg:grid-cols-2 lg:gap-14 items-start mb-14">
            <div className="min-w-0">
              <h1 className="text-3xl sm:text-4xl font-bold tracking-tight text-[var(--dark)] leading-tight">
                {song.title}
              </h1>
              <div
                className="mt-3 h-1 w-14 rounded-full bg-[var(--accent)]"
                aria-hidden
              />

              <dl className="mt-8 space-y-5 text-[var(--text)]">
                <div>
                  <dt className={labelClass}>Artist</dt>
                  <dd className="text-lg">
                    {song.artistId ? (
                      <Link
                        to={`/artists/${song.artistId}`}
                        className={linkClass}
                      >
                        {song.artistName}
                      </Link>
                    ) : (
                      song.artistName
                    )}
                  </dd>
                </div>
                <div>
                  <dt className={labelClass}>Year</dt>
                  <dd className="text-lg tabular-nums">{song.year ?? "—"}</dd>
                </div>
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
                <div>
                  <dt className={labelClass}>Bpm, popularity, loudness</dt>
                  <dd className="text-lg tabular-nums leading-relaxed">
                    {fmtNum(song.bpm)} bpm · popularity{" "}
                    {fmtNum(song.popularity)} · loudness{" "}
                    {fmtNum(song.loudness, 1)} dB
                  </dd>
                </div>
              </dl>

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
                className="mt-8 inline-flex items-center justify-center rounded-xl border-2 border-[var(--accent)] bg-[var(--accent)] px-6 py-3 text-base font-bold text-[var(--black)] shadow-sm hover:bg-[var(--dark)] hover:border-[var(--dark)] hover:text-[var(--white)] transition-colors"
              >
                + Add to Playlist
              </button>
            </div>

            <div className="flex flex-col items-center gap-8 lg:items-end">
              <div className="w-full max-w-[16rem] aspect-square rounded-2xl border border-[var(--dark)]/10 bg-[color-mix(in_srgb,var(--accent)_14%,var(--white))] shadow-md overflow-hidden flex items-center justify-center">
                {song.artistImageUrl && !artistImgFailed ? (
                  <img
                    src={song.artistImageUrl}
                    alt={
                      song.artistName && song.artistName !== "—"
                        ? song.artistName
                        : "Artist"
                    }
                    className="h-full w-full object-cover"
                    onError={() => setArtistImgFailed(true)}
                  />
                ) : (
                  <span className="text-5xl sm:text-6xl font-bold text-[var(--dark)]/25 select-none">
                    {song.artistName && song.artistName !== "—"
                      ? song.artistName.trim().charAt(0).toUpperCase()
                      : "?"}
                  </span>
                )}
              </div>
              <div className="w-full max-w-md rounded-2xl border border-[var(--dark)]/10 bg-[var(--white)] p-4 shadow-sm">
                <SongRadarChart values={song.metrics} />
              </div>
            </div>
          </div>

          <section className="border-t border-[var(--dark)]/10 pt-10">
            <h2 className="text-center text-xl font-bold text-[var(--dark)] mb-2">
              Related Songs
            </h2>
            <div
              className="mx-auto h-0.5 w-12 rounded-full bg-[var(--accent)] mb-8"
              aria-hidden
            />
            {related.length === 0 ? (
              <p className="text-center text-sm text-[var(--muted)]">
                No related songs found.
              </p>
            ) : (
              <ul className="grid grid-cols-2 sm:grid-cols-4 gap-4">
                {related.map((r) => (
                  <li key={r.id}>
                    <Link
                      to={`/songs/${r.id}`}
                      className="block h-full rounded-xl border border-[var(--dark)]/10 bg-[var(--white)] p-4 text-center shadow-sm transition-shadow hover:border-[var(--accent)]/40 hover:shadow-md"
                    >
                      <span className="block text-sm font-semibold text-[var(--dark)] line-clamp-2 mb-2">
                        {r.title}
                      </span>
                      <span className="block text-xs text-[var(--muted)] line-clamp-2">
                        {r.artistName || "—"}
                      </span>
                    </Link>
                  </li>
                ))}
              </ul>
            )}
          </section>
        </>
      )}

      <PlaylistToast message={toast} />
    </div>
  );
}

export default SingleSong;
