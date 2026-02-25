import React from 'react';
import { useParams, useNavigate } from 'react-router-dom';
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
    color: 'bg-blue-500',
    description: 'Learn the fundamentals of classical ballet. Perfect for beginners with no prior dance experience.',
    schedule: 'Every Monday at 10:00 AM',
    duration: '60 minutes',
    price: '$20/class or $80/month',
    instructorBio: 'Sarah Johnson is a professional ballet dancer with 15 years of experience. She trained at the Royal Academy of Dance.'
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
    color: 'bg-purple-500',
    description: 'Explore modern movement and expression through contemporary dance techniques.',
    schedule: 'Every Tuesday at 6:00 PM',
    duration: '75 minutes',
    price: '$25/class or $100/month',
    instructorBio: 'Michael Chen is a contemporary dance choreographer and performer. He has performed internationally and teaches movement innovation.'
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
    color: 'bg-red-500',
    description: 'High-energy hip-hop dance class. Learn cool moves and have fun with current music.',
    schedule: 'Every Wednesday at 7:00 PM',
    duration: '60 minutes',
    price: '$20/class or $80/month',
    instructorBio: 'Alex Rodriguez is a hip-hop dancer and choreographer with a passion for street dance culture and freestyle movement.'
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
    color: 'bg-yellow-500',
    description: 'Master the smooth, rhythmic movements of jazz dance with emphasis on style and technique.',
    schedule: 'Every Thursday at 5:30 PM',
    duration: '60 minutes',
    price: '$22/class or $90/month',
    instructorBio: 'Emma Wilson is a jazz dance specialist with Broadway experience. She brings theatrical flair to every class.'
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
    color: 'bg-pink-500',
    description: 'Join us for an exciting salsa night! Learn partner dancing and Latin rhythms in a fun, social atmosphere.',
    schedule: 'Every Friday at 8:00 PM',
    duration: '90 minutes',
    price: '$25/class or $100/month',
    instructorBio: 'Carlos Martinez is a professional salsa dancer and instructor. He specializes in partner dancing and Latin music interpretation.'
  }
];

