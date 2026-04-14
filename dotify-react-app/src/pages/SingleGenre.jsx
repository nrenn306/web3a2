import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import SongListTable from "../components/SongListTable";
import { PlaylistToast, usePlaylistToast } from "../components/PlaylistToast";
import { loadMusicFromSupabase } from "../services/musicData";

/**
 * SingleGenre page to display genre details 
 */
function SingleGenre() {
  const { id } = useParams();
  const [songs, setSongs] = useState([]); // full song list 
  const [genres, setGenres] = useState([]); // all genre metadata from supabase
  const { toast, addToPlaylist } = usePlaylistToast(); // playlist toast system


  useEffect(() => {
    loadMusicFromSupabase().then(result => { // load songs and genre metadata from backend
      setSongs(result.songs);
      setGenres(result.genreRows);
    });
    
  }, []);

  const genre = genres.find(g => String(g.genre_id) === id); // finds selected genre based on route param ID
  const genreSongs = songs.filter(s => s.genres.includes(genre?.genre_name)); // filter songs that belong to this genre

  return (
    <div className="p-8">

      {/* genre header */}
      <div className="flex gap-4 mb-12 h-1/3 items-center">

        {/* genre image */}
        <img src={genre?.genre_image_url} alt={genre?.genre_name} className="h-full aspect-square object-cover rounded-lg shadow-lg flex-shrink-0" />

        {/* genre info */}
        <div>
          <h1 className="text-2xl font-bold mb-2">{genre?.genre_name}</h1>
          <p className="text-sm text-gray-600 mb-2"><strong>Songs:</strong> {genreSongs.length}</p>
          <p className="text-xs text-gray-700 leading-relaxed">{genre?.genre_description}</p>
        </div>

      </div>

      {/* songs section */}
      <h2 className="text-xl mb-6">Songs in <strong>{genre?.genre_name}</strong></h2>
      
      {/* song table */}
      <SongListTable rows={genreSongs} loadState="ready" onAddToPlaylist={addToPlaylist} />
      
      {/* toast for playlist actions */}
      <PlaylistToast message={toast} />
    </div>
  );
}

export default SingleGenre;
