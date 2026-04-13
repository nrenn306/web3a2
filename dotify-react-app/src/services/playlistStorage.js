import supabase from "./supabase";
import { notifyQueueChanged, QUEUE_STORAGE_KEY } from "./queueStorage";

// Session key: which playlist receives + from Songs
export const TARGET_PLAYLIST_STORAGE_KEY = "dotify_target_playlist_id";
// Tell UI to refetch playlist data
export const SAVED_PLAYLIST_STORAGE_EVENT = "dotify-saved-playlists-changed";
// Session target changed (e.g. user picked another row)
export const TARGET_PLAYLIST_EVENT = "dotify-target-playlist-changed";

// localStorage: use browser-only tracks when DB junction fails
const FLAG = "dotify_playlist_junction_local:";
// localStorage: { userId: { playlistId: [song_id, ...] } }
const TRACKS = "dotify_playlist_track_ids";

function fire() {
  if (typeof window !== "undefined") {
    window.dispatchEvent(new Event(SAVED_PLAYLIST_STORAGE_EVENT));
  }
}

// Per-user flag: tracks stored in browser, not playlist_songs
function localOn(userId) {
  return (
    userId &&
    typeof window !== "undefined" &&
    localStorage.getItem(FLAG + userId) === "1"
  );
}

function setLocalOn(userId) {
  if (userId && typeof window !== "undefined") {
    localStorage.setItem(FLAG + userId, "1");
  }
}

function getMap() {
  if (typeof window === "undefined") return {};
  try {
    const o = JSON.parse(localStorage.getItem(TRACKS) || "{}");
    return o && typeof o === "object" ? o : {};
  } catch {
    return {};
  }
}

function setMap(m) {
  if (typeof window !== "undefined") {
    localStorage.setItem(TRACKS, JSON.stringify(m));
  }
}

// Ordered song ids for one playlist (local mode)
function trackList(userId, plId) {
  const a = getMap()[userId]?.[String(plId)];
  if (!Array.isArray(a)) return [];
  return a.filter((n) => typeof n === "number" && Number.isFinite(n));
}

function setTracks(userId, plId, ids) {
  const m = getMap();
  if (!m[userId]) m[userId] = {};
  m[userId][String(plId)] = ids;
  setMap(m);
}

function pushTrack(userId, plId, songId) {
  const cur = trackList(userId, plId);
  if (cur.includes(songId)) return { dup: true };
  cur.push(songId);
  setTracks(userId, plId, cur);
  return { dup: false };
}

function pullTrack(userId, plId, songId) {
  const cur = trackList(userId, plId);
  const next = cur.filter((x) => x !== songId);
  if (next.length === cur.length) return;
  setTracks(userId, plId, next);
}

function clearTracks(userId, plId) {
  const m = getMap();
  if (!m[userId]) return;
  delete m[userId][String(plId)];
  if (Object.keys(m[userId]).length === 0) delete m[userId];
  setMap(m);
}

// Playlist id for UI / session (handles number or string)
function str(v) {
  return v == null || v === "" ? "" : String(v);
}

// song_id for DB (must be a number)
function asNum(id) {
  const n = Number(id);
  return Number.isFinite(n) ? n : null;
}

// playlist_songs missing or wrong type — fall back to local tracks
function badPlaylistSongs(e) {
  if (!e) return false;
  const m = (e.message || "").toLowerCase();
  if (["22P02", "PGRST205", "42P01"].includes(e.code)) return true;
  if (!m.includes("playlist_songs")) return false;
  if (
    m.includes("schema cache") ||
    m.includes("could not find") ||
    m.includes("does not exist") ||
    m.includes("not find the table")
  ) {
    return true;
  }
  return m.includes("bigint") && /[0-9a-f]{8}-/.test(m);
}

// Append song id locally; optionally turn on local-only mode
function addSongLocal(userId, plId, songId, turnOnFlag) {
  if (turnOnFlag) setLocalOn(userId);
  const dup = pushTrack(userId, plId, songId).dup;
  fire();
  return { error: null, duplicate: dup };
}

