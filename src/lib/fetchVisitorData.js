import { db } from '@/lib/firebase.config';
import { collection, query, where, getDocs, serverTimestamp } from 'firebase/firestore';

export async function fetchVisitorData(startDate, endDate, filters = {}) {
  const visitsCollection = collection(db, 'visits');
  const q = query(visitsCollection, 
    where('timestamp', '>=', startDate),
    where('timestamp', '<=', endDate)
  );

  if (filters?.country) {
    q.where('location.country', '==', filters.country);
  }

  if (filters?.device) {
    q.where('userAgent', 'array-contains', filters.device);
  }

  const querySnapshot = await getDocs(q);
  const visits = [];

  querySnapshot.forEach(doc => {
    visits.push(doc.data());
  });

  return visits;
}
