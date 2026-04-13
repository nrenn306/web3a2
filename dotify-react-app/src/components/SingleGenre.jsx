import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import SongListTable from "./SongListTable";
import { PlaylistToast, usePlaylistToast } from "./PlaylistToast";
import { loadMusicFromSupabase } from "../services/musicData";

function SingleGenre() {
  const { id } = useParams();
  const [songs, setSongs] = useState([]);
  const [genres, setGenres] = useState([]);
  const { toast, addToPlaylist } = usePlaylistToast();

  useEffect(() => {
    loadMusicFromSupabase().then(result => {
      setSongs(result.songs);
      setGenres(result.genreRows);
    });
  }, []);

  const genre = genres.find(g => String(g.genre_id) === id);
  const genreSongs = songs.filter(s => s.genres.includes(genre?.genre_name));

  return (
    <div className="p-8">
      <div className="flex gap-4 mb-12 h-1/3 items-center">
        <img src={genre?.genre_image_url} alt={genre?.genre_name} className="h-full aspect-square object-cover rounded-lg shadow-lg flex-shrink-0" />
        <div>
          <h1 className="text-2xl font-bold mb-2">{genre?.genre_name}</h1>
          <p className="text-sm text-gray-600 mb-2">
            <strong>Songs:</strong> {genreSongs.length}
          </p>
          <p className="text-xs text-gray-700 leading-relaxed">{genre?.genre_description}</p>
        </div>
      </div>
      <h2 className="text-xl mb-6">Songs in <strong>{genre?.genre_name}</strong></h2>
      <SongListTable rows={genreSongs} loadState="ready" onAddToPlaylist={addToPlaylist} />
      <PlaylistToast message={toast} />
    </div>
  );
}

export default SingleGenre;
