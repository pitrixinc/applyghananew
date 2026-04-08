import React, { useState, useEffect } from "react";
import { collection, getDocs } from 'firebase/firestore';
import { db } from '@/firebase.config';
import Link from 'next/link';
import { FiArrowRight, FiChevronRight } from 'react-icons/fi';

const Services = () => {
  const [services, setServices] = useState([]);
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchServices = async () => {
      try {
        setLoading(true);
        const servicesCollection = collection(db, 'services');
        const snapshot = await getDocs(servicesCollection);
        
        const servicesData = [];
        const categoriesSet = new Set();
        
        snapshot.forEach(doc => {
          const service = { id: doc.id, ...doc.data() };
          servicesData.push(service);
          categoriesSet.add(service.category);
        });

        setServices(servicesData);
        setCategories(Array.from(categoriesSet));
        setLoading(false);
      } catch (error) {
        console.error('Error fetching services:', error);
        setLoading(false);
      }
    };

    fetchServices();
  }, []);

  // Group services by category
  const servicesByCategory = {};
  categories.forEach(category => {
    servicesByCategory[category] = services.filter(service => service.category === category);
  });

  return (
    <div className="min-h-screen bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto">
        {/* Page Header */}
        <div className="text-center mb-12">
          <h1 className="text-3xl font-extrabold text-gray-900 sm:text-4xl">
            Our Services
          </h1>
          <p className="mt-3 max-w-2xl mx-auto text-xl text-gray-500 sm:mt-4">
            Comprehensive solutions tailored to your needs
          </p>
        </div>

        {loading ? (
          <div className="flex justify-center items-center h-64">
            <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-indigo-500"></div>
          </div>
        ) : (
          <div className="space-y-12">
            {categories.map(category => (
              <div key={category} className="bg-white shadow rounded-lg overflow-hidden">
                {/* Category Header */}
                <div className="px-6 py-5 border-b border-gray-200 flex items-center justify-between">
                  <h2 className="text-xl font-bold text-gray-900">{category}</h2>
                  <Link 
                    href={`/services/category/${category.toLowerCase().replace(/\s+/g, '-')}`}
                    className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-green-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
                  >
                    View All <FiChevronRight className="ml-1" />
                  </Link>
                </div>

                {/* Services Grid */}
                <div className="px-6 py-5">
                  <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
                    {servicesByCategory[category].map(service => (
                      <div key={service.id} className="group relative bg-white border border-gray-200 rounded-lg shadow-sm hover:shadow-md transition-shadow duration-300">
                        <div className="aspect-w-3 aspect-h-2 bg-gray-200 rounded-t-lg overflow-hidden">
                          {service.imageUrl && (
                            <img
                              src={service.imageUrl}
                              alt={service.serviceName}
                              className="w-full h-30 object-cover group-hover:opacity-75"
                            />
                          )}
                        </div>
                        <div className="p-4">
                          <h3 className="text-lg font-medium text-gray-900">
                            <Link href={`/services/${service.id}`}>
                              <p className="focus:outline-none">
                                <span className="absolute inset-0" aria-hidden="true" />
                                {service.serviceName}
                              </p>
                            </Link>
                          </h3>
                          <p className="mt-2 text-sm text-gray-500 line-clamp-2">
                            {service.description}
                          </p>
                          <div className="mt-4 flex justify-between items-center">
                            <span className="text-sm font-medium text-green-600">
                              {service.price || 'Contact for pricing'}
                            </span>
                            <Link 
                              href={`/services/${service.id}`}
                              className="text-sm font-medium text-green-600 hover:text-indigo-500 flex items-center"
                            >
                              Details <FiArrowRight className="ml-1" />
                            </Link>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default Services;