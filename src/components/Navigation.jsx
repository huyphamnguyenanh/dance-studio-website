import React, { useState } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

const NAV_LINKS = [
  { label: 'Home', path: '/', roles: ['admin', 'instructor', 'student'] },
  { label: 'Classes', path: '/classes', roles: ['admin', 'instructor', 'student'] },
  { label: 'Instructors', path: '/instructors', roles: ['admin', 'instructor', 'student'] },
  { label: 'Students', path: '/students', roles: ['admin', 'instructor'] },
];

export default function Navigation() {
  const { user, logout } = useAuth();
  const location = useLocation();
  const navigate = useNavigate();
  const [menuOpen, setMenuOpen] = useState(false);

  const links = NAV_LINKS.filter(l => l.roles.includes(user?.role));

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  return (
    <nav className="fixed top-0 left-0 right-0 z-50 bg-teal-700 text-white shadow-md">
      {/* Top bar */}
      <div className="px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* Left: Brand */}
          <Link to="/" className="flex items-center gap-2 shrink-0">
            <span className="text-lg font-bold text-amber-300">Django administration</span>
          </Link>

          {/* Center: Navigation links (desktop only) */}
          <div className="hidden md:flex items-center gap-6">
            {links.map(link => (
              <Link
                key={link.path}
                to={link.path}
                className={`text-sm font-medium transition ${
                  location.pathname === link.path
                    ? 'text-amber-300 border-b-2 border-amber-300'
                    : 'text-gray-200 hover:text-white'
                }`}
              >
                {link.label}
              </Link>
            ))}
          </div>

          {/* Right: User menu */}
          <div className="hidden md:flex items-center gap-4 text-sm">
            <span className="text-amber-300">WELCOME, {user?.name?.toUpperCase() || 'USER'}</span>
            <span className="text-gray-300">|</span>
            <Link to="/profile" className="text-gray-200 hover:text-amber-300 transition">
              CHANGE PASSWORD
            </Link>
            <span className="text-gray-300">|</span>
            <button
              onClick={handleLogout}
              className="text-gray-200 hover:text-amber-300 transition"
            >
              LOG OUT
            </button>
          </div>

          {/* Mobile menu button */}
          <button
            className="md:hidden p-2 text-white hover:bg-teal-600 rounded transition"
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
      </div>

      {/* Mobile menu */}
      {menuOpen && (
        <div className="md:hidden bg-teal-600 border-t border-teal-500 px-4 py-3 space-y-2">
          {links.map(link => (
            <Link
              key={link.path}
              to={link.path}
              onClick={() => setMenuOpen(false)}
              className={`block px-3 py-2 rounded text-sm font-medium transition ${
                location.pathname === link.path
                  ? 'bg-teal-500 text-amber-300'
                  : 'text-gray-200 hover:text-white hover:bg-teal-500'
              }`}
            >
              {link.label}
            </Link>
          ))}
          <div className="pt-3 border-t border-teal-500 space-y-2">
            <Link
              to="/profile"
              onClick={() => setMenuOpen(false)}
              className="block px-3 py-2 text-sm text-gray-200 hover:text-amber-300 transition"
            >
              Change Password
            </Link>
            <button
              onClick={() => {
                handleLogout();
                setMenuOpen(false);
              }}
              className="block w-full text-left px-3 py-2 text-sm text-gray-200 hover:text-amber-300 transition"
            >
              Log Out
            </button>
          </div>
        </div>
      )}
    </nav>
  );
}
