// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getAnalytics } from "firebase/analytics";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: "AIzaSyCpohdwjXlOeamp8WNJq-MtaDWpt86p5z0",
  authDomain: "getting-things-done-6eea2.firebaseapp.com",
  projectId: "getting-things-done-6eea2",
  storageBucket: "getting-things-done-6eea2.firebasestorage.app",
  messagingSenderId: "205723042166",
  appId: "1:205723042166:web:1394ecf62f094062d0fa57",
  measurementId: "G-M31E7LKYY7"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const analytics = getAnalytics(app);