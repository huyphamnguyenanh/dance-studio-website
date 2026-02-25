import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { getClasses, updateClass, getInstructors, getStudents } from '../data/store';
import { FormField, Input, Select, Textarea } from '../components/FormField';

const STYLES = ['Ballet', 'Contemporary', 'Hip-Hop', 'Jazz', 'Salsa', 'Tap', 'Ballroom', 'Other'];
const LEVELS = ['Beginner', 'Intermediate', 'Advanced', 'All Levels'];
const DAYS = ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday'];

export default function ClassDetail() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { user } = useAuth();
  const [cls, setCls] = useState(null);
  const [instructors, setInstructors] = useState([]);
  const [students, setStudents] = useState([]);
  const [editing, setEditing] = useState(false);
  const [form, setForm] = useState({});
  const [saved, setSaved] = useState(false);
  const canManage = user?.role === 'admin' || user?.role === 'instructor';

  useEffect(() => {
    const found = getClasses().find(c => c.id === id);
    if (!found) return;
    setCls(found);
    setForm(found);
    setInstructors(getInstructors());
    setStudents(getStudents().filter(s => s.enrolledClasses?.includes(id)));
  }, [id]);

  if (!cls) {
    return (
      <div className="min-h-screen bg-black flex items-center justify-center">
        <div className="text-center">
          <p className="text-zinc-500 text-lg mb-4">Class not found</p>
          <button onClick={() => navigate('/classes')} className="text-yellow-400 font-bold hover:text-yellow-300 transition">
            ← Back to Classes
          </button>
        </div>
      </div>
    );
  }

  const instructor = instructors.find(i => i.id === cls.instructorId);
  const pct = Math.round((cls.enrolled / cls.capacity) * 100);

  const handleSave = (e) => {
    e.preventDefault();
    updateClass(id, { ...form, capacity: Number(form.capacity), price: Number(form.price), duration: Number(form.duration) });
    const updated = getClasses().find(c => c.id === id);
    setCls(updated);
    setEditing(false);
    setSaved(true);
    setTimeout(() => setSaved(false), 2500);
  };

  return (
    <div className="min-h-screen bg-black text-white">
      <div className="max-w-7xl mx-auto px-6 py-10">
        {/* Breadcrumb */}
        <button onClick={() => navigate('/classes')} className="text-zinc-500 hover:text-yellow-400 text-xs font-bold tracking-widest uppercase mb-6 transition">
          ← Back to Classes
        </button>

        {saved && (
          <div className="bg-green-900/40 border border-green-700 text-green-300 text-sm px-4 py-3 rounded-lg mb-6">
            Class updated successfully!
          </div>
        )}

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Main */}
          <div className="lg:col-span-2 space-y-6">
            {/* Header card */}
            <div className="bg-zinc-900 border border-zinc-800 rounded-2xl overflow-hidden">
              <div className="h-1.5 bg-yellow-400" />
              <div className="p-8">
                {editing ? (
                  <form onSubmit={handleSave} className="space-y-4">
                    <FormField label="Class Name *">
                      <Input value={form.name} onChange={e => setForm({ ...form, name: e.target.value })} required />
                    </FormField>
                    <FormField label="Instructor">
                      <Select value={form.instructorId} onChange={e => setForm({ ...form, instructorId: e.target.value })}>
                        <option value="">Select instructor</option>
                        {instructors.map(i => <option key={i.id} value={i.id}>{i.name}</option>)}
                      </Select>
                    </FormField>
                    <div className="grid grid-cols-2 gap-3">
                      <FormField label="Style *">
                        <Select value={form.style} onChange={e => setForm({ ...form, style: e.target.value })}>
                          {STYLES.map(s => <option key={s}>{s}</option>)}
                        </Select>
                      </FormField>
                      <FormField label="Level *">
                        <Select value={form.level} onChange={e => setForm({ ...form, level: e.target.value })}>
                          {LEVELS.map(l => <option key={l}>{l}</option>)}
                        </Select>
                      </FormField>
                    </div>
                    <div className="grid grid-cols-2 gap-3">
                      <FormField label="Day *">
                        <Select value={form.day} onChange={e => setForm({ ...form, day: e.target.value })}>
                          {DAYS.map(d => <option key={d}>{d}</option>)}
                        </Select>
                      </FormField>
                      <FormField label="Time *">
                        <Input type="time" value={form.time} onChange={e => setForm({ ...form, time: e.target.value })} />
                      </FormField>
                    </div>
                    <div className="grid grid-cols-3 gap-3">
                      <FormField label="Duration (min)">
                        <Input type="number" min="30" value={form.duration} onChange={e => setForm({ ...form, duration: e.target.value })} />
                      </FormField>
                      <FormField label="Capacity">
                        <Input type="number" min="1" value={form.capacity} onChange={e => setForm({ ...form, capacity: e.target.value })} />
                      </FormField>
                      <FormField label="Price ($)">
                        <Input type="number" min="0" value={form.price} onChange={e => setForm({ ...form, price: e.target.value })} />
                      </FormField>
                    </div>
                    <FormField label="Description">
                      <Textarea value={form.description} onChange={e => setForm({ ...form, description: e.target.value })} />
                    </FormField>
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
                    <div className="flex items-start justify-between mb-4">
                      <div>
                        <h1 className="text-3xl font-black tracking-tight">{cls.name}</h1>
                        <p className="text-zinc-500 mt-1">{instructor?.name || 'Instructor TBD'}</p>
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
                    <div className="flex flex-wrap gap-2 mb-4">
                      <span className="text-xs text-zinc-400 bg-zinc-800 px-3 py-1 rounded-full">{cls.style}</span>
                      <span className="text-xs text-zinc-400 bg-zinc-800 px-3 py-1 rounded-full">{cls.level}</span>
                      <span className="text-xs text-zinc-400 bg-zinc-800 px-3 py-1 rounded-full">{cls.day} · {cls.time}</span>
                      <span className="text-xs text-zinc-400 bg-zinc-800 px-3 py-1 rounded-full">{cls.duration} min</span>
                    </div>
                    <p className="text-zinc-400 leading-relaxed">{cls.description}</p>
                  </>
                )}
              </div>
            </div>

            {/* Enrolled students */}
            <div className="bg-zinc-900 border border-zinc-800 rounded-2xl p-6">
              <h2 className="text-white font-black tracking-wide uppercase mb-5">Enrolled Students ({students.length})</h2>
              {students.length === 0 ? (
                <p className="text-zinc-600 text-sm">No students enrolled yet</p>
              ) : (
                <div className="space-y-3">
                  {students.map(s => (
                    <div key={s.id} className="flex items-center justify-between py-3 border-b border-zinc-800 last:border-0">
                      <div>
                        <p className="text-white font-semibold text-sm">{s.name}</p>
                        <p className="text-zinc-500 text-xs">{s.email}</p>
                      </div>
                      <div className="text-right">
                        <span className="text-xs text-zinc-400 bg-zinc-800 px-2 py-1 rounded-full">{s.level}</span>
                        <p className="text-xs text-green-400 mt-1">{s.attendance}% attendance</p>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>

          {/* Sidebar */}
          <div className="space-y-5">
            {/* Quick info */}
            <div className="bg-zinc-900 border border-zinc-800 rounded-2xl p-6 space-y-4">
              <h3 className="text-white font-black tracking-wide uppercase text-sm mb-4">Class Info</h3>
              {[
                { label: 'Price', value: `$${cls.price}/class` },
                { label: 'Duration', value: `${cls.duration} minutes` },
                { label: 'Day', value: cls.day },
                { label: 'Time', value: cls.time },
                { label: 'Capacity', value: `${cls.enrolled}/${cls.capacity}` },
              ].map(({ label, value }) => (
                <div key={label} className="flex justify-between items-center py-2 border-b border-zinc-800 last:border-0">
                  <span className="text-zinc-500 text-xs uppercase tracking-wider">{label}</span>
                  <span className="text-white font-semibold text-sm">{value}</span>
                </div>
              ))}
              {/* Enrollment bar */}
              <div>
                <div className="flex justify-between text-xs text-zinc-500 mb-1.5">
                  <span>Enrollment</span>
                  <span>{pct}%</span>
                </div>
                <div className="h-1.5 bg-zinc-800 rounded-full overflow-hidden">
                  <div className={`h-full rounded-full ${pct >= 100 ? 'bg-red-500' : 'bg-yellow-400'}`} style={{ width: `${pct}%` }} />
                </div>
              </div>
              {user?.role === 'student' && (
                <button className="w-full bg-yellow-400 hover:bg-yellow-300 text-black font-black tracking-widest uppercase py-3 rounded-lg transition text-sm mt-2">
                  Enroll Now
                </button>
              )}
            </div>

            {/* Instructor card */}
            {instructor && (
              <div className="bg-zinc-900 border border-zinc-800 rounded-2xl p-6">
                <h3 className="text-white font-black tracking-wide uppercase text-sm mb-4">Instructor</h3>
                <div className="flex items-center gap-3 mb-3">
                  <div className="w-10 h-10 bg-yellow-400 rounded-full flex items-center justify-center text-black font-black text-sm">
                    {instructor.name.charAt(0)}
                  </div>
                  <div>
                    <p className="text-white font-bold text-sm">{instructor.name}</p>
                    <p className="text-zinc-500 text-xs">{instructor.style}</p>
                  </div>
                </div>
                <p className="text-zinc-500 text-xs leading-relaxed">{instructor.bio}</p>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
