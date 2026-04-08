import { FaArrowRight, FaRegLightbulb, FaCheckCircle, FaUserTie } from "react-icons/fa";
import { motion } from "framer-motion";

const stories = [
  {
    id: 1,
    client: "John Mensah",
    title: "From Application Struggles to Success",
    before: "John had trouble securing admission to a top university due to missing documents and deadlines.",
    process: "ApplyGhana streamlined the process, guided him through every step, and ensured all paperwork was in order.",
    after: "John got admitted to his dream university and is now pursuing a degree in Computer Science.",
  },
  {
    id: 2,
    client: "Akosua Agyemang",
    title: "Business Registration Made Easy",
    before: "Akosua struggled with the lengthy and confusing business registration process.",
    process: "With ApplyGhana’s expert guidance, she completed her registration in record time with zero stress.",
    after: "She successfully launched her business and now operates legally in Ghana.",
  },
];

const ClientStories = () => {
  return (
    <section className="py-16 px-6 lg:px-12">
          <div className="max-w-5xl mx-auto text-center">
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900">
              <span className="text-green-500">Success Stories</span> from Our Clients
            </h2>
            <p className="text-lg text-gray-600 mt-4">
              Real clients, real transformations. See how ApplyGhana has made a difference.
            </p>
          </div>
    
          {/* Timeline Container */}
          <div className="mt-12 max-w-4xl mx-auto">
            {stories.map((story, index) => (
              <motion.div
                key={story.id}
                initial={{ opacity: 0, x: index % 2 === 0 ? -50 : 50 }}
                whileInView={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.5 }}
                viewport={{ once: true }}
                className="relative flex flex-col lg:flex-row items-center gap-8 pb-12"
              >
                {/* Timeline Line */}
                <div className="hidden lg:block absolute left-5 top-0 h-full border-l-4 border-green-500"></div>
    
                {/* Timeline Icon */}
                <div className="bg-green-500 text-white p-4 rounded-full shadow-lg z-10">
                  <FaUserTie size={24} />
                </div>
    
                {/* Story Content */}
                <div className="bg-gray-100 shadow-md rounded-lg p-6 lg:ml-12 flex-1">
                  <h3 className="text-xl font-bold text-gray-900">{story.client}</h3>
                  <p className="text-green-500 font-semibold">{story.title}</p>
    
                  {/* Before */}
                  <div className="flex items-start gap-4 mt-4">
                    <FaRegLightbulb className="text-yellow-500 mt-1" size={20} />
                    <div>
                      <h4 className="text-lg font-semibold text-gray-800">Before</h4>
                      <p className="text-gray-600">{story.before}</p>
                    </div>
                  </div>
    
                  {/* Process */}
                  <div className="flex items-start gap-4 mt-4">
                    <FaArrowRight className="text-blue-500 mt-1" size={20} />
                    <div>
                      <h4 className="text-lg font-semibold text-gray-800">Process</h4>
                      <p className="text-gray-600">{story.process}</p>
                    </div>
                  </div>
    
                  {/* After */}
                  <div className="flex items-start gap-4 mt-4">
                    <FaCheckCircle className="text-green-500 mt-1" size={20} />
                    <div>
                      <h4 className="text-lg font-semibold text-gray-800">After</h4>
                      <p className="text-gray-600">{story.after}</p>
                    </div>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        </section>
    
  );
};

export default ClientStories;
