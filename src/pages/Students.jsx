import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { getStudents, addStudent, deleteStudent, getClasses } from '../data/store';
import Modal from '../components/Modal';
import { FormField, Input, Select } from '../components/FormField';

const LEVELS = ['Beginner', 'Intermediate', 'Advanced'];
const EMPTY_FORM = { name: '', email: '', phone: '', level: '', joinDate: new Date().toISOString().split('T')[0] };

export default function Students() {
  const { user } = useAuth();
  const [students, setStudents] = useState([]);
  const [classes, setClasses] = useState([]);
  const [search, setSearch] = useState('');
  const [filterLevel, setFilterLevel] = useState('');
  const [showModal, setShowModal] = useState(false);
  const [form, setForm] = useState(EMPTY_FORM);
  const [formError, setFormError] = useState('');
  const canManage = user?.role === 'admin' || user?.role === 'instructor';

  useEffect(() => {
    setStudents(getStudents());
    setClasses(getClasses());
  }, []);

  const filtered = students.filter(s => {
    const q = search.toLowerCase();
    const matchSearch = s.name.toLowerCase().includes(q) || s.email.toLowerCase().includes(q);
    const matchLevel = !filterLevel || s.level === filterLevel;
    return matchSearch && matchLevel;
  });

  const handleAdd = (e) => {
    e.preventDefault();
    if (!form.name || !form.email) {
      setFormError('Name and email are required.');
      return;
    }
    addStudent(form);
    setStudents(getStudents());
    setShowModal(false);
    setForm(EMPTY_FORM);
    setFormError('');
  };

  const handleDelete = (id) => {
    if (window.confirm('Remove this student?')) {
      deleteStudent(id);
      setStudents(getStudents());
    }
  };

  return (
    <div className="min-h-screen bg-black text-white">
      <div className="max-w-7xl mx-auto px-6 py-10">
        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-8">
          <div>
            <h1 className="text-3xl font-black tracking-tight">STUDENTS</h1>
            <p className="text-zinc-500 text-sm mt-1">{students.length} enrolled members</p>
          </div>
          {canManage && (
            <button
              onClick={() => { setShowModal(true); setForm(EMPTY_FORM); setFormError(''); }}
              className="bg-yellow-400 hover:bg-yellow-300 text-black font-black text-xs tracking-widest uppercase px-5 py-3 rounded-lg transition"
            >
              + Add Student
            </button>
          )}
        </div>

        {/* Filters */}
        <div className="flex flex-col sm:flex-row gap-3 mb-8">
          <input
            type="text"
            placeholder="Search students..."
            value={search}
            onChange={e => setSearch(e.target.value)}
            className="flex-1 bg-zinc-900 border border-zinc-700 text-white rounded-lg px-4 py-2.5 focus:outline-none focus:border-yellow-400 transition placeholder-zinc-600 text-sm"
          />
          <select
            value={filterLevel}
            onChange={e => setFilterLevel(e.target.value)}
            className="bg-zinc-900 border border-zinc-700 text-white rounded-lg px-4 py-2.5 focus:outline-none focus:border-yellow-400 transition text-sm"
          >
            <option value="">All Levels</option>
            {LEVELS.map(l => <option key={l}>{l}</option>)}
          </select>
        </div>

        {/* Stats bar */}
        <div className="grid grid-cols-3 gap-4 mb-8">
          {[
            { label: 'Total Students', value: students.length },
            { label: 'Avg Attendance', value: students.length ? `${Math.round(students.reduce((s, st) => s + st.attendance, 0) / students.length)}%` : '—' },
            { label: 'Total Enrollments', value: students.reduce((s, st) => s + (st.enrolledClasses?.length || 0), 0) },
          ].map(({ label, value }) => (
            <div key={label} className="bg-zinc-900 border border-zinc-800 rounded-xl p-4 text-center">
              <p className="text-white font-black text-2xl">{value}</p>
              <p className="text-zinc-500 text-xs mt-1">{label}</p>
            </div>
          ))}
        </div>

        {/* Table */}
        {filtered.length === 0 ? (
          <div className="text-center py-20">
            <p className="text-zinc-600 text-lg">No students found</p>
          </div>
        ) : (
          <div className="bg-zinc-900 border border-zinc-800 rounded-2xl overflow-hidden">
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="border-b border-zinc-800">
                    <th className="text-left text-zinc-500 text-xs font-bold tracking-widest uppercase px-6 py-4">Student</th>
                    <th className="text-left text-zinc-500 text-xs font-bold tracking-widest uppercase px-6 py-4 hidden sm:table-cell">Level</th>
                    <th className="text-left text-zinc-500 text-xs font-bold tracking-widest uppercase px-6 py-4 hidden md:table-cell">Classes</th>
                    <th className="text-left text-zinc-500 text-xs font-bold tracking-widest uppercase px-6 py-4 hidden lg:table-cell">Attendance</th>
                    <th className="text-left text-zinc-500 text-xs font-bold tracking-widest uppercase px-6 py-4 hidden lg:table-cell">Joined</th>
                    <th className="text-right text-zinc-500 text-xs font-bold tracking-widest uppercase px-6 py-4">Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {filtered.map((student, idx) => {
                    const enrolledNames = (student.enrolledClasses || [])
                      .map(cid => classes.find(c => c.id === cid)?.name)
                      .filter(Boolean);
                    return (
                      <tr key={student.id} className={`border-b border-zinc-800 last:border-0 hover:bg-zinc-800/50 transition ${idx % 2 === 0 ? '' : ''}`}>
                        <td className="px-6 py-4">
                          <div className="flex items-center gap-3">
                            <div className="w-8 h-8 bg-zinc-700 rounded-full flex items-center justify-center text-white font-bold text-xs shrink-0">
                              {student.name.charAt(0)}
                            </div>
                            <div>
                              <p className="text-white font-semibold text-sm">{student.name}</p>
                              <p className="text-zinc-500 text-xs">{student.email}</p>
                            </div>
                          </div>
                        </td>
                        <td className="px-6 py-4 hidden sm:table-cell">
                          <span className={`text-xs font-bold px-2.5 py-1 rounded-full ${
                            student.level === 'Advanced' ? 'bg-yellow-400/10 text-yellow-400' :
                            student.level === 'Intermediate' ? 'bg-blue-900/50 text-blue-400' :
                            'bg-zinc-800 text-zinc-400'
                          }`}>
                            {student.level}
                          </span>
                        </td>
                        <td className="px-6 py-4 hidden md:table-cell">
                          <div className="flex flex-wrap gap-1">
                            {enrolledNames.length === 0 ? (
                              <span className="text-zinc-600 text-xs">None</span>
                            ) : enrolledNames.slice(0, 2).map((name, i) => (
                              <span key={i} className="text-xs text-zinc-400 bg-zinc-800 px-2 py-0.5 rounded-full">{name}</span>
                            ))}
                            {enrolledNames.length > 2 && (
                              <span className="text-xs text-zinc-500">+{enrolledNames.length - 2}</span>
                            )}
                          </div>
                        </td>
                        <td className="px-6 py-4 hidden lg:table-cell">
                          <div className="flex items-center gap-2">
                            <div className="w-16 h-1.5 bg-zinc-800 rounded-full overflow-hidden">
                              <div
                                className={`h-full rounded-full ${student.attendance >= 90 ? 'bg-green-500' : student.attendance >= 75 ? 'bg-yellow-400' : 'bg-red-500'}`}
                                style={{ width: `${student.attendance}%` }}
                              />
                            </div>
                            <span className="text-xs text-zinc-400">{student.attendance}%</span>
                          </div>
                        </td>
                        <td className="px-6 py-4 hidden lg:table-cell">
                          <span className="text-zinc-500 text-xs">{student.joinDate}</span>
                        </td>
                        <td className="px-6 py-4 text-right">
                          <div className="flex items-center justify-end gap-2">
                            <Link
                              to={`/students/${student.id}`}
                              className="bg-zinc-800 hover:bg-zinc-700 text-white text-xs font-bold px-3 py-1.5 rounded-lg transition"
                            >
                              View
                            </Link>
                            {canManage && (
                              <button
                                onClick={() => handleDelete(student.id)}
                                className="bg-red-900/50 hover:bg-red-900 text-red-400 text-xs font-bold px-3 py-1.5 rounded-lg transition"
                              >
                                Remove
                              </button>
                            )}
                          </div>
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          </div>
        )}
      </div>

      {/* Add Student Modal */}
      <Modal isOpen={showModal} onClose={() => setShowModal(false)} title="Add New Student">
        <form onSubmit={handleAdd} className="space-y-4">
          {formError && <p className="text-red-400 text-sm bg-red-950/40 border border-red-800 px-3 py-2 rounded-lg">{formError}</p>}
          <FormField label="Full Name *">
            <Input placeholder="e.g. Emma Davis" value={form.name} onChange={e => setForm({ ...form, name: e.target.value })} />
          </FormField>
          <FormField label="Email *">
            <Input type="email" placeholder="student@email.com" value={form.email} onChange={e => setForm({ ...form, email: e.target.value })} />
          </FormField>
          <FormField label="Phone">
            <Input type="tel" placeholder="+1 234 567 8900" value={form.phone} onChange={e => setForm({ ...form, phone: e.target.value })} />
          </FormField>
          <div className="grid grid-cols-2 gap-3">
            <FormField label="Level">
              <Select value={form.level} onChange={e => setForm({ ...form, level: e.target.value })}>
                <option value="">Select level</option>
                {LEVELS.map(l => <option key={l}>{l}</option>)}
              </Select>
            </FormField>
            <FormField label="Join Date">
              <Input type="date" value={form.joinDate} onChange={e => setForm({ ...form, joinDate: e.target.value })} />
            </FormField>
          </div>
          <div className="flex gap-3 pt-2">
            <button type="button" onClick={() => setShowModal(false)} className="flex-1 bg-zinc-800 hover:bg-zinc-700 text-white font-bold py-2.5 rounded-lg transition text-sm">
              Cancel
            </button>
            <button type="submit" className="flex-1 bg-yellow-400 hover:bg-yellow-300 text-black font-black tracking-widest uppercase py-2.5 rounded-lg transition text-sm">
              Add Student
            </button>
          </div>
        </form>
      </Modal>
    </div>
  );
}
