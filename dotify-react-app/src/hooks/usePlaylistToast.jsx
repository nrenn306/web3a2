import { useRef, useState } from "react";

// Popup message at bottom of screen
export function PlaylistToast({ message }) {
  if (!message) return null;
  return (
    <div
      role="status"
      className="fixed bottom-6 left-1/2 z-[2000] -translate-x-1/2 max-w-[min(90vw,24rem)] text-center"
    >
      <div className="rounded-xl border border-[var(--accent)]/40 bg-[var(--dark)] text-[var(--white)] px-5 py-3.5 text-sm shadow-xl shadow-[var(--black)]/25 ring-1 ring-[var(--white)]/10">
        <div
          className="mx-auto mb-2 h-0.5 w-8 rounded-full bg-[var(--accent)]"
          aria-hidden
        />
        {message}
      </div>
    </div>
  );
}

const STORAGE_KEY = "dotify_playlist";

// Save song to localStorage + show toast
export function usePlaylistToast() {
  const [toast, setToast] = useState(null);
  const timer = useRef(null);

  function showToast(msg) {
    setToast(msg);
    if (timer.current) clearTimeout(timer.current);
    timer.current = setTimeout(() => {
      setToast(null);
      timer.current = null;
    }, 3200);
  }

  function addToPlaylist(song) {
    try {
      const raw = localStorage.getItem(STORAGE_KEY);
      const list = raw ? JSON.parse(raw) : [];
      if (list.some((x) => x.id === song.id)) {
        showToast(`"${song.title}" is already in your playlist`);
        return;
      }
      list.push({
        id: song.id,
        title: song.title,
        year: song.year,
        artistId: song.artistId,
        artistName: song.artistName,
      });
      localStorage.setItem(STORAGE_KEY, JSON.stringify(list));
      showToast(`"${song.title}" added to playlist`);
    } catch {
      showToast("Could not update playlist");
    }
  }

  return { toast, addToPlaylist };
}
