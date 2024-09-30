import { initializeApp, getApps, getApp } from 'firebase/app';
import { getMessaging } from 'firebase/messaging';

// Your Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyByeWGjAQM29OyEyVVM6qS7f_gJbvF6E7Q",
  authDomain: "e-mazed-d4b22.firebaseapp.com",
  projectId: "e-mazed-d4b22",
  storageBucket: "e-mazed-d4b22.appspot.com",
  messagingSenderId: "868607300978",
  appId: "1:868607300978:web:6ad4c7d0fbc04e70e579eb"
};

// Initialize Firebase app
const app = !getApps().length ? initializeApp(firebaseConfig) : getApp();

// Retrieve firebase messaging instance
const messaging = getMessaging(app);

export { messaging };
