import { useEffect, useState } from "react";
import { db } from "../../../firebase.config";
import { collection, getDocs, doc, updateDoc, deleteDoc } from "firebase/firestore";
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
        const service = { 
          id: doc.id, 
          ...doc.data(),
          keyFeatures: doc.data().keyFeatures || [],
          processSteps: doc.data().processSteps || [],
          faqs: doc.data().faqs || [],
          contactForm: doc.data().contactForm || { fields: [], submitText: "Submit" },
          applyNowForm: doc.data().applyNowForm || { fields: [], submitText: "Apply Now" }
        };
        
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
      faqs: [...service.faqs],
      contactForm: {
        ...service.contactForm,
        fields: [...service.contactForm.fields]
      },
      applyNowForm: {
        ...service.applyNowForm,
        fields: [...service.applyNowForm.fields]
      }
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

  const handleNestedChange = (parentField, field, value) => {
    setEditingService((prev) => ({
      ...prev,
      [parentField]: {
        ...prev[parentField],
        [field]: value
      }
    }));
  };

  const handleArrayChange = (field, index, subField, value) => {
    if (field.includes('.')) {
      // Handle nested arrays like contactForm.fields
      const [parentField, childField] = field.split('.');
      setEditingService((prev) => {
        const newArray = [...prev[parentField][childField]];
        if (subField) {
          newArray[index] = { ...newArray[index], [subField]: value };
        } else {
          newArray[index] = value;
        }
        return {
          ...prev,
          [parentField]: {
            ...prev[parentField],
            [childField]: newArray
          }
        };
      });
    } else {
      // Handle regular arrays
      setEditingService((prev) => ({
        ...prev,
        [field]: prev[field].map((item, i) => 
          i === index ? (subField ? { ...item, [subField]: value } : value) : item
        ),
      }));
    }
  };

  const handleAddArrayItem = (field, defaultValue = '') => {
    if (field.includes('.')) {
      const [parentField, childField] = field.split('.');
      setEditingService((prev) => ({
        ...prev,
        [parentField]: {
          ...prev[parentField],
          [childField]: [...prev[parentField][childField], defaultValue]
        }
      }));
    } else {
      setEditingService((prev) => ({
        ...prev,
        [field]: [...prev[field], defaultValue]
      }));
    }
  };

  const handleRemoveArrayItem = (field, index) => {
    if (field.includes('.')) {
      const [parentField, childField] = field.split('.');
      setEditingService((prev) => ({
        ...prev,
        [parentField]: {
          ...prev[parentField],
          [childField]: prev[parentField][childField].filter((_, i) => i !== index)
        }
      }));
    } else {
      setEditingService((prev) => ({
        ...prev,
        [field]: prev[field].filter((_, i) => i !== index)
      }));
    }
  };

  const renderFormFields = (formName) => {
    const form = editingService[formName];
    if (!form || !form.fields) return null;

    return (
      <div className="mt-4 p-4 border rounded-lg bg-gray-50">
        <h3 className="font-semibold text-lg mb-3">
          {formName === 'contactForm' ? 'Contact Form' : 'Apply Now Form'} Fields
        </h3>

        {form.fields.map((field, index) => (
          <div key={index} className="mb-4 p-3 border rounded-lg bg-white">
            <input
              type="text"
              className="w-full p-2 border rounded-lg mb-2"
              value={field.label || ''}
              onChange={(e) => handleArrayChange(`${formName}.fields`, index, 'label', e.target.value)}
              placeholder="Field Label"
            />

            <select
              className="w-full p-2 border rounded-lg"
              value={field.type || 'text'}
              onChange={(e) => handleArrayChange(`${formName}.fields`, index, 'type', e.target.value)}
            >
              <option value="text">Text</option>
              <option value="textarea">Textarea</option>
              <option value="select">Select</option>
              <option value="file">File Upload</option>
            </select>

            {['text', 'file'].includes(field.type) && (
              <input
                type="text"
                className="w-full p-2 border rounded-lg mt-2"
                value={field.value || ''}
                onChange={(e) => handleArrayChange(`${formName}.fields`, index, 'value', e.target.value)}
                placeholder={field.type === 'file' ? 'File Upload Field Value' : 'Default Value'}
              />
            )}

            {field.type === 'textarea' && (
              <textarea
                className="w-full p-2 border rounded-lg mt-2"
                value={field.value || ''}
                onChange={(e) => handleArrayChange(`${formName}.fields`, index, 'value', e.target.value)}
                placeholder="Default Value"
              />
            )}

            {field.type === 'select' && (
              <div className="mt-3">
                <h4 className="text-sm font-medium">Select Options</h4>
                {(field.options || []).map((option, optIndex) => (
                  <div key={optIndex} className="flex items-center space-x-2 mt-1">
                    <input
                      type="text"
                      className="w-full p-2 border rounded-lg"
                      value={option.label || option}
                      onChange={(e) => {
                        if (typeof option === 'object') {
                          const updatedOptions = [...field.options];
                          updatedOptions[optIndex] = { ...option, label: e.target.value };
                          handleArrayChange(`${formName}.fields`, index, 'options', updatedOptions);
                        } else {
                          const updatedOptions = [...field.options];
                          updatedOptions[optIndex] = e.target.value;
                          handleArrayChange(`${formName}.fields`, index, 'options', updatedOptions);
                        }
                      }}
                      placeholder="Option Value"
                    />
                    {typeof option === 'object' && option.price !== undefined && (
                      <input
                        type="number"
                        className="w-24 p-2 border rounded-lg"
                        value={option.price}
                        onChange={(e) => {
                          const updatedOptions = [...field.options];
                          updatedOptions[optIndex] = { ...option, price: Number(e.target.value) };
                          handleArrayChange(`${formName}.fields`, index, 'options', updatedOptions);
                        }}
                        placeholder="Price"
                      />
                    )}
                    <button
                      onClick={() => {
                        const updatedOptions = field.options.filter((_, i) => i !== optIndex);
                        handleArrayChange(`${formName}.fields`, index, 'options', updatedOptions);
                      }}
                      className="text-red-500"
                    >
                      <FaTrash />
                    </button>
                  </div>
                ))}
                <button
                  onClick={() => {
                    const newOption = formName === 'applyNowForm' ? { label: '', price: 0 } : '';
                    handleArrayChange(
                      `${formName}.fields`, 
                      index, 
                      'options', 
                      [...(field.options || []), newOption]
                    );
                  }}
                  className="bg-green-500 text-white px-3 py-1 rounded-lg mt-2"
                >
                  Add Option
                </button>
              </div>
            )}

            <button
              onClick={() => handleRemoveArrayItem(`${formName}.fields`, index)}
              className="text-red-500 mt-2 flex items-center"
            >
              <FaTrash className="mr-1" /> Remove Field
            </button>
          </div>
        ))}

        <button
          onClick={() => handleAddArrayItem(
            `${formName}.fields`, 
            { label: '', type: 'text', value: '' }
          )}
          className="bg-green-500 text-white px-3 py-1 rounded-lg mt-2 flex items-center"
        >
          <FaPlus className="mr-1" /> Add Field
        </button>

        <div className="mt-4">
          <h4 className="text-sm font-medium">Submit Button Text</h4>
          <input
            type="text"
            className="w-full p-2 border rounded-lg"
            value={form.submitText || (formName === 'contactForm' ? 'Submit' : 'Apply Now')}
            onChange={(e) => handleNestedChange(formName, 'submitText', e.target.value)}
          />
        </div>
      </div>
    );
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
                              onClick={() => handleAddArrayItem("keyFeatures", "")}
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
                              onClick={() => handleAddArrayItem("processSteps", "")}
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
                              onClick={() => handleAddArrayItem("faqs", { question: "", answer: "" })}
                              className="bg-green-500 text-white px-3 py-1 rounded-lg mt-2 flex items-center"
                            >
                              <FaPlus className="mr-1" /> Add FAQ
                            </button>
                          </div>

                          {renderFormFields('contactForm')}
                          {renderFormFields('applyNowForm')}

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

                          <div>
                            <h3 className="font-medium">Contact Form</h3>
                            <p className="text-gray-600">Fields: {service.contactForm?.fields?.length || 0}</p>
                            <p className="text-gray-600">Submit Text: {service.contactForm?.submitText || 'Submit'}</p>
                          </div>

                          <div>
                            <h3 className="font-medium">Apply Now Form</h3>
                            <p className="text-gray-600">Fields: {service.applyNowForm?.fields?.length || 0}</p>
                            <p className="text-gray-600">Submit Text: {service.applyNowForm?.submitText || 'Apply Now'}</p>
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