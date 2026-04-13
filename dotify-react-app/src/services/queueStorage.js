// Browser queue for "Current playlist" (header badge + /current-playlist page)

export const QUEUE_STORAGE_KEY = "dotify_playlist";
export const QUEUE_CHANGED_EVENT = "dotify-queue-changed";

// Read how many tracks are queued
export function getQueueLength() {
  try {
    const raw = localStorage.getItem(QUEUE_STORAGE_KEY);

    if (!raw) return 0;

    const list = JSON.parse(raw);

    return Array.isArray(list) ? list.length : 0;
  } catch {
    return 0;
  }
}

export function getQueueItems() {
  try {
    const raw = localStorage.getItem(QUEUE_STORAGE_KEY);

    if (!raw) return [];

    const list = JSON.parse(raw);

    return Array.isArray(list) ? list : [];
  } catch {
    return [];
  }
}

// Replace whole queue (used after edits)
export function setQueueItems(items) {
  localStorage.setItem(QUEUE_STORAGE_KEY, JSON.stringify(items));

  if (typeof window !== "undefined") {
    window.dispatchEvent(new Event(QUEUE_CHANGED_EVENT));
  }
}

// Broadcast after manual localStorage writes to dotify_playlist
export function notifyQueueChanged() {
  if (typeof window !== "undefined") {
    window.dispatchEvent(new Event(QUEUE_CHANGED_EVENT));
  }
}

/** Remove every queue entry whose id matches songId (string-normalized). */
export function removeSongIdFromQueue(songId) {
  try {
    const items = getQueueItems();
    const sid = String(songId);
    const next = items.filter((x) => String(x.id) !== sid);

    if (next.length === items.length) return;
    
    setQueueItems(next);
  } catch {
    // ignore corrupt queue
  }
}
