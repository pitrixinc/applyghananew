import React from "react";
import Link from "next/link";
import { FaArrowRight } from "react-icons/fa";

const ServicesList = ({ services }) => {
  return (
    <section className="max-w-6xl mx-auto px-6 py-12">
      <h2 className="text-3xl font-bold text-gray-800 text-center mb-8">Services</h2>
      
      {services.length === 0 ? (
        <p className="text-center text-gray-500">No services available in this category.</p>
      ) : (
        <div className="grid md:grid-cols-3 sm:grid-cols-2 grid-cols-1 gap-6">
          {services.map((service) => (
            <div key={service.id} className="bg-white shadow-lg rounded-lg overflow-hidden">
              <img src={service.imageUrl} alt={service.serviceName} className="w-full h-48 object-cover" />
              
              <div className="p-4">
                <h3 className="text-lg font-semibold text-gray-900">{service.serviceName}</h3>
                <p className="text-sm text-gray-600 mt-2">
                  {service.description.length > 100
                    ? service.description.slice(0, 100) + "..."
                    : service.description}
                </p>

                <Link
                  href={`/services/${service.id}`}
                  className="mt-4 inline-flex items-center text-green-600 font-medium hover:underline"
                >
                  View Details <FaArrowRight className="ml-2" />
                </Link>
              </div>
            </div>
          ))}
        </div>
      )}
    </section>
  );
};

export default ServicesList;
