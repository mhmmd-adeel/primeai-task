// frontend/src/components/Navbar.jsx
import React from 'react';
import { Link } from 'react-router-dom';

const Navbar = ({ user, onLogout }) => {
  return (
    <header className="bg-indigo-600 shadow-md">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex justify-between items-center h-16">
        <Link to="/dashboard" className="text-white text-xl font-bold">App Dashboard</Link>
        <div className="flex items-center space-x-4">
          <span className="text-white">Logged in as: {user ? user.email : 'Guest'}</span>
          <button
            onClick={onLogout}
            className="px-3 py-1 border border-white rounded-md text-sm font-medium text-white hover:bg-indigo-500"
          >
            Logout
          </button>
        </div>
      </div>
    </header>
  );
};

export default Navbar;