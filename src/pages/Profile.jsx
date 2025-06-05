import { useEffect, useState } from "react";
import supabase from "../supabaseClient"

const Profile = ({ user }) => {
 const [usuario, setUsuario] = useState([]);
 const [loading, setLoading] = useState(true);
 const [error, setError] = useState("");

 useEffect(() => {
  const FetchUserName = async () => {
   setLoading(true);
   setError("");

   if (!user?.firebaseUser?.uid) {
    setError("No hay UID de usuario");
    setLoading(false);
    return;
   }
   const { data, error } = await supabase
    .from("users")
    .select("nickname")
    .eq("uid", user.firebaseUser.uid)
    .single();
   if (error) setError(error.message);
   else setUsuario(data);
   setLoading(false);
  }
  FetchUserName();
 }, [user]);

 if (loading) return <div>Cargando perfil...</div>
 if (error) return <div>error:{error}</div>

 return (
  <div>
   <div>TU perfil papu</div>
   <p>Nickname: {usuario?.nickname}</p>
  </div>
 );
};

export default Profile;