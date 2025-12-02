import React, { useState, useEffect } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Menu,
  X,
  SunDim,
  Moon,
  User,
  LogOut,
  Settings,
  Calendar,
  MapPin,
  Bell
} from 'lucide-react';
import { useAuthStore } from '../../store/useAuthStore';
import { useAppStore } from '../../store/useAppStore';
import { notificationService } from '../../services/notificationService';
import { getTranslation } from '../../config/translations';
import Button from '../ui/Button';

const Header: React.FC = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const { user, profile, logout, isAuthenticated } = useAuthStore();
  const { language, theme, setTheme } = useAppStore();
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [unreadCount, setUnreadCount] = useState(0);

  useEffect(() => {
    if (!user) return;

    const fetchUnreadCount = async () => {
      try {
        const count = await notificationService.getUnreadCount();
        setUnreadCount(count);
      } catch (error) {
        console.error('Failed to fetch unread count:', error);
      }
    };

    fetchUnreadCount();

    // Subscribe to notifications
    const subscription = notificationService.subscribeToNotifications(() => {
      setUnreadCount((prev) => prev + 1);
    });

    return () => {
      subscription.then((sub) => sub?.unsubscribe());
    };
  }, [user]);

  const navigation = [
    { name: 'Features', href: '#', isDropdown: true },
    { name: getTranslation('about', language), href: '/about' },
    { name: getTranslation('contact', language), href: '/contact' },
  ];

  const featuresMenu = [
    { name: 'Notes Sharing', href: '/notes' },
    { name: 'Student Chat', href: '/chat' },
    { name: 'Events', href: '/events', icon: Calendar },
    { name: 'Hangout Spots', href: '/hangouts', icon: MapPin },
  ];

  const toggleTheme = () => {
    setTheme(theme === 'light' ? 'dark' : 'light');
  };

  const handleLogout = async () => {
    try {
      await logout();
      navigate('/login');
    } catch (error) {
      console.error('Logout failed:', error);
    }
  };

  return (
    <header className="sticky top-0 z-40 w-full border-b border-gray-200 dark:border-gray-700 bg-white/80 dark:bg-gray-900/80 backdrop-blur-md transition-colors duration-300">
      <nav className="mx-auto max-w-7xl px-3 xs:px-4 sm:px-6 lg:px-8">
        <div className="flex h-16 sm:h-20 items-center justify-between">
          {/* Logo */}
          <div className="flex items-center flex-shrink-0">
            <Link to="/" className="flex items-center space-x-2 group">
              <motion.div
                whileHover={{ rotate: 10, scale: 1.05 }}
                className="flex h-8 w-8 sm:h-10 sm:w-10 mr-1 items-center justify-center rounded-lg bg-white dark:bg-gray-900 border border-purple-600/40 shadow-sm"
              >
                <img src='/logotransparent.png' className="h-6 w-6 sm:h-7 sm:w-7 text-white" alt="Peerflex Logo" />
              </motion.div>
              <span className="text-lg sm:text-xl font-bold bg-purple-600 bg-clip-text text-transparent group-hover:text-purple-700 transition-colors">
                Peerflex
              </span>
            </Link>
          </div>

          {/* Desktop Navigation */}
          <div className="hidden md:block">
            <div className="ml-10 flex items-baseline space-x-4">
              {navigation.map((item) => (
                item.isDropdown ? (
                  <div key={item.name} className="relative group">
                    <button
                      className="px-3 py-2 rounded-md text-sm font-medium text-gray-700 dark:text-gray-300 hover:text-purple-600 dark:hover:text-purple-400 transition-colors flex items-center gap-1"
                    >
                      {item.name}
                    </button>
                    <div className="absolute left-0 mt-2 w-48 py-2 bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-md shadow-lg opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-200 z-50 transform origin-top-left">
                      {featuresMenu.map((feature) => {
                        const IconComponent = feature.icon;
                        return (
                          <Link
                            key={feature.name}
                            to={feature.href}
                            className="flex items-center space-x-2 px-4 py-2 text-sm text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700 hover:text-purple-600 dark:hover:text-purple-400 transition-colors"
                          >
                            {IconComponent && <IconComponent className="h-4 w-4" />}
                            <span>{feature.name}</span>
                          </Link>
                        );
                      })}
                    </div>
                  </div>
                ) : (
                  <Link
                    key={item.name}
                    to={item.href}
                    className={`px-3 py-2 rounded-md text-sm font-medium transition-all duration-200 ${location.pathname === item.href
                      ? 'text-purple-600 bg-purple-50 dark:bg-purple-900/20'
                      : 'text-gray-700 dark:text-gray-300 hover:text-purple-600 dark:hover:text-purple-400 hover:bg-gray-50 dark:hover:bg-gray-800/50'
                      }`}
                  >
                    {item.name}
                  </Link>
                )
              ))}
            </div>
          </div>

          {/* Right side buttons */}
          <div className="flex items-center space-x-2 sm:space-x-4">
            {/* Notification Icon */}
            {isAuthenticated && (
              <Link to="/notifications" className="relative">
                <Button variant="ghost" size="sm" className="p-2 hover:bg-gray-100 dark:hover:bg-gray-800 rounded-full">
                  <Bell className="h-5 w-5 text-gray-600 dark:text-gray-300" />
                  {unreadCount > 0 && (
                    <span className="absolute top-1 right-1 h-4 w-4 bg-red-500 text-white text-[10px] font-bold flex items-center justify-center rounded-full shadow-sm border border-white dark:border-gray-900">
                      {unreadCount > 9 ? '9+' : unreadCount}
                    </span>
                  )}
                </Button>
              </Link>
            )}

            {/* Theme Toggle - Super Smooth Transition */}
            <motion.button
              onClick={toggleTheme}
              className="p-2 rounded-full hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors relative overflow-hidden focus:outline-none"
              whileTap={{ scale: 0.9 }}
              aria-label="Toggle theme"
            >
              <AnimatePresence mode="wait" initial={false}>
                <motion.div
                  key={theme}
                  initial={{ y: -20, opacity: 0, rotate: -90 }}
                  animate={{ y: 0, opacity: 1, rotate: 0 }}
                  exit={{ y: 20, opacity: 0, rotate: 90 }}
                  transition={{ duration: 0.2, ease: "easeInOut" }}
                >
                  {theme === 'light' ? (
                    <Moon className="h-5 w-5 text-gray-600 hover:text-purple-600" />
                  ) : (
                    <SunDim className="h-5 w-5 text-white hover:text-purple-600" />
                  )}
                </motion.div>
              </AnimatePresence>
            </motion.button>


            {/* User Menu or Auth Buttons */}
            {isAuthenticated ? (
              <div className="relative group">
                <Button variant="ghost" size="sm" className="flex items-center space-x-2 pl-2 pr-3 rounded-full border border-transparent hover:border-gray-200 dark:hover:border-gray-700 hover:bg-gray-50 dark:hover:bg-gray-800 transition-all">
                  <div className="h-8 w-8 rounded-full bg-purple-100 dark:bg-purple-900/30 flex items-center justify-center text-purple-600 dark:text-purple-400">
                    <User className="h-5 w-5" />
                  </div>
                  <span className="hidden sm:inline max-w-[80px] lg:max-w-[140px] truncate text-sm font-medium text-gray-700 dark:text-gray-200">
                    {user?.email?.split('@')[0] || 'User'}
                  </span>
                </Button>
                <div className="absolute right-0 mt-2 w-48 py-2 bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-xl shadow-xl opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-200 transform origin-top-right z-50">
                  <div className="px-4 py-2 border-b border-gray-100 dark:border-gray-700 mb-1">
                    <p className="text-sm font-medium text-gray-900 dark:text-white truncate">{user?.email}</p>
                  </div>
                  <Link
                    to="/dashboard"
                    className="flex items-center space-x-2 px-4 py-2 text-sm text-gray-700 dark:text-gray-300 hover:bg-purple-50 dark:hover:bg-purple-900/20 hover:text-purple-600 dark:hover:text-purple-400 transition-colors"
                  >
                    <Settings className="h-4 w-4" />
                    <span>Dashboard</span>
                  </Link>
                  <Link
                    to="/events"
                    className="flex items-center space-x-2 px-4 py-2 text-sm text-gray-700 dark:text-gray-300 hover:bg-purple-50 dark:hover:bg-purple-900/20 hover:text-purple-600 dark:hover:text-purple-400 transition-colors"
                  >
                    <Calendar className="h-4 w-4" />
                    <span>Events</span>
                  </Link>
                  <Link
                    to="/hangouts"
                    className="flex items-center space-x-2 px-4 py-2 text-sm text-gray-700 dark:text-gray-300 hover:bg-purple-50 dark:hover:bg-purple-900/20 hover:text-purple-600 dark:hover:text-purple-400 transition-colors"
                  >
                    <MapPin className="h-4 w-4" />
                    <span>Hangouts</span>
                  </Link>
                  <button
                    onClick={handleLogout}
                    className="flex items-center space-x-2 w-full text-left px-4 py-2 text-sm text-red-600 dark:text-red-400 hover:bg-red-50 dark:hover:bg-red-900/20 transition-colors mt-1"
                  >
                    <LogOut className="h-4 w-4" />
                    <span>Logout</span>
                  </button>
                </div>
              </div>
            ) : (
              <div className="hidden md:flex items-center space-x-2">
                <Link to="/login">
                  <Button variant="ghost" size="sm" className="hover:text-purple-600">
                    {getTranslation('login', language)}
                  </Button>
                </Link>
                <Link to="/signup">
                  <Button variant="primary" size="sm" className="shadow-md shadow-purple-600/20 hover:shadow-lg hover:shadow-purple-600/30 transition-all">
                    {getTranslation('signup', language)}
                  </Button>
                </Link>
              </div>
            )}

            {/* Mobile menu button */}
            <div className="md:hidden">
              <Button
                variant="ghost"
                size="sm"
                onClick={() => setIsMenuOpen(!isMenuOpen)}
                className="p-2 hover:bg-gray-100 dark:hover:bg-gray-800 rounded-lg"
              >
                <AnimatePresence mode="wait">
                  {isMenuOpen ? (
                    <motion.div
                      key="close"
                      initial={{ rotate: -90, opacity: 0 }}
                      animate={{ rotate: 0, opacity: 1 }}
                      exit={{ rotate: 90, opacity: 0 }}
                      transition={{ duration: 0.2 }}
                    >
                      <X className="h-6 w-6 text-gray-600 dark:text-gray-300" />
                    </motion.div>
                  ) : (
                    <motion.div
                      key="menu"
                      initial={{ rotate: 90, opacity: 0 }}
                      animate={{ rotate: 0, opacity: 1 }}
                      exit={{ rotate: -90, opacity: 0 }}
                      transition={{ duration: 0.2 }}
                    >
                      <Menu className="h-6 w-6 text-gray-600 dark:text-gray-300" />
                    </motion.div>
                  )}
                </AnimatePresence>
              </Button>
            </div>
          </div>
        </div>

        {/* Mobile menu */}
        <AnimatePresence>
          {isMenuOpen && (
            <motion.div
              initial={{ height: 0, opacity: 0 }}
              animate={{ height: 'auto', opacity: 1 }}
              exit={{ height: 0, opacity: 0 }}
              transition={{ duration: 0.3, ease: "easeInOut" }}
              className="md:hidden overflow-hidden"
            >
              <div className="px-2 pt-2 pb-3 space-y-1 border-t border-gray-200 dark:border-gray-700 bg-white/50 dark:bg-gray-900/50 backdrop-blur-sm rounded-b-2xl shadow-lg mb-4">
                {navigation.map((item) => (
                  item.isDropdown ? (
                    <div key={item.name} className="space-y-1">
                      <div className="px-3 py-2 text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                        {item.name}
                      </div>
                      {featuresMenu.map((feature) => {
                        const IconComponent = feature.icon;
                        return (
                          <Link
                            key={feature.name}
                            to={feature.href}
                            className="flex items-center space-x-3 pl-6 pr-3 py-2.5 rounded-lg text-sm font-medium text-gray-700 dark:text-gray-300 hover:bg-purple-50 dark:hover:bg-purple-900/20 hover:text-purple-600 dark:hover:text-purple-400 transition-colors"
                            onClick={() => setIsMenuOpen(false)}
                          >
                            {IconComponent && <IconComponent className="h-4 w-4" />}
                            <span>{feature.name}</span>
                          </Link>
                        );
                      })}
                    </div>
                  ) : (
                    <Link
                      key={item.name}
                      to={item.href}
                      className={`block px-3 py-2.5 rounded-lg text-base font-medium transition-colors ${location.pathname === item.href
                        ? 'text-purple-600 bg-purple-50 dark:bg-purple-900/20'
                        : 'text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-800'
                        }`}
                      onClick={() => setIsMenuOpen(false)}
                    >
                      {item.name}
                    </Link>
                  )
                ))}
                {!isAuthenticated && (
                  <div className="pt-4 mt-2 border-t border-gray-200 dark:border-gray-700 space-y-3 px-2">
                    <Link to="/login" onClick={() => setIsMenuOpen(false)} className="block">
                      <Button variant="ghost" className="w-full justify-center border border-gray-200 dark:border-gray-700">
                        {getTranslation('login', language)}
                      </Button>
                    </Link>
                    <Link to="/signup" onClick={() => setIsMenuOpen(false)} className="block">
                      <Button variant="primary" className="w-full justify-center shadow-lg shadow-purple-600/20">
                        {getTranslation('signup', language)}
                      </Button>
                    </Link>
                  </div>
                )}
                {isAuthenticated && (
                  <div className="pt-4 mt-2 border-t border-gray-200 dark:border-gray-700 space-y-2">
                    <Link
                      to="/events"
                      className="flex items-center space-x-3 px-3 py-2.5 rounded-lg text-base font-medium text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700"
                      onClick={() => setIsMenuOpen(false)}
                    >
                      <Calendar className="h-5 w-5 text-purple-500" />
                      <span>Events</span>
                    </Link>
                    <Link
                      to="/hangouts"
                      className="flex items-center space-x-3 px-3 py-2.5 rounded-lg text-base font-medium text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700"
                      onClick={() => setIsMenuOpen(false)}
                    >
                      <MapPin className="h-5 w-5 text-purple-500" />
                      <span>Hangouts</span>
                    </Link>
                    <button
                      onClick={() => {
                        handleLogout();
                        setIsMenuOpen(false);
                      }}
                      className="w-full flex items-center space-x-3 px-3 py-2.5 rounded-lg text-base font-medium text-red-600 dark:text-red-400 hover:bg-red-50 dark:hover:bg-red-900/20"
                    >
                      <LogOut className="h-5 w-5" />
                      <span>Logout</span>
                    </button>
                  </div>
                )}
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </nav>
    </header>
  );
};

export default Header;