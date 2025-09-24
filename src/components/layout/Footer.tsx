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
  Github
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
      { name: 'Resume Templates', href: '/services/resume' },
      { name: 'Portfolio Building', href: '/services/portfolio' },
      { name: 'LinkedIn Optimization', href: '/services/linkedin' },
      { name: 'GitHub Enhancement', href: '/services/github' },
    ],
    company: [
      { name: getTranslation('about', language), href: '/about' },
      { name: 'Privacy Policy', href: '/privacy' },
      { name: 'Terms of Service', href: '/terms' },
      { name: 'Support', href: '/support' },
    ],
    resources: [
      { name: 'Blog', href: '/blog' },
      { name: 'Career Tips', href: '/tips' },
      { name: 'Templates', href: '/templates' },
      { name: 'FAQ', href: '/faq' },
    ],
  };

  const socialLinks = [
    { icon: Twitter, href: APP_CONFIG.socialLinks.twitter, label: 'Twitter' },
    { icon: Linkedin, href: APP_CONFIG.socialLinks.linkedin, label: 'LinkedIn' },
    { icon: Instagram, href: APP_CONFIG.socialLinks.instagram, label: 'Instagram' },
    { icon: Github, href: APP_CONFIG.socialLinks.github, label: 'GitHub' },
  ];

  return (
    <footer className="relative bg-gray-900 text-white">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        {/* Main Footer */}
        <div className="py-12 lg:py-16">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            {/* Company Info */}
            <div className="lg:col-span-1">
              <div className="flex items-center space-x-2 mb-6">
                <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-gradient-to-r from-purple-600 to-blue-600">
                  <GraduationCap className="h-5 w-5 text-white" />
                </div>
                <span className="text-xl font-bold">CampusPro</span>
              </div>
              <p className="text-gray-300 mb-6 text-sm leading-relaxed">
                Empowering students and professionals with AI-driven career tools. 
                Build your future with professional resumes, portfolios, and optimized profiles.
              </p>
              
              {/* Contact Info */}
              <div className="space-y-3">
                <div className="flex items-center space-x-3">
                  <Mail className="h-4 w-4 text-purple-400" />
                  <a 
                    href={`mailto:${APP_CONFIG.contactEmail}`}
                    className="text-sm text-gray-300 hover:text-purple-400 transition-colors"
                  >
                    {APP_CONFIG.contactEmail}
                  </a>
                </div>
                <div className="flex items-center space-x-3">
                  <Phone className="h-4 w-4 text-purple-400" />
                  <a 
                    href={`tel:${APP_CONFIG.contactPhone}`}
                    className="text-sm text-gray-300 hover:text-purple-400 transition-colors"
                  >
                    {APP_CONFIG.contactPhone}
                  </a>
                </div>
                <div className="flex items-center space-x-3">
                  <MapPin className="h-4 w-4 text-purple-400" />
                  <span className="text-sm text-gray-300">India</span>
                </div>
              </div>
            </div>

            {/* Services */}
            <div>
              <h3 className="text-lg font-semibold mb-6">Services</h3>
              <ul className="space-y-3">
                {footerLinks.services.map((link) => (
                  <li key={link.name}>
                    <Link
                      to={link.href}
                      className="text-sm text-gray-300 hover:text-purple-400 transition-colors"
                    >
                      {link.name}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>

            {/* Company */}
            <div>
              <h3 className="text-lg font-semibold mb-6">Company</h3>
              <ul className="space-y-3">
                {footerLinks.company.map((link) => (
                  <li key={link.name}>
                    <Link
                      to={link.href}
                      className="text-sm text-gray-300 hover:text-purple-400 transition-colors"
                    >
                      {link.name}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>

            {/* Resources */}
            <div>
              <h3 className="text-lg font-semibold mb-6">Resources</h3>
              <ul className="space-y-3">
                {footerLinks.resources.map((link) => (
                  <li key={link.name}>
                    <Link
                      to={link.href}
                      className="text-sm text-gray-300 hover:text-purple-400 transition-colors"
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
              © {new Date().getFullYear()} CampusPro. All rights reserved.
            </div>
            
            {/* Social Links */}
            <div className="flex items-center space-x-4">
              {socialLinks.map(({ icon: Icon, href, label }) => (
                <a
                  key={label}
                  href={href}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-gray-400 hover:text-purple-400 transition-colors"
                  aria-label={label}
                >
                  <Icon className="h-5 w-5" />
                </a>
              ))}
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
      >
        <ArrowUp className="h-5 w-5" />
      </Button>
    </footer>
  );
};

export default Footer;