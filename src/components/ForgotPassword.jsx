import { useState } from "react";
import Swal from 'sweetalert2';
import { getAuth, sendPasswordResetEmail } from "firebase/auth";

const ForgotPassword = ({ setShowFPasswordModal }) => {
    const [email, setEmail] = useState("");
    const [error, setError] = useState("");

    const handleReset = async (e) => {
        e.preventDefault();
        setError("");

        if (!email) {
            setError("Por favor, ingresa tu correo electrónico.");
            return;
        }

        try {
            const auth = getAuth();
            await sendPasswordResetEmail(auth, email);
            Swal.fire({
                icon: 'success',
                title: 'Correo enviado',
                text: 'Te hemos enviado un correo para restablecer tu contraseña. Revisa la carpeta de spam si no llego',
                timer: 3000
            });
            setShowFPasswordModal(false);
        } catch (err) {
            let msg = "Ocurrió un error. Intenta de nuevo.";
            if (err.code === "auth/user-not-found") {
                msg = "No existe una cuenta con ese correo.";
            } else if (err.code === "auth/invalid-email") {
                msg = "El correo no es válido.";
            }
            setError(msg);
            Swal.fire({
                icon: 'error',
                title: 'Error',
                text: msg
            });
        }
    };

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50">
            <form onSubmit={handleReset} className="bg-white rounded-lg shadow-lg w-full max-w-md">
                <div className="flex justify-between items-center bg-gray-800 text-white px-4 py-2 rounded-t-lg">
                    <h2 className="text-lg font-semibold">Recuperar contraseña</h2>
                    <button
                        type="button"
                        className="text-white"
                        onClick={() => setShowFPasswordModal(false)}
                    >
                        ×
                    </button>
                </div>
                <div className="p-6">
                    <label className="block text-sm font-medium mb-1">Correo electrónico</label>
                    <input
                        type="email"
                        className="form-input w-full border rounded px-2 py-1"
                        placeholder="name@example.com"
                        autoComplete="off"
                        value={email}
                        onChange={e => setEmail(e.target.value)}
                    />
                    {error && <div className="mt-4 text-red-500 text-sm">{error}</div>}
                </div>
                <div className="flex justify-end gap-2 px-4 py-3 border-t">
                    <button
                        type="button"
                        className="bg-gray-500 text-white px-4 py-2 rounded hover:bg-gray-600"
                        onClick={() => setShowFPasswordModal(false)}
                    >
                        Cerrar
                    </button>
                    <button
                        type="submit"
                        className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700"
                        onClick={handleReset}
                    >
                        Enviar correo
                    </button>
                </div>
            </form>
        </div>
    );
};

export default ForgotPassword;