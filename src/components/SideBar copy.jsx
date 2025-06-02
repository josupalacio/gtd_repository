import React, { memo } from "react";
import { Link, useLocation } from "react-router-dom";

const SideBar = ({ open, setOpen, Menus }) => {
    return (
        <div className="min-h-screen m-5 bg-dark-purple">
            <div
                className={`${open ? "w-72" : "w-20"
                    } bg-dark-purple min-h-screen p-5 pt-5 relative duration-300`}
            >
                <img
                    src="./src/assets/control.png"
                    className={`absolute cursor-pointer -right-3 top-9 w-7 border-dark-purple
           border-2 rounded-full ${!open && "rotate-180"}`}
                    onClick={() => setOpen(!open)}
                />
                <div className="flex gap-x-4 items-center">
                    <img
                        src="./src/assets/logo.png"
                        className={`rounded-md cursor-pointer duration-500 ${open && "rotate-[360deg]"
                            }`}
                    />
                    <h1
                        className={`text-white origin-left font-medium text-xl duration-200 ${!open && "scale-0"
                            }`}
                    >
                        Getting Things Done
                    </h1>
                </div>
                <ul className="pt-6">
                    {Menus.map((Menu, index) => (
                        <MenuItem key={index} Menu={Menu} open={open} />
                    ))}
                </ul>
            </div>
        </div>
    );
};

const MenuItem = memo(({ Menu, open }) => {
    const location = useLocation(); // Obtiene la ruta actual

    // Verifica si la ruta actual coincide con la ruta del menú
    const isActive = location.pathname === Menu.path;

    return (
        <li
            className={`flex rounded-md p-2 cursor-pointer hover:bg-light-white text-sm items-center gap-x-4 
            ${Menu.gap ? "mt-9" : "mt-2"} ${isActive ? "bg-light-white text-white" : "text-gray-300"}`}
        >
            <Link to={Menu.path} className="flex items-center gap-x-4">
                <img src={`./src/assets/${Menu.src}.png`} />
                <span className={`${!open && "hidden"} origin-left duration-200`}>
                    {Menu.title}
                </span>
            </Link>
        </li>
    );
});

export default SideBar;