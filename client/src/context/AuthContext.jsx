    import React, { createContext, useState, useEffect } from 'react';
    import axios from 'axios';

    const AuthContext = createContext();

    const AuthProvider = ({ children }) => {
      const [user, setUser] = useState(null);
      const [token, setToken] = useState(localStorage.getItem('token'));
      const [loading, setLoading] = useState(true);

      useEffect(() => {
        // This effect runs when the app loads to check if a user is already logged in
        const verifyUser = async () => {
          if (token) {
            try {
              // Set the token in axios headers for all subsequent requests
              axios.defaults.headers.common['Authorization'] = `Bearer ${token}`;
              
              // We need an endpoint to verify the token and get user data
              // Let's assume we will create a GET /api/auth/me endpoint
              const res = await axios.get('/api/auth/me');
              setUser(res.data);
            } catch (err) {
              console.error('Token verification failed', err);
              logout(); // If token is invalid, log the user out
            }
          }
          setLoading(false);
        };
        verifyUser();
      }, [token]);

      const login = async (email, password) => {
        const res = await axios.post('/api/auth/login', { email, password });
        localStorage.setItem('token', res.data.token);
        setToken(res.data.token);
        setUser(res.data.user);
        axios.defaults.headers.common['Authorization'] = `Bearer ${res.data.token}`;
      };
      
      const register = async (name, email, password, role) => {
        await axios.post('/api/auth/register', { name, email, password, role });
      };

      const logout = () => {
        localStorage.removeItem('token');
        setToken(null);
        setUser(null);
        delete axios.defaults.headers.common['Authorization'];
      };

      return (
        <AuthContext.Provider value={{ user, token, loading, login, register, logout }}>
          {children}
        </AuthContext.Provider>
      );
    };

    export { AuthContext, AuthProvider };
    
