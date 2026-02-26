import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { getInstructors, addInstructor, deleteInstructor } from '../data/store';
import Modal from '../components/Modal';
import FilterPanel from '../components/FilterPanel';
import { FormField, Input, Textarea } from '../components/FormField';

const EMPTY_FORM = { name: '', email: '', phone: '', bio: '', specialties: '' };

export default function Instructors() {
  const { user } = useAuth();
  const [instructors, setInstructors] = useState([]);
  const [search, setSearch] = useState('');
  const [showModal, setShowModal] = useState(false);
  const [form, setForm] = useState(EMPTY_FORM);
  const [formError, setFormError] = useState('');
  const [selectedInstructors, setSelectedInstructors] = useState(new Set());
  const canManage = user?.role === 'admin';

  useEffect(() => {
    setInstructors(getInstructors());
  }, []);

  const filtered = instructors.filter(i => {
    const q = search.toLowerCase();
    return i.name.toLowerCase().includes(q) || i.email.toLowerCase().includes(q);
  });

  const handleAdd = (e) => {
    e.preventDefault();
    if (!form.name.trim()) { setFormError('Instructor name is required.'); return; }
    addInstructor(form);
    setInstructors(getInstructors());
    setShowModal(false);
    setForm(EMPTY_FORM);
    setFormError('');
  };

  const handleDelete = (id) => {
    if (window.confirm('Delete this instructor?')) {
      deleteInstructor(id);
      setInstructors(getInstructors());
    }
  };

  const toggleSelectInstructor = (id) => {
    const newSelected = new Set(selectedInstructors);
    if (newSelected.has(id)) {
      newSelected.delete(id);
    } else {
      newSelected.add(id);
    }
    setSelectedInstructors(newSelected);
  };

  const toggleSelectAll = () => {
    if (selectedInstructors.size === filtered.length) {
      setSelectedInstructors(new Set());
    } else {
      setSelectedInstructors(new Set(filtered.map(i => i.id)));
    }
  };

  return (
    <div className="flex h-full">
      {/* Main Content */}
      <div className="flex-1 flex flex-col">
        {/* Header */}
        <div className="bg-white border-b border-gray-200 px-6 py-6">
          <h1 className="text-2xl font-bold text-gray-900 mb-1">Select instructor to change</h1>
          <p className="text-sm text-gray-500">{filtered.length} of {instructors.length} instructors</p>
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
          <span className="text-sm text-gray-500 ml-auto">{selectedInstructors.size} of {filtered.length} selected</span>
        </div>

        {/* Table */}
        <div className="flex-1 overflow-auto px-6 py-6">
          {filtered.length === 0 ? (
            <div className="bg-white border border-gray-200 rounded p-12 text-center">
              <p className="text-gray-400 text-sm">No instructors found</p>
            </div>
          ) : (
            <div className="bg-white border border-gray-200 rounded-lg overflow-hidden">
              <table className="w-full">
                <thead className="bg-gray-50 border-b border-gray-200">
                  <tr>
                    <th className="w-12 px-4 py-3">
                      <input
                        type="checkbox"
                        checked={selectedInstructors.size === filtered.length && filtered.length > 0}
                        onChange={toggleSelectAll}
                        className="w-4 h-4 text-teal-600 rounded cursor-pointer"
                      />
                    </th>
                    <th className="text-left text-xs font-bold text-gray-700 uppercase tracking-wide px-4 py-3">Instructor</th>
                    <th className="text-left text-xs font-bold text-gray-700 uppercase tracking-wide px-4 py-3">Email</th>
                    <th className="text-left text-xs font-bold text-gray-700 uppercase tracking-wide px-4 py-3">Phone</th>
                    <th className="text-right text-xs font-bold text-gray-700 uppercase tracking-wide px-4 py-3">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-100">
                  {filtered.map(instructor => (
                    <tr key={instructor.id} className="hover:bg-gray-50 transition">
                      <td className="px-4 py-3">
                        <input
                          type="checkbox"
                          checked={selectedInstructors.has(instructor.id)}
                          onChange={() => toggleSelectInstructor(instructor.id)}
                          className="w-4 h-4 text-teal-600 rounded cursor-pointer"
                        />
                      </td>
                      <td className="px-4 py-3">
                        <Link to={`/instructors/${instructor.id}`} className="text-sm font-medium text-teal-700 hover:text-teal-900 underline">
                          {instructor.name}
                        </Link>
                      </td>
                      <td className="px-4 py-3 text-sm text-gray-700">{instructor.email}</td>
                      <td className="px-4 py-3 text-sm text-gray-700">{instructor.phone || '—'}</td>
                      <td className="px-4 py-3 text-right">
                        <div className="flex items-center justify-end gap-2">
                          <Link
                            to={`/instructors/${instructor.id}`}
                            className="text-xs font-medium text-teal-700 hover:text-teal-900 underline"
                          >
                            Change
                          </Link>
                          {canManage && (
                            <button
                              onClick={() => handleDelete(instructor.id)}
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
              + ADD INSTRUCTOR
            </button>
          </div>
        )}
      </div>

      {/* Filter Panel */}
      <FilterPanel
        title="Filter"
        filters={[]}
        activeFilters={{}}
        onFilterChange={() => {}}
      />

      {/* Add Instructor Modal */}
      <Modal isOpen={showModal} onClose={() => setShowModal(false)} title="Add New Instructor">
        <form onSubmit={handleAdd} className="space-y-4">
          {formError && <p className="text-red-600 text-sm bg-red-50 border border-red-200 px-3 py-2 rounded-lg">{formError}</p>}
          <FormField label="Name *">
            <Input placeholder="Full name" value={form.name} onChange={e => setForm({ ...form, name: e.target.value })} />
          </FormField>
          <FormField label="Email">
            <Input type="email" placeholder="email@example.com" value={form.email} onChange={e => setForm({ ...form, email: e.target.value })} />
          </FormField>
          <FormField label="Phone">
            <Input placeholder="Phone number" value={form.phone} onChange={e => setForm({ ...form, phone: e.target.value })} />
          </FormField>
          <FormField label="Specialties">
            <Input placeholder="e.g. Ballet, Contemporary" value={form.specialties} onChange={e => setForm({ ...form, specialties: e.target.value })} />
          </FormField>
          <FormField label="Bio">
            <Textarea placeholder="Brief biography..." value={form.bio} onChange={e => setForm({ ...form, bio: e.target.value })} rows={3} />
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
