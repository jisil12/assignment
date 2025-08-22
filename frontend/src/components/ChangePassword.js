import React, { useState } from 'react';
import { useAuth } from '../contexts/AuthContext';
import { validatePassword } from '../utils/validation';

const ChangePassword = () => {
  const [passwords, setPasswords] = useState({
    currentPassword: '',
    newPassword: '',
    confirmPassword: ''
  });
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [validationErrors, setValidationErrors] = useState({});
  
  const { changePassword, loading } = useAuth();

  const handleChange = (e) => {
    const { name, value } = e.target;
    setPasswords(prev => ({ ...prev, [name]: value }));
    
    if (validationErrors[name]) {
      setValidationErrors(prev => ({ ...prev, [name]: null }));
    }
    
    setError('');
    setSuccess('');
  };

  const validateForm = () => {
    const errors = {};
    
    if (!passwords.currentPassword) {
      errors.currentPassword = 'Current password is required';
    }
    
    const passwordError = validatePassword(passwords.newPassword);
    if (passwordError) {
      errors.newPassword = passwordError;
    }
    
    if (passwords.newPassword !== passwords.confirmPassword) {
      errors.confirmPassword = 'Passwords do not match';
    }
    
    if (passwords.currentPassword === passwords.newPassword) {
      errors.newPassword = 'New password must be different from current password';
    }
    
    setValidationErrors(errors);
    return Object.keys(errors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setSuccess('');
    
    if (!validateForm()) {
      return;
    }
    
    const result = await changePassword(passwords.currentPassword, passwords.newPassword);
    
    if (result.success) {
      setSuccess('Password changed successfully!');
      setPasswords({
        currentPassword: '',
        newPassword: '',
        confirmPassword: ''
      });
      setValidationErrors({});
    } else {
      setError(result.error);
    }
  };

  return (
    <div style={{ maxWidth: '400px' }}>
      <h2>Change Password</h2>
      
      <form onSubmit={handleSubmit}>
        {error && <div className="alert alert-error">{error}</div>}
        {success && <div className="alert alert-success">{success}</div>}
        
        <div className="form-group">
          <label>Current Password:</label>
          <input
            type="password"
            name="currentPassword"
            value={passwords.currentPassword}
            onChange={handleChange}
            required
          />
          {validationErrors.currentPassword && (
            <div className="alert alert-error">{validationErrors.currentPassword}</div>
          )}
        </div>

        <div className="form-group">
          <label>New Password:</label>
          <input
            type="password"
            name="newPassword"
            value={passwords.newPassword}
            onChange={handleChange}
            required
          />
          {validationErrors.newPassword && (
            <div className="alert alert-error">{validationErrors.newPassword}</div>
          )}
        </div>

        <div className="form-group">
          <label>Confirm New Password:</label>
          <input
            type="password"
            name="confirmPassword"
            value={passwords.confirmPassword}
            onChange={handleChange}
            required
          />
          {validationErrors.confirmPassword && (
            <div className="alert alert-error">{validationErrors.confirmPassword}</div>
          )}
        </div>

        <button type="submit" className="btn btn-primary" disabled={loading}>
          {loading ? 'Changing Password...' : 'Change Password'}
        </button>
      </form>
    </div>
  );
};

export default ChangePassword;