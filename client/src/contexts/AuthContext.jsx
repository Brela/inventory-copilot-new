import React, { createContext, useState, useEffect } from "react";
import { useQuery } from "react-query";
import { authenticateUser } from "../api/authenticationAPI";

export const AuthContext = createContext({
  isLoggedIn: false,
  userId: null,
  authLoading: true,
});

export const AuthProvider = ({ children }) => {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [userId, setUserId] = useState(null);
  const [user, setUser] = useState(null);
  const [authLoading, setAuthLoading] = useState(true);

  const fetchAuthStatus = async () => {
    try {
      const authenticatedUser = await authenticateUser();
      setIsLoggedIn(true);
      setUserId(authenticatedUser.id);
      setUser(authenticatedUser);
    } catch (error) {
      console.error("Error during authentication:", error.message);
      setIsLoggedIn(false);
    } finally {
      setAuthLoading(false);
    }
  };

  useEffect(() => {
    // console.log(isLoggedIn);
  }, [isLoggedIn]);

  useEffect(() => {
    fetchAuthStatus();
  }, []);

  return (
    <AuthContext.Provider
      value={{
        isLoggedIn,
        setIsLoggedIn,
        userId,
        user,
        setUser,
        authLoading,
        fetchAuthStatus,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};