// Build song rows for UI from numeric song_ids
async function rowsFromSongIds(orderIds) {
  const ids = [...new Set(orderIds.filter((x) => x != null))];
  if (!ids.length) return [];
  const { data: songs, error } = await supabase
    .from("songs")
    .select("song_id, title, year, artist_id")
    .in("song_id", ids);
  if (error || !songs?.length) return [];

  const bySong = new Map(songs.map((r) => [String(r.song_id), r]));
  const artistIds = [...new Set(songs.map((r) => r.artist_id).filter(Boolean))];
  const names = new Map();
  if (artistIds.length) {
    const { data: artists } = await supabase
      .from("artists")
      .select("artist_id, artist_name")
      .in("artist_id", artistIds);
    for (const a of artists || []) {
      names.set(String(a.artist_id), String(a.artist_name || "").trim());
    }
  }

  const out = [];
  for (const sid of orderIds) {
    const row = bySong.get(String(sid));
    if (!row) continue;
    const aid = row.artist_id != null ? String(row.artist_id) : "";
    const y = row.year != null && row.year !== "" ? Number(row.year) : NaN;
    out.push({
      id: String(row.song_id),
      title: String(row.title || "").trim() || "Untitled",
      year: Number.isNaN(y) ? null : y,
      artistId: aid,
      artistName: names.get(aid) || "",
      genres: [],
    });
  }
  return out;
}

// Insert failed because playlists.id had no default
function nullIdError(e) {
  const m = (e?.message || "").toLowerCase();
  if (!m.includes("playlists")) return false;
  return (
    e?.code === "23502" ||
    (m.includes("null value") && m.includes("id")) ||
    m.includes("not-null") ||
    m.includes("not null")
  );
}

// Client id when DB expects uuid/text
function randomId() {
  return typeof crypto !== "undefined" && crypto.randomUUID
    ? crypto.randomUUID()
    : "id-" + Date.now() + "-" + Math.random().toString(16).slice(2);
}

// Next bigint id when table has no identity
async function nextPlaylistId() {
  const { data, error } = await supabase
    .from("playlists")
    .select("id")
    .order("id", { ascending: false })
    .limit(1)
    .maybeSingle();
  if (error) return null;
  const n = data?.id != null ? Number(data.id) : 0;
  return Number.isFinite(n) && n >= 0 ? n + 1 : 1;
}

// Names + song counts for this user
export async function getPlaylists(userId) {
  if (!userId) return [];
  const { data: rows, error } = await supabase
    .from("playlists")
    .select("id, playlist_name")
    .eq("user_id", userId)
    .order("id", { ascending: true });
  if (error) return [];
  const list = rows || [];
  if (!list.length) return [];

  // Song counts from browser only
  if (localOn(userId)) {
    return list.map((p) => ({
      id: str(p.id),
      playlist_name: p.playlist_name ?? "",
      songCount: trackList(userId, str(p.id)).length,
    }));
  }

  // Song counts from playlist_songs
  const { data: ps, error: psErr } = await supabase
    .from("playlist_songs")
    .select("playlist_id")
    .in("playlist_id", list.map((r) => r.id));

  if (psErr && badPlaylistSongs(psErr)) {
    setLocalOn(userId);
    return list.map((p) => ({
      id: str(p.id),
      playlist_name: p.playlist_name ?? "",
      songCount: trackList(userId, str(p.id)).length,
    }));
  }

  const n = {};
  for (const r of ps || []) {
    const k = str(r.playlist_id);
    n[k] = (n[k] || 0) + 1;
  }
  return list.map((p) => {
    const id = str(p.id);
    return { id, playlist_name: p.playlist_name ?? "", songCount: n[id] || 0 };
  });
}

// Songs in one playlist (order preserved)
export async function getPlaylistSongs(userId, playlistId) {
  if (!userId || !playlistId) return [];
  if (localOn(userId)) {
    return rowsFromSongIds(trackList(userId, playlistId));
  }
  const { data: ps, error } = await supabase
    .from("playlist_songs")
    .select("song_id")
    .eq("playlist_id", playlistId)
    .order("added_at", { ascending: true });
  if (error && badPlaylistSongs(error)) {
    setLocalOn(userId);
    return rowsFromSongIds(trackList(userId, playlistId));
  }
  if (error || !ps?.length) return [];
  return rowsFromSongIds(ps.map((r) => r.song_id));
}

