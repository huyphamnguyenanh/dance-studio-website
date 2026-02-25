import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import logo from '../assets/images/logo.png';

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
    }, 400);
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
    <div className="min-h-screen bg-black flex">
      {/* Left panel — branding */}
      <div className="hidden lg:flex lg:w-1/2 relative overflow-hidden bg-zinc-950 items-center justify-center">
        <div className="absolute inset-0 bg-gradient-to-br from-black via-zinc-900 to-black" />
        <div className="relative z-10 text-center px-12">
          <img src={logo} alt="Dance Studio" className="w-28 h-28 object-contain mx-auto mb-8 invert" />
          <h1 className="text-white font-black text-6xl leading-none tracking-tighter mb-4">
            DANCE<br />STUDIO
          </h1>
          <p className="text-zinc-500 text-sm tracking-widest uppercase">Management System</p>
          <div className="mt-10 w-16 h-1 bg-yellow-400 mx-auto" />
        </div>
      </div>

      {/* Right panel — form */}
      <div className="flex-1 flex items-center justify-center px-6 py-12 bg-zinc-950">
        <div className="w-full max-w-md">
          {/* Mobile logo */}
          <div className="lg:hidden text-center mb-10">
            <img src={logo} alt="Dance Studio" className="w-16 h-16 object-contain mx-auto mb-4 invert" />
            <h1 className="text-white font-black text-3xl tracking-tighter">DANCE STUDIO</h1>
          </div>

          <h2 className="text-white font-black text-3xl tracking-tight mb-1">SIGN IN</h2>
          <p className="text-zinc-500 text-sm mb-8">Access your studio management portal</p>

          {error && (
            <div className="bg-red-950/60 border border-red-800 text-red-300 text-sm px-4 py-3 rounded-lg mb-6">
              {error}
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-5">
            <div>
              <label className="block text-zinc-400 text-xs font-bold tracking-widest uppercase mb-2">Email</label>
              <input
                type="email"
                value={email}
                onChange={e => setEmail(e.target.value)}
                placeholder="your@email.com"
                required
                className="w-full bg-zinc-900 border border-zinc-700 text-white rounded-lg px-4 py-3 focus:outline-none focus:border-yellow-400 transition placeholder-zinc-600 text-sm"
              />
            </div>
            <div>
              <label className="block text-zinc-400 text-xs font-bold tracking-widest uppercase mb-2">Password</label>
              <input
                type="password"
                value={password}
                onChange={e => setPassword(e.target.value)}
                placeholder="••••••••"
                required
                className="w-full bg-zinc-900 border border-zinc-700 text-white rounded-lg px-4 py-3 focus:outline-none focus:border-yellow-400 transition placeholder-zinc-600 text-sm"
              />
            </div>
            <button
              type="submit"
              disabled={loading}
              className="w-full bg-yellow-400 hover:bg-yellow-300 disabled:opacity-50 text-black font-black tracking-widest uppercase py-3 rounded-lg transition text-sm"
            >
              {loading ? 'Signing in...' : 'Sign In →'}
            </button>
          </form>

          {/* Demo credentials */}
          <div className="mt-8 border-t border-zinc-800 pt-6">
            <p className="text-zinc-600 text-xs font-bold tracking-widest uppercase mb-3">Quick Demo Access</p>
            <div className="grid grid-cols-3 gap-2">
              {['admin', 'instructor', 'student'].map(role => (
                <button
                  key={role}
                  onClick={() => demoLogin(role)}
                  className="bg-zinc-900 hover:bg-zinc-800 border border-zinc-700 hover:border-zinc-500 text-zinc-300 text-xs font-bold py-2.5 rounded-lg capitalize transition"
                >
                  {role.charAt(0).toUpperCase() + role.slice(1)}
                </button>
              ))}
            </div>
            <p className="text-zinc-700 text-xs mt-2">Password for all: <span className="text-zinc-500">password</span></p>
          </div>
        </div>
      </div>
    </div>
  );
}
