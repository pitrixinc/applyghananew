import { useState, useEffect } from 'react';
import { useRouter } from 'next/router'
import { signInWithEmailAndPassword, onAuthStateChanged, signOut } from "firebase/auth";
import {getDoc, doc} from 'firebase/firestore';
import { auth, db } from '../../firebase.config';
import { toast } from 'react-toastify';
import Link from 'next/link';
import Image from 'next/image';

export default function UserSignin() {
  const router = useRouter()
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);

  const signIn = async (e) => {
      e.preventDefault();
      setLoading(true);

      const userCredential = await signInWithEmailAndPassword(auth, email, password);
      const user = userCredential.user;

      // Check if the user's email is verified
    if (!user.emailVerified) {
      await signOut(auth);  // Make sure user is signed out
     // navigation.navigate('Signup');
      toast.warning(
        'Email Not Verified, A verification email has been sent to your email, Please verify your email before logging in.'
      );
      setLoading(false); // Stop loading here as well
      return; // Stop any further code execution, including navigation
    }

      try {
        const userCredential = await signInWithEmailAndPassword(auth, email, password);
        const user = userCredential.user;
        // Fetch user data from Firestore
        const userDoc = await getDoc(doc(db, "users", user.uid));
        if (userDoc.exists()) {
          const userData = userDoc.data();
          // Redirect to the appropriate page based on user type
          let returnUrl;
          if (userData.userType === 'super admin') {
            returnUrl = `/my-admin/${user.uid}/dashboard`;
          } else if (userData.userType === 'individual') {
            returnUrl = `/per/${user.uid}/dashboard`;
          } else {
            returnUrl = '/auth/signin';
          }
          setLoading(false);
          toast.success('Signed in successfully');
          router.push(returnUrl);
        } else {
          setLoading(false);
          toast.error('User data not found');
        }
      } catch (error) {
        setLoading(false);
        toast.error('Failed to sign in: ' + error.message);
      }
    };

  return (
    <div className="flex min-h-screen items-center justify-center  px-4 sm:px-6 lg:px-8">
      <div className="max-w-4xl w-full bg-white shadow-lg rounded-lg flex flex-col md:flex-row overflow-hidden">
        {/* Left Side - Illustration */}
        <div className="hidden md:flex items-center justify-center bg-gray-100 p-8 md:w-1/2">
          <div className="relative w-full h-full">
            <Image
              src="/images/signup.webp"
              alt="Illustration"
              layout="fill"
              objectFit="contain"
            />
          </div>
        </div>
        
        {/* Right Side - Form */}
        <div className="w-full md:w-1/2 p-8 flex flex-col justify-center">
          <h2 className="text-2xl font-bold text-gray-900 text-center mb-6">Sign in with email</h2>
          {/*
          <div className="mb-4 flex items-center">
            <input type="checkbox" id="offers" className="mr-2" />
            <label htmlFor="offers" className="text-sm text-gray-600">
              Send me special offers, personalized recommendations, and learning tips.
            </label>
          </div>
          */}
          <form onSubmit={signIn} className="space-y-4">
            <input
              type="email"
              placeholder="Email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#1072e1] focus:outline-none"
            />
            <input
              type="password"
              placeholder="Password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
              className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#1072e1] focus:outline-none"
            />
            <button  type="submit" className="cursor-pointer w-full bg-gradient-to-r from-green-400 to-green-600 hover:bg-purple-700 text-white py-3 rounded-lg flex items-center justify-center font-semibold transition">
              <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                <path strokeLinecap="round" strokeLinejoin="round" d="M16 12H8m8 0l-4-4m4 4l-4 4"></path>
              </svg>
              {loading ? "Signing In..." : "Sign In"}
            </button>
          </form>
          
          {/** 
          <div className="my-6 flex items-center">
            <div className="flex-1 border-t border-gray-300"></div>
            <span className="px-3 text-sm text-gray-500">Other sign up options</span>
            <div className="flex-1 border-t border-gray-300"></div>
          </div>
          
          <div className="flex justify-center space-x-4">
            <button className="border border-gray-300 rounded-lg p-3 hover:bg-gray-100">
              <Image src="/google-icon.svg" width={24} height={24} alt="Google" />
            </button>
            <button className="border border-gray-300 rounded-lg p-3 hover:bg-gray-100">
              <Image src="/facebook-icon.svg" width={24} height={24} alt="Facebook" />
            </button>
            <button className="border border-gray-300 rounded-lg p-3 hover:bg-gray-100">
              <Image src="/apple-icon.svg" width={24} height={24} alt="Apple" />
            </button>
          </div>
          **/}
          
          <p className="text-xs text-gray-500 text-center mt-4">
            By signing up, you agree to our <a href="#" className="text-green-500 hover:underline">Terms of Use</a> and <a href="#" className="text-green-500 hover:underline">Privacy Policy</a>.
          </p>
          
          <p className="text-sm text-gray-700 text-center mt-4">
            Don&apos;t have an account? <Link href="/auth/signup" className="text-green-500 hover:underline font-semibold">Sign Up</Link>
          </p>
        </div>
      </div>
    </div>
  );
}
