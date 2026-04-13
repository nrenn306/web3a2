import { useCallback, useEffect, useRef, useState } from "react";
import { Link } from "react-router-dom";

import { useAuth } from "../context/AuthContext";
import { PlaylistToast } from "./PlaylistToast";
import { removeSongIdFromQueue } from "../services/queueStorage";
import {
  createPlaylist,
  deletePlaylist,
  getPlaylistSongs,
  getPlaylists,
  removeSongFromPlaylist,
  SAVED_PLAYLIST_STORAGE_EVENT,
  TARGET_PLAYLIST_EVENT,
  TARGET_PLAYLIST_STORAGE_KEY,
} from "../services/playlistStorage";

// Compare playlist ids (string vs number safe)
function sameId(a, b) {
  return String(a ?? "") === String(b ?? "");
}

function Playlists() {
  const { user, loading: authLoading } = useAuth();
  const userId = user?.id ?? null;

  const [playlists, setPlaylists] = useState([]);
  const [selectedId, setSelectedId] = useState(null);
  const [tracks, setTracks] = useState([]);
  const [newName, setNewName] = useState("");
  const [toast, setToast] = useState(null);
  const [pendingDelete, setPendingDelete] = useState(null);
  const toastTimer = useRef(null);
  const prevUserIdRef = useRef(undefined);

  // Short-lived message at bottom
  function showToast(msg) {
    setToast(msg);
    if (toastTimer.current) clearTimeout(toastTimer.current);
    toastTimer.current = setTimeout(() => {
      setToast(null);
      toastTimer.current = null;
    }, 3200);
  }

  function requestDeletePlaylist(id, playlist_name) {
    if (toastTimer.current) {
      clearTimeout(toastTimer.current);
      toastTimer.current = null;
    }
    setToast(null);
    setPendingDelete({ id, playlist_name });
  }

  function cancelDeletePlaylist() {
    setPendingDelete(null);
  }

  // Delete after confirm; clear session if that was the target
  async function confirmDeletePlaylist() {
    if (!userId || !pendingDelete) return;
    if (typeof sessionStorage !== "undefined") {
      const tid = sessionStorage.getItem(TARGET_PLAYLIST_STORAGE_KEY);
      if (sameId(tid, pendingDelete.id)) {
        sessionStorage.removeItem(TARGET_PLAYLIST_STORAGE_KEY);
        window.dispatchEvent(new Event(TARGET_PLAYLIST_EVENT));
      }
    }
    const del = await deletePlaylist(userId, pendingDelete.id);
    if (del.error) {
      showToast(del.error);
      setPendingDelete(null);
      return;
    }
    const deletedId = String(pendingDelete.id ?? "");
    if (sameId(selectedId, deletedId)) setSelectedId(null);
    setPendingDelete(null);
    setPlaylists((prev) => prev.filter((p) => String(p.id) !== deletedId));
    await reload();
    showToast("Playlist deleted");
  }

  // Remember selected row for + on Songs
  useEffect(() => {
    if (typeof sessionStorage === "undefined" || !selectedId) return;
    sessionStorage.setItem(TARGET_PLAYLIST_STORAGE_KEY, String(selectedId));
    window.dispatchEvent(new Event(TARGET_PLAYLIST_EVENT));
  }, [selectedId]);

  // New login → clear selection + target
  useEffect(() => {
    if (authLoading) return;
    const prev = prevUserIdRef.current;
    const next = userId ?? null;
    if (prev !== undefined && prev !== next) {
      setSelectedId(null);
      setTracks([]);
      if (typeof sessionStorage !== "undefined") {
        sessionStorage.removeItem(TARGET_PLAYLIST_STORAGE_KEY);
        window.dispatchEvent(new Event(TARGET_PLAYLIST_EVENT));
      }
    }
    prevUserIdRef.current = next;
  }, [userId, authLoading]);

  const reload = useCallback(async () => {
    if (!userId) {
      setPlaylists([]);
      return;
    }
    try {
      setPlaylists(await getPlaylists(userId));
    } catch {
      setPlaylists([]);
    }
  }, [userId]);

  // Initial load + refresh when songs/playlists change elsewhere
  useEffect(() => {
    reload();
    window.addEventListener(SAVED_PLAYLIST_STORAGE_EVENT, reload);
    return () => window.removeEventListener(SAVED_PLAYLIST_STORAGE_EVENT, reload);
  }, [reload]);

  // Reconcile selection + session with server list
  useEffect(() => {
    let cancelled = false;
    if (!userId || authLoading || typeof sessionStorage === "undefined") return;

    (async () => {
      let list;
      try {
        list = await getPlaylists(userId);
      } catch {
        return;
      }
      if (cancelled) return;

      if (selectedId && !list.find((p) => sameId(p.id, selectedId))) {
        const tid = sessionStorage.getItem(TARGET_PLAYLIST_STORAGE_KEY);
        if (sameId(tid, selectedId)) {
          sessionStorage.removeItem(TARGET_PLAYLIST_STORAGE_KEY);
          window.dispatchEvent(new Event(TARGET_PLAYLIST_EVENT));
        }
        if (!cancelled) setSelectedId(null);
        return;
      }

      const tid = sessionStorage.getItem(TARGET_PLAYLIST_STORAGE_KEY);
      const validIds = list.map((p) => String(p.id));

      if (tid && !validIds.includes(String(tid))) {
        sessionStorage.removeItem(TARGET_PLAYLIST_STORAGE_KEY);
        window.dispatchEvent(new Event(TARGET_PLAYLIST_EVENT));
        if (!cancelled && sameId(selectedId, tid)) setSelectedId(null);
        return;
      }

      if (!cancelled && !selectedId && tid && validIds.includes(String(tid))) {
        setSelectedId(String(tid));
      }
    })();

    return () => {
      cancelled = true;
    };
  }, [userId, authLoading, playlists, selectedId]);

  // Escape closes delete dialog
  useEffect(() => {
    if (!pendingDelete) return;
    function onKey(e) {
      if (e.key === "Escape") setPendingDelete(null);
    }
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [pendingDelete]);

  useEffect(() => {
    let cancelled = false;
    if (!selectedId || !userId) {
      setTracks([]);
      return;
    }
    (async () => {
      try {
        const t = await getPlaylistSongs(userId, selectedId);
        if (!cancelled) setTracks(t);
      } catch {
        if (!cancelled) setTracks([]);
      }
    })();
    return () => {
      cancelled = true;
    };
  }, [selectedId, userId, playlists]);

  // Add row; keep current selection (bottom panel unchanged)
  async function handleAddPlaylist(e) {
    e.preventDefault();
    if (!userId) return;
    const r = await createPlaylist(userId, newName);
    if (r.error) {
      showToast(r.error);
      return;
    }
    setNewName("");
    await reload();
    if (r.playlist) {
      const idStr = String(r.playlist.id);
      setPlaylists((prev) =>
        prev.some((p) => sameId(p.id, idStr))
          ? prev
          : [
              ...prev,
              {
                id: idStr,
                playlist_name: r.playlist.playlist_name ?? "",
                songCount: r.playlist.songCount ?? 0,
              },
            ]
      );
    }
    showToast(`Playlist "${r.playlist.playlist_name}" created`);
  }

  // Remove from selected playlist + queue
  async function handleRemoveSong(songId, title) {
    if (!userId || !selectedId) return;
    const r = await removeSongFromPlaylist(userId, selectedId, songId);
    if (r.error) {
      showToast(r.error);
      return;
    }
    removeSongIdFromQueue(songId);
    await reload();
    try {
      setTracks(await getPlaylistSongs(userId, selectedId));
    } catch {
      setTracks([]);
    }
    showToast(`Removed "${title}" from playlist`);
  }

  const selectedPlaylist = playlists.find((p) => sameId(p.id, selectedId));
  const linkClass =
    "text-[var(--accent)] font-medium hover:text-[var(--red)] hover:underline underline-offset-2";

  // Auth still resolving
  if (authLoading) {
    return (
      <div className="max-w-4xl mx-auto px-4 sm:px-6 py-16 text-center text-[var(--muted)]">
        <p>Loading…</p>
      </div>
    );
  }

  // Route is protected but guard just in case
  if (!user) {
    return (
      <div className="max-w-4xl mx-auto px-4 sm:px-6 py-16 text-center text-[var(--muted)]">
        <p>Log in to see and edit your playlists.</p>
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 py-10 sm:py-12">
      <h1 className="mb-6 text-center text-2xl font-bold text-[var(--dark)] sm:text-3xl">
        Your playlists
      </h1>

      {/* All saved playlist names */}
      <div className="mb-8 overflow-hidden rounded-lg border border-gray-200 bg-white">
        <div className="overflow-x-auto">
          <table className="w-full text-sm text-left min-w-[320px]">
            <thead>
              <tr className="border-b border-gray-200 bg-gray-50">
                <th className="px-4 py-3 font-semibold text-[var(--dark)]">
                  Name
                </th>
                <th className="px-4 py-3 font-semibold text-[var(--dark)] w-24">
                  # Songs
                </th>
                <th className="px-4 py-3 w-14" aria-label="Delete playlist" />
              </tr>
            </thead>
            <tbody>
              {playlists.length === 0 ? (
                <tr>
                  <td
                    colSpan={3}
                    className="px-4 py-8 text-center text-[var(--muted)]"
                  >
                    No playlists yet. Add one below.
                  </td>
                </tr>
              ) : (
                playlists.map((p) => (
                  <tr
                    key={p.id}
                    className={`border-b border-gray-100 last:border-0 ${
                      sameId(selectedId, p.id) ? "bg-amber-50" : ""
                    }`}
                  >
                    <td className="px-4 py-3">
                      <button
                        type="button"
                        onClick={() => setSelectedId(p.id)}
                        className="text-left font-medium text-[var(--dark)] hover:text-[var(--accent)] underline-offset-2 hover:underline"
                      >
                        {p.playlist_name}
                      </button>
                    </td>
                    <td className="px-4 py-3 tabular-nums text-[var(--muted)]">
                      {p.songCount}
                    </td>
                    <td className="px-4 py-3">
                      <button
                        type="button"
                        aria-label={`Delete ${p.playlist_name}`}
                        onClick={() =>
                          requestDeletePlaylist(p.id, p.playlist_name)
                        }
                        className="inline-flex h-9 w-9 items-center justify-center rounded-lg border border-[var(--accent)] bg-[var(--accent)] text-lg text-[var(--black)] hover:bg-[var(--dark)] hover:border-[var(--dark)] hover:text-white"
                      >
                        −
                      </button>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Add another playlist */}
      <form
        onSubmit={handleAddPlaylist}
        className="mb-10 flex flex-col gap-3 rounded-lg border border-gray-200 bg-white p-4 sm:flex-row sm:items-end"
      >
        <div className="flex-1 min-w-0">
          <label
            htmlFor="new-playlist-name"
            className="mb-1 block text-sm text-[var(--muted)]"
          >
            Name
          </label>
          <input
            id="new-playlist-name"
            value={newName}
            onChange={(e) => setNewName(e.target.value)}
            placeholder="New playlist name"
            className="w-full rounded border border-gray-300 px-3 py-2 text-[var(--text)]"
          />
        </div>
        <button
          type="submit"
          className="inline-flex h-10 min-w-[2.75rem] items-center justify-center rounded-lg border-2 border-[var(--accent)] bg-[var(--accent)] px-4 text-xl font-bold text-[var(--black)] hover:bg-[var(--dark)] hover:border-[var(--dark)] hover:text-white"
          aria-label="Add playlist"
        >
          +
        </button>
      </form>

      {/* Tracks for whichever row is selected */}
      <section>
        <h2
          className={`text-lg font-bold text-[var(--dark)] ${
            selectedId ? "mb-4" : "mb-1"
          }`}
        >
          {selectedPlaylist
            ? `Songs in “${selectedPlaylist.playlist_name}”`
            : "Playlist songs"}
        </h2>
        {!selectedId ? (
          <p className="text-sm text-[var(--muted)] mb-4">
            Click a playlist name to open it, then add songs with + on the Songs
            page.
          </p>
        ) : null}

        {selectedId && (
          <div className="overflow-hidden rounded-lg border border-gray-200 bg-white">
            <div className="overflow-x-auto">
              <table className="w-full text-sm text-left min-w-[420px]">
                <thead>
                  <tr className="border-b border-gray-200 bg-gray-50">
                    <th className="px-4 py-3 font-semibold text-[var(--dark)]">
                      Title
                    </th>
                    <th className="px-4 py-3 font-semibold text-[var(--dark)]">
                      Artist
                    </th>
                    <th className="px-4 py-3 font-semibold text-[var(--dark)] w-20">
                      Year
                    </th>
                    <th className="px-4 py-3 w-14" aria-label="Remove from playlist" />
                  </tr>
                </thead>
                <tbody>
                  {tracks.length === 0 ? (
                    <tr>
                      <td
                        colSpan={4}
                        className="px-4 py-8 text-center text-[var(--muted)]"
                      >
                        There are no songs in this playlist.
                      </td>
                    </tr>
                  ) : (
                    tracks.map((s) => (
                      <tr
                        key={s.id}
                        className="border-b border-[var(--dark)]/5 last:border-0"
                      >
                        <td className="px-4 py-3">
                          <Link to={`/songs/${s.id}`} className={linkClass}>
                            {s.title}
                          </Link>
                        </td>
                        <td className="px-4 py-3">
                          {s.artistId ? (
                            <Link
                              to={`/artists/${s.artistId}`}
                              className={linkClass}
                            >
                              {s.artistName || "—"}
                            </Link>
                          ) : (
                            <span className="text-[var(--muted)]">
                              {s.artistName || "—"}
                            </span>
                          )}
                        </td>
                        <td className="px-4 py-3 tabular-nums text-[var(--muted)]">
                          {s.year ?? "—"}
                        </td>
                        <td className="px-4 py-3">
                          <button
                            type="button"
                            aria-label={`Remove ${s.title}`}
                            onClick={() => handleRemoveSong(s.id, s.title)}
                            className="inline-flex h-9 w-9 items-center justify-center rounded-lg border border-[var(--accent)] bg-[var(--accent)] text-lg text-[var(--black)] hover:bg-[var(--dark)] hover:border-[var(--dark)] hover:text-white"
                          >
                            −
                          </button>
                        </td>
                      </tr>
                    ))
                  )}
                </tbody>
              </table>
            </div>
          </div>
        )}
      </section>

      <PlaylistToast message={toast} />

      {/* Bottom sheet: really delete playlist? */}
      {pendingDelete ? (
        <div
          role="dialog"
          aria-modal="true"
          aria-labelledby="delete-playlist-question"
          className="fixed bottom-4 left-1/2 z-50 w-full max-w-sm -translate-x-1/2 px-3"
        >
          <div className="rounded-lg border border-gray-700 bg-gray-900 px-4 py-3 text-sm text-white shadow">
            <p id="delete-playlist-question" className="mb-3 text-center">
              Delete playlist &quot;{pendingDelete.playlist_name}&quot;?
            </p>
            <div className="flex justify-center gap-2">
              <button
                type="button"
                onClick={cancelDeletePlaylist}
                className="rounded border border-gray-500 px-3 py-1 text-white hover:bg-gray-800"
              >
                No
              </button>
              <button
                type="button"
                onClick={confirmDeletePlaylist}
                className="rounded bg-red-600 px-3 py-1 font-medium text-white hover:bg-red-700"
              >
                Yes, delete
              </button>
            </div>
          </div>
        </div>
      ) : null}
    </div>
  );
}

export default Playlists;
