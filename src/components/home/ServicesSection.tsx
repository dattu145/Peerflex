// src/components/home/ServicesSection.tsx
import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import MagicBento from '../../effects/MagicBento';
import {
  FileText,
  Globe,
  Linkedin,
  Code,
  Github,
  Package,
  ArrowRight,
  Star,
  Clock,
  LayoutTemplate,
  Eye
} from 'lucide-react';
import { SERVICES } from '../../config/services';
import { useAppStore } from '../../store/useAppStore';
import { getTranslation } from '../../config/translations';
import { formatCurrency } from '../../utils/authHelpers';
import Card from '../ui/Card';
import Button from '../ui/Button';

const ServicesSection: React.FC = () => {
  const { language } = useAppStore();
  const navigate = useNavigate();

  const serviceIcons = {
    resume: FileText,
    portfolio: Globe,
    linkedin: Linkedin,
    github: Github,
    package: Package,
    software: Code,
  };

  // Handle service selection with proper routing
  const handleServiceSelect = (serviceId: string) => {
    switch (serviceId) {
      case 'resume-templates':
        navigate('/resume-templates');
        break;
      case 'portfolio-building':
        navigate('/portfolio-templates');
        break;
      case 'software-projects':
        navigate('/software-projects');
        break;
      default:
        navigate(`/order/${serviceId}`);
        break;
    }
  };

  // Handle template preview
  const handleTemplatePreview = (serviceId: string) => {
    switch (serviceId) {
      case 'resume-templates':
        navigate('/resume-templates');
        break;
      case 'portfolio-building':
        navigate('/portfolio-templates');
        break;
      default:
        navigate(`/services#${serviceId}`);
        break;
    }
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
    visible: { opacity: 1, y: 0 }
  };

  // Check if service has templates
  const hasTemplates = (serviceId: string) => {
    return ['resume-templates', 'portfolio-building'].includes(serviceId);
  };

  return (
    <section className="py-20 bg-white dark:bg-gray-900">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="text-center">
          <motion.h2
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
            className="text-3xl font-bold tracking-tight text-gray-900 dark:text-white sm:text-4xl"
          >
            {getTranslation('ourServices', language)}
          </motion.h2>
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6, delay: 0.1 }}
            className="mx-auto mt-4 max-w-2xl text-lg text-gray-600 dark:text-gray-300"
          >
            {getTranslation('servicesDescription', language)}
          </motion.p>
        </div>

        <motion.div
          variants={containerVariants}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true }}
          className="mt-16 grid gap-6 lg:grid-cols-3 md:grid-cols-2 grid-cols-1"
        >
          {SERVICES.map((service, index) => {
            const Icon = serviceIcons[service.category];
            const isPopular = service.id === 'complete-package';
            const serviceHasTemplates = hasTemplates(service.id);

            return (
              <motion.div key={service.id} variants={itemVariants}>
                <Card
                  hover={true}
                  className={`h-full relative ${isPopular ? 'ring-2 ring-purple-500 ring-offset-2 dark:ring-offset-gray-900' : ''
                    }`}
                >
                  {isPopular && (
                    <div className="absolute -top-3 left-1/2 transform -translate-x-1/2">
                      <span className="inline-flex items-center px-3 py-1 rounded-full text-xs font-medium bg-gradient-to-r from-purple-600 to-blue-600 text-white">
                        <Star className="w-3 h-3 mr-1" />
                        Most Popular
                      </span>
                    </div>
                  )}

                  <div className="flex items-start justify-between mb-4">
                    <div className="flex-1">
                      <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-gradient-to-br from-purple-100 to-blue-100 dark:from-purple-900/30 dark:to-blue-900/30 text-purple-600 dark:text-purple-400 mb-4">
                        <Icon className="h-6 w-6" />
                      </div>
                      <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-2">
                        {service.name}
                      </h3>
                      <p className="text-sm text-gray-600 dark:text-gray-300 mb-4">
                        {service.description}
                      </p>
                    </div>
                  </div>

                  {/* Features */}
                  <div className="mb-6">
                    <ul className="space-y-2">
                      {service.features.slice(0, 4).map((feature, index) => (
                        <li key={index} className="flex items-center text-sm text-gray-600 dark:text-gray-300">
                          <div className="w-1.5 h-1.5 bg-purple-500 rounded-full mr-2 flex-shrink-0"></div>
                          {feature}
                        </li>
                      ))}
                      {service.features.length > 4 && (
                        <li className="text-sm text-purple-600 dark:text-purple-400 font-medium">
                          +{service.features.length - 4} more features
                        </li>
                      )}
                    </ul>
                  </div>

                  {/* Pricing and CTA */}
                  <div className="mt-auto">
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

                    <div className={`grid gap-2 grid-cols-2`}>
                      {/* View Details Button */}
                      <Button 
                        variant="outline" 
                        size="sm" 
                        className="w-full"
                        onClick={() => handleTemplatePreview(service.id)}
                        leftIcon={<Eye className="w-4 h-4" />}
                      >
                        Preview
                      </Button>


                      {/* Main CTA Button */}
                      <Button
                        variant={isPopular ? 'primary' : 'secondary'}
                        size="sm"
                        className="w-full"
                        onClick={() => handleServiceSelect(service.id)}
                        leftIcon={serviceHasTemplates ? <LayoutTemplate className="w-4 h-4" /> : undefined}
                      >
                        {serviceHasTemplates ? 'View Templates' : getTranslation('orderNow', language)}
                      </Button>
                    </div>

                    {/* Special note for template-based services */}
                    {serviceHasTemplates && (
                      <p className="text-xs text-gray-500 dark:text-gray-400 mt-2 text-center">
                        Multiple templates available with AI customization
                      </p>
                    )}
                  </div>
                </Card>
              </motion.div>
            );
          })}
        </motion.div>

        {/* View All Services CTA */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6, delay: 0.3 }}
          className="mt-12 text-center"
        >
          <Link to="/services">
            <Button
              variant="outline"
              size="lg"
              rightIcon={<ArrowRight className="w-5 h-5" />}
            >
              View All Services
            </Button>
          </Link>
        </motion.div>
      </div>
      <div className="stats flex justify-center items-center pt-12">
        <MagicBento
          textAutoHide={true}
          enableStars={true}
          enableSpotlight={true}
          enableBorderGlow={true}
          enableTilt={true}
          enableMagnetism={true}
          clickEffect={true}
          spotlightRadius={300}
          particleCount={12}
          glowColor="132, 0, 255"
        />
      </div>
    </section>
  );
};

export default ServicesSection;