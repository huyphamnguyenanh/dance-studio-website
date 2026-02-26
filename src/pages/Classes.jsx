import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { getClasses, addClass, deleteClass, getInstructors } from '../data/store';
import Modal from '../components/Modal';
import FilterPanel from '../components/FilterPanel';
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
  const [filterDay, setFilterDay] = useState('');
  const [showModal, setShowModal] = useState(false);
  const [form, setForm] = useState(EMPTY_FORM);
  const [formError, setFormError] = useState('');
  const [selectedClasses, setSelectedClasses] = useState(new Set());
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
    const matchDay = !filterDay || c.day === filterDay;
    return matchSearch && matchStyle && matchLevel && matchDay;
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

  const toggleSelectClass = (id) => {
    const newSelected = new Set(selectedClasses);
    if (newSelected.has(id)) {
      newSelected.delete(id);
    } else {
      newSelected.add(id);
    }
    setSelectedClasses(newSelected);
  };

  const toggleSelectAll = () => {
    if (selectedClasses.size === filtered.length) {
      setSelectedClasses(new Set());
    } else {
      setSelectedClasses(new Set(filtered.map(c => c.id)));
    }
  };

  const filterGroups = [
    {
      title: 'By Level',
      key: 'level',
      icon: '↓',
      options: LEVELS.map(l => ({ label: l, value: l }))
    },
    {
      title: 'By Day',
      key: 'day',
      icon: '📅',
      options: DAYS.map(d => ({ label: d, value: d }))
    },
    {
      title: 'By Style',
      key: 'style',
      icon: '🎭',
      options: STYLES.map(s => ({ label: s, value: s }))
    }
  ];

  return (
    <div className="flex h-full">
      {/* Main Content */}
      <div className="flex-1 flex flex-col">
        {/* Header */}
        <div className="bg-white border-b border-gray-200 px-6 py-6">
          <h1 className="text-2xl font-bold text-gray-900 mb-1">Select class session to change</h1>
          <p className="text-sm text-gray-500">{filtered.length} of {classes.length} classes</p>
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
          <span className="text-sm text-gray-500 ml-auto">{selectedClasses.size} of {filtered.length} selected</span>
        </div>

        {/* Table */}
        <div className="flex-1 overflow-auto px-6 py-6">
          {filtered.length === 0 ? (
            <div className="bg-white border border-gray-200 rounded p-12 text-center">
              <p className="text-gray-400 text-sm">No classes found</p>
            </div>
          ) : (
            <div className="bg-white border border-gray-200 rounded-lg overflow-hidden">
              <table className="w-full">
                <thead className="bg-gray-50 border-b border-gray-200">
                  <tr>
                    <th className="w-12 px-4 py-3">
                      <input
                        type="checkbox"
                        checked={selectedClasses.size === filtered.length && filtered.length > 0}
                        onChange={toggleSelectAll}
                        className="w-4 h-4 text-teal-600 rounded cursor-pointer"
                      />
                    </th>
                    <th className="text-left text-xs font-bold text-gray-700 uppercase tracking-wide px-4 py-3">Class Name</th>
                    <th className="text-left text-xs font-bold text-gray-700 uppercase tracking-wide px-4 py-3">Style</th>
                    <th className="text-left text-xs font-bold text-gray-700 uppercase tracking-wide px-4 py-3">Level</th>
                    <th className="text-left text-xs font-bold text-gray-700 uppercase tracking-wide px-4 py-3">Schedule</th>
                    <th className="text-left text-xs font-bold text-gray-700 uppercase tracking-wide px-4 py-3">Instructor</th>
                    <th className="text-left text-xs font-bold text-gray-700 uppercase tracking-wide px-4 py-3">Enrollment</th>
                    <th className="text-right text-xs font-bold text-gray-700 uppercase tracking-wide px-4 py-3">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-100">
                  {filtered.map(cls => {
                    const instructor = instructors.find(i => i.id === cls.instructorId);
                    const isFull = cls.enrolled >= cls.capacity;
                    return (
                      <tr key={cls.id} className="hover:bg-gray-50 transition">
                        <td className="px-4 py-3">
                          <input
                            type="checkbox"
                            checked={selectedClasses.has(cls.id)}
                            onChange={() => toggleSelectClass(cls.id)}
                            className="w-4 h-4 text-teal-600 rounded cursor-pointer"
                          />
                        </td>
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
                        <td className="px-4 py-3 text-right">
                          <div className="flex items-center justify-end gap-2">
                            <Link
                              to={`/classes/${cls.id}`}
                              className="text-xs font-medium text-teal-700 hover:text-teal-900 underline"
                            >
                              Change
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
        </div>

        {/* Add Button - Bottom Right */}
        {canManage && (
          <div className="absolute bottom-6 right-6">
            <button
              onClick={() => { setShowModal(true); setForm(EMPTY_FORM); setFormError(''); }}
              className="bg-gray-600 hover:bg-gray-700 text-white text-sm font-semibold px-4 py-2 rounded-lg transition shadow-lg"
            >
              + ADD CLASS SESSION
            </button>
          </div>
        )}
      </div>

      {/* Filter Panel */}
      <FilterPanel
        title="Filter"
        filters={filterGroups}
        activeFilters={{
          level: filterLevel ? [filterLevel] : [],
          day: filterDay ? [filterDay] : [],
          style: filterStyle ? [filterStyle] : []
        }}
        onFilterChange={(key, values) => {
          if (key === 'level') setFilterLevel(values[0] || '');
          if (key === 'day') setFilterDay(values[0] || '');
          if (key === 'style') setFilterStyle(values[0] || '');
        }}
      />

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
