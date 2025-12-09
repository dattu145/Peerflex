import React, { useEffect, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import {
  Calendar,
  Users,
  BookOpen,
  Award,
  MapPin,
  Bell,
  Settings,
  LogOut,
  User,
  Briefcase,
  Sparkles,
  ChevronRight,
  Clock,
  MessageSquare,
  Camera
} from 'lucide-react';
import { useAuthStore } from '../store/useAuthStore';
import Layout from '../components/layout/Layout';
import { profileService } from '../services/profileService';
import { connectionService } from '../services/connectionService';
import { eventService } from '../services/eventService';
import { noteService } from '../services/noteService';

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
  const [stats, setStats] = useState({
    notesCount: 0,
    connectionsCount: 0,
    eventsCount: 0,
    reputationScore: 0
  });
  const [recentActivities, setRecentActivities] = useState<RecentActivity[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const hour = new Date().getHours();
    if (hour < 12) setGreeting('Good Morning');
    else if (hour < 17) setGreeting('Good Afternoon');
    else setGreeting('Good Evening');
  }, []);

  useEffect(() => {
    const fetchDashboardData = async () => {
      if (!user) return;

      try {
        setLoading(true);

        // Fetch all data in parallel
        const [
          profileStats,
          connections,
          registrations,
          userNotes
        ] = await Promise.all([
          profileService.getUserStats(user.id),
          connectionService.getConnections(),
          eventService.getUserRegistrations(),
          noteService.getUserNotes()
        ]);

        setStats({
          notesCount: profileStats.notesCount,
          connectionsCount: connections.length,
          eventsCount: registrations.length,
          reputationScore: profile?.reputation_score || 0
        });

        // Process recent activity
        const activities: RecentActivity[] = [];

        // Add recent notes
        userNotes.slice(0, 3).forEach(note => {
          activities.push({
            icon: <BookOpen className="w-4 h-4" />,
            title: 'Note Shared',
            description: note.title,
            time: new Date(note.created_at).toLocaleDateString(),
            color: 'bg-purple-100 text-purple-600 dark:bg-purple-900/20'
          });
        });

        // Add recent event registrations
        registrations.slice(0, 3).forEach(reg => {
          activities.push({
            icon: <Calendar className="w-4 h-4" />,
            title: 'Event Registered',
            description: reg.event?.title || 'Unknown Event',
            time: new Date(reg.registered_at).toLocaleDateString(),
            color: 'bg-pink-100 text-pink-600 dark:bg-pink-900/20'
          });
        });

        // Sort by date (mocking date sort as time strings are simplified)
        // In a real app, you'd parse dates properly
        setRecentActivities(activities.slice(0, 5));

      } catch (error) {
        console.error('Error fetching dashboard data:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchDashboardData();
  }, [user, profile]);

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
      icon: <BookOpen className="w-6 h-6" />,
      title: 'Share Notes',
      description: 'Upload study materials',
      link: '/notes/create',
      color: 'bg-purple-500'
    },
    {
      icon: <Calendar className="w-6 h-6" />,
      title: 'Discover Events',
      description: 'Campus & local events',
      link: '/events',
      color: 'bg-pink-500'
    },
    {
      icon: <MapPin className="w-6 h-6" />,
      title: 'Find Hangouts',
      description: 'Study spots & cafes',
      link: '/hangouts',
      color: 'bg-green-500'
    },
  ];

  const statCards: StatCard[] = [
    {
      icon: <Award className="w-5 h-5" />,
      title: 'Reputation',
      value: `${stats.reputationScore}`,
      change: 'Points',
      color: 'text-yellow-600'
    },
    {
      icon: <Users className="w-5 h-5" />,
      title: 'Connections',
      value: `${stats.connectionsCount}`,
      change: 'Network',
      color: 'text-blue-600'
    },
    {
      icon: <BookOpen className="w-5 h-5" />,
      title: 'Notes Shared',
      value: `${stats.notesCount}`,
      change: 'Contributions',
      color: 'text-purple-600'
    },
    {
      icon: <Calendar className="w-5 h-5" />,
      title: 'Events',
      value: `${stats.eventsCount}`,
      change: 'Registered',
      color: 'text-pink-600'
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
                  {greeting}, {profile?.full_name || user?.email?.split('@')[0]}!
                </h1>
                <p className="text-gray-600 dark:text-gray-400 mt-1">
                  Welcome to your Peerflex dashboard
                </p>
              </div>
              <div className="flex gap-3">
                <Link
                  to="/notifications"
                  className="p-2 rounded-lg bg-white dark:bg-gray-800 shadow-sm hover:shadow-md transition-shadow"
                  title="Notifications"
                >
                  <Bell className="w-5 h-5 text-gray-600 dark:text-gray-400" />
                </Link>
                <Link
                  to="/profile/edit"
                  className="p-2 rounded-lg bg-white dark:bg-gray-800 shadow-sm hover:shadow-md transition-shadow"
                  title="Edit Profile"
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

          {/* Profile Details Card */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="mb-8 bg-white dark:bg-gray-800 rounded-xl p-6 shadow-sm"
          >
            <div className="flex flex-col md:flex-row gap-6">
              {/* Avatar & Basic Info */}
              <div className="flex flex-col items-center md:items-start gap-4 min-w-[200px]">
                <div className="relative group">
                  <div className="w-32 h-32 rounded-full overflow-hidden bg-gray-100 dark:bg-gray-700 border-4 border-white dark:border-gray-600 shadow-md">
                    {profile?.avatar_url ? (
                      <img src={profile.avatar_url} alt={profile.full_name} className="w-full h-full object-cover" />
                    ) : (
                      <div className="w-full h-full flex items-center justify-center text-gray-400">
                        <User className="w-12 h-12" />
                      </div>
                    )}
                  </div>
                  <label className="absolute bottom-0 right-0 p-2 bg-purple-600 rounded-full text-white cursor-pointer shadow-lg hover:bg-purple-700 transition-colors opacity-0 group-hover:opacity-100 transition-opacity">
                    <Camera className="w-4 h-4" />
                    <input
                      type="file"
                      className="hidden"
                      accept="image/*"
                      onChange={async (e) => {
                        if (!e.target.files || e.target.files.length === 0) return;
                        try {
                          const file = e.target.files[0];
                          const publicUrl = await profileService.uploadAvatar(file);
                          // Update profile with new avatar
                          const updatedProfile = await profileService.updateProfile({ avatar_url: publicUrl });
                          // Update local state via useAuthStore
                          useAuthStore.getState().setProfile(updatedProfile);
                        } catch (error) {
                          console.error('Error uploading avatar:', error);
                          alert('Failed to upload avatar');
                        }
                      }}
                    />
                  </label>
                </div>
                <div className="text-center md:text-left">
                  <h2 className="text-xl font-bold text-gray-900 dark:text-white">{profile?.full_name || 'Anonymous User'}</h2>
                  <p className="text-sm text-gray-500">@{profile?.username || user?.email?.split('@')[0]}</p>
                  {profile?.current_location && (
                    <div className="flex items-center justify-center md:justify-start gap-1 text-sm text-gray-600 dark:text-gray-400 mt-1">
                      <MapPin className="w-3 h-3" />
                      <span>{profile.current_location.city || 'Location not set'}</span>
                    </div>
                  )}
                </div>
                <Link
                  to="/profile/edit"
                  className="w-full py-2 px-4 bg-purple-50 dark:bg-purple-900/20 text-purple-600 dark:text-purple-400 rounded-lg text-sm font-medium hover:bg-purple-100 dark:hover:bg-purple-900/30 transition-colors text-center"
                >
                  Edit Profile
                </Link>
              </div>

              {/* Detailed Info */}
              <div className="flex-1 grid grid-cols-1 sm:grid-cols-2 gap-6">
                <div className="space-y-4">
                  <div>
                    <h3 className="text-sm font-medium text-gray-500 dark:text-gray-400 mb-1">Bio</h3>
                    <p className="text-gray-900 dark:text-white text-sm">
                      {profile?.bio || <span className="text-gray-400 italic">No bio added yet.</span>}
                    </p>
                  </div>
                  <div>
                    <h3 className="text-sm font-medium text-gray-500 dark:text-gray-400 mb-1">Education</h3>
                    <div className="space-y-1">
                      <p className="text-gray-900 dark:text-white text-sm flex items-center gap-2">
                        <Briefcase className="w-4 h-4 text-gray-400" />
                        {profile?.university || <span className="text-gray-400 italic">University not set</span>}
                      </p>
                      <p className="text-gray-900 dark:text-white text-sm flex items-center gap-2">
                        <BookOpen className="w-4 h-4 text-gray-400" />
                        {profile?.major || <span className="text-gray-400 italic">Major not set</span>}
                        {profile?.year_of_study && <span className="text-gray-500">• Year {profile.year_of_study}</span>}
                      </p>
                    </div>
                  </div>
                </div>

                <div className="space-y-4">
                  <div>
                    <h3 className="text-sm font-medium text-gray-500 dark:text-gray-400 mb-2">Skills</h3>
                    <div className="flex flex-wrap gap-2">
                      {profile?.skills && profile.skills.length > 0 ? (
                        profile.skills.map((skill: string, i: number) => (
                          <span key={i} className="px-2 py-1 bg-blue-50 dark:bg-blue-900/20 text-blue-600 dark:text-blue-400 rounded text-xs font-medium">
                            {skill}
                          </span>
                        ))
                      ) : (
                        <span className="text-gray-400 italic text-sm">No skills added.</span>
                      )}
                    </div>
                  </div>
                  <div>
                    <h3 className="text-sm font-medium text-gray-500 dark:text-gray-400 mb-2">Interests</h3>
                    <div className="flex flex-wrap gap-2">
                      {profile?.interests && profile.interests.length > 0 ? (
                        profile.interests.map((interest: string, i: number) => (
                          <span key={i} className="px-2 py-1 bg-pink-50 dark:bg-pink-900/20 text-pink-600 dark:text-pink-400 rounded text-xs font-medium">
                            {interest}
                          </span>
                        ))
                      ) : (
                        <span className="text-gray-400 italic text-sm">No interests added.</span>
                      )}
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </motion.div>

          {/* Profile Completion Banner - Only show if critical info is missing */}
          {(!profile?.major || !profile?.university || !profile?.bio) && (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="mb-6 bg-gradient-to-r from-purple-600 to-indigo-600 rounded-2xl p-6 text-white shadow-lg"
            >
              <div className="flex items-start justify-between">
                <div className="flex-1">
                  <div className="flex items-center gap-2 mb-2">
                    <Sparkles className="w-5 h-5 text-yellow-300" />
                    <h3 className="text-lg font-semibold">Complete Your Profile</h3>
                  </div>
                  <p className="text-white/90 text-sm mb-4 max-w-xl">
                    You are missing some profile details. Adding your university, major, and bio helps you connect with the right peers and get better recommendations.
                  </p>
                  <div className="flex gap-3">
                    <Link
                      to="/profile/edit"
                      className="px-4 py-2 bg-white text-purple-600 rounded-lg font-medium hover:bg-gray-100 transition-colors shadow-sm"
                    >
                      Complete Profile
                    </Link>
                  </div>
                </div>
                <div className="hidden sm:block">
                  <div className="w-16 h-16 rounded-full bg-white/20 flex items-center justify-center backdrop-blur-sm">
                    <span className="text-2xl"><User /></span>
                  </div>
                </div>
              </div>
            </motion.div>
          )}

          {/* Stats Grid */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
            {statCards.map((stat, index) => (
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
                      {loading ? '...' : stat.value}
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
              <div className="bg-white dark:bg-gray-800 rounded-xl p-6 shadow-sm min-h-[300px]">
                <div className="flex items-center justify-between mb-6">
                  <h2 className="text-xl font-bold text-gray-900 dark:text-white">
                    Recent Activity
                  </h2>
                </div>
                <div className="space-y-4">
                  {loading ? (
                    <div className="text-center py-8 text-gray-500">Loading activity...</div>
                  ) : recentActivities.length > 0 ? (
                    recentActivities.map((activity, index) => (
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
                    ))
                  ) : (
                    <div className="text-center py-8 text-gray-500">
                      No recent activity. Start exploring!
                    </div>
                  )}
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
              {/* My Upcoming Events */}
              <div className="bg-white dark:bg-gray-800 rounded-xl p-6 shadow-sm">
                <h2 className="text-lg font-bold text-gray-900 dark:text-white mb-4">
                  My Upcoming Events
                </h2>
                <div className="space-y-3">
                  {loading ? (
                    <div className="text-center py-4 text-gray-500 text-sm">Loading...</div>
                  ) : stats.eventsCount > 0 ? (
                    <div className="text-center py-4">
                      <p className="text-sm text-gray-600 dark:text-gray-400 mb-3">
                        You have {stats.eventsCount} registered event{stats.eventsCount !== 1 ? 's' : ''}.
                      </p>
                      <Link
                        to="/events?filter=registered"
                        className="text-sm font-medium text-purple-600 hover:text-purple-700"
                      >
                        View Schedule
                      </Link>
                    </div>
                  ) : (
                    <div className="text-center py-4">
                      <p className="text-sm text-gray-600 dark:text-gray-400 mb-3">
                        No upcoming events.
                      </p>
                      <Link
                        to="/events"
                        className="text-sm font-medium text-purple-600 hover:text-purple-700"
                      >
                        Browse Events
                      </Link>
                    </div>
                  )}
                </div>
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