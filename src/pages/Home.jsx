import React, { useMemo } from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { getClasses, getInstructors, getStudents } from '../data/store';

function StatCard({ label, value, sub }) {
  return (
    <div className="bg-white border border-gray-200 rounded p-4">
      <p className="text-xs font-bold text-gray-600 uppercase tracking-wide">{label}</p>
      <p className="text-3xl font-bold text-gray-900 mt-2">{value}</p>
      {sub && <p className="text-xs text-gray-500 mt-1">{sub}</p>}
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
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      {/* Page header */}
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900">Site administration</h1>
        <p className="text-gray-600 text-sm mt-2">
          Welcome, <strong>{user?.name}</strong>. {user?.role === 'admin' ? 'You have access to all administrative functions.' : 'You have limited access based on your role.'}
        </p>
      </div>

      {/* Stats Grid */}
      {isAdminOrInstructor && (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
          <StatCard label="Classes" value={classes.length} sub="Active" />
          <StatCard label="Instructors" value={instructors.length} sub="Teaching staff" />
          <StatCard label="Students" value={students.length} sub="Enrolled" />
          <StatCard label="Avg Attendance" value={`${avgAttendance}%`} sub="This month" />
        </div>
      )}

      {/* Today's Schedule */}
      <div className="mb-8">
        <h2 className="text-xl font-bold text-gray-900 mb-4">Today's Schedule ({todayDay})</h2>

        {todayClasses.length === 0 ? (
          <div className="bg-white border border-gray-200 rounded p-6 text-center">
            <p className="text-gray-500 text-sm">No classes scheduled for today</p>
          </div>
        ) : (
          <div className="bg-white border border-gray-200 rounded overflow-hidden">
            <table className="w-full">
              <thead className="bg-gray-50 border-b border-gray-200">
                <tr>
                  <th className="text-left text-xs font-bold text-gray-700 uppercase px-4 py-3">Time</th>
                  <th className="text-left text-xs font-bold text-gray-700 uppercase px-4 py-3">Class</th>
                  <th className="text-left text-xs font-bold text-gray-700 uppercase px-4 py-3">Instructor</th>
                  <th className="text-left text-xs font-bold text-gray-700 uppercase px-4 py-3">Style</th>
                  <th className="text-left text-xs font-bold text-gray-700 uppercase px-4 py-3">Enrollment</th>
                  <th className="text-left text-xs font-bold text-gray-700 uppercase px-4 py-3">Status</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100">
                {todayClasses.map(cls => {
                  const instructor = instructors.find(i => i.id === cls.instructorId);
                  const isFull = cls.enrolled >= cls.capacity;
                  return (
                    <tr key={cls.id} className="hover:bg-gray-50 transition">
                      <td className="px-4 py-3 text-sm font-medium text-gray-900">{cls.time}</td>
                      <td className="px-4 py-3">
                        <Link to={`/classes/${cls.id}`} className="text-sm font-medium text-teal-700 hover:text-teal-900 underline">
                          {cls.name}
                        </Link>
                      </td>
                      <td className="px-4 py-3 text-sm text-gray-700">{instructor?.name || '—'}</td>
                      <td className="px-4 py-3 text-sm text-gray-700">{cls.style}</td>
                      <td className="px-4 py-3 text-sm text-gray-700">{cls.enrolled}/{cls.capacity}</td>
                      <td className="px-4 py-3">
                        <span className={`text-xs font-medium px-2 py-1 rounded ${
                          isFull ? 'bg-red-100 text-red-700' : 'bg-green-100 text-green-700'
                        }`}>
                          {isFull ? 'Full' : 'Open'}
                        </span>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* Quick Links */}
      <div>
        <h2 className="text-xl font-bold text-gray-900 mb-4">Quick Access</h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          <Link
            to="/classes"
            className="bg-white border border-gray-200 rounded p-4 hover:shadow-md transition"
          >
            <h3 className="text-sm font-bold text-gray-900">Classes</h3>
            <p className="text-xs text-gray-600 mt-1">Browse and manage all dance classes and schedules.</p>
            <p className="text-xs text-teal-700 font-medium mt-3 underline">Go to Classes →</p>
          </Link>
          <Link
            to="/instructors"
            className="bg-white border border-gray-200 rounded p-4 hover:shadow-md transition"
          >
            <h3 className="text-sm font-bold text-gray-900">Instructors</h3>
            <p className="text-xs text-gray-600 mt-1">View instructor profiles and class assignments.</p>
            <p className="text-xs text-teal-700 font-medium mt-3 underline">Go to Instructors →</p>
          </Link>
          {isAdminOrInstructor && (
            <Link
              to="/students"
              className="bg-white border border-gray-200 rounded p-4 hover:shadow-md transition"
            >
              <h3 className="text-sm font-bold text-gray-900">Students</h3>
              <p className="text-xs text-gray-600 mt-1">Manage student records and attendance.</p>
              <p className="text-xs text-teal-700 font-medium mt-3 underline">Go to Students →</p>
            </Link>
          )}
        </div>
      </div>
    </div>
  );
}
