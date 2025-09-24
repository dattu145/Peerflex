// src/pages/ServicesPage.tsx
import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  FileText, 
  Globe, 
  Linkedin, 
  Github, 
  Package, 
  Code,
  ArrowRight,
  Star,
  Clock,
  Check,
  ChevronDown,
  ChevronUp
} from 'lucide-react';
import { SERVICES } from '../config/services';
import { useAppStore } from '../store/useAppStore';
import { getTranslation } from '../config/translations';
import { formatCurrency } from '../utils/helpers';
import Card from '../components/ui/Card';
import Button from '../components/ui/Button';
import Header from '../components/layout/Header';

const ServicesPage: React.FC = () => {
  const { language } = useAppStore();
  const [expandedService, setExpandedService] = useState<string | null>(null);
  const [filterCategory, setFilterCategory] = useState<string>('all');

  const serviceIcons = {
    resume: FileText,
    portfolio: Globe,
    linkedin: Linkedin,
    github: Github,
    package: Package,
    software: Code,
  };

  const categories = [
    { id: 'all', name: 'All Services' },
    { id: 'resume', name: 'Resume Services' },
    { id: 'portfolio', name: 'Portfolio Services' },
    { id: 'linkedin', name: 'LinkedIn Services' },
    { id: 'github', name: 'GitHub Services' },
    { id: 'software', name: 'Software Projects' },
    { id: 'package', name: 'Packages' },
  ];

  // Fixed filteredServices logic
  const filteredServices = filterCategory === 'all' 
    ? SERVICES 
    : SERVICES.filter(service => service.category === filterCategory);

  const toggleService = (id: string) => {
    setExpandedService(expandedService === id ? null : id);
  };

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1
      }
    }
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: { 
      opacity: 1, 
      y: 0,
      transition: {
        duration: 0.4
      }
    },
    exit: {
      opacity: 0,
      y: -20,
      transition: {
        duration: 0.3
      }
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
      <Header />
      
      <main className="pt-24 pb-16">
        {/* Hero Section */}
        <section className="relative py-16 bg-gradient-to-br from-purple-50 to-blue-50 dark:from-gray-800 dark:to-gray-900">
          <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
            <div className="text-center">
              <motion.h1
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6 }}
                className="text-4xl font-bold tracking-tight text-gray-900 dark:text-white sm:text-5xl md:text-6xl"
              >
                Our Professional Services
              </motion.h1>
              <motion.p
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: 0.1 }}
                className="mx-auto mt-4 max-w-2xl text-xl text-gray-600 dark:text-gray-300"
              >
                Everything you need to build a standout professional presence and accelerate your career
              </motion.p>
            </div>
          </div>
        </section>

        {/* Services Section */}
        <section className="py-16">
          <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
            {/* Category Filters */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6 }}
              className="flex flex-wrap justify-center gap-4 mb-12"
            >
              {categories.map((category) => (
                <button
                  key={category.id}
                  onClick={() => setFilterCategory(category.id)}
                  className={`px-4 py-2 rounded-full text-sm font-medium transition-colors ${
                    filterCategory === category.id
                      ? 'bg-purple-600 text-white'
                      : 'bg-white dark:bg-gray-800 text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-700'
                  }`}
                >
                  {category.name}
                </button>
              ))}
            </motion.div>

            {/* Services Grid */}
            {filteredServices.length === 0 ? (
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                className="text-center py-12"
              >
                <p className="text-gray-500 dark:text-gray-400">
                  No services found in this category.
                </p>
              </motion.div>
            ) : (
              <motion.div
                key={filterCategory} // This key will force re-render when filter changes
                variants={containerVariants}
                initial="hidden"
                animate="visible"
                className="grid gap-8 lg:grid-cols-2 grid-cols-1"
              >
                <AnimatePresence mode="wait">
                  {filteredServices.map((service) => {
                    const Icon = serviceIcons[service.category as keyof typeof serviceIcons];
                    const isPopular = service.id === 'complete-package';
                    const isExpanded = expandedService === service.id;
                    
                    return (
                      <motion.div 
                        key={service.id} 
                        variants={itemVariants}
                        layout // This enables smooth layout animations
                      >
                        <Card 
                          hover={true} 
                          className={`relative transition-all duration-300 ${
                            isExpanded ? 'ring-2 ring-purple-500' : ''
                          } ${isPopular ? 'ring-2 ring-purple-500 ring-offset-2 dark:ring-offset-gray-900' : ''}`}
                        >
                          {isPopular && (
                            <div className="absolute -top-3 left-1/2 transform -translate-x-1/2">
                              <span className="inline-flex items-center px-3 py-1 rounded-full text-xs font-medium bg-gradient-to-r from-purple-600 to-blue-600 text-white">
                                <Star className="w-3 h-3 mr-1" />
                                Most Popular
                              </span>
                            </div>
                          )}
                          
                          <div className="flex items-start justify-between">
                            <div className="flex-1">
                              <div className="flex items-center gap-4 mb-4">
                                <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-gradient-to-br from-purple-100 to-blue-100 dark:from-purple-900/30 dark:to-blue-900/30 text-purple-600 dark:text-purple-400">
                                  <Icon className="h-6 w-6" />
                                </div>
                                <div>
                                  <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
                                    {service.name}
                                  </h3>
                                  <p className="text-sm text-gray-600 dark:text-gray-300">
                                    {service.description}
                                  </p>
                                </div>
                              </div>

                              {/* Features Preview */}
                              <div className="mb-4">
                                <ul className="space-y-2">
                                  {service.features.slice(0, 3).map((feature, index) => (
                                    <li key={index} className="flex items-center text-sm text-gray-600 dark:text-gray-300">
                                      <Check className="w-4 h-4 text-green-500 mr-2 flex-shrink-0" />
                                      {feature}
                                    </li>
                                  ))}
                                </ul>
                              </div>

                              {/* Expanded Content */}
                              {isExpanded && (
                                <motion.div
                                  initial={{ opacity: 0, height: 0 }}
                                  animate={{ opacity: 1, height: 'auto' }}
                                  exit={{ opacity: 0, height: 0 }}
                                  className="mt-4 space-y-4"
                                >
                                  {/* All Features */}
                                  <div>
                                    <h4 className="font-medium text-gray-900 dark:text-white mb-2">What's Included:</h4>
                                    <ul className="space-y-2">
                                      {service.features.map((feature, index) => (
                                        <li key={index} className="flex items-center text-sm text-gray-600 dark:text-gray-300">
                                          <Check className="w-4 h-4 text-green-500 mr-2 flex-shrink-0" />
                                          {feature}
                                        </li>
                                      ))}
                                    </ul>
                                  </div>

                                  {/* Templates/Options */}
                                  {service.templates && service.templates.length > 0 && (
                                    <div>
                                      <h4 className="font-medium text-gray-900 dark:text-white mb-2">Available Options:</h4>
                                      <div className="grid gap-2 sm:grid-cols-2">
                                        {service.templates.map((template) => (
                                          <div key={template.id} className="p-3 bg-gray-50 dark:bg-gray-800 rounded-lg">
                                            <p className="font-medium text-sm text-gray-900 dark:text-white">{template.name}</p>
                                            <p className="text-xs text-gray-600 dark:text-gray-300">{template.description}</p>
                                          </div>
                                        ))}
                                      </div>
                                    </div>
                                  )}
                                </motion.div>
                              )}
                            </div>
                          </div>

                          {/* Pricing and CTA */}
                          <div className="mt-6 pt-4 border-t border-gray-200 dark:border-gray-700">
                            <div className="flex items-center justify-between mb-4">
                              <div>
                                <div className="flex items-baseline">
                                  <span className="text-2xl font-bold text-gray-900 dark:text-white">
                                    {formatCurrency(service.basePrice)}
                                  </span>
                                  <span className="ml-1 text-sm text-gray-500 dark:text-gray-400">
                                    starting
                                  </span>
                                </div>
                              </div>
                              <div className="flex items-center text-sm text-gray-500 dark:text-gray-400">
                                <Clock className="w-4 h-4 mr-1" />
                                {service.category === 'software' ? '2-4 weeks' : '2-3 days'}
                              </div>
                            </div>

                            <div className="grid grid-cols-2 gap-3">
                              <button
                                onClick={() => toggleService(service.id)}
                                className="flex items-center justify-center text-sm text-purple-600 dark:text-purple-400 hover:text-purple-700 dark:hover:text-purple-300"
                              >
                                {isExpanded ? (
                                  <>
                                    <ChevronUp className="w-4 h-4 mr-1" />
                                    Less details
                                  </>
                                ) : (
                                  <>
                                    <ChevronDown className="w-4 h-4 mr-1" />
                                    More details
                                  </>
                                )}
                              </button>
                              <Link to={`/order/${service.id}`}>
                                <Button 
                                  variant={isPopular ? 'primary' : 'secondary'} 
                                  size="sm" 
                                  className="w-full"
                                >
                                  {getTranslation('orderNow', language)}
                                </Button>
                              </Link>
                            </div>
                          </div>
                        </Card>
                      </motion.div>
                    );
                  })}
                </AnimatePresence>
              </motion.div>
            )}

            {/* CTA Section */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6, delay: 0.3 }}
              className="mt-16 text-center"
            >
              <div className="bg-gradient-to-r from-purple-600 to-blue-600 rounded-2xl p-8 text-white">
                <h2 className="text-2xl font-bold mb-4">Need a Custom Solution?</h2>
                <p className="mb-6 opacity-90">
                  Have specific requirements? We can create a tailored package just for you.
                </p>
                <Link to="/contact">
                  <Button 
                    variant="white" 
                    size="lg"
                    rightIcon={<ArrowRight className="w-5 h-5" />}
                  >
                    Contact Us
                  </Button>
                </Link>
              </div>
            </motion.div>
          </div>
        </section>
      </main>
    </div>
  );
};

export default ServicesPage;