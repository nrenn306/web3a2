/**
 * Home Page components which displays the landing page of the website
 */

import { useEffect, useState } from "react";
import { Link } from "react-router-dom";

import hero from "../assets/hero.png";
import { loadMusicFromSupabase } from "../services/musicData";

/**
 * HomeSongCard component which displays song cards in the feature grid
 * 
 * props:
 * @param {Object} song - song data object
 * @param {string|number} song.id
 * @param {string} song.title
 * @param {string} song.artistName
 * @param {string} [song.artistImageUrl]
 * @param {number} [song.year]

 */
function HomeSongCard({ song }) {
  const [imgFailed, setImgFailed] = useState(false); // track image load failure
  // fallback letter for missing images
  const letter = song.artistName && song.artistName.trim() ? song.artistName.trim().charAt(0).toUpperCase() : "?";
  const showImg = song.artistImageUrl && !imgFailed;

  return (
    <Link to={`/songs/${song.id}`} className="block overflow-hidden rounded-lg border border-gray-200 bg-white hover:border-gray-400">
      
      {/* image or fallback */}
      <div className="aspect-video overflow-hidden bg-gray-100">

        {showImg ? (
          <img
            src={song.artistImageUrl}
            alt=""
            className="h-full w-full object-cover"
            onError={() => setImgFailed(true)}
          />
        ) : (
          <div className="flex h-full min-h-[7rem] items-center justify-center text-4xl font-bold text-gray-300">
            {letter}
          </div>
        )}

      </div>

      {/* song details */}
      <div className="p-3 text-left">
        <p className="line-clamp-2 font-semibold text-[var(--dark)]">{song.title}</p>
        <p className="mt-1 line-clamp-1 text-sm text-[var(--muted)]">{song.artistName || "—"}</p>
        {song.year != null ? (
          <p className="mt-1 text-xs tabular-nums text-gray-500">{song.year}</p>
        ) : null}
      </div>

    </Link>

  );
}

/**
 * Home component which is the main landing page of the website
 */
function Home() {
  const [songs, setSongs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // fetch and prepare featured songs 
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

    // cleanup to prevent state updates after unmount
    return () => {
      cancelled = true;
    };

  }, []);

  return (
    <div className="pb-16">

      {/* hero section*/}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 pt-8 sm:pt-12 text-center">
        <div className="relative w-full overflow-hidden rounded-lg border border-gray-200">
          <img src={hero} alt="" className="max-h-72 w-full object-cover sm:max-h-96"/>
          <h1 className="absolute left-1/2 top-1/2 w-[90%] max-w-3xl -translate-x-1/2 -translate-y-1/2 text-center text-4xl font-bold text-white drop-shadow sm:text-6xl">
            Welcome to Dotify
          </h1>
        </div>
      </div>


      {/* featured songs section */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 mt-12 sm:mt-16">
        <h2 className="text-center text-2xl font-bold text-[var(--dark)] sm:text-3xl">Featured songs</h2>
        <p className="mx-auto mb-8 mt-2 max-w-lg text-center text-sm text-[var(--muted)]">
          Songs from our library. Click on a song below to view it's details.
        </p>

        {/* loading state */}
        {loading && (
          <p className="text-center text-[var(--muted)] py-8">Loading songs…</p>
        )}

        {/* error state */}
        {!loading && error && (
          <p className="text-center text-sm text-[var(--red)] py-4">{error}</p>
        )}

        {/* error state */}
        {!loading && !error && songs.length === 0 && (
          <p className="text-center text-sm text-[var(--muted)] py-6">No songs to show yet.</p>
        )}

        {/* songs grid */}
        {!loading && !error && songs.length > 0 && (
          <ul className="m-0 grid list-none grid-cols-2 gap-4 p-0 md:grid-cols-3 lg:grid-cols-4 md:gap-5">
            
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
