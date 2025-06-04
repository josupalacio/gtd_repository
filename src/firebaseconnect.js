// firebaseconnect.jsx
import { initializeApp } from "firebase/app";
import { getAnalytics } from "firebase/analytics";
// Importamos getDoc para leer documentos
import { getFirestore, doc, setDoc, getDoc } from "firebase/firestore";
import { getAuth, createUserWithEmailAndPassword, signInWithEmailAndPassword, signOut, onAuthStateChanged } from "firebase/auth";


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
export const auth = getAuth();
export const db = getFirestore(app);
export class ManageAccount {
  async register(email, password, nickname) { 
    try {
      const userCredential = await createUserWithEmailAndPassword(auth, email, password);
      const user = userCredential.user;
      // Guardamos información inicial en Firestore
      await setDoc(doc(db, "users", user.uid), {
        email: user.email,
        nickname: nickname || user.email.split('@')[0] // Guardar nickname, o usar parte del email como fallback
       });
      return { success: true, user };
    } catch (error) {let friendlyErrorMessage = "";
    switch (error.code) {
        case 'auth/wrong-password':
            friendlyErrorMessage = 'La contraseña es incorrecta.';
            break;
        case 'auth/invalid-email':
            friendlyErrorMessage = 'El formato del correo electrónico no es válido.';
            break;
        case 'auth/invalid-credential':
            friendlyErrorMessage = 'Credenciales inválidas. Por favor, verifica tu correo y contraseña.';
            break;
        case 'auth/user-disabled':
            friendlyErrorMessage = 'Tu cuenta ha sido deshabilitada.';
            break;
        // Puedes añadir más casos si lo necesitas
        default:
            console.error("Código de error de Firebase no mapeado:", error.code || error.message);
            friendlyErrorMessage = error.message || 'Ocurrió un error inesperado al intentar iniciar sesión. Intenta de nuevo.';
            break;
    }

    Swal.fire({
        icon: 'error',
        title: 'Error de Inicio de Sesión',
        text: friendlyErrorMessage,
    });
    }
  }

  async authenticate(email, password) {
    try {
      await signInWithEmailAndPassword(auth, email, password);
      return { success: true }; // onAuthStateChanged en App.jsx detectará el login
    } catch (error) {
      console.error("Error authenticating:", error.message);
      return { success: false, message: error.message };
    }
  }

  async signOut() {
    try {
      await signOut(auth);
      return { success: true }; // onAuthStateChanged en App.jsx detectará el logout
    } catch (error) {
      console.error("Error signing out:", error.message);
      return { success: false, message: error.message };
    }
  }

  async saveData(collection, documentId, data){
    try {
      await setDoc(doc(db, collection, documentId), data);
      return {success : true };
    } catch (error) {
      console.error("Error al guardar datos:", error.message);
      return {success : false, message: error.message};
    }
  }

  // Función para obtener datos adicionales del usuario desde Firestore
    async getUserData(uid) {
    if (!uid) return null;
    try {
      const userDocRef = doc(db, "users", uid);
      const userDocSnap = await getDoc(userDocRef);

      if (userDocSnap.exists()) {
        const data = userDocSnap.data();
        // Devuelve siempre los campos, aunque estén vacíos
        return {
          apellido: data.apellido || "",
          mail: data.mail || "",
          nickname: data.nickname || "",
          correo: data.correo || "",
        };
      } else {
        console.warn("No user data found in Firestore for uid:", uid);
        return null;
      }
    } catch (error) {
      console.error("Error fetching user data:", error.message);
      return null;
    }
  }
}
