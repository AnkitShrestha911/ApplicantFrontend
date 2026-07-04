import { createContext, useContext, useEffect, useState } from 'react';
import { apiClient } from '../services/api';

const AuthContext = createContext(null);

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  const loadCurrentUser = async () => {
    try {
      const response = await apiClient.get('/auth/me', {withCredentials: true});
      console.log('Current user:', response.data.data);
      setUser(response.data.data);
    } catch (error) {
      setUser(null);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadCurrentUser();
  }, []);

  const login = async (payload) => {
    const response = await apiClient.post('/auth/login', payload, { withCredentials: true });
    await loadCurrentUser();
    return response;
  };

  const adminLogin = async (payload) => {
    const response = await apiClient.post('/auth/admin/login', payload, { withCredentials: true });
    await loadCurrentUser();
    return response;
  };

  const register = async (payload) => {
    const response = await apiClient.post('/auth/register', payload, { withCredentials: true });
    return response;
  };

  const logout = async () => {
    try {
      await apiClient.post('/auth/logout', {}, { withCredentials: true });
      setUser(null);
    } catch(err) {
      console.log(err);
      setUser(null);
    }
  };

  return (
    <AuthContext.Provider value={{ user, login, logout, register, adminLogin, loading, isAuthenticated: !!user, isAdmin: user?.role === 'admin' }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);
