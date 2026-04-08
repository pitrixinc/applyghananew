import React, { useState } from 'react';
import { FiMail, FiUpload, FiCheckCircle, FiDollarSign, FiFileText, FiUser } from 'react-icons/fi';
import { toast } from 'react-toastify';
import { LuNotebookPen } from "react-icons/lu";

const ServiceForms = ({ service }) => {
  const [formData, setFormData] = useState({});
  const [selectedPriceType, setSelectedPriceType] = useState(null);
  const [loading, setLoading] = useState(false);
  const [fileUploads, setFileUploads] = useState({});
  const [submittedForm, setSubmittedForm] = useState(null);

  const handleInputChange = (e, formType) => {
    const { name, value, type } = e.target;
    
    if (type === 'file') {
      setFileUploads(prev => ({
        ...prev,
        [formType]: {
          ...prev[formType],
          [name]: e.target.files[0]
        }
      }));
    } else {
      setFormData(prev => ({
        ...prev,
        [formType]: {
          ...prev[formType],
          [name]: value
        }
      }));
    }
  };

  const handlePriceTypeChange = (e) => {
    const selectedOption = service.applyNowForm.fields[0].options.find(
      option => option.label === e.target.value
    );
    setSelectedPriceType(selectedOption?.price || null);
  };

  const handlePayment = async (e) => {
    e.preventDefault();
    if (!selectedPriceType || selectedPriceType <= 0) {
      toast.error("Please select a valid price option!");
      return;
    }

    setLoading(true);
    try {
      const { default: PaystackPop } = await import("@paystack/inline-js");

      const paystack = new PaystackPop();
      paystack.newTransaction({
        key: process.env.NEXT_PUBLIC_PAYSTACK_PUBLIC_KEY,
        email: formData.applyNow?.email || 'customer@example.com',
        amount: selectedPriceType * 100, // Convert to kobo
        currency: "GHS",
        callback: async (response) => {
          if (response.status === "success") {
            await submitForm('applyNow', response.reference);
          } else {
            toast.error("Application was not successful. Please try again.");
          }
          setLoading(false);
        },
        onClose: () => {
          toast.error("Application was not completed.");
          setLoading(false);
        },
      });
    } catch (error) {
      console.error("Payment error:", error);
      toast.error("Payment could not be processed.");
      setLoading(false);
    }
  };

  const submitForm = async (formType, paymentReference = null) => {
    try {
      const formValues = formData[formType] || {};
      const files = fileUploads[formType] || {};

      // Prepare form data for submission
      const submissionData = {
        serviceId: service.id,
        formType,
        ...formValues,
        paymentReference,
        selectedPrice: formType === 'applyNow' ? selectedPriceType : null,
        files: Object.keys(files).map(key => ({
          fieldName: key,
          fileName: files[key].name
        })),
        submittedAt: new Date().toISOString()
      };

      // Send to appropriate API endpoint
      let endpoint = '';
      if (formType === 'contactForm') {
        endpoint = '/api/send-contact-form';
      } else {
        endpoint = '/api/send-application';
        
        // Also send confirmation to applicant if email exists
        if (formValues.email) {
          await fetch('/api/send-application-confirmation', {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json',
            },
            body: JSON.stringify({
              formData: formValues,
              service,
              paymentReference,
              selectedPrice: selectedPriceType,
              applicantEmail: formValues.email
            }),
          });
        }
      }

      const response = await fetch(endpoint, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          formData: formValues,
          service,
          paymentReference,
          selectedPrice: selectedPriceType
        }),
      });

      if (!response.ok) {
        throw new Error('Failed to submit form');
      }

      // Mark form as submitted
      setSubmittedForm(formType);

      // Reset form after submission
      setFormData(prev => ({ ...prev, [formType]: {} }));
      setFileUploads(prev => ({ ...prev, [formType]: {} }));
      if (formType === 'applyNow') setSelectedPriceType(null);

      toast.success(
        formType === 'contactForm' 
          ? 'Your message has been sent successfully!' 
          : 'Application submitted successfully!'
      );

    } catch (error) {
      console.error('Error submitting form:', error);
      toast.error('Failed to submit form. Please try again.');
    }
  };

  const renderFormField = (field, formType) => {
    switch (field.type) {
      case 'text':
        return (
          <div className="mb-6">
            <label className="block text-gray-700 text-sm font-semibold mb-2 uppercase tracking-wide">
              {field.label}
            </label>
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-gray-500">
                <LuNotebookPen className="h-5 w-5" />
              </div>
              <input
                type="text"
                name={field.value}
                onChange={(e) => handleInputChange(e, formType)}
                value={formData[formType]?.[field.value] || ''}
                className="block w-full pl-10 pr-3 py-3 border border-gray-300 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-green-500"
                placeholder={field.label}
              />
            </div>
          </div>
        );
      
      case 'textarea':
        return (
          <div className="mb-6">
            <label className="block text-gray-700 text-sm font-semibold mb-2 uppercase tracking-wide">
              {field.label}
            </label>
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-3 pt-3 flex items-start pointer-events-none text-gray-500">
                <FiFileText className="h-5 w-5" />
              </div>
              <textarea
                name={field.value}
                onChange={(e) => handleInputChange(e, formType)}
                value={formData[formType]?.[field.value] || ''}
                rows={4}
                className="block w-full pl-10 pr-3 py-3 border border-gray-300 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-green-500"
                placeholder={field.label}
              />
            </div>
          </div>
        );
      
      case 'select':
        if (field.value === 'price_type') {
          return (
            <div className="mb-6">
              <label className="block text-gray-700 text-sm font-semibold mb-2 uppercase tracking-wide">
                {field.label}
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-gray-500">
                  <FiDollarSign className="h-5 w-5" />
                </div>
                <select
                  name={field.value}
                  onChange={handlePriceTypeChange}
                  className="block w-full pl-10 pr-3 py-3 border border-gray-300 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-green-500 appearance-none bg-white"
                >
                  <option value="">Select an option</option>
                  {field.options.map((option, idx) => (
                    <option key={idx} value={option.label}>
                      {option.label} - GHS {option.price}
                    </option>
                  ))}
                </select>
              </div>
              {selectedPriceType && (
                <div className="mt-2 flex items-center text-green-600 font-medium">
                  <FiDollarSign className="mr-1" />
                  <span>Selected: GHS {selectedPriceType}</span>
                </div>
              )}
            </div>
          );
        }
        
        return (
          <div className="mb-6">
            <label className="block text-gray-700 text-sm font-semibold mb-2 uppercase tracking-wide">
              {field.label}
            </label>
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-gray-500">
                <FiFileText className="h-5 w-5" />
              </div>
              <select
                name={field.value}
                onChange={(e) => handleInputChange(e, formType)}
                value={formData[formType]?.[field.value] || ''}
                className="block w-full pl-10 pr-3 py-3 border border-gray-300 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-green-500 appearance-none bg-white"
              >
                <option value="">Select an option</option>
                {field.options.map((option, idx) => (
                  <option key={idx} value={option}>
                    {option}
                  </option>
                ))}
              </select>
            </div>
          </div>
        );
      
      case 'file':
        return (
          <div className="mb-6">
            <label className="block text-gray-700 text-sm font-semibold mb-2 uppercase tracking-wide">
              {field.label}
            </label>
            <div className="mt-1 flex justify-center px-6 pt-5 pb-6 border-2 border-gray-300 border-dashed rounded-lg">
              <div className="space-y-1 text-center">
                <div className="flex text-sm text-gray-600">
                  <label className="relative cursor-pointer bg-white rounded-md font-medium text-green-600 hover:text-green-500 focus-within:outline-none focus-within:ring-2 focus-within:ring-offset-2 focus-within:ring-green-500">
                    <span>Upload a file</span>
                    <input
                      type="file"
                      name={field.value}
                      onChange={(e) => handleInputChange(e, formType)}
                      className="sr-only"
                    />
                  </label>
                  <p className="pl-1">or drag and drop</p>
                </div>
                <p className="text-xs text-gray-500">
                  {fileUploads[formType]?.[field.value] 
                    ? `Selected: ${fileUploads[formType][field.value].name}`
                    : field.label.includes('PDF') ? 'PDF up to 10MB' : 'PNG, JPG up to 5MB'}
                </p>
              </div>
            </div>
          </div>
        );
      
      default:
        return null;
    }
  };

  const renderSuccessMessage = (formType) => {
    const isContactForm = formType === 'contactForm';
    
    return (
      <div className="bg-white rounded-xl shadow-lg overflow-hidden p-8 text-center">
        <div className="mx-auto flex items-center justify-center h-12 w-12 rounded-full bg-green-100">
          <FiCheckCircle className="h-6 w-6 text-green-600" />
        </div>
        <h3 className="mt-3 text-xl font-bold text-gray-900">
          {isContactForm ? 'Message Sent!' : 'Application Submitted!'}
        </h3>
        <div className="mt-4 text-gray-600">
          <p>
            {isContactForm
              ? 'Thank you for contacting us. We will get back to you soon.'
              : 'Thank you for your application. We will review it and contact you shortly.'}
          </p>
          {!isContactForm && selectedPriceType && (
            <p className="mt-2 font-medium">
              Payment of GHS {selectedPriceType} was received successfully.
            </p>
          )}
        </div>
        <div className="mt-6">
          <button
            type="button"
            onClick={() => setSubmittedForm(null)}
            className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-green-600 hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500"
          >
            {isContactForm ? 'Send another message' : 'Submit another application'}
          </button>
        </div>
      </div>
    );
  };

  const renderForm = (form, formType) => {
    if (!form || !form.fields) return null;
    if (submittedForm === formType) return renderSuccessMessage(formType);

    return (
      <div className={`${service[formType] && service.contactForm ? 'md:w-1/2' : 'w-full'}`}>
        <div className="bg-white rounded-xl shadow-lg overflow-hidden">
          <div className="px-6 py-5 bg-gradient-to-r from-green-400 to-green-600">
            <div className="flex items-center">
              {formType === 'contactForm' ? (
                <FiMail className="text-white text-2xl mr-3" />
              ) : (
                <FiCheckCircle className="text-white text-2xl mr-3" />
              )}
              <h3 className="text-xl font-bold text-white">
                {formType === 'contactForm' ? 'Contact Us' : 'Apply Now'}
              </h3>
            </div>
          </div>
          
          <div className="p-6">
            <form onSubmit={(e) => {
              e.preventDefault();
              formType === 'applyNow' ? handlePayment(e) : submitForm(formType);
            }}>
              {form.fields.map((field, index) => (
                <div key={index}>
                  {renderFormField(field, formType)}
                </div>
              ))}
              
              <div className="mt-8">
                <button
                  type="submit"
                  disabled={loading}
                  className="w-full flex justify-center items-center py-3 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-gradient-to-r from-green-400 to-green-600 hover:from-green-700 hover:to-green-800 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500 transition-all duration-150"
                >
                  {loading ? (
                    <>
                      <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                      </svg>
                      Processing...
                    </>
                  ) : (
                    form.submitText
                  )}
                </button>
              </div>
            </form>
          </div>
        </div>
      </div>
    );
  };

  if (!service.contactForm && !service.applyNowForm) return null;

  return (
    <section className="py-16 px-4 sm:px-6 lg:px-8 bg-gray-50">
      <div className="max-w-7xl mx-auto">
        <div className="text-center mb-12">
          <h2 className="text-3xl font-extrabold text-gray-900 sm:text-4xl">
            {service.contactForm && service.applyNowForm 
              ? 'Get Started' 
              : service.contactForm 
                ? 'Contact Us' 
                : 'Apply Now'}
          </h2>
          <p className="mt-3 max-w-2xl mx-auto text-xl text-gray-600">
            {service.contactForm && service.applyNowForm 
              ? 'Choose how you want to proceed' 
              : 'Fill out the form below to get started'}
          </p>
        </div>

        <div className={`flex flex-col ${service.contactForm && service.applyNowForm ? 'md:flex-row' : ''} gap-8`}>
          {service.contactForm && renderForm(service.contactForm, 'contactForm')}
          {service.applyNowForm && renderForm(service.applyNowForm, 'applyNowForm')}
        </div>
      </div>
    </section>
  );
};

export default ServiceForms;