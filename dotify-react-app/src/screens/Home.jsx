import { useEffect, useState } from "react";
import { Link } from "react-router-dom";

import hero from "../assets/hero.png";
import { loadMusicFromSupabase } from "../services/musicData";

function HomeSongCard({ song }) {
  const [imgFailed, setImgFailed] = useState(false);
  const letter =
    song.artistName && song.artistName.trim()
      ? song.artistName.trim().charAt(0).toUpperCase()
      : "?";
  const showImg = song.artistImageUrl && !imgFailed;

  return (
    <Link
      to={`/songs/${song.id}`}
      className="group block rounded-2xl border border-[var(--dark)]/10 bg-[var(--white)] overflow-hidden shadow-md hover:shadow-lg hover:border-[var(--accent)]/35 transition-all"
    >
      <div className="aspect-[4/3] bg-[color-mix(in_srgb,var(--accent)_14%,var(--white))] overflow-hidden">
        {showImg ? (
          <img
            src={song.artistImageUrl}
            alt=""
            className="h-full w-full object-cover group-hover:scale-[1.04] transition-transform duration-300"
            onError={() => setImgFailed(true)}
          />
        ) : (
          <div className="flex h-full min-h-[8rem] items-center justify-center text-5xl font-bold text-[var(--dark)]/20">
            {letter}
          </div>
        )}
      </div>
      <div className="p-4 text-left">
        <p className="font-bold text-[var(--dark)] leading-snug line-clamp-2 group-hover:text-[var(--accent)] transition-colors">
          {song.title}
        </p>
        <p className="text-sm text-[var(--muted)] mt-1.5 line-clamp-1">
          {song.artistName || "—"}
        </p>
        {song.year != null ? (
          <p className="text-xs text-[var(--dark)]/45 mt-1 tabular-nums">
            {song.year}
          </p>
        ) : null}
      </div>
    </Link>
  );
}

function Home() {
  const [songs, setSongs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    let cancelled = false;
    setLoading(true);
    setError(null);
    loadMusicFromSupabase().then((r) => {
      if (cancelled) return;
      if (r.songError) {
        setError(r.songError);
        setSongs([]);
      } else {
        const sorted = [...r.songs].sort((a, b) =>
          a.title.localeCompare(b.title)
        );
        setSongs(sorted.slice(0, 12));
      }
      setLoading(false);
    });
    return () => {
      cancelled = true;
    };
  }, []);

  return (
    <div className="pb-16">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 pt-8 sm:pt-12 text-center">
        <div className="relative w-full overflow-hidden rounded-2xl shadow-lg border border-[var(--dark)]/10">
          <img
            src={hero}
            alt=""
            className="w-full max-h-[min(52vh,420px)] object-cover object-center"
          />
          <h1
            className="absolute top-1/2 left-1/2 w-[90%] max-w-4xl -translate-x-1/2 -translate-y-1/2 text-white font-bold drop-shadow-lg leading-tight"
            style={{ fontSize: "clamp(1.75rem, 6vw, 3.25rem)" }}
          >
            Welcome to Dotify
          </h1>
        </div>
      </div>

      <section className="max-w-7xl mx-auto px-4 sm:px-6 mt-12 sm:mt-16">
        <h2 className="text-2xl sm:text-3xl font-bold text-[var(--dark)] text-center tracking-tight">
          Featured songs
        </h2>
        <div
          className="mx-auto mt-3 h-1 w-12 rounded-full bg-[var(--accent)] mb-3"
          aria-hidden
        />
        <p className="text-center text-sm text-[var(--muted)] mb-10 max-w-lg mx-auto">
          Songs from our library — open a card for the full song page.
        </p>

        {loading && (
          <p className="text-center text-[var(--muted)] py-8">Loading songs…</p>
        )}

        {!loading && error && (
          <p className="text-center text-sm text-[var(--red)] py-4">{error}</p>
        )}

        {!loading && !error && songs.length === 0 && (
          <p className="text-center text-sm text-[var(--muted)] py-6">
            No songs to show yet.
          </p>
        )}

        {!loading && !error && songs.length > 0 && (
          <ul className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-5 sm:gap-6 list-none m-0 p-0">
            {songs.map((song) => (
              <li key={song.id}>
                <HomeSongCard song={song} />
              </li>
            ))}
          </ul>
        )}
      </section>
    </div>
  );
}

export default Home;
