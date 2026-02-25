import React from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

export default function Profile() {
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  const roleColors = {
    admin: 'bg-yellow-400/10 text-yellow-400',
    instructor: 'bg-blue-900/50 text-blue-400',
    student: 'bg-green-900/50 text-green-400',
  };

  return (
    <div className="min-h-screen bg-black text-white">
      <div className="max-w-3xl mx-auto px-6 py-10">
        <h1 className="text-3xl font-black tracking-tight mb-8">PROFILE</h1>

        <div className="bg-zinc-900 border border-zinc-800 rounded-2xl overflow-hidden mb-6">
          <div className="h-1.5 bg-yellow-400" />
          <div className="p-8">
            <div className="flex items-center gap-5 mb-8">
              <div className="w-16 h-16 bg-yellow-400 rounded-full flex items-center justify-center text-black font-black text-2xl">
                {user?.name?.charAt(0)}
              </div>
              <div>
                <h2 className="text-2xl font-black">{user?.name}</h2>
                <span className={`text-xs font-bold px-3 py-1 rounded-full capitalize mt-1 inline-block ${roleColors[user?.role] || 'bg-zinc-800 text-zinc-400'}`}>
                  {user?.role}
                </span>
              </div>
            </div>

            <div className="space-y-0">
              {[
                { label: 'Email', value: user?.email },
                { label: 'Role', value: user?.role },
                { label: 'Account Status', value: 'Active' },
              ].map(({ label, value }) => (
                <div key={label} className="flex justify-between items-center py-4 border-b border-zinc-800 last:border-0">
                  <span className="text-zinc-500 text-xs uppercase tracking-widest">{label}</span>
                  <span className="text-white font-semibold text-sm capitalize">{value}</span>
                </div>
              ))}
            </div>
          </div>
        </div>

        <button
          onClick={handleLogout}
          className="w-full bg-red-950/50 hover:bg-red-950 border border-red-900 text-red-400 font-black tracking-widest uppercase py-3 rounded-lg transition text-sm"
        >
          Sign Out
        </button>
      </div>
    </div>
  );
}
