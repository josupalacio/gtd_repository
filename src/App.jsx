import React, { useState } from "react";
import { BrowserRouter } from "react-router-dom";
import { ThemeProvider } from "styled-components";
import { Light, Dark } from "./styles/Themes";
import { Routes, Route } from "react-router-dom"
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

export const ThemeContext = React.createContext(null);

function App() {
  const [theme, setTheme] = useState("light");
  const themeStyle = theme === "light" ? Light : Dark;
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const [userLogin, setUserLogin] = useState(false); // Cambia a false en producción

  if (!userLogin) {
    return <Login setUserLogin={setUserLogin} />;
  }

  return (
    <ThemeContext.Provider value={{ setTheme, theme }}>
      <ThemeProvider theme={themeStyle}>
        <BrowserRouter>
          <Container className={sidebarOpen ? "sidebarState active" : ""}>
            <Sidebar sidebarOpen={sidebarOpen} setSidebarOpen={setSidebarOpen} />
            <MainContent>
              {/* Aquí van tus rutas */}
              <Routes>
                <Route path="/" element={<Dashboard />} />
                <Route path="/chatbot" element={<ChatBot />} />
                <Route path="/schedule" element={<Schedule />} />
                <Route path="/search" element={<Search />} />
                <Route path="/analytics" element={<Analytics />} />
                <Route path="/files" element={<Files />} />
                <Route path="/settings" element={<Settings />} />
                <Route path="/myaccount" element={<MyAccount />} />
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