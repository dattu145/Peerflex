import React, { useState, useRef } from 'react';
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
} from 'lucide-react';
import Button from '../components/ui/Button';

const HomePage = () => {
  const [isVideoPlaying, setIsVideoPlaying] = useState(true);
  const videoRef = useRef(null);

  const aiImages = [
    'https://plus.unsplash.com/premium_photo-1684444605542-93725082d214?ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxzZWFyY2h8MXx8bm90ZSUyMHRha2luZ3xlbnwwfHwwfHx8MA%3D%3D&fm=jpg&q=60&w=3000',
    'https://images.unsplash.com/photo-1523580494863-6f3031224c94?ixlib=rb-4.0.3&auto=format&fit=crop&w=1000&q=80',
    'https://images.unsplash.com/photo-1541339907198-e08756dedf3f?ixlib=rb-4.0.3&auto=format&fit=crop&w=1000&q=80',
    'https://images.unsplash.com/photo-1522202176988-66273c2fd55f?ixlib=rb-4.0.3&auto=format&fit=crop&w=1000&q=80',
    'https://github.blog/wp-content/uploads/2024/06/AI-DarkMode-4.png?resize=800%2C425',
    'https://lp.simplified.com/siteimages/ai/copywriting/ai-resume-builder-4.png',
  ];

  const features = [
    {
      icon: BookOpen,
      title: 'Notes Sharing',
      description: 'Share and discover study notes from students worldwide',
      gradient: 'bg-blue-600',
      link: '/notes',
      image: aiImages[0],
    },
    {
      icon: MessageCircle,
      title: 'Student Chat',
      description: 'Direct messaging and group chats with classmates',
      gradient: 'bg-pink-600',
      link: '/chat',
      image: aiImages[1],
    },
    {
      icon: Calendar,
      title: 'Events & Hangouts',
      description: 'Join workshops, study groups, and social events',
      gradient: 'bg-orange-600',
      link: '/events',
      image: aiImages[3],
    },
    {
      icon: FileText,
      title: 'Resume Builder',
      description: 'Create professional resumes with AI assistance',
      gradient: 'bg-green-500',
      link: '/resume-templates',
      image: aiImages[5],
    },
  ];

  return (
    <Layout>
      {/* Hero Section */}
      <section className="relative h-screen overflow-hidden">
        <div className="relative z-10 h-full flex items-center justify-center">
          <HeroSection3D />
        </div>
      </section>

      {/* Features Section */}
      <section className="py-20 px-4 sm:px-6 lg:px-8 relative">
        <div className="max-w-7xl mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-center mb-16"
          >
            <motion.div
              initial={{ scale: 0 }}
              whileInView={{ scale: 1 }}
              transition={{ delay: 0.2, type: 'spring', stiffness: 200 }}
              className="inline-block mb-4"
            >
              <div className="bg-gradient-to-r from-purple-600 to-blue-600 text-white px-6 py-2 mb-8 rounded-full text-sm font-semibold">
                ✨ AI-Powered Platform
              </div>
            </motion.div>
            <h2 className="text-4xl md:text-5xl font-bold text-gray-900 dark:text-white mb-4">
              Everything You Need,{' '}
              <span className="bg-gradient-to-r from-purple-600 to-blue-600 bg-clip-text text-transparent">
                One Place
              </span>
            </h2>
            <p className="text-xl text-gray-600 dark:text-gray-300 max-w-2xl mx-auto">
              Powerful features enhanced with AI to make your student journey smoother and more productive
            </p>
          </motion.div>

          {/* Features Grid */}
          <div className="grid grid-cols-2 lg:grid-cols-3 gap-4 md:gap-6 lg:gap-8">
            {features.map((feature, index) => (
              <motion.div
                key={feature.title}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, margin: '-50px' }}
                transition={{ delay: index * 0.1 }}
                whileHover={{
                  y: -5,
                  transition: { duration: 0.2 },
                }}
                className="col-span-2 lg:col-span-1"
              >
                <Link to={feature.link || '#'}>
                  <div className="relative group h-full">
                    <div
                      className={`absolute inset-0 bg-gradient-to-br ${feature.gradient} rounded-3xl opacity-0 group-hover:opacity-10 transition-opacity duration-300`}
                    />
                    <div className="relative bg-white/80 dark:bg-gray-800/80 backdrop-blur-sm rounded-3xl p-6 border border-gray-200/50 dark:border-gray-700/50 group-hover:border-transparent transition-all duration-300 h-full flex flex-col">
                      {feature.image && (
                        <div className="mb-4 rounded-2xl overflow-hidden">
                          <img
                            src={feature.image}
                            alt={feature.title}
                            className="w-full h-32 object-cover transform group-hover:scale-105 transition-transform duration-300"
                          />
                        </div>
                      )}

                      <div className="flex items-center justify-start gap-4">
                        <div className={`p-3 rounded-xl ${feature.gradient} mb-4`}>
                          <feature.icon className="h-6 w-6 text-white" />
                        </div>
                        <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-2 line-clamp-2">
                          {feature.title}
                        </h3>
                      </div>

                      <p className="text-gray-600 dark:text-gray-300 text-sm mb-4 flex-grow line-clamp-3">
                        {feature.description}
                      </p>

                      <div className="flex items-center text-blue-600 dark:text-blue-400 font-semibold text-sm group-hover:gap-2 transition-all">
                        Explore
                        <ArrowRight className="h-4 w-4 ml-1 group-hover:translate-x-1 transition-transform" />
                      </div>
                    </div>
                  </div>
                </Link>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 px-4 sm:px-6 lg:px-8 bg-purple-700 relative overflow-hidden">
        <div className="absolute inset-0 opacity-20">
          <div className="absolute top-1/4 left-1/4 w-64 h-64 bg-white rounded-full filter blur-3xl animate-pulse"></div>
          <div className="absolute bottom-1/3 right-1/4 w-48 h-48 bg-cyan-300 rounded-full filter blur-3xl animate-pulse delay-1000"></div>
        </div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="max-w-4xl mx-auto text-center relative z-10"
        >
          <Zap className="h-16 w-16 text-white mx-auto mb-6" />
          <h2 className="text-3xl md:text-5xl font-bold text-white mb-6">
            Ready to Transform Your Student Life?
          </h2>
          <p className="text-lg md:text-xl text-white/90 mb-8 max-w-2xl mx-auto">
            Join thousands of students already using PeerFlex to succeed in their academic journey with AI-powered tools
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link to="/signup" className="flex-1 sm:flex-none">
              <Button
                size="lg"
                className="w-full bg-white text-purple-600 hover:bg-gray-100 text-lg px-8 py-4 font-semibold"
              >
                Start Your Journey
                <Sparkles className="ml-2 h-5 w-5" />
              </Button>
            </Link>
            <Link to="/login" className="flex-1 sm:flex-none">
              <Button
                variant="outline"
                size="lg"
                className="w-full border-white text-white hover:bg-white/10 text-lg px-8 py-4 font-semibold"
              >
                Sign In
              </Button>
            </Link>
          </div>
        </motion.div>
      </section>
    </Layout>
  );
};

export default HomePage;
