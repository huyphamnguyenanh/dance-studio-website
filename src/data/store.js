// Centralized data store with localStorage persistence

const DEFAULT_INSTRUCTORS = [
  { id: '1', name: 'Sarah Johnson', style: 'Ballet', level: 'Senior Instructor', email: 'sarah@studio.com', phone: '+1 234 567 8901', bio: 'Trained at the Royal Academy of Dance with 15 years of professional experience.', classes: 3, students: 120, rating: 4.9, active: true },
  { id: '2', name: 'Michael Chen', style: 'Contemporary', level: 'Lead Instructor', email: 'michael@studio.com', phone: '+1 234 567 8902', bio: 'International choreographer and performer specializing in contemporary movement.', classes: 2, students: 95, rating: 4.8, active: true },
  { id: '3', name: 'Alex Rodriguez', style: 'Hip-Hop', level: 'Instructor', email: 'alex@studio.com', phone: '+1 234 567 8903', bio: 'Street dance culture specialist with roots in competitive hip-hop.', classes: 4, students: 150, rating: 4.9, active: true },
  { id: '4', name: 'Emma Wilson', style: 'Jazz', level: 'Senior Instructor', email: 'emma@studio.com', phone: '+1 234 567 8904', bio: 'Broadway performer bringing theatrical flair to jazz dance.', classes: 3, students: 110, rating: 4.7, active: true },
  { id: '5', name: 'Carlos Martinez', style: 'Salsa', level: 'Instructor', email: 'carlos@studio.com', phone: '+1 234 567 8905', bio: 'Latin dance specialist with deep roots in Cuban dance traditions.', classes: 3, students: 140, rating: 4.9, active: true },
];

const DEFAULT_CLASSES = [
  { id: '1', name: 'Ballet Basics', instructorId: '1', style: 'Ballet', level: 'Beginner', day: 'Monday', time: '10:00 AM', duration: 60, capacity: 20, enrolled: 18, price: 20, description: 'Learn the fundamentals of classical ballet. Perfect for beginners with no prior dance experience.', active: true },
  { id: '2', name: 'Ballet Intermediate', instructorId: '1', style: 'Ballet', level: 'Intermediate', day: 'Wednesday', time: '2:00 PM', duration: 75, capacity: 15, enrolled: 12, price: 25, description: 'Build on ballet fundamentals with more complex techniques and combinations.', active: true },
  { id: '3', name: 'Contemporary Flow', instructorId: '2', style: 'Contemporary', level: 'Intermediate', day: 'Tuesday', time: '6:00 PM', duration: 75, capacity: 25, enrolled: 22, price: 25, description: 'Explore modern movement and expression through contemporary dance techniques.', active: true },
  { id: '4', name: 'Hip-Hop Vibes', instructorId: '3', style: 'Hip-Hop', level: 'Beginner', day: 'Wednesday', time: '7:00 PM', duration: 60, capacity: 30, enrolled: 28, price: 20, description: 'High-energy hip-hop dance class. Learn cool moves and have fun with current music.', active: true },
  { id: '5', name: 'Hip-Hop Advanced', instructorId: '3', style: 'Hip-Hop', level: 'Advanced', day: 'Friday', time: '8:00 PM', duration: 90, capacity: 20, enrolled: 18, price: 30, description: 'Advanced hip-hop choreography and freestyle techniques for experienced dancers.', active: true },
  { id: '6', name: 'Jazz Essentials', instructorId: '4', style: 'Jazz', level: 'Intermediate', day: 'Thursday', time: '5:30 PM', duration: 60, capacity: 20, enrolled: 15, price: 22, description: 'Master the smooth, rhythmic movements of jazz dance with emphasis on style and technique.', active: true },
  { id: '7', name: 'Salsa Night', instructorId: '5', style: 'Salsa', level: 'All Levels', day: 'Friday', time: '8:00 PM', duration: 90, capacity: 35, enrolled: 32, price: 25, description: 'Partner dancing and Latin rhythms in a fun, social atmosphere.', active: true },
];

