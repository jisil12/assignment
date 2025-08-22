import React, { useState } from 'react';
import StoreList from './StoreList';
import ChangePassword from './ChangePassword';

const UserDashboard = () => {
  const [activeTab, setActiveTab] = useState('stores');

  const tabs = [
    { id: 'stores', label: 'Browse Stores' },
    { id: 'password', label: 'Change Password' }
  ];

  return (
    <div>
      <h1>User Dashboard</h1>
      
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

      {activeTab === 'stores' && <StoreList />}
      {activeTab === 'password' && <ChangePassword />}
    </div>
  );
};

export default UserDashboard;