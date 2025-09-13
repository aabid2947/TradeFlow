// Quick Firebase Test - Run this in browser console after enabling Firestore
import { collection, getDocs } from 'firebase/firestore';
import { db } from './src/config/firebase.js';

async function quickTest() {
  try {
    console.log('🔥 Testing Firestore...');
    const testRef = collection(db, 'test');
    const snapshot = await getDocs(testRef);
    console.log('✅ SUCCESS! Firestore is working');
    console.log('Documents found:', snapshot.size);
  } catch (error) {
    console.error('❌ FAILED:', error.message);
    console.error('Error code:', error.code);
  }
}

quickTest();