const DEFAULT_STUDENTS = [
  { id: '1', name: 'Emma Davis', email: 'emma.d@email.com', phone: '+1 234 567 1001', level: 'Beginner', enrolledClasses: ['1', '4'], joinDate: '2024-01-15', attendance: 92, active: true },
  { id: '2', name: 'James Wilson', email: 'james.w@email.com', phone: '+1 234 567 1002', level: 'Intermediate', enrolledClasses: ['3', '6'], joinDate: '2024-02-01', attendance: 88, active: true },
  { id: '3', name: 'Sofia Garcia', email: 'sofia.g@email.com', phone: '+1 234 567 1003', level: 'Advanced', enrolledClasses: ['5', '7'], joinDate: '2023-11-20', attendance: 95, active: true },
  { id: '4', name: 'Lucas Kim', email: 'lucas.k@email.com', phone: '+1 234 567 1004', level: 'Beginner', enrolledClasses: ['1'], joinDate: '2024-03-10', attendance: 80, active: true },
  { id: '5', name: 'Mia Thompson', email: 'mia.t@email.com', phone: '+1 234 567 1005', level: 'Intermediate', enrolledClasses: ['2', '6'], joinDate: '2024-01-28', attendance: 97, active: true },
  { id: '6', name: 'Noah Brown', email: 'noah.b@email.com', phone: '+1 234 567 1006', level: 'Beginner', enrolledClasses: ['4', '7'], joinDate: '2024-04-05', attendance: 75, active: true },
  { id: '7', name: 'Ava Martinez', email: 'ava.m@email.com', phone: '+1 234 567 1007', level: 'Advanced', enrolledClasses: ['3', '5'], joinDate: '2023-09-15', attendance: 99, active: true },
  { id: '8', name: 'Ethan Lee', email: 'ethan.l@email.com', phone: '+1 234 567 1008', level: 'Intermediate', enrolledClasses: ['2', '3'], joinDate: '2024-02-20', attendance: 85, active: true },
];

function load(key, defaults) {
  try {
    const stored = localStorage.getItem(key);
    return stored ? JSON.parse(stored) : defaults;
  } catch {
    return defaults;
  }
}

function save(key, data) {
  localStorage.setItem(key, JSON.stringify(data));
}

function generateId() {
  return Date.now().toString(36) + Math.random().toString(36).substr(2);
}

// Instructors
export const getInstructors = () => load('instructors', DEFAULT_INSTRUCTORS);
export const saveInstructors = (data) => save('instructors', data);
export const addInstructor = (instructor) => {
  const all = getInstructors();
  const newItem = { ...instructor, id: generateId(), classes: 0, students: 0, rating: 5.0, active: true };
  saveInstructors([...all, newItem]);
  return newItem;
};
export const updateInstructor = (id, updates) => {
  const all = getInstructors().map(i => i.id === id ? { ...i, ...updates } : i);
  saveInstructors(all);
};
export const deleteInstructor = (id) => {
  saveInstructors(getInstructors().filter(i => i.id !== id));
};

// Classes
export const getClasses = () => load('classes', DEFAULT_CLASSES);
export const saveClasses = (data) => save('classes', data);
export const addClass = (cls) => {
  const all = getClasses();
  const newItem = { ...cls, id: generateId(), enrolled: 0, active: true };
  saveClasses([...all, newItem]);
  return newItem;
};
export const updateClass = (id, updates) => {
  const all = getClasses().map(c => c.id === id ? { ...c, ...updates } : c);
  saveClasses(all);
};
export const deleteClass = (id) => {
  saveClasses(getClasses().filter(c => c.id !== id));
};

// Students
export const getStudents = () => load('students', DEFAULT_STUDENTS);
export const saveStudents = (data) => save('students', data);
export const addStudent = (student) => {
  const all = getStudents();
  const newItem = { ...student, id: generateId(), enrolledClasses: [], attendance: 100, active: true };
  saveStudents([...all, newItem]);
  return newItem;
};
export const updateStudent = (id, updates) => {
  const all = getStudents().map(s => s.id === id ? { ...s, ...updates } : s);
  saveStudents(all);
};
export const deleteStudent = (id) => {
  saveStudents(getStudents().filter(s => s.id !== id));
};
