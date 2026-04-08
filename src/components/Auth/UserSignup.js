import React, { useState } from 'react';
import { useRouter } from 'next/router';
import Image from 'next/image';
import { auth, db, storage } from '../../firebase.config';
import { createUserWithEmailAndPassword, updateProfile, sendEmailVerification, signOut } from "firebase/auth";
import { setDoc, doc } from 'firebase/firestore';
import { ref, uploadBytesResumable, getDownloadURL } from "firebase/storage";
import { toast } from 'react-toastify';
import Link from 'next/link';

export default function UserSignup() {
  const router = useRouter();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [username, setUsername] = useState('');
  const [phoneNumber, setPhoneNumber] = useState('');
  const [occupation, setOccupation] = useState('');
  const [address, setAddress] = useState('');
  const [referralCode, setReferralCode] = useState('');
  const [loading, setLoading] = useState(false);
  const [selectedImage, setSelectedImage] = useState(null);

  const handleImageChange = (e) => {
      const file = e.target.files[0];
      setSelectedImage(file);
  };

  const uploadImageToFirebase = async (imageFile, userId) => {
      if (!imageFile) return null;
      
      const storageRef = ref(storage, `profile_images/${userId}/${imageFile.name}`);
      const uploadTask = uploadBytesResumable(storageRef, imageFile);

      return new Promise((resolve, reject) => {
          uploadTask.on(
              "state_changed",
              null,
              (error) => reject(error),
              async () => {
                  const downloadURL = await getDownloadURL(uploadTask.snapshot.ref);
                  resolve(downloadURL);
              }
          );
      });
  };

  const handleSignUp = async (e) => {
      e.preventDefault();
      if (password !== confirmPassword) {
          toast.error("Passwords do not match");
          return;
      }

      setLoading(true);
      try {
          const userCredential = await createUserWithEmailAndPassword(auth, email, password);
          const user = userCredential.user;
          
          // Upload image to Firebase Storage
          const imageUrl = selectedImage ? await uploadImageToFirebase(selectedImage, user.uid) : null;

          // Update user profile
          await updateProfile(user, {
              displayName: username,
              photoURL: imageUrl,
          });

          // Store user data in Firestore
          await setDoc(doc(db, 'users', user.uid), {
              uid: user.uid,
              displayName: username,
              email,
              photoURL: imageUrl,
              address,
              phoneNumber,
              occupation,
              userType: "super admin",
              referralCode,
              createdAt: new Date().toISOString(),
          });

          setLoading(false);
          await sendEmailVerification(user);
          toast.success("You signed up successfully");

          await signOut(auth);
          router.push('/auth/signin');
      } catch (error) {
          setLoading(false);
          toast.error("Something went wrong");
          console.error("Signup Error:", error);
      }
  };


  return (
    <div className="flex min-h-screen items-center justify-center px-4 sm:px-6 lg:px-8">
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
          <h2 className="text-2xl font-bold text-gray-900 text-center mb-6">Sign up with email</h2>
          
          <div className="mb-4 flex items-center">
            <input type="checkbox" id="offers" className="mr-2" />
            <label htmlFor="offers" className="text-sm text-gray-600">
              Send me special offers, personalized recommendations, and learning tips.
            </label>
          </div>
          
          <form onSubmit={handleSignUp} className="space-y-4">
            <input
              type="text"
              value={username} 
              onChange={(e) => setUsername(e.target.value)} 
              required
              placeholder="Full name"
              className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#1072e1] focus:outline-none"
            />
            <input
              type="email"
              value={email} 
              onChange={(e) => setEmail(e.target.value)} 
              required
              placeholder="Email"
              className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#1072e1] focus:outline-none"
            />
            <input
              type="tel" 
              value={phoneNumber} 
              onChange={(e) => setPhoneNumber(e.target.value)} 
              placeholder="Phone Number"
              className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#1072e1] focus:outline-none"
            />
            <input
              type="text" 
              value={address} 
              onChange={(e) => setAddress(e.target.value)} 
              placeholder="Address"
              required
              className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#1072e1] focus:outline-none"
            />
            <input
              type="password" 
              value={password} 
              onChange={(e) => setPassword(e.target.value)} 
              placeholder="Password"
              required
              className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#1072e1] focus:outline-none"
            />
            <input
              type="password" 
              value={confirmPassword} 
              onChange={(e) => setConfirmPassword(e.target.value)} 
              placeholder="Confirm Password"
              required
              className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#1072e1] focus:outline-none"
            />
            <div>
                <label className="block text-sm mb-2">Profile Picture</label>
                <input 
                    type="file" 
                    accept="image/*" 
                    onChange={handleImageChange} 
                    className="block w-full text-sm text-gray-500 file:mr-4 file:py-2 file:px-4 file:rounded-lg file:border-0 file:text-sm file:font-semibold file:bg-green-500 file:text-white hover:file:bg-blue-700"
                />
            </div>
            <button type="submit" className="cursor-pointer w-full bg-gradient-to-r from-green-400 to-green-600 hover:bg-purple-700 text-white py-3 rounded-lg flex items-center justify-center font-semibold transition">
              <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                <path strokeLinecap="round" strokeLinejoin="round" d="M16 12H8m8 0l-4-4m4 4l-4 4"></path>
              </svg>
              {loading ? "Signing Up..." : "Sign up"}
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
            Already have an account? <Link href="/auth/signin" className="text-green-500 hover:underline font-semibold">Sign In</Link>
          </p>
        </div>
      </div>
    </div>
  );
}
