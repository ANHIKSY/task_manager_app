/* eslint-disable react-refresh/only-export-components */
import { createContext, useContext, useState, useEffect } from 'react';
import api from '../api/axios';

const AuthContext = createContext();

export const useAuth = () => useContext(AuthContext);

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [token, setToken] = useState(localStorage.getItem('access_token'));
  // Only loading if there's a token to verify
  const [loading, setLoading] = useState(Boolean(localStorage.getItem('access_token')));

  useEffect(() => {
    if (!token) return;

    api.get('/me')
      .then((res) => setUser(res.data))
      .catch(() => {
        localStorage.removeItem('access_token');
        setToken(null);
        setUser(null);
      })
      .finally(() => setLoading(false));
  }, [token]);

  const login = async (email, password) => {
    const res = await api.post('/login', { email, password });
    const { access_token } = res.data;
    localStorage.setItem('access_token', access_token);
    setToken(access_token);
    const userRes = await api.get('/me', {
      headers: { Authorization: `Bearer ${access_token}` },
    });
    setUser(userRes.data);
    setLoading(false);
  };

  const signup = async (email, password) => {
    await api.post('/signup', { email, password });
    await login(email, password);
  };

  const logout = () => {
    localStorage.removeItem('access_token');
    setToken(null);
    setUser(null);
  };

  return (
    <AuthContext.Provider value={{ user, token, loading, login, signup, logout }}>
      {children}
    </AuthContext.Provider>
  );
}