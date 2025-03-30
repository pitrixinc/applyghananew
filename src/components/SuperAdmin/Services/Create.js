import { useEffect, useState } from "react";
import { db, storage } from "../../../firebase.config";
import { collection, addDoc, serverTimestamp, doc, getDoc, setDoc } from "firebase/firestore";
import { ref, uploadBytes, getDownloadURL, uploadBytesResumable } from "firebase/storage";
import { FiPlus, FiTrash, FiUpload, FiCheckCircle } from "react-icons/fi";
import { useRouter } from "next/router";

const Create = () => {
  const router = useRouter();
  const { id } = router.query;
  const [loading, setLoading] = useState(false);
  const [userDetails, setUserDetails] = useState(null);

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

  const [includeContactForm, setIncludeContactForm] = useState(false);
  const [contactFields, setContactFields] = useState([]);
  const [submitButtonText, setSubmitButtonText] = useState("Submit");

  const [includeApplyNowForm, setIncludeApplyNowForm] = useState(false);
const [applyNowFields, setApplyNowFields] = useState([
  {
    label: "Select Price Type",
    type: "select",
    value: "price_type",
    options: [
      { label: "Regular Price", price: 0 },
      { label: "Express Price", price: 0 }
    ]
  }
]);
const [applyNowSubmitButtonText, setApplyNowSubmitButtonText] = useState("Apply Now");

const addApplyNowField = (type) => {
  setApplyNowFields([
    ...applyNowFields,
    { label: "", type, value: "", options: type === "select" ? [] : null }
  ]);
};

const removeApplyNowField = (index) => {
  if (applyNowFields[index].value === "price_type") return; // Prevent removing Price Type
  setApplyNowFields(applyNowFields.filter((_, i) => i !== index));
};

const updateApplyNowField = (index, key, value) => {
  const updatedFields = [...applyNowFields];
  updatedFields[index][key] = value;
  setApplyNowFields(updatedFields);
};

const addApplyNowOption = (index) => {
  const updatedFields = [...applyNowFields];
  updatedFields[index].options.push({ label: "", value: "" });
  setApplyNowFields(updatedFields);
};

const updateApplyNowOptionLabel = (index, optIndex, value) => {
  const updatedFields = [...applyNowFields];
  updatedFields[index].options[optIndex].label = value;
  setApplyNowFields(updatedFields);
};

const updateApplyNowOptionValue = (index, optIndex, value) => {
  const updatedFields = [...applyNowFields];
  updatedFields[index].options[optIndex].value = value;
  setApplyNowFields(updatedFields);
};

const updateApplyNowOptionPrice = (index, optIndex, price) => {
  const updatedFields = [...applyNowFields];
  updatedFields[index].options[optIndex].price = Number(price);
  setApplyNowFields(updatedFields);
};

const removeApplyNowOption = (index, optIndex) => {
  const updatedFields = [...applyNowFields];
  updatedFields[index].options.splice(optIndex, 1);
  setApplyNowFields(updatedFields);
};


  
  // Fetch Admin Details
  useEffect(() => {
    const fetchUserData = async () => {
      if (id) {
        try {
          const userDocRef = doc(db, "users", id);
          const userDocSnapshot = await getDoc(userDocRef);

          if (userDocSnapshot.exists()) {
            setUserDetails(userDocSnapshot.data());
          } else {
            router.push("/auth/signin");
          }
        } catch (error) {
          console.error("Error fetching user data", error);
        }
      }
    };

    fetchUserData();
  }, [id, router]);



  
// Add Field to Contact Form
const addField = (type) => {
  setContactFields([
    ...contactFields,
    { 
      type, 
      label: "", 
      value: "", 
      options: type === "select" ? [] : null  // Only select fields have options
    },
  ]);
};

// Update Field Properties
const updateField = (index, key, value) => {
  const updatedFields = [...contactFields];
  updatedFields[index][key] = value;
  setContactFields(updatedFields);
};

// Handle Adding Options for Select Fields
const addOption = (index) => {
  const updatedFields = [...contactFields];
  if (updatedFields[index].type === "select") {
    updatedFields[index].options.push("");
  }
  setContactFields(updatedFields);
};

// Update Select Field Options
const updateOption = (index, optIndex, value) => {
  const updatedFields = [...contactFields];
  updatedFields[index].options[optIndex] = value;
  setContactFields(updatedFields);
};

// Remove Field from Contact Form
const removeField = (index) => {
  setContactFields(contactFields.filter((_, i) => i !== index));
};

// Remove Select Field Option
const removeOption = (fieldIndex, optIndex) => {
  const updatedFields = [...contactFields];
  updatedFields[fieldIndex].options.splice(optIndex, 1);
  setContactFields(updatedFields);
};





  // Handle Image Upload
  const handleImageUpload = async (event) => {
    const file = event.target.files[0];
    if (!file) return;
  
    setLoading(true);
    const storageRef = ref(storage, `services/${slug}-${file.name}`);
    const metadata = { contentType: file.type }; // Explicitly set content type
  
    try {
      const uploadTask = uploadBytesResumable(storageRef, file, metadata);
  
      uploadTask.on(
        "state_changed",
        null,
        (error) => {
          console.error("Upload failed:", error);
          setLoading(false);
        },
        async () => {
          const url = await getDownloadURL(uploadTask.snapshot.ref);
          setImageUrl(url);
          setLoading(false);
        }
      );
    } catch (error) {
      console.error("Error uploading image:", error);
      setLoading(false);
    }
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

const handleSubmit = async (e) => {
  e.preventDefault();
  if (!imageUrl) {
    alert("Please upload an image before submitting.");
    return;
  }
  setLoading(true);

  try {
    // Create the document and let Firestore generate the ID
    const serviceRef = await addDoc(collection(db, "services"), {
      adminId: userDetails.uid,
      adminName: userDetails.displayName,
      adminEmail: userDetails.email,
      adminImage: userDetails.photoURL,
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
      contactForm: includeContactForm
        ? { fields: contactFields, submitText: submitButtonText }
        : null,
      applyNowForm: includeApplyNowForm
      ? { fields: applyNowFields, submitText: applyNowSubmitButtonText }
      : null,
    });

    // Retrieve the generated ID and update the document with it
    await setDoc(serviceRef, { id: serviceRef.id }, { merge: true });

    setLoading(false);
    alert("Service Created Successfully!");
    router.push(`/my-admin/${id}/services`);
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

        <div>
                <label className="block text-sm mb-2">Service Picture</label>
                <input 
                    type="file" 
                    accept="image/*" 
                    onChange={handleImageUpload} 
                    className="block w-full text-sm text-gray-500 file:mr-4 file:py-2 file:px-4 file:rounded-lg file:border-0 file:text-sm file:font-semibold file:bg-green-500 file:text-white hover:file:bg-blue-700"
                />
            </div>

        <div className="bg-white p-6 rounded-lg shadow-lg mt-6">
  <h2 className="text-2xl font-semibold mb-4">Contact Form Editor</h2>

  {/* Checkbox to enable Contact Form */}
  <div className="flex items-center space-x-2 mb-4">
    <input
      type="checkbox"
      checked={includeContactForm}
      onChange={() => setIncludeContactForm(!includeContactForm)}
      className="w-5 h-5"
    />
    <label className="text-lg font-medium">Include Contact Form</label>
  </div>

  {includeContactForm && (
    <div className="space-y-4">
      {/* Add Field Buttons */}
      <div className="flex flex-wrap gap-3">
        <button type="button" className="bg-blue-600 text-white px-3 py-2 rounded-lg" onClick={() => addField("text")}>Add Input Field</button>
        <button type="button" className="bg-green-600 text-white px-3 py-2 rounded-lg" onClick={() => addField("textarea")}>Add Textarea</button>
        <button type="button" className="bg-purple-600 text-white px-3 py-2 rounded-lg" onClick={() => addField("select")}>Add Select Field</button>
        <button type="button" className="bg-red-600 text-white px-3 py-2 rounded-lg" onClick={() => addField("file")}>Add File Upload</button>
      </div>

      {/* Fields Display */}
      {contactFields.map((field, index) => (
        <div key={index} className="p-4 bg-gray-100 rounded-lg relative">
          {/* Remove Field Button */}
          <button type="button" className="absolute top-2 right-2 text-red-500 hover:text-red-700" onClick={() => removeField(index)}>X</button>

          {/* Label */}
          <label className="block text-lg font-medium mb-1">Field Label</label>
          <input type="text" value={field.label} onChange={(e) => updateField(index, "label", e.target.value)} className="w-full p-2 border rounded-lg"/>

          {/* Value Field */}
          <label className="block text-lg font-medium mt-2">Value</label>
          <input type="text" value={field.value} onChange={(e) => updateField(index, "value", e.target.value)} className="w-full p-2 border rounded-lg"/>

          {/* Select Field Options */}
          {field.type === "select" && (
            <div className="mt-3">
              <label className="block text-lg font-medium mb-1">Options</label>
              {field.options.map((option, optIndex) => (
                <div key={optIndex} className="flex space-x-2 mb-2">
                  <input type="text" value={option} onChange={(e) => updateOption(index, optIndex, e.target.value)} className="w-full p-2 border rounded-lg"/>
                  <button type="button" className="text-red-500" onClick={() => removeOption(index, optIndex)}>X</button>
                </div>
              ))}
              <button type="button" className="bg-gray-700 text-white px-2 py-1 rounded-lg mt-2" onClick={() => addOption(index)}>Add Option</button>
            </div>
          )}
        </div>
      ))}

      {/* Submit Button Text */}
      <div>
        <label className="block text-lg font-medium mb-1">Submit Button Text</label>
        <input type="text" value={submitButtonText} onChange={(e) => setSubmitButtonText(e.target.value)} className="w-full p-2 border rounded-lg"/>
      </div>
    </div>
  )}
</div>



<div className="bg-white p-6 rounded-lg shadow-lg mt-6">
  <h2 className="text-2xl font-semibold mb-4">Apply Now Form Editor</h2>

  {/* Checkbox to enable Apply Now Form */}
  <div className="flex items-center space-x-2 mb-4">
    <input
      type="checkbox"
      checked={includeApplyNowForm}
      onChange={() => setIncludeApplyNowForm(!includeApplyNowForm)}
      className="w-5 h-5"
    />
    <label className="text-lg font-medium">Include Apply Now Form</label>
  </div>

  {includeApplyNowForm && (
    <div className="space-y-4">
      {/* Add Field Buttons */}
      <div className="flex flex-wrap gap-3">
        <button type="button" className="bg-blue-600 text-white px-3 py-2 rounded-lg" onClick={() => addApplyNowField("text")}>Add Input Field</button>
        <button type="button" className="bg-green-600 text-white px-3 py-2 rounded-lg" onClick={() => addApplyNowField("textarea")}>Add Textarea</button>
        <button type="button" className="bg-purple-600 text-white px-3 py-2 rounded-lg" onClick={() => addApplyNowField("select")}>Add Select Field</button>
        <button type="button" className="bg-red-600 text-white px-3 py-2 rounded-lg" onClick={() => addApplyNowField("file")}>Add File Upload</button>
      </div>

      {/* Fields Display */}
      {applyNowFields.map((field, index) => (
        <div key={index} className="p-4 bg-gray-100 rounded-lg relative">
          {/* Remove Field Button (Prevent Deleting Price Type) */}
          {field.value !== "price_type" && (
            <button type="button" className="absolute top-2 right-2 text-red-500 hover:text-red-700" onClick={() => removeApplyNowField(index)}>X</button>
          )}

          {/* Label */}
          <label className="block text-lg font-medium mb-1">Field Label</label>
          <input type="text" value={field.label} onChange={(e) => updateApplyNowField(index, "label", e.target.value)} className="w-full p-2 border rounded-lg" readOnly={field.value === "price_type"}/>

          {/* Value Field */}
          <label className="block text-lg font-medium mt-2">Value</label>
          <input type="text" value={field.value} onChange={(e) => updateApplyNowField(index, "value", e.target.value)} className="w-full p-2 border rounded-lg" readOnly={field.value === "price_type"}/>

          {/* Select Field Options for Pricing */}
          {field.type === "select" && field.value === "price_type" && (
            <div className="mt-3">
              <label className="block text-lg font-medium mb-1">Price Options</label>
              {field.options.map((option, optIndex) => (
                <div key={optIndex} className="flex space-x-2 mb-2">
                  <input 
                    type="text" 
                    value={option.label} 
                    readOnly
                    className="w-1/2 p-2 border rounded-lg"
                  />
                  <input 
                    type="number" 
                    placeholder="Enter price" 
                    value={option.price} 
                    onChange={(e) => updateApplyNowOptionPrice(index, optIndex, e.target.value)} 
                    className="w-1/2 p-2 border rounded-lg"
                  />
                </div>
              ))}
            </div>
          )}

          {/* Other Select Fields */}
          {field.type === "select" && field.value !== "price_type" && (
            <div className="mt-3">
              <label className="block text-lg font-medium mb-1">Options</label>
              {field.options.map((option, optIndex) => (
                <div key={optIndex} className="flex space-x-2 mb-2">
                  <input type="text" value={option.label} onChange={(e) => updateApplyNowOptionLabel(index, optIndex, e.target.value)} className="w-1/2 p-2 border rounded-lg"/>
                  <input type="text" value={option.value} onChange={(e) => updateApplyNowOptionValue(index, optIndex, e.target.value)} className="w-1/2 p-2 border rounded-lg"/>
                  <button type="button" className="text-red-500" onClick={() => removeApplyNowOption(index, optIndex)}>X</button>
                </div>
              ))}
              <button type="button" className="bg-gray-700 text-white px-2 py-1 rounded-lg mt-2" onClick={() => addApplyNowOption(index)}>Add Option</button>
            </div>
          )}
        </div>
      ))}

      {/* Submit Button Text */}
      <div>
        <label className="block text-lg font-medium mb-1">Submit Button Text</label>
        <input type="text" value={applyNowSubmitButtonText} onChange={(e) => setApplyNowSubmitButtonText(e.target.value)} className="w-full p-2 border rounded-lg"/>
      </div>
    </div>
  )}
</div>




        {/* Submit Button */}
        <button type="submit" className="w-full cursor-pointer bg-gradient-to-r from-green-400 to-green-600 text-white text-lg py-3 rounded-lg flex items-center justify-center hover:bg-green-700 transition">
          {loading ? "Creating..." : "Create Service"}
          <FiCheckCircle className="ml-2" />
        </button>

      </form>
    </div>
  </div>
  );
};

export default Create;
