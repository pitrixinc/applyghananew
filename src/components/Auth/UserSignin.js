import { useState, useEffect } from 'react';
import { useRouter } from 'next/router';
import { 
  signInWithEmailAndPassword, 
  onAuthStateChanged, 
  signOut,
  sendEmailVerification,
  sendPasswordResetEmail 
} from "firebase/auth";
import { getDoc, doc } from 'firebase/firestore';
import { auth, db } from '../../firebase.config';
import { toast } from 'react-toastify';
import Link from 'next/link';
import Image from 'next/image';

export default function UserSignin() {
  const router = useRouter();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [showResendVerification, setShowResendVerification] = useState(false);
  const [unverifiedEmail, setUnverifiedEmail] = useState('');
  const [resendLoading, setResendLoading] = useState(false);
  const [showForgotPassword, setShowForgotPassword] = useState(false);
  const [resetEmail, setResetEmail] = useState('');
  const [resetLoading, setResetLoading] = useState(false);
  const [resetSuccess, setResetSuccess] = useState(false);

  // Cleanup function to prevent state updates on unmounted component
  useEffect(() => {
    let isMounted = true;
    
    return () => {
      isMounted = false;
    };
  }, []);

  const signIn = async (e) => {
    e.preventDefault();
    
    // Reset states
    setShowResendVerification(false);
    setLoading(true);

    try {
      // Attempt to sign in
      const userCredential = await signInWithEmailAndPassword(auth, email, password);
      const user = userCredential.user;

      // Check if email is verified
      if (!user.emailVerified) {
        await signOut(auth);
        setUnverifiedEmail(email);
        setShowResendVerification(true);
        setLoading(false);
        toast.warning(
          'Please verify your email before logging in. Check your inbox for the verification link.'
        );
        return;
      }

      // Fetch user data from Firestore
      const userDoc = await getDoc(doc(db, "users", user.uid));
      
      if (userDoc.exists()) {
        const userData = userDoc.data();
        
        // Redirect based on user type
        let returnUrl;
        if (userData.userType === 'super admin') {
          returnUrl = `/my-admin/${user.uid}/dashboard`;
        } else if (userData.userType === 'individual') {
          returnUrl = `/per/${user.uid}/dashboard`;
        } else {
          returnUrl = '/auth/signin';
        }
        
        setLoading(false);
        toast.success('Signed in successfully!');
        router.push(returnUrl);
      } else {
        setLoading(false);
        toast.error('User profile not found. Please contact support.');
        await signOut(auth);
      }
    } catch (error) {
      setLoading(false);
      
      // Handle specific Firebase auth errors
      switch (error.code) {
        case 'auth/user-not-found':
          toast.error('No account found with this email address.');
          break;
        case 'auth/wrong-password':
        case 'auth/invalid-credential':
          toast.error('Invalid email or password. Please try again.');
          break;
        case 'auth/invalid-email':
          toast.error('Please enter a valid email address.');
          break;
        case 'auth/too-many-requests':
          toast.error('Too many failed attempts. Please try again later.');
          break;
        case 'auth/user-disabled':
          toast.error('This account has been disabled. Please contact support.');
          break;
        default:
          toast.error('Failed to sign in. Please try again.');
          console.error('Sign in error:', error);
      }
    }
  };

  const resendVerificationEmail = async () => {
    setResendLoading(true);
    
    try {
      // Sign in temporarily to send verification email
      const userCredential = await signInWithEmailAndPassword(auth, unverifiedEmail, password);
      const user = userCredential.user;
      
      await sendEmailVerification(user);
      await signOut(auth);
      
      toast.success('Verification email resent! Please check your inbox.');
      setShowResendVerification(false);
    } catch (error) {
      console.error('Resend verification error:', error);
      toast.error('Failed to resend verification email. Please try again.');
    } finally {
      setResendLoading(false);
    }
  };

  const handleForgotPassword = async (e) => {
    e.preventDefault();
    setResetLoading(true);
    setResetSuccess(false);

    try {
      await sendPasswordResetEmail(auth, resetEmail);
      setResetSuccess(true);
      toast.success('Password reset email sent! Check your inbox.');
      
      // Don't auto-close immediately, let user see success message
    } catch (error) {
      console.error('Password reset error:', error);
      
      switch (error.code) {
        case 'auth/user-not-found':
          toast.error('No account found with this email address.');
          break;
        case 'auth/invalid-email':
          toast.error('Please enter a valid email address.');
          break;
        default:
          toast.error('Failed to send reset email. Please try again.');
      }
    } finally {
      setResetLoading(false);
    }
  };

  const closeForgotPasswordModal = () => {
    setShowForgotPassword(false);
    // Reset modal states after animation
    setTimeout(() => {
      setResetEmail('');
      setResetSuccess(false);
      setResetLoading(false);
    }, 300);
  };

  return (
    <div className="relative min-h-screen flex items-center justify-center px-4 sm:px-6 lg:px-8 bg-gradient-to-br from-green-50 via-white to-green-50">
      {/* Forgot Password Modal - Fixed overlay issue */}
      {showForgotPassword && (
        <>
          {/* Backdrop with blur effect */}
          <div 
            className="fixed inset-0 bg-black/40 backdrop-blur-sm z-40 transition-opacity duration-300"
            onClick={closeForgotPasswordModal}
          />
          
          {/* Modal Container - Centered */}
          <div className="fixed inset-0 z-50 overflow-y-auto">
            <div className="flex min-h-full items-center justify-center p-4 text-center sm:p-0">
              {/* Modal Panel with animation */}
              <div 
                className="relative transform overflow-hidden rounded-2xl bg-white text-left shadow-2xl transition-all sm:my-8 sm:w-full sm:max-w-lg animate-fadeIn"
                onClick={(e) => e.stopPropagation()}
              >
                {/* Decorative top bar */}
                <div className="h-2 bg-gradient-to-r from-green-400 to-green-600"></div>
                
                <div className="bg-white px-6 pt-6 pb-8 sm:p-8">
                  <div className="flex items-start space-x-4">
                    {/* Icon with gradient background */}
                    <div className="flex-shrink-0">
                      <div className="h-12 w-12 rounded-xl bg-gradient-to-br from-green-400 to-green-600 flex items-center justify-center shadow-lg">
                        <svg className="h-6 w-6 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
                        </svg>
                      </div>
                    </div>
                    
                    {/* Content */}
                    <div className="flex-1">
                      <h3 className="text-2xl font-bold text-gray-900 mb-2">
                        Reset your password
                      </h3>
                      <p className="text-sm text-gray-600 mb-6">
                        Enter your email address and we'll send you a secure link to reset your password.
                      </p>
                      
                      {resetSuccess ? (
                        <div className="bg-green-50 border border-green-200 rounded-xl p-6 text-center">
                          <div className="flex justify-center mb-4">
                            <div className="h-16 w-16 bg-green-100 rounded-full flex items-center justify-center">
                              <svg className="h-8 w-8 text-green-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7" />
                              </svg>
                            </div>
                          </div>
                          <h4 className="text-lg font-semibold text-gray-900 mb-2">Check your inbox!</h4>
                          <p className="text-sm text-gray-600 mb-4">
                            We've sent a password reset link to:<br />
                            <span className="font-medium text-green-600">{resetEmail}</span>
                          </p>
                          <p className="text-xs text-gray-500">
                            Didn't receive it? Check your spam folder or{' '}
                            <button 
                              onClick={() => {
                                setResetSuccess(false);
                                setResetLoading(false);
                              }}
                              className="text-green-600 hover:text-green-700 font-medium hover:underline"
                            >
                              try again
                            </button>
                          </p>
                        </div>
                      ) : (
                        <form onSubmit={handleForgotPassword} className="space-y-5">
                          <div>
                            <label htmlFor="reset-email" className="block text-sm font-medium text-gray-700 mb-2">
                              Email Address
                            </label>
                            <div className="relative">
                              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                                <svg className="h-5 w-5 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M16 12H8m8 0l-4-4m4 4l-4 4" />
                                </svg>
                              </div>
                              <input
                                id="reset-email"
                                type="email"
                                placeholder="you@example.com"
                                value={resetEmail}
                                onChange={(e) => setResetEmail(e.target.value)}
                                required
                                disabled={resetLoading}
                                className="w-full text-black pl-10 pr-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-green-500 focus:border-green-500 focus:outline-none disabled:bg-gray-50 disabled:cursor-not-allowed transition duration-200"
                                autoFocus
                              />
                            </div>
                          </div>

                          {/* Tips box */}
                          <div className="bg-blue-50 rounded-xl p-4">
                            <div className="flex items-start space-x-3">
                              <svg className="h-5 w-5 text-blue-500 mt-0.5 flex-shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                              </svg>
                              <p className="text-xs text-blue-700">
                                The reset link will expire in 1 hour for security reasons. 
                                If you don't see the email, check your spam folder.
                              </p>
                            </div>
                          </div>
                        </form>
                      )}
                    </div>
                  </div>
                </div>

                {/* Footer buttons */}
                <div className="bg-gray-50 px-6 py-4 sm:px-8 sm:flex sm:flex-row-reverse gap-3">
                  {!resetSuccess ? (
                    <>
                      <button
                        type="button"
                        onClick={handleForgotPassword}
                        disabled={resetLoading || !resetEmail}
                        className="w-full sm:w-auto inline-flex justify-center items-center px-6 py-3 border border-transparent text-base font-medium rounded-xl text-white bg-gradient-to-r from-green-500 to-green-600 hover:from-green-600 hover:to-green-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500 shadow-lg hover:shadow-xl transform hover:-translate-y-0.5 transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:translate-y-0 disabled:hover:shadow-lg"
                      >
                        {resetLoading ? (
                          <>
                            <svg className="animate-spin -ml-1 mr-2 h-5 w-5 text-white" fill="none" viewBox="0 0 24 24">
                              <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                              <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                            </svg>
                            Sending...
                          </>
                        ) : (
                          'Send Reset Link'
                        )}
                      </button>
                      <button
                        type="button"
                        onClick={closeForgotPasswordModal}
                        className="mt-3 sm:mt-0 w-full sm:w-auto inline-flex justify-center items-center px-6 py-3 border-2 border-gray-300 text-base font-medium rounded-xl text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500 transition duration-200"
                      >
                        Cancel
                      </button>
                    </>
                  ) : (
                    <button
                      type="button"
                      onClick={closeForgotPasswordModal}
                      className="w-full sm:w-auto inline-flex justify-center items-center px-6 py-3 border border-transparent text-base font-medium rounded-xl text-white bg-gradient-to-r from-green-500 to-green-600 hover:from-green-600 hover:to-green-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500 shadow-lg hover:shadow-xl transform hover:-translate-y-0.5 transition-all duration-200"
                    >
                      Close
                    </button>
                  )}
                </div>
              </div>
            </div>
          </div>
        </>
      )}

      {/* Main Login Card */}
      <div className="max-w-4xl w-full bg-white shadow-2xl rounded-2xl flex flex-col md:flex-row overflow-hidden transform hover:shadow-3xl transition-shadow duration-300">
        {/* Left Side - Illustration with gradient overlay */}
        <div className="hidden md:flex relative items-center justify-center md:w-1/2 bg-gradient-to-br from-green-600 to-green-700 p-8">
          <div className="relative z-10 text-center">
            <div className="relative w-64 h-64 mx-auto mb-6">
              <Image
                src="/images/signup.webp"
                alt="Apply Ghana - Educational Consult"
                layout="fill"
                objectFit="contain"
                priority
                className="drop-shadow-2xl"
              />
            </div>
            <h3 className="text-2xl font-bold text-white mb-2">Welcome Back!</h3>
            <p className="text-green-100">Sign in to continue your journey with us</p>
            
            {/* Decorative elements */}
            <div className="absolute top-0 left-0 w-32 h-32 bg-white/10 rounded-full -translate-x-16 -translate-y-16"></div>
            <div className="absolute bottom-0 right-0 w-40 h-40 bg-white/10 rounded-full translate-x-20 translate-y-20"></div>
          </div>
        </div>
        
        {/* Right Side - Form */}
        <div className="w-full md:w-1/2 p-8 lg:p-10">
          <div className="mb-8">
            <h2 className="text-3xl font-bold text-gray-900">Sign In</h2>
            <p className="text-gray-600 mt-2">Please enter your details to continue</p>
          </div>

          {/* Resend Verification Box - Enhanced styling */}
          {showResendVerification && (
            <div className="mb-6 p-5 bg-yellow-50 border border-yellow-200 rounded-xl animate-slideDown">
              <div className="flex items-start space-x-3">
                <div className="flex-shrink-0">
                  <div className="h-8 w-8 bg-yellow-100 rounded-full flex items-center justify-center">
                    <svg className="h-4 w-4 text-yellow-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
                    </svg>
                  </div>
                </div>
                <div className="flex-1">
                  <p className="text-sm text-yellow-800 font-medium">
                    Email not verified
                  </p>
                  <p className="text-xs text-yellow-700 mt-1 mb-3">
                    Please verify {unverifiedEmail} before logging in
                  </p>
                  <button
                    onClick={resendVerificationEmail}
                    disabled={resendLoading}
                    className="w-full bg-yellow-500 hover:bg-yellow-600 text-white py-2.5 px-4 rounded-lg font-medium text-sm transition duration-200 disabled:opacity-50 disabled:cursor-not-allowed shadow-md hover:shadow-lg transform hover:-translate-y-0.5 transition-all duration-200"
                  >
                    {resendLoading ? (
                      <span className="flex items-center justify-center">
                        <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-white" fill="none" viewBox="0 0 24 24">
                          <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                          <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                        </svg>
                        Sending...
                      </span>
                    ) : (
                      'Resend Verification Email'
                    )}
                  </button>
                </div>
              </div>
            </div>
          )}

          <form onSubmit={signIn} className="space-y-5">
            <div>
              <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-2">
                Email Address
              </label>
              <input
                id="email"
                type="email"
                placeholder="Enter your email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                disabled={loading}
                className="w-full p-3.5 border border-gray-300 rounded-xl focus:ring-2 focus:ring-green-500 focus:border-green-500 focus:outline-none disabled:bg-gray-50 disabled:cursor-not-allowed transition duration-200"
              />
            </div>
            
            <div>
              <label htmlFor="password" className="block text-sm font-medium text-gray-700 mb-2">
                Password
              </label>
              <input
                id="password"
                type="password"
                placeholder="Enter your password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
                disabled={loading}
                className="w-full p-3.5 border border-gray-300 rounded-xl focus:ring-2 focus:ring-green-500 focus:border-green-500 focus:outline-none disabled:bg-gray-50 disabled:cursor-not-allowed transition duration-200"
              />
            </div>

            <div className="flex items-center justify-end">
              <button
                type="button"
                onClick={() => setShowForgotPassword(true)}
                className="text-sm text-green-600 hover:text-green-700 font-medium hover:underline focus:outline-none transition duration-200"
              >
                Forgot password?
              </button>
            </div>

            <button 
              type="submit" 
              disabled={loading}
              className="cursor-pointer w-full bg-gradient-to-r from-green-500 to-green-600 hover:from-green-600 hover:to-green-700 text-white py-3.5 rounded-xl flex items-center justify-center font-semibold transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed shadow-lg hover:shadow-xl transform hover:-translate-y-0.5"
            >
              {loading ? (
                <span className="flex items-center justify-center">
                  <svg className="animate-spin -ml-1 mr-2 h-5 w-5 text-white" fill="none" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                  </svg>
                  Signing In...
                </span>
              ) : (
                <span className="flex items-center">
                  <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M16 12H8m8 0l-4-4m4 4l-4 4"></path>
                  </svg>
                  Sign In
                </span>
              )}
            </button>
          </form>
          
          <div className="mt-8">
            <div className="relative">
              <div className="absolute inset-0 flex items-center">
                <div className="w-full border-t border-gray-200"></div>
              </div>
              <div className="relative flex justify-center text-sm">
                <span className="px-4 bg-white text-gray-500">New to Apply Ghana?</span>
              </div>
            </div>

            <p className="text-center mt-6">
              <Link href="/auth/signup" className="text-green-600 hover:text-green-700 font-semibold hover:underline transition duration-200">
                Create an account
              </Link>
            </p>
          </div>
          
          <p className="text-xs text-gray-500 text-center mt-6">
            By signing in, you agree to our{' '}
            <Link href="/terms" className="text-green-600 hover:text-green-700 hover:underline font-medium">
              Terms of Use
            </Link>{' '}
            and{' '}
            <Link href="/privacy" className="text-green-600 hover:text-green-700 hover:underline font-medium">
              Privacy Policy
            </Link>
          </p>
        </div>
      </div>

      {/* Add custom animations */}
      <style jsx>{`
        @keyframes fadeIn {
          from {
            opacity: 0;
            transform: scale(0.95) translateY(-10px);
          }
          to {
            opacity: 1;
            transform: scale(1) translateY(0);
          }
        }
        
        @keyframes slideDown {
          from {
            opacity: 0;
            transform: translateY(-20px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }
        
        .animate-fadeIn {
          animation: fadeIn 0.3s ease-out forwards;
        }
        
        .animate-slideDown {
          animation: slideDown 0.3s ease-out forwards;
        }
      `}</style>
    </div>
  );
}