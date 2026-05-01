import { useState, useEffect } from "react";
import { useRouter } from "next/router";
import Link from "next/link";
import { 
  FiHome, 
  FiBriefcase, 
  FiBookOpen, 
  FiBarChart2, 
  FiMenu, 
  FiX, 
  FiLogOut,
  FiUser,
  FiMail,
  FiChevronLeft,
  FiChevronRight,
  FiCrosshair,
  FiUsers
} from "react-icons/fi";
import { doc, getDoc } from "firebase/firestore";
import { signOut } from "firebase/auth";
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { auth, db } from "@/firebase.config";
import { BiSolidHome } from "react-icons/bi";

const Sidebar = ({ children }) => {
  const router = useRouter();
  const { id } = router.query;
  const [isMinimized, setIsMinimized] = useState(false);
  const [isMobileOpen, setIsMobileOpen] = useState(false);
  const [showSignOutModal, setShowSignOutModal] = useState(false);
  const [adminDetails, setAdminDetails] = useState(null);
  const [isLoading, setIsLoading] = useState(true);

  // Navigation links
  const navLinks = [
    { href: `/my-admin/${id}/dashboard`, label: "Dashboard", icon: FiHome },
    { href: `/my-admin/${id}/services`, label: "Services", icon: FiBriefcase },
    { href: `/my-admin/${id}/blogs`, label: "Blogs", icon: FiBookOpen },
    { href: `/my-admin/${id}/schools`, label: "Manage Schools", icon: FiUsers },
    { href: `/my-admin/${id}/analytics`, label: "Analytics", icon: FiBarChart2 },
    { href: `/my-admin/${id}/pages/home`, label: "Customize Home Page", icon: FiHome },
  ];

  // Fetch admin details from Firebase
  useEffect(() => {
    const fetchAdminDetails = async () => {
      if (id) {
        try {
          const userDocRef = doc(db, "users", id);
          const userDocSnapshot = await getDoc(userDocRef);

          if (userDocSnapshot.exists()) {
            setAdminDetails(userDocSnapshot.data());
          } else {
            toast.error("Admin details not found");
            router.push("/auth/signin");
          }
        } catch (error) {
          console.error("Error fetching admin data:", error);
          toast.error("Failed to fetch admin details");
        } finally {
          setIsLoading(false);
        }
      } else {
        setIsLoading(false);
      }
    };

    fetchAdminDetails();
  }, [id, router]);

  // Handle sign out
  const handleSignOut = async () => {
    try {
      await signOut(auth);
      toast.success("Signed out successfully");
      setShowSignOutModal(false);
      router.push("/auth/signin");
    } catch (error) {
      console.error("Error signing out:", error);
      toast.error("Failed to sign out. Please try again.");
    }
  };

  // Close mobile sidebar when route changes
  useEffect(() => {
    setShowSignOutModal(false);
    setMobileOpen(false);
  }, [router.pathname]);

  const setMobileOpen = (value) => {
    setIsMobileOpen(value);
    if (!value) {
      // Prevent body scroll when sidebar is open
      document.body.style.overflow = '';
    } else {
      document.body.style.overflow = 'hidden';
    }
  };

  // Sign Out Modal Component
  const SignOutModal = () => {
    if (!showSignOutModal) return null;

    return (
      <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm animate-fadeIn">
        <div className="bg-white rounded-2xl shadow-2xl max-w-md w-full transform transition-all animate-slideUp">
          {/* Modal Header */}
          <div className="bg-gradient-to-r from-red-500 to-red-600 rounded-t-2xl px-6 py-4">
            <h3 className="text-xl font-semibold text-white flex items-center gap-2">
              <FiLogOut className="w-5 h-5" />
              Sign Out
            </h3>
          </div>
          
          {/* Modal Body */}
          <div className="p-6">
            <p className="text-gray-600 mb-2">
              Are you sure you want to sign out?
            </p>
            <p className="text-sm text-gray-500">
              You&apos;ll need to sign in again to access your dashboard.
            </p>
            
            {/* Admin Info Preview */}
            {adminDetails && (
              <div className="mt-4 p-3 bg-gray-50 rounded-lg">
                <div className="flex items-center gap-3">
                  {adminDetails.photoURL ? (
                    <img 
                      src={adminDetails.photoURL} 
                      alt={adminDetails.displayName}
                      className="w-8 h-8 rounded-full object-cover"
                    />
                  ) : (
                    <div className="w-8 h-8 bg-green-100 rounded-full flex items-center justify-center">
                      <FiUser className="w-4 h-4 text-green-600" />
                    </div>
                  )}
                  <div>
                    <p className="text-sm font-medium text-gray-900">{adminDetails.displayName || "Admin"}</p>
                    <p className="text-xs text-gray-500">{adminDetails.email}</p>
                  </div>
                </div>
              </div>
            )}
          </div>
          
          {/* Modal Footer */}
          <div className="flex gap-3 p-6 pt-0">
            <button
              onClick={() => setShowSignOutModal(false)}
              className="flex-1 px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors font-medium"
            >
              Cancel
            </button>
            <button
              onClick={handleSignOut}
              className="flex-1 px-4 py-2 bg-gradient-to-r from-red-500 to-red-600 text-white rounded-lg hover:shadow-lg transition-all font-medium"
            >
              Sign Out
            </button>
          </div>
        </div>
      </div>
    );
  };

  // Desktop Sidebar
  const DesktopSidebar = () => (
    <aside
      className={`hidden md:flex flex-col border-r border-gray-200 transition-all duration-300 ease-in-out bg-green-200 ${
        isMinimized ? "w-20" : "w-64"
      } fixed left-0 top-0 h-full z-30 shadow-lg`}
    >
      {/* Logo Section */}
      <div className={`flex items-center ${isMinimized ? "justify-center py-6" : "justify-between px-6 py-6"}`}>
        {!isMinimized && (
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 bg-gradient-to-r from-green-500 to-emerald-600 rounded-lg flex items-center justify-center">
              <span className="text-white font-bold text-lg">AG</span>
            </div>
            <span className="text-xl font-bold bg-gradient-to-r from-green-600 to-emerald-600 bg-clip-text text-transparent">
              Apply Ghana
            </span>
          </div>
        )}
        {isMinimized && (
          <div className="w-10 h-10 bg-gradient-to-r from-green-500 to-emerald-600 rounded-lg flex items-center justify-center">
            <span className="text-white font-bold text-lg">AG</span>
          </div>
        )}
        <button
          onClick={() => setIsMinimized(!isMinimized)}
          className={`p-2 rounded-lg hover:bg-gray-100 transition-colors ${isMinimized ? "absolute -right-3 top-6 bg-white border border-gray-200 shadow-md" : ""}`}
        >
          {isMinimized ? <FiChevronRight className="w-4 h-4 text-gray-600" /> : <FiChevronLeft className="w-4 h-4 text-gray-600" />}
        </button>
      </div>

      {/* Navigation Links */}
      <nav className="flex-1 px-3 py-6 space-y-2 overflow-y-auto">
        {navLinks.map((link) => {
          const isActive = router.pathname.includes(link.href.split('/').pop()) || 
                          (router.pathname === `/my-admin/${id}/dashboard` && link.label === "Dashboard");
          const Icon = link.icon;
          
          return (
            <Link
              key={link.href}
              href={link.href}
              className={`flex items-center gap-3 px-4 py-3 rounded-xl transition-all duration-200 group ${
                isActive
                  ? "bg-gradient-to-r from-green-500 to-emerald-600 text-white shadow-md"
                  : "text-gray-700 hover:bg-gray-100"
              } ${isMinimized ? "justify-center" : ""}`}
              title={isMinimized ? link.label : ""}
            >
              <Icon className={`w-5 h-5 ${isActive ? "text-white" : "text-gray-500 group-hover:text-green-600"} transition-colors`} />
              {!isMinimized && <span className="font-medium">{link.label}</span>}
            </Link>
          );
        })}
      </nav>

      {/* Admin Profile Section */}
      {!isLoading && adminDetails && (
        <div className="border-t border-gray-200 p-4">
          <button
            onClick={() => setShowSignOutModal(true)}
            className={`w-full group ${isMinimized ? "flex justify-center" : ""}`}
          >
            <div className={`flex items-center gap-3 p-2 rounded-xl transition-all duration-200 hover:bg-gray-100 ${
              isMinimized ? "justify-center" : ""
            }`}>
              {adminDetails.photoURL ? (
                <img
                  src={adminDetails.photoURL}
                  alt={adminDetails.displayName}
                  className="w-10 h-10 rounded-full object-cover ring-2 ring-green-500 ring-offset-2"
                />
              ) : (
                <div className="w-10 h-10 bg-gradient-to-r from-green-500 to-emerald-600 rounded-full flex items-center justify-center">
                  <FiUser className="w-5 h-5 text-white" />
                </div>
              )}
              {!isMinimized && (
                <div className="flex-1 text-left">
                  <p className="text-sm font-semibold text-gray-900 truncate">
                    {adminDetails.displayName || "Admin User"}
                  </p>
                  <p className="text-xs text-gray-500 truncate flex items-center gap-1">
                    <FiMail className="w-3 h-3" />
                    {adminDetails.email || "admin@example.com"}
                  </p>
                </div>
              )}
              {!isMinimized && <FiLogOut className="w-4 h-4 text-gray-400 group-hover:text-red-500 transition-colors" />}
            </div>
          </button>
        </div>
      )}
    </aside>
  );

  // Mobile Bottom Navigation
  const MobileBottomNav = () => (
    <nav className="md:hidden fixed bottom-0 left-0 right-0 bg-white border-t border-gray-200 shadow-lg z-40">
      <div className="flex items-center justify-around px-4 py-2">
        {navLinks.map((link) => {
          const isActive = router.pathname.includes(link.href.split('/').pop()) || 
                          (router.pathname === `/my-admin/${id}/dashboard` && link.label === "Dashboard");
          const Icon = link.icon;
          
          return (
            <Link
              key={link.href}
              href={link.href}
              className={`flex flex-col items-center gap-1 px-3 py-2 rounded-xl transition-all duration-200 ${
                isActive
                  ? "text-green-600"
                  : "text-gray-500 hover:text-green-600"
              }`}
            >
              <Icon className={`w-5 h-5 ${isActive ? "text-green-600" : ""}`} />
              <span className={`text-xs ${isActive ? "font-semibold" : ""}`}>{link.label}</span>
            </Link>
          );
        })}
        
        {/* Menu Button for Mobile Sidebar */}
        <button
          onClick={() => setMobileOpen(true)}
          className="flex flex-col items-center gap-1 px-3 py-2 rounded-xl text-gray-500 hover:text-green-600 transition-colors"
        >
          <FiMenu className="w-5 h-5" />
          <span className="text-xs">Menu</span>
        </button>
      </div>
    </nav>
  );

  // Mobile Sidebar (Overlay)
  const MobileSidebar = () => (
    <>
      {isMobileOpen && (
        <div className="fixed inset-0 z-50 md:hidden">
          {/* Backdrop */}
          <div 
            className="absolute inset-0 bg-black/50 backdrop-blur-sm animate-fadeIn"
            onClick={() => setMobileOpen(false)}
          />
          
          {/* Sidebar Panel */}
          <aside className="absolute left-0 top-0 bottom-0 w-80 bg-white shadow-2xl animate-slideInRight">
            {/* Header */}
            <div className="flex items-center justify-between p-6 border-b border-gray-200">
              <div className="flex items-center gap-2">
                <div className="w-10 h-10 bg-gradient-to-r from-green-500 to-emerald-600 rounded-lg flex items-center justify-center">
                  <span className="text-white font-bold text-xl">AG</span>
                </div>
                <span className="text-xl font-bold bg-gradient-to-r from-green-600 to-emerald-600 bg-clip-text text-transparent">
                  Apply Ghana
                </span>
              </div>
              <button
                onClick={() => setMobileOpen(false)}
                className="p-2 rounded-lg hover:bg-gray-100 transition-colors"
              >
                <FiX className="w-5 h-5 text-gray-600" />
              </button>
            </div>
            
            {/* Navigation Links */}
            <nav className="flex-1 px-4 py-6 space-y-2 overflow-y-auto">
              {navLinks.map((link) => {
                const isActive = router.pathname.includes(link.href.split('/').pop()) || 
                                (router.pathname === `/my-admin/${id}/dashboard` && link.label === "Dashboard");
                const Icon = link.icon;
                
                return (
                  <Link
                    key={link.href}
                    href={link.href}
                    onClick={() => setMobileOpen(false)}
                    className={`flex items-center gap-3 px-4 py-3 rounded-xl transition-all duration-200 ${
                      isActive
                        ? "bg-gradient-to-r from-green-500 to-emerald-600 text-white shadow-md"
                        : "text-gray-700 hover:bg-gray-100"
                    }`}
                  >
                    <Icon className={`w-5 h-5 ${isActive ? "text-white" : "text-gray-500"}`} />
                    <span className="font-medium">{link.label}</span>
                  </Link>
                );
              })}
            </nav>
            
            {/* Admin Profile Section */}
            {!isLoading && adminDetails && (
              <div className="border-t border-gray-200 p-4">
                <button
                  onClick={() => {
                    setMobileOpen(false);
                    setShowSignOutModal(true);
                  }}
                  className="w-full group"
                >
                  <div className="flex items-center gap-3 p-2 rounded-xl transition-all duration-200 hover:bg-gray-100">
                    {adminDetails.photoURL ? (
                      <img
                        src={adminDetails.photoURL}
                        alt={adminDetails.displayName}
                        className="w-10 h-10 rounded-full object-cover ring-2 ring-green-500 ring-offset-2"
                      />
                    ) : (
                      <div className="w-10 h-10 bg-gradient-to-r from-green-500 to-emerald-600 rounded-full flex items-center justify-center">
                        <FiUser className="w-5 h-5 text-white" />
                      </div>
                    )}
                    <div className="flex-1 text-left">
                      <p className="text-sm font-semibold text-gray-900 truncate">
                        {adminDetails.displayName || "Admin User"}
                      </p>
                      <p className="text-xs text-gray-500 truncate flex items-center gap-1">
                        <FiMail className="w-3 h-3" />
                        {adminDetails.email || "admin@example.com"}
                      </p>
                    </div>
                    <FiLogOut className="w-4 h-4 text-gray-400 group-hover:text-red-500 transition-colors" />
                  </div>
                </button>
              </div>
            )}
          </aside>
        </div>
      )}
    </>
  );

  return (
    <>
      <ToastContainer position="top-right" autoClose={3000} />
      <SignOutModal />
      
      <div className="min-h-screen bg-green-100">
        {/* Desktop Sidebar */}
        <DesktopSidebar />
        
        {/* Main Content */}
        <main
          className={`transition-all duration-300 ease-in-out ${
            isMinimized ? "md:ml-20" : "md:ml-64"
          } pb-20 md:pb-0`}
        >
          <div className="p-4 md:p-8">
            {children}
          </div>
        </main>
        
        {/* Mobile Bottom Navigation */}
        <MobileBottomNav />
        
        {/* Mobile Sidebar */}
        <MobileSidebar />
      </div>

      {/* Add custom animations */}
      <style jsx>{`
        @keyframes fadeIn {
          from {
            opacity: 0;
          }
          to {
            opacity: 1;
          }
        }
        
        @keyframes slideUp {
          from {
            opacity: 0;
            transform: translateY(20px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }
        
        @keyframes slideInRight {
          from {
            transform: translateX(-100%);
          }
          to {
            transform: translateX(0);
          }
        }
        
        .animate-fadeIn {
          animation: fadeIn 0.2s ease-out;
        }
        
        .animate-slideUp {
          animation: slideUp 0.3s ease-out;
        }
        
        .animate-slideInRight {
          animation: slideInRight 0.3s ease-out;
        }
      `}</style>
    </>
  );
};

export default Sidebar;