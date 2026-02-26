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
    return matchSearch && matchStyle;
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
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-8">

        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6">
          <div>
            <h1 className="text-2xl font-bold text-gray-900">Classes</h1>
            <p className="text-sm text-gray-500 mt-0.5">{classes.length} classes available</p>
          </div>
          {canManage && (
            <button
              onClick={() => { setShowModal(true); setForm(EMPTY_FORM); setFormError(''); }}
              className="bg-gray-900 hover:bg-gray-800 text-white text-sm font-semibold px-4 py-2 rounded-lg transition"
            >
              + Add Class
            </button>
          )}
        </div>

        {/* Filters */}
        <div className="flex flex-col sm:flex-row gap-3 mb-6">
          <input
            type="text"
            placeholder="Search classes..."
            value={search}
            onChange={e => setSearch(e.target.value)}
            className="flex-1 border border-gray-300 rounded-lg px-3 py-2 text-sm text-gray-900 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-gray-900 bg-white"
          />
          <select
            value={filterStyle}
            onChange={e => setFilterStyle(e.target.value)}
            className="border border-gray-300 rounded-lg px-3 py-2 text-sm text-gray-900 focus:outline-none focus:ring-2 focus:ring-gray-900 bg-white"
          >
            <option value="">All Styles</option>
            {STYLES.map(s => <option key={s}>{s}</option>)}
          </select>
        </div>

        {/* Table */}
        {filtered.length === 0 ? (
          <div className="bg-white border border-gray-200 rounded-lg p-12 text-center">
            <p className="text-gray-400 text-sm">No classes found</p>
          </div>
        ) : (
          <div className="bg-white border border-gray-200 rounded-lg overflow-hidden">
            <table className="w-full">
              <thead className="bg-gray-50 border-b border-gray-200">
                <tr>
                  <th className="text-left text-xs font-medium text-gray-500 uppercase tracking-wide px-5 py-3">Class</th>
                  <th className="text-left text-xs font-medium text-gray-500 uppercase tracking-wide px-5 py-3 hidden sm:table-cell">Schedule</th>
                  <th className="text-left text-xs font-medium text-gray-500 uppercase tracking-wide px-5 py-3 hidden md:table-cell">Instructor</th>
                  <th className="text-left text-xs font-medium text-gray-500 uppercase tracking-wide px-5 py-3 hidden lg:table-cell">Enrollment</th>
                  <th className="text-left text-xs font-medium text-gray-500 uppercase tracking-wide px-5 py-3 hidden lg:table-cell">Status</th>
                  <th className="text-right text-xs font-medium text-gray-500 uppercase tracking-wide px-5 py-3">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100">
                {filtered.map(cls => {
                  const instructor = instructors.find(i => i.id === cls.instructorId);
                  const isFull = cls.enrolled >= cls.capacity;
                  return (
                    <tr key={cls.id} className="hover:bg-gray-50 transition">
                      <td className="px-5 py-4">
                        <p className="text-sm font-semibold text-gray-900">{cls.name}</p>
                        <p className="text-xs text-gray-500 mt-0.5">{cls.style} · {cls.level}</p>
                      </td>
                      <td className="px-5 py-4 hidden sm:table-cell">
                        <p className="text-sm text-gray-700">{cls.day}</p>
                        <p className="text-xs text-gray-500">{cls.time} · {cls.duration} min</p>
                      </td>
                      <td className="px-5 py-4 hidden md:table-cell">
                        <p className="text-sm text-gray-700">{instructor?.name || '—'}</p>
                      </td>
                      <td className="px-5 py-4 hidden lg:table-cell">
                        <p className="text-sm text-gray-700">{cls.enrolled}/{cls.capacity}</p>
                        <div className="w-20 h-1.5 bg-gray-200 rounded-full mt-1 overflow-hidden">
                          <div
                            className={`h-full rounded-full ${isFull ? 'bg-red-500' : 'bg-green-500'}`}
                            style={{ width: `${Math.round((cls.enrolled / cls.capacity) * 100)}%` }}
                          />
                        </div>
                      </td>
                      <td className="px-5 py-4 hidden lg:table-cell">
                        <span className={`text-xs font-medium px-2 py-0.5 rounded-full ${
                          isFull ? 'bg-red-100 text-red-700' : 'bg-green-100 text-green-700'
                        }`}>
                          {isFull ? 'Full' : 'Open'}
                        </span>
                      </td>
                      <td className="px-5 py-4 text-right">
                        <div className="flex items-center justify-end gap-2">
                          <Link
                            to={`/classes/${cls.id}`}
                            className="text-xs font-medium text-blue-600 hover:text-blue-700 px-3 py-1.5 rounded-md hover:bg-blue-50 transition"
                          >
                            View
                          </Link>
                          {canManage && (
                            <button
                              onClick={() => handleDelete(cls.id)}
                              className="text-xs font-medium text-red-600 hover:text-red-700 px-3 py-1.5 rounded-md hover:bg-red-50 transition"
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
      </div>

      {/* Add Class Modal */}
      <Modal isOpen={showModal} onClose={() => setShowModal(false)} title="Add New Class">
        <form onSubmit={handleAdd} className="space-y-4">
          {formError && <p className="text-red-600 text-sm bg-red-50 border border-red-200 px-3 py-2 rounded-lg">{formError}</p>}
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
            <button type="button" onClick={() => setShowModal(false)} className="flex-1 border border-gray-300 text-gray-700 font-medium py-2.5 rounded-lg text-sm hover:bg-gray-50 transition">
              Cancel
            </button>
            <button type="submit" className="flex-1 bg-gray-900 hover:bg-gray-800 text-white font-semibold py-2.5 rounded-lg text-sm transition">
              Add Class
            </button>
          </div>
        </form>
      </Modal>
    </div>
  );
}
