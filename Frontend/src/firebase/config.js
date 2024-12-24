import { initializeApp } from "firebase/app";
import { getAuth, GoogleAuthProvider, GithubAuthProvider, browserLocalPersistence, setPersistence } from "firebase/auth";

const firebaseConfig = {
  apiKey: "AIzaSyAoeZHm-azcBvHdEFEfnKYibK6bYHyXqLU",
  authDomain: "stockify-6e2b1.firebaseapp.com",
  projectId: "stockify-6e2b1",
  storageBucket: "stockify-6e2b1.firebasestorage.app",
  messagingSenderId: "1051195772160",
  appId: "1:1051195772160:web:b2b7ea0d56cf988baf37e5",
  measurementId: "G-WFZQQV6LY6"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const auth = getAuth(app);

// Configure Providers
const googleProvider = new GoogleAuthProvider();
const githubProvider = new GithubAuthProvider();

// Configure Google Provider settings
googleProvider.setCustomParameters({
  prompt: 'select_account',
  access_type: 'offline'
});

// Set auth persistence
setPersistence(auth, browserLocalPersistence)
  .catch((error) => {
    console.error("Error setting persistence:", error);
  });

export { auth, googleProvider, githubProvider };
