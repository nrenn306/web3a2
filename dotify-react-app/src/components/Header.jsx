// https://www.youtube.com/watch?v=2-6K-TMA-nw
// hook to check for authentication.. if authenticated show content

import { Link } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import dotifyLogo from "../assets/dotifyLogo.png";

function Header ( {count} ) {
    const { user, logout } = useAuth();

    // if use clicks logout
    const handleLogout = () => {
        logout();
    };

    return (
        <header className="w-full bg-white text-[var(--dark)] px-6 py-4 sticky top-0 z-[1000] shadow">
            <div className="flex justify-between items-center gap-8">
                <Link to="/home" className="flex items-center gap-2 no-underline text-inherit flex-shrink-0">
                    <img src={dotifyLogo} alt="Dotify Logo" className="h-12 w-12 sm:h-16 sm:w-16 md:h-20 md:w-20" />
                </Link>
                
                <nav className="flex gap-6 flex-1 justify-center">
                    {user ? (
                        <>
                            <Link to="/home" className="text-inherit whitespace-nowrap hover:text-[var(--red)] transition-colors">Home</Link>
                            <Link to="/artists" className="text-inherit whitespace-nowrap hover:text-[var(--red)] transition-colors">Artists</Link>
                            <Link to="/genres" className="text-inherit whitespace-nowrap hover:text-[var(--red)] transition-colors">Genres</Link>
                            <Link to="/playlists" className="text-inherit whitespace-nowrap hover:text-[var(--red)] transition-colors">Playlists</Link>
                            <Link to="/songs" className="text-inherit whitespace-nowrap hover:text-[var(--red)] transition-colors">Songs</Link>
                            <Link to="/current-playlist" className="flex items-center gap-2 whitespace-nowrap text-inherit hover:text-[var(--red)] transition-colors">
                                Current Playlist
                                <span className="bg-red-500 text-white text-xs px-2 py-0.5 rounded-full" count={count}>
                                    {count}
                                </span>
                            </Link>
                        </>
                    ) : (
                        <>
                            <span className="text-inherit whitespace-nowrap cursor-not-allowed">Home</span>
                            <span className="text-inherit whitespace-nowrap cursor-not-allowed">Artists</span>
                            <span className="text-inherit whitespace-nowrap cursor-not-allowed">Genres</span>
                            <span className="text-inherit whitespace-nowrap cursor-not-allowed">Playlists</span>
                            <span className="text-inherit whitespace-nowrap cursor-not-allowed">Songs</span>
                        </>
                    )}
                </nav>

                <div className="flex flex-col items-end gap-2 whitespace-nowrap">
                    
                    {user && 
                        <span className="text-sm">{user?.email}</span>
                    }

                    {user && 
                        <button onClick={handleLogout} className="bg-[var(--accent)] text-[var(--black)] px-4 py-2 rounded cursor-pointer font-bold hover:text-white transition-colors">
                            Logout
                        </button>
                    }

                </div>
            </div>
        </header>
    )
}

export default Header;

