import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import SongListTable from "../components/SongListTable";
import { PlaylistToast, usePlaylistToast } from "../components/PlaylistToast";
import { loadMusicFromSupabase } from "../services/musicData";

function SingleArtist() {
  const { id } = useParams();
  const [songs, setSongs] = useState([]);
  const [artists, setArtists] = useState([]);
  const { toast, addToPlaylist } = usePlaylistToast();

  useEffect(() => {
    loadMusicFromSupabase().then(result => {
      setSongs(result.songs);
      setArtists(result.catalogArtists);
    });
  }, []);

  const artist = artists.find(a => String(a.id) === id);
  const artistSongs = songs.filter(s => String(s.artistId) === id);

  return (
    <div className="p-8">
      <h1>{artist?.name}</h1>
      <SongListTable rows={artistSongs} loadState="ready" onAddToPlaylist={addToPlaylist} />
      <PlaylistToast message={toast} />
    </div>
  );
}

export default SingleArtist;
