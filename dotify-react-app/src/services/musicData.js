import supabase from "./supabase";

// Turn DB ids into strings so Map lookups always match
function idKey(v) {
  if (v == null || v === "") return "";
  return String(v).trim();
}

// Load genre rows from genres + genre tables (your DB might use either name)
export async function fetchAllGenreRows() {
  const [g1, g2] = await Promise.all([
    supabase.from("genres").select("genre_id, genre_name"),
    supabase.from("genre").select("genre_id, genre_name"),
  ]);

  const byId = new Map();
  for (const res of [g1, g2]) {
    if (res.error || !res.data?.length) continue;
    for (const row of res.data) {
      const id = idKey(row.genre_id);
      const name = row.genre_name != null ? String(row.genre_name).trim() : "";
      if (id && name) byId.set(id, { genre_id: row.genre_id, genre_name: name });
    }
  }

  const rows = [...byId.values()].sort((a, b) =>
    a.genre_name.localeCompare(b.genre_name)
  );

  let error = null;
  if (g1.error && g2.error) {
    error = `Could not load genre tables: ${g1.error.message}. Check RLS on genres/genre.`;
  }
  return { rows, error };
}

// Build lookup maps + sidebar lists from artists + genre rows
function buildMaps(artistRes, genreRows) {
  const artistById = new Map();
  const artistImageById = new Map();
  const catalogArtists = [];
  if (!artistRes.error && artistRes.data?.length) {
    for (const a of artistRes.data) {
      const key = idKey(a.artist_id);
      const name = a.artist_name != null ? String(a.artist_name).trim() : "";
      if (name) {
        artistById.set(key, name);
        catalogArtists.push({ id: key, name });
      }
      const url =
        a.artist_image_url != null ? String(a.artist_image_url).trim() : "";
      if (url) artistImageById.set(key, url);
    }
    catalogArtists.sort((x, y) => x.name.localeCompare(y.name));
  }

  const genreById = new Map();
  const catalogGenres = [];
  for (const g of genreRows) {
    genreById.set(idKey(g.genre_id), g.genre_name);
    catalogGenres.push(g.genre_name);
  }

  return { artistById, artistImageById, catalogArtists, genreById, catalogGenres };
}

// Raw song rows + maps -> objects the UI uses
function toSongList(rows, artistById, genreById, artistImageById = new Map()) {
  return rows
    .map((row) => {
      const aid = idKey(row.artist_id);
      const y =
        row.year != null && row.year !== "" ? Number(row.year) : null;
      const year = y != null && !Number.isNaN(y) ? y : null;
      const gname = genreById.get(idKey(row.genre_id)) ?? "";

      return {
        id: row.song_id != null ? String(row.song_id) : "",
        title: (row.title != null ? String(row.title) : "").trim() || "Untitled",
        year,
        artistId: aid,
        artistName: artistById.get(aid) ?? "",
        artistImageUrl: artistImageById.get(aid) ?? "",
        genres: gname ? [gname] : [],
      };
    })
    .filter((s) => s.id);
}

function joinWarnings(artistRes, genrePack) {
  const parts = [];
  if (artistRes.error) {
    parts.push(`Artists table: ${artistRes.error.message} (check RLS).`);
  }
  if (genrePack.error) parts.push(genrePack.error);
  return parts.length ? parts.join(" ") : null;
}

const FULL =
  "song_id, title, artist_id, genre_id, year, bpm, energy, danceability, loudness, liveness, valence, duration, acousticness, speechiness, popularity";
const CORE = "song_id, title, artist_id, genre_id, year";

// All songs for browse page + artist/genre names for filters
export async function loadMusicFromSupabase() {
  const [songRes, artistRes, genrePack] = await Promise.all([
    supabase.from("songs").select(FULL),
    supabase
      .from("artists")
      .select("artist_id, artist_name, artist_image_url"),
    fetchAllGenreRows(),
  ]);

  let songsRes = songRes;
  if (songsRes.error) {
    songsRes = await supabase.from("songs").select(CORE);
  }

  if (songsRes.error) {
    return {
      songs: [],
      catalogArtists: [],
      catalogGenres: [],
      songError: songsRes.error.message ?? "Could not load songs.",
      joinNotice: null,
    };
  }

  const {
    artistById,
    artistImageById,
    catalogArtists,
    genreById,
    catalogGenres,
  } = buildMaps(artistRes, genrePack.rows);
  const songs = toSongList(
    songsRes.data ?? [],
    artistById,
    genreById,
    artistImageById
  );

  return {
    songs,
    catalogArtists,
    catalogGenres,
    songError: null,
    joinNotice: joinWarnings(artistRes, genrePack),
  };
}

