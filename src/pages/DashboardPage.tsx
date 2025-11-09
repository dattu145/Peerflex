import React, { useEffect, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import {
  Home,
  FileText,
  Briefcase,
  Calendar,
  MessageSquare,
  Users,
  User,
  Code,
  BookOpen,
  TrendingUp,
  Award,
  Bell,
  Settings,
  LogOut,
  Plus,
  ChevronRight,
  Sparkles,
  Target,
  Clock
} from 'lucide-react';
import { useAuthStore } from '../store/useAuthStore';
import Layout from '../components/layout/Layout';

interface QuickAction {
  icon: React.ReactNode;
  title: string;
  description: string;
  link: string;
  color: string;
}

interface StatCard {
  icon: React.ReactNode;
  title: string;
  value: string;
  change: string;
  color: string;
}

interface RecentActivity {
  icon: React.ReactNode;
  title: string;
  description: string;
  time: string;
  color: string;
}

const DashboardPage: React.FC = () => {
  const navigate = useNavigate();
  const { user, profile, logout } = useAuthStore();
  const [greeting, setGreeting] = useState('');

  useEffect(() => {
    const hour = new Date().getHours();
    if (hour < 12) setGreeting('Good Morning');
    else if (hour < 17) setGreeting('Good Afternoon');
    else setGreeting('Good Evening');
  }, []);

  const handleLogout = async () => {
    try {
      await logout();
      navigate('/login');
    } catch (error) {
      console.error('Logout failed:', error);
    }
  };

  const quickActions: QuickAction[] = [
    {
      icon: <FileText className="w-6 h-6" />,
      title: 'Build Resume',
      description: 'Create professional resume',
      link: '/resume-builder',
      color: 'bg-blue-500'
    },
    {
      icon: <BookOpen className="w-6 h-6" />,
      title: 'Share Notes',
      description: 'Upload study materials',
      link: '/notes',
      color: 'bg-purple-500'
    },
    {
      icon: <Calendar className="w-6 h-6" />,
      title: 'Discover Events',
      description: 'Campus & local events',
      link: '/events',
      color: 'bg-pink-500'
    },
  ];

  const stats: StatCard[] = [
    {
      icon: <Award className="w-5 h-5" />,
      title: 'Profile Score',
      value: `${profile?.reputation_score || 0}`,
      change: '+12 this week',
      color: 'text-yellow-600'
    },
    {
      icon: <Users className="w-5 h-5" />,
      title: 'Connections',
      value: '24',
      change: '+3 new',
      color: 'text-blue-600'
    },
    {
      icon: <Target className="w-5 h-5" />,
      title: 'Applications',
      value: '8',
      change: '2 pending',
      color: 'text-green-600'
    },
    {
      icon: <TrendingUp className="w-5 h-5" />,
      title: 'Activity',
      value: '156',
      change: 'This month',
      color: 'text-purple-600'
    }
  ];

  const recentActivities: RecentActivity[] = [
    {
      icon: <FileText className="w-4 h-4" />,
      title: 'Resume Updated',
      description: 'Your resume "Software Dev" was updated',
      time: '2 hours ago',
      color: 'bg-blue-100 text-blue-600 dark:bg-blue-900/20'
    },
    {
      icon: <BookOpen className="w-4 h-4" />,
      title: 'Notes Shared',
      description: 'Uploaded Data Structures notes',
      time: '1 day ago',
      color: 'bg-purple-100 text-purple-600 dark:bg-purple-900/20'
    },
    {
      icon: <Calendar className="w-4 h-4" />,
      title: 'Event Registered',
      description: 'Tech Fest 2025 - Salem Campus',
      time: '2 days ago',
      color: 'bg-pink-100 text-pink-600 dark:bg-pink-900/20'
    }
  ];

  return (
    <Layout>
      <div className="min-h-screen bg-gray-50 dark:bg-gray-900 py-8">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          {/* Header Section */}
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            className="mb-8"
          >
            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
              <div>
                <h1 className="text-3xl font-bold text-gray-900 dark:text-white">
                  {greeting}, {profile?.full_name || user?.email?.split('@')[0]}! 👋
                </h1>
                <p className="text-gray-600 dark:text-gray-400 mt-1">
                  Welcome to your Peerflex dashboard
                </p>
              </div>
              <div className="flex gap-3">
                <button className="p-2 rounded-lg bg-white dark:bg-gray-800 shadow-sm hover:shadow-md transition-shadow">
                  <Bell className="w-5 h-5 text-gray-600 dark:text-gray-400" />
                </button>
                <Link
                  to="/settings"
                  className="p-2 rounded-lg bg-white dark:bg-gray-800 shadow-sm hover:shadow-md transition-shadow"
                >
                  <Settings className="w-5 h-5 text-gray-600 dark:text-gray-400" />
                </Link>
                <button
                  onClick={handleLogout}
                  className="p-2 rounded-lg bg-white dark:bg-gray-800 shadow-sm hover:shadow-md transition-shadow"
                >
                  <LogOut className="w-5 h-5 text-gray-600 dark:text-gray-400" />
                </button>
              </div>
            </div>
          </motion.div>

          {/* Profile Completion Banner */}
          {profile?.reputation_score === 0 && (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="mb-6 bg-purple-600 rounded-2xl p-6 text-white"
            >
              <div className="flex items-start justify-between">
                <div className="flex-1">
                  <div className="flex items-center gap-2 mb-2">
                    <Sparkles className="w-5 h-5" />
                    <h3 className="text-lg font-semibold">Complete Your Profile</h3>
                  </div>
                  <p className="text-white/90 text-sm mb-4">
                    Add your details to unlock all features and get personalized recommendations
                  </p>
                  <div className="flex gap-3">
                    <Link
                      to="/profile/edit"
                      className="px-4 py-2 bg-white text-purple-600 rounded-lg font-medium hover:bg-gray-100 transition-colors"
                    >
                      Complete Profile
                    </Link>
                  </div>
                </div>
                <div className="hidden sm:block">
                  <div className="w-16 h-16 rounded-full bg-white/20 flex items-center justify-center">
                    <span className="text-2xl"><User /></span>
                  </div>
                </div>
              </div>
            </motion.div>
          )}

          {/* Stats Grid */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
            {stats.map((stat, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.1 }}
                className="bg-white dark:bg-gray-800 rounded-xl p-6 shadow-sm hover:shadow-md transition-shadow"
              >
                <div className="flex items-start justify-between">
                  <div className="flex-1">
                    <p className="text-sm text-gray-600 dark:text-gray-400 mb-1">
                      {stat.title}
                    </p>
                    <h3 className="text-2xl font-bold text-gray-900 dark:text-white mb-1">
                      {stat.value}
                    </h3>
                    <p className="text-xs text-gray-500 dark:text-gray-500">
                      {stat.change}
                    </p>
                  </div>
                  <div className={`p-3 rounded-lg ${stat.color} bg-opacity-10`}>
                    {stat.icon}
                  </div>
                </div>
              </motion.div>
            ))}
          </div>

          {/* Quick Actions Grid */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="mb-8"
          >
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-xl font-bold text-gray-900 dark:text-white">
                Quick Actions
              </h2>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
              {quickActions.map((action, index) => (
                <Link
                  key={index}
                  to={action.link}
                  className="bg-white dark:bg-gray-800 rounded-xl p-6 shadow-sm hover:shadow-lg transition-all hover:-translate-y-1 group"
                >
                  <div className="flex items-start gap-4">
                    <div className={`${action.color} text-white p-3 rounded-lg group-hover:scale-110 transition-transform`}>
                      {action.icon}
                    </div>
                    <div className="flex-1">
                      <h3 className="font-semibold text-gray-900 dark:text-white mb-1">
                        {action.title}
                      </h3>
                      <p className="text-sm text-gray-600 dark:text-gray-400">
                        {action.description}
                      </p>
                    </div>
                    <ChevronRight className="w-5 h-5 text-gray-400 group-hover:text-purple-600 group-hover:translate-x-1 transition-all" />
                  </div>
                </Link>
              ))}
            </div>
          </motion.div>

          {/* Two Column Layout */}
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            {/* Recent Activity */}
            <motion.div
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.3 }}
              className="lg:col-span-2"
            >
              <div className="bg-white dark:bg-gray-800 rounded-xl p-6 shadow-sm">
                <div className="flex items-center justify-between mb-6">
                  <h2 className="text-xl font-bold text-gray-900 dark:text-white">
                    Recent Activity
                  </h2>
                  <button className="text-sm text-purple-600 hover:text-purple-700 font-medium">
                    View All
                  </button>
                </div>
                <div className="space-y-4">
                  {recentActivities.map((activity, index) => (
                    <div
                      key={index}
                      className="flex items-start gap-4 p-4 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-700/50 transition-colors"
                    >
                      <div className={`p-2 rounded-lg ${activity.color}`}>
                        {activity.icon}
                      </div>
                      <div className="flex-1 min-w-0">
                        <h4 className="text-sm font-semibold text-gray-900 dark:text-white">
                          {activity.title}
                        </h4>
                        <p className="text-sm text-gray-600 dark:text-gray-400 truncate">
                          {activity.description}
                        </p>
                      </div>
                      <div className="flex items-center gap-1 text-xs text-gray-500">
                        <Clock className="w-3 h-3" />
                        {activity.time}
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </motion.div>

            {/* Upcoming Events & Quick Links */}
            <motion.div
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.4 }}
              className="space-y-6"
            >
              {/* Upcoming Events */}
              <div className="bg-white dark:bg-gray-800 rounded-xl p-6 shadow-sm">
                <h2 className="text-lg font-bold text-gray-900 dark:text-white mb-4">
                  Upcoming Events
                </h2>
                <div className="space-y-3">
                  <div className="p-4 border border-gray-200 dark:border-gray-700 rounded-lg">
                    <div className="flex items-center gap-2 text-purple-600 dark:text-purple-400 mb-2">
                      <Calendar className="w-4 h-4" />
                      <span className="text-xs font-medium">Tomorrow, 10:00 AM</span>
                    </div>
                    <h4 className="font-semibold text-gray-900 dark:text-white text-sm mb-1">
                      Tech Workshop
                    </h4>
                    <p className="text-xs text-gray-600 dark:text-gray-400">
                      Web Development Basics
                    </p>
                  </div>
                  <div className="p-4 border border-gray-200 dark:border-gray-700 rounded-lg">
                    <div className="flex items-center gap-2 text-blue-600 dark:text-blue-400 mb-2">
                      <Calendar className="w-4 h-4" />
                      <span className="text-xs font-medium">Dec 15, 2:00 PM</span>
                    </div>
                    <h4 className="font-semibold text-gray-900 dark:text-white text-sm mb-1">
                      Career Fair 2025
                    </h4>
                    <p className="text-xs text-gray-600 dark:text-gray-400">
                      Salem Engineering Campus
                    </p>
                  </div>
                </div>
                <Link
                  to="/events"
                  className="mt-4 block text-center py-2 px-4 bg-purple-50 dark:bg-purple-900/20 text-purple-600 dark:text-purple-400 rounded-lg text-sm font-medium hover:bg-purple-100 dark:hover:bg-purple-900/30 transition-colors"
                >
                  View All Events
                </Link>
              </div>

              {/* Quick Links */}
              <div className="bg-gradient-to-br from-purple-600 to-blue-600 rounded-xl p-6 text-white">
                <h2 className="text-lg font-bold mb-4">Need Help?</h2>
                <div className="space-y-3">
                  <Link
                    to="/chat"
                    className="flex items-center gap-3 p-3 bg-white/10 rounded-lg hover:bg-white/20 transition-colors"
                  >
                    <MessageSquare className="w-5 h-5" />
                    <span className="text-sm font-medium">Chat with Peers</span>
                  </Link>
                  <Link
                    to="/contact"
                    className="flex items-center gap-3 p-3 bg-white/10 rounded-lg hover:bg-white/20 transition-colors"
                  >
                    <Users className="w-5 h-5" />
                    <span className="text-sm font-medium">Contact Support</span>
                  </Link>
                </div>
              </div>
            </motion.div>
          </div>
        </div>
      </div>
    </Layout>
  );
};

export default DashboardPage;