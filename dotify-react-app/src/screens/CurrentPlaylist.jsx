import { useState } from "react";

function CurrentPlaylist() {
    
  const [count, setCount] = useState(0);


  return (
    <div>
      <h1>Current Playlist</h1>
      <p>{count}</p>
    </div>
  );
}

export default CurrentPlaylist;