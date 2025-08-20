import { useState } from "react";
import { ManageAccount } from "../firebaseconnect";
import Swal from 'sweetalert2'; // Importa SweetAlert
import { getDocs, getFirestore } from "firebase/firestore";
import { collection, query, where } from "firebase/firestore";
// importamos supabase para el registro
import supabase from "../supabaseClient";

const ModalSignup = ({ setShowModal }) => {
    // Datos importantes para el registro 
    const [mail, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [repeatPassword, setRepeatPassword] = useState("");
    const [nickname, setNickname] = useState("")
    // Datos del usuario
    const [nombre, setNombre] = useState("");
    const [error, setError] = useState(""); // Para errores de validación previa o de Firebase

    // Agregamos async para poder usar await
    const handleSignup = async (e) => {
    e.preventDefault();
    setError(""); // Limpiar errores previos

    if (!mail || !password) {
        setError("Completa correo y contraseña");
        return;
    }

    // Verificamos si existe el nickname en supabase
    let { data: nickData } = await supabase
        .from("users")
        .select("uid")
        .eq("nickname", nickname)
        .single();

    if (nickData) {
        setError("Nickname en uso, intentalo con otro");
        return;
    }

    // Saneamos mail para evitar injections
 
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(mail)) {
        setError("El correo no es válido");
        return;
    }

    // Saneamos nickname
    const nicknameRegex = /^(?!.*[.]{2})[a-zA-Z0-9](?:[a-zA-Z0-9._]{1,28}[a-zA-Z0-9])?$/;
    if (!nicknameRegex.test(nickname)) {
        setError("El nickname solo puede contener letras, números, puntos y guion bajo, sin espacios ni caracteres especiales, y no puede empezar o terminar con punto o guion bajo.");
        return;
    }

    // Verificamos si existe el mail en supabase
    let { data: mailData } = await supabase
        .from("users")
        .select("uid")
        .eq("email", mail)
        .single();

    if (mailData) {
        setError("Mail en uso, intentalo con otro");
        return;
    }

    // Validamos que el usuario este seguro de la contraseña
    if (password !== repeatPassword) {
        setError("Las contraseñas no coinciden");
        return;
    }

    // 1. Registramos en Supabase Auth PRIMERO
    const { error: supaAuthError } = await supabase.auth.signUp({ email: mail, password });
    if (supaAuthError) {
        setError("Error al registrar en Supabase Auth: " + supaAuthError.message);
        return;
    }

    // 2. Registramos en Firebase
    const account = new ManageAccount();
    const result = await account.register(mail, password, nickname);
    if (!result.success) {
        setError(result.message || "Error al registrar en firebase");
        // Opcional: aquí podrías borrar el usuario de Supabase Auth si quieres mantener sincronía
        return;
    }

    const userUid = result.user.uid;

    // 3. Registramos en tabla users de Supabase
    const { error: supaError } = await supabase
        .from("users")
        .insert([{
            uid: userUid,
            name: nombre,
            nickname: nickname,
            email: mail,
            created_at: new Date().toISOString()
        }]);

    if (supaError) {
        setError("Error al registrar en Supabase: " + supaError.message);
        return;
    }

    Swal.fire({
        icon: 'success',
        title: '¡Registro Exitoso!',
        text: 'Tu cuenta ha sido creada.',
        timer: 2000
    });

    setShowModal(false);
};

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
                        {/* --------------------------------------------- */}
                        <div>
                            <label className="block text-sm font-medium mb-1">Correo</label>
                            <input
                                type="email"
                                className="form-input w-full border rounded px-2 py-1"
                                placeholder="name@example.com"
                                autoComplete="off"
                                value={mail}
                                onChange={e => setEmail(e.target.value)}
                            />
                        </div>
                        <span/>
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
                        <div>
                            <label className="block text-sm font-medium mb-1">Repite contraseña</label>
                            <input
                                type="password"
                                className="form-input w-full border rounded px-2 py-1"
                                placeholder="Contraseña"
                                autoComplete="off"
                                value={repeatPassword}
                                onChange={e => setRepeatPassword(e.target.value)}
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
                    {/* Usar para pruebas 
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
