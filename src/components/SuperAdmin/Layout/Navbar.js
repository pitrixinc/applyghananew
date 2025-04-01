import Link from "next/link";
import React, { useEffect, useState } from "react";
import { FaBars, FaCogs, FaInfoCircle, FaQuestionCircle, FaStar, FaTimes } from "react-icons/fa";
import { IoMdArrowDropdown, IoMdArrowDropup } from "react-icons/io";
import { MdHomeRepairService } from "react-icons/md";
import { useRouter } from 'next/router';
import { getDoc, doc, query, collection, where, getDocs } from 'firebase/firestore';
import { signOut } from 'firebase/auth';
import { db, auth } from '../../../firebase.config';
import { toast } from 'react-toastify';

const Navbar = () => {
  const router = useRouter()
  const { id } = router.query;
  const [userDetails, setUserDetails] = useState(null);
  const [showLogoutModal, setShowLogoutModal] = useState(false);
  const [showSettingModal, setShowSettingModal] = useState(false);

  const [menuOpen, setMenuOpen] = useState(false);
  const [dropdownOpen, setDropdownOpen] = useState(false);

  const [isScrolled, setIsScrolled] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      if (window.scrollY > 50) {
        setIsScrolled(true);
      } else {
        setIsScrolled(false);
      }
    };

    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  useEffect(() => {
    const fetchUserData = async () => {
      if (id) {
        try {
          const userDocRef = doc(db, 'users', id);
          const userDocSnapshot = await getDoc(userDocRef);

          if (userDocSnapshot.exists()) {
            const userData = userDocSnapshot.data();
            setUserDetails(userData);
            console.log('User Details:', userData);

          } else {
            console.log('User not found');
            router.push('/auth/signin');
          }
        } catch (error) {
          console.error('Error fetching user data', error);
        }
      }
    };

    console.log('UID:', id); // Log UID to check if it's defined

    fetchUserData();
  }, [id, router]);

  return (
    <header
      className={`sticky top-0 inset-x-0 z-50 transition-all duration-300 ${
        isScrolled
          ? "bg-white/70 backdrop-blur-md shadow-md"
          : "bg-transparent"
      }`}
    >
      <nav className="max-w-6xl mx-auto flex justify-between items-center py-4 px-6">
        {/* Brand Logo */}
        <Link href="/" className="cursor-pointer text-xl font-semibold text-gray-800">
            ApplyGhana
        </Link>

        {/* Desktop Menu */}
        <ul className="hidden md:flex space-x-6 text-gray-700">
          
          <li>
            <Link href={`/my-admin/${userDetails?.uid}/services`} className="flex items-center text-sm font-semibold gap-2 hover:text-blue-600 transition">
              <FaInfoCircle className="text-md" />
              Services
            </Link>
          </li>
          <li>
            <Link href={`/my-admin/${userDetails?.uid}/blogs`} className="flex items-center text-sm font-semibold gap-2 hover:text-blue-600 transition">
              <FaCogs className="text-md" />
              Blogs
            </Link>
          </li>
        </ul>

        {/* Login Button - Desktop */}
        {userDetails && userDetails?.photoURL ? (
          <>
          <div className="hidden md:block items-center justify-end gap-x-6 space-y-3 md:flex md:space-y-0">
          <li className="flex">
            <img src={userDetails?.photoURL} alt="profile" className="w-10 h-10 rounded-full" />
               </li>
          <li className="flex">
          <button
            className="z-10 cursor-pointer block py-3 text-center text-gray-700 hover:text-indigo-600 border rounded-lg md:border-none"
          >
            {userDetails?.displayName && userDetails?.displayName.split(' ')[0]}
          </button>
          </li>
               </div>
        </>) : (
        <button className="hidden md:block bg-gradient-to-r from-green-400 to-green-600 text-white text-sm px-4 py-2 rounded-md hover:bg-blue-700 transition">
          My Account
        </button>
        )}

        {/* Mobile Menu Button */}
        <button onClick={() => setMenuOpen(!menuOpen)} className="md:hidden text-gray-800 text-2xl">
          {menuOpen ? <FaTimes /> : <FaBars />}
        </button>
      </nav>

      {/* Mobile Menu */}
      {menuOpen && (
        <div className="md:hidden bg-white shadow-lg border-t py-4 px-6">
          <ul className="space-y-4 text-gray-700">
            <li>
              <Link href={`/my-admin/${userDetails?.uid}/services`} className="block hover:text-blue-600 transition">Services</Link>
            </li>
            <li>
              <Link href={`/my-admin/${userDetails?.uid}/blogs`} className="block hover:text-blue-600 transition">Blogs</Link>
            </li>
          </ul>

          {userDetails && userDetails?.photoURL ? (
          <>
          <div className="flex items-center justify-start gap-x-6 space-y-3">
          <li className="">
            <img src={userDetails?.photoURL} alt="profile" className="w-10 h-10 rounded-full" />
               </li>
          <li className="">
          <button
            className="z-10 cursor-pointer  p-3 text-center text-gray-700 hover:text-indigo-600 border rounded-lg md:border-none"
          >
            {userDetails?.displayName && userDetails?.displayName.split(' ')[0]}
          </button>
          </li>
               </div>
        </>) : (  
<button className=" mt-4 bg-gradient-to-r from-green-400 to-green-600 text-white text-center py-2 rounded-md transition [background-image:linear-gradient(to_right,#34d399,#059669)]">
 My Account
</button>
        )}

        </div>
      )}
    </header>
  );
};

export default Navbar;
