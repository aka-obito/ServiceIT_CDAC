import React, { createContext, useContext, useState, useEffect, useCallback } from 'react';
import { TOKEN_KEY, USER_KEY } from '../utils/constants';

const AuthContext = createContext(null);

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(() => {
    try {
      const stored = localStorage.getItem(USER_KEY);
      return stored ? JSON.parse(stored) : null;
    } catch {
      return null;
    }
  });
  const [token, setToken] = useState(() => localStorage.getItem(TOKEN_KEY));
  const [loading, setLoading] = useState(false);

  const isAuthenticated = Boolean(token && user);

  /**
   * Called after successful login.
   * Stores token + user info from LoginResponseDTO.
   * { token, tokenType, userId, fullName, email, role }
   */
  const loginUser = useCallback((loginResponse) => {
    const { token: newToken, userId, fullName, email, role } = loginResponse;
    const userData = { userId, fullName, email, role };
    localStorage.setItem(TOKEN_KEY, newToken);
    localStorage.setItem(USER_KEY, JSON.stringify(userData));
    setToken(newToken);
    setUser(userData);
  }, []);

  /**
   * Clear auth state and redirect to login.
   */
  const logoutUser = useCallback(() => {
    localStorage.removeItem(TOKEN_KEY);
    localStorage.removeItem(USER_KEY);
    setToken(null);
    setUser(null);
  }, []);

  /**
   * Check if the current user has the given role.
   */
  const hasRole = useCallback(
    (role) => user?.role === role,
    [user]
  );

  const value = {
    user,
    token,
    loading,
    setLoading,
    isAuthenticated,
    loginUser,
    logoutUser,
    hasRole,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};

export const useAuth = () => {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error('useAuth must be used within AuthProvider');
  return ctx;
};

export default AuthContext;