// New row in playlists
export async function createPlaylist(userId, name) {
  if (!userId) return { playlist: null, error: "You must be logged in." };
  const playlist_name = String(name || "").trim();
  if (!playlist_name) return { playlist: null, error: "Enter a name." };

  const row = { user_id: userId, playlist_name };
  let res = await supabase.from("playlists").insert(row).select("id, playlist_name").single();

  let fix = false;
  // Some DBs need an explicit id (uuid)
  if (res.error && nullIdError(res.error)) {
    fix = true;
    res = await supabase
      .from("playlists")
      .insert({ ...row, id: randomId() })
      .select("id, playlist_name")
      .single();
  }
  // Or bigint without identity
  if (res.error && fix) {
    const nid = await nextPlaylistId();
    if (nid != null) {
      res = await supabase
        .from("playlists")
        .insert({ ...row, id: nid })
        .select("id, playlist_name")
        .single();
    }
  }

  if (res.error) {
    return { playlist: null, error: res.error.message || "Could not create playlist." };
  }
  fire();
  return {
    playlist: {
      id: str(res.data.id),
      playlist_name: res.data.playlist_name || playlist_name,
      songCount: 0,
    },
    error: null,
  };
}

// Remove playlist row (+ local track list)
export async function deletePlaylist(userId, playlistId) {
  if (!userId) return { error: "You must be logged in." };
  const { error } = await supabase
    .from("playlists")
    .delete()
    .eq("id", playlistId)
    .eq("user_id", userId);
  if (error) return { error: error.message || "Could not delete playlist." };
  clearTracks(userId, playlistId);
  fire();
  return { error: null };
}

// Remove one song from a playlist
export async function removeSongFromPlaylist(userId, playlistId, songId) {
  if (!userId) return { error: "You must be logged in." };
  const sid = asNum(songId);
  if (sid == null) return { error: "Invalid song." };

  if (localOn(userId)) {
    pullTrack(userId, playlistId, sid);
    fire();
    return { error: null };
  }

  const { error } = await supabase
    .from("playlist_songs")
    .delete()
    .eq("playlist_id", playlistId)
    .eq("song_id", sid);

  if (error && badPlaylistSongs(error)) {
    setLocalOn(userId);
    pullTrack(userId, playlistId, sid);
    fire();
    return { error: null };
  }
  if (error) return { error: error.message || "Could not remove song." };
  fire();
  return { error: null };
}

// Add one song to a playlist (Supabase or local)
export async function addSongToPlaylist(userId, playlistId, song) {
  if (!userId) return { error: "Not logged in.", duplicate: false };
  const sid = asNum(song.id);
  if (sid == null) return { error: "Invalid song.", duplicate: false };

  if (localOn(userId)) {
    return addSongLocal(userId, playlistId, sid, false);
  }

  const { data: dup, error: dupErr } = await supabase
    .from("playlist_songs")
    .select("song_id")
    .eq("playlist_id", playlistId)
    .eq("song_id", sid)
    .limit(1);

  if (dupErr && badPlaylistSongs(dupErr)) {
    return addSongLocal(userId, playlistId, sid, true);
  }
  if (dupErr) return { error: dupErr.message || "Could not check playlist.", duplicate: false };
  if (dup?.length) return { error: null, duplicate: true };

  const { error } = await supabase
    .from("playlist_songs")
    .insert({ playlist_id: playlistId, song_id: sid });

  if (error) {
    if (error.code === "23505") return { error: null, duplicate: true };
    if (badPlaylistSongs(error)) {
      return addSongLocal(userId, playlistId, sid, true);
    }
    return { error: error.message || "Could not add song.", duplicate: false };
  }
  fire();
  return { error: null, duplicate: false };
}

// + button: playlist + playback queue
export async function addSongToPlaylistWithQueue(userId, song) {
  const target =
    typeof sessionStorage !== "undefined"
      ? sessionStorage.getItem(TARGET_PLAYLIST_STORAGE_KEY)
      : null;

  if (target && userId) {
    const r = await addSongToPlaylist(userId, target, song);
    if (r.duplicate) return `"${song.title}" is already in that playlist`;
    if (r.error) return r.error;
  }

  try {
    const raw = localStorage.getItem(QUEUE_STORAGE_KEY);
    const list = raw ? JSON.parse(raw) : [];
    const id = String(song.id);
    if (list.some((x) => String(x.id) === id)) {
      if (target && userId) return `"${song.title}" added to your playlist`;
      return `"${song.title}" is already in your queue`;
    }
    list.push({
      id: song.id,
      title: song.title,
      year: song.year,
      artistId: song.artistId,
      artistName: song.artistName,
    });
    localStorage.setItem(QUEUE_STORAGE_KEY, JSON.stringify(list));
    notifyQueueChanged();
    if (target && userId) {
      return `"${song.title}" added to your playlist and queue`;
    }
    return `"${song.title}" added to playlist`;
  } catch {
    return "Could not update playlist";
  }
}
