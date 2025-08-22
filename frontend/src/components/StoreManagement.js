import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { validateName, validateEmail, validatePassword, validateAddress } from '../utils/validation';

const StoreManagement = () => {
  const [stores, setStores] = useState([]);
  const [showAddForm, setShowAddForm] = useState(false);
  const [search, setSearch] = useState('');
  const [sortBy, setSortBy] = useState('name');
  const [sortOrder, setSortOrder] = useState('ASC');
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const [newStore, setNewStore] = useState({
    name: '',
    email: '',
    password: '',
    address: ''
  });
  const [validationErrors, setValidationErrors] = useState({});

  useEffect(() => {
    fetchStores();
  }, [search, sortBy, sortOrder, currentPage]);

  const fetchStores = async () => {
    try {
      setLoading(true);
      const response = await axios.get('/api/admin/stores', {
        params: { search, sortBy, sortOrder, page: currentPage, limit: 10 }
      });
      setStores(response.data.stores);
      setTotalPages(response.data.totalPages);
      setError('');
    } catch (error) {
      setError('Failed to fetch stores');
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

  const validateStoreForm = () => {
    const errors = {};
    
    const nameError = validateName(newStore.name);
    if (nameError) errors.name = nameError;
    
    const emailError = validateEmail(newStore.email);
    if (emailError) errors.email = emailError;
    
    const passwordError = validatePassword(newStore.password);
    if (passwordError) errors.password = passwordError;
    
    const addressError = validateAddress(newStore.address);
    if (addressError) errors.address = addressError;
    
    setValidationErrors(errors);
    return Object.keys(errors).length === 0;
  };

  const handleAddStore = async (e) => {
    e.preventDefault();
    setError('');

    if (!validateStoreForm()) {
      return;
    }

    try {
      await axios.post('/api/admin/stores', newStore);
      setNewStore({
        name: '',
        email: '',
        password: '',
        address: ''
      });
      setValidationErrors({});
      setShowAddForm(false);
      fetchStores();
    } catch (error) {
      setError(error.response?.data?.error || 'Failed to add store');
    }
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setNewStore(prev => ({ ...prev, [name]: value }));
    
    if (validationErrors[name]) {
      setValidationErrors(prev => ({ ...prev, [name]: null }));
    }
  };

  return (
    <div>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1rem' }}>
        <h2>Store Management</h2>
        <button 
          onClick={() => setShowAddForm(!showAddForm)} 
          className="btn btn-primary"
        >
          {showAddForm ? 'Cancel' : 'Add Store'}
        </button>
      </div>

      {error && <div className="alert alert-error">{error}</div>}

      {showAddForm && (
        <div style={{ backgroundColor: 'white', padding: '1rem', marginBottom: '1rem', borderRadius: '8px' }}>
          <h3>Add New Store</h3>
          <form onSubmit={handleAddStore}>
            <div className="form-group">
              <label>Name:</label>
              <input
                type="text"
                name="name"
                value={newStore.name}
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
                value={newStore.email}
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
                value={newStore.password}
                onChange={handleInputChange}
                required
              />
              {validationErrors.password && <div className="alert alert-error">{validationErrors.password}</div>}
            </div>

            <div className="form-group">
              <label>Address:</label>
              <textarea
                name="address"
                value={newStore.address}
                onChange={handleInputChange}
                rows="3"
                required
              />
              {validationErrors.address && <div className="alert alert-error">{validationErrors.address}</div>}
            </div>

            <button type="submit" className="btn btn-primary">Add Store</button>
          </form>
        </div>
      )}

      <div className="search-filters">
        <div className="form-row">
          <input
            type="text"
            placeholder="Search stores..."
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
                <th onClick={() => handleSort('averageRating')}>
                  Rating {sortBy === 'averageRating' && (sortOrder === 'ASC' ? '↑' : '↓')}
                </th>
              </tr>
            </thead>
            <tbody>
              {stores.map(store => (
                <tr key={store.id}>
                  <td>{store.name}</td>
                  <td>{store.email}</td>
                  <td>{store.address}</td>
                  <td>{parseFloat(store.averageRating).toFixed(1)}/5.0</td>
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

export default StoreManagement;