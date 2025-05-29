import { useState } from "react";
import { ManageAccount } from "../firebaseconnect";
import Swal from 'sweetalert2'; // Importa SweetAlert

const ModalSignup = ({ setShowModal }) => {
    // Datos importantes para el registro 
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [nickname, setNickname] = useState("")
    // Datos del usuario
    const [nombre, setNombre] = useState("");
    const [apellido, setApellido] = useState("");
    const [error, setError] = useState(""); // Para errores de validación previa o de Firebase

    // Agregamos async para poder usar await
    const handleSignup = async (e) => {
        e.preventDefault();
        setError(""); // Limpiar errores previos

        if (!email || !password) {
            setError("Completa correo y contraseña");
            return;
        }

        // Instanciamos la clase
        const account = new ManageAccount();

        try {
            // Usamos await para esperar la respuesta de Firebase
            const result = await account.register(email, password);

            if (result.success) {
                // Registro exitoso
                const userId = result.user.uid;

                // Guardamos los datos en firestore
                const saveResult = await account.saveData("users", userId, {
                    nombre,
                    apellido,
                    nickname,
                    email
                });

                if (!saveResult.success) {
                    Swal.fire({
                        icon: 'error',
                        title: 'Error',
                        text: 'No se pudieron guardar los datos adicionales'
                    });
                } else {
                    Swal.fire({
                        icon: 'success',
                        title: '¡Registro Exitoso!',
                        text: 'Tu cuenta ha sido creada.',
                        timer: 2000 // Opcional: cierra la alerta después de 2 segundos
                    });

                    setShowModal(false)
                }
            } else {
                // Hubo un error en el registro (validación de Firebase, email ya usado, etc.)
                // Puedes mostrar un mensaje de error más específico basado en result.message
                console.error("Error de registro de Firebase:", result.message); // Log para depuración

                let friendlyErrorMessage = 'Ocurrió un error al registrar. Intenta de nuevo.';
                if (result.message.includes('auth/email-already-in-use')) {
                    friendlyErrorMessage = 'El correo electrónico ya está registrado.';
                } else if (result.message.includes('auth/invalid-email')) {
                    friendlyErrorMessage = 'El formato del correo electrónico no es válido.';
                } else if (result.message.includes('auth/weak-password')) {
                    friendlyErrorMessage = 'La contraseña es demasiado débil. Debe tener al menos 6 caracteres.';
                }
                Swal.fire({
                    icon: 'error',
                    title: 'Error de Registro',
                    text: friendlyErrorMessage,
                });
                setError(friendlyErrorMessage); // Opcional: también mostrar debajo del formulario
            }
        } catch (err) {
            // Captura cualquier otro error inesperado
            console.error("Error inesperado durante el registro:", err);
            Swal.fire({
                icon: 'error',
                title: 'Error',
                text: 'Ocurrió un error inesperado. Intenta de nuevo.',
            });
            setError('Ocurrió un error inesperado.');
        }
    }

    return (
        // ... (el resto de tu JSX es correcto)
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50">
            <form onSubmit={handleSignup} className="bg-white rounded-lg shadow-lg w-full max-w-lg">
                <div className="flex justify-between items-center bg-gray-800 text-white px-4 py-2 rounded-t-lg">
                    <h2 className="text-lg font-semibold">Datos del nuevo usuario</h2>
                    <button
                        type="button"
                        className="text-white"
                        onClick={() => setShowModal(false)}
                    >
                        ×
                    </button>
                </div>
                <div className="p-6">
                    <div className="grid grid-cols-2 gap-4">
                        {/* Estos campos no son manejados por Firebase Auth en createUserWithEmailAndPassword */}
                        <div>
                            <label className="block text-sm font-medium mb-1">Nombre</label>
                            <input
                                type="text"
                                className="form-input w-full border rounded px-2 py-1"
                                placeholder="Nombre Usuario"
                                autoComplete="off"
                                value={nombre}
                                onChange={e => setNombre(e.target.value)}
                            />
                        </div>
                        <div>
                            <label className="block text-sm font-medium mb-1">Apellido</label>
                            <input
                                type="text"
                                className="form-input w-full border rounded px-2 py-1"
                                placeholder="Ejemplo Apellido"
                                autoComplete="off"
                                value={apellido}
                                onChange={e => setApellido(e.target.value)}
                            />
                        </div>
                        {/* --------------------------------------------- */}
                        <div>
                            <label className="block text-sm font-medium mb-1">Nick name</label>
                            <input
                                type="nickname"
                                className="form-input w-full border rounded px-2 py-1"
                                placeholder="nick name"
                                autoComplete="off"
                                value={nickname}
                                onChange={e => setNickname(e.target.value)}
                            />
                        </div>
                        <div>
                            <br />
                        </div>
                        {/* --------------------------------------------- */}
                        <div>
                            <label className="block text-sm font-medium mb-1">Correo</label>
                            <input
                                type="email"
                                className="form-input w-full border rounded px-2 py-1"
                                placeholder="name@example.com"
                                autoComplete="off"
                                value={email}
                                onChange={e => setEmail(e.target.value)}
                            />
                        </div>
                        <div>
                            <label className="block text-sm font-medium mb-1">Contraseña</label>
                            <input
                                type="password"
                                className="form-input w-full border rounded px-2 py-1"
                                placeholder="Contraseña"
                                autoComplete="off"
                                value={password}
                                onChange={e => setPassword(e.target.value)}
                            />
                        </div>
                    </div>
                    {/* Mostrar el error aquí si existe */}
                    {error && <div className="mt-4 text-red-500 text-sm">{error}</div>}
                </div>
                <div className="flex justify-end gap-2 px-4 py-3 border-t">
                    <button
                        type="button"
                        className="bg-gray-500 text-white px-4 py-2 rounded hover:bg-gray-600"
                        onClick={() => setShowModal(false)}
                    >
                        Cerrar
                    </button>
                    <button
                        type="submit"
                        className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700"
                        onClick={handleSignup}
                    >
                        Guardar
                    </button>
                    {/* 
                    <button
                        type="button"
                        className="bg-gray-500 text-white px-4 py-2 rounded hover:bg-gray-700"
                        onClick={() => {
                            setNombre("Fernando");
                            setApellido("Pérez");
                            setNickname("prueba1234");
                            setEmail("juan@example.com");
                            setPassword("123456")
                        }}
                    >
                        Autocomplete
                    </button>
                    */}
                </div>
            </form>
        </div>
    )
}

export default ModalSignup;
