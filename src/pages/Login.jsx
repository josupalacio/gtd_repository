import { useState } from "react";
import Swal from 'sweetalert2';
import ModalSignup from "../components/ModalSignup";
import ForgotPassword from "../components/ForgotPassword";
import {
    getAuth,
    setPersistence,
    browserLocalPersistence,
    browserSessionPersistence,
    signInWithEmailAndPassword
} from "firebase/auth";

const Login = () => {
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [showSignupModal, setShowSignupModal] = useState(false);
    const [showFPasswordModal, setShowFPasswordModal] = useState(false);
    const [showPassword, setShowPassword] = useState(false);
    const [rememberMe, setRememberMe] = useState(false);

    const handleLogin = async () => {
        if (!email || !password) {
            Swal.fire({
                icon: 'warning',
                title: 'Campos incompletos',
                text: 'Por favor, ingresa correo y contraseña.',
            });
            return;
        }

        const auth = getAuth();

        try {
            await setPersistence(
                auth,
                rememberMe ? browserLocalPersistence : browserSessionPersistence
            );

            await signInWithEmailAndPassword(auth, email, password);

            Swal.fire({
                icon: 'success',
                title: '¡Inicio de Sesión Exitoso!',
                text: 'Bienvenido de nuevo a Getting things done.',
                timer: 2000
            }).then(() => {
                // Aquí puedes redirigir o actualizar el estado global si lo necesitas
            });

        } catch (error) {
            Swal.fire({
                icon: 'error',
                title: 'Error de Inicio de Sesión',
                text: 'Correo o contraseña incorrectos.',
            });
        }
    };

    return (
        <div className="min-h-screen flex flex-col items-center justify-center">
            <div className="py-6 px-4">
                <div className="grid md:grid-cols-2 items-center gap-6 max-w-6xl w-full">
                    <div className="border border-slate-300 rounded-lg p-6 max-w-md shadow-[0_2px_22px_-4px_rgba(93,96,127,0.2)] max-md:mx-auto">
                        <form
                            className="space-y-6"
                            onSubmit={(e) => {
                                e.preventDefault();
                                handleLogin();
                            }}>
                            <div className="mb-12">
                                <h3 className="text-slate-900 text-3xl font-semibold">Sign in</h3>
                                <p className="text-slate-500 text-sm mt-6 leading-relaxed">
                                    Sign in to your account and explore a world of possibilities. Your journey begins here.
                                </p>
                            </div>
                            <div>
                                <label className="text-slate-800 text-sm font-medium mb-2 block">Correo electrónico</label>
                                <div className="relative flex items-center">
                                    <input
                                        name="email"
                                        type="email"
                                        required
                                        className="w-full text-sm text-slate-800 border border-slate-300 pl-4 pr-10 py-3 rounded-lg outline-blue-600"
                                        placeholder="Ingresa tu correo"
                                        autoComplete="email"
                                        value={email}
                                        onChange={(e) => setEmail(e.target.value)}
                                    />
                                </div>
                            </div>
                            <div>
                                {/* Input contraseña del usuario */}
                                <label className="text-slate-800 text-sm font-medium mb-2 block">Contraseña</label>
                                <div className="relative flex items-center">
                                    <input
                                        name="password"
                                        type={showPassword ? "text" : "password"} // Mantener type="password" para ocultar
                                        required
                                        className="w-full text-sm text-slate-800 border border-slate-300 pl-4 pr-10 py-3 rounded-lg outline-blue-600"
                                        placeholder="Ingresa tu contraseña"
                                        autoComplete="current-password"
                                        value={password}
                                        onChange={(e) => setPassword(e.target.value)} // Captura el valor de la contraseña
                                    />
                                    {/* Icono de ojo/contraseña */}
                                    {showPassword ? (
                                        // Contraseña visible
                                        <svg
                                            xmlns="http://www.w3.org/2000/svg"
                                            fill="#bbb"
                                            stroke="#bbb"
                                            className="w-[18px] h-[18px] absolute right-4 cursor-pointer"
                                            viewBox="0 0 128 128"
                                            // Metodo para ver la contraseña
                                            onClick={() => setShowPassword(prev => !prev)}>
                                            {/* Ojo base */}
                                            <path d="M64 104C22.127 104 1.367 67.496.504 65.943a4 4 0 0 1 0-3.887C1.367 60.504 22.127 24 64 24s62.633 36.504 63.496 38.057a4 4 0 0 1 0 3.887C126.633 67.496 105.873 104 64 104zM8.707 63.994C13.465 71.205 32.146 96 64 96c31.955 0 50.553-24.775 55.293-31.994C114.535 56.795 95.854 32 64 32 32.045 32 13.447 56.775 8.707 63.994zM64 88c-13.234 0-24-10.766-24-24s10.766-24 24-24 24 10.766 24 24-10.766 24-24 24zm0-40c-8.822 0-16 7.178-16 16s7.178 16 16 16 16-7.178 16-16-7.178-16-16-16z" />
                                            {/* Línea de tachado */}
                                            <line x1="24" y1="24" x2="104" y2="104" stroke="#bbb" strokeWidth="8" strokeLinecap="round" />
                                        </svg>
                                    ) : (
                                        // Contraseña no visible
                                        <svg
                                            xmlns="http://www.w3.org/2000/svg"
                                            fill="#cbb"
                                            stroke="#bbb"
                                            className="w-[18px] h-[18px] absolute right-4 cursor-pointer"
                                            viewBox="0 0 128 128"
                                            // Metodo para ver la contraseña
                                            onClick={() => setShowPassword(prev => !prev)}>
                                            <path d="M64 104C22.127 104 1.367 67.496.504 65.943a4 4 0 0 1 0-3.887C1.367 60.504 22.127 24 64 24s62.633 36.504 63.496 38.057a4 4 0 0 1 0 3.887C126.633 67.496 105.873 104 64 104zM8.707 63.994C13.465 71.205 32.146 96 64 96c31.955 0 50.553-24.775 55.293-31.994C114.535 56.795 95.854 32 64 32 32.045 32 13.447 56.775 8.707 63.994zM64 88c-13.234 0-24-10.766-24-24s10.766-24 24-24 24 10.766 24 24-10.766 24-24 24zm0-40c-8.822 0-16 7.178-16 16s7.178 16 16 16 16-7.178 16-16-7.178-16-16-16z" data-original="#000000" />
                                        </svg>
                                    )}
                                </div>
                            </div>

                            <div className="flex flex-wrap items-center justify-between gap-4">
                                <div className="flex items-center">
                                    <input
                                        id="remember-me"
                                        name="remember-me"
                                        type="checkbox"
                                        className="h-4 w-4 shrink-0 text-blue-600 focus:ring-blue-500 border-slate-300 rounded"
                                        // Check para recordar al usuario
                                        onChange={(e) => setRememberMe(e.target.checked)}
                                        checked={rememberMe}
                                    />
                                    <label htmlFor="remember-me" className="ml-3 block text-sm text-slate-500">Recordarme</label> {/* Texto en español */}
                                </div>

                                <div className="text-sm">
                                    {/* Renderizamos el modal del Forgot Password */}
                                    {showFPasswordModal && <ForgotPassword setShowFPasswordModal={setShowFPasswordModal} />}
                                    <a
                                        className="text-blue-600 hover:underline font-medium"
                                        onClick={() => setShowFPasswordModal(true)}>
                                        ¿Olvidaste tu contraseña?
                                    </a>
                                </div>
                            </div>

                            <div className="!mt-12">
                                {/* Botón para logear */}
                                <button
                                    type="submit" // Es un botón de submit del formulario
                                    className="w-full shadow-xl py-2.5 px-4 text-[15px] font-medium tracking-wide rounded-lg text-white bg-blue-600 hover:bg-blue-700 focus:outline-none"
                                >
                                    Iniciar sesión {/* Texto en español */}
                                </button>

                                {/* Renderizamos el modal del sign-up */}
                                {showSignupModal && <ModalSignup setShowModal={setShowSignupModal} />}
                                <p
                                    className="text-sm !mt-6 text-center text-slate-500">
                                    ¿No tienes una cuenta? {/* Texto en español */}
                                    <a
                                        onClick={() => setShowSignupModal(true)} // Al hacer click, mostramos el modal
                                        className="text-blue-600 font-medium hover:underline ml-1 whitespace-nowrap cursor-pointer"> {/* Añadir cursor-pointer */}
                                        Regístrate aquí
                                    </a>
                                </p>
                            </div>
                        </form>
                    </div>
                    <div className="max-md:mt-8">
                        <img src="https://readymadeui.com/login-image.webp" className="w-full aspect-[71/50] max-md:w-4/5 mx-auto block object-cover" alt="login img" />
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Login;