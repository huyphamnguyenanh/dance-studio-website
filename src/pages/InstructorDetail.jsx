import React from 'react';
import { useParams, useNavigate } from 'react-router-dom';

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
    email: 'sarah@dancestudio.com',
    fullBio: 'Sarah Johnson is a world-renowned ballet instructor with over 15 years of professional experience. She trained at the prestigious Royal Academy of Dance and has performed with major ballet companies across Europe. Sarah is passionate about teaching classical ballet technique while fostering creativity and confidence in her students.',
    qualifications: ['Royal Academy of Dance Diploma', 'International Ballet Teacher Certification', 'Choreography Specialist'],
    schedule: 'Monday 10:00 AM - Ballet Basics\nWednesday 2:00 PM - Ballet Intermediate\nFriday 6:00 PM - Ballet Advanced',
    studentReviews: [
      { name: 'John Doe', rating: 5, comment: 'Sarah is an amazing instructor. Very patient and knowledgeable.' },
      { name: 'Jane Smith', rating: 5, comment: 'Best ballet class I have ever taken!' }
    ]
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
    email: 'michael@dancestudio.com',
    fullBio: 'Michael Chen is an innovative contemporary dance choreographer and performer. He has performed at major dance festivals internationally and brings a unique perspective to movement exploration. Michael believes in pushing boundaries and encouraging dancers to express themselves authentically.',
    qualifications: ['Contemporary Dance BFA', 'Choreography Masters', 'Movement Innovation Specialist'],
    schedule: 'Tuesday 6:00 PM - Contemporary Flow\nThursday 7:00 PM - Contemporary Advanced\nSaturday 4:00 PM - Choreography Workshop',
    studentReviews: [
      { name: 'Alex Turner', rating: 5, comment: 'Michael really helps you find your own movement style.' },
      { name: 'Sarah Lee', rating: 4, comment: 'Great instructor, very creative approach.' }
    ]
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
    email: 'alex@dancestudio.com',
    fullBio: 'Alex Rodriguez is a dynamic hip-hop instructor with deep roots in street dance culture. He has competed in numerous hip-hop battles and brings high energy and authenticity to every class. Alex is dedicated to making hip-hop accessible and fun for dancers of all levels.',
    qualifications: ['Hip-Hop Dance Certification', 'Street Dance Specialist', 'Choreography Professional'],
    schedule: 'Wednesday 7:00 PM - Hip-Hop Vibes\nFriday 8:00 PM - Hip-Hop Advanced\nSunday 5:00 PM - Freestyle Session',
    studentReviews: [
      { name: 'Marcus Johnson', rating: 5, comment: 'Alex makes learning hip-hop so much fun!' },
      { name: 'Lisa Chen', rating: 5, comment: 'Best hip-hop instructor in town!' }
    ]
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
    email: 'emma@dancestudio.com',
    fullBio: 'Emma Wilson is a seasoned jazz instructor with Broadway performance experience. She brings theatrical flair and technical precision to her classes. Emma specializes in helping dancers develop style, musicality, and confidence on stage.',
    qualifications: ['Broadway Performer', 'Jazz Dance Certification', 'Performance Coach'],
    schedule: 'Thursday 5:30 PM - Jazz Essentials\nSaturday 2:00 PM - Jazz Intermediate\nSunday 7:00 PM - Jazz Performance Class',
    studentReviews: [
      { name: 'Emma Davis', rating: 5, comment: 'Emma teaches jazz with such passion!' },
      { name: 'Tom Wilson', rating: 4, comment: 'Great technique and very encouraging.' }
    ]
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
    email: 'carlos@dancestudio.com',
    fullBio: 'Carlos Martinez is a passionate salsa instructor specializing in partner dancing and Latin music interpretation. With roots in Cuban dance traditions, Carlos brings authenticity and joy to every class. He creates a fun, social atmosphere perfect for learning salsa.',
    qualifications: ['Professional Salsa Dancer', 'Partner Dance Specialist', 'Latin Music Expert'],
    schedule: 'Friday 8:00 PM - Salsa Night\nSaturday 8:00 PM - Salsa Advanced\nSunday 6:00 PM - Salsa Social',
    studentReviews: [
      { name: 'Maria Garcia', rating: 5, comment: 'Carlos makes salsa so much fun! Great partner dancing teacher.' },
      { name: 'Juan Lopez', rating: 5, comment: 'Best salsa instructor ever!' }
    ]
  }
];

