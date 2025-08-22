import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import { validateName, validateEmail, validatePassword, validateAddress } from '../utils/validation';

const Signup = () => {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: '',
    address: ''
  });
  const [validationErrors, setValidationErrors] = useState({});
  const [localError, setLocalError] = useState('');
  
  const { signup, isAuthenticated, error, loading, clearError } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    if (isAuthenticated) {
      navigate('/dashboard');
    }
  }, [isAuthenticated, navigate]);

  useEffect(() => {
    if (error) {
      setLocalError(error);
      clearError();
    }
  }, [error, clearError]);

  const validateForm = () => {
    const errors = {};
    
    const nameError = validateName(formData.name);
    if (nameError) errors.name = nameError;
    
    const emailError = validateEmail(formData.email);
    if (emailError) errors.email = emailError;
    
    const passwordError = validatePassword(formData.password);
    if (passwordError) errors.password = passwordError;
    
    const addressError = validateAddress(formData.address);
    if (addressError) errors.address = addressError;
    
    setValidationErrors(errors);
    return Object.keys(errors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLocalError('');
    
    if (!validateForm()) {
      return;
    }
    
    const result = await signup(formData);
    if (!result.success) {
      setLocalError(result.error);
    }
  };

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
    
    if (validationErrors[e.target.name]) {
      setValidationErrors({
        ...validationErrors,
        [e.target.name]: null
      });
    }
  };

  return (
    <div style={{ maxWidth: '400px', margin: '2rem auto' }}>
      <h2>Sign Up</h2>
      <form onSubmit={handleSubmit}>
        {localError && <div className="alert alert-error">{localError}</div>}
        
        <div className="form-group">
          <label>Name (20-60 characters):</label>
          <input
            type="text"
            name="name"
            value={formData.name}
            onChange={handleChange}
            required
          />
          {validationErrors.name && <div className="alert alert-error">{validationErrors.name}</div>}
        </div>

        <div className="form-group">
          <label>Email:</label>
          <input
            type="email"
            name="email"
            value={formData.email}
            onChange={handleChange}
            required
          />
          {validationErrors.email && <div className="alert alert-error">{validationErrors.email}</div>}
        </div>

        <div className="form-group">
          <label>Password (8-16 chars, 1 uppercase, 1 special char):</label>
          <input
            type="password"
            name="password"
            value={formData.password}
            onChange={handleChange}
            required
          />
          {validationErrors.password && <div className="alert alert-error">{validationErrors.password}</div>}
        </div>

        <div className="form-group">
          <label>Address (max 400 characters):</label>
          <textarea
            name="address"
            value={formData.address}
            onChange={handleChange}
            rows="3"
            required
          />
          {validationErrors.address && <div className="alert alert-error">{validationErrors.address}</div>}
        </div>

        <button type="submit" className="btn btn-primary" disabled={loading}>
          {loading ? 'Signing up...' : 'Sign Up'}
        </button>
      </form>
      
      <p style={{ marginTop: '1rem', textAlign: 'center' }}>
        Already have an account? <Link to="/login">Login</Link>
      </p>
    </div>
  );
};

export default Signup;