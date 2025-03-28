import React, { useState } from "react";
import { FaSpinner, FaCheckCircle } from "react-icons/fa";

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
            We'd love to talk about how we can help you.
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
            <svg class="shrink-0 size-6 mt-1.5 text-gray-800" xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="12" r="10"/><path d="M9.09 9a3 3 0 0 1 5.83 1c0 2-3 3-3 3"/><path d="M12 17h.01"/></svg>
            <div class="grow">
                <h3 class="font-semibold text-gray-800">Knowledgebase</h3>
                <p class="mt-1 text-sm text-gray-500">We're here to help with any questions or code.</p>
                <a class="mt-2 inline-flex items-center gap-x-2 text-sm font-medium text-gray-600 hover:text-gray-800 focus:outline-hidden focus:text-gray-800:text-neutral-200:text-neutral-200" href="#">
                Contact support
                <svg class="shrink-0 size-2.5 transition ease-in-out group-hover:translate-x-1 group-focus:translate-x-1" width="16" height="16" viewBox="0 0 16 16" fill="none" xmlns="http://www.w3.org/2000/svg">
                    <path fill-rule="evenodd" clip-rule="evenodd" d="M0.975821 6.92249C0.43689 6.92249 -3.50468e-07 7.34222 -3.27835e-07 7.85999C-3.05203e-07 8.37775 0.43689 8.79749 0.975821 8.79749L12.7694 8.79748L7.60447 13.7596C7.22339 14.1257 7.22339 14.7193 7.60447 15.0854C7.98555 15.4515 8.60341 15.4515 8.98449 15.0854L15.6427 8.68862C16.1191 8.23098 16.1191 7.48899 15.6427 7.03134L8.98449 0.634573C8.60341 0.268455 7.98555 0.268456 7.60447 0.634573C7.22339 1.00069 7.22339 1.59428 7.60447 1.9604L12.7694 6.92248L0.975821 6.92249Z" fill="currentColor"/>
                </svg>
                </a>
            </div>
            </div>
            

            
            <div class="flex gap-x-7 py-6">
            <svg class="shrink-0 size-6 mt-1.5 text-gray-800" xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M14 9a2 2 0 0 1-2 2H6l-4 4V4c0-1.1.9-2 2-2h8a2 2 0 0 1 2 2v5Z"/><path d="M18 9h2a2 2 0 0 1 2 2v11l-4-4h-6a2 2 0 0 1-2-2v-1"/></svg>
            <div class="grow">
                <h3 class="font-semibold text-gray-800">FAQ</h3>
                <p class="mt-1 text-sm text-gray-500">Search our FAQ for answers to anything you might ask.</p>
                <a class="mt-2 inline-flex items-center gap-x-2 text-sm font-medium text-gray-600 hover:text-gray-800 focus:outline-hidden focus:text-gray-800:text-neutral-200:text-neutral-200" href="#">
                Visit FAQ
                <svg class="shrink-0 size-2.5 transition ease-in-out group-hover:translate-x-1 group-focus:translate-x-1" width="16" height="16" viewBox="0 0 16 16" fill="none" xmlns="http://www.w3.org/2000/svg">
                    <path fill-rule="evenodd" clip-rule="evenodd" d="M0.975821 6.92249C0.43689 6.92249 -3.50468e-07 7.34222 -3.27835e-07 7.85999C-3.05203e-07 8.37775 0.43689 8.79749 0.975821 8.79749L12.7694 8.79748L7.60447 13.7596C7.22339 14.1257 7.22339 14.7193 7.60447 15.0854C7.98555 15.4515 8.60341 15.4515 8.98449 15.0854L15.6427 8.68862C16.1191 8.23098 16.1191 7.48899 15.6427 7.03134L8.98449 0.634573C8.60341 0.268455 7.98555 0.268456 7.60447 0.634573C7.22339 1.00069 7.22339 1.59428 7.60447 1.9604L12.7694 6.92248L0.975821 6.92249Z" fill="currentColor"/>
                </svg>
                </a>
            </div>
            </div>
            

            
            <div class=" flex gap-x-7 py-6">
            <svg class="shrink-0 size-6 mt-1.5 text-gray-800" xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="m7 11 2-2-2-2"/><path d="M11 13h4"/><rect width="18" height="18" x="3" y="3" rx="2" ry="2"/></svg>
            <div class="grow">
                <h3 class="font-semibold text-gray-800">Developer APIs</h3>
                <p class="mt-1 text-sm text-gray-500">Check out our development quickstart guide.</p>
                <a class="mt-2 inline-flex items-center gap-x-2 text-sm font-medium text-gray-600 hover:text-gray-800 focus:outline-hidden focus:text-gray-800:text-neutral-200:text-neutral-200" href="#">
                Contact sales
                <svg class="shrink-0 size-2.5 transition ease-in-out group-hover:translate-x-1 group-focus:translate-x-1" width="16" height="16" viewBox="0 0 16 16" fill="none" xmlns="http://www.w3.org/2000/svg">
                    <path fill-rule="evenodd" clip-rule="evenodd" d="M0.975821 6.92249C0.43689 6.92249 -3.50468e-07 7.34222 -3.27835e-07 7.85999C-3.05203e-07 8.37775 0.43689 8.79749 0.975821 8.79749L12.7694 8.79748L7.60447 13.7596C7.22339 14.1257 7.22339 14.7193 7.60447 15.0854C7.98555 15.4515 8.60341 15.4515 8.98449 15.0854L15.6427 8.68862C16.1191 8.23098 16.1191 7.48899 15.6427 7.03134L8.98449 0.634573C8.60341 0.268455 7.98555 0.268456 7.60447 0.634573C7.22339 1.00069 7.22339 1.59428 7.60447 1.9604L12.7694 6.92248L0.975821 6.92249Z" fill="currentColor"/>
                </svg>
                </a>
            </div>
            </div>
            

            
            <div class=" flex gap-x-7 py-6">
            <svg class="shrink-0 size-6 mt-1.5 text-gray-800" xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M21.2 8.4c.5.38.8.97.8 1.6v10a2 2 0 0 1-2 2H4a2 2 0 0 1-2-2V10a2 2 0 0 1 .8-1.6l8-6a2 2 0 0 1 2.4 0l8 6Z"/><path d="m22 10-8.97 5.7a1.94 1.94 0 0 1-2.06 0L2 10"/></svg>
            <div class="grow">
                <h3 class="font-semibold text-gray-800">Contact us by email</h3>
                <p class="mt-1 text-sm text-gray-500">If you wish to write us an email instead please use</p>
                <a class="mt-2 inline-flex items-center gap-x-2 text-sm font-medium text-gray-600 hover:text-gray-800 focus:outline-hidden focus:text-gray-800:text-neutral-200:text-neutral-200" href="#">
                example@site.com
                </a>
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