import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { getClasses, addClass, deleteClass, getInstructors } from '../data/store';
import Modal from '../components/Modal';
import { FormField, Input, Select, Textarea } from '../components/FormField';

const STYLES = ['Ballet', 'Contemporary', 'Hip-Hop', 'Jazz', 'Salsa', 'Tap', 'Ballroom'];
const LEVELS = ['Beginner', 'Intermediate', 'Advanced', 'All Levels'];
const DAYS = ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday'];
const EMPTY_FORM = { name: '', style: 'Ballet', level: 'Beginner', day: 'Monday', time: '09:00', duration: 60, capacity: 15, price: 20, instructorId: '', description: '' };

export default function Classes() {
  const { user } = useAuth();
  const [classes, setClasses] = useState([]);
  const [instructors, setInstructors] = useState([]);
  const [search, setSearch] = useState('');
  const [filterStyle, setFilterStyle] = useState('');
  const [filterLevel, setFilterLevel] = useState('');
  const [showModal, setShowModal] = useState(false);
  const [form, setForm] = useState(EMPTY_FORM);
  const [formError, setFormError] = useState('');
  const canManage = user?.role === 'admin';

  useEffect(() => {
    setClasses(getClasses());
    setInstructors(getInstructors());
  }, []);

  const filtered = classes.filter(c => {
    const q = search.toLowerCase();
    const matchSearch = c.name.toLowerCase().includes(q) || c.style.toLowerCase().includes(q);
    const matchStyle = !filterStyle || c.style === filterStyle;
    const matchLevel = !filterLevel || c.level === filterLevel;
    return matchSearch && matchStyle && matchLevel;
  });

  const handleAdd = (e) => {
    e.preventDefault();
    if (!form.name.trim()) { setFormError('Class name is required.'); return; }
    addClass({ ...form, capacity: Number(form.capacity), price: Number(form.price), duration: Number(form.duration) });
    setClasses(getClasses());
    setShowModal(false);
    setForm(EMPTY_FORM);
    setFormError('');
  };

  const handleDelete = (id) => {
    if (window.confirm('Delete this class?')) {
      deleteClass(id);
      setClasses(getClasses());
    }
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      {/* Header */}
      <div className="mb-6">
        <h1 className="text-3xl font-bold text-gray-900">Classes</h1>
        <p className="text-sm text-gray-600 mt-1">{filtered.length} of {classes.length} classes</p>
      </div>

      {/* Search and Filters */}
      <div className="bg-white border border-gray-200 rounded p-4 mb-6">
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          <div>
            <label className="block text-xs font-bold text-gray-700 uppercase mb-2">Search</label>
            <input
              type="text"
              placeholder="Search classes..."
              value={search}
              onChange={e => setSearch(e.target.value)}
              className="w-full border border-gray-300 rounded px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-teal-500 bg-white"
            />
          </div>
          <div>
            <label className="block text-xs font-bold text-gray-700 uppercase mb-2">By Style</label>
            <select
              value={filterStyle}
              onChange={e => setFilterStyle(e.target.value)}
              className="w-full border border-gray-300 rounded px-3 py-2 text-sm bg-white focus:outline-none focus:ring-2 focus:ring-teal-500"
            >
              <option value="">All Styles</option>
              {STYLES.map(s => <option key={s}>{s}</option>)}
            </select>
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
          <p className="text-gray-500 text-sm">No classes found</p>
        </div>
      ) : (
        <div className="bg-white border border-gray-200 rounded overflow-hidden">
          <table className="w-full">
            <thead className="bg-gray-50 border-b border-gray-200">
              <tr>
                <th className="text-left text-xs font-bold text-gray-700 uppercase px-4 py-3">Class Name</th>
                <th className="text-left text-xs font-bold text-gray-700 uppercase px-4 py-3">Style</th>
                <th className="text-left text-xs font-bold text-gray-700 uppercase px-4 py-3">Level</th>
                <th className="text-left text-xs font-bold text-gray-700 uppercase px-4 py-3">Schedule</th>
                <th className="text-left text-xs font-bold text-gray-700 uppercase px-4 py-3">Instructor</th>
                <th className="text-left text-xs font-bold text-gray-700 uppercase px-4 py-3">Enrollment</th>
                <th className="text-left text-xs font-bold text-gray-700 uppercase px-4 py-3">Status</th>
                <th className="text-right text-xs font-bold text-gray-700 uppercase px-4 py-3">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              {filtered.map(cls => {
                const instructor = instructors.find(i => i.id === cls.instructorId);
                const isFull = cls.enrolled >= cls.capacity;
                return (
                  <tr key={cls.id} className="hover:bg-gray-50 transition">
                    <td className="px-4 py-3">
                      <Link to={`/classes/${cls.id}`} className="text-sm font-medium text-teal-700 hover:text-teal-900 underline">
                        {cls.name}
                      </Link>
                    </td>
                    <td className="px-4 py-3 text-sm text-gray-700">{cls.style}</td>
                    <td className="px-4 py-3 text-sm text-gray-700">{cls.level}</td>
                    <td className="px-4 py-3 text-sm text-gray-700">{cls.day} {cls.time}</td>
                    <td className="px-4 py-3 text-sm text-gray-700">{instructor?.name || '—'}</td>
                    <td className="px-4 py-3 text-sm text-gray-700">{cls.enrolled}/{cls.capacity}</td>
                    <td className="px-4 py-3">
                      <span className={`text-xs font-medium px-2 py-1 rounded ${
                        isFull ? 'bg-red-100 text-red-700' : 'bg-green-100 text-green-700'
                      }`}>
                        {isFull ? 'Full' : 'Open'}
                      </span>
                    </td>
                    <td className="px-4 py-3 text-right">
                      <div className="flex items-center justify-end gap-2">
                        <Link
                          to={`/classes/${cls.id}`}
                          className="text-xs font-medium text-teal-700 hover:text-teal-900 underline"
                        >
                          View
                        </Link>
                        {canManage && (
                          <button
                            onClick={() => handleDelete(cls.id)}
                            className="text-xs font-medium text-red-600 hover:text-red-900 underline"
                          >
                            Delete
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
      )}

      {/* Add Button */}
      {canManage && (
        <div className="mt-6 flex justify-end">
          <button
            onClick={() => { setShowModal(true); setForm(EMPTY_FORM); setFormError(''); }}
            className="bg-teal-700 hover:bg-teal-800 text-white text-sm font-semibold px-4 py-2 rounded transition"
          >
            + Add Class
          </button>
        </div>
      )}

      {/* Add Class Modal */}
      <Modal isOpen={showModal} onClose={() => setShowModal(false)} title="Add New Class">
        <form onSubmit={handleAdd} className="space-y-4">
          {formError && <p className="text-red-600 text-sm bg-red-50 border border-red-200 px-3 py-2 rounded">{formError}</p>}
          <FormField label="Class Name *">
            <Input placeholder="e.g. Ballet Fundamentals" value={form.name} onChange={e => setForm({ ...form, name: e.target.value })} />
          </FormField>
          <div className="grid grid-cols-2 gap-3">
            <FormField label="Style">
              <Select value={form.style} onChange={e => setForm({ ...form, style: e.target.value })}>
                {STYLES.map(s => <option key={s}>{s}</option>)}
              </Select>
            </FormField>
            <FormField label="Level">
              <Select value={form.level} onChange={e => setForm({ ...form, level: e.target.value })}>
                {LEVELS.map(l => <option key={l}>{l}</option>)}
              </Select>
            </FormField>
          </div>
          <div className="grid grid-cols-2 gap-3">
            <FormField label="Day">
              <Select value={form.day} onChange={e => setForm({ ...form, day: e.target.value })}>
                {DAYS.map(d => <option key={d}>{d}</option>)}
              </Select>
            </FormField>
            <FormField label="Time">
              <Input type="time" value={form.time} onChange={e => setForm({ ...form, time: e.target.value })} />
            </FormField>
          </div>
          <div className="grid grid-cols-3 gap-3">
            <FormField label="Duration (min)">
              <Input type="number" min="30" max="180" value={form.duration} onChange={e => setForm({ ...form, duration: Number(e.target.value) })} />
            </FormField>
            <FormField label="Capacity">
              <Input type="number" min="1" max="50" value={form.capacity} onChange={e => setForm({ ...form, capacity: Number(e.target.value) })} />
            </FormField>
            <FormField label="Price ($)">
              <Input type="number" min="0" value={form.price} onChange={e => setForm({ ...form, price: Number(e.target.value) })} />
            </FormField>
          </div>
          <FormField label="Instructor">
            <Select value={form.instructorId} onChange={e => setForm({ ...form, instructorId: e.target.value })}>
              <option value="">Select instructor</option>
              {instructors.map(i => <option key={i.id} value={i.id}>{i.name}</option>)}
            </Select>
          </FormField>
          <FormField label="Description">
            <Textarea placeholder="Brief class description..." value={form.description} onChange={e => setForm({ ...form, description: e.target.value })} rows={2} />
          </FormField>
          <div className="flex gap-3 pt-1">
            <button type="button" onClick={() => setShowModal(false)} className="flex-1 border border-gray-300 text-gray-700 font-medium py-2 rounded text-sm hover:bg-gray-50 transition">
              Cancel
            </button>
            <button type="submit" className="flex-1 bg-teal-700 hover:bg-teal-800 text-white font-semibold py-2 rounded text-sm transition">
              Add Class
            </button>
          </div>
        </form>
      </Modal>
    </div>
  );
}
