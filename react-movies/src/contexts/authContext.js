import React, { createContext, useContext, useState, useEffect } from 'react';
import { 
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
  signOut,
  onAuthStateChanged 
} from 'firebase/auth';
import { auth } from '../firebase-config';

const AuthContext = createContext(); // Context to provide auth-related data globally

export function useAuth() {
  return useContext(AuthContext); // Custom hook to access auth data
}

export function AuthProvider({ children }) {
  const [currentUser, setCurrentUser] = useState(null); // Holds the current user's details
  const [loading, setLoading] = useState(true); // Ensures components wait for auth state resolution

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      setCurrentUser(user); // Updates the current user on state change
      setLoading(false); // Signals that auth state is resolved
    });

    return unsubscribe; // Cleanup listener on unmount
  }, []);

  const signup = async (email, password) => {
    try {
      const result = await createUserWithEmailAndPassword(auth, email, password);
      setCurrentUser(result.user); // Update current user after signup
      return result;
    } catch (error) {
      console.error("Signup error:", error);
      throw error;
    }
  };

  const login = async (email, password) => {
    try {
      const result = await signInWithEmailAndPassword(auth, email, password);
      setCurrentUser(result.user); // Update current user after login
      return result;
    } catch (error) {
      console.error("Login error:", error);
      throw error;
    }
  };

  const logout = async () => {
    try {
      await signOut(auth);
      setCurrentUser(null); // Clear user data after logout
    } catch (error) {
      console.error("Logout error:", error);
      throw error;
    }
  };

  const value = {
    currentUser,
    signup,
    login,
    logout
  };

  return (
    <AuthContext.Provider value={value}>
      {!loading ? children : <div>Loading...</div>} {/* Render children once auth state resolves */}
    </AuthContext.Provider>
  );
}

export default AuthProvider;
