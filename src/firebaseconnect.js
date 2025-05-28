import { initializeApp } from "firebase/app";
import { getAnalytics } from "firebase/analytics";
import { getAuth, createUserWithEmailAndPassword, signInWithEmailAndPassword, signOut } from "firebase/auth";

const firebaseConfig = {
  apiKey: "AIzaSyCpohdwjXlOeamp8WNJq-MtaDWpt86p5z0",
  authDomain: "getting-things-done-6eea2.firebaseapp.com",
  projectId: "getting-things-done-6eea2",
  storageBucket: "getting-things-done-6eea2.firebasestorage.app",
  messagingSenderId: "205723042166",
  appId: "1:205723042166:web:1394ecf62f094062d0fa57",
  measurementId: "G-M31E7LKYY7"
};

const app = initializeApp(firebaseConfig);
const analytics = getAnalytics(app);
const auth = getAuth();

export class ManageAccount {
  async register(email, password) {
    try {
      await createUserWithEmailAndPassword(auth, email, password);
      return { success: true };
    } catch (error) {
      console.error(error.message);
      return { success: false, message: error.message };
    }
  }

  async authenticate(email, password) {
    try {
      await signInWithEmailAndPassword(auth, email, password);
      return { success: true };
    } catch (error) {
      console.error(error.message);
      return { success: false, message: error.message };
    }
  }

  async signOut() {
    try {
      await signOut(auth);
      return { success: true };
    } catch (error) {
      console.error(error.message);
      return { success: false, message: error.message };
    }
  }
}