// Songs where one column matches (artist page or genre page)
async function loadSongsFiltered(eqColumn, eqValue) {
  const songRes = await supabase
    .from("songs")
    .select(CORE)
    .eq(eqColumn, eqValue);

  if (songRes.error) {
    return { songs: [], songError: songRes.error.message, joinNotice: null };
  }

  const [artistRes, genrePack] = await Promise.all([
    supabase
      .from("artists")
      .select("artist_id, artist_name, artist_image_url"),
    fetchAllGenreRows(),
  ]);
  const { artistById, artistImageById, genreById } = buildMaps(
    artistRes,
    genrePack.rows
  );
  const songs = toSongList(
    songRes.data ?? [],
    artistById,
    genreById,
    artistImageById
  );

  return {
    songs,
    songError: null,
    joinNotice: joinWarnings(artistRes, genrePack),
  };
}

export function fetchSongsByArtistId(artistId) {
  return loadSongsFiltered("artist_id", artistId);
}

export function fetchSongsByGenreId(genreId) {
  return loadSongsFiltered("genre_id", genreId);
}

// 0–1 or 0–100 from DB → 0–100 for charts
const METRIC_KEYS = [
  "danceability",
  "energy",
  "speechiness",
  "acousticness",
  "liveness",
  "valence",
];

function toPercentMetric(v) {
  const n = Number(v);
  if (v == null || v === "" || Number.isNaN(n)) return 0;
  if (n >= 0 && n <= 1) return n * 100;
  return Math.min(100, Math.max(0, n));
}

function metricsFromRow(row) {
  const o = {};
  for (const k of METRIC_KEYS) o[k] = toPercentMetric(row[k]);
  return o;
}

function topThreeMetricKeys(metrics) {
  return [...METRIC_KEYS]
    .map((k) => ({ k, v: metrics[k] ?? 0 }))
    .sort((a, b) => b.v - a.v)
    .slice(0, 3)
    .map((x) => x.k);
}

function sumMetrics(metrics, keys) {
  return keys.reduce((s, k) => s + (metrics[k] ?? 0), 0);
}

// Same 3 traits as current song, closest total on other tracks
function findRelatedSongs(currentId, currentMetrics, allRows, artistById, limit) {
  const top3 = topThreeMetricKeys(currentMetrics);
  const target = sumMetrics(currentMetrics, top3);
  const scored = [];
  for (const row of allRows) {
    const sid = row.song_id != null ? String(row.song_id) : "";
    if (!sid || sid === String(currentId)) continue;
    const m = metricsFromRow(row);
    const sum = sumMetrics(m, top3);
    scored.push({ diff: Math.abs(sum - target), row, sid });
  }
  scored.sort((a, b) => a.diff - b.diff);
  return scored.slice(0, limit).map(({ row, sid }) => ({
    id: sid,
    title: (row.title != null ? String(row.title) : "").trim() || "Untitled",
    artistName: artistById.get(idKey(row.artist_id)) ?? "",
  }));
}

function yearFromRow(row) {
  const y =
    row.year != null && row.year !== "" ? Number(row.year) : null;
  return y != null && !Number.isNaN(y) ? y : null;
}

// One song + related list (for SingleSong page)
export async function fetchSongPageData(songId) {
  const id = idKey(songId);
  if (!id) {
    return { error: "Missing song.", song: null, related: [], joinNotice: null };
  }

  const [artistRes, genrePack] = await Promise.all([
    supabase
      .from("artists")
      .select("artist_id, artist_name, artist_image_url"),
    fetchAllGenreRows(),
  ]);
  const { artistById, artistImageById, genreById } = buildMaps(
    artistRes,
    genrePack.rows
  );
  const joinNotice = joinWarnings(artistRes, genrePack);

  let songRes = await supabase
    .from("songs")
    .select(FULL)
    .eq("song_id", id)
    .maybeSingle();
  if (songRes.error) {
    songRes = await supabase
      .from("songs")
      .select(CORE)
      .eq("song_id", id)
      .maybeSingle();
  }

  if (songRes.error) {
    return {
      error: songRes.error.message ?? "Could not load song.",
      song: null,
      related: [],
      joinNotice,
    };
  }
  if (!songRes.data) {
    return { error: "Song not found.", song: null, related: [], joinNotice };
  }

  const row = songRes.data;
  const metrics = metricsFromRow(row);
  const aid = idKey(row.artist_id);
  const gid = idKey(row.genre_id);
  const song = {
    id: String(row.song_id),
    title: (row.title != null ? String(row.title) : "").trim() || "Untitled",
    year: yearFromRow(row),
    artistId: aid,
    artistName: artistById.get(aid) ?? "—",
    artistImageUrl: artistImageById.get(aid) ?? "",
    genreId: gid,
    genreName: genreById.get(gid) ?? "—",
    bpm: row.bpm,
    popularity: row.popularity,
    loudness: row.loudness,
    metrics,
  };

  let related = [];
  let allRes = await supabase.from("songs").select(FULL);
  if (allRes.error) {
    allRes = await supabase.from("songs").select(CORE);
  }
  if (!allRes.error && allRes.data?.length) {
    related = findRelatedSongs(song.id, metrics, allRes.data, artistById, 4);
  }

  return { error: null, song, related, joinNotice };
}
