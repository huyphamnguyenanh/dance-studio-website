import React, { useState } from 'react';
import { useAuth } from '../context/AuthContext';

const MOCK_CLASSES = [
  {
    id: '1',
    name: 'Ballet Basics',
    instructor: 'Sarah Johnson',
    style: 'Ballet',
    level: 'Beginner',
    time: 'Mon 10:00 AM',
    capacity: 20,
    enrolled: 18,
    color: 'bg-blue-500'
  },
  {
    id: '2',
    name: 'Contemporary Flow',
    instructor: 'Michael Chen',
    style: 'Contemporary',
    level: 'Intermediate',
    time: 'Tue 6:00 PM',
    capacity: 25,
    enrolled: 22,
    color: 'bg-purple-500'
  },
  {
    id: '3',
    name: 'Hip-Hop Vibes',
    instructor: 'Alex Rodriguez',
    style: 'Hip-Hop',
    level: 'Beginner',
    time: 'Wed 7:00 PM',
    capacity: 30,
    enrolled: 28,
    color: 'bg-red-500'
  },
  {
    id: '4',
    name: 'Jazz Essentials',
    instructor: 'Emma Wilson',
    style: 'Jazz',
    level: 'Intermediate',
    time: 'Thu 5:30 PM',
    capacity: 20,
    enrolled: 15,
    color: 'bg-yellow-500'
  },
  {
    id: '5',
    name: 'Salsa Night',
    instructor: 'Carlos Martinez',
    style: 'Salsa',
    level: 'All Levels',
    time: 'Fri 8:00 PM',
    capacity: 35,
    enrolled: 32,
    color: 'bg-pink-500'
  }
];

export default function Classes() {
  const { user } = useAuth();
  const [searchText, setSearchText] = useState('');
  const [selectedStyle, setSelectedStyle] = useState(null);

  const styles = ['Ballet', 'Contemporary', 'Hip-Hop', 'Jazz', 'Salsa'];

  const filteredClasses = MOCK_CLASSES.filter((cls) => {
    const matchesSearch =
      cls.name.toLowerCase().includes(searchText.toLowerCase()) ||
      cls.instructor.toLowerCase().includes(searchText.toLowerCase());
    const matchesStyle = !selectedStyle || cls.style === selectedStyle;
    return matchesSearch && matchesStyle;
  });

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white shadow">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
          <h1 className="text-3xl font-bold text-gray-900">
            {user?.role === 'student' ? 'Browse Classes' : 'Classes'}
          </h1>
        </div>
      </div>

      {/* Main Content */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        {/* Search Bar */}
        <div className="mb-8">
          <input
            type="text"
            placeholder="Search classes or instructors..."
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

        {/* Classes Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredClasses.map((cls) => (
            <div key={cls.id} className="bg-white rounded-lg shadow hover:shadow-lg transition">
              <div className="p-6">
                {/* Header */}
                <div className="flex items-start gap-4 mb-4">
                  <div className={`${cls.color} w-12 h-12 rounded-lg flex items-center justify-center text-white font-bold`}>
                    {cls.style.charAt(0)}
                  </div>
                  <div className="flex-1">
                    <h3 className="text-lg font-semibold text-gray-900">{cls.name}</h3>
                    <p className="text-sm text-gray-600">{cls.instructor}</p>
                  </div>
                </div>

                {/* Details */}
                <div className="space-y-3 mb-4">
                  <div className="flex gap-2">
                    <span className="inline-block bg-purple-100 text-purple-700 text-xs font-semibold px-3 py-1 rounded-full">
                      {cls.level}
                    </span>
                    <span className="inline-block bg-yellow-100 text-yellow-700 text-xs font-semibold px-3 py-1 rounded-full">
                      {cls.time}
                    </span>
                  </div>

                  {/* Capacity */}
                  <div>
                    <div className="flex justify-between text-sm mb-2">
                      <span className="text-gray-600">Enrollment</span>
                      <span className="text-gray-900 font-semibold">
                        {cls.enrolled}/{cls.capacity}
                      </span>
                    </div>
                    <div className="w-full bg-gray-200 rounded-full h-2">
                      <div
                        className="bg-green-500 h-2 rounded-full"
                        style={{ width: `${(cls.enrolled / cls.capacity) * 100}%` }}
                      />
                    </div>
                  </div>
                </div>

                {/* Action Button */}
                {user?.role === 'student' && (
                  <button className="w-full bg-purple-600 hover:bg-purple-700 text-white font-semibold py-2 rounded-lg transition">
                    Enroll Now
                  </button>
                )}
              </div>
            </div>
          ))}
        </div>

        {/* Empty State */}
        {filteredClasses.length === 0 && (
          <div className="text-center py-12">
            <p className="text-gray-600 text-lg">No classes found</p>
          </div>
        )}
      </div>
    </div>
  );
}
