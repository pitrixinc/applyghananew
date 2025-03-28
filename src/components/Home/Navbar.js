import Link from "next/link";
import { useEffect, useState } from "react";
import { FaBars, FaCogs, FaInfoCircle, FaNewspaper, FaQuestionCircle, FaStar, FaTimes } from "react-icons/fa";
import { IoMdArrowDropdown, IoMdArrowDropup } from "react-icons/io";
import { MdHomeRepairService } from "react-icons/md";

const Navbar = () => {
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
        <Link href="/" className="text-xl font-semibold text-gray-800">
          ApplyGhana
        </Link>

        {/* Desktop Menu */}
        <ul className="hidden md:flex space-x-6 text-gray-700">
          {/* Dropdown */}
          <li className="relative">
            <button
              className="flex items-center text-sm font-semibold gap-2 hover:text-blue-600 transition"
              onClick={() => setDropdownOpen(!dropdownOpen)}
            >
              <MdHomeRepairService className="text-md" />
              Services {dropdownOpen ? <IoMdArrowDropup /> : <IoMdArrowDropdown />}
            </button>
            {dropdownOpen && (
              <ul className="absolute top-full left-0 bg-white shadow-lg rounded-md py-2 w-40 mt-2">
                <li>
                  <Link href="#" className="block px-4 py-2  hover:bg-gray-100 flex items-center gap-2">
                    <FaInfoCircle className="text-blue-600" /> About
                  </Link>
                </li>
                <li>
                  <Link href="#" className="block px-4 py-2 hover:bg-gray-100 flex items-center gap-2">
                    <FaCogs className="text-blue-600" /> Downloads
                  </Link>
                </li>
                <li>
                  <Link href="#" className="block px-4 py-2 hover:bg-gray-100 flex items-center gap-2">
                    <FaStar className="text-blue-600" /> Team Account
                  </Link>
                </li>
              </ul>
            )}
          </li>
          <li>
            <Link href="/about-us" className="flex items-center text-sm font-semibold gap-2 hover:text-blue-600 transition">
              <FaInfoCircle className="text-md" />
              About Us
            </Link>
          </li>
          <li>
            <Link href="/how-it-works" className="flex items-center text-sm font-semibold gap-2 hover:text-blue-600 transition">
              <FaCogs className="text-md" />
              How It Works
            </Link>
          </li>
          <li>
            <Link href="/testimonials" className="flex items-center text-sm font-semibold gap-2 hover:text-blue-600 transition">
              <FaStar className="text-md" />
              Testimonials
            </Link>
          </li>
          <li>
            <Link href="/faq" className="flex items-center text-sm font-semibold gap-2 hover:text-blue-600 transition">
              <FaQuestionCircle className="text-md" />
              FAQ
            </Link>
          </li>
          <li>
            <Link href="/blogs" className="flex items-center text-sm font-semibold gap-2 hover:text-blue-600 transition">
              <FaNewspaper className="text-md" />
              Blogs
            </Link>
          </li>
        </ul>

        {/* Login Button - Desktop */}
        <button className="hidden md:block bg-gradient-to-r from-green-400 to-green-600 text-white text-sm px-4 py-2 rounded-md hover:bg-blue-700 transition">
          Contact Us
        </button>

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
              <Link href="/about-us" className="block hover:text-blue-600 transition">About Us</Link>
            </li>
            <li>
              <Link href="/how-it-works" className="block hover:text-blue-600 transition">How It Works</Link>
            </li>
            <li>
              <Link href="/testimonials" className="block hover:text-blue-600 transition">Testimonials</Link>
            </li>
            <li>
              <Link href="/faq" className="block hover:text-blue-600 transition">FAQ</Link>
            </li>
            <li>
              <Link href="/blogs" className="block hover:text-blue-600 transition">Blogs</Link>
            </li>
            {/* Dropdown - Mobile */}
            <li className="relative">
              <button
                className="flex items-center justify-between w-full hover:text-blue-600 transition"
                onClick={() => setDropdownOpen(!dropdownOpen)}
              >
                Services {dropdownOpen ? <IoMdArrowDropup /> : <IoMdArrowDropdown />}
              </button>
              {dropdownOpen && (
                <ul className="mt-2 bg-gray-100 rounded-md">
                  <li>
                    <Link href="#" className="block px-4 py-2 hover:bg-gray-200">About</Link>
                  </li>
                  <li>
                    <Link href="#" className="block px-4 py-2 hover:bg-gray-200">Downloads</Link>
                  </li>
                  <li>
                    <Link href="#" className="block px-4 py-2 hover:bg-gray-200">Team Account</Link>
                  </li>
                </ul>
              )}
            </li>
          </ul>

         {/* Contact Us Button - Mobile */}
<button className="block mt-4 bg-gradient-to-r from-green-400 to-green-600 text-white text-center p-2 rounded-md transition ">
  Contact Us
</button>

        </div>
      )}
    </header>
  );
};

export default Navbar;
