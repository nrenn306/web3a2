//https://www.robinwieruch.de/react-router-private-routes/

import { useState } from "react";
import { Routes, Route } from "react-router-dom";

import Header from "./components/Header";
import Footer from "./components/Footer";
import UserLogin from "./components/UserLogin";
import ProtectedRoute from "./components/ProtectedRoute";

import Home from "./screens/Home";
import Artists from "./screens/Artists";
import Genres from "./screens/Genres";
import Playlists from "./screens/Playlists";
import Songs from "./screens/Songs";
import SingleArtist from "./screens/SingleArtist";
import SingleGenre from "./screens/SingleGenre";
import SingleSong from "./screens/SingleSong";
import CurrentPlaylist from "./screens/CurrentPlaylist";
import About from "./screens/About";

function AppContent() {
  const [showAbout, setShowAbout] = useState(false);
  const [count, setCount] = useState(0);

  return (
    <div className="flex flex-col min-h-screen">
      <Header count={count} />

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
                {/*will eventually be used for playlist count*/}
                <CurrentPlaylist count={count} setCount={setCount} />
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

export default AppContent;