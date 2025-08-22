import React, { useState, useEffect } from 'react';
import axios from 'axios';
import StarRating from './StarRating';

const StoreList = () => {
  const [stores, setStores] = useState([]);
  const [search, setSearch] = useState('');
  const [sortBy, setSortBy] = useState('name');
  const [sortOrder, setSortOrder] = useState('ASC');
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [successMessage, setSuccessMessage] = useState('');

  useEffect(() => {
    fetchStores();
  }, [search, sortBy, sortOrder, currentPage]);

  const fetchStores = async () => {
    try {
      setLoading(true);
      const response = await axios.get('/api/user/stores', {
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

  const handleRatingSubmit = async (storeId, rating) => {
    try {
      if (stores.find(s => s.id === storeId)?.userRating) {
        await axios.put(`/api/user/ratings/${storeId}`, { rating });
        setSuccessMessage('Rating updated successfully!');
      } else {
        await axios.post('/api/user/ratings', { storeId, rating });
        setSuccessMessage('Rating submitted successfully!');
      }
      
      setTimeout(() => setSuccessMessage(''), 3000);
      fetchStores();
    } catch (error) {
      setError(error.response?.data?.error || 'Failed to submit rating');
      setTimeout(() => setError(''), 3000);
    }
  };

  return (
    <div>
      <h2>Browse Stores</h2>
      
      {error && <div className="alert alert-error">{error}</div>}
      {successMessage && <div className="alert alert-success">{successMessage}</div>}

      <div className="search-filters">
        <div className="form-row">
          <input
            type="text"
            placeholder="Search stores by name or address..."
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
                  Store Name {sortBy === 'name' && (sortOrder === 'ASC' ? '↑' : '↓')}
                </th>
                <th onClick={() => handleSort('address')}>
                  Address {sortBy === 'address' && (sortOrder === 'ASC' ? '↑' : '↓')}
                </th>
                <th onClick={() => handleSort('averageRating')}>
                  Overall Rating {sortBy === 'averageRating' && (sortOrder === 'ASC' ? '↑' : '↓')}
                </th>
                <th>Your Rating</th>
                <th>Rate Store</th>
              </tr>
            </thead>
            <tbody>
              {stores.map(store => (
                <tr key={store.id}>
                  <td>{store.name}</td>
                  <td>{store.address}</td>
                  <td>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                      <StarRating rating={store.averageRating} readOnly />
                      <span>({store.averageRating.toFixed(1)})</span>
                    </div>
                  </td>
                  <td>
                    {store.userRating ? (
                      <StarRating rating={store.userRating} readOnly />
                    ) : (
                      <span style={{ color: '#666' }}>Not rated</span>
                    )}
                  </td>
                  <td>
                    <StarRating
                      rating={store.userRating || 0}
                      onRatingChange={(rating) => handleRatingSubmit(store.id, rating)}
                    />
                  </td>
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

export default StoreList;