import firebase from 'firebase/app';
import "firebase/firestore";
import "firebase/storage";
// Optionally import the services that you want to use
//import "firebase/auth";
//import "firebase/database";
//import "firebase/functions";

// Initialize Firebase
const firebaseConfig = {
    apiKey: "AIzaSyBOWQFi_1gaouixo1-NwA2MTvOClWulszo",
    authDomain: "borali-87b02.firebaseapp.com",
    databaseURL: "https://borali-87b02-default-rtdb.firebaseio.com",
    projectId: "borali-87b02",
    storageBucket: "borali-87b02.appspot.com",
    messagingSenderId: "685164751648",
    appId: "1:685164751648:web:86646e6e14d6a0cb108545",
    measurementId: "G-D0GHG2R9K0"
  };

firebase.initializeApp(firebaseConfig);
if (!firebase.apps.length) {
    firebase.initializeApp({});
 }else {
    firebase.app(); // if already initialized, use that one
 }

const database = firebase.firestore();
export default database;