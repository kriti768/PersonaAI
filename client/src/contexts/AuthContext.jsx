import { createContext, useContext, useEffect, useState } from 'react';
import { api } from '../lib/api';

const AuthContext = createContext(null);

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const token = localStorage.getItem('personaai-token');
    if (!token) {
      setLoading(false);
      return;
    }

    api.me()
      .then((result) => setUser(result.user))
      .catch(() => {
        localStorage.removeItem('personaai-token');
      })
      .finally(() => setLoading(false));
  }, []);

  const persistSession = ({ token, user: nextUser }) => {
    localStorage.setItem('personaai-token', token);
    setUser(nextUser);
  };

  const login = async (payload) => {
    const result = await api.login(payload);
    persistSession(result);
  };

  const signup = async (payload) => {
    const result = await api.signup(payload);
    persistSession(result);
  };

  const logout = () => {
    localStorage.removeItem('personaai-token');
    setUser(null);
  };

  const refreshUser = async () => {
    const result = await api.me();
    setUser(result.user);
    return result.user;
  };

  return <AuthContext.Provider value={{ user, setUser, loading, login, signup, logout, refreshUser }}>{children}</AuthContext.Provider>;
}

export function useAuth() {
  return useContext(AuthContext);
}
