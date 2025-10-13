// src/components/layout/Footer.tsx
import React from 'react';
import { Link } from 'react-router-dom';
import {
  GraduationCap,
  Mail,
  Phone,
  MapPin,
  ArrowUp,
  Twitter,
  Linkedin,
  Instagram,
  Github,
  FileText,
  Globe,
  Code,
  Users,
} from 'lucide-react';
import { APP_CONFIG } from '../../config/constants';
import { useAppStore } from '../../store/useAppStore';
import { getTranslation } from '../../config/translations';
import Button from '../ui/Button';

const Footer: React.FC = () => {
  const { language } = useAppStore();

  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const footerLinks = {
    services: [
      {
        name: 'Resume Templates',
        href: '/resume-templates',
        icon: FileText,
      },
      {
        name: 'Portfolio Building',
        href: '/portfolio-templates',
        icon: Globe,
      },
      {
        name: 'Software Projects',
        href: '/software-projects',
        icon: Code,
      },
      {
        name: 'Complete Package',
        href: '/services#complete-package',
        icon: Users,
      },
    ],
    company: [
      { name: getTranslation('about', language), href: '/about' },
      { name: 'Contact Us', href: '/contact' },
      { name: 'Privacy Policy', href: '/privacy' },
      { name: 'Terms of Service', href: '/terms' },
    ],
    resources: [
      { name: 'Resume Builder', href: '/resume-builder' },
      { name: 'Portfolio Templates', href: '/portfolio-templates' },
      { name: 'Career Tips', href: '/tips' },
      { name: 'Support Center', href: '/support' },
    ],
    quickLinks: [
      { name: 'Home', href: '/' },
      { name: 'Services', href: '/services' },
      { name: 'About', href: '/about' },
      { name: 'Contact', href: '/contact' },
    ]
  };

  const socialLinks = [
    {
      icon: Twitter,
      href: APP_CONFIG.socialLinks.twitter,
      label: 'Twitter',
    },
    {
      icon: Linkedin,
      href: APP_CONFIG.socialLinks.linkedin,
      label: 'LinkedIn',
    },
    {
      icon: Instagram,
      href: APP_CONFIG.socialLinks.instagram,
      label: 'Instagram',
    },
    {
      icon: Github,
      href: APP_CONFIG.socialLinks.github,
      label: 'GitHub',
    },
  ];

  return (
    <footer className="relative bg-gray-100 dark:bg-gray-900 text-white">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        {/* Main Footer */}
        <div className="py-12 lg:py-16">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-8">
            {/* Company Info */}
            <div className="lg:col-span-2">
              <div className="flex items-center space-x-2 mb-6">
                <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-purple-600">
                  <GraduationCap className="h-5 w-5 text-white" />
                </div>
                <span className="text-xl font-bold text-gray-900 dark:text-gray-100">Peerflex</span>
              </div>
              <p className="text-gray-900 dark:text-gray-100 mb-6 text-sm leading-relaxed">
                Empowering students and professionals with AI-driven career tools.
                Build your future with professional resumes, portfolios, and optimized profiles.
                Choose from multiple templates with AI-powered customization.
              </p>

              {/* Contact Info */}
              <div className="space-y-3">
                <div className="flex items-center space-x-3">
                  <Mail className="h-4 w-4 text-purple-400" />
                  <a
                    href={`mailto:${APP_CONFIG.contactEmail}`}
                    className="text-sm hover:text-purple-400 transition-colors text-gray-900 dark:text-gray-100 hover:text-purple-700 dark:hover:text-purple-400"
                  >
                    {APP_CONFIG.contactEmail}
                  </a>
                </div>
                <div className="flex items-center space-x-3">
                  <Phone className="h-4 w-4 text-purple-400" />
                  <a
                    href={`tel:${APP_CONFIG.contactPhone}`}
                    className="text-sm hover:text-purple-400 transition-colors text-gray-900 dark:text-gray-100 hover:text-purple-700 dark:hover:text-purple-400"
                  >
                    {APP_CONFIG.contactPhone}
                  </a>
                </div>
                <div className="flex items-center space-x-3">
                  <MapPin className="h-4 w-4 text-purple-400" />
                  <span className="text-sm text-gray-900 dark:text-gray-100">India</span>
                </div>
              </div>

              {/* Social Links */}
              <div className="flex items-center space-x-4 mt-6">
                {socialLinks.map(({ icon: Icon, href, label }) => (
                  <a
                    key={label}
                    href={href}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-gray-100 bg-purple-600 hover:text-purple-400 transition-colors p-2 rounded-lg hover:bg-gray-700"
                    aria-label={label}
                  >
                    <Icon className="h-5 w-5" />
                  </a>
                ))}
              </div>
            </div>

            {/* Services */}
            <div>
              <h3 className="text-lg font-semibold mb-6 flex items-center text-gray-900 dark:text-gray-100">
                Services
              </h3>
              <ul className="space-y-4">
                {footerLinks.services.map((link) => {
                  const Icon = link.icon;
                  return (
                    <li key={link.name}>
                      <Link
                        to={link.href}
                        className="group flex items-start space-x-3 text-sm text-gray-900 dark:text-gray-100 hover:text-purple-700 dark:hover:text-purple-400 transition-colors"
                      >
                        <Icon className="h-4 w-4 mt-0.5 text-purple-400 flex-shrink-0" />
                        <div>
                          <div className="font-medium group-hover:text-purple-400">
                            {link.name}
                          </div>
                        </div>
                      </Link>
                    </li>
                  );
                })}
              </ul>
            </div>

            {/* Resources */}
            <div>
              <h3 className="text-lg font-semibold mb-6 flex items-center text-gray-900 dark:text-gray-100">
                Resources
              </h3>
              <ul className="space-y-3">
                {footerLinks.resources.map((link) => (
                  <li key={link.name}>
                    <Link
                      to={link.href}
                      className="text-sm text-gray-900 dark:text-gray-100 hover:text-purple-700 dark:hover:text-purple-400 transition-colors block py-1"
                    >
                      {link.name}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>

            <div>
              <h3 className="text-lg font-semibold mb-6 text-gray-900 dark:text-gray-100">Quick Links</h3>
              <ul className="space-y-3">
                {footerLinks.quickLinks.map((link) => (
                  <li key={link.name}>
                    <Link
                      to={link.href}
                      className="text-sm text-gray-900 dark:text-gray-100 hover:text-purple-700 dark:hover:text-purple-400 transition-colors block py-1"
                    >
                      {link.name}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>

          </div>
        </div>

        {/* Bottom Footer */}
        <div className="border-t border-gray-800 py-6">
          <div className="flex flex-col sm:flex-row items-center justify-between space-y-4 sm:space-y-0">
            <div className="text-sm text-gray-400">
              © {new Date().getFullYear()} Peerflex. All rights reserved.
              <span className="mx-2">•</span>
              <span>Built with ❤️ for students and professionals</span>
            </div>

            {/* Additional Links */}
            <div className="flex items-center space-x-6 text-sm text-gray-400">
              <Link to="/privacy" className="hover:text-purple-400 transition-colors">
                Privacy
              </Link>
              <Link to="/terms" className="hover:text-purple-400 transition-colors">
                Terms
              </Link>
              <Link to="/sitemap" className="hover:text-purple-400 transition-colors">
                Sitemap
              </Link>
            </div>
          </div>
        </div>
      </div>

      {/* Back to Top Button */}
      <Button
        variant="primary"
        size="sm"
        onClick={scrollToTop}
        className="fixed bottom-8 right-8 z-50 rounded-full p-3 shadow-lg"
        aria-label="Back to top"
      >
        <ArrowUp className="h-5 w-5" />
      </Button>
    </footer>
  );
};

export default Footer;