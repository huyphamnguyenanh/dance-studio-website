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
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">

        {/* Page header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900">
            Site administration
          </h1>
          <p className="text-gray-500 text-sm mt-2">Welcome, {user?.name}. {user?.role === 'admin' ? 'You have access to all administrative functions.' : 'You have limited access based on your role.'}</p>
        </div>

        {/* Two column layout */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Left column - Navigation & Stats */}
          <div className="lg:col-span-2 space-y-6">
            {/* Stats */}
            {isAdminOrInstructor && (
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                <StatCard label="Classes" value={classes.length} sub="Active" />
                <StatCard label="Instructors" value={instructors.length} sub="Teaching staff" />
                <StatCard label="Students" value={students.length} sub="Enrolled" />
                <StatCard label="Avg Attendance" value={`${avgAttendance}%`} sub="This month" color="text-green-600" />
              </div>
            )}

            {/* Today's schedule */}
            <div>
              <div className="flex items-center justify-between mb-4">
                <h2 className="text-lg font-semibold text-gray-900">Today's Schedule ({todayDay})</h2>
                <Link to="/classes" className="text-sm text-teal-700 hover:text-teal-900 font-medium underline">
                  View all →
                </Link>
              </div>

              {todayClasses.length === 0 ? (
                <div className="bg-white border border-gray-200 rounded-lg p-8 text-center">
                  <p className="text-gray-400 text-sm">No classes scheduled for today</p>
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
                            <p className="text-sm font-semibold text-teal-700 underline">{cls.name}</p>
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
          </div>

          {/* Right column - Recent Actions */}
          <div className="bg-white border border-gray-200 rounded-lg p-6">
            <h2 className="text-lg font-semibold text-gray-900 mb-4">My actions</h2>
            <div className="space-y-3 text-sm">
              {classes.slice(0, 3).map(cls => (
                <Link
                  key={cls.id}
                  to={`/classes/${cls.id}`}
                  className="flex items-start gap-2 text-teal-700 hover:text-teal-900 transition"
                >
                  <span className="text-green-600 font-bold">+</span>
                  <div>
                    <p className="underline">{cls.name}</p>
                    <p className="text-xs text-gray-500">Class</p>
                  </div>
                </Link>
              ))}
              {instructors.slice(0, 2).map(instr => (
                <Link
                  key={instr.id}
                  to={`/instructors/${instr.id}`}
                  className="flex items-start gap-2 text-teal-700 hover:text-teal-900 transition"
                >
                  <span className="text-green-600 font-bold">+</span>
                  <div>
                    <p className="underline">{instr.name}</p>
                    <p className="text-xs text-gray-500">Instructor</p>
                  </div>
                </Link>
              ))}
            </div>
          </div>
        </div>

      </div>
    </div>
  );
}
