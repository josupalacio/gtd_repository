import styled from "styled-components";
import logo from "../assets/favicon.png"; // Cambia por tu logo si quieres
import { v } from "../styles/Variables";
import {
  AiOutlineLeft,
  AiOutlineHome,
  AiOutlineApartment,
  AiOutlineSetting,
  AiOutlineComment,
} from "react-icons/ai";
import {
  PiUsersFour,
} from "react-icons/pi";
import { MdOutlineAnalytics, MdLogout } from "react-icons/md";
import { NavLink } from "react-router-dom";
import { useContext } from "react";
import { ThemeContext } from "../App"; // Asegúrate de tener este contexto
import Swal from "sweetalert2";

export function Sidebar({ sidebarOpen, setSidebarOpen, user, onSignOut }) {
  const ModSidebaropen = () => setSidebarOpen(!sidebarOpen);
  const { setTheme, theme } = useContext(ThemeContext);
  const CambiarTheme = () => setTheme((theme) => (theme === "light" ? "dark" : "light"));

  return (
    <Container isOpen={sidebarOpen} themeUse={theme}>
      <button className="Sidebarbutton" onClick={ModSidebaropen}>
        <AiOutlineLeft />
      </button>
      {linksArray.map(({ icon, label, to }) => (
        <div className="LinkContainer" key={label}>
          <NavLink
            to={to}
            className={({ isActive }) => `Links${isActive ? ` active` : ``}`}
          >
            <div className="Linkicon">{icon}</div>
            {sidebarOpen && <span>{label}</span>}
          </NavLink>
        </div>
      ))}
      <Divider />
      {secondarylinksArray.map(({ icon, label, to }) => (
        <div className="LinkContainer" key={label}>
          {label === "Salir" ? (
            <div
              className="Links"
              style={{ cursor: "pointer" }}
              onClick={async () => {
                await Swal.fire({
                  title: "Cerrando sesión...",
                  timer: 2000,
                  timerProgressBar: true,
                  showConfirmButton: false,
                  allowOutsideClick: false,
                  allowEscapeKey: false,
                  didOpen: () => {
                    Swal.showLoading();
                  },
                });
                onSignOut();
              }

              }
            >
              <div className="Linkicon">{icon}</div>
              {sidebarOpen && <span>{label}</span>}
            </div>
          ) : (
            <NavLink
              to={to}
              className={({ isActive }) => `Links${isActive ? ` active` : ``}`}
            >
              <div className="Linkicon">{icon}</div>
              {sidebarOpen && <span>{label}</span>}
            </NavLink>
          )}
        </div>
      ))
      }
      <Divider />
      <div className="Themecontent">
        {sidebarOpen && <span className="titletheme">Dark mode</span>}
        <div className="Togglecontent">
          <div className="grid theme-container">
            <div className="content">
              <div className="demo">
                <label className="switch" istheme={theme}>
                  <input
                    istheme={theme}
                    type="checkbox"
                    className="theme-swither"
                    onClick={CambiarTheme}
                  />
                  <span istheme={theme} className="slider round"></span>
                </label>
              </div>
            </div>
          </div>
        </div>
      </div>
      <Divider />
      {profileLinkArray.map(({ to }) => (
        <NavLink
          to={to}
          className={({ isActive }) => `Links${isActive ? ` active` : ``}`}
          style={{ textDecoration: "none" }}
          key={to}
        >
          <UserSection style={{ cursor: "pointer" }}>
            <div className="avatar-container">
              <img
                src={
                  theme === "light"
                    ? "https://img.icons8.com/?size=100&id=23264&format=png&color=000000"
                    : "https://img.icons8.com/?size=100&id=23264&format=png&color=ffffff"
                }
                alt="Avatar"
                className="avatar-img"
              />
            </div>
            {sidebarOpen && (
              <span className="username">
                {user?.firestoreData?.nickname ||
                  user?.firebaseUser?.displayName ||
                  user?.firebaseUser?.email ||
                  "Usuario"}
              </span>
            )}
          </UserSection>
        </NavLink>
      ))}
    </Container >
  );
}

//#region Data links
const linksArray = [
  {
    label: "Home",
    icon: <AiOutlineHome />,
    to: "/",
  },
  {
    label: "Estadisticas",
    icon: <MdOutlineAnalytics />,
    to: "/estadisticas",
  },
  {
    label: "Productos",
    icon: <AiOutlineApartment />,
    to: "/productos",
  },
  {
    label: "ChatBot",
    icon: <AiOutlineComment />,
    to: "/Chatbot",
  },
  {
    label: "Forum",
    icon: <PiUsersFour />,
    to: "/Forum",
  },
];
const secondarylinksArray = [
  {
    label: "Configuración",
    icon: <AiOutlineSetting />,
    to: "/editprofile",
  },
  {
    label: "Salir",
    icon: <MdLogout />,
    to: "/null",
  },
];
const profileLinkArray = [
  {
    to: "/profile"
  }
]
//#endregion

