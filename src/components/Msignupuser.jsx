import { useState } from "react";

const SignUpUser = ({ setShowModal }) => {
    return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50">
            <div className="bg-white rounded-lg shadow-lg w-full max-w-lg">
                <div className="flex justify-between items-center bg-gray-800 text-white px-4 py-2 rounded-t-lg">
                    <h2 className="text-lg font-semibold">Datos del nuevo usuario</h2>
                    <button
                        className="text-white"
                        onClick={() => setShowModal(false)}
                    >
                        ×
                    </button>
                </div>
                <div className="p-6">
                    <div className="grid grid-cols-2 gap-4">
                        <div>
                            <label className="block text-sm font-medium mb-1">Nombres</label>
                            <input type="text" className="form-input w-full border rounded px-2 py-1" placeholder="Nombre Usuario" autoComplete="off" />
                        </div>
                        <div>
                            <label className="block text-sm font-medium mb-1">Apellido</label>
                            <input type="text" className="form-input w-full border rounded px-2 py-1" placeholder="Ejemplo Apellido" autoComplete="off" />
                        </div>
                        <div>
                            <label className="block text-sm font-medium mb-1">Correo</label>
                            <input type="email" className="form-input w-full border rounded px-2 py-1" placeholder="name@example.com" autoComplete="off" />
                        </div>
                        <div>
                            <label className="block text-sm font-medium mb-1">Contraseña</label>
                            <input type="password" className="form-input w-full border rounded px-2 py-1" placeholder="Contraseña" autoComplete="off" />
                        </div>
                    </div>
                    <div className="mt-4">
                        {/* Aquí puedes mostrar mensajes de error si lo necesitas */}
                    </div>
                </div>
                <div className="flex justify-end gap-2 px-4 py-3 border-t">
                    <button
                        className="bg-gray-500 text-white px-4 py-2 rounded hover:bg-gray-600"
                        onClick={() => setShowModal(false)}
                    >
                        Cerrar
                    </button>
                    <button
                        className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700"
                    // onClick={GuardarUsuario}
                    >
                        Guardar
                    </button>
                </div>
            </div>
        </div>
    )
}

export default SignUpUser;