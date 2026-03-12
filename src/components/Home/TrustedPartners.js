import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import Image from 'next/image';
import { 
  HiOutlineAcademicCap,
  HiOutlineMapPin,
  HiOutlineUsers,
  HiOutlineGlobeAlt,
  HiOutlineCalendar,
  HiOutlineArrowLongRight,
  HiOutlineXMark,
  HiOutlineBuildingLibrary,
  HiOutlineStar
} from 'react-icons/hi2';
import { PiStudent, PiGraduationCap } from 'react-icons/pi';
import { TbWorld, TbCertificate } from 'react-icons/tb';

export default function TrustedPartners() {
  const [selectedUniversity, setSelectedUniversity] = useState(null);

  // University data with images from Unsplash/Pexels
  const universities = {
    ghana: [
      {
        id: 1,
        name: "University of Ghana",
        location: "Accra, Ghana",
        type: "Public Research University",
        established: "1948",
        students: "38,000+",
        ranking: "#1 in Ghana",
        description: "The premier university in Ghana, known for excellence in research and academic programs across all disciplines.",
        achievements: "Produced 3 Nobel laureates, 2 heads of state",
        programs: ["Medicine", "Engineering", "Law", "Business", "Arts"],
        image: "https://scontent.facc5-1.fna.fbcdn.net/v/t39.30808-6/547196686_1298013629003290_9138187764548139471_n.jpg?stp=dst-jpg_s590x590_tt6&_nc_cat=100&ccb=1-7&_nc_sid=7b2446&_nc_ohc=BVOhwGPvsLoQ7kNvwGv7cAa&_nc_oc=AdkvBFty9AFFZ0SsKtcvCAYK97VM89hTy9efQvYaOlLuAi9uuw9Vj6-ZkUzkIrDAt9o&_nc_zt=23&_nc_ht=scontent.facc5-1.fna&_nc_gid=aWgnqOM3lR0jWe3Eb7HXvw&_nc_ss=8&oh=00_AfyQh8WvVbkl2XtOkbrPJyxlSozLCFfGMb6L6b6xtGjHUg&oe=69B7C5C9",
        logo: "https://upload.wikimedia.org/wikipedia/commons/thumb/9/98/UoG_CoA_2017.svg/1280px-UoG_CoA_2017.svg.png",
        studentsPlaced: 1250,
        successRate: "96%"
      },
      {
        id: 2,
        name: "Kwame Nkrumah University of Science and Technology",
        location: "Kumasi, Ghana",
        type: "Public Technical University",
        established: "1952",
        students: "42,000+",
        ranking: "#1 in Science & Technology",
        description: "Ghana's premier science and technology university, renowned for engineering and innovation.",
        achievements: "Leading research in sustainable technology",
        programs: ["Engineering", "Technology", "Sciences", "Architecture", "Pharmacy"],
        image: "https://cedirates.com/_next/image/?url=https%3A%2F%2Fwww.myjoyonline.com%2Fwp-content%2Fuploads%2F2026%2F02%2Flogo2-1024x683.jpg&w=1920&q=75",
        logo: "https://upload.wikimedia.org/wikipedia/en/b/b4/Knust_seal.jpg",
        studentsPlaced: 980,
        successRate: "94%"
      },
      {
        id: 3,
        name: "University of Cape Coast",
        location: "Cape Coast, Ghana",
        type: "Public University",
        established: "1962",
        students: "45,000+",
        ranking: "#1 in Education",
        description: "Excellence in teacher education and liberal arts, with strong international partnerships.",
        achievements: "Leading teacher training institution in West Africa",
        programs: ["Education", "Arts", "Social Sciences", "Business", "Law"],
        image: "https://geshub.org/wp-content/uploads/2023/01/University-of-Cape-Coast.png",
        logo: "https://scontent.facc5-2.fna.fbcdn.net/v/t39.30808-1/336738115_540339411585792_5080097206695869124_n.jpg?stp=dst-jpg_s200x200_tt6&_nc_cat=111&ccb=1-7&_nc_sid=2d3e12&_nc_ohc=AQ6t8YpAOyMQ7kNvwHNcfvk&_nc_oc=AdkdqMgjc-xqDGN5EYfGi1bscj7_WDx9tC7pbouTJ2HE2_LOZ41JIKRLFi7J6h9A-nI&_nc_zt=24&_nc_ht=scontent.facc5-2.fna&_nc_gid=FyeHKhLfrvQ4S1jHGxA2MQ&_nc_ss=8&oh=00_Afy8Q6daEilkKWl55WOVqlCF9AjDKotTCxqzTSD0dLRH8Q&oe=69B7F521",
        studentsPlaced: 850,
        successRate: "95%"
      },
      {
        id: 4,
        name: "University of Education, Winneba",
        location: "Winneba, Ghana",
        type: "Public University",
        established: "1992",
        students: "35,000+",
        ranking: "Top Teacher Training",
        description: "Specialized in teacher education and educational research.",
        achievements: "Pioneer in distance education in Ghana",
        programs: ["Education", "Science Education", "Vocational Education", "Arts Education"],
        image: "https://unisiteghana.com/wp-content/uploads/2025/05/about-uew.jpg",
        logo: "https://upload.wikimedia.org/wikipedia/en/0/08/University_of_Education%2C_Winneba_logo.jpg",
        studentsPlaced: 720,
        successRate: "93%"
      },
      {
        id: 5,
        name: "University for Development Studies",
        location: "Tamale, Ghana",
        type: "Public University",
        established: "1992",
        students: "30,000+",
        ranking: "Top in Northern Ghana",
        description: "Focused on development-oriented research and community engagement.",
        achievements: "Innovative trimester system for practical training",
        programs: ["Agriculture", "Medicine", "Development Studies", "Nursing"],
        image: "https://scontent.facc5-1.fna.fbcdn.net/v/t39.30808-6/484738631_1118527193404666_31933630263512992_n.jpg?stp=dst-jpg_p180x540_tt6&_nc_cat=106&ccb=1-7&_nc_sid=13d280&_nc_ohc=1amoUz8soQkQ7kNvwGulkv9&_nc_oc=Admbe94GuNSOkSWC0VoNf1YG8j6rY0JXuZUZpd6KQeerjYi1_3G2sVwnKl54KVaPQyM&_nc_zt=23&_nc_ht=scontent.facc5-1.fna&_nc_gid=HiQWlIzWl8IgwdnADBXTHg&_nc_ss=8&oh=00_AfwrFCsOhoPl3OTkj_97rjcgy_hYOJkveSe25WM5uceIvg&oe=69B7E5CE",
        logo: "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcSD6cgCeIvZd1uHCvSizqbjSQOX77kR2UHqzw&s",
        studentsPlaced: 680,
        successRate: "92%"
      },
      {
        id: 6,
        name: "Ghana Institute of Management and Public Administration",
        location: "Accra, Ghana",
        type: "Public Graduate School",
        established: "1961",
        students: "15,000+",
        ranking: "#1 in Business & Public Admin",
        description: "Premier institution for business and public administration education.",
        achievements: "Accredited by AACSB and AMBA",
        programs: ["MBA", "MPA", "Executive Education", "Finance", "Marketing"],
        image: "https://images.pexels.com/photos/3768916/pexels-photo-3768916.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=2",
        logo: "https://images.unsplash.com/photo-1562774053-701939374585?ixlib=rb-4.0.3&auto=format&fit=crop&w=200&h=200&q=80",
        studentsPlaced: 890,
        successRate: "97%"
      },
      {
        id: 7,
        name: "University of Professional Studies",
        location: "Accra, Ghana",
        type: "Public University",
        established: "1965",
        students: "25,000+",
        ranking: "Top Professional Education",
        description: "Specialized in professional and business education.",
        achievements: "First university to offer professional programs",
        programs: ["Accounting", "Marketing", "Banking", "Journalism", "Law"],
        image: "https://images.pexels.com/photos/5212345/pexels-photo-5212345.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=2",
        logo: "https://images.unsplash.com/photo-1562774053-701939374585?ixlib=rb-4.0.3&auto=format&fit=crop&w=200&h=200&q=80",
        studentsPlaced: 760,
        successRate: "94%"
      },
      {
        id: 8,
        name: "Accra Technical University",
        location: "Accra, Ghana",
        type: "Technical University",
        established: "1949",
        students: "12,000+",
        ranking: "Top Technical Education",
        description: "Leading technical and vocational education institution.",
        achievements: "Excellence in engineering and applied arts",
        programs: ["Engineering", "Applied Arts", "Technology", "Hospitality"],
        image: "https://images.pexels.com/photos/256468/pexels-photo-256468.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=2",
        logo: "https://images.unsplash.com/photo-1562774053-701939374585?ixlib=rb-4.0.3&auto=format&fit=crop&w=200&h=200&q=80",
        studentsPlaced: 590,
        successRate: "91%"
      },
      {
        id: 9,
        name: "Kumasi Technical University",
        location: "Kumasi, Ghana",
        type: "Technical University",
        established: "1954",
        students: "11,000+",
        ranking: "Top in Ashanti Region",
        description: "Excellence in technical and vocational education.",
        achievements: "Strong industry partnerships",
        programs: ["Engineering", "Technology", "Business", "Creative Arts"],
        image: "https://images.pexels.com/photos/207732/pexels-photo-207732.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=2",
        logo: "https://images.unsplash.com/photo-1562774053-701939374585?ixlib=rb-4.0.3&auto=format&fit=crop&w=200&h=200&q=80",
        studentsPlaced: 540,
        successRate: "90%"
      },
      {
        id: 10,
        name: "Ho Technical University",
        location: "Ho, Ghana",
        type: "Technical University",
        established: "1968",
        students: "8,000+",
        ranking: "Top in Volta Region",
        description: "Quality technical education in the Volta Region.",
        achievements: "Excellence in agriculture and technology",
        programs: ["Agriculture", "Engineering", "Applied Sciences", "Hospitality"],
        image: "https://images.pexels.com/photos/256490/pexels-photo-256490.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=2",
        logo: "https://images.unsplash.com/photo-1562774053-701939374585?ixlib=rb-4.0.3&auto=format&fit=crop&w=200&h=200&q=80",
        studentsPlaced: 420,
        successRate: "89%"
      },
      {
        id: 11,
        name: "Takoradi Technical University",
        location: "Takoradi, Ghana",
        type: "Technical University",
        established: "1954",
        students: "9,000+",
        ranking: "Top in Western Region",
        description: "Leading technical education in the Western Region.",
        achievements: "Strong maritime and engineering programs",
        programs: ["Maritime", "Engineering", "Oil & Gas", "Business"],
        image: "https://images.pexels.com/photos/3768916/pexels-photo-3768916.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=2",
        logo: "https://images.unsplash.com/photo-1562774053-701939374585?ixlib=rb-4.0.3&auto=format&fit=crop&w=200&h=200&q=80",
        studentsPlaced: 480,
        successRate: "90%"
      },
      {
        id: 12,
        name: "Cape Coast Technical University",
        location: "Cape Coast, Ghana",
        type: "Technical University",
        established: "1967",
        students: "7,000+",
        ranking: "Emerging Technical Institution",
        description: "Growing technical university in Central Region.",
        achievements: "Excellence in hospitality and tourism",
        programs: ["Hospitality", "Engineering", "Technology", "Business"],
        image: "https://images.pexels.com/photos/5212345/pexels-photo-5212345.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=2",
        logo: "https://images.unsplash.com/photo-1562774053-701939374585?ixlib=rb-4.0.3&auto=format&fit=crop&w=200&h=200&q=80",
        studentsPlaced: 380,
        successRate: "88%"
      },
      {
        id: 13,
        name: "Wisconsin International University College",
        location: "Accra, Ghana",
        type: "Private University",
        established: "1998",
        students: "5,000+",
        ranking: "Top Private University",
        description: "Leading private university with international partnerships.",
        achievements: "Strong business and IT programs",
        programs: ["Business", "IT", "Nursing", "Law", "Communication"],
        image: "https://images.pexels.com/photos/256468/pexels-photo-256468.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=2",
        logo: "https://images.unsplash.com/photo-1562774053-701939374585?ixlib=rb-4.0.3&auto=format&fit=crop&w=200&h=200&q=80",
        studentsPlaced: 620,
        successRate: "93%"
      },
      {
        id: 14,
        name: "Ashesi University",
        location: "Berekuso, Ghana",
        type: "Private University",
        established: "2002",
        students: "1,500+",
        ranking: "#1 Liberal Arts College",
        description: "Innovative liberal arts education with focus on ethics and leadership.",
        achievements: "Top-ranked for graduate employability",
        programs: ["Computer Science", "Business", "Engineering", "Design"],
        image: "https://images.pexels.com/photos/207732/pexels-photo-207732.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=2",
        logo: "https://images.unsplash.com/photo-1562774053-701939374585?ixlib=rb-4.0.3&auto=format&fit=crop&w=200&h=200&q=80",
        studentsPlaced: 350,
        successRate: "98%"
      },
      {
        id: 15,
        name: "Valley View University",
        location: "Oyibi, Ghana",
        type: "Private University",
        established: "1979",
        students: "4,000+",
        ranking: "Top Faith-Based University",
        description: "Adventist institution with strong academic programs.",
        achievements: "Excellence in theology and health sciences",
        programs: ["Theology", "Nursing", "Business", "Education"],
        image: "https://images.pexels.com/photos/256490/pexels-photo-256490.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=2",
        logo: "https://images.unsplash.com/photo-1562774053-701939374585?ixlib=rb-4.0.3&auto=format&fit=crop&w=200&h=200&q=80",
        studentsPlaced: 450,
        successRate: "91%"
      }
    ],
    foreign: [
      {
        id: 16,
        name: "University of Oxford",
        location: "Oxford, United Kingdom",
        type: "Public Research University",
        established: "1096",
        students: "24,000+",
        ranking: "#1 Worldwide",
        description: "The oldest university in the English-speaking world, renowned for academic excellence.",
        achievements: "110+ Nobel laureates, 50+ world leaders",
        programs: ["All Disciplines", "Research", "Graduate Studies", "Professional Programs"],
        image: "https://images.pexels.com/photos/460721/pexels-photo-460721.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=2",
        logo: "https://images.unsplash.com/photo-1562774053-701939374585?ixlib=rb-4.0.3&auto=format&fit=crop&w=200&h=200&q=80",
        studentsPlaced: 85,
        successRate: "92%"
      },
      {
        id: 17,
        name: "Harvard University",
        location: "Cambridge, USA",
        type: "Private Ivy League",
        established: "1636",
        students: "21,000+",
        ranking: "#1 in USA",
        description: "America's oldest institution of higher learning, world leader in education and research.",
        achievements: "160+ Nobel laureates, 8 US presidents",
        programs: ["All Disciplines", "Law", "Business", "Medicine", "Government"],
        image: "https://images.pexels.com/photos/290595/pexels-photo-290595.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=2",
        logo: "https://images.unsplash.com/photo-1562774053-701939374585?ixlib=rb-4.0.3&auto=format&fit=crop&w=200&h=200&q=80",
        studentsPlaced: 65,
        successRate: "88%"
      },
      {
        id: 18,
        name: "University of Toronto",
        location: "Toronto, Canada",
        type: "Public Research University",
        established: "1827",
        students: "60,000+",
        ranking: "#1 in Canada",
        description: "Canada's top university, known for research intensity and innovation.",
        achievements: "10 Nobel laureates, 3 Canadian prime ministers",
        programs: ["All Disciplines", "Engineering", "Medicine", "Business", "Computer Science"],
        image: "https://images.pexels.com/photos/2990644/pexels-photo-2990644.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=2",
        logo: "https://images.unsplash.com/photo-1562774053-701939374585?ixlib=rb-4.0.3&auto=format&fit=crop&w=200&h=200&q=80",
        studentsPlaced: 120,
        successRate: "94%"
      },
      {
        id: 19,
        name: "University of Melbourne",
        location: "Melbourne, Australia",
        type: "Public Research University",
        established: "1853",
        students: "45,000+",
        ranking: "#1 in Australia",
        description: "Australia's leading university, renowned for research and teaching excellence.",
        achievements: "8 Nobel laureates, 4 Australian prime ministers",
        programs: ["All Disciplines", "Medicine", "Law", "Engineering", "Arts"],
        image: "https://images.pexels.com/photos/918281/pexels-photo-918281.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=2",
        logo: "https://images.unsplash.com/photo-1562774053-701939374585?ixlib=rb-4.0.3&auto=format&fit=crop&w=200&h=200&q=80",
        studentsPlaced: 140,
        successRate: "95%"
      },
      {
        id: 20,
        name: "National University of Singapore",
        location: "Singapore",
        type: "Public Research University",
        established: "1905",
        students: "35,000+",
        ranking: "#1 in Asia",
        description: "Asia's top university, global leader in education and innovation.",
        achievements: "Top in engineering and technology research",
        programs: ["Engineering", "Computing", "Business", "Medicine", "Law"],
        image: "https://images.pexels.com/photos/590041/pexels-photo-590041.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=2",
        logo: "https://images.unsplash.com/photo-1562774053-701939374585?ixlib=rb-4.0.3&auto=format&fit=crop&w=200&h=200&q=80",
        studentsPlaced: 95,
        successRate: "91%"
      }
    ]
  };

  const allUniversities = [...universities.ghana, ...universities.foreign];

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.05,
        delayChildren: 0.2
      }
    }
  };

  const itemVariants = {
    hidden: { y: 20, opacity: 0 },
    visible: {
      y: 0,
      opacity: 1,
      transition: {
        type: "spring",
        stiffness: 100,
        damping: 12
      }
    }
  };

  return (
    <>
      <section className="relative py-24 lg:py-32 bg-gradient-to-b from-white to-green-50/30 overflow-hidden">
        {/* Sophisticated Background Elements */}
        <div className="absolute inset-0">
          {/* Academic Pattern */}
          <div className="absolute inset-0 opacity-[0.02]">
            <svg className="w-full h-full" xmlns="http://www.w3.org/2000/svg">
              <defs>
                <pattern id="academic-grid" width="60" height="60" patternUnits="userSpaceOnUse">
                  <path d="M 30 0 L 30 60 M 0 30 L 60 30" stroke="currentColor" strokeWidth="0.5" fill="none" />
                  <circle cx="30" cy="30" r="2" fill="currentColor" fillOpacity="0.2" />
                </pattern>
              </defs>
              <rect width="100%" height="100%" fill="url(#academic-grid)" />
            </svg>
          </div>

          {/* Floating Orbs */}
          <motion.div
            animate={{ 
              y: [0, -30, 0],
              x: [0, 20, 0],
              scale: [1, 1.1, 1]
            }}
            transition={{ 
              duration: 15,
              repeat: Infinity,
              ease: "linear"
            }}
            className="absolute top-20 left-10 w-64 h-64 bg-green-200/20 rounded-full blur-3xl"
          />
          <motion.div
            animate={{ 
              y: [0, 30, 0],
              x: [0, -20, 0],
              scale: [1, 1.2, 1]
            }}
            transition={{ 
              duration: 18,
              repeat: Infinity,
              ease: "linear"
            }}
            className="absolute bottom-20 right-10 w-80 h-80 bg-emerald-200/20 rounded-full blur-3xl"
          />

          {/* Animated Lines */}
          <div className="absolute inset-0">
            {[...Array(5)].map((_, i) => (
              <motion.div
                key={i}
                initial={{ x: '-100%', opacity: 0 }}
                animate={{ x: '200%', opacity: [0, 0.5, 0] }}
                transition={{
                  duration: 10,
                  delay: i * 2,
                  repeat: Infinity,
                  ease: "linear"
                }}
                className="absolute h-px w-96 bg-gradient-to-r from-transparent via-green-400/30 to-transparent"
                style={{ top: `${20 + i * 15}%` }}
              />
            ))}
          </div>
        </div>

        <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          {/* Section Header */}
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
            className="text-center max-w-3xl mx-auto mb-16"
          >
            <motion.div
              initial={{ opacity: 0, scale: 0.9 }}
              whileInView={{ opacity: 1, scale: 1 }}
              viewport={{ once: true }}
              transition={{ delay: 0.2 }}
              className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-gradient-to-r from-green-50 to-emerald-50 border border-green-100 mb-6"
            >
              <HiOutlineBuildingLibrary className="w-4 h-4 text-green-600" />
              <span className="text-sm font-medium text-green-700">Our Network</span>
            </motion.div>

            <motion.h2 
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: 0.3 }}
              className="text-3xl md:text-4xl lg:text-5xl font-bold text-gray-900 mb-6"
            >
              Trusted <span className="bg-gradient-to-r from-green-600 to-emerald-600 bg-clip-text text-transparent">Academic Partners</span>
            </motion.h2>
            
            <motion.p 
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: 0.4 }}
              className="text-lg text-gray-600 leading-relaxed"
            >
              We&apos;ve established strong partnerships with leading universities in Ghana and abroad, 
              ensuring our students have access to quality education worldwide.
            </motion.p>
          </motion.div>

          {/* Stats Overview */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.5 }}
            className="flex flex-wrap justify-center gap-8 mb-16"
          >
            <div className="text-center">
              <div className="text-3xl font-bold text-green-600">15</div>
              <div className="text-sm text-gray-500 mt-1">Ghanaian Universities</div>
            </div>
            <div className="w-px h-12 bg-gray-200 self-center" />
            <div className="text-center">
              <div className="text-3xl font-bold text-green-600">5</div>
              <div className="text-sm text-gray-500 mt-1">International Partners</div>
            </div>
            <div className="w-px h-12 bg-gray-200 self-center" />
            <div className="text-center">
              <div className="text-3xl font-bold text-green-600">20+</div>
              <div className="text-sm text-gray-500 mt-1">Years of Partnerships</div>
            </div>
          </motion.div>

          {/* University Logos Grid - Domestic */}
          <div className="mb-16">
            <motion.h3 
              initial={{ opacity: 0, x: -20 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              className="text-xl font-semibold text-gray-800 mb-8 flex items-center gap-3"
            >
              <HiOutlineMapPin className="w-6 h-6 text-green-600" />
              <span>Ghanaian Universities</span>
              <span className="text-sm font-normal text-gray-400 ml-2">(15 Partners)</span>
            </motion.h3>

            <motion.div
              variants={containerVariants}
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true }}
              className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4"
            >
              {universities.ghana.map((uni) => (
                <motion.div
                  key={uni.id}
                  variants={itemVariants}
                  whileHover={{ y: -5, scale: 1.02 }}
                  onClick={() => setSelectedUniversity(uni)}
                  className="group relative cursor-pointer"
                >
                  <div className="bg-white rounded-xl p-6 border border-gray-100 hover:border-green-200 shadow-sm hover:shadow-xl transition-all duration-300 flex flex-col items-center text-center">
                    {/* Logo Container */}
                    <div className="relative w-20 h-20 mb-3 rounded-full  bg-gradient-to-br from-green-50 to-emerald-50 p-2 group-hover:scale-110 transition-transform duration-300">
                      <div className="relative w-full h-full rounded-full overflow-hidden">
                        <img
                          src={uni.logo}
                          alt={uni.name}
                          fill
                          className="object-cover"
                        />
                      </div>
                    </div>
                    
                    {/* University Name */}
                    <h4 className="text-sm font-semibold text-gray-800 line-clamp-2 mb-1 group-hover:text-green-600 transition-colors">
                      {uni.name}
                    </h4>
                    
                    {/* Location */}
                    <p className="text-xs text-gray-400 mb-2">{uni.location.split(',')[0]}</p>
                    
                    {/* Students Placed Badge */}
                    <div className="inline-flex items-center gap-1 px-2 py-1 bg-green-50 rounded-full">
                      <PiStudent className="w-3 h-3 text-green-600" />
                      <span className="text-xs font-medium text-green-600">{uni.studentsPlaced}+</span>
                    </div>

                    {/* Hover Effect Overlay */}
                    <div className="absolute inset-0 rounded-xl bg-gradient-to-br from-green-600/5 to-emerald-600/5 opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none" />
                  </div>
                </motion.div>
              ))}
            </motion.div>
          </div>

          {/* University Logos Grid - International */}
          <div>
            <motion.h3 
              initial={{ opacity: 0, x: -20 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ delay: 0.2 }}
              className="text-xl font-semibold text-gray-800 mb-8 flex items-center gap-3"
            >
              <HiOutlineGlobeAlt className="w-6 h-6 text-green-600" />
              <span>International Partners</span>
              <span className="text-sm font-normal text-gray-400 ml-2">(5 Countries)</span>
            </motion.h3>

            <motion.div
              variants={containerVariants}
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true }}
              className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4"
            >
              {universities.foreign.map((uni) => (
                <motion.div
                  key={uni.id}
                  variants={itemVariants}
                  whileHover={{ y: -5, scale: 1.02 }}
                  onClick={() => setSelectedUniversity(uni)}
                  className="group relative cursor-pointer"
                >
                  <div className="bg-white rounded-xl p-6 border border-gray-100 hover:border-green-200 shadow-sm hover:shadow-xl transition-all duration-300 flex flex-col items-center text-center">
                    {/* Logo Container */}
                    <div className="relative w-20 h-20 mb-3 rounded-full bg-gradient-to-br from-green-50 to-emerald-50 p-2 group-hover:scale-110 transition-transform duration-300">
                      <div className="relative w-full h-full rounded-full overflow-hidden">
                        <img
                          src={uni.logo}
                          alt={uni.name}
                          fill
                          className="object-cover"
                        />
                      </div>
                    </div>
                    
                    {/* University Name */}
                    <h4 className="text-sm font-semibold text-gray-800 line-clamp-2 mb-1 group-hover:text-green-600 transition-colors">
                      {uni.name}
                    </h4>
                    
                    {/* Location with Flag Indicator */}
                    <p className="text-xs text-gray-400 mb-2">{uni.location}</p>
                    
                    {/* Success Rate Badge */}
                    <div className="inline-flex items-center gap-1 px-2 py-1 bg-emerald-50 rounded-full">
                      <HiOutlineStar className="w-3 h-3 text-emerald-600" />
                      <span className="text-xs font-medium text-emerald-600">{uni.successRate}</span>
                    </div>

                    {/* Hover Effect Overlay */}
                    <div className="absolute inset-0 rounded-xl bg-gradient-to-br from-green-600/5 to-emerald-600/5 opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none" />
                  </div>
                </motion.div>
              ))}
            </motion.div>
          </div>

          {/* Bottom CTA */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.8 }}
            className="mt-16 text-center"
          >
            <p className="text-gray-500 mb-4">Want to study at one of these institutions?</p>
            <button className="inline-flex items-center gap-2 px-6 py-3 bg-gradient-to-r from-green-600 to-emerald-600 text-white font-semibold rounded-xl shadow-lg shadow-green-500/25 hover:shadow-xl hover:shadow-green-500/30 transition-all duration-300 hover:-translate-y-0.5 group">
              <span>Start Your Application</span>
              <HiOutlineArrowLongRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
            </button>
          </motion.div>
        </div>
      </section>

      {/* University Detail Modal */}
      <AnimatePresence>
        {selectedUniversity && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 overflow-y-auto"
            onClick={() => setSelectedUniversity(null)}
          >
            {/* Backdrop with blur */}
            <div className="fixed inset-0 bg-black/40 backdrop-blur-sm" />

            {/* Modal Container */}
            <div className="flex min-h-full items-center justify-center p-4">
              <motion.div
                initial={{ scale: 0.9, opacity: 0, y: 20 }}
                animate={{ scale: 1, opacity: 1, y: 0 }}
                exit={{ scale: 0.9, opacity: 0, y: 20 }}
                transition={{ type: "spring", damping: 20 }}
                onClick={(e) => e.stopPropagation()}
                className="relative w-full max-w-4xl bg-white rounded-3xl shadow-2xl overflow-hidden"
              >
                {/* Close Button */}
                <button
                  onClick={() => setSelectedUniversity(null)}
                  className="absolute top-4 right-4 z-20 w-10 h-10 bg-white/90 backdrop-blur-sm rounded-full flex items-center justify-center text-gray-600 hover:text-gray-900 hover:bg-white transition-colors shadow-lg"
                >
                  <HiOutlineXMark className="w-5 h-5" />
                </button>

                {/* Modal Content */}
                <div className="flex flex-col lg:flex-row">
                  {/* Left Column - Image */}
                  <div className="lg:w-5/12 relative h-64 lg:h-auto">
                    <img
                      src={selectedUniversity.image}
                      alt={selectedUniversity.name}
                      fill
                      className="object-cover w-full h-full"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/20 to-transparent" />
                    
                    {/* Overlay Content */}
                    <div className="absolute bottom-0 left-0 right-0 p-6 text-white">
                      <div className="flex items-center gap-2 mb-2">
                        <HiOutlineBuildingLibrary className="w-5 h-5 text-green-300" />
                        <span className="text-sm font-medium text-green-300">{selectedUniversity.type}</span>
                      </div>
                      <h3 className="text-2xl font-bold mb-1">{selectedUniversity.name}</h3>
                      <div className="flex items-center gap-2 text-sm text-gray-200">
                        <HiOutlineMapPin className="w-4 h-4" />
                        <span>{selectedUniversity.location}</span>
                      </div>
                    </div>
                  </div>

                  {/* Right Column - Details */}
                  <div className="lg:w-7/12 p-8">
                    {/* Stats Grid */}
                    <div className="grid grid-cols-2 gap-4 mb-6">
                      <div className="bg-gradient-to-br from-green-50 to-emerald-50 rounded-xl p-4">
                        <HiOutlineCalendar className="w-5 h-5 text-green-600 mb-2" />
                        <div className="text-sm text-gray-500">Established</div>
                        <div className="text-lg font-bold text-gray-900">{selectedUniversity.established}</div>
                      </div>
                      <div className="bg-gradient-to-br from-green-50 to-emerald-50 rounded-xl p-4">
                        <PiStudent className="w-5 h-5 text-green-600 mb-2" />
                        <div className="text-sm text-gray-500">Students</div>
                        <div className="text-lg font-bold text-gray-900">{selectedUniversity.students}</div>
                      </div>
                      <div className="bg-gradient-to-br from-green-50 to-emerald-50 rounded-xl p-4">
                        <TbCertificate className="w-5 h-5 text-green-600 mb-2" />
                        <div className="text-sm text-gray-500">Ranking</div>
                        <div className="text-lg font-bold text-gray-900">{selectedUniversity.ranking}</div>
                      </div>
                      <div className="bg-gradient-to-br from-green-50 to-emerald-50 rounded-xl p-4">
                        <HiOutlineUsers className="w-5 h-5 text-green-600 mb-2" />
                        <div className="text-sm text-gray-500">Placed Students</div>
                        <div className="text-lg font-bold text-gray-900">{selectedUniversity.studentsPlaced}</div>
                      </div>
                    </div>

                    {/* Description */}
                    <div className="mb-6">
                      <h4 className="text-sm font-semibold text-gray-500 uppercase tracking-wider mb-2">About</h4>
                      <p className="text-gray-700 leading-relaxed">{selectedUniversity.description}</p>
                    </div>

                    {/* Achievements */}
                    <div className="mb-6">
                      <h4 className="text-sm font-semibold text-gray-500 uppercase tracking-wider mb-2">Notable Achievements</h4>
                      <p className="text-gray-700">{selectedUniversity.achievements}</p>
                    </div>

                    {/* Programs */}
                    <div className="mb-6">
                      <h4 className="text-sm font-semibold text-gray-500 uppercase tracking-wider mb-3">Popular Programs</h4>
                      <div className="flex flex-wrap gap-2">
                        {selectedUniversity.programs.map((program, idx) => (
                          <span
                            key={idx}
                            className="px-3 py-1 bg-gray-100 text-gray-600 rounded-full text-sm hover:bg-green-100 hover:text-green-600 transition-colors cursor-default"
                          >
                            {program}
                          </span>
                        ))}
                      </div>
                    </div>

                    {/* Success Stats */}
                    <div className="flex items-center justify-between p-4 bg-gradient-to-r from-green-600 to-emerald-600 rounded-xl text-white">
                      <div>
                        <div className="text-sm opacity-90">Our Success Rate</div>
                        <div className="text-2xl font-bold">{selectedUniversity.successRate}</div>
                      </div>
                      <div>
                        <div className="text-sm opacity-90">Students Placed</div>
                        <div className="text-2xl font-bold">{selectedUniversity.studentsPlaced}+</div>
                      </div>
                      <button className="px-4 py-2 bg-white text-green-600 rounded-lg font-semibold text-sm hover:bg-gray-100 transition-colors">
                        Apply Now
                      </button>
                    </div>
                  </div>
                </div>
              </motion.div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}