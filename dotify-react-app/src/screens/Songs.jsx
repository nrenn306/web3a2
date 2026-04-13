import { useEffect, useMemo, useState } from "react";

import SongFilterChips from "../components/SongFilterChips";
import SongListTable from "../components/SongListTable";
import SongsBrowseHeader from "../components/SongsBrowseHeader";
import SongsFiltersSidebar from "../components/SongsFiltersSidebar";
import { PlaylistToast, usePlaylistToast } from "../components/PlaylistToast";
import { loadMusicFromSupabase } from "../services/musicData";

function Songs() {
  // From Supabase
  const [songs, setSongs] = useState([]);
  const [loadState, setLoadState] = useState("loading");
  const [loadError, setLoadError] = useState(null);
  const [loadNotice, setLoadNotice] = useState(null);
  const [catalogArtists, setCatalogArtists] = useState([]);
  const [catalogGenres, setCatalogGenres] = useState([]);

  // Sidebar + chips state
  const [titleQuery, setTitleQuery] = useState("");
  const [selectedYears, setSelectedYears] = useState(() => new Set());
  const [selectedArtistNames, setSelectedArtistNames] = useState(
    () => new Set()
  );
  const [selectedGenres, setSelectedGenres] = useState(() => new Set());
  const [sortBy, setSortBy] = useState("title");
  // + column: save to target playlist + queue
  const { toast, addToPlaylist } = usePlaylistToast();

  // Flip one value in a Set used for filters
  function toggleSet(setState, value) {
    setState((prev) => {
      const next = new Set(prev);
      if (next.has(value)) next.delete(value);
      else next.add(value);
      return next;
    });
  }

  // Fetch songs, artists, genres once
  useEffect(() => {
    let cancelled = false;
    (async () => {
      setLoadState("loading");
      setLoadError(null);
      setLoadNotice(null);

      const result = await loadMusicFromSupabase();
      if (cancelled) return;

      setCatalogArtists(result.catalogArtists);
      setCatalogGenres(result.catalogGenres);

      if (result.songError) {
        setSongs([]);
        setLoadError(result.songError);
        setLoadState("error");
        setLoadNotice(null);
        return;
      }

      setSongs(result.songs);
      setLoadState("ready");
      setLoadError(null);
      setLoadNotice(result.joinNotice);
    })();
    return () => {
      cancelled = true;
    };
  }, []);

  // Filter sidebar option lists
  const years = useMemo(
    () =>
      [
        ...new Set(
          songs.map((s) => s.year).filter((y) => y != null && !Number.isNaN(y))
        ),
      ].sort((a, b) => a - b),
    [songs]
  );

  const artistFilterNames = useMemo(() => {
    const names = new Set();
    for (const a of catalogArtists) names.add(a.name);
    for (const s of songs) {
      const n = (s.artistName ?? "").trim();
      if (n) names.add(n);
    }
    return [...names].sort((a, b) => a.localeCompare(b));
  }, [catalogArtists, songs]);

  const genreFilterOptions = useMemo(() => {
    const g = new Set(catalogGenres);
    songs.forEach((s) => s.genres.forEach((x) => g.add(x)));
    return [...g].sort((a, b) => a.localeCompare(b));
  }, [catalogGenres, songs]);

  const artistNameById = useMemo(
    () => new Map(catalogArtists.map((a) => [String(a.id), a.name])),
    [catalogArtists]
  );

  // Apply sidebar filters + sort
  const filteredSorted = useMemo(() => {
    const q = titleQuery.trim().toLowerCase();
    let list = songs.filter((song) => {
      if (q && !song.title.toLowerCase().includes(q)) return false;
      if (
        selectedYears.size > 0 &&
        (song.year == null || !selectedYears.has(song.year))
      )
        return false;
      if (selectedArtistNames.size > 0) {
        const an = (song.artistName ?? "").trim();
        if (!selectedArtistNames.has(an)) return false;
      }
      if (selectedGenres.size > 0) {
        const onSong = new Set(song.genres.map((x) => x.trim()));
        for (const g of selectedGenres) {
          if (!onSong.has(g.trim())) return false;
        }
      }
      return true;
    });

    list = [...list].sort((a, b) => {
      if (sortBy === "year") {
        const ay = a.year ?? Number.POSITIVE_INFINITY;
        const by = b.year ?? Number.POSITIVE_INFINITY;
        return ay - by || a.title.localeCompare(b.title);
      }
      if (sortBy === "artist")
        return (
          a.artistName.localeCompare(b.artistName) ||
          a.title.localeCompare(b.title)
        );
      return a.title.localeCompare(b.title);
    });

    return list;
  }, [
    songs,
    titleQuery,
    selectedYears,
    selectedArtistNames,
    selectedGenres,
    sortBy,
  ]);

  // Active filters shown as removable chips
  const chips = [];
  if (titleQuery.trim()) {
    chips.push({
      key: "title",
      label: titleQuery.trim(),
      remove: () => setTitleQuery(""),
    });
  }
  selectedYears.forEach((y) => {
    chips.push({
      key: `year-${y}`,
      label: String(y),
      remove: () => toggleSet(setSelectedYears, y),
    });
  });
  selectedArtistNames.forEach((name) => {
    chips.push({
      key: `artist-${name}`,
      label: name,
      remove: () => toggleSet(setSelectedArtistNames, name),
    });
  });
  selectedGenres.forEach((g) => {
    chips.push({
      key: `genre-${g}`,
      label: g,
      remove: () => toggleSet(setSelectedGenres, g),
    });
  });

  function clearAllFilters() {
    setTitleQuery("");
    setSelectedYears(new Set());
    setSelectedArtistNames(new Set());
    setSelectedGenres(new Set());
  }

  const hasActiveFilters =
    Boolean(titleQuery.trim()) ||
    selectedYears.size > 0 ||
    selectedArtistNames.size > 0 ||
    selectedGenres.size > 0;

  // Filters left, results + table right
  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 py-10 sm:py-12">
      <div className="flex min-h-[28rem] flex-col overflow-hidden rounded-lg border border-gray-200 bg-white lg:flex-row">
        <SongsFiltersSidebar
          songs={songs}
          titleQuery={titleQuery}
          onTitleQueryChange={setTitleQuery}
          years={years}
          selectedYears={selectedYears}
          onToggleYear={(y) => toggleSet(setSelectedYears, y)}
          artistFilterNames={artistFilterNames}
          selectedArtistNames={selectedArtistNames}
          onToggleArtistName={(name) =>
            toggleSet(setSelectedArtistNames, name)
          }
          genreFilterOptions={genreFilterOptions}
          selectedGenres={selectedGenres}
          onToggleGenre={(g) => toggleSet(setSelectedGenres, g)}
        />

        <section className="min-w-0 flex-1 bg-gray-50 p-6">
          <SongsBrowseHeader
            loadNotice={loadNotice}
            sortBy={sortBy}
            onSortChange={setSortBy}
          />

          <SongFilterChips
            chips={chips}
            hasActiveFilters={hasActiveFilters}
            onClearAll={clearAllFilters}
          />

          <SongListTable
            rows={filteredSorted}
            loadState={loadState}
            loadError={loadError}
            showCatalogEmpty={
              loadState === "ready" && songs.length === 0
            }
            showFilterEmpty={
              loadState === "ready" &&
              songs.length > 0 &&
              filteredSorted.length === 0
            }
            onClearFilters={clearAllFilters}
            artistNameById={artistNameById}
            onAddToPlaylist={addToPlaylist}
          />
        </section>
      </div>

      <PlaylistToast message={toast} />
    </div>
  );
}

export default Songs;
