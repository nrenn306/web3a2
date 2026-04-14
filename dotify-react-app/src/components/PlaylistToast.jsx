/**
 * playlist toast and hook utilities: 
 * - UI component for displaying temporary toast messages
 * - custom hook for managing playlist actions and toast notifications
 */

import { useRef, useState } from "react";

import { useAuth } from "../context/AuthContext";
import { addSongToPlaylistWithQueue } from "../services/playlistStorage";


/**
 * PlaylistToast component for displaying temporary toast notification
 * 
 * props:
 * @param {string|null} message - message to display in the toast. If null, nothing is rendered.
 */
export function PlaylistToast({ message }) {
  if (!message) return null;

  return (
    <div
      role="status"
      className="fixed bottom-6 left-1/2 z-[2000] -translate-x-1/2 max-w-[min(90vw,24rem)] px-3 text-center"
    >
      <div className="rounded-xl border border-[var(--accent)]/40 bg-[var(--dark)] px-5 py-3.5 text-sm text-[var(--white)] shadow-xl shadow-[var(--black)]/25 ring-1 ring-[var(--white)]/10">
        
        {/* account indicator bar */}
        <div className="mx-auto mb-2 h-0.5 w-8 rounded-full bg-[var(--accent)]" aria-hidden/>
        {message}
      </div>
    </div>
  );
}

/**
 * usePlaylistToast hook for handling adding songs to playlist
 * 
 * @returns 
 * - toast: string|null
 * - addToPlaylist: function
 */
export function usePlaylistToast() {
  const { user } = useAuth(); // authenticated user from context
  const [toast, setToast] = useState(null); // current toast message
  const timer = useRef(null); // timer reference for auto-clearing toast

  /**
   * displays toast message and auto-hides
   */
  function showToast(msg) {
    setToast(msg);

    if (timer.current) clearTimeout(timer.current);

    timer.current = setTimeout(() => {
      setToast(null);
      timer.current = null;
    }, 3200);

  }

  /**
   * adds a song to the user's playlist queue and shows toast 
   * @param {Object} song - song object to add to playlist
   */
  async function addToPlaylist(song) {
    const msg = await addSongToPlaylistWithQueue(user?.id ?? null, song);

    if (msg) showToast(msg);
  }

  return { toast, addToPlaylist };
}
