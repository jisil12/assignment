import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';

const Login = () => {
  const [formData, setFormData] = useState({
    email: '',
    password: '',
    userType: 'user'
  });
  const [localError, setLocalError] = useState('');
  
  const { login, isAuthenticated, user, error, loading, clearError } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    if (isAuthenticated && user) {
      if (user.userType === 'user') {
        if (user.role === 'system_admin') {
          navigate('/admin');
        } else {
          navigate('/dashboard');
        }
      } else {
        navigate('/store');
      }
    }
  }, [isAuthenticated, user, navigate]);

  useEffect(() => {
    if (error) {
      setLocalError(error);
      clearError();
    }
  }, [error, clearError]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLocalError('');
    
    const result = await login(formData.email, formData.password, formData.userType);
    if (!result.success) {
      setLocalError(result.error);
    }
  };

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  return (
    <div style={{ maxWidth: '400px', margin: '2rem auto' }}>
      <h2>Login</h2>
      <form onSubmit={handleSubmit}>
        {localError && <div className="alert alert-error">{localError}</div>}
        
        <div className="form-group">
          <label>Email:</label>
          <input
            type="email"
            name="email"
            value={formData.email}
            onChange={handleChange}
            required
          />
        </div>

        <div className="form-group">
          <label>Password:</label>
          <input
            type="password"
            name="password"
            value={formData.password}
            onChange={handleChange}
            required
          />
        </div>

        <div className="form-group">
          <label>User Type:</label>
          <select name="userType" value={formData.userType} onChange={handleChange}>
            <option value="user">User</option>
            <option value="store">Store Owner</option>
          </select>
        </div>

        <button type="submit" className="btn btn-primary" disabled={loading}>
          {loading ? 'Logging in...' : 'Login'}
        </button>
      </form>
      
      <p style={{ marginTop: '1rem', textAlign: 'center' }}>
        Don't have an account? <Link to="/signup">Sign up</Link>
      </p>
    </div>
  );
};

export default Login;