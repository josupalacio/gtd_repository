import { useState } from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import SideBar from "./components/SideBar";
import Dashboard from "./pages/Dashboard";
import ChatBot from "./pages/Chatbot";
import Schedule from "./pages/Schedule";
import Search from "./pages/Search";
import Analytics from "./pages/Analytics";
import Files from "./pages/Files";
import Settings from "./pages/Settings";
import MyAccount from "./pages/MyAccount";
import Login from "./pages/Login";

const App = () => {
  const [open, setOpen] = useState(true);
  const [userLogin, setUserLogin] = useState(false);
  
  const Menus = [
    { title: "Dashboard", src: "Chart_fill", path: "/" },
    { title: "ChatBot", src: "Chat", path: "/chatbot" },
    { title: "Schedule", src: "Calendar", path: "/schedule" },
    { title: "Search", src: "Search", path: "/search" },
    { title: "Analytics", src: "Chart", path: "/analytics" },
    { title: "Files", src: "Folder", gap: true, path: "/files" },
    { title: "Setting", src: "Setting", path: "/settings" },
    { title: "My Account", src: "User", gap: true, path: "/myaccount" },
  ];

  //si el usuario esta logeado o no
  if (!(userLogin)) {
    return (
      <Login setUserLogin={setUserLogin} />
    );
  } else {
    return (
      <div className="bg-dark-purple h-screen overflow-hidden">
        <Router>
          <div className="flex h-full">
            {/* Side panel */}
            <SideBar open={open} setOpen={setOpen} Menus={Menus} />
            {/* Main panel */}
            <div className="flex-1 m-5 bg-dark-purple">
              <div className="bg-white rounded-2xl h-full " max-h-full overflow-y-auto p-5>
                <Routes>
                  {/* Buttons action */}
                  <Route path="/" element={<Dashboard />} />
                  <Route path="/chatbot" element={<ChatBot />} />
                  <Route path="/schedule" element={<Schedule />} />
                  <Route path="/search" element={<Search />} />
                  <Route path="/analytics" element={<Analytics />} />
                  <Route path="/files" element={<Files />} />
                  <Route path="/settings" element={<Settings />} />
                  <Route path="/myaccount" element={<MyAccount />} />
                </Routes>
              </div>
            </div>
          </div>
        </Router>
      </div>
    );
  }
};

export default App;