import React, { useState, useEffect } from "react";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import { ThemeProvider } from "styled-components";
import { Light, Dark } from "./styles/Themes";
import Sidebar from "./components/Sidebar";
import Dashboard from "./pages/Dashboard";
import ChatBot from "./pages/Chatbot";
import Schedule from "./pages/Schedule";
import Search from "./pages/Search";
import Analytics from "./pages/Analytics";
import Files from "./pages/Files";
import Settings from "./pages/Settings";
import MyAccount from "./pages/MyAccount";
import Login from "./pages/Login";
import styled from "styled-components";

// Firebase imports
import { auth, ManageAccount } from "./firebaseconnect"; // Importamos auth Y ManageAccount
import { onAuthStateChanged } from "firebase/auth";

export const ThemeContext = React.createContext(null);

function App() {
  const [theme, setTheme] = useState("light");
  const themeStyle = theme === "light" ? Light : Dark;
  const [sidebarOpen, setSidebarOpen] = useState(true);
  // ELIMINAMOS EL ESTADO LOCAL userLogin - ¡ya no lo necesitamos!
  // const [userLogin, setUserLogin] = useState(true); // <-- ELIMINAR esta línea


  // Estado para almacenar el usuario autenticado de firebase Y sus datos adicionales de Firestore
  const [currentUserData, setCurrentUserData] = useState(null); // Ahora almacenará { firebaseUser: User, firestoreData: { nickname: string, ... } }
  const [isAuthLoading, setIsAuthLoading] = useState(true); // Para saber si ya verificamos el estado inicial

  // Usamos useEffect para escuchar los cambios en el estado de autenticación de Firebase
  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (user) => { // Hacemos la función async
      if (user) {
        // Si hay un usuario autenticado, obtenemos sus datos adicionales de Firestore
        const accountManager = new ManageAccount();
        const firestoreData = await accountManager.getUserData(user.uid);
        // Guardamos el objeto User de Firebase Y los datos de Firestore
        setCurrentUserData({ firebaseUser: user, firestoreData: firestoreData });
      } else {
        // Si no hay usuario, establecemos el estado a null
        setCurrentUserData(null);
      }
      setIsAuthLoading(false); // Ya terminamos de verificar el estado inicial
    });

    // Limpiamos el listener cuando el componente se desmonte
    return () => unsubscribe();
  }, []); // El array vacío asegura que esto solo se ejecute una vez al montar el componente

  // Función para manejar el cierre de sesión llamando a Firebase Auth
  const handleSignOut = async () => {
    const accountManager = new ManageAccount();
    await accountManager.signOut(); // Llama al método de Firebase signOut
    // onAuthStateChanged se disparará automáticamente y pondrá currentUserData a null,
    // lo que hará que App se re-renderice y muestre el Login.
  };


  // Mientras verificamos el estado de auth, podrías mostrar una pantalla de carga
  if (isAuthLoading) {
    return <div>Cargando estado de autenticación...</div>; // O un componente de spinner
  }

  // Si después de cargar, no hay usuario autenticado (currentUserData es null), redirigimos al Login
  if (!currentUserData) {
     // ¡UNICAMENTE nos basamos en currentUserData!
     // IMPORTANTE: Tu componente Login DEBE manejar el inicio de sesión con Firebase.
     // Cuando signInWithEmailAndPassword sea exitoso en Login, onAuthStateChanged
     // aquí en App se disparará y actualizará currentUserData (incluyendo datos de firestore),
     // lo que hará que App se re-renderice y entre al bloque principal de la aplicación.
    return <Login />; // No pasamos setUserLogin aquí, el Login solo necesita hacer el auth con firebase
  }

  // Si hay un usuario autenticado (currentUserData NO es null), mostramos la aplicación principal
  return (
    <ThemeContext.Provider value={{ setTheme, theme }}>
      <ThemeProvider theme={themeStyle}>
        <BrowserRouter>
          <Container className={sidebarOpen ? "sidebarState active" : ""}>
            {/* PASAMOS el currentUserData (objeto combinado) al Sidebar como prop 'user' */}
            {/* PASAMOS la función handleSignOut al Sidebar como prop 'onSignOut' */}
            {/* Eliminamos la prop setUserLogin */}
            <Sidebar
              sidebarOpen={sidebarOpen}
              setSidebarOpen={setSidebarOpen}
              user={currentUserData} // <-- ¡Aquí pasamos el objeto combinado!
              onSignOut={handleSignOut} // <-- ¡Aquí pasamos la función para cerrar sesión!
            />
            <MainContent>
              <Routes>
                {/* Rutas protegidas que solo se ven si currentUserData no es null */}
                <Route path="/" element={<Dashboard />} />
                <Route path="/chatbot" element={<ChatBot />} />
                <Route path="/schedule" element={<Schedule />} />
                <Route path="/search" element={<Search />} />
                <Route path="/analytics" element={<Analytics />} />
                <Route path="/files" element={<Files />} />
                <Route path="/settings" element={<Settings />} />
                <Route path="/myaccount" element={<MyAccount />} />
                 {/* Agregamos Navigate para redirigir si el usuario va a una ruta no definida mientras está logueado */}
                <Route path="*" element={<Navigate to="/" replace />} />
              </Routes>
            </MainContent>
          </Container>
        </BrowserRouter>
      </ThemeProvider>
    </ThemeContext.Provider>
  );
}

const Container = styled.div`
  display: grid;
  grid-template-columns: 90px auto;
  background: ${({ theme }) => theme.bgtotal};
  transition: all 0.3s;
  &.active {
    grid-template-columns: 300px auto;
  }
  color: ${({ theme }) => theme.text};
`;

const MainContent = styled.div`
  padding: 2rem;
  height: 100vh;
  overflow-y: auto;
`;

export default App;