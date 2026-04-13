//https://www.robinwieruch.de/react-router-private-routes/

import { useState } from "react";
import { Routes, Route } from "react-router-dom";

import Header from "./components/Header";
import Footer from "./components/Footer";
import UserLogin from "./components/UserLogin";
import ProtectedRoute from "./components/ProtectedRoute";

import Home from "./components/Home";
import Artists from "./components/Artists";
import Genres from "./components/Genres";
import Playlists from "./components/Playlists";
import Songs from "./components/Songs";
import SingleArtist from "./components/SingleArtist";
import SingleGenre from "./components/SingleGenre";
import SingleSong from "./components/SingleSong";
import CurrentPlaylist from "./components/CurrentPlaylist";
import About from "./components/About";

function App() {
  // About screen: opened from footer, not from header
  const [showAbout, setShowAbout] = useState(false);

  return (
    <div className="flex flex-col min-h-screen">
      <Header />

      <main className="flex-1">
        <Routes>
          {/* Login page public route */}
          <Route path="/login" element={<UserLogin />} />

          {/* Protected routes for authorized users */}
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

      <Footer onAboutClick={() => setShowAbout(true)} />
      <About isOpen={showAbout} onClose={() => setShowAbout(false)} />
    </div>
  );

  
}

export default App;