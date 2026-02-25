import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { getClasses, addClass, deleteClass, getInstructors } from '../data/store';
import Modal from '../components/Modal';
import { FormField, Input, Select, Textarea } from '../components/FormField';

const STYLES = ['Ballet', 'Contemporary', 'Hip-Hop', 'Jazz', 'Salsa', 'Tap', 'Ballroom', 'Other'];
const LEVELS = ['Beginner', 'Intermediate', 'Advanced', 'All Levels'];
const DAYS = ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday'];

const EMPTY_FORM = { name: '', instructorId: '', style: '', level: '', day: '', time: '', duration: 60, capacity: 20, price: 20, description: '' };

export default function Classes() {
  const { user } = useAuth();
  const [classes, setClasses] = useState([]);
  const [instructors, setInstructors] = useState([]);
  const [search, setSearch] = useState('');
  const [filterStyle, setFilterStyle] = useState('');
  const [showModal, setShowModal] = useState(false);
  const [form, setForm] = useState(EMPTY_FORM);
  const [formError, setFormError] = useState('');
  const canManage = user?.role === 'admin' || user?.role === 'instructor';

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
    if (!form.name || !form.style || !form.level || !form.day || !form.time) {
      setFormError('Please fill in all required fields.');
      return;
    }
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
    <div className="min-h-screen bg-black text-white">
      <div className="max-w-7xl mx-auto px-6 py-10">
        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-8">
          <div>
            <h1 className="text-3xl font-black tracking-tight">CLASSES</h1>
            <p className="text-zinc-500 text-sm mt-1">{classes.length} classes available</p>
          </div>
          {canManage && (
            <button
              onClick={() => { setShowModal(true); setForm(EMPTY_FORM); setFormError(''); }}
              className="bg-yellow-400 hover:bg-yellow-300 text-black font-black text-xs tracking-widest uppercase px-5 py-3 rounded-lg transition"
            >
              + Add Class
            </button>
          )}
        </div>

        {/* Filters */}
        <div className="flex flex-col sm:flex-row gap-3 mb-8">
          <input
            type="text"
            placeholder="Search classes..."
            value={search}
            onChange={e => setSearch(e.target.value)}
            className="flex-1 bg-zinc-900 border border-zinc-700 text-white rounded-lg px-4 py-2.5 focus:outline-none focus:border-yellow-400 transition placeholder-zinc-600 text-sm"
          />
          <select
            value={filterStyle}
            onChange={e => setFilterStyle(e.target.value)}
            className="bg-zinc-900 border border-zinc-700 text-white rounded-lg px-4 py-2.5 focus:outline-none focus:border-yellow-400 transition text-sm"
          >
            <option value="">All Styles</option>
            {STYLES.map(s => <option key={s}>{s}</option>)}
          </select>
        </div>

        {/* Classes grid */}
        {filtered.length === 0 ? (
          <div className="text-center py-20">
            <p className="text-zinc-600 text-lg">No classes found</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
            {filtered.map(cls => {
              const instructor = instructors.find(i => i.id === cls.instructorId);
              const pct = Math.round((cls.enrolled / cls.capacity) * 100);
              const isFull = cls.enrolled >= cls.capacity;
              return (
                <div key={cls.id} className="bg-zinc-900 border border-zinc-800 rounded-2xl overflow-hidden group hover:border-zinc-600 transition">
                  {/* Top bar */}
                  <div className="h-1 bg-yellow-400" />
                  <div className="p-6">
                    <div className="flex items-start justify-between mb-4">
                      <div className="flex-1 min-w-0">
                        <h3 className="text-white font-bold text-base leading-tight truncate">{cls.name}</h3>
                        <p className="text-zinc-500 text-xs mt-1">{instructor?.name || 'Instructor TBD'}</p>
                      </div>
                      <span className={`ml-2 shrink-0 text-xs font-bold px-2.5 py-1 rounded-full ${isFull ? 'bg-red-900/50 text-red-400' : 'bg-green-900/50 text-green-400'}`}>
                        {isFull ? 'Full' : 'Open'}
                      </span>
                    </div>

                    <div className="flex flex-wrap gap-2 mb-4">
                      <span className="text-xs text-zinc-400 bg-zinc-800 px-2.5 py-1 rounded-full">{cls.style}</span>
                      <span className="text-xs text-zinc-400 bg-zinc-800 px-2.5 py-1 rounded-full">{cls.level}</span>
                      <span className="text-xs text-zinc-400 bg-zinc-800 px-2.5 py-1 rounded-full">{cls.day}</span>
                      <span className="text-xs text-zinc-400 bg-zinc-800 px-2.5 py-1 rounded-full">{cls.time}</span>
                    </div>

                    <p className="text-zinc-500 text-xs leading-relaxed mb-4 line-clamp-2">{cls.description}</p>

                    {/* Enrollment bar */}
                    <div className="mb-4">
                      <div className="flex justify-between text-xs text-zinc-500 mb-1.5">
                        <span>Enrollment</span>
                        <span>{cls.enrolled}/{cls.capacity}</span>
                      </div>
                      <div className="h-1.5 bg-zinc-800 rounded-full overflow-hidden">
                        <div className={`h-full rounded-full ${isFull ? 'bg-red-500' : 'bg-yellow-400'}`} style={{ width: `${pct}%` }} />
                      </div>
                    </div>

                    <div className="flex items-center justify-between">
                      <span className="text-yellow-400 font-bold text-sm">${cls.price}/class</span>
                      <div className="flex gap-2">
                        <Link
                          to={`/classes/${cls.id}`}
                          className="bg-zinc-800 hover:bg-zinc-700 text-white text-xs font-bold px-3 py-1.5 rounded-lg transition"
                        >
                          View
                        </Link>
                        {canManage && (
                          <>
                            <Link
                              to={`/classes/${cls.id}/edit`}
                              className="bg-zinc-800 hover:bg-zinc-700 text-white text-xs font-bold px-3 py-1.5 rounded-lg transition"
                            >
                              Edit
                            </Link>
                            <button
                              onClick={() => handleDelete(cls.id)}
                              className="bg-red-900/50 hover:bg-red-900 text-red-400 text-xs font-bold px-3 py-1.5 rounded-lg transition"
                            >
                              Delete
                            </button>
                          </>
                        )}
                      </div>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>

      {/* Add Class Modal */}
      <Modal isOpen={showModal} onClose={() => setShowModal(false)} title="Add New Class">
        <form onSubmit={handleAdd} className="space-y-4">
          {formError && <p className="text-red-400 text-sm bg-red-950/40 border border-red-800 px-3 py-2 rounded-lg">{formError}</p>}
          <FormField label="Class Name *">
            <Input placeholder="e.g. Ballet Basics" value={form.name} onChange={e => setForm({ ...form, name: e.target.value })} />
          </FormField>
          <FormField label="Instructor">
            <Select value={form.instructorId} onChange={e => setForm({ ...form, instructorId: e.target.value })}>
              <option value="">Select instructor</option>
              {instructors.map(i => <option key={i.id} value={i.id}>{i.name}</option>)}
            </Select>
          </FormField>
          <div className="grid grid-cols-2 gap-3">
            <FormField label="Dance Style *">
              <Select value={form.style} onChange={e => setForm({ ...form, style: e.target.value })}>
                <option value="">Select style</option>
                {STYLES.map(s => <option key={s}>{s}</option>)}
              </Select>
            </FormField>
            <FormField label="Level *">
              <Select value={form.level} onChange={e => setForm({ ...form, level: e.target.value })}>
                <option value="">Select level</option>
                {LEVELS.map(l => <option key={l}>{l}</option>)}
              </Select>
            </FormField>
          </div>
          <div className="grid grid-cols-2 gap-3">
            <FormField label="Day *">
              <Select value={form.day} onChange={e => setForm({ ...form, day: e.target.value })}>
                <option value="">Select day</option>
                {DAYS.map(d => <option key={d}>{d}</option>)}
              </Select>
            </FormField>
            <FormField label="Time *">
              <Input type="time" value={form.time} onChange={e => setForm({ ...form, time: e.target.value })} />
            </FormField>
          </div>
          <div className="grid grid-cols-3 gap-3">
            <FormField label="Duration (min)">
              <Input type="number" min="30" max="180" value={form.duration} onChange={e => setForm({ ...form, duration: e.target.value })} />
            </FormField>
            <FormField label="Capacity">
              <Input type="number" min="1" max="100" value={form.capacity} onChange={e => setForm({ ...form, capacity: e.target.value })} />
            </FormField>
            <FormField label="Price ($)">
              <Input type="number" min="0" value={form.price} onChange={e => setForm({ ...form, price: e.target.value })} />
            </FormField>
          </div>
          <FormField label="Description">
            <Textarea placeholder="Describe the class..." value={form.description} onChange={e => setForm({ ...form, description: e.target.value })} />
          </FormField>
          <div className="flex gap-3 pt-2">
            <button type="button" onClick={() => setShowModal(false)} className="flex-1 bg-zinc-800 hover:bg-zinc-700 text-white font-bold py-2.5 rounded-lg transition text-sm">
              Cancel
            </button>
            <button type="submit" className="flex-1 bg-yellow-400 hover:bg-yellow-300 text-black font-black tracking-widest uppercase py-2.5 rounded-lg transition text-sm">
              Add Class
            </button>
          </div>
        </form>
      </Modal>
    </div>
  );
}
