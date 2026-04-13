import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import SongListTable from "../components/SongListTable";
import { PlaylistToast, usePlaylistToast } from "../components/PlaylistToast";
import { loadMusicFromSupabase, fetchArtistById } from "../services/musicData";

function SingleArtist() {
  const { id } = useParams();
  const [songs, setSongs] = useState([]);
  const [artist, setArtist] = useState(null);
  const { toast, addToPlaylist } = usePlaylistToast();

  useEffect(() => {
    loadMusicFromSupabase().then(result => setSongs(result.songs));
    fetchArtistById(id).then(result => {
      if (result.artist) setArtist(result.artist);
    });
  }, [id]);

  const artistSongs = songs.filter(s => String(s.artistId) === id);

  return (
    <div className="p-8">
      <div className="flex gap-4 mb-12 h-1/3 items-center">
        <img src={artist?.artist_image_url} alt={artist?.artist_name} className="h-full aspect-square object-cover rounded-lg shadow-lg flex-shrink-0" />
        <div>
          <h1 className="text-2xl font-bold mb-2">{artist?.artist_name}</h1>
          <p className="text-sm text-gray-600 mb-2">
            <strong>Type:</strong> {artist?.types?.type_name}
          </p>
          <p className="text-xs text-gray-700 leading-relaxed">{artist?.spotify_desc}</p>
        </div>
      </div>
      <h2 className="text-xl mb-6">Songs from <strong>{artist?.artist_name}</strong></h2>
      <SongListTable rows={artistSongs} loadState="ready" onAddToPlaylist={addToPlaylist} />
      <PlaylistToast message={toast} />
    </div>
  );
}

export default SingleArtist;
