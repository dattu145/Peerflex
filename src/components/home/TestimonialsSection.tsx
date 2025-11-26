import React from 'react';
import { motion } from 'framer-motion';
import { Star, Quote } from 'lucide-react';
import { useAppStore } from '../../store/useAppStore';
import Card from '../ui/Card';

const TestimonialsSection: React.FC = () => {
  const { testimonials } = useAppStore();

  // Mock testimonials for demo
  const mockTestimonials = [
    {
      _id: '1',
      userId: 'user1',
      userName: 'Priya Sharma',
      userRole: 'Computer Science Student',
      rating: 5,
      comment: 'CampusPro helped me create an amazing portfolio that landed me my first internship at a top tech company! The AI assistance made everything so easy.',
      createdAt: '2024-01-15',
      featured: true
    },
    {
      _id: '2',
      userId: 'user2',
      userName: 'Rajesh Kumar',
      userRole: 'Software Developer',
      rating: 5,
      comment: 'The portfolio service was incredible. My LinkedIn profile views increased by 300% and I got multiple job offers within a month.',
      createdAt: '2024-01-10',
      featured: true
    },
    {
      _id: '3',
      userId: 'user3',
      userName: 'Ananya Patel',
      userRole: 'Marketing Professional',
      rating: 5,
      comment: 'Professional, fast, and amazing results! The complete package was worth every penny. Highly recommend to anyone serious about their career.',
      createdAt: '2024-01-05',
      featured: true
    }
  ];

  const displayTestimonials = testimonials.length > 0 ? testimonials : mockTestimonials;

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.2
      }
    }
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 30 },
    visible: { opacity: 1, y: 0 }
  };

  return (
    <section className="py-20 bg-gray-50 dark:bg-gray-800">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="text-center">
          <motion.h2
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
            className="text-3xl font-bold tracking-tight text-gray-900 dark:text-white sm:text-4xl"
          >
            What Our Clients Say
          </motion.h2>
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6, delay: 0.1 }}
            className="mx-auto mt-4 max-w-2xl text-lg text-gray-600 dark:text-gray-300"
          >
            Real success stories from students and professionals who transformed their careers
          </motion.p>
        </div>

        <motion.div
          variants={containerVariants}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true }}
          className="mt-16 grid gap-8 lg:grid-cols-3 md:grid-cols-2 grid-cols-1"
        >
          {displayTestimonials.slice(0, 3).map((testimonial, index) => (
            <motion.div key={testimonial._id} variants={itemVariants}>
              <Card hover={true} className="h-full">
                <div className="flex items-start space-x-1 mb-4">
                  {[...Array(5)].map((_, i) => (
                    <Star
                      key={i}
                      className={`w-5 h-5 ${
                        i < testimonial.rating
                          ? 'text-yellow-400 fill-current'
                          : 'text-gray-300 dark:text-gray-600'
                      }`}
                    />
                  ))}
                </div>

                <div className="relative mb-6">
                  <Quote className="absolute -top-2 -left-2 w-8 h-8 text-purple-200 dark:text-purple-800" />
                  <p className="text-gray-700 dark:text-gray-300 leading-relaxed pl-6">
                    "{testimonial.comment}"
                  </p>
                </div>

                <div className="flex items-center">
                  <div className="w-12 h-12 bg-gradient-to-br from-purple-500 to-blue-500 rounded-full flex items-center justify-center text-white font-semibold text-lg">
                    {testimonial.userName.charAt(0)}
                  </div>
                  <div className="ml-4">
                    <div className="font-semibold text-gray-900 dark:text-white">
                      {testimonial.userName}
                    </div>
                    <div className="text-sm text-gray-500 dark:text-gray-400">
                      {testimonial.userRole}
                    </div>
                  </div>
                </div>
              </Card>
            </motion.div>
          ))}
        </motion.div>

        {/* Overall Stats */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6, delay: 0.4 }}
          className="mt-16 text-center"
        >
          <div className="inline-flex items-center space-x-2 bg-white dark:bg-gray-700 rounded-full px-6 py-3 shadow-lg">
            <div className="flex items-center space-x-1">
              {[...Array(5)].map((_, i) => (
                <Star key={i} className="w-5 h-5 text-yellow-400 fill-current" />
              ))}
            </div>
            <span className="text-lg font-semibold text-gray-900 dark:text-white">4.9/5</span>
            <span className="text-gray-500 dark:text-gray-400">from 500+ reviews</span>
          </div>
        </motion.div>
      </div>
    </section>
  );
};

export default TestimonialsSection;