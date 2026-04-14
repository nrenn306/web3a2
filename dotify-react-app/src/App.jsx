/**
 * App.jsx is the main component that sets up the layout and routes for the app
*/

//https://www.robinwieruch.de/react-router-private-routes/

import { useState } from "react";
import { Routes, Route } from "react-router-dom";

// layout components
import Header from "./components/Header";
import Footer from "./components/Footer";
import About from "./components/About";

// auth stuff
// protect routes used to ensure only logged in users can access certain pages
import UserLogin from "./components/UserLogin";
import ProtectedRoute from "./components/ProtectedRoute";

// page components
import Home from "./pages/Home";
import Playlists from "./pages/Playlists";
import Songs from "./pages/Songs";
import SingleArtist from "./pages/SingleArtist";
import SingleGenre from "./pages/SingleGenre";
import SingleSong from "./pages/SingleSong";
import CurrentPlaylist from "./pages/CurrentPlaylist";
import Artists from "./components/Artists";
import Genres from "./components/Genres";

function App() {

  // controls visibility of the About popup 
  const [showAbout, setShowAbout] = useState(false);

  return (
    <div className="flex flex-col min-h-screen">
      <Header />
      <main className="flex-1">

        {/* All our page routes below*/}
        <Routes>
          {/* login for anyone */}
          <Route path="/login" element={<UserLogin />} />

          {/* below are protected routes aka you need to be logged in to see them */}
          
          {/* home page */}
          <Route path="/" element={
              <ProtectedRoute>
                <Home />
              </ProtectedRoute>
              }
          />
          <Route path="/home" element={
              <ProtectedRoute>
                <Home />
              </ProtectedRoute>
              }
          />

          {/* browse artists and view individual artist details */}
          <Route path="/artists" element={
              <ProtectedRoute>
                <Artists />
              </ProtectedRoute>
              }
          />
          <Route path="/artists/:id" element={
              <ProtectedRoute>
                <SingleArtist />
              </ProtectedRoute>
              }
          />

          {/* browse genres and view individual genre details */}
          <Route path="/genres" element={
              <ProtectedRoute>
                <Genres />
              </ProtectedRoute>
              }
          />
          <Route path="/genres/:id" element={
              <ProtectedRoute>
                <SingleGenre />
              </ProtectedRoute>
              }
          />

          {/* view all playlists and the current playlist */}
          <Route path="/playlists" element={
              <ProtectedRoute>
                <Playlists />
              </ProtectedRoute>
              }
          />
          <Route path="/current-playlist" element={
              <ProtectedRoute>
                <CurrentPlaylist />
              </ProtectedRoute>
              }
          />

          {/* browse songs and view individual song details */}
          <Route path="/songs" element={
              <ProtectedRoute>
                <Songs />
              </ProtectedRoute>
              }
          />
          <Route path="/songs/:id" element={
              <ProtectedRoute>
                <SingleSong />
              </ProtectedRoute>
              }
          />
        </Routes>
      </main>

      {/* footer has git link and about button */}
      <Footer onAboutClick={() => setShowAbout(true)} />
      
      {/*about popup shows info about the app and is controlled by state */}
      <About isOpen={showAbout} onClose={() => setShowAbout(false)} />
    </div>
  );
}

export default App;