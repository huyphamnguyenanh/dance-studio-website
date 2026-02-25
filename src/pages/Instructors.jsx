import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { getInstructors, addInstructor, deleteInstructor } from '../data/store';
import Modal from '../components/Modal';
import { FormField, Input, Select, Textarea } from '../components/FormField';

const STYLES = ['Ballet', 'Contemporary', 'Hip-Hop', 'Jazz', 'Salsa', 'Tap', 'Ballroom', 'Other'];
const LEVELS = ['Instructor', 'Senior Instructor', 'Lead Instructor', 'Guest Instructor'];
const EMPTY_FORM = { name: '', style: '', level: '', email: '', phone: '', bio: '' };

export default function Instructors() {
  const { user } = useAuth();
  const [instructors, setInstructors] = useState([]);
  const [search, setSearch] = useState('');
  const [filterStyle, setFilterStyle] = useState('');
  const [showModal, setShowModal] = useState(false);
  const [form, setForm] = useState(EMPTY_FORM);
  const [formError, setFormError] = useState('');
  const canManage = user?.role === 'admin';

  useEffect(() => { setInstructors(getInstructors()); }, []);

  const filtered = instructors.filter(i => {
    const q = search.toLowerCase();
    const matchSearch = i.name.toLowerCase().includes(q) || i.style.toLowerCase().includes(q);
    const matchStyle = !filterStyle || i.style === filterStyle;
    return matchSearch && matchStyle;
  });

  const handleAdd = (e) => {
    e.preventDefault();
    if (!form.name || !form.style || !form.email) {
      setFormError('Name, style, and email are required.');
      return;
    }
    addInstructor(form);
    setInstructors(getInstructors());
    setShowModal(false);
    setForm(EMPTY_FORM);
    setFormError('');
  };

  const handleDelete = (id) => {
    if (window.confirm('Remove this instructor?')) {
      deleteInstructor(id);
      setInstructors(getInstructors());
    }
  };

  return (
    <div className="min-h-screen bg-black text-white">
      <div className="max-w-7xl mx-auto px-6 py-10">
        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-8">
          <div>
            <h1 className="text-3xl font-black tracking-tight">INSTRUCTORS</h1>
            <p className="text-zinc-500 text-sm mt-1">{instructors.length} instructors</p>
          </div>
          {canManage && (
            <button
              onClick={() => { setShowModal(true); setForm(EMPTY_FORM); setFormError(''); }}
              className="bg-yellow-400 hover:bg-yellow-300 text-black font-black text-xs tracking-widest uppercase px-5 py-3 rounded-lg transition"
            >
              + Add Instructor
            </button>
          )}
        </div>

        {/* Filters */}
        <div className="flex flex-col sm:flex-row gap-3 mb-8">
          <input
            type="text"
            placeholder="Search instructors..."
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

        {/* Grid */}
        {filtered.length === 0 ? (
          <div className="text-center py-20">
            <p className="text-zinc-600 text-lg">No instructors found</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
            {filtered.map(instr => (
              <div key={instr.id} className="bg-zinc-900 border border-zinc-800 hover:border-zinc-600 rounded-2xl overflow-hidden transition group">
                <div className="h-1 bg-yellow-400" />
                <div className="p-6">
                  <div className="flex items-start gap-4 mb-4">
                    <div className="w-12 h-12 bg-yellow-400 rounded-full flex items-center justify-center text-black font-black text-lg shrink-0">
                      {instr.name.charAt(0)}
                    </div>
                    <div className="min-w-0">
                      <h3 className="text-white font-bold truncate">{instr.name}</h3>
                      <p className="text-zinc-500 text-xs mt-0.5">{instr.level}</p>
                    </div>
                  </div>

                  <div className="flex flex-wrap gap-2 mb-4">
                    <span className="text-xs text-yellow-400 bg-yellow-400/10 px-2.5 py-1 rounded-full font-semibold">{instr.style}</span>
                  </div>

                  <p className="text-zinc-500 text-xs leading-relaxed mb-4 line-clamp-2">{instr.bio}</p>

                  <div className="grid grid-cols-3 gap-2 mb-4 py-3 border-y border-zinc-800">
                    <div className="text-center">
                      <p className="text-white font-black text-lg">{instr.classes}</p>
                      <p className="text-zinc-600 text-xs">Classes</p>
                    </div>
                    <div className="text-center">
                      <p className="text-white font-black text-lg">{instr.students}</p>
                      <p className="text-zinc-600 text-xs">Students</p>
                    </div>
                    <div className="text-center">
                      <p className="text-yellow-400 font-black text-lg">★{instr.rating}</p>
                      <p className="text-zinc-600 text-xs">Rating</p>
                    </div>
                  </div>

                  <div className="flex gap-2">
                    <Link
                      to={`/instructors/${instr.id}`}
                      className="flex-1 bg-zinc-800 hover:bg-zinc-700 text-white text-xs font-bold py-2 rounded-lg transition text-center"
                    >
                      View Profile
                    </Link>
                    {canManage && (
                      <button
                        onClick={() => handleDelete(instr.id)}
                        className="bg-red-900/50 hover:bg-red-900 text-red-400 text-xs font-bold px-3 py-2 rounded-lg transition"
                      >
                        Remove
                      </button>
                    )}
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Add Instructor Modal */}
      <Modal isOpen={showModal} onClose={() => setShowModal(false)} title="Add New Instructor">
        <form onSubmit={handleAdd} className="space-y-4">
          {formError && <p className="text-red-400 text-sm bg-red-950/40 border border-red-800 px-3 py-2 rounded-lg">{formError}</p>}
          <FormField label="Full Name *">
            <Input placeholder="e.g. Sarah Johnson" value={form.name} onChange={e => setForm({ ...form, name: e.target.value })} />
          </FormField>
          <div className="grid grid-cols-2 gap-3">
            <FormField label="Dance Style *">
              <Select value={form.style} onChange={e => setForm({ ...form, style: e.target.value })}>
                <option value="">Select style</option>
                {STYLES.map(s => <option key={s}>{s}</option>)}
              </Select>
            </FormField>
            <FormField label="Level">
              <Select value={form.level} onChange={e => setForm({ ...form, level: e.target.value })}>
                <option value="">Select level</option>
                {LEVELS.map(l => <option key={l}>{l}</option>)}
              </Select>
            </FormField>
          </div>
          <FormField label="Email *">
            <Input type="email" placeholder="instructor@studio.com" value={form.email} onChange={e => setForm({ ...form, email: e.target.value })} />
          </FormField>
          <FormField label="Phone">
            <Input type="tel" placeholder="+1 234 567 8900" value={form.phone} onChange={e => setForm({ ...form, phone: e.target.value })} />
          </FormField>
          <FormField label="Bio">
            <Textarea placeholder="Brief instructor biography..." value={form.bio} onChange={e => setForm({ ...form, bio: e.target.value })} />
          </FormField>
          <div className="flex gap-3 pt-2">
            <button type="button" onClick={() => setShowModal(false)} className="flex-1 bg-zinc-800 hover:bg-zinc-700 text-white font-bold py-2.5 rounded-lg transition text-sm">
              Cancel
            </button>
            <button type="submit" className="flex-1 bg-yellow-400 hover:bg-yellow-300 text-black font-black tracking-widest uppercase py-2.5 rounded-lg transition text-sm">
              Add Instructor
            </button>
          </div>
        </form>
      </Modal>
    </div>
  );
}
