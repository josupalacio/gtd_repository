import React, { useEffect, useState } from "react";
import supabase from "../supabaseClient"; // Asegúrate de tener este archivo configurado

const Forum = () => {
  const [usuarios, setUsuarios] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    const fetchUsuarios = async () => {
      setLoading(true);
      setError("");
      const { data, error } = await supabase
       .from("users")
       .select("nickname, name, surname");
      if (error) {
        setError("Error al obtener usuarios: " + error.message);
        setUsuarios([]);
      } else {
        setUsuarios(data);
      }
      setLoading(false);
    };
    fetchUsuarios();
  }, []);

  return (
    <div style={{ padding: 32 }}>
      <h2>Usuarios (Supabase SELECT *)</h2>
      {loading ? (
        <div>Cargando...</div>
      ) : error ? (
        <div style={{ color: "red" }}>{error}</div>
      ) : (
        <table border="1" cellPadding={8} style={{ width: "100%", marginTop: 16 }}>
          <thead>
            <tr>
              {usuarios.length > 0 &&
                Object.keys(usuarios[0]).map((col) => (
                  <th key={col}>{col}</th>
                ))}
            </tr>
          </thead>
          <tbody>
            {usuarios.length === 0 ? (
              <tr>
                <td colSpan={usuarios[0] ? Object.keys(usuarios[0]).length : 1} style={{ textAlign: "center" }}>
                  Sin usuarios
                </td>
              </tr>
            ) : (
              usuarios.map((user) => (
                <tr key={user.id || user.email || Math.random()}>
                  {Object.values(user).map((val, i) => (
                    <td key={i}>{String(val)}</td>
                  ))}
                </tr>
              ))
            )}
          </tbody>
        </table>
      )}
    </div>
  );
};

export default Forum;