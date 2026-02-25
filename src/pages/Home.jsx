import React from 'react';
import { useAuth } from '../context/AuthContext';
import logo from '../assets/images/logo.png';

export default function Home() {
  const { user } = useAuth();

  const stats = [
    { label: 'Total Students', value: '156', color: 'bg-blue-500' },
    { label: 'Instructors', value: '12', color: 'bg-purple-500' },
    { label: 'Classes This Week', value: '24', color: 'bg-pink-500' },
    { label: 'Avg Attendance', value: '92%', color: 'bg-green-500' }
  ];

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white shadow">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <img src={logo} alt="Dance Studio" className="w-12 h-12" />
              <div>
                <h1 className="text-3xl font-bold text-gray-900">Dance Studio</h1>
                <p className="text-gray-600">Management System</p>
              </div>
            </div>
            <div className="text-right">
              <p className="text-gray-900 font-semibold">{user?.name}</p>
              <p className="text-sm text-gray-600 capitalize">{user?.role}</p>
            </div>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        {/* Welcome Section */}
        <div className="mb-12">
          <h2 className="text-2xl font-bold text-gray-900 mb-4">Welcome, {user?.name}!</h2>
          <p className="text-gray-600">
            {user?.role === 'admin' && 'Manage your dance studio with ease. View all classes, instructors, and student enrollments.'}
            {user?.role === 'instructor' && 'Manage your classes and track student attendance.'}
            {user?.role === 'student' && 'Browse available classes and manage your enrollments.'}
          </p>
        </div>

        {/* Stats Grid */}
        {user?.role === 'admin' && (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-12">
            {stats.map((stat, index) => (
              <div key={index} className="bg-white rounded-lg shadow p-6">
                <div className={`${stat.color} w-12 h-12 rounded-lg flex items-center justify-center mb-4`}>
                  <span className="text-white text-xl font-bold">📊</span>
                </div>
                <p className="text-gray-600 text-sm mb-2">{stat.label}</p>
                <p className="text-3xl font-bold text-gray-900">{stat.value}</p>
              </div>
            ))}
          </div>
        )}

        {/* Quick Actions */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="bg-white rounded-lg shadow p-6 hover:shadow-lg transition">
            <div className="text-4xl mb-4">📚</div>
            <h3 className="text-lg font-semibold text-gray-900 mb-2">Classes</h3>
            <p className="text-gray-600 text-sm mb-4">
              {user?.role === 'student' ? 'Browse and enroll in classes' : 'Manage all dance classes'}
            </p>
            <a href="/classes" className="text-purple-600 font-semibold hover:text-purple-700">
              View Classes →
            </a>
          </div>

          <div className="bg-white rounded-lg shadow p-6 hover:shadow-lg transition">
            <div className="text-4xl mb-4">👥</div>
            <h3 className="text-lg font-semibold text-gray-900 mb-2">
              {user?.role === 'student' ? 'My Classes' : 'Instructors'}
            </h3>
            <p className="text-gray-600 text-sm mb-4">
              {user?.role === 'student' ? 'View your enrolled classes' : 'Meet our instructors'}
            </p>
            <a href="/instructors" className="text-purple-600 font-semibold hover:text-purple-700">
              View Instructors →
            </a>
          </div>

          <div className="bg-white rounded-lg shadow p-6 hover:shadow-lg transition">
            <div className="text-4xl mb-4">⚙️</div>
            <h3 className="text-lg font-semibold text-gray-900 mb-2">Settings</h3>
            <p className="text-gray-600 text-sm mb-4">Manage your account and preferences</p>
            <a href="/profile" className="text-purple-600 font-semibold hover:text-purple-700">
              Go to Settings →
            </a>
          </div>
        </div>
      </div>
    </div>
  );
}