export default function ClassDetail() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { user } = useAuth();

  const classData = MOCK_CLASSES.find(cls => cls.id === id);

  if (!classData) {
    return (
      <div className="min-h-screen bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
          <div className="text-center">
            <h1 className="text-4xl font-bold text-gray-900 mb-4">Class Not Found</h1>
            <p className="text-gray-600 mb-8">The class you're looking for doesn't exist.</p>
            <button
              onClick={() => navigate('/classes')}
              className="bg-purple-600 hover:bg-purple-700 text-white font-semibold py-3 px-6 rounded-lg transition"
            >
              Back to Classes
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white shadow">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
          <button
            onClick={() => navigate('/classes')}
            className="text-purple-600 hover:text-purple-700 font-semibold mb-4"
          >
            ← Back to Classes
          </button>
          <h1 className="text-4xl font-bold text-gray-900">{classData.name}</h1>
          <p className="text-gray-600 mt-2">Instructor: {classData.instructor}</p>
        </div>
      </div>

      {/* Main Content */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Main Content */}
          <div className="lg:col-span-2 space-y-8">
            {/* Class Header Card */}
            <div className="bg-white rounded-lg shadow p-8">
              <div className="flex items-start gap-6 mb-6">
                <div className={`${classData.color} w-20 h-20 rounded-lg flex items-center justify-center text-white text-3xl font-bold`}>
                  {classData.style.charAt(0)}
                </div>
                <div>
                  <h2 className="text-2xl font-bold text-gray-900 mb-2">{classData.name}</h2>
                  <div className="flex gap-3">
                    <span className="inline-block bg-purple-100 text-purple-700 text-sm font-semibold px-3 py-1 rounded-full">
                      {classData.level}
                    </span>
                    <span className="inline-block bg-yellow-100 text-yellow-700 text-sm font-semibold px-3 py-1 rounded-full">
                      {classData.style}
                    </span>
                  </div>
                </div>
              </div>

              <p className="text-gray-700 text-lg leading-relaxed">{classData.description}</p>
            </div>

            {/* Class Details */}
            <div className="bg-white rounded-lg shadow p-8">
              <h3 className="text-2xl font-bold text-gray-900 mb-6">Class Details</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <p className="text-sm text-gray-600 mb-2">Schedule</p>
                  <p className="text-lg font-semibold text-gray-900">{classData.schedule}</p>
                </div>
                <div>
                  <p className="text-sm text-gray-600 mb-2">Duration</p>
                  <p className="text-lg font-semibold text-gray-900">{classData.duration}</p>
                </div>
                <div>
                  <p className="text-sm text-gray-600 mb-2">Price</p>
                  <p className="text-lg font-semibold text-gray-900">{classData.price}</p>
                </div>
                <div>
                  <p className="text-sm text-gray-600 mb-2">Class Time</p>
                  <p className="text-lg font-semibold text-gray-900">{classData.time}</p>
                </div>
              </div>
            </div>

            {/* Instructor Info */}
            <div className="bg-white rounded-lg shadow p-8">
              <h3 className="text-2xl font-bold text-gray-900 mb-6">About the Instructor</h3>
              <div className="flex items-start gap-6">
                <div className="w-16 h-16 bg-purple-500 rounded-full flex items-center justify-center text-white text-2xl font-bold">
                  {classData.instructor.charAt(0)}
                </div>
                <div>
                  <h4 className="text-xl font-bold text-gray-900 mb-2">{classData.instructor}</h4>
                  <p className="text-gray-700 leading-relaxed">{classData.instructorBio}</p>
                </div>
              </div>
            </div>

            {/* Enrollment Info */}
            <div className="bg-white rounded-lg shadow p-8">
              <h3 className="text-2xl font-bold text-gray-900 mb-6">Enrollment Status</h3>
              <div className="space-y-4">
                <div>
                  <div className="flex justify-between text-sm mb-2">
                    <span className="text-gray-600">Spots Available</span>
                    <span className="text-gray-900 font-semibold">
                      {classData.capacity - classData.enrolled} of {classData.capacity}
                    </span>
                  </div>
                  <div className="w-full bg-gray-200 rounded-full h-3">
                    <div
                      className="bg-green-500 h-3 rounded-full"
                      style={{ width: `${(classData.enrolled / classData.capacity) * 100}%` }}
                    />
                  </div>
                </div>
                <p className="text-sm text-gray-600">
                  {classData.capacity - classData.enrolled === 0
                    ? 'This class is full. Join the waitlist?'
                    : `${classData.capacity - classData.enrolled} spots remaining`}
                </p>
              </div>
            </div>
          </div>

          {/* Sidebar */}
          <div className="lg:col-span-1">
            {/* Quick Info Card */}
            <div className="bg-white rounded-lg shadow p-6 sticky top-4 space-y-4">
              <div className="border-b border-gray-200 pb-4">
                <p className="text-sm text-gray-600 mb-1">Instructor</p>
                <p className="text-lg font-semibold text-gray-900">{classData.instructor}</p>
              </div>

              <div className="border-b border-gray-200 pb-4">
                <p className="text-sm text-gray-600 mb-1">Level</p>
                <p className="text-lg font-semibold text-gray-900">{classData.level}</p>
              </div>

              <div className="border-b border-gray-200 pb-4">
                <p className="text-sm text-gray-600 mb-1">Time</p>
                <p className="text-lg font-semibold text-gray-900">{classData.time}</p>
              </div>

              <div className="border-b border-gray-200 pb-4">
                <p className="text-sm text-gray-600 mb-1">Capacity</p>
                <p className="text-lg font-semibold text-gray-900">
                  {classData.enrolled}/{classData.capacity}
                </p>
              </div>

              {/* Action Button */}
              {user?.role === 'student' && (
                <button className="w-full bg-purple-600 hover:bg-purple-700 text-white font-semibold py-3 rounded-lg transition mt-4">
                  Enroll Now
                </button>
              )}

              {user?.role === 'instructor' && (
                <button className="w-full bg-blue-600 hover:bg-blue-700 text-white font-semibold py-3 rounded-lg transition mt-4">
                  View Roster
                </button>
              )}

              {user?.role === 'admin' && (
                <div className="space-y-2 mt-4">
                  <button className="w-full bg-blue-600 hover:bg-blue-700 text-white font-semibold py-2 rounded-lg transition text-sm">
                    Edit Class
                  </button>
                  <button className="w-full bg-red-600 hover:bg-red-700 text-white font-semibold py-2 rounded-lg transition text-sm">
                    Delete Class
                  </button>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
