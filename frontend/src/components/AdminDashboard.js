import React, { useState, useEffect } from 'react';
import axios from 'axios';
import UserManagement from './UserManagement';
import StoreManagement from './StoreManagement';

const AdminDashboard = () => {
  const [dashboardStats, setDashboardStats] = useState({
    totalUsers: 0,
    totalStores: 0,
    totalRatings: 0
  });
  const [activeTab, setActiveTab] = useState('overview');
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    fetchDashboardStats();
  }, []);

  const fetchDashboardStats = async () => {
    try {
      const response = await axios.get('/api/admin/dashboard');
      setDashboardStats(response.data);
      setLoading(false);
    } catch (error) {
      setError('Failed to load dashboard statistics');
      setLoading(false);
    }
  };

  const tabs = [
    { id: 'overview', label: 'Overview' },
    { id: 'users', label: 'Manage Users' },
    { id: 'stores', label: 'Manage Stores' }
  ];

  if (loading) return <div>Loading...</div>;

  return (
    <div>
      <h1>System Administrator Dashboard</h1>
      
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
          <h2>Dashboard Overview</h2>
          <div className="dashboard-stats">
            <div className="stat-card">
              <h3>Total Users</h3>
              <div className="stat-value">{dashboardStats.totalUsers}</div>
            </div>
            <div className="stat-card">
              <h3>Total Stores</h3>
              <div className="stat-value">{dashboardStats.totalStores}</div>
            </div>
            <div className="stat-card">
              <h3>Total Ratings</h3>
              <div className="stat-value">{dashboardStats.totalRatings}</div>
            </div>
          </div>
        </div>
      )}

      {activeTab === 'users' && <UserManagement />}
      {activeTab === 'stores' && <StoreManagement />}
    </div>
  );
};

export default AdminDashboard;