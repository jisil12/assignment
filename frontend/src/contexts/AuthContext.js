import React, { createContext, useContext, useReducer, useEffect } from 'react';
import axios from 'axios';

const AuthContext = createContext();

const authReducer = (state, action) => {
  switch (action.type) {
    case 'LOGIN':
      return {
        ...state,
        isAuthenticated: true,
        user: action.payload.user,
        token: action.payload.token,
        loading: false,
        error: null
      };
    case 'LOGOUT':
      return {
        ...state,
        isAuthenticated: false,
        user: null,
        token: null,
        loading: false,
        error: null
      };
    case 'SET_LOADING':
      return {
        ...state,
        loading: action.payload
      };
    case 'SET_ERROR':
      return {
        ...state,
        error: action.payload,
        loading: false
      };
    case 'CLEAR_ERROR':
      return {
        ...state,
        error: null
      };
    default:
      return state;
  }
};

const initialState = {
  isAuthenticated: false,
  user: null,
  token: localStorage.getItem('token'),
  loading: true,
  error: null
};

export const AuthProvider = ({ children }) => {
  const [state, dispatch] = useReducer(authReducer, initialState);

  const setAuthToken = (token) => {
    if (token) {
      axios.defaults.headers.common['Authorization'] = `Bearer ${token}`;
      localStorage.setItem('token', token);
    } else {
      delete axios.defaults.headers.common['Authorization'];
      localStorage.removeItem('token');
    }
  };

  const login = async (email, password, userType) => {
    try {
      dispatch({ type: 'SET_LOADING', payload: true });
      dispatch({ type: 'CLEAR_ERROR' });
      
      const response = await axios.post('/api/auth/login', {
        email,
        password,
        userType
      });

      const { token, user } = response.data;
      setAuthToken(token);
      
      dispatch({
        type: 'LOGIN',
        payload: { token, user }
      });
      
      return { success: true };
    } catch (error) {
      const errorMessage = error.response?.data?.error || 'Login failed';
      dispatch({ type: 'SET_ERROR', payload: errorMessage });
      return { success: false, error: errorMessage };
    }
  };

  const signup = async (userData) => {
    try {
      dispatch({ type: 'SET_LOADING', payload: true });
      dispatch({ type: 'CLEAR_ERROR' });
      
      const response = await axios.post('/api/auth/signup', userData);
      const { token, user } = response.data;
      setAuthToken(token);
      
      dispatch({
        type: 'LOGIN',
        payload: { token, user }
      });
      
      return { success: true };
    } catch (error) {
      const errorMessage = error.response?.data?.error || 'Signup failed';
      dispatch({ type: 'SET_ERROR', payload: errorMessage });
      return { success: false, error: errorMessage };
    }
  };

  const logout = () => {
    setAuthToken(null);
    dispatch({ type: 'LOGOUT' });
  };

  const changePassword = async (currentPassword, newPassword) => {
    try {
      dispatch({ type: 'SET_LOADING', payload: true });
      dispatch({ type: 'CLEAR_ERROR' });
      
      await axios.put('/api/auth/change-password', {
        currentPassword,
        newPassword
      });
      
      dispatch({ type: 'SET_LOADING', payload: false });
      return { success: true };
    } catch (error) {
      const errorMessage = error.response?.data?.error || 'Password change failed';
      dispatch({ type: 'SET_ERROR', payload: errorMessage });
      return { success: false, error: errorMessage };
    }
  };

  useEffect(() => {
    if (state.token) {
      setAuthToken(state.token);
      try {
        const payload = JSON.parse(atob(state.token.split('.')[1]));
        if (payload.exp * 1000 > Date.now()) {
          dispatch({
            type: 'LOGIN',
            payload: {
              token: state.token,
              user: {
                id: payload.id,
                email: payload.email,
                role: payload.role || 'store_owner',
                userType: payload.type
              }
            }
          });
        } else {
          logout();
        }
      } catch (error) {
        logout();
      }
    } else {
      dispatch({ type: 'SET_LOADING', payload: false });
    }
  }, []);

  const value = {
    ...state,
    login,
    signup,
    logout,
    changePassword,
    clearError: () => dispatch({ type: 'CLEAR_ERROR' })
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};