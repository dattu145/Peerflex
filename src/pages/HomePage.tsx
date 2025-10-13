import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import Layout from '../components/layout/Layout';
import HeroSection3D from '../components/home/HeroSection3D';
import InteractiveMap from '../components/map/InteractiveMap';

import {
  BookOpen,
  MessageCircle,
  Briefcase,
  Calendar,
  Github,
  FileText,
  Sparkles,
  ArrowRight,
  Zap,
  Users,
  TrendingUp,
  MapPin,
  Navigation
} from 'lucide-react';
import Button from '../components/ui/Button';

const HomePage: React.FC = () => {
  const [activeTab, setActiveTab] = useState<'events' | 'users' | 'hangouts'>('events');
  const [cursorVariant, setCursorVariant] = useState('default');

  const features = [
    {
      icon: BookOpen,
      title: 'Notes Sharing',
      description: 'Share and discover study notes from students worldwide',
      gradient: 'bg-purple-600',
      link: '/notes'
    },
    {
      icon: MessageCircle,
      title: 'Student Chat',
      description: 'Direct messaging and group chats with classmates',
      gradient: 'bg-purple-600',
      link: '/chat'
    },
    {
      icon: Briefcase,
      title: 'Job Listings',
      description: 'Find internships with auto-apply integration',
      gradient: 'bg-purple-600',
      link: '/jobs'
    },
    {
      icon: Calendar,
      title: 'Events & Hangouts',
      description: 'Join workshops, study groups, and social events',
      gradient: 'bg-purple-600',
      link: '/events'
    },
    {
      icon: Github,
      title: 'Open Source',
      description: 'Contribute to student-led open source projects',
      gradient: 'bg-purple-600',
      link: '/projects'
    },
    {
      icon: FileText,
      title: 'Resume Builder',
      description: 'Create professional resumes with AI assistance',
      gradient: 'bg-purple-600',
      link: '/resume-templates'
    }
  ];

  // Mock data for map markers
  const mapData = {
    events: [
      {
        id: 1,
        title: 'Tech Workshop',
        location: { lat: 40.7128, lng: -74.0060 },
        type: 'workshop',
        date: '2024-01-15'
      },
      {
        id: 2,
        title: 'Study Group Meetup',
        location: { lat: 40.7589, lng: -73.9851 },
        type: 'study',
        date: '2024-01-20'
      }
    ],
    users: [
      {
        id: 1,
        name: 'John Doe',
        location: { lat: 40.7282, lng: -73.7949 },
        status: 'online',
        major: 'Computer Science'
      },
      {
        id: 2,
        name: 'Jane Smith',
        location: { lat: 40.7505, lng: -73.9934 },
        status: 'offline',
        major: 'Business'
      }
    ],
    hangouts: [
      {
        id: 1,
        title: 'Coffee Chat',
        location: { lat: 40.7614, lng: -73.9776 },
        type: 'social',
        participants: 5
      }
    ]
  };

  const handleMouseEnter = () => setCursorVariant('hover');
  const handleMouseLeave = () => setCursorVariant('default');

  return (
    <Layout>
      
      <div className="min-h-screen bg-gradient-to-br from-purple-50 via-white to-purple-50 dark:from-gray-900 dark:via-gray-800 dark:to-gray-900 overflow-hidden relative">

        <HeroSection3D />

        {/* Features Section */}
        <section className="py-20 px-4 sm:px-6 lg:px-8 relative z-10">
          <div className="max-w-7xl mx-auto">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              className="text-center mb-16"
            >
              <h2 className="text-4xl md:text-5xl font-bold text-gray-900 dark:text-white mb-4">
                Everything You Need, One Place
              </h2>
              <p className="text-xl text-gray-600 dark:text-gray-300">
                Powerful features designed specifically for students
              </p>
            </motion.div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {features.map((feature, index) => (
                <motion.div
                  key={feature.title}
                  initial={{ opacity: 0, y: 30 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: index * 0.2 }}
                  whileHover={{ 
                    y: -10, 
                    scale: 1.02,
                    transition: { duration: 0.2 } 
                  }}
                  onMouseEnter={handleMouseEnter}
                  onMouseLeave={handleMouseLeave}
                >
                  <Link to={feature.link}>
                    <div className="relative group">
                      <div className="absolute transition-opacity duration-300 rounded-2xl blur-xl" />
                      <div className="relative bg-white dark:bg-gray-800 rounded-2xl p-8 shadow-lg hover:shadow-2xl transition-all duration-300 border-2 border-gray-100 dark:border-gray-700 group-hover:border-transparent backdrop-blur-sm">
                        <div className={`inline-flex p-3 rounded-xl ${feature.gradient} mb-4`}>
                          <feature.icon className="h-8 w-8 text-white" />
                        </div>
                        <h3 className="text-2xl font-bold text-gray-900 dark:text-white mb-2">
                          {feature.title}
                        </h3>
                        <p className="text-gray-600 dark:text-gray-300 mb-4">
                          {feature.description}
                        </p>
                        <div className="flex items-center text-blue-600 dark:text-blue-400 font-semibold group-hover:gap-1 transition-all">
                          Explore
                          <ArrowRight className="h-4 w-4 ml-2 group-hover:translate-x-1 transition-transform" />
                        </div>
                      </div>
                    </div>
                  </Link>
                </motion.div>
              ))}
            </div>
          </div>
        </section>

        {/* Interactive Map Section */}
        <section className="py-20 px-4 sm:px-6 lg:px-8 relative z-10">
          <div className="max-w-7xl mx-auto">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              className="text-center mb-12"
            >
              <div className="inline-flex items-center gap-3 px-6 py-3 bg-purple-100 dark:bg-purple-900/30 rounded-full mb-6">
                <MapPin className="h-6 w-6 text-purple-600 dark:text-purple-400" />
                <span className="text-lg font-semibold text-purple-900 dark:text-purple-300">
                  Campus Network Map
                </span>
              </div>
              <h2 className="text-4xl md:text-5xl font-bold text-gray-900 dark:text-white mb-4">
                Explore Your Campus Community
              </h2>
              <p className="text-xl text-gray-600 dark:text-gray-300 max-w-3xl mx-auto">
                Discover events, connect with peers, and find hangout spots across campus
              </p>
            </motion.div>

            {/* Map Controls */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: 0.2 }}
              className="flex flex-wrap justify-center gap-4 mb-8"
            >
              <button
                onClick={() => setActiveTab('events')}
                className={`px-6 py-3 rounded-full font-semibold transition-all duration-300 flex items-center gap-2 ${
                  activeTab === 'events'
                    ? 'bg-purple-600 text-white shadow-lg'
                    : 'bg-white dark:bg-gray-800 text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-700'
                }`}
              >
                <Calendar className="h-5 w-5" />
                Events
              </button>
              <button
                onClick={() => setActiveTab('users')}
                className={`px-6 py-3 rounded-full font-semibold transition-all duration-300 flex items-center gap-2 ${
                  activeTab === 'users'
                    ? 'bg-blue-600 text-white shadow-lg'
                    : 'bg-white dark:bg-gray-800 text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-700'
                }`}
              >
                <Users className="h-5 w-5" />
                All Users
              </button>
              <button
                onClick={() => setActiveTab('hangouts')}
                className={`px-6 py-3 rounded-full font-semibold transition-all duration-300 flex items-center gap-2 ${
                  activeTab === 'hangouts'
                    ? 'bg-green-600 text-white shadow-lg'
                    : 'bg-white dark:bg-gray-800 text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-700'
                }`}
              >
                <Navigation className="h-5 w-5" />
                Hangouts
              </button>
            </motion.div>

            {/* Interactive Map Component */}
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              whileInView={{ opacity: 1, scale: 1 }}
              viewport={{ once: true }}
              transition={{ delay: 0.4 }}
              className="bg-white dark:bg-gray-800 rounded-3xl shadow-2xl overflow-hidden border-2 border-gray-200 dark:border-gray-700"
            >
              <InteractiveMap
                data={mapData[activeTab]}
                type={activeTab}
                className="h-96 w-full"
              />
              
              {/* Map Legend */}
              <div className="p-6 bg-gray-50 dark:bg-gray-900 border-t border-gray-200 dark:border-gray-700">
                <div className="flex flex-wrap gap-6 justify-center text-sm">
                  <div className="flex items-center gap-2">
                    <div className="w-3 h-3 bg-purple-500 rounded-full"></div>
                    <span className="text-gray-700 dark:text-gray-300">Events</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <div className="w-3 h-3 bg-blue-500 rounded-full"></div>
                    <span className="text-gray-700 dark:text-gray-300">Users</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <div className="w-3 h-3 bg-green-500 rounded-full"></div>
                    <span className="text-gray-700 dark:text-gray-300">Hangouts</span>
                  </div>
                </div>
              </div>
            </motion.div>

            {/* Stats */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: 0.6 }}
              className="grid grid-cols-1 md:grid-cols-3 gap-6 mt-12"
            >
              <div className="text-center p-6 bg-white dark:bg-gray-800 rounded-2xl shadow-lg">
                <Users className="h-8 w-8 text-blue-600 mx-auto mb-3" />
                <div className="text-3xl font-bold text-gray-900 dark:text-white">
                  {mapData.users.length}+
                </div>
                <div className="text-gray-600 dark:text-gray-300">Active Users</div>
              </div>
              <div className="text-center p-6 bg-white dark:bg-gray-800 rounded-2xl shadow-lg">
                <Calendar className="h-8 w-8 text-purple-600 mx-auto mb-3" />
                <div className="text-3xl font-bold text-gray-900 dark:text-white">
                  {mapData.events.length}+
                </div>
                <div className="text-gray-600 dark:text-gray-300">Upcoming Events</div>
              </div>
              <div className="text-center p-6 bg-white dark:bg-gray-800 rounded-2xl shadow-lg">
                <Navigation className="h-8 w-8 text-green-600 mx-auto mb-3" />
                <div className="text-3xl font-bold text-gray-900 dark:text-white">
                  {mapData.hangouts.length}+
                </div>
                <div className="text-gray-600 dark:text-gray-300">Hangout Spots</div>
              </div>
            </motion.div>
          </div>
        </section>

        {/* CTA Section */}
        <section className="py-20 px-4 sm:px-6 lg:px-8 bg-purple-600 relative overflow-hidden">
          <div className="absolute inset-0 opacity-10">
            <div className="absolute top-0 left-0 w-96 h-96 bg-white rounded-full filter blur-3xl" />
            <div className="absolute bottom-0 right-0 w-96 h-96 bg-white rounded-full filter blur-3xl" />
          </div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="max-w-4xl mx-auto text-center relative z-10"
          >
            <Zap className="h-16 w-16 text-white mx-auto mb-6" />
            <h2 className="text-4xl md:text-5xl font-bold text-white mb-6">
              Ready to Transform Your Student Life?
            </h2>
            <p className="text-xl text-white/90 mb-8">
              Join thousands of students already using PeerFlex to succeed in their academic journey
            </p>
            <Link to="/signup">
              <Button 
                variant="ghost" 
                className="bg-white text-purple-600 hover:bg-gray-100 text-lg px-8 py-4"
                onMouseEnter={handleMouseEnter}
                onMouseLeave={handleMouseLeave}
              >
                Start Your Journey
                <Sparkles className="ml-2 h-5 w-5" />
              </Button>
            </Link>
          </motion.div>
        </section>
      </div>

      <style>{`
        @keyframes blob {
          0%, 100% { transform: translate(0, 0) scale(1); }
          33% { transform: translate(30px, -50px) scale(1.1); }
          66% { transform: translate(-20px, 20px) scale(0.9); }
        }
        .animate-blob {
          animation: blob 7s infinite;
        }
        .animation-delay-2000 {
          animation-delay: 2s;
        }
        .animation-delay-4000 {
          animation-delay: 4s;
        }
        
        /* Smooth scrolling */
        html {
          scroll-behavior: smooth;
        }
        
        /* Custom scrollbar */
        ::-webkit-scrollbar {
          width: 8px;
        }
        ::-webkit-scrollbar-track {
          background: #f1f1f1;
        }
        ::-webkit-scrollbar-thumb {
          background: #c084fc;
          border-radius: 4px;
        }
        ::-webkit-scrollbar-thumb:hover {
          background: #a855f7;
        }
      `}</style>
    </Layout>
  );
};

export default HomePage;