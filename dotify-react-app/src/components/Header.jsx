// https://www.youtube.com/watch?v=2-6K-TMA-nw

/**
 * Header component to display main navigation bar 
 */
import { useEffect, useState } from "react";
import { Link } from "react-router-dom";

import { useAuth } from "../context/AuthContext";
import dotifyLogo from "../assets/dotifyLogo.png";
import { getPlaylistSongs, SAVED_PLAYLIST_STORAGE_EVENT, TARGET_PLAYLIST_EVENT, TARGET_PLAYLIST_STORAGE_KEY, } from "../services/playlistStorage";

function Header() {
  const { user, logout } = useAuth(); // authentication state from context 

  const [currentPlaylistCount, setCurrentPlaylistCount] = useState(0); // number of songs in the currently selected playlist

  // effect hook to keep playlist song count in sync
  useEffect(() => {
    function updateCount() {
      const uid = user?.id;

      if (!uid || typeof sessionStorage === "undefined") {
        setCurrentPlaylistCount(0);
        return;
      }

      const targetId = sessionStorage.getItem(TARGET_PLAYLIST_STORAGE_KEY);

      if (!targetId) {
        setCurrentPlaylistCount(0);
        return;
      }

      getPlaylistSongs(uid, targetId)
        .then((songs) => {
          setCurrentPlaylistCount(Array.isArray(songs) ? songs.length : 0);
        })
        .catch(() => setCurrentPlaylistCount(0));
    }

    updateCount(); // initial fetch

    // listen for playlist updates 
    window.addEventListener(SAVED_PLAYLIST_STORAGE_EVENT, updateCount);
    window.addEventListener(TARGET_PLAYLIST_EVENT, updateCount);
    
    // cleanup listeners 
    return () => {
      window.removeEventListener(SAVED_PLAYLIST_STORAGE_EVENT, updateCount);
      window.removeEventListener(TARGET_PLAYLIST_EVENT, updateCount);
    };
  }, [user?.id]);

  return (
    <header className="w-full bg-white text-[var(--dark)] px-6 py-4 sticky top-0 z-40 border-b border-gray-200">
      <div className="flex justify-between items-center gap-8">
        {/* Logo */}
        <Link to="/home" className="flex items-center gap-2 no-underline text-inherit flex-shrink-0">
          <img
            src={dotifyLogo}
            alt="Dotify Logo"
            className="h-12 w-12 sm:h-16 sm:w-16 md:h-20 md:w-20"
          />
        </Link>

        {/* Main nav links */}
        <nav className="flex gap-6 flex-1 justify-center">
          {user ? (
            <>
              <Link to="/home" className="text-inherit whitespace-nowrap hover:text-[var(--red)] transition-colors">
                Home
              </Link>

              <Link to="/artists" className="text-inherit whitespace-nowrap hover:text-[var(--red)] transition-colors">
                Artists
              </Link>
              
              <Link to="/genres" className="text-inherit whitespace-nowrap hover:text-[var(--red)] transition-colors">
                Genres
              </Link>

              <Link to="/playlists" className="text-inherit whitespace-nowrap hover:text-[var(--red)] transition-colors">
                Playlists
              </Link>
              
              <Link to="/songs" className="text-inherit whitespace-nowrap hover:text-[var(--red)] transition-colors">
                Songs
              </Link>

              {/* current playlist with count badge */}
              <Link to="/current-playlist" className="flex items-center gap-2 whitespace-nowrap text-inherit hover:text-[var(--red)] transition-colors">
                Current Playlist
                <span className="bg-red-500 text-white text-xs px-2 py-0.5 rounded-full tabular-nums">
                  {currentPlaylistCount}
                </span>
              </Link>
            </>
          ) : (
            <>
            {/* disabled navigation when user not logged in */}
              <span className="text-inherit whitespace-nowrap cursor-not-allowed">Home</span>
              <span className="text-inherit whitespace-nowrap cursor-not-allowed">Artists</span>
              <span className="text-inherit whitespace-nowrap cursor-not-allowed">Genres</span>
              <span className="text-inherit whitespace-nowrap cursor-not-allowed">Playlists</span>
              <span className="text-inherit whitespace-nowrap cursor-not-allowed">Songs</span>
            </>
          )}
        </nav>

        {/* Account */}
        <div className="flex flex-col items-end gap-2 whitespace-nowrap">
          {user && <span className="text-sm">{user?.email}</span>}

          {user && (
            <button
              type="button"
              onClick={() => logout()}
              className="bg-[var(--accent)] text-[var(--black)] px-4 py-2 rounded cursor-pointer font-bold hover:text-white transition-colors"
            >
              Logout
            </button>
          )}
        </div>
      </div>
    </header>
  );
}

export default Header;
