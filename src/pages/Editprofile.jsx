import { useState } from "react";
import styled from "styled-components";
//import { storage } from "../firebaseconnect"; // Ajusta la ruta según tu proyecto
//import { ref, uploadBytes, getDownloadURL } from "firebase/storage";

const defaultAvatar =
 "https://img.icons8.com/?size=100&id=23264&format=png&color=000000";

const EditProfile = ({
 initialName = "",
 initialAvatar = defaultAvatar,
 userId = "",
 onSave,
}) => {
 const [name, setName] = useState(initialName);
 const [avatar, setAvatar] = useState(initialAvatar);
 const [avatarFile, setAvatarFile] = useState(null);
 const [avatarError, setAvatarError] = useState(null);
 const [avatarUploading, setAvatarUploading] = useState(false);
 const [bio, setBio] = useState("");
 const [status, setStatus] = useState("");


 const handleImageChange = (e) => {
  const file = e.target.files[0];
  if (file && file.type.startsWith("image/")) {
   setAvatarFile(file);
   setAvatar(URL.createObjectURL(file));
   setAvatarError(null);
  } else {
   setAvatarError("Solo se permiten imágenes.");
  }
 };

 const handleSubmit = async (e) => {
  e.preventDefault();
  setAvatarError(null);
  setAvatarUploading(true);

  let avatarURL = avatar;

  // Si el usuario seleccionó una nueva imagen, súbela a Firebase Storage
  if (avatarFile && userId) {
   try {
    const storageRef = ref(storage, `avatars/${userId}`);
    await uploadBytes(storageRef, avatarFile);
    avatarURL = await getDownloadURL(storageRef);
   } catch (err) {
    setAvatarError("Error al subir la imagen.");
    setAvatarUploading(false);
    return;
   }
  }

  // Llama a la función onSave para guardar los cambios en Firestore o donde corresponda
  if (onSave) {
   await onSave({
    name,
    avatar: avatarURL,
    bio,
    status,
   });
  }

  setAvatarUploading(false);
 };

 return (
  <Wrapper>
   <h2>Editar Perfil</h2>
   <Form onSubmit={handleSubmit}>
    <AvatarSection>
     <label>Foto de perfil</label>
     <AvatarPreview src={avatar} alt="avatar" />
     <input
      type="file"
      accept="image/*"
      onChange={handleImageChange}
      style={{ marginTop: "10px" }}
     />
    </AvatarSection>
    <Fields>
          <label>
            Nombre
            <input
              type="text"
              value={name}
              onChange={e => setName(e.target.value)}
              placeholder="Nombre"
            />
          </label>
          <label>
            Bio
            <textarea
              value={bio}
              onChange={e => setBio(e.target.value)}
              placeholder="Describe quién eres"
              rows={2}
            />
          </label>
          <label>
            Estado
            <input
              type="text"
              value={status}
              onChange={e => setStatus(e.target.value)}
              placeholder="¿Quién eres? (ej: Escritor)"
            />
          </label>
        </Fields>
    {avatarError && <ErrorMsg>{avatarError}</ErrorMsg>}
    <Button type="submit" disabled={avatarUploading}>
     {avatarUploading ? "Guardando..." : "Guardar"}
    </Button>
   </Form>
  </Wrapper>
 );
};

const Wrapper = styled.div`
  max-width: 500px;
  margin: 40px auto;
  background: ${({ theme }) => theme.bg};
  color: ${({ theme }) => theme.text};
  border-radius: 16px;
  box-shadow: 0 4px 24px ${({ theme }) => theme.bg3}44;
  padding: 32px 24px;
`;

const Form = styled.form`
  display: flex;
  flex-direction: column;
  gap: 24px;
`;

const AvatarSection = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 8px;
  margin-bottom: 16px;
  label {
    font-weight: 600;
    margin-bottom: 4px;
    color: ${({ theme }) => theme.text};
  }
`;

const AvatarPreview = styled.img`
  width: 120px;
  height: 120px;
  border-radius: 50%;
  object-fit: cover;
  border: 2px solid ${({ theme }) => theme.bg3};
  margin-bottom: 8px;
`;

const Fields = styled.div`
  display: flex;
  flex-direction: column;
  gap: 12px;
  label {
    font-size: 1rem;
    font-weight: 500;
    display: flex;
    flex-direction: column;
    gap: 4px;
    color: ${({ theme }) => theme.text};
  }
  input, textarea {
    border: 1px solid ${({ theme }) => theme.bg3};
    border-radius: 6px;
    padding: 8px;
    font-size: 1rem;
    background: ${({ theme }) => theme.bg2};
    color: ${({ theme }) => theme.text};
    transition: background 0.2s, color 0.2s;
    resize: none;
  }
`;

const Button = styled.button`
  background: ${({ theme }) => theme.bg4};
  color: ${({ theme }) => theme.white};
  border: none;
  border-radius: 8px;
  padding: 12px 0;
  font-size: 1.1rem;
  font-weight: 600;
  cursor: pointer;
  margin-top: 12px;
  transition: background 0.2s;
  &:hover {
    background: ${({ theme }) => theme.primary};
  }
`;

const ErrorMsg = styled.div`
  color: #e11d48;
  font-size: 0.95rem;
  margin-top: -12px;
  margin-bottom: 8px;
  text-align: center;
`;
export default EditProfile;