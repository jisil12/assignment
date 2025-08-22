import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { validateName, validateEmail, validatePassword, validateAddress } from '../utils/validation';

const UserManagement = () => {
  const [users, setUsers] = useState([]);
  const [showAddForm, setShowAddForm] = useState(false);
  const [search, setSearch] = useState('');
  const [sortBy, setSortBy] = useState('name');
  const [sortOrder, setSortOrder] = useState('ASC');
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const [newUser, setNewUser] = useState({
    name: '',
    email: '',
    password: '',
    address: '',
    role: 'normal_user'
  });
  const [validationErrors, setValidationErrors] = useState({});

  useEffect(() => {
    fetchUsers();
  }, [search, sortBy, sortOrder, currentPage]);

  const fetchUsers = async () => {
    try {
      setLoading(true);
      const response = await axios.get('/api/admin/users', {
        params: { search, sortBy, sortOrder, page: currentPage, limit: 10 }
      });
      setUsers(response.data.users);
      setTotalPages(response.data.totalPages);
      setError('');
    } catch (error) {
      setError('Failed to fetch users');
    } finally {
      setLoading(false);
    }
  };

  const handleSort = (field) => {
    if (sortBy === field) {
      setSortOrder(sortOrder === 'ASC' ? 'DESC' : 'ASC');
    } else {
      setSortBy(field);
      setSortOrder('ASC');
    }
    setCurrentPage(1);
  };

  const validateUserForm = () => {
    const errors = {};
    
    const nameError = validateName(newUser.name);
    if (nameError) errors.name = nameError;
    
    const emailError = validateEmail(newUser.email);
    if (emailError) errors.email = emailError;
    
    const passwordError = validatePassword(newUser.password);
    if (passwordError) errors.password = passwordError;
    
    const addressError = validateAddress(newUser.address);
    if (addressError) errors.address = addressError;
    
    setValidationErrors(errors);
    return Object.keys(errors).length === 0;
  };

  const handleAddUser = async (e) => {
    e.preventDefault();
    setError('');

    if (!validateUserForm()) {
      return;
    }

    try {
      await axios.post('/api/admin/users', newUser);
      setNewUser({
        name: '',
        email: '',
        password: '',
        address: '',
        role: 'normal_user'
      });
      setValidationErrors({});
      setShowAddForm(false);
      fetchUsers();
    } catch (error) {
      setError(error.response?.data?.error || 'Failed to add user');
    }
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setNewUser(prev => ({ ...prev, [name]: value }));
    
    if (validationErrors[name]) {
      setValidationErrors(prev => ({ ...prev, [name]: null }));
    }
  };

  return (
    <div>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1rem' }}>
        <h2>User Management</h2>
        <button 
          onClick={() => setShowAddForm(!showAddForm)} 
          className="btn btn-primary"
        >
          {showAddForm ? 'Cancel' : 'Add User'}
        </button>
      </div>

      {error && <div className="alert alert-error">{error}</div>}

      {showAddForm && (
        <div style={{ backgroundColor: 'white', padding: '1rem', marginBottom: '1rem', borderRadius: '8px' }}>
          <h3>Add New User</h3>
          <form onSubmit={handleAddUser}>
            <div className="form-group">
              <label>Name:</label>
              <input
                type="text"
                name="name"
                value={newUser.name}
                onChange={handleInputChange}
                required
              />
              {validationErrors.name && <div className="alert alert-error">{validationErrors.name}</div>}
            </div>

            <div className="form-group">
              <label>Email:</label>
              <input
                type="email"
                name="email"
                value={newUser.email}
                onChange={handleInputChange}
                required
              />
              {validationErrors.email && <div className="alert alert-error">{validationErrors.email}</div>}
            </div>

            <div className="form-group">
              <label>Password:</label>
              <input
                type="password"
                name="password"
                value={newUser.password}
                onChange={handleInputChange}
                required
              />
              {validationErrors.password && <div className="alert alert-error">{validationErrors.password}</div>}
            </div>

            <div className="form-group">
              <label>Address:</label>
              <textarea
                name="address"
                value={newUser.address}
                onChange={handleInputChange}
                rows="3"
                required
              />
              {validationErrors.address && <div className="alert alert-error">{validationErrors.address}</div>}
            </div>

            <div className="form-group">
              <label>Role:</label>
              <select name="role" value={newUser.role} onChange={handleInputChange}>
                <option value="normal_user">Normal User</option>
                <option value="system_admin">System Admin</option>
              </select>
            </div>

            <button type="submit" className="btn btn-primary">Add User</button>
          </form>
        </div>
      )}

      <div className="search-filters">
        <div className="form-row">
          <input
            type="text"
            placeholder="Search users..."
            value={search}
            onChange={(e) => {
              setSearch(e.target.value);
              setCurrentPage(1);
            }}
          />
        </div>
      </div>

      {loading ? (
        <div>Loading...</div>
      ) : (
        <>
          <table className="table">
            <thead>
              <tr>
                <th onClick={() => handleSort('name')}>
                  Name {sortBy === 'name' && (sortOrder === 'ASC' ? '↑' : '↓')}
                </th>
                <th onClick={() => handleSort('email')}>
                  Email {sortBy === 'email' && (sortOrder === 'ASC' ? '↑' : '↓')}
                </th>
                <th onClick={() => handleSort('address')}>
                  Address {sortBy === 'address' && (sortOrder === 'ASC' ? '↑' : '↓')}
                </th>
                <th onClick={() => handleSort('role')}>
                  Role {sortBy === 'role' && (sortOrder === 'ASC' ? '↑' : '↓')}
                </th>
              </tr>
            </thead>
            <tbody>
              {users.map(user => (
                <tr key={user.id}>
                  <td>{user.name}</td>
                  <td>{user.email}</td>
                  <td>{user.address}</td>
                  <td>{user.role}</td>
                </tr>
              ))}
            </tbody>
          </table>

          {totalPages > 1 && (
            <div className="pagination">
              {Array.from({ length: totalPages }, (_, i) => (
                <button
                  key={i + 1}
                  onClick={() => setCurrentPage(i + 1)}
                  className={currentPage === i + 1 ? 'active' : ''}
                >
                  {i + 1}
                </button>
              ))}
            </div>
          )}
        </>
      )}
    </div>
  );
};

export default UserManagement;