import React, { useState } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import logo from '../assets/images/logo.png';

const NAV_LINKS = [
  { label: 'DASHBOARD', path: '/', roles: ['admin', 'instructor', 'student'] },
  { label: 'CLASSES', path: '/classes', roles: ['admin', 'instructor', 'student'] },
  { label: 'INSTRUCTORS', path: '/instructors', roles: ['admin', 'instructor', 'student'] },
  { label: 'STUDENTS', path: '/students', roles: ['admin', 'instructor'] },
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
    <nav className="fixed top-0 left-0 right-0 z-40 bg-black/95 backdrop-blur border-b border-zinc-800">
      <div className="max-w-7xl mx-auto px-6 flex items-center justify-between h-16">
        {/* Logo only — no duplicate text */}
        <Link to="/" className="flex items-center gap-3 shrink-0">
          <img src={logo} alt="Dance Studio" className="h-10 w-10 object-contain" />
        </Link>

        {/* Desktop Nav */}
        <div className="hidden md:flex items-center gap-8">
          {links.map(link => (
            <Link
              key={link.path}
              to={link.path}
              className={`text-xs font-bold tracking-widest transition ${
                location.pathname === link.path
                  ? 'text-yellow-400'
                  : 'text-zinc-400 hover:text-white'
              }`}
            >
              {link.label}
            </Link>
          ))}
        </div>

        {/* Right side */}
        <div className="hidden md:flex items-center gap-4">
          <div className="text-right">
            <p className="text-white text-xs font-bold uppercase tracking-wider">{user?.name}</p>
            <p className="text-zinc-500 text-xs capitalize">{user?.role}</p>
          </div>
          <button
            onClick={handleLogout}
            className="bg-yellow-400 hover:bg-yellow-300 text-black text-xs font-black tracking-widest px-4 py-2 rounded transition uppercase"
          >
            Logout
          </button>
        </div>

        {/* Mobile menu button */}
        <button
          className="md:hidden text-white p-2 flex flex-col gap-1"
          onClick={() => setMenuOpen(!menuOpen)}
        >
          <span className="block w-5 h-0.5 bg-white" />
          <span className="block w-5 h-0.5 bg-white" />
          <span className="block w-5 h-0.5 bg-white" />
        </button>
      </div>

      {/* Mobile menu */}
      {menuOpen && (
        <div className="md:hidden bg-zinc-900 border-t border-zinc-800 px-6 py-4 space-y-4">
          {links.map(link => (
            <Link
              key={link.path}
              to={link.path}
              onClick={() => setMenuOpen(false)}
              className={`block text-sm font-bold tracking-widest uppercase ${
                location.pathname === link.path ? 'text-yellow-400' : 'text-zinc-400'
              }`}
            >
              {link.label}
            </Link>
          ))}
          <div className="pt-4 border-t border-zinc-800">
            <p className="text-white text-xs font-bold">{user?.name}</p>
            <p className="text-zinc-500 text-xs capitalize mb-3">{user?.role}</p>
            <button
              onClick={handleLogout}
              className="bg-yellow-400 text-black text-xs font-black tracking-widest px-4 py-2 rounded uppercase"
            >
              Logout
            </button>
          </div>
        </div>
      )}
    </nav>
  );
}
