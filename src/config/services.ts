// src/config/services.ts
import { Service } from '../types';

export const SERVICES: Service[] = [
  {
    id: 'resume-templates',
    name: 'Professional Resume Templates',
    description: 'ATS-friendly resume templates designed for modern job markets',
    basePrice: 299,
    category: 'resume',
    features: [
      'ATS-Optimized Format',
      '5+ Professional Templates',
      'AI-Assisted Content Writing',
      'Industry-Specific Customization',
      'PDF & Word Format'
    ],
    templates: [
      {
        id: 'modern-minimalist',
        name: 'Modern Minimalist',
        description: 'Clean, contemporary design perfect for tech roles',
        previewImage: 'https://images.pexels.com/photos/7688460/pexels-photo-7688460.jpeg?auto=compress&cs=tinysrgb&w=400',
        difficulty: 'basic'
      },
      {
        id: 'executive-professional',
        name: 'Executive Professional',
        description: 'Sophisticated layout for senior positions',
        previewImage: 'https://images.pexels.com/photos/7688336/pexels-photo-7688336.jpeg?auto=compress&cs=tinysrgb&w=400',
        difficulty: 'advanced'
      },
      {
        id: 'creative-portfolio',
        name: 'Creative Portfolio',
        description: 'Visually striking design for creative professionals',
        previewImage: 'https://images.pexels.com/photos/7688640/pexels-photo-7688640.jpeg?auto=compress&cs=tinysrgb&w=400',
        difficulty: 'premium'
      }
    ]
  },
  {
    id: 'portfolio-building',
    name: 'Custom Portfolio Development',
    description: 'Professional portfolio websites deployed on modern platforms',
    basePrice: 799,
    category: 'portfolio',
    features: [
      'Custom Domain Setup',
      'Mobile-Responsive Design',
      'SEO Optimization',
      'Contact Form Integration',
      'Portfolio Hosting (1 Year)'
    ],
    templates: [
      {
        id: 'developer-showcase',
        name: 'Developer Showcase',
        description: 'Perfect for software developers and programmers',
        previewImage: 'https://images.pexels.com/photos/4348401/pexels-photo-4348401.jpeg?auto=compress&cs=tinysrgb&w=400',
        difficulty: 'advanced'
      },
      {
        id: 'design-portfolio',
        name: 'Design Portfolio',
        description: 'Visual-focused layout for designers and artists',
        previewImage: 'https://images.pexels.com/photos/196644/pexels-photo-196644.jpeg?auto=compress&cs=tinysrgb&w=400',
        difficulty: 'premium'
      },
      {
        id: 'business-professional',
        name: 'Business Professional',
        description: 'Corporate-style portfolio for business professionals',
        previewImage: 'https://images.pexels.com/photos/7688479/pexels-photo-7688479.jpeg?auto=compress&cs=tinysrgb&w=400',
        difficulty: 'basic'
      }
    ]
  },
  {
    id: 'linkedin-optimization',
    name: 'LinkedIn Profile Optimization',
    description: 'Complete LinkedIn makeover to boost your professional presence',
    basePrice: 199,
    category: 'linkedin',
    features: [
      'Profile Headline Optimization',
      'About Section Rewrite',
      'Experience Enhancement',
      'Skills & Endorsements Strategy',
      'Connection Building Tips'
    ],
    templates: [
      {
        id: 'tech-professional',
        name: 'Tech Professional',
        description: 'Optimized for software engineers and IT professionals',
        previewImage: 'https://images.pexels.com/photos/4348401/pexels-photo-4348401.jpeg?auto=compress&cs=tinysrgb&w=400',
        difficulty: 'basic'
      },
      {
        id: 'business-leader',
        name: 'Business Leader',
        description: 'Executive-level optimization for leadership roles',
        previewImage: 'https://images.pexels.com/photos/7688336/pexels-photo-7688336.jpeg?auto=compress&cs=tinysrgb&w=400',
        difficulty: 'advanced'
      }
    ]
  },
  {
    id: 'github-optimization',
    name: 'GitHub Profile Enhancement',
    description: 'Professional GitHub profile setup with custom README and optimization',
    basePrice: 149,
    category: 'github',
    features: [
      'Custom README Design',
      'Repository Organization',
      'Profile Statistics Setup',
      'Contribution Graph Optimization',
      'Project Showcase'
    ],
    templates: [
      {
        id: 'developer-stats',
        name: 'Developer Stats',
        description: 'Statistics-focused profile with detailed metrics',
        previewImage: 'https://images.pexels.com/photos/4348401/pexels-photo-4348401.jpeg?auto=compress&cs=tinysrgb&w=400',
        difficulty: 'basic'
      },
      {
        id: 'project-showcase',
        name: 'Project Showcase',
        description: 'Portfolio-style GitHub profile highlighting key projects',
        previewImage: 'https://images.pexels.com/photos/196644/pexels-photo-196644.jpeg?auto=compress&cs=tinysrgb&w=400',
        difficulty: 'advanced'
      }
    ]
  },
  {
    id: 'software-projects',
    name: 'Custom Software Development',
    description: 'Build professional software projects for your portfolio and learning',
    basePrice: 1499,
    category: 'software',
    features: [
      'Full-Stack Web Applications',
      'Mobile App Development',
      'Database Design & Integration',
      'API Development',
      'Deployment & Hosting Setup',
      'Source Code Documentation',
      'Technical Support',
      'Project Maintenance (1 Month)'
    ],
    templates: [
      {
        id: 'ecommerce-platform',
        name: 'E-commerce Platform',
        description: 'Complete online store with payment integration',
        previewImage: 'https://images.pexels.com/photos/5632402/pexels-photo-5632402.jpeg?auto=compress&cs=tinysrgb&w=400',
        difficulty: 'advanced'
      },
      {
        id: 'task-management-app',
        name: 'Task Management App',
        description: 'Productivity application with user authentication',
        previewImage: 'https://images.pexels.com/photos/7376/startup-photos.jpg?auto=compress&cs=tinysrgb&w=400',
        difficulty: 'basic'
      },
      {
        id: 'social-media-dashboard',
        name: 'Social Media Dashboard',
        description: 'Analytics dashboard for social media metrics',
        previewImage: 'https://images.pexels.com/photos/267394/pexels-photo-267394.jpeg?auto=compress&cs=tinysrgb&w=400',
        difficulty: 'premium'
      }
    ]
  },
  {
    id: 'complete-package',
    name: 'Complete Professional Package',
    description: 'All-in-one solution including resume, portfolio, profile optimizations, and software projects',
    basePrice: 1999,
    category: 'package',
    features: [
      'Professional Resume',
      'Custom Portfolio Website',
      'LinkedIn Optimization',
      'GitHub Enhancement',
      'Custom Software Project',
      'Interview Preparation Guide',
      'Job Application Strategy',
      'Priority Support',
      '60-Day Revisions'
    ],
    templates: [
      {
        id: 'student-package',
        name: 'Student Complete',
        description: 'Tailored for college students and recent graduates',
        previewImage: 'https://images.pexels.com/photos/7688460/pexels-photo-7688460.jpeg?auto=compress&cs=tinysrgb&w=400',
        difficulty: 'basic'
      },
      {
        id: 'professional-package',
        name: 'Professional Complete',
        description: 'Comprehensive package for experienced professionals',
        previewImage: 'https://images.pexels.com/photos/7688336/pexels-photo-7688336.jpeg?auto=compress&cs=tinysrgb&w=400',
        difficulty: 'premium'
      }
    ]
  }
];