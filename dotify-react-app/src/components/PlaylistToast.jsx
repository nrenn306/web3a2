import { useRef, useState } from "react";

import { useAuth } from "../context/AuthContext";
import { addSongToPlaylistWithQueue } from "../services/playlistStorage";


// Fixed toast bar (Songs / SingleSong / Playlists)
export function PlaylistToast({ message }) {
  if (!message) return null;

  return (
    <div
      role="status"
      className="fixed bottom-6 left-1/2 z-[2000] -translate-x-1/2 max-w-[min(90vw,24rem)] px-3 text-center"
    >
      <div className="rounded-xl border border-[var(--accent)]/40 bg-[var(--dark)] px-5 py-3.5 text-sm text-[var(--white)] shadow-xl shadow-[var(--black)]/25 ring-1 ring-[var(--white)]/10">
        <div
          className="mx-auto mb-2 h-0.5 w-8 rounded-full bg-[var(--accent)]"
          aria-hidden
        />
        {message}
      </div>
    </div>
  );
}

// + button → playlist + queue, with toast
export function usePlaylistToast() {
  const { user } = useAuth();
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

  async function addToPlaylist(song) {
    const msg = await addSongToPlaylistWithQueue(user?.id ?? null, song);
    
    if (msg) showToast(msg);
  }

  return { toast, addToPlaylist };
}
