import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { getInstructors, addInstructor, deleteInstructor } from '../data/store';
import Modal from '../components/Modal';
import { FormField, Input, Select, Textarea } from '../components/FormField';

const STYLES = ['Ballet', 'Contemporary', 'Hip-Hop', 'Jazz', 'Salsa', 'Tap', 'Ballroom'];
const LEVELS = ['Instructor', 'Senior Instructor', 'Lead Instructor', 'Guest Instructor'];
const EMPTY_FORM = { name: '', style: 'Ballet', level: 'Instructor', email: '', phone: '', bio: '' };

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
    if (!form.name.trim() || !form.email.trim()) {
      setFormError('Name and email are required.');
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
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-8">

        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6">
          <div>
            <h1 className="text-2xl font-bold text-gray-900">Instructors</h1>
            <p className="text-sm text-gray-500 mt-0.5">{instructors.length} teaching staff</p>
          </div>
          {canManage && (
            <button
              onClick={() => { setShowModal(true); setForm(EMPTY_FORM); setFormError(''); }}
              className="bg-gray-900 hover:bg-gray-800 text-white text-sm font-semibold px-4 py-2 rounded-lg transition"
            >
              + Add Instructor
            </button>
          )}
        </div>

        {/* Filters */}
        <div className="flex flex-col sm:flex-row gap-3 mb-6">
          <input
            type="text"
            placeholder="Search instructors..."
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
            <p className="text-gray-400 text-sm">No instructors found</p>
          </div>
        ) : (
          <div className="bg-white border border-gray-200 rounded-lg overflow-hidden">
            <table className="w-full">
              <thead className="bg-gray-50 border-b border-gray-200">
                <tr>
                  <th className="text-left text-xs font-medium text-gray-500 uppercase tracking-wide px-5 py-3">Instructor</th>
                  <th className="text-left text-xs font-medium text-gray-500 uppercase tracking-wide px-5 py-3 hidden sm:table-cell">Specialty</th>
                  <th className="text-left text-xs font-medium text-gray-500 uppercase tracking-wide px-5 py-3 hidden md:table-cell">Contact</th>
                  <th className="text-left text-xs font-medium text-gray-500 uppercase tracking-wide px-5 py-3 hidden lg:table-cell">Stats</th>
                  <th className="text-right text-xs font-medium text-gray-500 uppercase tracking-wide px-5 py-3">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100">
                {filtered.map(instr => (
                  <tr key={instr.id} className="hover:bg-gray-50 transition">
                    <td className="px-5 py-4">
                      <div className="flex items-center gap-3">
                        <div className="w-9 h-9 bg-gray-200 rounded-full flex items-center justify-center text-gray-700 font-bold text-sm shrink-0">
                          {instr.name.charAt(0)}
                        </div>
                        <div>
                          <p className="text-sm font-semibold text-gray-900">{instr.name}</p>
                          <p className="text-xs text-gray-500">{instr.level}</p>
                        </div>
                      </div>
                    </td>
                    <td className="px-5 py-4 hidden sm:table-cell">
                      <span className="text-xs font-medium bg-gray-100 text-gray-700 px-2.5 py-1 rounded-full">{instr.style}</span>
                    </td>
                    <td className="px-5 py-4 hidden md:table-cell">
                      <p className="text-sm text-gray-700">{instr.email}</p>
                      {instr.phone && <p className="text-xs text-gray-500 mt-0.5">{instr.phone}</p>}
                    </td>
                    <td className="px-5 py-4 hidden lg:table-cell">
                      <div className="flex items-center gap-4 text-xs text-gray-600">
                        <span>{instr.classes} classes</span>
                        <span>{instr.students} students</span>
                        <span className="text-yellow-600">★ {instr.rating}</span>
                      </div>
                    </td>
                    <td className="px-5 py-4 text-right">
                      <div className="flex items-center justify-end gap-2">
                        <Link
                          to={`/instructors/${instr.id}`}
                          className="text-xs font-medium text-blue-600 hover:text-blue-700 px-3 py-1.5 rounded-md hover:bg-blue-50 transition"
                        >
                          View
                        </Link>
                        {canManage && (
                          <button
                            onClick={() => handleDelete(instr.id)}
                            className="text-xs font-medium text-red-600 hover:text-red-700 px-3 py-1.5 rounded-md hover:bg-red-50 transition"
                          >
                            Remove
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

      {/* Add Instructor Modal */}
      <Modal isOpen={showModal} onClose={() => setShowModal(false)} title="Add New Instructor">
        <form onSubmit={handleAdd} className="space-y-4">
          {formError && <p className="text-red-600 text-sm bg-red-50 border border-red-200 px-3 py-2 rounded-lg">{formError}</p>}
          <FormField label="Full Name *">
            <Input placeholder="e.g. Sarah Johnson" value={form.name} onChange={e => setForm({ ...form, name: e.target.value })} />
          </FormField>
          <div className="grid grid-cols-2 gap-3">
            <FormField label="Dance Style">
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
          <FormField label="Email *">
            <Input type="email" placeholder="instructor@studio.com" value={form.email} onChange={e => setForm({ ...form, email: e.target.value })} />
          </FormField>
          <FormField label="Phone">
            <Input type="tel" placeholder="+1 234 567 8900" value={form.phone} onChange={e => setForm({ ...form, phone: e.target.value })} />
          </FormField>
          <FormField label="Bio">
            <Textarea placeholder="Brief instructor biography..." value={form.bio} onChange={e => setForm({ ...form, bio: e.target.value })} rows={3} />
          </FormField>
          <div className="flex gap-3 pt-1">
            <button type="button" onClick={() => setShowModal(false)} className="flex-1 border border-gray-300 text-gray-700 font-medium py-2.5 rounded-lg text-sm hover:bg-gray-50 transition">
              Cancel
            </button>
            <button type="submit" className="flex-1 bg-gray-900 hover:bg-gray-800 text-white font-semibold py-2.5 rounded-lg text-sm transition">
              Add Instructor
            </button>
          </div>
        </form>
      </Modal>
    </div>
  );
}
