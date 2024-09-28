import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";



const firebaseConfig = {
  apiKey: "AIzaSyBn3qPmXTC6yESNbTsq6BLwCun6OCsj2Xg",
  authDomain: "admin-27ec9.firebaseapp.com",
  projectId: "admin-27ec9",
  storageBucket: "admin-27ec9.appspot.com",
  messagingSenderId: "298732252938",
  appId: "1:298732252938:web:cb34dab8207f58c89294f3",
  measurementId: "G-35RLCLXQFR"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const auth = getAuth(app);

export { auth };