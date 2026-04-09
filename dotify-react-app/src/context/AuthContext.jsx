//https://www.mintlify.com/supabase/supabase/guides/react
//https://medium.com/@0xJad/manage-authentication-state-in-react-with-authcontext-2d3129eac92b

import { createContext, useState, useContext, useEffect } from "react";
import supabase from "../services/supabase";


const AuthContext = createContext();

export function AuthProvider({ children }) {
    const [user, setUser] = useState(null);
    const [loading, setLoading] = useState(true);

   useEffect(() => {

        const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {

            setUser(session?.user ?? null);
            setLoading(false); // change to complete once subscription is going

        });

        return () => subscription.unsubscribe();

    }, []);

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

export const useAuth = () => useContext(AuthContext);