// src/pages/PortfolioTemplatesPage.tsx
import React from 'react';
import { useNavigate } from 'react-router-dom';
import Header from '../components/layout/Header';

const PortfolioTemplatesPage: React.FC = () => {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
      <Header />
      <div className="pt-24 pb-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <h1 className="text-4xl font-bold text-gray-900 dark:text-white mb-8">
            Portfolio Templates
          </h1>
          {/* Add portfolio templates grid similar to resume templates */}
        </div>
      </div>
    </div>
  );
};

export default PortfolioTemplatesPage;