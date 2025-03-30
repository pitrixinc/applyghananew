import { useEffect, useState } from "react";
import { db } from "../../../firebase.config"; // Ensure correct Firebase config path
import {
  collection,
  getDocs,
  doc,
  updateDoc,
  deleteDoc,
} from "firebase/firestore";
import { FaTrash, FaEdit, FaPlus, FaMinus, FaSave } from "react-icons/fa";

const ServicesListing = () => {
  const [services, setServices] = useState({});
  const [loading, setLoading] = useState(true);
  const [expandedCategories, setExpandedCategories] = useState({});
  const [expandedServices, setExpandedServices] = useState({});
  const [editingService, setEditingService] = useState(null);

  useEffect(() => {
    fetchServices();
  }, []);

  const fetchServices = async () => {
    setLoading(true);
    try {
      const querySnapshot = await getDocs(collection(db, "services"));
      const categorizedServices = {};

      querySnapshot.forEach((doc) => {
        const service = { id: doc.id, ...doc.data() };
        if (!service.keyFeatures) service.keyFeatures = [];
        if (!service.processSteps) service.processSteps = [];
        if (!service.faqs) service.faqs = [];
        
        if (!categorizedServices[service.category]) {
          categorizedServices[service.category] = [];
        }
        categorizedServices[service.category].push(service);
      });

      setServices(categorizedServices);
      setLoading(false);
    } catch (error) {
      console.error("Error fetching services:", error);
      setLoading(false);
    }
  };

  const toggleCategory = (category) => {
    setExpandedCategories((prev) => ({
      ...prev,
      [category]: !prev[category],
    }));
  };

  const toggleService = (serviceId) => {
    setExpandedServices((prev) => ({
      ...prev,
      [serviceId]: !prev[serviceId],
    }));
  };

  const startEditing = (service) => {
    setEditingService({
      ...service,
      keyFeatures: [...service.keyFeatures],
      processSteps: [...service.processSteps],
      faqs: [...service.faqs]
    });
  };

  const handleUpdate = async (id) => {
    if (!editingService) return;
    setLoading(true);

    try {
      const serviceRef = doc(db, "services", id);
      await updateDoc(serviceRef, editingService);
      alert("Service updated successfully!");
      fetchServices();
      setEditingService(null);
    } catch (error) {
      console.error("Error updating service:", error);
    }

    setLoading(false);
  };

  const handleDelete = async (id) => {
    if (window.confirm("Are you sure you want to delete this service?")) {
      try {
        await deleteDoc(doc(db, "services", id));
        alert("Service deleted successfully!");
        fetchServices();
      } catch (error) {
        console.error("Error deleting service:", error);
      }
    }
  };

  const handleChange = (field, value) => {
    setEditingService((prev) => ({
      ...prev,
      [field]: value,
    }));
  };

  const handleArrayChange = (field, index, subField, value) => {
    if (field === 'faqs') {
      setEditingService((prev) => ({
        ...prev,
        [field]: prev[field].map((item, i) => 
          i === index ? { ...item, [subField]: value } : item
        ),
      }));
    } else {
      setEditingService((prev) => ({
        ...prev,
        [field]: prev[field].map((item, i) => (i === index ? value : item)),
      }));
    }
  };

  const handleAddArrayItem = (field) => {
    setEditingService((prev) => {
      const newItem = field === 'faqs' ? { question: '', answer: '' } : '';
      return {
        ...prev,
        [field]: [...prev[field], newItem],
      };
    });
  };

  const handleRemoveArrayItem = (field, index) => {
    setEditingService((prev) => ({
      ...prev,
      [field]: prev[field].filter((_, i) => i !== index),
    }));
  };

  return (
    <div className="p-6 max-w-5xl mx-auto">
      <h1 className="text-3xl font-bold mb-6 text-center">Admin Services</h1>

      {loading ? (
        <p className="text-center text-gray-600">Loading services...</p>
      ) : (
        Object.keys(services).map((category) => (
          <div key={category} className="mb-6 border border-gray-200 rounded-lg">
            <div
              className="flex justify-between items-center bg-gradient-to-r from-green-400 to-green-600 text-white px-4 py-3 cursor-pointer rounded-t-lg"
              onClick={() => toggleCategory(category)}
            >
              <h2 className="text-lg font-semibold">{category}</h2>
              {expandedCategories[category] ? <FaMinus /> : <FaPlus />}
            </div>

            {expandedCategories[category] &&
              services[category].map((service) => (
                <div key={service.id} className="border-t border-gray-200">
                  <div
                    className="flex justify-between items-center px-4 py-3 bg-gray-100 cursor-pointer"
                    onClick={() => toggleService(service.id)}
                  >
                    <span className="font-medium">{service.serviceName}</span>
                    {expandedServices[service.id] ? <FaMinus /> : <FaPlus />}
                  </div>

                  {expandedServices[service.id] && (
                    <div className="p-4 space-y-4 bg-white border-t border-gray-200">
                      {editingService?.id === service.id ? (
                        <>
                          <input
                            type="text"
                            className="w-full p-2 border rounded-lg"
                            value={editingService.serviceName}
                            onChange={(e) => handleChange("serviceName", e.target.value)}
                            placeholder="Service Name"
                          />

                          <div>
                            <label className="block font-medium">Slug / ID</label>
                            <input 
                              type="text" 
                              value={editingService.slug} 
                              onChange={(e) => handleChange("slug", e.target.value)}
                              className="w-full p-2 border rounded-lg" 
                            />
                          </div>

                          <textarea
                            className="w-full p-2 border rounded-lg"
                            value={editingService.description}
                            onChange={(e) => handleChange("description", e.target.value)}
                            placeholder="Description"
                          ></textarea>

                          <div>
                            <h3 className="font-medium">Key Features</h3>
                            {editingService.keyFeatures.map((feature, index) => (
                              <div key={index} className="flex items-center space-x-2 mt-1">
                                <input
                                  type="text"
                                  className="w-full p-2 border rounded-lg"
                                  value={feature}
                                  onChange={(e) => handleArrayChange("keyFeatures", index, null, e.target.value)}
                                />
                                <button onClick={() => handleRemoveArrayItem("keyFeatures", index)}>
                                  <FaTrash className="text-red-500" />
                                </button>
                              </div>
                            ))}
                            <button
                              onClick={() => handleAddArrayItem("keyFeatures")}
                              className="bg-green-500 text-white px-3 py-1 rounded-lg mt-2"
                            >
                              Add Feature
                            </button>
                          </div>

                          <div>
                            <h3 className="font-medium">Process Steps</h3>
                            {editingService.processSteps.map((step, index) => (
                              <div key={index} className="flex items-center space-x-2 mt-1">
                                <input
                                  type="text"
                                  className="w-full p-2 border rounded-lg"
                                  value={step}
                                  onChange={(e) => handleArrayChange("processSteps", index, null, e.target.value)}
                                />
                                <button onClick={() => handleRemoveArrayItem("processSteps", index)}>
                                  <FaTrash className="text-red-500" />
                                </button>
                              </div>
                            ))}
                            <button
                              onClick={() => handleAddArrayItem("processSteps")}
                              className="bg-green-500 text-white px-3 py-1 rounded-lg mt-2"
                            >
                              Add Step
                            </button>
                          </div>

                          <div>
                            <h3 className="font-medium">FAQs</h3>
                            {editingService.faqs.map((faq, index) => (
                              <div key={index} className="mt-2">
                                <textarea
                                  className="w-full p-2 border rounded-lg"
                                  value={faq.question}
                                  onChange={(e) => handleArrayChange("faqs", index, "question", e.target.value)}
                                  placeholder="FAQ Question"
                                />
                                <textarea
                                  className="w-full p-2 border rounded-lg mt-1"
                                  value={faq.answer}
                                  onChange={(e) => handleArrayChange("faqs", index, "answer", e.target.value)}
                                  placeholder="FAQ Answer"
                                />
                                <button
                                  onClick={() => handleRemoveArrayItem("faqs", index)}
                                  className="text-red-500 mt-2 flex items-center"
                                >
                                  <FaTrash className="mr-1" /> Remove FAQ
                                </button>
                              </div>
                            ))}
                            <button
                              onClick={() => handleAddArrayItem("faqs")}
                              className="bg-green-500 text-white px-3 py-1 rounded-lg mt-2 flex items-center"
                            >
                              <FaPlus className="mr-1" /> Add FAQ
                            </button>
                          </div>

                          <div className="flex justify-between">
                            <button
                              onClick={() => handleUpdate(service.id)}
                              className="bg-gradient-to-r from-green-400 to-green-600 text-white px-4 py-2 rounded-lg flex items-center"
                            >
                              <FaSave className="mr-2" />
                              Update
                            </button>
                            <button
                              onClick={() => setEditingService(null)}
                              className="bg-gray-500 text-white px-4 py-2 rounded-lg flex items-center"
                            >
                              Cancel
                            </button>
                          </div>
                        </>
                      ) : (
                        <>
                          <div>
                            <h2 className="text-xl font-bold">{service.serviceName}</h2>
                            <p className="text-gray-600">Slug: {service.slug}</p>
                          </div>

                          <div>
                            <h3 className="font-medium">Description</h3>
                            <p className="text-gray-700">{service.description}</p>
                          </div>

                          <div>
                            <h3 className="font-medium">Key Features</h3>
                            <ul className="list-disc pl-5">
                              {service.keyFeatures.map((feature, index) => (
                                <li key={index}>{feature}</li>
                              ))}
                            </ul>
                          </div>

                          <div>
                            <h3 className="font-medium">Process Steps</h3>
                            <ol className="list-decimal pl-5">
                              {service.processSteps.map((step, index) => (
                                <li key={index}>{step}</li>
                              ))}
                            </ol>
                          </div>

                          <div>
                            <h3 className="font-medium">FAQs</h3>
                            {service.faqs.map((faq, index) => (
                              <div key={index} className="mb-3">
                                <h4 className="font-semibold">Q: {faq.question}</h4>
                                <p className="text-gray-700">A: {faq.answer}</p>
                              </div>
                            ))}
                          </div>

                          <div className="flex justify-between">
                            <button
                              onClick={() => startEditing(service)}
                              className="bg-gradient-to-r from-green-400 to-green-600 text-white px-4 py-2 rounded-lg flex items-center"
                            >
                              <FaEdit className="mr-2" />
                              Edit
                            </button>
                            <button
                              onClick={() => handleDelete(service.id)}
                              className="bg-red-500 text-white px-4 py-2 rounded-lg flex items-center"
                            >
                              <FaTrash className="mr-2" />
                              Delete
                            </button>
                          </div>
                        </>
                      )}
                    </div>
                  )}
                </div>
              ))}
          </div>
        ))
      )}
    </div>
  );
};

export default ServicesListing;