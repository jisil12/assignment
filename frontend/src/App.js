import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { AuthProvider } from './contexts/AuthContext';
import Navbar from './components/Navbar';
import Login from './components/Login';
import Signup from './components/Signup';
import AdminDashboard from './components/AdminDashboard';
import UserDashboard from './components/UserDashboard';
import StoreDashboard from './components/StoreDashboard';
import ProtectedRoute from './components/ProtectedRoute';

function App() {
  return (
    <AuthProvider>
      <Router>
        <div className="App">
          <Navbar />
          <div className="container">
            <Routes>
              <Route path="/login" element={<Login />} />
              <Route path="/signup" element={<Signup />} />
              <Route 
                path="/admin" 
                element={
                  <ProtectedRoute requiredRole="system_admin">
                    <AdminDashboard />
                  </ProtectedRoute>
                } 
              />
              <Route 
                path="/dashboard" 
                element={
                  <ProtectedRoute requiredRole="normal_user">
                    <UserDashboard />
                  </ProtectedRoute>
                } 
              />
              <Route 
                path="/store" 
                element={
                  <ProtectedRoute requiredRole="store_owner">
                    <StoreDashboard />
                  </ProtectedRoute>
                } 
              />
              <Route path="/" element={<Login />} />
            </Routes>
          </div>
        </div>
      </Router>
    </AuthProvider>
  );
}

export default App;