import React, { useState, useEffect, useRef } from 'react';
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
  Navigation,
  Play,
  Pause
} from 'lucide-react';
import Button from '../components/ui/Button';

const HomePage: React.FC = () => {
  const [activeTab, setActiveTab] = useState<'events' | 'users' | 'hangouts'>('events');
  const [cursorVariant, setCursorVariant] = useState('default');
  const [isVideoPlaying, setIsVideoPlaying] = useState(true);
  const videoRef = useRef<HTMLVideoElement>(null);

  // AI-generated student lifestyle images (placeholder URLs - replace with actual AI images)
  const aiImages = [
    'https://plus.unsplash.com/premium_photo-1684444605542-93725082d214?ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxzZWFyY2h8MXx8bm90ZSUyMHRha2luZ3xlbnwwfHwwfHx8MA%3D%3D&fm=jpg&q=60&w=3000',
    'https://images.unsplash.com/photo-1523580494863-6f3031224c94?ixlib=rb-4.0.3&auto=format&fit=crop&w=1000&q=80',
    'https://images.unsplash.com/photo-1541339907198-e08756dedf3f?ixlib=rb-4.0.3&auto=format&fit=crop&w=1000&q=80',
    'https://images.unsplash.com/photo-1522202176988-66273c2fd55f?ixlib=rb-4.0.3&auto=format&fit=crop&w=1000&q=80',
    'https://github.blog/wp-content/uploads/2024/06/AI-DarkMode-4.png?resize=800%2C425',
    'https://lp.simplified.com/siteimages/ai/copywriting/ai-resume-builder-4.png'
  ];

  const features = [
    {
      icon: BookOpen,
      title: 'Notes Sharing',
      description: 'Share and discover study notes from students worldwide',
      gradient: 'from-purple-500 to-pink-500',
      link: '/notes',
      image: aiImages[0]
    },
    {
      icon: MessageCircle,
      title: 'Student Chat',
      description: 'Direct messaging and group chats with classmates',
      gradient: 'from-blue-500 to-cyan-500',
      link: '/chat',
      image: aiImages[1]
    },
    {
      icon: Briefcase,
      title: 'Job Listings',
      description: 'Find internships with auto-apply integration',
      gradient: 'from-green-500 to-emerald-500',
      link: '/jobs',
      image: aiImages[2]
    },
    {
      icon: Calendar,
      title: 'Events & Hangouts',
      description: 'Join workshops, study groups, and social events',
      gradient: 'from-orange-500 to-red-500',
      link: '/events',
      image: aiImages[3]
    },
    {
      icon: Github,
      title: 'Open Source',
      description: 'Contribute to student-led open source projects',
      gradient: 'from-gray-700 to-gray-900',
      link: '/projects',
      image: aiImages[4]
    },
    {
      icon: FileText,
      title: 'Resume Builder',
      description: 'Create professional resumes with AI assistance',
      gradient: 'from-indigo-500 to-purple-600',
      image: aiImages[5]

    }
  ];

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

  const toggleVideo = () => {
    if (videoRef.current) {
      if (isVideoPlaying) {
        videoRef.current.pause();
      } else {
        videoRef.current.play();
      }
      setIsVideoPlaying(!isVideoPlaying);
    }
  };

  const handleMouseEnter = () => setCursorVariant('hover');
  const handleMouseLeave = () => setCursorVariant('default');

  return (
    <Layout>
      {/* Video Background Section */}
      <section className="relative h-screen overflow-hidden">
        {/* Hero Content Over Video */}
        <div className="relative z-10 h-full flex items-center justify-center">
          <HeroSection3D />
        </div>
      </section>

      {/* Features Section with AI Images */}
      <section className="py-20 px-4 sm:px-6 lg:px-8 relative bg-gradient-to-br from-gray-50 via-white to-purple-50 dark:from-gray-900 dark:via-gray-800 dark:to-gray-900">
        <div className="max-w-7xl mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-center mb-16"
          >
            <motion.div
              initial={{ scale: 0 }}
              whileInView={{ scale: 1 }}
              transition={{ delay: 0.2, type: "spring", stiffness: 200 }}
              className="inline-block mb-4"
            >
              <div className="bg-gradient-to-r from-purple-600 to-blue-600 text-white px-6 py-2 mb-8 rounded-full text-sm font-semibold">
                ✨ AI-Powered Platform
              </div>
            </motion.div>
            <h2 className="text-4xl md:text-5xl font-bold text-gray-900 dark:text-white mb-4">
              Everything You Need, <span className="bg-gradient-to-r from-purple-600 to-blue-600 bg-clip-text text-transparent">One Place</span>
            </h2>
            <p className="text-xl text-gray-600 dark:text-gray-300 max-w-2xl mx-auto">
              Powerful features enhanced with AI to make your student journey smoother and more productive
            </p>
          </motion.div>

          {/* Mobile-Optimized Grid (2x2 on mobile, 3x2 on desktop) */}
          <div className="grid grid-cols-2 lg:grid-cols-3 gap-4 md:gap-6 lg:gap-8">
            {features.map((feature, index) => (
              <motion.div
                key={feature.title}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, margin: "-50px" }}
                transition={{ delay: index * 0.1 }}
                whileHover={{ 
                  y: -5,
                  transition: { duration: 0.2 } 
                }}
                className="col-span-2 lg:col-span-1"
              >
                <Link to={feature.link || '#'}>
                  <div className="relative group h-full">
                    {/* Background Gradient */}
                    <div className={`absolute inset-0 bg-gradient-to-br ${feature.gradient} rounded-3xl opacity-0 group-hover:opacity-10 transition-opacity duration-300`} />
                    
                    {/* Main Card */}
                    <div className="relative bg-white/80 dark:bg-gray-800/80 backdrop-blur-sm rounded-3xl p-6 border border-gray-200/50 dark:border-gray-700/50 group-hover:border-transparent transition-all duration-300 h-full flex flex-col">
                      
                      {/* AI Image Preview */}
                      {feature.image && (
                        <div className="mb-4 rounded-2xl overflow-hidden">
                          <img 
                            src={feature.image} 
                            alt={feature.title}
                            className="w-full h-32 object-cover transform group-hover:scale-105 transition-transform duration-300"
                          />
                        </div>
                      )}
                      
                      {/* Icon */}
                      <div className='flex items-center justify-start gap-4'>
                      <div className={`p-3 rounded-xl bg-gradient-to-r ${feature.gradient} mb-4 ${!feature.image ? 'mt-2' : ''}`}>
                        <feature.icon className="h-6 w-6 text-white" />
                      </div>
                      
                      {/* Content */}
                      <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-2 line-clamp-2">
                        {feature.title}
                      </h3>
                      </div>

                      <p className="text-gray-600 dark:text-gray-300 text-sm mb-4 flex-grow line-clamp-3">
                        {feature.description}
                      </p>
                      
                      {/* CTA */}
                      <div className="flex items-center text-blue-600 dark:text-blue-400 font-semibold text-sm group-hover:gap-2 transition-all">
                        Explore
                        <ArrowRight className="h-4 w-4 ml-1 group-hover:translate-x-1 transition-transform" />
                      </div>
                    </div>
                  </div>
                </Link>
              </motion.div>
            ))}
          </div>

          {/* AI Features Showcase */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="mt-4 text-center"
          >
          </motion.div>
        </div>
      </section>

      {/* Interactive Map Section */}
      <section className="py-20 px-4 sm:px-6 lg:px-8 bg-white dark:bg-gray-900">
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

          {/* Map Controls - Mobile Optimized */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.2 }}
            className="flex flex-wrap justify-center gap-2 md:gap-4 mb-8"
          >
            {[
              { key: 'events', label: 'Events', icon: Calendar, color: 'purple' },
              { key: 'users', label: 'Users', icon: Users, color: 'blue' },
              { key: 'hangouts', label: 'Hangouts', icon: Navigation, color: 'green' }
            ].map((tab) => (
              <button
                key={tab.key}
                onClick={() => setActiveTab(tab.key as any)}
                className={`px-4 py-3 md:px-6 md:py-3 rounded-full font-semibold transition-all duration-300 flex items-center gap-2 text-sm md:text-base ${
                  activeTab === tab.key
                    ? `bg-${tab.color}-600 text-white shadow-lg`
                    : 'bg-white dark:bg-gray-800 text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-700'
                }`}
              >
                <tab.icon className="h-4 w-4 md:h-5 md:w-5" />
                <span className="hidden xs:inline">{tab.label}</span>
              </button>
            ))}
          </motion.div>

          {/* Interactive Map */}
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
              className="h-64 sm:h-80 md:h-96 w-full"
            />
            
            <div className="p-4 md:p-6 bg-gray-50 dark:bg-gray-900 border-t border-gray-200 dark:border-gray-700">
              <div className="flex flex-wrap gap-4 md:gap-6 justify-center text-xs md:text-sm">
                <div className="flex items-center gap-2">
                  <div className="w-2 h-2 md:w-3 md:h-3 bg-purple-500 rounded-full"></div>
                  <span className="text-gray-700 dark:text-gray-300">Events</span>
                </div>
                <div className="flex items-center gap-2">
                  <div className="w-2 h-2 md:w-3 md:h-3 bg-blue-500 rounded-full"></div>
                  <span className="text-gray-700 dark:text-gray-300">Users</span>
                </div>
                <div className="flex items-center gap-2">
                  <div className="w-2 h-2 md:w-3 md:h-3 bg-green-500 rounded-full"></div>
                  <span className="text-gray-700 dark:text-gray-300">Hangouts</span>
                </div>
              </div>
            </div>
          </motion.div>

          {/* Stats - Mobile Optimized */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.6 }}
            className="grid grid-cols-3 gap-3 md:gap-6 mt-8 md:mt-12"
          >
            {[
              { icon: Users, count: mapData.users.length, label: 'Active Users', color: 'blue' },
              { icon: Calendar, count: mapData.events.length, label: 'Events', color: 'purple' },
              { icon: Navigation, count: mapData.hangouts.length, label: 'Hangouts', color: 'green' }
            ].map((stat, index) => (
              <div key={stat.label} className="text-center p-4 md:p-6 bg-white dark:bg-gray-800 rounded-2xl shadow-lg">
                <stat.icon className={`h-6 w-6 md:h-8 md:w-8 text-${stat.color}-600 mx-auto mb-2 md:mb-3`} />
                <div className="text-xl md:text-3xl font-bold text-gray-900 dark:text-white">
                  {stat.count}+
                </div>
                <div className="text-xs md:text-sm text-gray-600 dark:text-gray-300">{stat.label}</div>
              </div>
            ))}
          </motion.div>
        </div>
      </section>

      {/* Enhanced CTA Section */}
      <section className="py-20 px-4 sm:px-6 lg:px-8 bg-gradient-to-r from-purple-600 via-blue-600 to-indigo-700 relative overflow-hidden">
        {/* Animated Background Elements */}
        <div className="absolute inset-0 opacity-20">
          <div className="absolute top-1/4 left-1/4 w-64 h-64 bg-white rounded-full filter blur-3xl animate-pulse"></div>
          <div className="absolute bottom-1/3 right-1/4 w-48 h-48 bg-cyan-300 rounded-full filter blur-3xl animate-pulse delay-1000"></div>
        </div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="max-w-4xl mx-auto text-center relative z-10"
        >
          <Zap className="h-16 w-16 text-white mx-auto mb-6" />
          <h2 className="text-3xl md:text-5xl font-bold text-white mb-6">
            Ready to Transform Your Student Life?
          </h2>
          <p className="text-lg md:text-xl text-white/90 mb-8 max-w-2xl mx-auto">
            Join thousands of students already using PeerFlex to succeed in their academic journey with AI-powered tools
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link to="/signup" className="flex-1 sm:flex-none">
              <Button 
                size="lg"
                className="w-full bg-white text-purple-600 hover:bg-gray-100 text-lg px-8 py-4 font-semibold"
              >
                Start Your Journey
                <Sparkles className="ml-2 h-5 w-5" />
              </Button>
            </Link>
            <Link to="/login" className="flex-1 sm:flex-none">
              <Button 
                variant="outline"
                size="lg"
                className="w-full border-white text-white hover:bg-white/10 text-lg px-8 py-4 font-semibold"
              >
                Sign In
              </Button>
            </Link>
          </div>
        </motion.div>
      </section>
    </Layout>
  );
};

export default HomePage;