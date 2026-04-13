import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import SongListTable from "../components/SongListTable";
import { PlaylistToast, usePlaylistToast } from "../components/PlaylistToast";
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
      <div> 
        <h1>{genre?.genre_name}</h1>
        
      </div>
      <SongListTable rows={genreSongs} loadState="ready" onAddToPlaylist={addToPlaylist} />
      <PlaylistToast message={toast} />
    </div>
  );
}

export default SingleGenre;
