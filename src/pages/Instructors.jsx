import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';

const MOCK_INSTRUCTORS = [
  {
    id: '1',
    name: 'Sarah Johnson',
    style: 'Ballet',
    bio: 'Professional ballet dancer with 15 years of experience. Trained at the Royal Academy of Dance.',
    image: '👩‍🎤',
    classes: 8,
    students: 120,
    rating: 4.9,
    email: 'sarah@dancestudio.com'
  },
  {
    id: '2',
    name: 'Michael Chen',
    style: 'Contemporary',
    bio: 'Contemporary dance choreographer and performer. Has performed internationally.',
    image: '👨‍🎤',
    classes: 6,
    students: 95,
    rating: 4.8,
    email: 'michael@dancestudio.com'
  },
  {
    id: '3',
    name: 'Alex Rodriguez',
    style: 'Hip-Hop',
    bio: 'Hip-hop dancer and choreographer with a passion for street dance culture.',
    image: '👨‍🎤',
    classes: 10,
    students: 150,
    rating: 4.9,
    email: 'alex@dancestudio.com'
  },
  {
    id: '4',
    name: 'Emma Wilson',
    style: 'Jazz',
    bio: 'Jazz dance specialist with Broadway experience. Brings theatrical flair to every class.',
    image: '👩‍🎤',
    classes: 7,
    students: 110,
    rating: 4.7,
    email: 'emma@dancestudio.com'
  },
  {
    id: '5',
    name: 'Carlos Martinez',
    style: 'Salsa',
    bio: 'Professional salsa dancer and instructor. Specializes in partner dancing.',
    image: '👨‍🎤',
    classes: 9,
    students: 140,
    rating: 4.9,
    email: 'carlos@dancestudio.com'
  }
];

export default function Instructors() {
  const [searchText, setSearchText] = useState('');
  const [selectedStyle, setSelectedStyle] = useState(null);
  const navigate = useNavigate();

  const styles = ['Ballet', 'Contemporary', 'Hip-Hop', 'Jazz', 'Salsa'];

  const filteredInstructors = MOCK_INSTRUCTORS.filter((instructor) => {
    const matchesSearch =
      instructor.name.toLowerCase().includes(searchText.toLowerCase()) ||
      instructor.style.toLowerCase().includes(searchText.toLowerCase());
    const matchesStyle = !selectedStyle || instructor.style === selectedStyle;
    return matchesSearch && matchesStyle;
  });

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white shadow">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
          <h1 className="text-3xl font-bold text-gray-900">Instructors</h1>
          <p className="text-gray-600 mt-2">Meet our talented dance instructors</p>
        </div>
      </div>

      {/* Main Content */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        {/* Search Bar */}
        <div className="mb-8">
          <input
            type="text"
            placeholder="Search instructors..."
            value={searchText}
            onChange={(e) => setSearchText(e.target.value)}
            className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500"
          />
        </div>

        {/* Style Filter */}
        <div className="flex flex-wrap gap-3 mb-8">
          <button
            onClick={() => setSelectedStyle(null)}
            className={`px-4 py-2 rounded-full font-semibold transition ${
              selectedStyle === null
                ? 'bg-purple-600 text-white'
                : 'bg-white text-gray-900 border border-gray-300 hover:bg-gray-50'
            }`}
          >
            All
          </button>
          {styles.map((style) => (
            <button
              key={style}
              onClick={() => setSelectedStyle(style)}
              className={`px-4 py-2 rounded-full font-semibold transition ${
                selectedStyle === style
                  ? 'bg-purple-600 text-white'
                  : 'bg-white text-gray-900 border border-gray-300 hover:bg-gray-50'
              }`}
            >
              {style}
            </button>
          ))}
        </div>

        {/* Instructors Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredInstructors.map((instructor) => (
            <div key={instructor.id} className="bg-white rounded-lg shadow hover:shadow-lg transition overflow-hidden">
              {/* Header */}
              <div className="bg-gradient-to-r from-purple-500 to-pink-500 p-6 text-center">
                <div className="text-6xl mb-4">{instructor.image}</div>
                <h3 className="text-2xl font-bold text-white">{instructor.name}</h3>
                <p className="text-purple-100 mt-2">{instructor.style}</p>
              </div>

              {/* Content */}
              <div className="p-6">
                {/* Bio */}
                <p className="text-gray-700 text-sm mb-4 leading-relaxed">{instructor.bio}</p>

                {/* Stats */}
                <div className="grid grid-cols-3 gap-4 mb-6 py-4 border-y border-gray-200">
                  <div className="text-center">
                    <p className="text-2xl font-bold text-purple-600">{instructor.classes}</p>
                    <p className="text-xs text-gray-600">Classes</p>
                  </div>
                  <div className="text-center">
                    <p className="text-2xl font-bold text-purple-600">{instructor.students}</p>
                    <p className="text-xs text-gray-600">Students</p>
                  </div>
                  <div className="text-center">
                    <p className="text-2xl font-bold text-yellow-500">⭐ {instructor.rating}</p>
                    <p className="text-xs text-gray-600">Rating</p>
                  </div>
                </div>

                {/* Contact */}
                <div className="mb-6">
                  <p className="text-sm text-gray-600 mb-1">Email</p>
                  <p className="text-sm font-semibold text-gray-900 break-all">{instructor.email}</p>
                </div>

                {/* Action Button */}
                <button
                  onClick={() => navigate(`/instructors/${instructor.id}`)}
                  className="w-full bg-purple-600 hover:bg-purple-700 text-white font-semibold py-2 rounded-lg transition"
                >
                  View Profile
                </button>
              </div>
            </div>
          ))}
        </div>

        {/* Empty State */}
        {filteredInstructors.length === 0 && (
          <div className="text-center py-12">
            <p className="text-gray-600 text-lg">No instructors found</p>
          </div>
        )}
      </div>
    </div>
  );
}
