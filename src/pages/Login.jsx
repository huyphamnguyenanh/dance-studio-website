import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

export default function Login() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const { login } = useAuth();
  const navigate = useNavigate();

  const handleSubmit = (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);
    setTimeout(() => {
      if (login(email, password)) {
        navigate('/');
      } else {
        setError('Invalid email or password. Try the demo accounts below.');
      }
      setLoading(false);
    }, 300);
  };

  const demoLogin = (role) => {
    const creds = {
      admin: 'admin@studio.com',
      instructor: 'instructor@studio.com',
      student: 'student@studio.com',
    };
    setEmail(creds[role]);
    setPassword('password');
  };

  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center px-4">
      <div className="w-full max-w-sm">

        {/* Brand */}
        <div className="text-center mb-8">
          <div className="inline-flex items-center justify-center w-12 h-12 bg-gray-900 rounded-xl mb-3">
            <span className="text-white font-black text-lg">DS</span>
          </div>
          <h1 className="text-xl font-bold text-gray-900">Dance Studio</h1>
          <p className="text-sm text-gray-500 mt-1">Management System</p>
        </div>

        {/* Card */}
        <div className="bg-white border border-gray-200 rounded-xl p-6 shadow-sm">
          <h2 className="text-base font-semibold text-gray-900 mb-5">Sign in to your account</h2>

          {error && (
            <div className="bg-red-50 border border-red-200 text-red-700 text-sm px-3 py-2 rounded-lg mb-4">
              {error}
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="block text-xs font-medium text-gray-700 mb-1.5">Email address</label>
              <input
                type="email"
                value={email}
                onChange={e => setEmail(e.target.value)}
                placeholder="you@studio.com"
                required
                className="w-full border border-gray-300 rounded-lg px-3 py-2.5 text-sm text-gray-900 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-gray-900 focus:border-transparent"
              />
            </div>
            <div>
              <label className="block text-xs font-medium text-gray-700 mb-1.5">Password</label>
              <input
                type="password"
                value={password}
                onChange={e => setPassword(e.target.value)}
                placeholder="••••••••"
                required
                className="w-full border border-gray-300 rounded-lg px-3 py-2.5 text-sm text-gray-900 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-gray-900 focus:border-transparent"
              />
            </div>
            <button
              type="submit"
              disabled={loading}
              className="w-full bg-gray-900 hover:bg-gray-800 disabled:opacity-60 text-white font-semibold py-2.5 rounded-lg text-sm transition"
            >
              {loading ? 'Signing in...' : 'Sign in'}
            </button>
          </form>
        </div>

        {/* Demo accounts */}
        <div className="mt-4">
          <p className="text-xs text-gray-500 text-center mb-2">
            Demo accounts — password: <code className="bg-gray-100 px-1 py-0.5 rounded text-gray-700">password</code>
          </p>
          <div className="grid grid-cols-3 gap-2">
            {[
              { role: 'admin', desc: 'Full access' },
              { role: 'instructor', desc: 'Classes & students' },
              { role: 'student', desc: 'Browse classes' },
            ].map(({ role, desc }) => (
              <button
                key={role}
                type="button"
                onClick={() => demoLogin(role)}
                className="bg-white border border-gray-200 rounded-lg p-2.5 text-left hover:border-gray-400 hover:bg-gray-50 transition"
              >
                <p className="text-xs font-semibold text-gray-900 capitalize">{role}</p>
                <p className="text-xs text-gray-400 mt-0.5">{desc}</p>
              </button>
            ))}
          </div>
        </div>

      </div>
    </div>
  );
}
