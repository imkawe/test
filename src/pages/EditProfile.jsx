import React, { useState } from "react";
import axios from "axios";
import { toast } from "react-toastify";
import { useNavigate } from "react-router-dom";
import { useUser } from "../context/UserContext";

const CLOUDINARY_URL = `https://api.cloudinary.com/v1_1/${import.meta.env.VITE_CLOUDINARY_CLOUD_NAME}/image/upload`;
const CLOUDINARY_PRESET = import.meta.env.VITE_CLOUDINARY_UPLOAD_PRESET;

const EditProfile = () => {
  const { user, setUser } = useUser();
  const [name, setName] = useState(user?.name || "");
  const [role, setRole] = useState(user?.role || ""); // Inicializa con el rol del usuario o "USER" por defecto
  const [phone, setPhone] = useState(user?.mobile || ""); // Cambiado a user.mobile
  const [image, setImage] = useState(null);
  const [preview, setPreview] = useState(user?.avatar || null);
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    setImage(file);
    setPreview(URL.createObjectURL(file));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!name.trim()) {
      toast.error("⚠️ El nombre no puede estar vacío");
      return;
    }

    setLoading(true);
    let uploadedImageUrl = user.avatar;

    if (image) {
      const formData = new FormData();
      formData.append("file", image);
      formData.append("upload_preset", CLOUDINARY_PRESET);

      try {
        const uploadRes = await axios.post(CLOUDINARY_URL, formData, {
          headers: { "Content-Type": "multipart/form-data" },
        });

        uploadedImageUrl = uploadRes.data.secure_url;
      } catch (error) {
        toast.error("❌ Error al subir la imagen");
        setLoading(false);
        return;
      }
    }

    try {
      const token = sessionStorage.getItem("authToken");
      const updateData = { 
        name, 
        mobile: phone, // Cambiado a "mobile" para coincidir con el backend
        avatar: uploadedImageUrl 
      };

      await axios.put(`${import.meta.env.VITE_API_URL}/api/user/update-profile`, updateData, {
        headers: { Authorization: `Bearer ${token}` },
      });

      setUser((prev) => ({ ...prev, ...updateData }));
      toast.success("✅ Perfil actualizado correctamente");
      navigate("/profile");
    } catch (error) {
      toast.error("❌ Error al actualizar perfil");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-md mx-auto my-6 p-4 bg-white rounded-lg shadow-md">
      <h2 className="text-xl font-semibold text-gray-800 mb-4 text-center">
        Editar Perfil
      </h2>
      
      <form onSubmit={handleSubmit} className="space-y-3">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Nombre
          </label>
          <input
            type="text"
            value={name}
            onChange={(e) => setName(e.target.value)}
            className="w-full p-2 border rounded focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-sm"
            placeholder="Tu nombre completo"
          />
        </div>

        
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Teléfono
          </label>
          <input
            type="tel"
            value={phone}
            onChange={(e) => setPhone(e.target.value)}
            className="w-full p-2 border rounded focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-sm"
            placeholder="+34 123 456 789"
            pattern="[+]?[0-9\s]+"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Imagen de perfil
          </label>
          <div className="flex items-center gap-2">
            <input
              type="file"
              onChange={handleImageChange}
              className="block w-full text-xs text-gray-500
                file:mr-2 file:py-1.5 file:px-3
                file:rounded file:border-0
                file:text-xs file:font-semibold
                file:bg-blue-50 file:text-blue-700
                hover:file:bg-blue-100"
            />
            {preview && (
              <img 
                src={preview} 
                alt="Vista previa" 
                className="w-20 h-20 rounded-full object-cover border-2 border-gray-200"
              />
            )}
          </div>
        </div>

        <button
          type="submit"
          disabled={loading}
          className="w-full bg-blue-600 text-white px-4 py-2 rounded
            hover:bg-blue-700 transition-colors disabled:bg-blue-400
            disabled:cursor-not-allowed flex justify-center items-center gap-1.5 text-sm"
        >
          {loading ? (
            <>
              <svg className="animate-spin h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
              </svg>
              Guardando...
            </>
          ) : "Guardar cambios"}
        </button>
      </form>
    </div>
  );
};

export default EditProfile;