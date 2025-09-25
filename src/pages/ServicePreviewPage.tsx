// src/pages/ServicePreviewPage.tsx
import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import Header from '../components/layout/Header';
import { SERVICES } from '../config/services';
import { X } from 'lucide-react';

const ServicePreviewPage: React.FC = () => {
  const { serviceId } = useParams();
  const navigate = useNavigate();
  const [service, setService] = useState<any>(null);

  useEffect(() => {
    if (serviceId) {
      const foundService = SERVICES.find(s => s.id === serviceId);
      setService(foundService);
    }
  }, [serviceId]);

  if (!service) {
    return (
      <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
        <Header />
        <div className="pt-24 pb-16">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
            <h1 className="text-2xl font-bold text-gray-900 dark:text-white">
              Service not found
            </h1>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
      <Header />
      <div className="pt-24 pb-16">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="bg-white dark:bg-gray-800 rounded-lg shadow-lg overflow-hidden">
            <div className="p-6">
              <div className="flex justify-between items-start mb-4">
                <h1 className="text-3xl font-bold text-gray-900 dark:text-white">
                  {service.name}
                </h1>
                <button
                  onClick={() => navigate(-1)}
                  className="text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200"
                >
                  <X className="h-6 w-6" />
                </button>
              </div>
              
              <p className="text-gray-600 dark:text-gray-300 mb-6">
                {service.description}
              </p>

              {/* Service preview content would go here */}
              <div className="bg-gray-100 dark:bg-gray-700 rounded-lg p-8 text-center">
                <p className="text-gray-600 dark:text-gray-300">
                  Service preview content for {service.name}
                </p>
                {/* You can add service-specific preview content here */}
              </div>

              <div className="mt-6 flex gap-3">
                <button
                  onClick={() => navigate(`/order/${service.id}`)}
                  className="bg-purple-600 text-white px-6 py-2 rounded-lg hover:bg-purple-700 transition-colors"
                >
                  Order Now
                </button>
                <button
                  onClick={() => navigate(-1)}
                  className="bg-gray-300 dark:bg-gray-600 text-gray-700 dark:text-gray-300 px-6 py-2 rounded-lg hover:bg-gray-400 dark:hover:bg-gray-500 transition-colors"
                >
                  Back to Services
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ServicePreviewPage;