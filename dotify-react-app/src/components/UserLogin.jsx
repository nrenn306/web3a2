//https://www.mintlify.com/supabase/supabase/guides/react
//https://www.geeksforgeeks.org/reactjs/what-are-protected-routes-in-react-js/
import { useState } from "react";
import { useAuth } from "../context/AuthContext";
import { useNavigate } from "react-router-dom";
import dotifyLogo from "../assets/dotifyLogo.png";

function UserLogin({ onLoginSuccess }) {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const navigate = useNavigate();


  const { login } = useAuth();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");

    // login process running
    // ensures user cannot spam commands while verifying
    setIsLoading(true);

    // Validate user info
    if (!email || !password) {
      setError("Please enter both email and password");
      setIsLoading(false);
      return;
    }


    try {
      await login(email, password); //login attempt
      onLoginSuccess?.(); // if it works, call success 
      navigate("/home", { replace: true}); //changes view to home
    } catch (err) {
      setError(err.message); // if it fails, show error
    } finally {
      setIsLoading(false); // finished log in process, give user control
    }

  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100">
      <form onSubmit={handleSubmit} className="w-full max-w-sm p-6 bg-white rounded shadow space-y-4">

        <img src={dotifyLogo} alt="Dotify Logo" className="mx-auto h-30 w-30" />

        {error && (
          <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded">
            {error}
          </div>
        )}

        <div>
          <label className="block"><strong>Email</strong></label>
          <input type="email" placeholder="Enter your email" value={email} onChange={(e) => setEmail(e.target.value)} disabled={isLoading} className="w-full p-2 border rounded focus:outline-none focus:border-blue-500 disabled:bg-gray-100" />
        </div>

        <div>
          <label className="block"><strong>Password</strong></label>
          <input type="password" placeholder="Enter your password" value={password} onChange={(e) => setPassword(e.target.value)} disabled={isLoading} className="w-full p-2 border rounded focus:outline-none focus:border-blue-500 disabled:bg-gray-100" />
        </div>

        <button type="submit" disabled={isLoading} className="w-full bg-[var(--accent)] text-[var(--black)] px-4 py-2 rounded cursor-pointer font-bold hover:text-white transition-colors disabled:opacity-50 disabled:cursor-not-allowed">
          {isLoading ? "Logging in..." : "Login"}
        </button>
      </form>
    </div>
  );
}

export default UserLogin;