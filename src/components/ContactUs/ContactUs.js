import React, { useState } from "react";
import { FaSpinner, FaCheckCircle, FaEnvelope, FaPhoneAlt, FaComments, FaHeadset } from "react-icons/fa";

const ContactUs = () => {
    const [formData, setFormData] = useState({
        firstName: "",
        lastName: "",
        email: "",
        phone: "",
        service: "",
        message: "",
      });
    
      const [loading, setLoading] = useState(false);
      const [submitted, setSubmitted] = useState(false);
      const [error, setError] = useState("");
    
      const handleChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
      };
    
      const handleSubmit = async (e) => {
        e.preventDefault();
        setError("");
        
        // Validate Form
        if (
          !formData.firstName ||
          !formData.lastName ||
          !formData.email ||
          !formData.phone ||
          !formData.service ||
          !formData.message
        ) {
          setError("Please fill in all fields.");
          return;
        }
    
        setLoading(true);
    
        try {
          const response = await fetch("/api/contact", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify(formData),
          });
    
          if (response.ok) {
            setSubmitted(true);
          } else {
            setError("Something went wrong. Please try again.");
          }
        } catch (err) {
          setError("Failed to send message. Please try again.");
        }
    
        setLoading(false);
      };
    
      if (submitted) {
        return (
          <div className="text-center p-8 bg-white shadow-lg rounded-lg">
            <FaCheckCircle className="text-green-500 text-4xl mx-auto" />
            <h2 className="text-2xl font-semibold text-gray-800 mt-4">Thank You!</h2>
            <p className="text-gray-600 mt-2">
              Your inquiry has been received. We will get back to you shortly.
            </p>
          </div>
        );
      }

  return (
    <div id="contact-form">
    <div class="max-w-[85rem] px-4 py-10 sm:px-6 lg:px-8 lg:py-14 mx-auto">
    <div class="max-w-2xl lg:max-w-5xl mx-auto">
        <div class="text-center">
        <h1 class="text-3xl font-bold text-gray-800 sm:text-4xl">
            Contact us
        </h1>
        <p class="mt-1 text-gray-600">
            We&apos;d love to talk about how we can help you.
        </p>
        </div>

        <div class="mt-12 grid items-center lg:grid-cols-2 gap-6 lg:gap-16">
        
        <div className="flex flex-col border border-gray-200 rounded-xl p-6 bg-white shadow-lg">
      <h2 className="text-xl font-semibold text-gray-800">Fill in the form</h2>

      {error && <p className="text-red-500 mt-2">{error}</p>}

      <form onSubmit={handleSubmit} className="mt-4 space-y-4">
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <input
            type="text"
            name="firstName"
            placeholder="First Name"
            className="p-3 border border-gray-300 rounded-lg w-full"
            onChange={handleChange}
            value={formData.firstName}
          />
          <input
            type="text"
            name="lastName"
            placeholder="Last Name"
            className="p-3 border border-gray-300 rounded-lg w-full"
            onChange={handleChange}
            value={formData.lastName}
          />
        </div>

        <input
          type="email"
          name="email"
          placeholder="Email"
          className="p-3 border border-gray-300 rounded-lg w-full"
          onChange={handleChange}
          value={formData.email}
        />

        <input
          type="text"
          name="phone"
          placeholder="Phone Number"
          className="p-3 border border-gray-300 rounded-lg w-full"
          onChange={handleChange}
          value={formData.phone}
        />

        <select
          name="service"
          className="p-3 border border-gray-300 rounded-lg w-full"
          onChange={handleChange}
          value={formData.service}
        >
            <option value="">Select Service</option>
            <option value="University Admissions Guidance">University Admissions Guidance</option>
  <option value="Course Selection and Career Pathway">Course Selection and Career Pathway</option>
  <option value="Scholarship Application Support">Scholarship Application Support</option>
  <option value="Education and Career Counseling">Education and Career Counseling</option>
  <option value="University Admission Forms">University Admission Forms</option>
  <option value="Service Recruitment Forms">Service Recruitment Forms</option>
  <option value="Passport Application">Passport Application</option>
  <option value="Biometric Birth Certificate">Biometric Birth Certificate</option>
  <option value="Commissioning of Oaths">Commissioning of Oaths</option>
  <option value="Document Tracking and Management">Document Tracking and Management</option>
  <option value="Digital Submission Options">Digital Submission Options</option>
  <option value="Community Outreach and Engagement">Community Outreach and Engagement</option>
  <option value="Online Consultations and Webinars">Online Consultations and Webinars</option>
  <option value="Personalized Application Support">Personalized Application Support</option>
  <option value="Priority Document Processing">Priority Document Processing</option>
  <option value="Customized Education and Career Planning">Customized Education and Career Planning</option>
        </select>

        <textarea
          name="message"
          rows="4"
          placeholder="Details"
          className="p-3 border border-gray-300 rounded-lg w-full"
          onChange={handleChange}
          value={formData.message}
        ></textarea>

        <button
          type="submit"
          className=" cursor-pointer w-full py-3 bg-green-500 text-white font-semibold rounded-lg flex justify-center items-center gap-2"
          disabled={loading}
        >
          {loading ? <FaSpinner className="animate-spin" /> : "Send Inquiry"}
        </button>

        <p className="text-center text-sm text-gray-500">
          We&apos;ll get back to you in 1-2 business days.
        </p>
      </form>
    </div>
        

        <div class="divide-y divide-gray-200">
            
            <div class="flex gap-x-7 py-6">
            <FaEnvelope class="shrink-0 size-6 mt-1.5 text-gray-800" />
            <div class="grow">
                <h3 class="font-semibold text-gray-800">Get in Touch</h3>
                <p class="mt-1 text-sm text-gray-500">We welcome your inquiries and would love to hear from you. Whether you have questions or need support, feel free to reach out. Our team is always ready to assist you.</p>
                
            </div>
            </div>
            

            
            <div class="flex gap-x-7 py-6">
            <FaPhoneAlt class="shrink-0 size-6 mt-1.5 text-gray-800" />
            <div class="grow">
                <h3 class="font-semibold text-gray-800">We&apos;re here!</h3>
                <p class="mt-1 text-sm text-gray-500">Our team is dedicated to providing support and guidance whenever you need it. Reach out to us with any questions, concerns, or feedback, and we will respond promptly and effectively.</p>
                
            </div>
            </div>
            

            
            <div class=" flex gap-x-7 py-6">
            <FaComments class="shrink-0 size-6 mt-1.5 text-gray-800" />
            <div class="grow">
                <h3 class="font-semibold text-gray-800">Talk to Us</h3>
                <p class="mt-1 text-sm text-gray-500">Do you have concerns or need assistance? Our experts are here to help. Send us a message and we will ensure that your queries are addressed as quickly and efficiently as possible.</p>
                
            </div>
            </div>
            

            
            <div class=" flex gap-x-7 py-6">
            <FaHeadset class="shrink-0 size-6 mt-1.5 text-gray-800" />
            <div class="grow">
                <h3 class="font-semibold text-gray-800">Get Support</h3>
                <p class="mt-1 text-sm text-gray-500">Need help with any process or information? Our support team is available to provide expert advice and solutions. Contact us for professional assistance and we will guide you through every step.</p>
                
            </div>
            </div>
            
        </div>
        </div>
    </div>
    </div>

    </div>
  )
}

export default ContactUs