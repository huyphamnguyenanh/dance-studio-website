import React, { useState, useEffect } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { getClasses, updateClass, getInstructors, getStudents } from '../data/store';
import { FormField, Input, Select, Textarea } from '../components/FormField';

const STYLES = ['Ballet', 'Contemporary', 'Hip-Hop', 'Jazz', 'Salsa', 'Tap', 'Ballroom'];
const LEVELS = ['Beginner', 'Intermediate', 'Advanced', 'All Levels'];
const DAYS = ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday'];

export default function ClassDetail() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { user } = useAuth();
  const [cls, setCls] = useState(null);
  const [instructors, setInstructors] = useState([]);
  const [enrolledStudents, setEnrolledStudents] = useState([]);
  const [editing, setEditing] = useState(false);
  const [form, setForm] = useState({});
  const [saved, setSaved] = useState(false);
  const canManage = user?.role === 'admin';

  useEffect(() => {
    const found = getClasses().find(c => c.id === id);
    if (!found) return;
    setCls(found);
    setForm(found);
    setInstructors(getInstructors());
    setEnrolledStudents(getStudents().filter(s => s.enrolledClasses?.includes(id)));
  }, [id]);

  if (!cls) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <p className="text-gray-500 mb-4">Class not found</p>
          <button onClick={() => navigate('/classes')} className="text-blue-600 font-medium hover:text-blue-700">
            ← Back to Classes
          </button>
        </div>
      </div>
    );
  }

  const handleSave = (e) => {
    e.preventDefault();
    updateClass(id, { ...form, capacity: Number(form.capacity), price: Number(form.price), duration: Number(form.duration) });
    const updated = getClasses().find(c => c.id === id);
    setCls(updated);
    setForm(updated);
    setEditing(false);
    setSaved(true);
    setTimeout(() => setSaved(false), 3000);
  };

  const instructor = instructors.find(i => i.id === cls.instructorId);
  const isFull = cls.enrolled >= cls.capacity;

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-8">

        <button onClick={() => navigate('/classes')} className="text-sm text-gray-500 hover:text-gray-700 mb-6 inline-flex items-center gap-1">
          ← Back to Classes
        </button>

        {saved && (
          <div className="bg-green-50 border border-green-200 text-green-700 text-sm px-4 py-3 rounded-lg mb-6">
            Class updated successfully.
          </div>
        )}

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">

          {/* Main */}
          <div className="lg:col-span-2 space-y-5">
            <div className="bg-white border border-gray-200 rounded-lg overflow-hidden">
              <div className="px-6 py-5 border-b border-gray-100 flex items-center justify-between">
                <div>
                  <h1 className="text-xl font-bold text-gray-900">{cls.name}</h1>
                  <p className="text-sm text-gray-500 mt-0.5">{instructor?.name || 'No instructor assigned'}</p>
                </div>
                {canManage && !editing && (
                  <button
                    onClick={() => setEditing(true)}
                    className="text-sm font-medium text-blue-600 hover:text-blue-700 px-3 py-1.5 rounded-md hover:bg-blue-50 transition"
                  >
                    Edit
                  </button>
                )}
              </div>

              {editing ? (
                <form onSubmit={handleSave} className="p-6 space-y-4">
                  <FormField label="Class Name">
                    <Input value={form.name} onChange={e => setForm({ ...form, name: e.target.value })} required />
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
                      <Input type="number" min="30" max="180" value={form.duration} onChange={e => setForm({ ...form, duration: e.target.value })} />
                    </FormField>
                    <FormField label="Capacity">
                      <Input type="number" min="1" value={form.capacity} onChange={e => setForm({ ...form, capacity: e.target.value })} />
                    </FormField>
                    <FormField label="Price ($)">
                      <Input type="number" min="0" value={form.price} onChange={e => setForm({ ...form, price: e.target.value })} />
                    </FormField>
                  </div>
                  <FormField label="Instructor">
                    <Select value={form.instructorId} onChange={e => setForm({ ...form, instructorId: e.target.value })}>
                      <option value="">Select instructor</option>
                      {instructors.map(i => <option key={i.id} value={i.id}>{i.name}</option>)}
                    </Select>
                  </FormField>
                  <FormField label="Description">
                    <Textarea value={form.description} onChange={e => setForm({ ...form, description: e.target.value })} rows={3} />
                  </FormField>
                  <div className="flex gap-3 pt-2">
                    <button type="button" onClick={() => { setEditing(false); setForm(cls); }} className="flex-1 border border-gray-300 text-gray-700 font-medium py-2.5 rounded-lg text-sm hover:bg-gray-50 transition">
                      Cancel
                    </button>
                    <button type="submit" className="flex-1 bg-gray-900 hover:bg-gray-800 text-white font-semibold py-2.5 rounded-lg text-sm transition">
                      Save Changes
                    </button>
                  </div>
                </form>
              ) : (
                <div className="p-6">
                  <div className="flex flex-wrap gap-2 mb-4">
                    <span className="text-xs font-medium bg-gray-100 text-gray-700 px-2.5 py-1 rounded-full">{cls.style}</span>
                    <span className="text-xs font-medium bg-gray-100 text-gray-700 px-2.5 py-1 rounded-full">{cls.level}</span>
                    <span className={`text-xs font-medium px-2.5 py-1 rounded-full ${isFull ? 'bg-red-100 text-red-700' : 'bg-green-100 text-green-700'}`}>
                      {isFull ? 'Full' : 'Open'}
                    </span>
                  </div>
                  {cls.description && (
                    <p className="text-sm text-gray-600 leading-relaxed">{cls.description}</p>
                  )}
                </div>
              )}
            </div>

            {/* Enrolled students */}
            <div className="bg-white border border-gray-200 rounded-lg overflow-hidden">
              <div className="px-6 py-4 border-b border-gray-100">
                <h2 className="text-base font-semibold text-gray-900">Enrolled Students ({enrolledStudents.length})</h2>
              </div>
              {enrolledStudents.length === 0 ? (
                <div className="px-6 py-8 text-center">
                  <p className="text-gray-400 text-sm">No students enrolled yet</p>
                </div>
              ) : (
                <div className="divide-y divide-gray-100">
                  {enrolledStudents.map(student => (
                    <div key={student.id} className="flex items-center justify-between px-6 py-3">
                      <div className="flex items-center gap-3">
                        <div className="w-7 h-7 bg-gray-200 rounded-full flex items-center justify-center text-gray-600 font-semibold text-xs">
                          {student.name.charAt(0)}
                        </div>
                        <div>
                          <p className="text-sm font-medium text-gray-900">{student.name}</p>
                          <p className="text-xs text-gray-500">{student.email}</p>
                        </div>
                      </div>
                      <div className="flex items-center gap-3">
                        <span className="text-xs text-gray-500">{student.attendance}% attendance</span>
                        {(user?.role === 'admin' || user?.role === 'instructor') && (
                          <Link to={`/students/${student.id}`} className="text-xs text-blue-600 hover:text-blue-700 font-medium">
                            View
                          </Link>
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>

          {/* Sidebar */}
          <div className="space-y-5">
            <div className="bg-white border border-gray-200 rounded-lg p-5">
              <h3 className="text-sm font-semibold text-gray-900 mb-4">Class Details</h3>
              <div className="space-y-0">
                {[
                  { label: 'Day', value: cls.day },
                  { label: 'Time', value: cls.time },
                  { label: 'Duration', value: `${cls.duration} min` },
                  { label: 'Price', value: `$${cls.price} / class` },
                  { label: 'Enrollment', value: `${cls.enrolled} / ${cls.capacity}` },
                ].map(({ label, value }) => (
                  <div key={label} className="flex justify-between items-center py-2.5 border-b border-gray-100 last:border-0">
                    <span className="text-xs text-gray-500">{label}</span>
                    <span className="text-sm font-medium text-gray-900">{value}</span>
                  </div>
                ))}
              </div>
              {user?.role === 'student' && !isFull && (
                <button className="w-full mt-4 bg-gray-900 hover:bg-gray-800 text-white font-semibold py-2.5 rounded-lg text-sm transition">
                  Enroll in Class
                </button>
              )}
            </div>

            {instructor && (
              <div className="bg-white border border-gray-200 rounded-lg p-5">
                <h3 className="text-sm font-semibold text-gray-900 mb-3">Instructor</h3>
                <div className="flex items-center gap-3 mb-3">
                  <div className="w-9 h-9 bg-gray-200 rounded-full flex items-center justify-center text-gray-700 font-bold text-sm">
                    {instructor.name.charAt(0)}
                  </div>
                  <div>
                    <p className="text-sm font-semibold text-gray-900">{instructor.name}</p>
                    <p className="text-xs text-gray-500">{instructor.style}</p>
                  </div>
                </div>
                <Link to={`/instructors/${instructor.id}`} className="text-xs text-blue-600 hover:text-blue-700 font-medium">
                  View profile →
                </Link>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
