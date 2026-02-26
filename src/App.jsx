import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider, useAuth } from './context/AuthContext';
import Navigation from './components/Navigation';
import Sidebar from './components/Sidebar';
import Login from './pages/Login';
import Home from './pages/Home';
import Classes from './pages/Classes';
import ClassDetail from './pages/ClassDetail';
import Instructors from './pages/Instructors';
import InstructorDetail from './pages/InstructorDetail';
import Students from './pages/Students';
import StudentDetail from './pages/StudentDetail';
import Profile from './pages/Profile';

function ProtectedRoute({ children, roles }) {
  const { user } = useAuth();
  if (!user) return <Navigate to="/login" replace />;
  if (roles && !roles.includes(user.role)) return <Navigate to="/" replace />;
  return children;
}

function AppLayout() {
  const { user } = useAuth();

  if (!user) {
    return (
      <Routes>
        <Route path="/login" element={<Login />} />
        <Route path="*" element={<Navigate to="/login" replace />} />
      </Routes>
    );
  }

  return (
    <div className="bg-white min-h-screen">
      <Navigation />
      <div className="flex pt-32">
        <Sidebar />
        <main className="flex-1 ml-0 md:ml-64 bg-gray-50 min-h-screen">
          <Routes>
            <Route path="/" element={<ProtectedRoute><Home /></ProtectedRoute>} />
            <Route path="/classes" element={<ProtectedRoute><Classes /></ProtectedRoute>} />
            <Route path="/classes/:id" element={<ProtectedRoute><ClassDetail /></ProtectedRoute>} />
            <Route path="/instructors" element={<ProtectedRoute><Instructors /></ProtectedRoute>} />
            <Route path="/instructors/:id" element={<ProtectedRoute><InstructorDetail /></ProtectedRoute>} />
            <Route path="/students" element={<ProtectedRoute roles={['admin', 'instructor']}><Students /></ProtectedRoute>} />
            <Route path="/students/:id" element={<ProtectedRoute roles={['admin', 'instructor']}><StudentDetail /></ProtectedRoute>} />
            <Route path="/profile" element={<ProtectedRoute><Profile /></ProtectedRoute>} />
            <Route path="/login" element={<Navigate to="/" replace />} />
            <Route path="*" element={<Navigate to="/" replace />} />
          </Routes>
        </main>
      </div>
    </div>
  );
}

export default function App() {
  return (
    <Router>
      <AuthProvider>
        <AppLayout />
      </AuthProvider>
    </Router>
  );
}
