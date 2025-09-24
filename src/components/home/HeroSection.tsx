import React from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
// import Lanyard from './effects/Lanyard';
// import Draggable from "react-draggable";
import { ArrowRight, Sparkles, Trophy, Users, Zap } from 'lucide-react';
import { useAppStore } from '../../store/useAppStore';
import { getTranslation } from '../../config/translations';
import Button from '../ui/Button';

const HeroSection: React.FC = () => {
  const { language } = useAppStore();

  const stats = [
    { icon: Users, value: '1000+', label: 'Happy Students' },
    { icon: Trophy, value: '500+', label: 'Success Stories' },
    { icon: Sparkles, value: '95%', label: 'Job Success Rate' },
    { icon: Zap, value: '24h', label: 'Quick Delivery' },
  ];

  return (
    <section className="relative overflow-hidden bg-gradient-to-br from-purple-50 via-blue-50 to-teal-50 dark:from-gray-900 dark:via-purple-900/20 dark:to-blue-900/20 py-20">
      {/* <div className="App absolute top-0 right-4 z-50 cursor-move">
        <Draggable>
          <Lanyard position={[0, 0, 20]} gravity={[0, -40, 0]} />
        </Draggable>
      </div> */}
      {/* Background Elements */}
      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute -top-40 -right-32 w-80 h-80 bg-purple-300 rounded-full mix-blend-multiply filter blur-xl opacity-20 animate-pulse"></div>
        <div className="absolute -bottom-40 -left-32 w-80 h-80 bg-blue-300 rounded-full mix-blend-multiply filter blur-xl opacity-20 animate-pulse delay-1000"></div>
        <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-80 h-80 bg-teal-300 rounded-full mix-blend-multiply filter blur-xl opacity-20 animate-pulse delay-2000"></div>
      </div>

      <div className="relative mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="text-center">
          {/* Badge */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="inline-flex items-center rounded-full bg-gradient-to-r from-purple-100 to-blue-100 dark:from-purple-900/30 dark:to-blue-900/30 px-4 py-2 text-sm font-medium text-purple-700 dark:text-purple-300 ring-1 ring-purple-200 dark:ring-purple-800 mb-8"
          >
            <Sparkles className="mr-2 h-4 w-4" />
            AI-Powered Career Tools
            <ArrowRight className="ml-2 h-4 w-4" />
          </motion.div>

          {/* Main Headline */}
          <motion.h1
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.1 }}
            className="text-4xl font-bold tracking-tight text-gray-900 dark:text-white sm:text-5xl lg:text-6xl"
          >
            <span className="block">{getTranslation('heroTitle', language)}</span>
          </motion.h1>

          {/* Subtitle */}
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.2 }}
            className="mx-auto mt-6 max-w-3xl text-lg text-gray-600 dark:text-gray-300 leading-relaxed"
          >
            {getTranslation('heroSubtitle', language)}
          </motion.p>

          {/* CTA Buttons */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.3 }}
            className="mt-10 flex flex-col sm:flex-row items-center justify-center gap-4"
          >
            <Link to="/services">
              <Button variant="primary" size="lg" rightIcon={<ArrowRight className="w-5 h-5" />}>
                {getTranslation('getStarted', language)}
              </Button>
            </Link>
            <Link to="/about">
              <Button variant="outline" size="lg">
                Learn More
              </Button>
            </Link>
          </motion.div>

          {/* Trust Indicators */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.4 }}
            className="mt-16 grid grid-cols-2 gap-6 sm:grid-cols-4"
          >
            {stats.map(({ icon: Icon, value, label }, index) => (
              <div key={label} className="text-center">
                <div className="flex justify-center mb-3">
                  <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-gradient-to-br from-purple-600 to-blue-600 text-white shadow-lg">
                    <Icon className="h-6 w-6" />
                  </div>
                </div>
                <motion.div
                  initial={{ opacity: 0, scale: 0.5 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ duration: 0.6, delay: 0.5 + index * 0.1 }}
                  className="text-2xl font-bold text-gray-900 dark:text-white"
                >
                  {value}
                </motion.div>
                <div className="text-sm text-gray-600 dark:text-gray-400 font-medium">
                  {label}
                </div>
              </div>
            ))}
          </motion.div>
        </div>
      </div>
    </section>
  );
};

export default HeroSection;