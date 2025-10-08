import React from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import Layout from '../components/layout/Layout';
import HeroSection3D from '../components/home/HeroSection3D';
import {
  BookOpen,
  MessageCircle,
  Briefcase,
  Calendar,
  Github,
  FileText,
  Sparkles,
  ArrowRight,
  Zap,
  Users,
  TrendingUp
} from 'lucide-react';
import Button from '../components/ui/Button';

const HomePage: React.FC = () => {
  const features = [
    {
      icon: BookOpen,
      title: 'Notes Sharing',
      description: 'Share and discover study notes from students worldwide',
      gradient: 'bg-purple-600',
      link: '/notes'
    },
    {
      icon: MessageCircle,
      title: 'Student Chat',
      description: 'Direct messaging and group chats with classmates',
      gradient: 'bg-purple-600',
      link: '/chat'
    },
    {
      icon: Briefcase,
      title: 'Job Listings',
      description: 'Find internships with auto-apply integration',
      gradient: 'bg-purple-600',
      link: '/jobs'
    },
    {
      icon: Calendar,
      title: 'Events & Hangouts',
      description: 'Join workshops, study groups, and social events',
      gradient: 'bg-purple-600',
      link: '/events'
    },
    {
      icon: Github,
      title: 'Open Source',
      description: 'Contribute to student-led open source projects',
      gradient: 'bg-purple-600',
      link: '/projects'
    },
    {
      icon: FileText,
      title: 'Resume Builder',
      description: 'Create professional resumes with AI assistance',
      gradient: 'bg-purple-600',
      link: '/resume-templates'
    }
  ];


  return (
    <Layout>
      <HeroSection3D />
      <div className="min-h-screen bg-gradient-to-br from-purple-50 via-white to-purple-50 dark:from-gray-900 dark:via-gray-800 dark:to-gray-900 overflow-hidden">
        
        {/* <section className="relative py-20 px-4 sm:px-6 lg:px-8">
          <div className="max-w-7xl mx-auto relative">
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8 }}
              className="text-center"
            >
              <motion.div
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
                transition={{ delay: 0.2, type: 'spring', stiffness: 200 }}
                className="inline-flex items-center gap-2 px-4 py-2 bg-blue-100 dark:bg-blue-900/30 rounded-full mb-6"
              >
                <Sparkles className="h-5 w-5 text-blue-600 dark:text-blue-400" />
                <span className="text-sm font-medium text-blue-900 dark:text-blue-300">
                  Your All-in-One Student Platform
                </span>
              </motion.div>

              <h1 className="text-5xl md:text-7xl font-extrabold text-gray-900 dark:text-white mb-6">
                Welcome to{' '}
                <span className="text-purple-600">
                  CampusPro
                </span>
              </h1>

              <p className="text-xl md:text-2xl text-gray-600 dark:text-gray-300 mb-8 max-w-3xl mx-auto">
                Connect, learn, and grow with the ultimate student super-app. Share notes, chat with peers, find jobs, and more.
              </p>

              <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
                <Link to="/signup">
                  <Button variant="primary" className="bg-purple-600 text-lg px-8 py-4">
                    Get Started Free
                    <ArrowRight className="ml-2 h-5 w-5" />
                  </Button>
                </Link>
                <Link to="/about">
                  <Button variant="ghost" className="text-lg px-8 py-4">
                    Learn More
                  </Button>
                </Link>
              </div>
            </motion.div>
          </div>
        </section> */}

        <section className="py-20 px-4 sm:px-6 lg:px-8">
          <div className="max-w-7xl mx-auto">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              className="text-center mb-16"
            >
              <h2 className="text-4xl md:text-5xl font-bold text-gray-900 dark:text-white mb-4">
                Everything You Need, One Place
              </h2>
              <p className="text-xl text-gray-600 dark:text-gray-300">
                Powerful features designed specifically for students
              </p>
            </motion.div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {features.map((feature, index) => (
                <motion.div
                  key={feature.title}
                  initial={{ opacity: 0, y: 30 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: index * 0.1 }}
                  whileHover={{ y: -10, transition: { duration: 0.2 } }}
                >
                  <Link to={feature.link}>
                    <div className="relative group">
                      <div className="absolute inset-0 bg-gradient-to-r opacity-0 group-hover:opacity-100 transition-opacity duration-300 rounded-2xl blur-xl"
                           style={{ background: `linear-gradient(to right, var(--tw-gradient-stops))` }} />
                      <div className="relative bg-white dark:bg-gray-800 rounded-2xl p-8 shadow-lg hover:shadow-2xl transition-all duration-300 border-2 border-gray-100 dark:border-gray-700 group-hover:border-transparent">
                        <div className={`inline-flex p-3 rounded-xl bg- ${feature.gradient} mb-4`}>
                          <feature.icon className="h-8 w-8 text-white" />
                        </div>
                        <h3 className="text-2xl font-bold text-gray-900 dark:text-white mb-2">
                          {feature.title}
                        </h3>
                        <p className="text-gray-600 dark:text-gray-300 mb-4">
                          {feature.description}
                        </p>
                        <div className="flex items-center text-blue-600 dark:text-blue-400 font-semibold group-hover:gap-1 transition-all">
                          Explore
                          <ArrowRight className="h-4 w-4 ml-2 group-hover:translate-x-1 transition-transform" />
                        </div>
                      </div>
                    </div>
                  </Link>
                </motion.div>
              ))}
            </div>
          </div>
        </section>

        <section className="py-20 px-4 sm:px-6 lg:px-8 bg-purple-600 relative overflow-hidden">
          <div className="absolute inset-0 opacity-10">
            <div className="absolute top-0 left-0 w-96 h-96 bg-white rounded-full filter blur-3xl" />
            <div className="absolute bottom-0 right-0 w-96 h-96 bg-white rounded-full filter blur-3xl" />
          </div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="max-w-4xl mx-auto text-center relative z-10"
          >
            <Zap className="h-16 w-16 text-white mx-auto mb-6" />
            <h2 className="text-4xl md:text-5xl font-bold text-white mb-6">
              Ready to Transform Your Student Life?
            </h2>
            <p className="text-xl text-white/90 mb-8">
              Join thousands of students already using CampusPro to succeed in their academic journey
            </p>
            <Link to="/signup">
              <Button variant="ghost" className="bg-white text-blue-600 hover:bg-gray-100 text-lg px-8 py-4">
                Start Your Journey
                <Sparkles className="ml-2 h-5 w-5" />
              </Button>
            </Link>
          </motion.div>
        </section>
      </div>

      <style>{`
        @keyframes blob {
          0%, 100% { transform: translate(0, 0) scale(1); }
          33% { transform: translate(30px, -50px) scale(1.1); }
          66% { transform: translate(-20px, 20px) scale(0.9); }
        }
        .animate-blob {
          animation: blob 7s infinite;
        }
        .animation-delay-2000 {
          animation-delay: 2s;
        }
        .animation-delay-4000 {
          animation-delay: 4s;
        }
      `}</style>
    </Layout>
  );
};

export default HomePage;
