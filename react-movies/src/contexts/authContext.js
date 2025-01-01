import React, { useState, createContext, useContext, useEffect } from "react";
import { login as apiLogin, signup as apiSignup } from '../api/tmdb-api';

export const AuthContext = createContext(null);

export const AuthProvider = ({ children }) => {
    const [isAuthenticated, setIsAuthenticated] = useState(false);
    const [currentUser, setCurrentUser] = useState(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        // Check for existing token on mount
        const token = localStorage.getItem('token');
        const user = localStorage.getItem('user');
        if (token && user) {
            setCurrentUser(JSON.parse(user));
            setIsAuthenticated(true);
        }
        setLoading(false);
    }, []);

    const login = async (username, password) => {
        try {
            const response = await apiLogin(username, password);
            setCurrentUser({ username: username }); // Update based on your user object structure
            setIsAuthenticated(true);
            localStorage.setItem('token', response.token);
            localStorage.setItem('user', JSON.stringify({ username: username }));
            return response;
        } catch (error) {
            throw error;
        }
    };

    const signup = async (username, password) => {
        try {
            await apiSignup(username, password);
            // After successful signup, log the user in
            return login(username, password);
        } catch (error) {
            throw error;
        }
    };

    const logout = () => {
        setIsAuthenticated(false);
        setCurrentUser(null);
        localStorage.removeItem('token');
        localStorage.removeItem('user');
    };

    const value = {
        isAuthenticated,
        currentUser,
        login,
        logout,
        signup,
        loading
    };

    return (
        <AuthContext.Provider value={value}>
            {!loading ? children : <div>Loading...</div>}
        </AuthContext.Provider>
    );
};

export const useAuth = () => {
    return useContext(AuthContext);
};

export default AuthProvider;