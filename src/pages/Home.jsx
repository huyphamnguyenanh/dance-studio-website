import React, { useMemo } from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { getClasses, getInstructors, getStudents } from '../data/store';

function StatCard({ label, value, sub, accent }) {
  return (
    <div className="bg-zinc-900 border border-zinc-800 rounded-2xl p-6">
      <p className="text-zinc-500 text-xs font-bold tracking-widest uppercase mb-3">{label}</p>
      <p className={`text-4xl font-black ${accent || 'text-white'}`}>{value}</p>
      {sub && <p className="text-zinc-500 text-xs mt-2">{sub}</p>}
    </div>
  );
}

function QuickLink({ to, label, desc }) {
  return (
    <Link
      to={to}
      className="group bg-zinc-900 border border-zinc-800 hover:border-yellow-400/50 rounded-2xl p-6 transition block"
    >
      <h3 className="text-white font-bold text-sm tracking-widest uppercase mb-2 group-hover:text-yellow-400 transition">{label}</h3>
      <p className="text-zinc-500 text-xs leading-relaxed">{desc}</p>
      <span className="text-yellow-400 text-xs font-bold mt-4 block">View →</span>
    </Link>
  );
}

export default function Home() {
  const { user } = useAuth();

  const classes = useMemo(() => getClasses(), []);
  const instructors = useMemo(() => getInstructors(), []);
  const students = useMemo(() => getStudents(), []);

  const totalEnrolled = classes.reduce((sum, c) => sum + c.enrolled, 0);
  const avgAttendance = students.length
    ? Math.round(students.reduce((s, st) => s + st.attendance, 0) / students.length)
    : 0;

  const today = new Date().toLocaleDateString('en-US', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' });
  const days = ['Sunday','Monday','Tuesday','Wednesday','Thursday','Friday','Saturday'];
  const todayDay = days[new Date().getDay()];
  const todayClasses = classes.filter(c => c.day === todayDay);

  return (
    <div className="min-h-screen bg-black text-white">
      <div className="max-w-7xl mx-auto px-6 py-10">
        {/* Header */}
        <div className="mb-10">
          <p className="text-zinc-500 text-xs font-bold tracking-widest uppercase mb-2">{today}</p>
          <h1 className="text-4xl font-black tracking-tight">
            Welcome back, <span className="text-yellow-400">{user?.name?.split(' ')[0]}</span>
          </h1>
          <p className="text-zinc-500 mt-1 capitalize">{user?.role} · Dance Studio Management</p>
        </div>

        {/* Stats — admin/instructor only */}
        {(user?.role === 'admin' || user?.role === 'instructor') && (
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-10">
            <StatCard label="Total Classes" value={classes.length} sub="Active classes" />
            <StatCard label="Instructors" value={instructors.length} sub="Teaching staff" accent="text-yellow-400" />
            <StatCard label="Students" value={students.length} sub="Enrolled members" />
            <StatCard label="Avg Attendance" value={`${avgAttendance}%`} sub="This month" accent="text-green-400" />
          </div>
        )}

        {/* Today's classes */}
        <div className="mb-10">
          <div className="flex items-center justify-between mb-5">
            <h2 className="text-lg font-black tracking-wide uppercase">Today's Classes</h2>
            <Link to="/classes" className="text-yellow-400 text-xs font-bold tracking-widest hover:text-yellow-300 transition">
              View All →
            </Link>
          </div>
          {todayClasses.length === 0 ? (
            <div className="bg-zinc-900 border border-zinc-800 rounded-2xl p-8 text-center">
              <p className="text-zinc-500 text-sm">No classes scheduled for today</p>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {todayClasses.map(cls => {
                const instructor = instructors.find(i => i.id === cls.instructorId);
                const pct = Math.round((cls.enrolled / cls.capacity) * 100);
                return (
                  <Link
                    key={cls.id}
                    to={`/classes/${cls.id}`}
                    className="bg-zinc-900 border border-zinc-800 hover:border-zinc-600 rounded-2xl p-5 transition block group"
                  >
                    <div className="flex items-start justify-between mb-3">
                      <div>
                        <p className="text-white font-bold group-hover:text-yellow-400 transition">{cls.name}</p>
                        <p className="text-zinc-500 text-xs mt-0.5">{instructor?.name || 'TBD'}</p>
                      </div>
                      <span className="bg-zinc-800 text-zinc-400 text-xs px-2 py-1 rounded-full">{cls.time}</span>
                    </div>
                    <div className="flex items-center gap-3">
                      <div className="flex-1 h-1.5 bg-zinc-800 rounded-full overflow-hidden">
                        <div className="h-full bg-yellow-400 rounded-full" style={{ width: `${pct}%` }} />
                      </div>
                      <span className="text-zinc-500 text-xs">{cls.enrolled}/{cls.capacity}</span>
                    </div>
                    <div className="flex gap-2 mt-3">
                      <span className="text-xs text-zinc-600 bg-zinc-800 px-2 py-0.5 rounded-full">{cls.style}</span>
                      <span className="text-xs text-zinc-600 bg-zinc-800 px-2 py-0.5 rounded-full">{cls.level}</span>
                    </div>
                  </Link>
                );
              })}
            </div>
          )}
        </div>

        {/* Quick links */}
        <div className="mb-4">
          <h2 className="text-lg font-black tracking-wide uppercase mb-5">Quick Access</h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            <QuickLink to="/classes" label="Classes" desc="Browse and manage all dance classes, schedules, and enrollment." />
            <QuickLink to="/instructors" label="Instructors" desc="View instructor profiles, specialties, and class assignments." />
            {(user?.role === 'admin' || user?.role === 'instructor') && (
              <QuickLink to="/students" label="Students" desc="Manage student records, enrollment, and attendance tracking." />
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
