//https://coreui.io/answers/how-to-protect-routes-in-react-router/

/**
 * ProtectedRoute component to restrict acess to routes that require authentication
 * 
 * props:
 * @param {React.ReactNode} children - protected route content to render if the user is authenticated
 */
import { Navigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

function ProtectedRoute({ children }) {
    const { user, loading } = useAuth(); // authentication state from context

    // show loading state 
    if (loading) {
        return <div className="flex items-center justify-center min-h-screen">Loading...</div>;
    }

    // redirect unauthenticated users 
    if (!user) {
        return <Navigate to="/login" replace />;
    }

    return children; // render protected content for authenticated users
}

export default ProtectedRoute;