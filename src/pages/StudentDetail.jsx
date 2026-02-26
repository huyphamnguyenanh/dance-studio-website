import React, { useState, useEffect } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { getStudents, updateStudent, getClasses } from '../data/store';
import { FormField, Input, Select } from '../components/FormField';

const LEVELS = ['Beginner', 'Intermediate', 'Advanced'];

export default function StudentDetail() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { user } = useAuth();
  const [student, setStudent] = useState(null);
  const [classes, setClasses] = useState([]);
  const [editing, setEditing] = useState(false);
  const [form, setForm] = useState({});
  const [saved, setSaved] = useState(false);
  const canManage = user?.role === 'admin' || user?.role === 'instructor';

  useEffect(() => {
    const found = getStudents().find(s => s.id === id);
    if (!found) return;
    setStudent(found);
    setForm(found);
    const enrolledClasses = getClasses().filter(c => found.enrolledClasses?.includes(c.id));
    setClasses(enrolledClasses);
  }, [id]);

  if (!student) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <p className="text-gray-500 mb-4">Student not found</p>
          <button onClick={() => navigate('/students')} className="text-blue-600 font-medium hover:text-blue-700 transition">
            ← Back to Students
          </button>
        </div>
      </div>
    );
  }

  const handleSave = (e) => {
    e.preventDefault();
    updateStudent(id, form);
    setStudent({ ...student, ...form });
    setEditing(false);
    setSaved(true);
    setTimeout(() => setSaved(false), 2500);
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-8">

        {/* Back */}
        <button onClick={() => navigate('/students')} className="text-sm text-gray-500 hover:text-gray-900 font-medium mb-6 flex items-center gap-1 transition">
          ← Back to Students
        </button>

        {saved && (
          <div className="bg-green-50 border border-green-200 text-green-700 text-sm px-4 py-3 rounded-lg mb-6">
            Student profile updated successfully.
          </div>
        )}

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Main */}
          <div className="lg:col-span-2 space-y-5">
            <div className="bg-white border border-gray-200 rounded-lg p-6">
              {editing ? (
                <form onSubmit={handleSave} className="space-y-4">
                  <h2 className="text-base font-semibold text-gray-900 mb-4">Edit Student</h2>
                  <FormField label="Full Name *">
                    <Input value={form.name} onChange={e => setForm({ ...form, name: e.target.value })} required />
                  </FormField>
                  <FormField label="Email *">
                    <Input type="email" value={form.email} onChange={e => setForm({ ...form, email: e.target.value })} required />
                  </FormField>
                  <FormField label="Phone">
                    <Input type="tel" value={form.phone || ''} onChange={e => setForm({ ...form, phone: e.target.value })} />
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
                    <button type="button" onClick={() => setEditing(false)} className="flex-1 border border-gray-300 text-gray-700 font-medium py-2.5 rounded-lg text-sm hover:bg-gray-50 transition">
                      Cancel
                    </button>
                    <button type="submit" className="flex-1 bg-gray-900 hover:bg-gray-800 text-white font-semibold py-2.5 rounded-lg text-sm transition">
                      Save Changes
                    </button>
                  </div>
                </form>
              ) : (
                <>
                  <div className="flex items-start justify-between mb-5">
                    <div className="flex items-center gap-4">
                      <div className="w-14 h-14 bg-gray-200 rounded-full flex items-center justify-center text-gray-700 font-bold text-xl">
                        {student.name.charAt(0)}
                      </div>
                      <div>
                        <h1 className="text-xl font-bold text-gray-900">{student.name}</h1>
                        <p className="text-sm text-gray-500 mt-0.5">{student.level} · Joined {student.joinDate}</p>
                      </div>
                    </div>
                    {canManage && (
                      <button
                        onClick={() => setEditing(true)}
                        className="text-sm font-medium text-gray-700 border border-gray-300 px-3 py-1.5 rounded-lg hover:bg-gray-50 transition"
                      >
                        Edit
                      </button>
                    )}
                  </div>

                  <div className="grid grid-cols-3 gap-4 mb-5 py-4 border-y border-gray-100">
                    <div className="text-center">
                      <p className="text-2xl font-bold text-gray-900">{classes.length}</p>
                      <p className="text-xs text-gray-500 mt-1">Enrolled Classes</p>
                    </div>
                    <div className="text-center">
                      <p className="text-2xl font-bold text-gray-900">{student.attendance}%</p>
                      <p className="text-xs text-gray-500 mt-1">Attendance</p>
                    </div>
                    <div className="text-center">
                      <p className="text-2xl font-bold text-gray-900">{student.joinDate}</p>
                      <p className="text-xs text-gray-500 mt-1">Member Since</p>
                    </div>
                  </div>
                </>
              )}
            </div>

            {/* Enrolled Classes */}
            <div className="bg-white border border-gray-200 rounded-lg p-6">
              <h2 className="text-base font-semibold text-gray-900 mb-4">Enrolled Classes ({classes.length})</h2>
              {classes.length === 0 ? (
                <p className="text-gray-400 text-sm">Not enrolled in any classes yet</p>
              ) : (
                <div className="divide-y divide-gray-100">
                  {classes.map(cls => (
                    <Link
                      key={cls.id}
                      to={`/classes/${cls.id}`}
                      className="flex items-center justify-between py-3 hover:bg-gray-50 -mx-2 px-2 rounded transition"
                    >
                      <div>
                        <p className="text-sm font-semibold text-gray-900">{cls.name}</p>
                        <p className="text-xs text-gray-500 mt-0.5">{cls.day} · {cls.time}</p>
                      </div>
                      <div className="text-right shrink-0 ml-4">
                        <span className="text-xs bg-gray-100 text-gray-600 px-2 py-0.5 rounded-full">{cls.level}</span>
                      </div>
                    </Link>
                  ))}
                </div>
              )}
            </div>
          </div>

          {/* Sidebar */}
          <div>
            <div className="bg-white border border-gray-200 rounded-lg p-5 space-y-3">
              <h3 className="text-sm font-semibold text-gray-900 mb-3">Contact Information</h3>
              {[
                { label: 'Email', value: student.email },
                { label: 'Phone', value: student.phone || '—' },
                { label: 'Level', value: student.level },
                { label: 'Joined', value: student.joinDate },
              ].map(({ label, value }) => (
                <div key={label} className="py-2 border-b border-gray-100 last:border-0">
                  <p className="text-xs text-gray-500 mb-0.5">{label}</p>
                  <p className="text-sm font-medium text-gray-900 break-all">{value}</p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
