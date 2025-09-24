import React from 'react';
import Layout from '../components/layout/Layout';
import HeroSection from '../components/home/HeroSection';
import ServicesSection from '../components/home/ServicesSection';
import TestimonialsSection from '../components/home/TestimonialsSection';

const HomePage: React.FC = () => {
  return (
    <Layout>
      <HeroSection />
      <ServicesSection />
      <TestimonialsSection />
    </Layout>
  );
};

export default HomePage;