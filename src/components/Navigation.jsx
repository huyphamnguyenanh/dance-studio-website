import React, { useState } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

export default function Navigation() {
  const { user, logout } = useAuth();
  const location = useLocation();
  const navigate = useNavigate();
  const [menuOpen, setMenuOpen] = useState(false);

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  // Build breadcrumb
  const getBreadcrumb = () => {
    const path = location.pathname;
    if (path === '/') return ['Home'];
    if (path.startsWith('/classes')) return ['Home', 'Studio', 'Class sessions'];
    if (path.startsWith('/instructors')) return ['Home', 'Studio', 'Instructors'];
    if (path.startsWith('/students')) return ['Home', 'Studio', 'Students'];
    if (path === '/profile') return ['Home', 'Profile'];
    return ['Home'];
  };

  const breadcrumb = getBreadcrumb();

  return (
    <nav className="fixed top-0 left-0 right-0 z-50 bg-teal-700 text-white shadow-md">
      <div className="px-4 sm:px-6 lg:px-8">
        {/* Top Bar */}
        <div className="flex items-center justify-between h-14">
          {/* Brand */}
          <Link to="/" className="flex items-center gap-2 shrink-0">
            <span className="text-lg font-bold text-amber-300">Django administration</span>
          </Link>

          {/* Right side - User Menu */}
          <div className="hidden md:flex items-center gap-4 text-sm">
            <span className="text-amber-300">WELCOME, {user?.name?.toUpperCase() || 'USER'}</span>
            <span className="text-gray-300">·</span>
            <Link to="/" className="text-amber-300 hover:text-white transition">VIEW SITE</Link>
            <span className="text-gray-300">·</span>
            <Link to="/profile" className="text-amber-300 hover:text-white transition">CHANGE PASSWORD</Link>
            <span className="text-gray-300">·</span>
            <button
              onClick={handleLogout}
              className="text-amber-300 hover:text-white transition"
            >
              LOG OUT
            </button>
            <span className="text-gray-300">·</span>
            <button className="w-6 h-6 bg-gray-400 rounded-full hover:bg-gray-300 transition flex items-center justify-center text-xs font-bold text-teal-700">
              🌙
            </button>
          </div>

          {/* Mobile menu button */}
          <button
            className="md:hidden p-2 rounded-md text-white hover:bg-teal-600 transition"
            onClick={() => setMenuOpen(!menuOpen)}
            aria-label="Toggle menu"
          >
            {menuOpen ? (
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            ) : (
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
              </svg>
            )}
          </button>
        </div>

        {/* Breadcrumb */}
        <div className="hidden md:flex items-center gap-2 text-sm text-white py-2 border-t border-teal-600">
          {breadcrumb.map((item, idx) => (
            <div key={idx} className="flex items-center gap-2">
              {idx > 0 && <span className="text-gray-300">›</span>}
              <Link
                to={idx === 0 ? '/' : '#'}
                className="text-white hover:text-amber-300 transition underline"
              >
                {item}
              </Link>
            </div>
          ))}
        </div>
      </div>

      {/* Mobile menu */}
      {menuOpen && (
        <div className="md:hidden bg-teal-600 border-t border-teal-500 px-4 py-3 space-y-2">
          <div className="text-sm text-amber-300 mb-3">
            {user?.name?.toUpperCase() || 'USER'}
          </div>
          <Link
            to="/"
            onClick={() => setMenuOpen(false)}
            className="block text-sm text-white hover:text-amber-300 transition py-2"
          >
            View Site
          </Link>
          <Link
            to="/profile"
            onClick={() => setMenuOpen(false)}
            className="block text-sm text-white hover:text-amber-300 transition py-2"
          >
            Change Password
          </Link>
          <button
            onClick={() => {
              handleLogout();
              setMenuOpen(false);
            }}
            className="block w-full text-left text-sm text-white hover:text-amber-300 transition py-2"
          >
            Log Out
          </button>
        </div>
      )}
    </nav>
  );
}