export default function InstructorDetail() {
  const { id } = useParams();
  const navigate = useNavigate();

  const instructor = MOCK_INSTRUCTORS.find(instr => instr.id === id);

  if (!instructor) {
    return (
      <div className="min-h-screen bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
          <div className="text-center">
            <h1 className="text-4xl font-bold text-gray-900 mb-4">Instructor Not Found</h1>
            <p className="text-gray-600 mb-8">The instructor you're looking for doesn't exist.</p>
            <button
              onClick={() => navigate('/instructors')}
              className="bg-purple-600 hover:bg-purple-700 text-white font-semibold py-3 px-6 rounded-lg transition"
            >
              Back to Instructors
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
            onClick={() => navigate('/instructors')}
            className="text-purple-600 hover:text-purple-700 font-semibold mb-4"
          >
            ← Back to Instructors
          </button>
          <h1 className="text-4xl font-bold text-gray-900">{instructor.name}</h1>
          <p className="text-gray-600 mt-2">{instructor.style} Specialist</p>
        </div>
      </div>

      {/* Main Content */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Main Content */}
          <div className="lg:col-span-2 space-y-8">
            {/* Profile Header */}
            <div className="bg-white rounded-lg shadow p-8">
              <div className="flex items-start gap-6 mb-6">
                <div className="text-8xl">{instructor.image}</div>
                <div>
                  <h2 className="text-3xl font-bold text-gray-900 mb-2">{instructor.name}</h2>
                  <p className="text-xl text-purple-600 font-semibold mb-4">{instructor.style} Instructor</p>
                  <div className="flex items-center gap-4">
                    <div className="flex items-center">
                      <span className="text-3xl text-yellow-500">⭐</span>
                      <span className="text-2xl font-bold text-gray-900 ml-2">{instructor.rating}</span>
                    </div>
                    <div className="text-gray-600">
                      <p className="font-semibold">{instructor.students} Students</p>
                      <p className="text-sm">{instructor.classes} Classes</p>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Bio */}
            <div className="bg-white rounded-lg shadow p-8">
              <h3 className="text-2xl font-bold text-gray-900 mb-4">About</h3>
              <p className="text-gray-700 leading-relaxed text-lg">{instructor.fullBio}</p>
            </div>

            {/* Qualifications */}
            <div className="bg-white rounded-lg shadow p-8">
              <h3 className="text-2xl font-bold text-gray-900 mb-4">Qualifications</h3>
              <ul className="space-y-3">
                {instructor.qualifications.map((qual, index) => (
                  <li key={index} className="flex items-start gap-3">
                    <span className="text-purple-600 font-bold text-xl mt-1">✓</span>
                    <span className="text-gray-700">{qual}</span>
                  </li>
                ))}
              </ul>
            </div>

            {/* Schedule */}
            <div className="bg-white rounded-lg shadow p-8">
              <h3 className="text-2xl font-bold text-gray-900 mb-4">Class Schedule</h3>
              <div className="bg-gray-50 p-6 rounded-lg">
                <p className="text-gray-700 whitespace-pre-line font-mono">{instructor.schedule}</p>
              </div>
            </div>

            {/* Student Reviews */}
            <div className="bg-white rounded-lg shadow p-8">
              <h3 className="text-2xl font-bold text-gray-900 mb-6">Student Reviews</h3>
              <div className="space-y-6">
                {instructor.studentReviews.map((review, index) => (
                  <div key={index} className="border-b border-gray-200 pb-6 last:border-b-0">
                    <div className="flex items-center gap-2 mb-2">
                      <p className="font-semibold text-gray-900">{review.name}</p>
                      <div className="flex gap-1">
                        {[...Array(review.rating)].map((_, i) => (
                          <span key={i} className="text-yellow-500">⭐</span>
                        ))}
                      </div>
                    </div>
                    <p className="text-gray-700">{review.comment}</p>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Sidebar */}
          <div className="lg:col-span-1">
            <div className="bg-white rounded-lg shadow p-6 sticky top-4 space-y-4">
              <div className="border-b border-gray-200 pb-4">
                <p className="text-sm text-gray-600 mb-1">Specialty</p>
                <p className="text-lg font-semibold text-gray-900">{instructor.style}</p>
              </div>

              <div className="border-b border-gray-200 pb-4">
                <p className="text-sm text-gray-600 mb-1">Email</p>
                <p className="text-sm font-semibold text-gray-900 break-all">{instructor.email}</p>
              </div>

              <div className="border-b border-gray-200 pb-4">
                <p className="text-sm text-gray-600 mb-1">Rating</p>
                <p className="text-lg font-semibold text-gray-900">⭐ {instructor.rating}</p>
              </div>

              <div className="border-b border-gray-200 pb-4">
                <p className="text-sm text-gray-600 mb-1">Classes</p>
                <p className="text-lg font-semibold text-gray-900">{instructor.classes}</p>
              </div>

              <div className="pb-4">
                <p className="text-sm text-gray-600 mb-1">Total Students</p>
                <p className="text-lg font-semibold text-gray-900">{instructor.students}</p>
              </div>

              <button className="w-full bg-purple-600 hover:bg-purple-700 text-white font-semibold py-3 rounded-lg transition">
                Book a Class
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
