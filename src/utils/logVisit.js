import { db } from '@/firebase.config';  // Assuming Firebase is already configured here
import { collection, addDoc, query, where, getDocs, serverTimestamp, Timestamp } from 'firebase/firestore';
import { v4 as uuidv4 } from 'uuid';

// Function to generate a unique session ID (using browser's localStorage)
function getSessionId() {
  let sessionId = localStorage.getItem('visitor_session_id');
  if (!sessionId) {
    sessionId = uuidv4(); // Use uuidv4 for unique session ID generation
    localStorage.setItem('visitor_session_id', sessionId);
  }
  return sessionId;
}

// Check if an IP has already logged a visit today
async function isDuplicateVisit(ipAddress) {
  const today = new Date();
  const startOfDay = new Date(today.setHours(0, 0, 0, 0)); // Start of today
  const endOfDay = new Date(today.setHours(23, 59, 59, 999)); // End of today

  const q = query(
    collection(db, 'visits'),
    where('ipAddress', '==', ipAddress),
    where('timestamp', '>=', Timestamp.fromDate(startOfDay)),
    where('timestamp', '<=', Timestamp.fromDate(endOfDay))
  );

  const querySnapshot = await getDocs(q);
  return querySnapshot.size > 0; // True if duplicate visit exists
}

// Function to log the visit to Firestore
export async function logVisit(pageUrl, location) {
  const sessionId = getSessionId();

  // If a visit from the same IP already exists today, skip logging
  const isDuplicate = await isDuplicateVisit(location.ipAddress);
  if (isDuplicate) {
    console.log('Duplicate visit detected. Visit not logged.');
    return; // Exit if duplicate
  }

  try {
    // Add visit log to Firestore
    await addDoc(collection(db, 'visits'), {
      timestamp: serverTimestamp(), // Use Firebase server timestamp
      sessionId: sessionId,
      ipAddress: location.ipAddress,
      pageUrl: pageUrl,
      location: {
        country: location.country,
        city: location.city,
        countryCode: location.countryCode,
        flagUrl: location.flagUrl
      },
      userAgent: navigator.userAgent, // Optionally include browser info
    });
    console.log('Visit logged successfully');
  } catch (error) {
    console.error('Error logging visit:', error);
  }
}
