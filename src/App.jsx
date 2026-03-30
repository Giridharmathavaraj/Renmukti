import { useState, useEffect } from 'react'
import { Routes, Route, Navigate } from 'react-router-dom';
import LoanDashboard from './Component/LoanDashboard';
import ParticularLoanPage from './Component/ParticularLoanPage';
import EditUserPage from './Component/EditUserPage';
import LoginPage from './Component/LoginPage';
import CompanyDashboard from './Component/CompanyDashboard';
import Users from './Component/New Users/Users';
import RecordForm from './Component/New Users/Addusers';
import Companies from './Component/Companies/Companies';
import AddCompany from './Component/Companies/AddCompany';

import './App.css'

function App() {
  const checkAuth = () => {
    const token = localStorage.getItem('token');
    return !!token && token !== 'undefined' && token !== 'null';
  };

  const [isAuthenticated, setIsAuthenticated] = useState(checkAuth());

  // Check auth status on mount
  useEffect(() => {
    setIsAuthenticated(checkAuth());
  }, []);

  const handleLogin = (token, username) => {
    setIsAuthenticated(true);
  };

  return (
    <>
      <Routes>
        <Route path="/login" element={!isAuthenticated ? <LoginPage onLogin={handleLogin} /> : <Navigate to="/" />} />

        <Route path="/" element={isAuthenticated ? <LoanDashboard /> : <Navigate to="/login" />} />
        <Route path="/company-dashboard" element={isAuthenticated ? <CompanyDashboard /> : <Navigate to="/login" />} />
        <Route path="/particular-loan" element={isAuthenticated ? <ParticularLoanPage /> : <Navigate to="/login" />} />
        <Route path="/EditUserPage" element={isAuthenticated ? <EditUserPage /> : <Navigate to="/login" />} />
        <Route path="/Users" element={isAuthenticated ? <Users /> : <Navigate to="/login" />} />
        <Route path="/Addusers" element={isAuthenticated ? <RecordForm /> : <Navigate to="/login" />} />
        <Route path="/companies" element={isAuthenticated ? <Companies /> : <Navigate to="/login" />} />
        <Route path="/add-company" element={isAuthenticated ? <AddCompany /> : <Navigate to="/login" />} />
      </Routes>
    </>
  )
}

export default App
