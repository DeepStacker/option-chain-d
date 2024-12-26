import { initializeApp } from 'firebase/app';
import { 
  getAuth, 
  GoogleAuthProvider, 
  signInWithPopup,
  onAuthStateChanged
} from 'firebase/auth';

// Your web app's Firebase configuration
export const firebaseConfig = {
  apiKey: "AIzaSyAoeZHm-azcBvHdEFEfnKYibK6bYHyXqLU",
  authDomain: "stockify-6e2b1.firebaseapp.com",
  projectId: "stockify-6e2b1",
  storageBucket: "stockify-6e2b1.appspot.com",
  messagingSenderId: "1051195772160",
  appId: "1:1051195772160:web:b2b7ea0d56cf988baf37e5",
  measurementId: "G-WFZQQV6LY6"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const auth = getAuth(app);
const googleProvider = new GoogleAuthProvider();

// Handle Google Sign In
export const signInWithGoogle = async () => {
  try {
    const result = await signInWithPopup(auth, googleProvider);
    const user = result.user;
    const token = await user.getIdToken();
    localStorage.setItem('authToken', token);
    return user;
  } catch (error) {
    console.error('Error during Google sign in:', error);
    throw error;
  }
};

// Listen to auth state changes
export const listenToAuthChanges = (callback) => {
  return onAuthStateChanged(auth, async (user) => {
    if (user) {
      try {
        const token = await user.getIdToken();
        localStorage.setItem('authToken', token);
      } catch (error) {
        console.error('Error getting user token:', error);
      }
    } else {
      localStorage.removeItem('authToken');
    }
    callback(user);
  });
};

export { auth };
export default app;
