import { initializeApp } from 'firebase/app';
import { getAuth } from 'firebase/auth';
import { getAnalytics } from 'firebase/analytics';

 const firebaseConfig = {
     apiKey: "AIzaSyDQSnoYi1n1FuOhfwNUgFPzjSn4OS5sSvk",
     authDomain: "meet-now-d4f84.firebaseapp.com",
     projectId: "meet-now-d4f84",
    storageBucket: "meet-now-d4f84.appspot.com",
     messagingSenderId: "23120131114",
     appId: "1:23120131114:web:7c33126371393bc9933f53",
    measurementId: "G-P8NVJWDHZD"
   };

// Initialize Firebase
const app = initializeApp(firebaseConfig);
export const auth = getAuth(app);
export const analytics = getAnalytics(app);

console.log('Firebase initialized with config:', firebaseConfig);

// import { initializeApp } from 'firebase/app';
// import { getAuth, onAuthStateChanged, User } from 'firebase/auth';
// import { getAnalytics } from 'firebase/analytics';

// const firebaseConfig = {
//   apiKey: import.meta.env.VITE_FIREBASE_API_KEY,
//   authDomain: import.meta.env.VITE_FIREBASE_AUTH_DOMAIN,
//   projectId: import.meta.env.VITE_FIREBASE_PROJECT_ID,
//   storageBucket: import.meta.env.VITE_FIREBASE_STORAGE_BUCKET,
//   messagingSenderId: import.meta.env.VITE_FIREBASE_MESSAGING_SENDER_ID,
//   appId: import.meta.env.VITE_FIREBASE_APP_ID,
//   measurementId: import.meta.env.VITE_FIREBASE_MEASUREMENT_ID
// };

// const app = initializeApp(firebaseConfig);
// export const auth = getAuth(app);
// export const analytics = getAnalytics(app);

// export const persistAuthState = (callback: (user: User | null) => void) => {
//   onAuthStateChanged(auth, (user) => {
//     if (user) {
//       console.log('User is signed in:', user);
//       callback(user);
//     } else {
//       console.log('User is signed out');
//       callback(null);
//     }
//   });
// };
