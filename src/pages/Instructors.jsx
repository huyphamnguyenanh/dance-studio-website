import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { getInstructors, addInstructor, deleteInstructor } from '../data/store';
import Modal from '../components/Modal';
import { FormField, Input, Textarea } from '../components/FormField';

const EMPTY_FORM = { name: '', email: '', phone: '', bio: '' };

export default function Instructors() {
  const { user } = useAuth();
  const [instructors, setInstructors] = useState([]);
  const [search, setSearch] = useState('');
  const [showModal, setShowModal] = useState(false);
  const [form, setForm] = useState(EMPTY_FORM);
  const [formError, setFormError] = useState('');
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

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      {/* Header */}
      <div className="mb-6">
        <h1 className="text-3xl font-bold text-gray-900">Instructors</h1>
        <p className="text-sm text-gray-600 mt-1">{filtered.length} of {instructors.length} instructors</p>
      </div>

      {/* Search */}
      <div className="bg-white border border-gray-200 rounded p-4 mb-6">
        <label className="block text-xs font-bold text-gray-700 uppercase mb-2">Search</label>
        <input
          type="text"
          placeholder="Search instructors..."
          value={search}
          onChange={e => setSearch(e.target.value)}
          className="w-full border border-gray-300 rounded px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-teal-500 bg-white"
        />
      </div>

      {/* Table */}
      {filtered.length === 0 ? (
        <div className="bg-white border border-gray-200 rounded p-8 text-center">
          <p className="text-gray-500 text-sm">No instructors found</p>
        </div>
      ) : (
        <div className="bg-white border border-gray-200 rounded overflow-hidden">
          <table className="w-full">
            <thead className="bg-gray-50 border-b border-gray-200">
              <tr>
                <th className="text-left text-xs font-bold text-gray-700 uppercase px-4 py-3">Name</th>
                <th className="text-left text-xs font-bold text-gray-700 uppercase px-4 py-3">Email</th>
                <th className="text-left text-xs font-bold text-gray-700 uppercase px-4 py-3">Phone</th>
                <th className="text-right text-xs font-bold text-gray-700 uppercase px-4 py-3">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              {filtered.map(instructor => (
                <tr key={instructor.id} className="hover:bg-gray-50 transition">
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
                        View
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

      {/* Add Button */}
      {canManage && (
        <div className="mt-6 flex justify-end">
          <button
            onClick={() => { setShowModal(true); setForm(EMPTY_FORM); setFormError(''); }}
            className="bg-teal-700 hover:bg-teal-800 text-white text-sm font-semibold px-4 py-2 rounded transition"
          >
            + Add Instructor
          </button>
        </div>
      )}

      {/* Add Instructor Modal */}
      <Modal isOpen={showModal} onClose={() => setShowModal(false)} title="Add New Instructor">
        <form onSubmit={handleAdd} className="space-y-4">
          {formError && <p className="text-red-600 text-sm bg-red-50 border border-red-200 px-3 py-2 rounded">{formError}</p>}
          <FormField label="Name *">
            <Input placeholder="Full name" value={form.name} onChange={e => setForm({ ...form, name: e.target.value })} />
          </FormField>
          <FormField label="Email">
            <Input type="email" placeholder="email@example.com" value={form.email} onChange={e => setForm({ ...form, email: e.target.value })} />
          </FormField>
          <FormField label="Phone">
            <Input placeholder="Phone number" value={form.phone} onChange={e => setForm({ ...form, phone: e.target.value })} />
          </FormField>
          <FormField label="Bio">
            <Textarea placeholder="Brief biography..." value={form.bio} onChange={e => setForm({ ...form, bio: e.target.value })} rows={3} />
          </FormField>
          <div className="flex gap-3 pt-1">
            <button type="button" onClick={() => setShowModal(false)} className="flex-1 border border-gray-300 text-gray-700 font-medium py-2 rounded text-sm hover:bg-gray-50 transition">
              Cancel
            </button>
            <button type="submit" className="flex-1 bg-teal-700 hover:bg-teal-800 text-white font-semibold py-2 rounded text-sm transition">
              Add Instructor
            </button>
          </div>
        </form>
      </Modal>
    </div>
  );
}
