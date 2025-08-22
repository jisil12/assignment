import React, { useState, useEffect } from 'react';
import axios from 'axios';
import StarRating from './StarRating';
import ChangePassword from './ChangePassword';

const StoreDashboard = () => {
  const [dashboardData, setDashboardData] = useState({
    averageRating: 0,
    totalRatings: 0,
    ratings: []
  });
  const [activeTab, setActiveTab] = useState('overview');
  const [ratings, setRatings] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [sortBy, setSortBy] = useState('createdAt');
  const [sortOrder, setSortOrder] = useState('DESC');
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    if (activeTab === 'overview') {
      fetchDashboardData();
    } else if (activeTab === 'ratings') {
      fetchRatings();
    }
  }, [activeTab, currentPage, sortBy, sortOrder]);

  const fetchDashboardData = async () => {
    try {
      setLoading(true);
      const response = await axios.get('/api/store/dashboard');
      setDashboardData(response.data);
      setError('');
    } catch (error) {
      setError('Failed to load dashboard data');
    } finally {
      setLoading(false);
    }
  };

  const fetchRatings = async () => {
    try {
      setLoading(true);
      const response = await axios.get('/api/store/ratings', {
        params: { sortBy, sortOrder, page: currentPage, limit: 10 }
      });
      setRatings(response.data.ratings);
      setTotalPages(response.data.totalPages);
      setError('');
    } catch (error) {
      setError('Failed to load ratings');
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

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  const tabs = [
    { id: 'overview', label: 'Overview' },
    { id: 'ratings', label: 'All Ratings' },
    { id: 'password', label: 'Change Password' }
  ];

  if (loading && activeTab === 'overview') return <div>Loading...</div>;

  return (
    <div>
      <h1>Store Owner Dashboard</h1>
      
      <div style={{ 
        display: 'flex', 
        gap: '1rem', 
        marginBottom: '2rem', 
        borderBottom: '1px solid #ddd',
        paddingBottom: '1rem'
      }}>
        {tabs.map(tab => (
          <button
            key={tab.id}
            onClick={() => setActiveTab(tab.id)}
            className={`btn ${activeTab === tab.id ? 'btn-primary' : 'btn-secondary'}`}
          >
            {tab.label}
          </button>
        ))}
      </div>

      {error && <div className="alert alert-error">{error}</div>}

      {activeTab === 'overview' && (
        <div>
          <h2>Store Performance Overview</h2>
          <div className="dashboard-stats">
            <div className="stat-card">
              <h3>Average Rating</h3>
              <div className="stat-value">
                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '0.5rem' }}>
                  <StarRating rating={parseFloat(dashboardData.averageRating)} readOnly />
                  <span>({dashboardData.averageRating})</span>
                </div>
              </div>
            </div>
            <div className="stat-card">
              <h3>Total Ratings Received</h3>
              <div className="stat-value">{dashboardData.totalRatings}</div>
            </div>
          </div>

          {dashboardData.ratings.length > 0 && (
            <div>
              <h3>Recent Ratings</h3>
              <table className="table">
                <thead>
                  <tr>
                    <th>User</th>
                    <th>Email</th>
                    <th>Rating</th>
                    <th>Date</th>
                  </tr>
                </thead>
                <tbody>
                  {dashboardData.ratings.slice(0, 5).map(rating => (
                    <tr key={rating.id}>
                      <td>{rating.user.name}</td>
                      <td>{rating.user.email}</td>
                      <td><StarRating rating={rating.rating} readOnly /></td>
                      <td>{formatDate(rating.createdAt)}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      )}

      {activeTab === 'ratings' && (
        <div>
          <h2>All Ratings</h2>
          
          {loading ? (
            <div>Loading...</div>
          ) : (
            <>
              <table className="table">
                <thead>
                  <tr>
                    <th onClick={() => handleSort('User.name')}>
                      User Name {sortBy === 'User.name' && (sortOrder === 'ASC' ? '↑' : '↓')}
                    </th>
                    <th onClick={() => handleSort('User.email')}>
                      Email {sortBy === 'User.email' && (sortOrder === 'ASC' ? '↑' : '↓')}
                    </th>
                    <th onClick={() => handleSort('rating')}>
                      Rating {sortBy === 'rating' && (sortOrder === 'ASC' ? '↑' : '↓')}
                    </th>
                    <th onClick={() => handleSort('createdAt')}>
                      Date {sortBy === 'createdAt' && (sortOrder === 'ASC' ? '↑' : '↓')}
                    </th>
                  </tr>
                </thead>
                <tbody>
                  {ratings.map(rating => (
                    <tr key={rating.id}>
                      <td>{rating.user.name}</td>
                      <td>{rating.user.email}</td>
                      <td><StarRating rating={rating.rating} readOnly /></td>
                      <td>{formatDate(rating.createdAt)}</td>
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
      )}

      {activeTab === 'password' && <ChangePassword />}
    </div>
  );
};

export default StoreDashboard;