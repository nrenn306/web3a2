//https://www.robinwieruch.de/react-router-private-routes/

import { useState } from "react";
import { Routes, Route } from "react-router-dom";

import Header from "./components/Header";
import Footer from "./components/Footer";
import UserLogin from "./components/UserLogin";
import ProtectedRoute from "./components/ProtectedRoute";

import Artists from "./components/Artists";
import Genres from "./components/Genres";
import About from "./components/About";
import Home from "./pages/Home";
import Playlists from "./pages/Playlists";
import Songs from "./pages/Songs";
import SingleArtist from "./pages/SingleArtist";
import SingleGenre from "./pages/SingleGenre";
import SingleSong from "./pages/SingleSong";
import CurrentPlaylist from "./pages/CurrentPlaylist";

function App() {
  // About modal from footer
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