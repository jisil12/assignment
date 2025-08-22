import React from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';

const Navbar = () => {
  const { isAuthenticated, user, logout } = useAuth();

  const getDashboardPath = () => {
    if (!user) return '/';
    if (user.userType === 'user') {
      if (user.role === 'system_admin') return '/admin';
      return '/dashboard';
    }
    return '/store';
  };

  return (
    <nav className="navbar">
      <div className="container">
        <Link to="/" className="navbar-brand">Store Rating System</Link>
        {isAuthenticated ? (
          <ul className="navbar-nav">
            <li><Link to={getDashboardPath()}>Dashboard</Link></li>
            <li><span style={{color: 'white'}}>Welcome, {user?.name || user?.email}</span></li>
            <li><button onClick={logout} className="btn btn-secondary">Logout</button></li>
          </ul>
        ) : (
          <ul className="navbar-nav">
            <li><Link to="/login">Login</Link></li>
            <li><Link to="/signup">Signup</Link></li>
          </ul>
        )}
      </div>
    </nav>
  );
};

export default Navbar;