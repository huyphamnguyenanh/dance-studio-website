import React, { useMemo } from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { getClasses, getInstructors, getStudents } from '../data/store';

function StatCard({ label, value, sub, color = 'text-gray-900' }) {
  return (
    <div className="bg-white border border-gray-200 rounded-lg p-5">
      <p className="text-xs font-medium text-gray-500 uppercase tracking-wide mb-1">{label}</p>
      <p className={`text-3xl font-bold ${color}`}>{value}</p>
      {sub && <p className="text-xs text-gray-400 mt-1">{sub}</p>}
    </div>
  );
}

export default function Home() {
  const { user } = useAuth();
  const classes = useMemo(() => getClasses(), []);
  const instructors = useMemo(() => getInstructors(), []);
  const students = useMemo(() => getStudents(), []);

  const avgAttendance = students.length
    ? Math.round(students.reduce((s, st) => s + st.attendance, 0) / students.length)
    : 0;

  const days = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];
  const todayDay = days[new Date().getDay()];
  const todayClasses = classes.filter(c => c.day === todayDay);

  const isAdminOrInstructor = user?.role === 'admin' || user?.role === 'instructor';

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-8">

        {/* Page header */}
        <div className="mb-8">
          <h1 className="text-2xl font-bold text-gray-900">
            Welcome back, {user?.name?.split(' ')[0]}
          </h1>
          <p className="text-gray-500 text-sm mt-1 capitalize">{user?.role} · Dance Studio Management</p>
        </div>

        {/* Stats */}
        {isAdminOrInstructor && (
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
            <StatCard label="Classes" value={classes.length} sub="Active" />
            <StatCard label="Instructors" value={instructors.length} sub="Teaching staff" />
            <StatCard label="Students" value={students.length} sub="Enrolled" />
            <StatCard label="Avg Attendance" value={`${avgAttendance}%`} sub="This month" color="text-green-600" />
          </div>
        )}

        {/* Today's schedule */}
        <div className="mb-8">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-lg font-semibold text-gray-900">Today's Schedule</h2>
            <Link to="/classes" className="text-sm text-blue-600 hover:text-blue-700 font-medium">
              View all →
            </Link>
          </div>

          {todayClasses.length === 0 ? (
            <div className="bg-white border border-gray-200 rounded-lg p-8 text-center">
              <p className="text-gray-400 text-sm">No classes scheduled for today ({todayDay})</p>
            </div>
          ) : (
            <div className="bg-white border border-gray-200 rounded-lg divide-y divide-gray-100">
              {todayClasses.map(cls => {
                const instructor = instructors.find(i => i.id === cls.instructorId);
                return (
                  <Link
                    key={cls.id}
                    to={`/classes/${cls.id}`}
                    className="flex items-center justify-between px-5 py-4 hover:bg-gray-50 transition"
                  >
                    <div className="flex items-center gap-4">
                      <div className="text-center w-14">
                        <p className="text-sm font-semibold text-gray-900">{cls.time}</p>
                      </div>
                      <div>
                        <p className="text-sm font-semibold text-gray-900">{cls.name}</p>
                        <p className="text-xs text-gray-500">{instructor?.name || 'TBD'} · {cls.style} · {cls.level}</p>
                      </div>
                    </div>
                    <div className="flex items-center gap-3 shrink-0">
                      <span className="text-xs text-gray-500">{cls.enrolled}/{cls.capacity}</span>
                      <span className={`text-xs font-medium px-2 py-0.5 rounded-full ${
                        cls.enrolled >= cls.capacity
                          ? 'bg-red-100 text-red-700'
                          : 'bg-green-100 text-green-700'
                      }`}>
                        {cls.enrolled >= cls.capacity ? 'Full' : 'Open'}
                      </span>
                    </div>
                  </Link>
                );
              })}
            </div>
          )}
        </div>

        {/* Quick links */}
        <div>
          <h2 className="text-lg font-semibold text-gray-900 mb-4">Quick Access</h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {[
              { to: '/classes', label: 'Classes', desc: 'Browse and manage all dance classes and schedules.' },
              { to: '/instructors', label: 'Instructors', desc: 'View instructor profiles and class assignments.' },
              ...(isAdminOrInstructor ? [{ to: '/students', label: 'Students', desc: 'Manage student records and attendance.' }] : []),
            ].map(({ to, label, desc }) => (
              <Link
                key={to}
                to={to}
                className="bg-white border border-gray-200 rounded-lg p-5 hover:border-gray-300 hover:shadow-sm transition"
              >
                <h3 className="text-sm font-semibold text-gray-900 mb-1">{label}</h3>
                <p className="text-xs text-gray-500 leading-relaxed">{desc}</p>
                <p className="text-xs text-blue-600 font-medium mt-3">Go to {label} →</p>
              </Link>
            ))}
          </div>
        </div>

      </div>
    </div>
  );
}
