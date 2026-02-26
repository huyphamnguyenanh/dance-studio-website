import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { getStudents, addStudent, deleteStudent } from '../data/store';
import Modal from '../components/Modal';
import { FormField, Input, Select } from '../components/FormField';

const LEVELS = ['Beginner', 'Intermediate', 'Advanced'];
const EMPTY_FORM = { name: '', email: '', phone: '', level: 'Beginner', joinDate: new Date().toISOString().split('T')[0] };

export default function Students() {
  const { user } = useAuth();
  const [students, setStudents] = useState([]);
  const [search, setSearch] = useState('');
  const [filterLevel, setFilterLevel] = useState('');
  const [showModal, setShowModal] = useState(false);
  const [form, setForm] = useState(EMPTY_FORM);
  const [formError, setFormError] = useState('');
  const canManage = user?.role === 'admin' || user?.role === 'instructor';

  useEffect(() => {
    setStudents(getStudents());
  }, []);

  const filtered = students.filter(s => {
    const q = search.toLowerCase();
    const matchSearch = s.name.toLowerCase().includes(q) || s.email.toLowerCase().includes(q);
    const matchLevel = !filterLevel || s.level === filterLevel;
    return matchSearch && matchLevel;
  });

  const handleAdd = (e) => {
    e.preventDefault();
    if (!form.name.trim() || !form.email.trim()) {
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
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      {/* Header */}
      <div className="mb-6">
        <h1 className="text-3xl font-bold text-gray-900">Students</h1>
        <p className="text-sm text-gray-600 mt-1">{filtered.length} of {students.length} students</p>
      </div>

      {/* Search and Filters */}
      <div className="bg-white border border-gray-200 rounded p-4 mb-6">
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div>
            <label className="block text-xs font-bold text-gray-700 uppercase mb-2">Search</label>
            <input
              type="text"
              placeholder="Search students..."
              value={search}
              onChange={e => setSearch(e.target.value)}
              className="w-full border border-gray-300 rounded px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-teal-500 bg-white"
            />
          </div>
          <div>
            <label className="block text-xs font-bold text-gray-700 uppercase mb-2">By Level</label>
            <select
              value={filterLevel}
              onChange={e => setFilterLevel(e.target.value)}
              className="w-full border border-gray-300 rounded px-3 py-2 text-sm bg-white focus:outline-none focus:ring-2 focus:ring-teal-500"
            >
              <option value="">All Levels</option>
              {LEVELS.map(l => <option key={l}>{l}</option>)}
            </select>
          </div>
        </div>
      </div>

      {/* Table */}
      {filtered.length === 0 ? (
        <div className="bg-white border border-gray-200 rounded p-8 text-center">
          <p className="text-gray-500 text-sm">No students found</p>
        </div>
      ) : (
        <div className="bg-white border border-gray-200 rounded overflow-hidden">
          <table className="w-full">
            <thead className="bg-gray-50 border-b border-gray-200">
              <tr>
                <th className="text-left text-xs font-bold text-gray-700 uppercase px-4 py-3">Name</th>
                <th className="text-left text-xs font-bold text-gray-700 uppercase px-4 py-3">Email</th>
                <th className="text-left text-xs font-bold text-gray-700 uppercase px-4 py-3">Level</th>
                <th className="text-left text-xs font-bold text-gray-700 uppercase px-4 py-3">Join Date</th>
                <th className="text-right text-xs font-bold text-gray-700 uppercase px-4 py-3">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              {filtered.map(student => (
                <tr key={student.id} className="hover:bg-gray-50 transition">
                  <td className="px-4 py-3">
                    <Link to={`/students/${student.id}`} className="text-sm font-medium text-teal-700 hover:text-teal-900 underline">
                      {student.name}
                    </Link>
                  </td>
                  <td className="px-4 py-3 text-sm text-gray-700">{student.email}</td>
                  <td className="px-4 py-3 text-sm text-gray-700">{student.level}</td>
                  <td className="px-4 py-3 text-sm text-gray-700">{new Date(student.joinDate).toLocaleDateString()}</td>
                  <td className="px-4 py-3 text-right">
                    <div className="flex items-center justify-end gap-2">
                      <Link
                        to={`/students/${student.id}`}
                        className="text-xs font-medium text-teal-700 hover:text-teal-900 underline"
                      >
                        View
                      </Link>
                      {canManage && (
                        <button
                          onClick={() => handleDelete(student.id)}
                          className="text-xs font-medium text-red-600 hover:text-red-900 underline"
                        >
                          Delete
                        </button>
                      )}
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {/* Add Button */}
      {canManage && (
        <div className="mt-6 flex justify-end">
          <button
            onClick={() => { setShowModal(true); setForm(EMPTY_FORM); setFormError(''); }}
            className="bg-teal-700 hover:bg-teal-800 text-white text-sm font-semibold px-4 py-2 rounded transition"
          >
            + Add Student
          </button>
        </div>
      )}

      {/* Add Student Modal */}
      <Modal isOpen={showModal} onClose={() => setShowModal(false)} title="Add New Student">
        <form onSubmit={handleAdd} className="space-y-4">
          {formError && <p className="text-red-600 text-sm bg-red-50 border border-red-200 px-3 py-2 rounded">{formError}</p>}
          <FormField label="Full Name *">
            <Input placeholder="e.g. John Doe" value={form.name} onChange={e => setForm({ ...form, name: e.target.value })} />
          </FormField>
          <FormField label="Email *">
            <Input type="email" placeholder="student@example.com" value={form.email} onChange={e => setForm({ ...form, email: e.target.value })} />
          </FormField>
          <FormField label="Phone">
            <Input type="tel" placeholder="+1 234 567 8900" value={form.phone} onChange={e => setForm({ ...form, phone: e.target.value })} />
          </FormField>
          <div className="grid grid-cols-2 gap-3">
            <FormField label="Level">
              <Select value={form.level} onChange={e => setForm({ ...form, level: e.target.value })}>
                {LEVELS.map(l => <option key={l}>{l}</option>)}
              </Select>
            </FormField>
            <FormField label="Join Date">
              <Input type="date" value={form.joinDate} onChange={e => setForm({ ...form, joinDate: e.target.value })} />
            </FormField>
          </div>
          <div className="flex gap-3 pt-1">
            <button type="button" onClick={() => setShowModal(false)} className="flex-1 border border-gray-300 text-gray-700 font-medium py-2 rounded text-sm hover:bg-gray-50 transition">
              Cancel
            </button>
            <button type="submit" className="flex-1 bg-teal-700 hover:bg-teal-800 text-white font-semibold py-2 rounded text-sm transition">
              Add Student
            </button>
          </div>
        </form>
      </Modal>
    </div>
  );
}