//#region STYLED COMPONENTS
const Container = styled.div`
  color: ${(props) => props.theme.text};
  background: ${(props) => props.theme.bg};
  position: sticky;
  padding-top: 20px;
  
  .Sidebarbutton {
    position: absolute;
    top: ${v.xxlSpacing};
    right: -18px;
    width: 32px;
    height: 32px;
    border-radius: 50%;
    background: ${(props) => props.theme.bgtgderecha};
    box-shadow: 0 0 4px ${(props) => props.theme.bg3},
      0 0 7px ${(props) => props.theme.bg};
    display: flex;
    align-items: center;
    justify-content: center;
    cursor: pointer;
    transition: all 0.3s;
    transform: ${({ isOpen }) => (isOpen ? `initial` : `rotate(180deg)`)};
    border: none;
    letter-spacing: inherit;
    color: inherit;
    font-size: inherit;
    text-align: inherit;
    padding: 0;
    font-family: inherit;
    outline: none;
  }
  .Logocontent {
    display: flex;
    justify-content: center;
    align-items: center;
    padding-bottom: ${v.lgSpacing};
    .imgcontent {
      display: flex;
      img {
        max-width: 100%;
        height: auto;
      }
      cursor: pointer;
      transition: all 0.3s;
      transform: ${({ isOpen }) => (isOpen ? `scale(0.7)` : `scale(1.5)`)};
    }
    h2 {
      display: ${({ isOpen }) => (isOpen ? `block` : `none`)};
    }
  }
  .LinkContainer {
    margin: 8px 0;
    padding: 0 15%;
    :hover {
      background: ${(props) => props.theme.bg3};
    }
    .Links {
      display: flex;
      align-items: center;
      text-decoration: none;
      padding: calc(${v.smSpacing}-2px) 0;
      color: ${(props) => props.theme.text};
      height:50px;
      .Linkicon {
        padding: ${v.smSpacing} ${v.mdSpacing};
        display: flex;
        svg {
          font-size: 25px;
        }
      }
      &.active {
        .Linkicon {
          svg {
            color: ${(props) => props.theme.bg4};
          }
        }
      }
    }
  }
  .Themecontent {
    display: flex;
    align-items: center;
    justify-content: space-between;
    .titletheme {
      display: block;
      padding: 10px;
      font-weight: 700;
      opacity: ${({ isOpen }) => (isOpen ? `1` : `0`)};
      transition: all 0.3s;
      white-space: nowrap;
      overflow: hidden;
    }
    .Togglecontent {
      margin: ${({ isOpen }) => (isOpen ? `auto 40px` : `auto 15px`)};
      width: 36px;
      height: 30px;
      border-radius: 10px;
      transition: all 0.3s;
      position: relative;
      .theme-container {
        background-blend-mode: multiply, multiply;
        transition: 0.4s;
        .grid {
          display: grid;
          justify-items: center;
          align-content: center;
          height: 100vh;
          width: 100vw;
          font-family: "Lato", sans-serif;
        }
        .demo {
          font-size: 32px;
          .switch {
            position: relative;
            display: inline-block;
            width: 60px;
            height: 34px;
            .theme-swither {
              opacity: 0;
              width: 0;
              height: 0;
              &:checked + .slider:before {
                left: 4px;
                content: "🌑";
                transform: translateX(26px);
              }
            }
            .slider {
              position: absolute;
              cursor: pointer;
              top: 0;
              left: 0;
              right: 0;
              bottom: 0;
              background: ${({ themeUse }) =>
    themeUse === "light" ? v.lightcheckbox : v.checkbox};
              transition: 0.4s;
              &::before {
                position: absolute;
                content: "☀️";
                height: 0px;
                width: 0px;
                left: -10px;
                top: 16px;
                line-height: 0px;
                transition: 0.4s;
              }
              &.round {
                border-radius: 34px;
                &::before {
                  border-radius: 50%;
                }
              }
            }
          }
        }
      }
    }
  }
`;
const Divider = styled.div`
  height: 1px;
  width: 100%;
  background: ${(props) => props.theme.bg3};
  margin: ${v.lgSpacing} 0;
`;

const UserSection = styled.div`
  display: flex;
  align-items: center;
  gap: 25px;
  margin: 16px 0 16px 0;
  padding: 0 15%;
  .avatar-container {
    width: 48px;
    height: 48px;
    border-radius: 50%;
    border: 2px solid ${(theme) => theme.text};
    overflow: hidden;
    display: flex;
    align-items: center;
    justify-content: center;
    background: ${(props) => props.theme.bg2};
  }
  .avatar-img {
    width: 100%;
    height: 100%;
    object-fit: cover;
  }
  .username {
    font-weight: 600;
    font-size: 1rem;
    color: ${(props) => props.theme.text};
    white-space: nowrap;
  }
`;
//#endregion

export default Sidebar;