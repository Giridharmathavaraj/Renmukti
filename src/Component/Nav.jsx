import React, { useState, useEffect, useRef } from 'react'
import {
  ChevronDown, Bell, Mail, HelpCircle, User,
  Search, Pin, List, Plus, LogOut, UserCircle
} from 'lucide-react';
import { useNavigate, useLocation } from 'react-router-dom';

function Nav() {
  const navigate = useNavigate();
  const location = useLocation();
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const [username, setUsername] = useState('User');
  const [role, setRole] = useState('');
  const dropdownRef = useRef(null);

  useEffect(() => {
    const storedUsername = localStorage.getItem('username');
    const storedRole = localStorage.getItem('role');
    if (storedUsername) {
      setUsername(storedUsername);
    }
    if (storedRole) {
      setRole(storedRole);
    }

    // Close dropdown when clicking outside
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setIsDropdownOpen(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const handleLogout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('username');
    localStorage.removeItem('role');
    localStorage.removeItem('companyId');
    // Using window.location.href to fully reload the app state and let App.jsx catch the empty token
    window.location.href = '/login';
  };
  return (
    <>
      {/* HEADER */}
      <header className="main-header">
        <div className="header-left">
          <div className="logo-section">
            <span className="logo-text">Renmukti</span>
            <div className="separator"></div>
            <span className="sandbox-text">LOS</span>
          </div>
          <nav className="nav-menu">
            <a href="#" className={location.pathname === '/company-dashboard' ? "active" : ""} onClick={(e) => { e.preventDefault(); navigate('/company-dashboard'); }}>Dashboards</a>
            <a href="#" className={location.pathname === '/' ? "active" : ""} onClick={(e) => { e.preventDefault(); navigate('/'); }}>Loans</a>
            {role === 'superadmin' && (
              <a href="#" className={location.pathname === '/companies' ? "active" : ""} onClick={(e) => { e.preventDefault(); navigate('/companies'); }}>Companies</a>
            )}
            <a href="#">Tools <ChevronDown size={14} /></a>
            <a href="#">Reports <ChevronDown size={14} /></a>
            {(role === 'superadmin' || role === 'admin') && (
              <a href="#" className={location.pathname === '/Users' ? "active" : ""} onClick={(e) => { e.preventDefault(); navigate('/Users'); }}>Users <ChevronDown size={14} /></a>
            )}
            <a href="#">Settings <ChevronDown size={14} /></a>
          </nav>
        </div>
        <div className="header-right">
          {/* <div className="sandbox-badge">
            <span className="dot"></span> Sandbox Environment
          </div> */}
          <HelpCircle className="icon" size={20} />
          <Mail className="icon" size={20} />
          <Bell className="icon" size={20} />
          <div className="user-profile" ref={dropdownRef}>
            <div
              className="user-profile-trigger"
              onClick={() => setIsDropdownOpen(!isDropdownOpen)}
              style={{ display: 'flex', alignItems: 'center', gap: '8px', cursor: 'pointer' }}
            >
              <div className="avatar"><User size={16} /></div>
              <span>{username}</span>
              <ChevronDown size={14} style={{ transform: isDropdownOpen ? 'rotate(180deg)' : 'none', transition: 'transform 0.2s' }} />
            </div>

            {isDropdownOpen && (
              <div className="profile-dropdown-menu">
                <div className="dropdown-header">
                  <strong>{username}</strong>
                  <span className="user-role" style={{ textTransform: 'capitalize' }}>{role || 'User'}</span>
                </div>
                <div className="dropdown-divider"></div>
                <button className="dropdown-item" onClick={() => navigate('/particular-loan')}>
                  <UserCircle size={16} />
                  My Details
                </button>
                <button className="dropdown-item logout-item" onClick={handleLogout}>
                  <LogOut size={16} />
                  Logout
                </button>
              </div>
            )}
          </div>
        </div>
      </header>
    </>

  )
}

export default Nav




