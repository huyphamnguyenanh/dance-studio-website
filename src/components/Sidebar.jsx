import React, { useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

const SIDEBAR_SECTIONS = [
  {
    title: 'AUTHENTICATION AND AUTHORIZATION',
    items: [
      { label: 'Groups', path: '#' },
      { label: 'Users', path: '#' },
    ]
  },
  {
    title: 'STUDIO',
    items: [
      { label: 'Class sessions', path: '/classes' },
      { label: 'Class templates', path: '#' },
      { label: 'Dance styles', path: '#' },
      { label: 'Enrollments', path: '#' },
      { label: 'Instructors', path: '/instructors' },
      { label: 'Packages', path: '#' },
      { label: 'Student packages', path: '#' },
      { label: 'Students', path: '/students' },
    ]
  }
];

export default function Sidebar() {
  const { user } = useAuth();
  const location = useLocation();
  const [searchFilter, setSearchFilter] = useState('');
  const [collapsed, setCollapsed] = useState(false);

  const isActive = (path) => location.pathname === path;

  const filteredSections = SIDEBAR_SECTIONS.map(section => ({
    ...section,
    items: section.items.filter(item =>
      item.label.toLowerCase().includes(searchFilter.toLowerCase())
    )
  })).filter(section => section.items.length > 0 || !searchFilter);

  // Hide sidebar for students
  if (user?.role === 'student') return null;

  return (
    <aside className={`fixed left-0 top-16 bottom-0 bg-gray-50 border-r border-gray-200 transition-all duration-300 ${collapsed ? 'w-0 overflow-hidden' : 'w-64'} z-40`}>
      <div className="h-full overflow-y-auto flex flex-col">
        {/* Search */}
        <div className="p-4 border-b border-gray-200">
          <input
            type="text"
            placeholder="Start typing to filter..."
            value={searchFilter}
            onChange={(e) => setSearchFilter(e.target.value)}
            className="w-full px-3 py-2 text-sm border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-teal-500 bg-white"
          />
        </div>

        {/* Sections */}
        <div className="flex-1 overflow-y-auto">
          {filteredSections.map((section, idx) => (
            <div key={idx} className="mb-0">
              {/* Section Header */}
              <div className="bg-teal-700 text-white px-4 py-3 text-xs font-bold uppercase tracking-wide">
                {section.title}
              </div>

              {/* Section Items */}
              <div className="border-b border-gray-200">
                {section.items.map((item, itemIdx) => (
                  <Link
                    key={itemIdx}
                    to={item.path}
                    className={`block px-4 py-3 text-sm border-b border-gray-100 transition ${
                      isActive(item.path)
                        ? 'bg-yellow-100 text-gray-900 font-medium'
                        : 'text-teal-700 hover:bg-gray-100 hover:text-gray-900'
                    }`}
                  >
                    <div className="flex items-center justify-between">
                      <span className="underline">{item.label}</span>
                      {item.path !== '#' && (
                        <span className="text-green-600 font-bold text-lg">+</span>
                      )}
                    </div>
                  </Link>
                ))}
              </div>
            </div>
          ))}
        </div>

        {/* Collapse Button */}
        <div className="p-3 border-t border-gray-200">
          <button
            onClick={() => setCollapsed(!collapsed)}
            className="w-full text-left text-xs text-gray-500 hover:text-gray-700 font-medium py-2 px-3 rounded-md hover:bg-gray-100 transition"
          >
            {collapsed ? '→' : '←'} {collapsed ? '' : 'Collapse'}
          </button>
        </div>
      </div>
    </aside>
  );
}
