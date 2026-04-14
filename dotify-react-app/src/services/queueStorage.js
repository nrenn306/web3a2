/**
 * queueStorage.js stores and manages the current playlist queue in browser localStorage
 * handles adding/removing songs and notifies the app when queue changes
 */

// key name for localStorage and event name for queue changes
export const QUEUE_STORAGE_KEY = "dotify_playlist";
export const QUEUE_CHANGED_EVENT = "dotify-queue-changed";

/**
 * getQueueLength() returns how many songs are in the queue
 */
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

/**
 * getQueueItems() returns all songs in the queue
 */
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

/**
 * setQueueItems() replaces entire queue with new items and notifies listeners
 */
export function setQueueItems(items) {
  localStorage.setItem(QUEUE_STORAGE_KEY, JSON.stringify(items));

  if (typeof window !== "undefined") {
    window.dispatchEvent(new Event(QUEUE_CHANGED_EVENT));
  }
}

/**
 * notifyQueueChanged() triggers queue changed event for listeners
 */
export function notifyQueueChanged() {
  if (typeof window !== "undefined") {
    window.dispatchEvent(new Event(QUEUE_CHANGED_EVENT));
  }
}

/**
 * removeSongIdFromQueue() removes song by ID from queue
 */
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
