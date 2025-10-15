// database/firebase.js
import { initializeApp, getApps, getApp } from "firebase/app";
import { getDatabase } from "firebase/database";
import {
  initializeAuth,
  getReactNativePersistence,
} from 'firebase/auth';
import AsyncStorage from '@react-native-async-storage/async-storage';

// Indsæt din egen config her fra Firebase Console
const firebaseConfig = {
  apiKey: "AIzaSyDQA8RR_aNSqoL4tpP9Gs7rs80186BMSP0",
  authDomain: "queless-e20e8.firebaseapp.com",
  databaseURL: "https://queless-e20e8-default-rtdb.europe-west1.firebasedatabase.app",
  projectId: "queless-e20e8",
  storageBucket: "queless-e20e8.firebasestorage.app",
  messagingSenderId: "275644072675",
  appId: "1:275644072675:web:c9e6c1b92a102b19dbfbd6"
  };



// Init kun én gang
export const firebaseApp = getApps().length ? getApp() : initializeApp(firebaseConfig);

// Brug RTDB-URL’en fra Realtime Database (Belgium = europe-west1)
export const rtdb = getDatabase(
  firebaseApp,
  "https://queless-e20e8-default-rtdb.europe-west1.firebasedatabase.app/"
);
//brugt til at gemme login/authentificering
const auth = initializeAuth(firebaseApp, {
  persistence: getReactNativePersistence(AsyncStorage),
});

export { auth };

