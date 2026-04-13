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
    <div>
      <div>
        <img src={artist?.artist_image_url} alt={artist?.artist_name} />
        <div>
          <h1>{artist?.artist_name}</h1>
          <p>{artist?.types?.type_name}</p>
          <p>{artist?.spotify_desc}</p>
        </div>
      </div>
      <SongListTable rows={artistSongs} loadState="ready" onAddToPlaylist={addToPlaylist} />
      <PlaylistToast message={toast} />
    </div>
  );
}

export default SingleArtist;
