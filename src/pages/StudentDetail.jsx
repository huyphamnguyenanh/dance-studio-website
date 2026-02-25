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
  const [allClasses, setAllClasses] = useState([]);
  const [editing, setEditing] = useState(false);
  const [form, setForm] = useState({});
  const [saved, setSaved] = useState(false);
  const canManage = user?.role === 'admin' || user?.role === 'instructor';

  useEffect(() => {
    const found = getStudents().find(s => s.id === id);
    if (!found) return;
    setStudent(found);
    setForm(found);
    const all = getClasses();
    setAllClasses(all);
    setClasses(all.filter(c => found.enrolledClasses?.includes(c.id)));
  }, [id]);

  if (!student) {
    return (
      <div className="min-h-screen bg-black flex items-center justify-center">
        <div className="text-center">
          <p className="text-zinc-500 text-lg mb-4">Student not found</p>
          <button onClick={() => navigate('/students')} className="text-yellow-400 font-bold hover:text-yellow-300 transition">
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
    const all = getClasses();
    setClasses(all.filter(c => (form.enrolledClasses || []).includes(c.id)));
    setEditing(false);
    setSaved(true);
    setTimeout(() => setSaved(false), 2500);
  };

  return (
    <div className="min-h-screen bg-black text-white">
      <div className="max-w-7xl mx-auto px-6 py-10">
        <button onClick={() => navigate('/students')} className="text-zinc-500 hover:text-yellow-400 text-xs font-bold tracking-widest uppercase mb-6 transition">
          ← Back to Students
        </button>

        {saved && (
          <div className="bg-green-900/40 border border-green-700 text-green-300 text-sm px-4 py-3 rounded-lg mb-6">
            Student profile updated successfully!
          </div>
        )}

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Main */}
          <div className="lg:col-span-2 space-y-6">
            <div className="bg-zinc-900 border border-zinc-800 rounded-2xl overflow-hidden">
              <div className="h-1.5 bg-yellow-400" />
              <div className="p-8">
                {editing ? (
                  <form onSubmit={handleSave} className="space-y-4">
                    <FormField label="Full Name *">
                      <Input value={form.name} onChange={e => setForm({ ...form, name: e.target.value })} required />
                    </FormField>
                    <FormField label="Email *">
                      <Input type="email" value={form.email} onChange={e => setForm({ ...form, email: e.target.value })} required />
                    </FormField>
                    <FormField label="Phone">
                      <Input type="tel" value={form.phone} onChange={e => setForm({ ...form, phone: e.target.value })} />
                    </FormField>
                    <div className="grid grid-cols-2 gap-3">
                      <FormField label="Level">
                        <Select value={form.level} onChange={e => setForm({ ...form, level: e.target.value })}>
                          <option value="">Select level</option>
                          {LEVELS.map(l => <option key={l}>{l}</option>)}
                        </Select>
                      </FormField>
                      <FormField label="Join Date">
                        <Input type="date" value={form.joinDate} onChange={e => setForm({ ...form, joinDate: e.target.value })} />
                      </FormField>
                    </div>
                    <div className="flex gap-3">
                      <button type="button" onClick={() => setEditing(false)} className="flex-1 bg-zinc-800 hover:bg-zinc-700 text-white font-bold py-2.5 rounded-lg transition text-sm">
                        Cancel
                      </button>
                      <button type="submit" className="flex-1 bg-yellow-400 hover:bg-yellow-300 text-black font-black tracking-widest uppercase py-2.5 rounded-lg transition text-sm">
                        Save Changes
                      </button>
                    </div>
                  </form>
                ) : (
                  <>
                    <div className="flex items-start justify-between mb-6">
                      <div className="flex items-center gap-5">
                        <div className="w-16 h-16 bg-zinc-700 rounded-full flex items-center justify-center text-white font-black text-2xl">
                          {student.name.charAt(0)}
                        </div>
                        <div>
                          <h1 className="text-3xl font-black tracking-tight">{student.name}</h1>
                          <p className="text-zinc-500 mt-1">{student.level || 'No level set'}</p>
                        </div>
                      </div>
                      {canManage && (
                        <button
                          onClick={() => setEditing(true)}
                          className="bg-zinc-800 hover:bg-zinc-700 text-white text-xs font-bold px-4 py-2 rounded-lg transition"
                        >
                          Edit
                        </button>
                      )}
                    </div>
                    <div className="grid grid-cols-3 gap-4 py-4 border-y border-zinc-800 mb-6">
                      <div className="text-center">
                        <p className="text-white font-black text-2xl">{classes.length}</p>
                        <p className="text-zinc-500 text-xs mt-1">Classes</p>
                      </div>
                      <div className="text-center">
                        <p className={`font-black text-2xl ${student.attendance >= 90 ? 'text-green-400' : student.attendance >= 75 ? 'text-yellow-400' : 'text-red-400'}`}>
                          {student.attendance}%
                        </p>
                        <p className="text-zinc-500 text-xs mt-1">Attendance</p>
                      </div>
                      <div className="text-center">
                        <p className="text-white font-black text-2xl">{student.joinDate?.split('-')[0] || '—'}</p>
                        <p className="text-zinc-500 text-xs mt-1">Year Joined</p>
                      </div>
                    </div>
                  </>
                )}
              </div>
            </div>

            {/* Enrolled classes */}
            <div className="bg-zinc-900 border border-zinc-800 rounded-2xl p-6">
              <h2 className="text-white font-black tracking-wide uppercase mb-5">Enrolled Classes ({classes.length})</h2>
              {classes.length === 0 ? (
                <p className="text-zinc-600 text-sm">Not enrolled in any classes</p>
              ) : (
                <div className="space-y-3">
                  {classes.map(cls => (
                    <Link
                      key={cls.id}
                      to={`/classes/${cls.id}`}
                      className="flex items-center justify-between py-3 border-b border-zinc-800 last:border-0 hover:opacity-80 transition"
                    >
                      <div>
                        <p className="text-white font-semibold text-sm">{cls.name}</p>
                        <p className="text-zinc-500 text-xs">{cls.day} · {cls.time}</p>
                      </div>
                      <div className="text-right">
                        <span className="text-xs text-zinc-400 bg-zinc-800 px-2 py-1 rounded-full">{cls.style}</span>
                        <p className="text-xs text-zinc-500 mt-1">${cls.price}/class</p>
                      </div>
                    </Link>
                  ))}
                </div>
              )}
            </div>
          </div>

          {/* Sidebar */}
          <div className="space-y-5">
            <div className="bg-zinc-900 border border-zinc-800 rounded-2xl p-6 space-y-4">
              <h3 className="text-white font-black tracking-wide uppercase text-sm">Contact</h3>
              {[
                { label: 'Email', value: student.email },
                { label: 'Phone', value: student.phone || '—' },
                { label: 'Level', value: student.level || '—' },
                { label: 'Joined', value: student.joinDate || '—' },
              ].map(({ label, value }) => (
                <div key={label} className="py-2 border-b border-zinc-800 last:border-0">
                  <p className="text-zinc-500 text-xs uppercase tracking-wider mb-1">{label}</p>
                  <p className="text-white text-sm font-semibold break-all">{value}</p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
