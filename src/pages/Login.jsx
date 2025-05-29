import { useState } from "react";
import Swal from 'sweetalert2';
import ModalSignup from "../components/ModalSignup";
import { ManageAccount } from "../firebaseconnect"; // Importa ManageAccount

const Login = ({ setUserLogin }) => {
    // Cambiado a 'email' para mayor claridad y coincidencia con Firebase Auth
    // Asegúrate de que el input en el JSX tenga name="email" o similar,
    // aunque en tu código original usas 'username' en el state y en el input.
    // Voy a mantener el estado como 'email' y asumir que el input lo capturará correctamente.
    // Si prefieres mantener 'username' en el state, asegúrate de pasarlo como email a authenticate.
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [showModal, setShowModal] = useState(false); //control del modal

    // Esta función manejará el intento de inicio de sesión usando Firebase Auth
    const handleLogin = async () => { // Hacemos la función async para poder usar await
        // Validación básica en el cliente
        if (!email || !password) {
            Swal.fire({
                icon: 'warning',
                title: 'Campos incompletos',
                text: 'Por favor, ingresa correo y contraseña.',
            });
            return; // Detiene la ejecución si falta algún campo
        }

        // Instanciamos la clase ManageAccount
        const account = new ManageAccount();

        try {
            // Llamamos a la función authenticate de Firebase Auth usando await
            const result = await account.authenticate(email, password); // Usamos await para esperar la respuesta

            if (result.success) {
                // Inicio de sesión exitoso según Firebase
                Swal.fire({
                    icon: 'success',
                    title: '¡Inicio de Sesión Exitoso!',
                    text: 'Bienvenido de nuevo a Getting things done.', // Mensaje más personalizado
                    timer: 2000 // La alerta se cierra automáticamente después de 2 segundos
                });
                setUserLogin(true); // Actualiza el estado de login a true en tu aplicación padre
                // Aquí podrías usar react-router-dom u otra librería para redirigir
                // Por ejemplo: history.push('/dashboard');
            } else {
                // Hubo un error en el inicio de sesión (credenciales inválidas, etc.)
                console.error("Error de inicio de sesión de Firebase:", result.message); // Log para depuración

                // Mapear mensajes de error de Firebase a mensajes amigables para el usuario
                let friendlyErrorMessage = 'Credenciales inválidas. Por favor, verifica tu correo y contraseña.';
                if (result.message.includes('auth/user-not-found')) {
                    friendlyErrorMessage = 'No existe un usuario con este correo electrónico.';
                } else if (result.message.includes('auth/wrong-password')) {
                    friendlyErrorMessage = 'La contraseña es incorrecta.';
                } else if (result.message.includes('auth/invalid-email')) {
                    friendlyErrorMessage = 'El formato del correo electrónico no es válido.';
                } // Puedes añadir más casos según los errores de Firebase que esperes

                Swal.fire({
                    icon: 'error',
                    title: 'Error de Inicio de Sesión',
                    text: friendlyErrorMessage,
                });
            }
        } catch (err) {
            // Captura cualquier otro error inesperado durante la llamada
            console.error("Error inesperado durante el inicio de sesión:", err);
            Swal.fire({
                icon: 'error',
                title: 'Error',
                text: 'Ocurrió un error inesperado al intentar iniciar sesión. Intenta de nuevo.',
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
                                e.preventDefault(); // Previene el recargo de la página por defecto
                                handleLogin(); // Llama a nuestra nueva función de inicio de sesión
                            }}>
                            <div className="mb-12">
                                <h3 className="text-slate-900 text-3xl font-semibold">Sign in</h3>
                                <p className="text-slate-500 text-sm mt-6 leading-relaxed">
                                    Sign in to your account and explore a world of possibilities. Your journey begins here.
                                </p>
                            </div>

                            <div>
                                <label className="text-slate-800 text-sm font-medium mb-2 block">Correo electrónico</label> {/* Etiqueta más precisa */}
                                <div className="relative flex items-center">
                                    <input
                                        name="email" // Cambiado a 'email'
                                        type="email" // Tipo email para validación básica del navegador
                                        required
                                        className="w-full text-sm text-slate-800 border border-slate-300 pl-4 pr-10 py-3 rounded-lg outline-blue-600"
                                        placeholder="Ingresa tu correo" // Placeholder más claro
                                        autoComplete="email" // Ayuda con autocompletado
                                        value={email}
                                        onChange={(e) => setEmail(e.target.value)} // Captura el valor del input
                                    />
                                    {/* Icono de usuario (email) */}
                                    <svg xmlns="http://www.w3.org/2000/svg" fill="#bbb" stroke="#bbb" className="w-[18px] h-[18px] absolute right-4" viewBox="0 0 24 24">
                                        <circle cx="10" cy="7" r="6" data-original="#000000"></circle>
                                        <path
                                            d="M14 15H6a5 5 0 0 0-5 5 3 3 0 0 0 3 3h12a3 3 0 0 0 3-3 5 5 0 0 0-5-5zm8-4h-2.59l.3-.29a1 1 0 0 0-1.42-1.42l-2 2a1 1 0 0 0 0 1.42l2 2a1 1 0 0 0 1.42 0 1 1 0 0 0 0-1.42l-.3-.29H22a1 1 0 0 0 0-2z"
                                            data-original="#000000"
                                        ></path>
                                    </svg>
                                </div>
                            </div>

                            <div>
                                <label className="text-slate-800 text-sm font-medium mb-2 block">Contraseña</label>
                                <div className="relative flex items-center">
                                    <input
                                        name="password"
                                        type="password" // Mantener type="password" para ocultar
                                        required
                                        className="w-full text-sm text-slate-800 border border-slate-300 pl-4 pr-10 py-3 rounded-lg outline-blue-600"
                                        placeholder="Ingresa tu contraseña"
                                        autoComplete="current-password" // Ayuda con autocompletado
                                        value={password}
                                        onChange={(e) => setPassword(e.target.value)} // Captura el valor de la contraseña
                                    />
                                    {/* Icono de ojo/contraseña */}
                                    <svg xmlns="http://www.w3.org/2000/svg" fill="#bbb" stroke="#bbb" className="w-[18px] h-[18px] absolute right-4 cursor-pointer" viewBox="0 0 128 128">
                                        <path
                                            d="M64 104C22.127 104 1.367 67.496.504 65.943a4 4 0 0 1 0-3.887C1.367 60.504 22.127 24 64 24s62.633 36.504 63.496 38.057a4 4 0 0 1 0 3.887C126.633 67.496 105.873 104 64 104zM8.707 63.994C13.465 71.205 32.146 96 64 96c31.955 0 50.553-24.775 55.293-31.994C114.535 56.795 95.854 32 64 32 32.045 32 13.447 56.775 8.707 63.994zM64 88c-13.234 0-24-10.766-24-24s10.766-24 24-24 24 10.766 24 24-10.766 24-24 24zm0-40c-8.822 0-16 7.178-16 16s7.178 16 16 16 16-7.178 16-16-7.178-16-16-16z"
                                            data-original="#000000"
                                        ></path>
                                    </svg>
                                </div>
                            </div>

                            <div className="flex flex-wrap items-center justify-between gap-4">
                                <div className="flex items-center">
                                    <input
                                        id="remember-me"
                                        name="remember-me"
                                        type="checkbox"
                                        className="h-4 w-4 shrink-0 text-blue-600 focus:ring-blue-500 border-slate-300 rounded"
                                    />
                                    <label htmlFor="remember-me" className="ml-3 block text-sm text-slate-500">Recordarme</label> {/* Texto en español */}
                                </div>

                                <div className="text-sm">
                                    <a href="javascript:void(0);" className="text-blue-600 hover:underline font-medium">¿Olvidaste tu contraseña?</a> {/* Texto en español */}
                                    {/* Idealmente, esto activaría una función de recuperación de contraseña de Firebase Auth */}
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
                                {showModal && <ModalSignup setShowModal={setShowModal} />}
                                <p
                                    className="text-sm !mt-6 text-center text-slate-500">
                                    ¿No tienes una cuenta? {/* Texto en español */}
                                    <a
                                        onClick={() => setShowModal(true)} // Al hacer click, mostramos el modal
                                        href="javascript:void(0);" // Mantener el href preventivo
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
