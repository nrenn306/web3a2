import { useEffect, useState } from "react";
import { Link } from "react-router-dom";

import { useAuth } from "../context/AuthContext";
import { removeSongIdFromQueue } from "../services/queueStorage";
import {
  getPlaylists,
  getPlaylistSongs,
  removeSongFromPlaylist,
  SAVED_PLAYLIST_STORAGE_EVENT,
  TARGET_PLAYLIST_EVENT,
  TARGET_PLAYLIST_STORAGE_KEY,
} from "../services/playlistStorage";

function sameId(a, b) {
  return String(a ?? "") === String(b ?? "");
}

// Uses session target = same playlist as + on Songs
function CurrentPlaylist() {
  const { user } = useAuth();
  const userId = user?.id ?? null;
  const [items, setItems] = useState([]);
  const [playlistName, setPlaylistName] = useState("");

  // Songs + title for session target playlist
  async function load() {
    if (!userId || typeof sessionStorage === "undefined") {
      setItems([]);
      setPlaylistName("");
      return;
    }
    const targetId = sessionStorage.getItem(TARGET_PLAYLIST_STORAGE_KEY);
    if (!targetId) {
      setItems([]);
      setPlaylistName("");
      return;
    }
    try {
      const [songs, lists] = await Promise.all([
        getPlaylistSongs(userId, targetId),
        getPlaylists(userId),
      ]);
      setItems(songs);
      const meta = lists.find((p) => sameId(p.id, targetId));
      setPlaylistName(meta ? meta.playlist_name : "");
    } catch {
      setItems([]);
      setPlaylistName("");
    }
  }

  // Reload when target or saved data changes
  useEffect(() => {
    load();
    window.addEventListener(SAVED_PLAYLIST_STORAGE_EVENT, load);
    window.addEventListener(TARGET_PLAYLIST_EVENT, load);
    return () => {
      window.removeEventListener(SAVED_PLAYLIST_STORAGE_EVENT, load);
      window.removeEventListener(TARGET_PLAYLIST_EVENT, load);
    };
  }, [userId]);

  // Remove from saved playlist and queue
  async function handleRemove(songId) {
    if (!userId) return;
    const targetId =
      typeof sessionStorage !== "undefined"
        ? sessionStorage.getItem(TARGET_PLAYLIST_STORAGE_KEY)
        : null;
    if (!targetId) return;
    await removeSongFromPlaylist(userId, targetId, songId);
    removeSongIdFromQueue(songId);
    await load();
  }

  const linkClass =
    "text-[var(--accent)] font-medium hover:text-[var(--red)] hover:underline underline-offset-2";

  if (!user) {
    return (
      <div className="max-w-3xl mx-auto px-4 sm:px-6 py-16 text-center text-[var(--muted)]">
        <p>Log in to see your current playlist.</p>
      </div>
    );
  }

  if (
    typeof sessionStorage === "undefined" ||
    !sessionStorage.getItem(TARGET_PLAYLIST_STORAGE_KEY)
  ) {
    return (
      <div className="max-w-3xl mx-auto px-4 sm:px-6 py-10 sm:py-12 text-center">
        <h1 className="text-2xl sm:text-3xl font-bold text-[var(--dark)] mb-3">
          Current playlist
        </h1>
        <p className="text-[var(--muted)] mb-6">
          Select a playlist on the{" "}
          <Link to="/playlists" className={linkClass}>
            Playlists
          </Link>{" "}
          page.
        </p>
      </div>
    );
  }

  return (
    <div className="max-w-3xl mx-auto px-4 sm:px-6 py-10 sm:py-12">
      <h1 className="text-2xl sm:text-3xl font-bold text-[var(--dark)] text-center mb-1">
        Current playlist
      </h1>
      {playlistName ? (
        <p className="text-center text-base font-semibold text-[var(--dark)] mb-2">
          {playlistName}
        </p>
      ) : null}

      {items.length === 0 ? (
        <p className="text-center text-[var(--muted)] py-8">
          No songs in this playlist yet.
        </p>
      ) : (
        <div className="overflow-hidden rounded-lg border border-gray-200 bg-white">
          <ul className="m-0 list-none divide-y divide-gray-200 p-0">
            {items.map((song) => (
              <li
                key={song.id}
                className="flex flex-wrap items-center gap-3 px-4 py-3 sm:px-5"
              >
                <div className="flex-1 min-w-0">
                  <Link to={`/songs/${song.id}`} className={linkClass}>
                    {song.title}
                  </Link>
                  {song.artistName ? (
                    <p className="text-sm text-[var(--muted)] mt-0.5 truncate">
                      {song.artistName}
                      {song.year != null ? ` · ${song.year}` : ""}
                    </p>
                  ) : null}
                </div>
                <button
                  type="button"
                  onClick={() => handleRemove(song.id)}
                  className="shrink-0 rounded border border-gray-300 px-3 py-1 text-sm text-[var(--red)] hover:bg-gray-50"
                >
                  Remove
                </button>
              </li>
            ))}
          </ul>
        </div>
      )}
    </div>
  );
}

export default CurrentPlaylist;
