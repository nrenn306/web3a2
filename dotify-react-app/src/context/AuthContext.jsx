//https://www.mintlify.com/supabase/supabase/guides/react
//https://medium.com/@0xJad/manage-authentication-state-in-react-with-authcontext-2d3129eac92b

/**
 * AuthContext and AuthProvidor which provides global authentication state and actions using supabase
 */
import { createContext, useState, useContext, useEffect } from "react";
import supabase from "../services/supabase";

// authentication context
const AuthContext = createContext();

/**
 * AuthProvider component which wraps the application and provides authentication state and functions to all child components
 * 
 * @param {React.ReactNode} children - components that require access to auth state
 */
export function AuthProvider({ children }) {
    const [user, setUser] = useState(null); // current authenticated user
    const [loading, setLoading] = useState(true); // loading state while checking auth session

    // subscribe to supabase auth state changes
    // updates user whenever login/logout occurs
   useEffect(() => {

        const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {

            setUser(session?.user ?? null);
            setLoading(false); // change to complete once subscription is going

        });

        return () => subscription.unsubscribe(); // cleanup subscription 

    }, []);

    /**
     * logs in a user with email and password
     * 
     * @param {string} email
     * @param {string} password
     * @throws {Error} if authentication fails 
     */
    const login = async (email, password) => {

        const { error } = await supabase.auth.signInWithPassword({ email, password });

        if (error) {
            throw new Error(error.message);
        }
    };

    const logout = () => supabase.auth.signOut(); // no need to manually clear user

    // wraps app with AuthContext... anything inside can use useAuth()
    // ensures that all child components have access to auth data and functions  
    return (
        <AuthContext.Provider value={{ user, login, logout, loading }}>
            {children}
        </AuthContext.Provider>
    );
}
// useAuth hook to access authentication context
export const useAuth = () => useContext(AuthContext);