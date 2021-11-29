import firebase from 'firebase/app';
import "firebase/firestore";
import "firebase/storage";
// Optionally import the services that you want to use
//import "firebase/auth";
//import "firebase/database";
//import "firebase/functions";

// Initialize Firebase
const firebaseConfig = {
  apiKey: "AIzaSyCc1EEXWw4ESDKFwZQYl9wUpZ9c5icWxcg",
  authDomain: "borali-tcc.firebaseapp.com",
  projectId: "borali-tcc",
  storageBucket: "borali-tcc.appspot.com",
  messagingSenderId: "337663756550",
  appId: "1:337663756550:web:6c6d6fb5107a95068b3687",
  measurementId: "G-8KR2NML03Z"
};

firebase.initializeApp(firebaseConfig);
if (!firebase.apps.length) {
   firebase.initializeApp({});
} else {
   firebase.app(); // if already initialized, use that one
}

const database = firebase.firestore();
export default database;