import { useState } from "react";
import { db, storage } from "../../../firebase.config";
import { collection, addDoc, serverTimestamp } from "firebase/firestore";
import { ref, uploadBytes, getDownloadURL } from "firebase/storage";
import { FiPlus, FiTrash, FiUpload, FiCheckCircle } from "react-icons/fi";
import { useRouter } from "next/router";

const Create = () => {
  const router = useRouter();
  const [loading, setLoading] = useState(false);

  // State for each form field
  const [serviceName, setServiceName] = useState("");
  const [category, setCategory] = useState("");
  const [slug, setSlug] = useState("");
  const [description, setDescription] = useState("");
  const [keyFeatures, setKeyFeatures] = useState([""]);
  const [processSteps, setProcessSteps] = useState([""]);
  const [price, setPrice] = useState("");
  const [faqs, setFaqs] = useState([{ question: "", answer: "" }]);
  const [status, setStatus] = useState("Active");
  const [image, setImage] = useState(null);
  const [imageUrl, setImageUrl] = useState("");
  const [dateCreated] = useState(serverTimestamp());

  // Handle Image Upload
  const handleImageUpload = async (file) => {
    setLoading(true);
    const storageRef = ref(storage, `services/${slug}-${file.name}`);
    await uploadBytes(storageRef, file);
    const url = await getDownloadURL(storageRef);
    setImageUrl(url);
    setLoading(false);
  };

  // Functions to handle adding/removing items in arrays
  const handleArrayChange = (index, value, setState, state) => {
    const updatedArray = [...state];
    updatedArray[index] = value;
    setState(updatedArray);
  };

  const addArrayField = (setState, state) => {
    setState([...state, ""]);
  };

  const removeArrayField = (index, setState, state) => {
    const updatedArray = [...state];
    updatedArray.splice(index, 1);
    setState(updatedArray);
  };

  // Handle FAQ changes
  const handleFAQChange = (index, key, value) => {
    const updatedFAQs = [...faqs];
    updatedFAQs[index][key] = value;
    setFaqs(updatedFAQs);
  };

  const addFAQ = () => {
    setFaqs([...faqs, { question: "", answer: "" }]);
  };

  const removeFAQ = (index) => {
    const updatedFAQs = [...faqs];
    updatedFAQs.splice(index, 1);
    setFaqs(updatedFAQs);
  };

  // Submit Form
  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      await addDoc(collection(db, "services"), {
        serviceName,
        category,
        slug,
        description,
        keyFeatures,
        processSteps,
        price,
        faqs,
        status,
        imageUrl,
        dateCreated,
      });

      setLoading(false);
      alert("Service Created Successfully!");
      router.push("/admin/services");
    } catch (error) {
      console.error("Error creating service:", error);
      setLoading(false);
      alert("Failed to create service.");
    }
  };

  return (
    <div className="min-h-screen bg-gray-100 flex items-center justify-center p-6">
    <div className="w-full max-w-3xl bg-white shadow-lg rounded-2xl p-8">
      
      {/* Title */}
      <h2 className="text-3xl font-bold text-gray-800 flex items-center mb-6">
        <FiPlus className="mr-3 text-green-600" />
        Create New Service
      </h2>

      <form onSubmit={handleSubmit} className="space-y-6">
        
        {/* Service Name */}
        <div>
          <label className="text-lg font-medium text-gray-700">Service Name</label>
          <input
            type="text"
            value={serviceName}
            onChange={(e) => setServiceName(e.target.value)}
            className="w-full border border-gray-300 rounded-lg px-4 py-2 focus:ring-2 focus:ring-green-500 focus:outline-none"
            required
          />
        </div>

        {/* Category */}
        <div>
          <label className="text-lg font-medium text-gray-700">Category</label>
          <select
            value={category}
            onChange={(e) => setCategory(e.target.value)}
            className="w-full border border-gray-300 rounded-lg px-4 py-2 focus:ring-2 focus:ring-green-500 focus:outline-none"
            required
          >
            <option value="">Select Category</option>
            <option value="Educational Consultancy Services">Educational Consultancy Services</option>
            <option value="Document Application and Acquisition Services">Document Application and Acquisition Services</option>
            <option value="Additional Services">Additional Services</option>
            <option value="Premium Services">Premium Services</option>
          </select>
        </div>

        {/* Slug */}
        <div>
          <label className="text-lg font-medium text-gray-700">Slug / ID</label>
          <input
            type="text"
            value={slug}
            onChange={(e) => setSlug(e.target.value)}
            className="w-full border border-gray-300 rounded-lg px-4 py-2 focus:ring-2 focus:ring-green-500 focus:outline-none"
            required
          />
        </div>

        {/* Description */}
        <div>
          <label className="text-lg font-medium text-gray-700">Description</label>
          <textarea
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            className="w-full border border-gray-300 rounded-lg px-4 py-2 h-24 resize-none focus:ring-2 focus:ring-green-500 focus:outline-none"
            required
          ></textarea>
        </div>

        {/* Key Features */}
        <div>
          <label className="text-lg font-medium text-gray-700">Key Features</label>
          {keyFeatures.map((feature, index) => (
            <div key={index} className="flex items-center space-x-3">
              <input
                type="text"
                value={feature}
                onChange={(e) => handleArrayChange(index, e.target.value, setKeyFeatures, keyFeatures)}
                className="flex-1 border border-gray-300 rounded-lg px-4 py-2 focus:ring-2 focus:ring-green-500 focus:outline-none"
                required
              />
              <FiTrash onClick={() => removeArrayField(index, setKeyFeatures, keyFeatures)} className="cursor-pointer text-red-600 hover:text-red-800" />
            </div>
          ))}
          <button type="button" className="mt-2 bg-gray-100 text-gray-700 px-4 py-2 rounded-lg hover:bg-gray-200 transition" onClick={() => addArrayField(setKeyFeatures, keyFeatures)}>
            Add Feature
          </button>
        </div>

        {/* Process Steps */}
        <div>
          <label className="text-lg font-medium text-gray-700">Process Steps</label>
          {processSteps.map((step, index) => (
            <div key={index} className="flex items-center space-x-3">
              <input
                type="text"
                value={step}
                onChange={(e) => handleArrayChange(index, e.target.value, setProcessSteps, processSteps)}
                className="flex-1 border border-gray-300 rounded-lg px-4 py-2 focus:ring-2 focus:ring-green-500 focus:outline-none"
                required
              />
              <FiTrash onClick={() => removeArrayField(index, setProcessSteps, processSteps)} className="cursor-pointer text-red-600 hover:text-red-800" />
            </div>
          ))}
          <button type="button" className="mt-2 bg-gray-100 text-gray-700 px-4 py-2 rounded-lg hover:bg-gray-200 transition" onClick={() => addArrayField(setProcessSteps, processSteps)}>
            Add Step
          </button>
        </div>

        {/* FAQs */}
        <div>
          <label className="text-lg font-medium text-gray-700">FAQs</label>
          {faqs.map((faq, index) => (
            <div key={index} className="space-y-2">
              <input
                type="text"
                placeholder="Question"
                value={faq.question}
                onChange={(e) => handleFAQChange(index, "question", e.target.value)}
                className="w-full border border-gray-300 rounded-lg px-4 py-2 focus:ring-2 focus:ring-green-500 focus:outline-none"
                required
              />
              <textarea
                placeholder="Answer"
                value={faq.answer}
                onChange={(e) => handleFAQChange(index, "answer", e.target.value)}
                className="w-full border border-gray-300 rounded-lg px-4 py-2 h-20 resize-none focus:ring-2 focus:ring-green-500 focus:outline-none"
                required
              ></textarea>
              <FiTrash onClick={() => removeFAQ(index)} className="cursor-pointer text-red-600 hover:text-red-800" />
            </div>
          ))}
          <button type="button" className="mt-2 bg-gray-100 text-gray-700 px-4 py-2 rounded-lg hover:bg-gray-200 transition" onClick={addFAQ}>
            Add FAQ
          </button>
        </div>

        {/* Submit Button */}
        <button type="submit" className="w-full bg-green-600 text-white text-lg py-3 rounded-lg flex items-center justify-center hover:bg-green-700 transition">
          {loading ? "Creating..." : "Create Service"}
          <FiCheckCircle className="ml-2" />
        </button>

      </form>
    </div>
  </div>
  );
};

export default Create;
