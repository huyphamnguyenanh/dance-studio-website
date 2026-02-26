import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { getStudents, addStudent, deleteStudent, getClasses } from '../data/store';
import Modal from '../components/Modal';
import FilterPanel from '../components/FilterPanel';
import { FormField, Input, Select } from '../components/FormField';

const LEVELS = ['Beginner', 'Intermediate', 'Advanced'];
const EMPTY_FORM = { name: '', email: '', phone: '', level: 'Beginner', joinDate: new Date().toISOString().split('T')[0] };

export default function Students() {
  const { user } = useAuth();
  const [students, setStudents] = useState([]);
  const [classes, setClasses] = useState([]);
  const [search, setSearch] = useState('');
  const [filterLevel, setFilterLevel] = useState('');
  const [showModal, setShowModal] = useState(false);
  const [form, setForm] = useState(EMPTY_FORM);
  const [formError, setFormError] = useState('');
  const [selectedStudents, setSelectedStudents] = useState(new Set());
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

  const toggleSelectStudent = (id) => {
    const newSelected = new Set(selectedStudents);
    if (newSelected.has(id)) {
      newSelected.delete(id);
    } else {
      newSelected.add(id);
    }
    setSelectedStudents(newSelected);
  };

  const toggleSelectAll = () => {
    if (selectedStudents.size === filtered.length) {
      setSelectedStudents(new Set());
    } else {
      setSelectedStudents(new Set(filtered.map(s => s.id)));
    }
  };

  const filterGroups = [
    {
      title: 'By Level',
      key: 'level',
      icon: '📊',
      options: LEVELS.map(l => ({ label: l, value: l }))
    }
  ];

  return (
    <div className="flex h-full">
      {/* Main Content */}
      <div className="flex-1 flex flex-col">
        {/* Header */}
        <div className="bg-white border-b border-gray-200 px-6 py-6">
          <h1 className="text-2xl font-bold text-gray-900 mb-1">Select student to change</h1>
          <p className="text-sm text-gray-500">{filtered.length} of {students.length} students</p>
        </div>

        {/* Search and Action Bar */}
        <div className="bg-white border-b border-gray-200 px-6 py-4 flex items-center gap-4">
          <input
            type="text"
            placeholder="Start typing to filter..."
            value={search}
            onChange={e => setSearch(e.target.value)}
            className="flex-1 max-w-xs border border-gray-300 rounded px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-teal-500 bg-white"
          />
          <select
            value=""
            onChange={(e) => {}}
            className="border border-gray-300 rounded px-3 py-2 text-sm bg-white text-gray-700 focus:outline-none focus:ring-2 focus:ring-teal-500"
          >
            <option value="">---------</option>
          </select>
          <button className="border border-gray-300 rounded px-4 py-2 text-sm font-medium text-gray-700 hover:bg-gray-50 transition">
            Run
          </button>
          <span className="text-sm text-gray-500 ml-auto">{selectedStudents.size} of {filtered.length} selected</span>
        </div>

        {/* Table */}
        <div className="flex-1 overflow-auto px-6 py-6">
          {filtered.length === 0 ? (
            <div className="bg-white border border-gray-200 rounded p-12 text-center">
              <p className="text-gray-400 text-sm">No students found</p>
            </div>
          ) : (
            <div className="bg-white border border-gray-200 rounded-lg overflow-hidden">
              <table className="w-full">
                <thead className="bg-gray-50 border-b border-gray-200">
                  <tr>
                    <th className="w-12 px-4 py-3">
                      <input
                        type="checkbox"
                        checked={selectedStudents.size === filtered.length && filtered.length > 0}
                        onChange={toggleSelectAll}
                        className="w-4 h-4 text-teal-600 rounded cursor-pointer"
                      />
                    </th>
                    <th className="text-left text-xs font-bold text-gray-700 uppercase tracking-wide px-4 py-3">Student</th>
                    <th className="text-left text-xs font-bold text-gray-700 uppercase tracking-wide px-4 py-3">Email</th>
                    <th className="text-left text-xs font-bold text-gray-700 uppercase tracking-wide px-4 py-3">Level</th>
                    <th className="text-left text-xs font-bold text-gray-700 uppercase tracking-wide px-4 py-3">Join Date</th>
                    <th className="text-right text-xs font-bold text-gray-700 uppercase tracking-wide px-4 py-3">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-100">
                  {filtered.map(student => (
                    <tr key={student.id} className="hover:bg-gray-50 transition">
                      <td className="px-4 py-3">
                        <input
                          type="checkbox"
                          checked={selectedStudents.has(student.id)}
                          onChange={() => toggleSelectStudent(student.id)}
                          className="w-4 h-4 text-teal-600 rounded cursor-pointer"
                        />
                      </td>
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
                            Change
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
        </div>

        {/* Add Button - Bottom Right */}
        {canManage && (
          <div className="absolute bottom-6 right-6">
            <button
              onClick={() => { setShowModal(true); setForm(EMPTY_FORM); setFormError(''); }}
              className="bg-gray-600 hover:bg-gray-700 text-white text-sm font-semibold px-4 py-2 rounded-lg transition shadow-lg"
            >
              + ADD STUDENT
            </button>
          </div>
        )}
      </div>

      {/* Filter Panel */}
      <FilterPanel
        title="Filter"
        filters={filterGroups}
        activeFilters={{
          level: filterLevel ? [filterLevel] : []
        }}
        onFilterChange={(key, values) => {
          if (key === 'level') setFilterLevel(values[0] || '');
        }}
      />

      {/* Add Student Modal */}
      <Modal isOpen={showModal} onClose={() => setShowModal(false)} title="Add New Student">
        <form onSubmit={handleAdd} className="space-y-4">
          {formError && <p className="text-red-600 text-sm bg-red-50 border border-red-200 px-3 py-2 rounded-lg">{formError}</p>}
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
            <button type="button" onClick={() => setShowModal(false)} className="flex-1 border border-gray-300 text-gray-700 font-medium py-2.5 rounded-lg text-sm hover:bg-gray-50 transition">
              Cancel
            </button>
            <button type="submit" className="flex-1 bg-gray-900 hover:bg-gray-800 text-white font-semibold py-2.5 rounded-lg text-sm transition">
              Add Student
            </button>
          </div>
        </form>
      </Modal>
    </div>
  );
}
