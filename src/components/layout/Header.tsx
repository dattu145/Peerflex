import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import { motion } from 'framer-motion';
import { 
  Menu, 
  X, 
  Sun, 
  Moon, 
  Languages, 
  User, 
  LogOut, 
  Settings,
  GraduationCap
} from 'lucide-react';
import { useAuthStore } from '../../store/useAuthStore';
import { useAppStore } from '../../store/useAppStore';
import { getTranslation } from '../../config/translations';
import Button from '../ui/Button';

const Header: React.FC = () => {
  const location = useLocation();
  const { user, isAuthenticated, logout } = useAuthStore();
  const { theme, language, isMenuOpen, setTheme, setLanguage, setMenuOpen } = useAppStore();

  const navigation = [
    { name: getTranslation('home', language), href: '/' },
    { name: 'Features', href: '#', isDropdown: true },
    { name: getTranslation('about', language), href: '/about' },
    { name: getTranslation('contact', language), href: '/contact' },
  ];

  const featuresMenu = [
    { name: 'Notes Sharing', href: '/notes' },
    { name: 'Student Chat', href: '/chat' },
    { name: 'Job Listings', href: '/jobs' },
    { name: 'Events', href: '/events' },
    { name: 'Open Source', href: '/projects' },
    { name: 'Resume Builder', href: '/resume-templates' },
  ];

  const languages = [
    { code: 'en', name: 'English' },
    { code: 'ta', name: 'தமிழ்' },
    { code: 'te', name: 'తెలుగు' },
    { code: 'hi', name: 'हिन्दी' },
  ];

  const toggleTheme = () => {
    setTheme(theme === 'light' ? 'dark' : 'light');
  };

  return (
    <header className="sticky top-0 z-40 w-full border-b border-gray-200 dark:border-gray-700 bg-white/80 dark:bg-gray-900/80 backdrop-blur-md">
      <nav className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="flex h-16 items-center justify-between">
          {/* Logo */}
          <div className="flex items-center">
            <Link to="/" className="flex items-center space-x-2">
              <div className="flex h-10 w-10 mr-1 items-center justify-center rounded-lg bg-gradient-to-r from-purple-600 to-blue-600">
                <GraduationCap className="h-7 w-7 text-white" />
              </div>
              <span className="text-xl font-bold bg-gradient-to-r from-purple-600 to-blue-600 bg-clip-text text-transparent">
                CampusPro
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
                      className="px-3 py-2 rounded-md text-sm font-medium text-gray-700 dark:text-gray-300 hover:text-purple-600 dark:hover:text-purple-400 transition-colors"
                    >
                      {item.name}
                    </button>
                    <div className="absolute left-0 mt-2 w-48 py-2 bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-md shadow-lg opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-200 z-50">
                      {featuresMenu.map((feature) => (
                        <Link
                          key={feature.name}
                          to={feature.href}
                          className="block px-4 py-2 text-sm text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700"
                        >
                          {feature.name}
                        </Link>
                      ))}
                    </div>
                  </div>
                ) : (
                  <Link
                    key={item.name}
                    to={item.href}
                    className={`px-3 py-2 rounded-md text-sm font-medium transition-colors ${
                      location.pathname === item.href
                        ? 'text-purple-600 bg-purple-50 dark:bg-purple-900/20'
                        : 'text-gray-700 dark:text-gray-300 hover:text-purple-600 dark:hover:text-purple-400'
                    }`}
                  >
                    {item.name}
                  </Link>
                )
              ))}
            </div>
          </div>

          {/* Right side buttons */}
          <div className="flex items-center space-x-4">
            {/* Theme Toggle */}
            <Button
              variant="ghost"
              size="sm"
              onClick={toggleTheme}
              className="p-2"
            >
              {theme === 'light' ? (
                <Moon className="h-5 w-5" />
              ) : (
                <Sun className="h-5 w-5" />
              )}
            </Button>

            {/* Language Selector */}
            <div className="relative group">
              <Button variant="ghost" size="sm" className="p-2">
                <Languages className="h-5 w-5" />
              </Button>
              <div className="absolute right-0 mt-2 w-32 py-2 bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-md shadow-lg opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-200">
                {languages.map((lang) => (
                  <button
                    key={lang.code}
                    onClick={() => setLanguage(lang.code as any)}
                    className={`block w-full text-left px-4 py-2 text-sm hover:bg-gray-100 dark:hover:bg-gray-700 ${
                      language === lang.code ? 'text-purple-600' : 'text-gray-700 dark:text-gray-300'
                    }`}
                  >
                    {lang.name}
                  </button>
                ))}
              </div>
            </div>

            {/* User Menu or Auth Buttons */}
            {isAuthenticated ? (
              <div className="relative group">
                <Button variant="ghost" size="sm" className="flex items-center space-x-2">
                  <User className="h-5 w-5" />
                  <span className="hidden sm:inline">{user?.name}</span>
                </Button>
                <div className="absolute right-0 mt-2 w-48 py-2 bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-md shadow-lg opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-200">
                  <Link
                    to="/dashboard"
                    className="flex items-center space-x-2 px-4 py-2 text-sm text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700"
                  >
                    <Settings className="h-4 w-4" />
                    <span>Dashboard</span>
                  </Link>
                  <button
                    onClick={logout}
                    className="flex items-center space-x-2 w-full text-left px-4 py-2 text-sm text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700"
                  >
                    <LogOut className="h-4 w-4" />
                    <span>Logout</span>
                  </button>
                </div>
              </div>
            ) : (
              <div className="hidden md:flex items-center space-x-2">
                <Link to="/login">
                  <Button variant="ghost" size="sm">
                    {getTranslation('login', language)}
                  </Button>
                </Link>
                <Link to="/signup">
                  <Button variant="primary" size="sm">
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
                onClick={() => setMenuOpen(!isMenuOpen)}
                className="p-2"
              >
                {isMenuOpen ? (
                  <X className="h-6 w-6" />
                ) : (
                  <Menu className="h-6 w-6" />
                )}
              </Button>
            </div>
          </div>
        </div>

        {/* Mobile menu */}
        <motion.div
          initial={false}
          animate={{ height: isMenuOpen ? 'auto' : 0 }}
          className="md:hidden overflow-hidden"
        >
          <div className="px-2 pt-2 pb-3 space-y-1 border-t border-gray-200 dark:border-gray-700">
            {navigation.map((item) => (
              item.isDropdown ? (
                <div key={item.name}>
                  <div className="px-3 py-2 text-base font-medium text-gray-500 dark:text-gray-400">
                    {item.name}
                  </div>
                  {featuresMenu.map((feature) => (
                    <Link
                      key={feature.name}
                      to={feature.href}
                      className="block pl-6 pr-3 py-2 rounded-md text-sm font-medium text-gray-700 dark:text-gray-300"
                      onClick={() => setMenuOpen(false)}
                    >
                      {feature.name}
                    </Link>
                  ))}
                </div>
              ) : (
                <Link
                  key={item.name}
                  to={item.href}
                  className={`block px-3 py-2 rounded-md text-base font-medium ${
                    location.pathname === item.href
                      ? 'text-purple-600 bg-purple-50 dark:bg-purple-900/20'
                      : 'text-gray-700 dark:text-gray-300'
                  }`}
                  onClick={() => setMenuOpen(false)}
                >
                  {item.name}
                </Link>
              )
            ))}
            {!isAuthenticated && (
              <div className="pt-4 border-t border-gray-200 dark:border-gray-700 space-y-2">
                <Link to="/login" onClick={() => setMenuOpen(false)}>
                  <Button variant="ghost" className="w-full justify-start">
                    {getTranslation('login', language)}
                  </Button>
                </Link>
                <Link to="/signup" onClick={() => setMenuOpen(false)}>
                  <Button variant="primary" className="w-full">
                    {getTranslation('signup', language)}
                  </Button>
                </Link>
              </div>
            )}
          </div>
        </motion.div>
      </nav>
    </header>
  );
};

export default Header;