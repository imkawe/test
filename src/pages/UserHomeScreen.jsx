import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";

function UserHomeScreen() {
  const [userData, setUserData] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    const token = sessionStorage.getItem("authToken");

    // Redirección inmediata si no hay token
    if (!token) {
      navigate("/");
      window.location.reload(); // Recargar la página después de redirigir
      return;
    }

    // Redirección después de 2 segundos
    const redirectTimer = setTimeout(() => {
      navigate("/");
      window.location.reload(); // Recargar la página después de redirigir
    }, 3000);

    // Obtener detalles del usuario
    const fetchUserDetails = async () => {
      try {
        const response = await axios.get(
          `${import.meta.env.VITE_API_URL}/api/user/get-userDetails`,
          { headers: { Authorization: `Bearer ${token}` } }
        );

        if (response.data.success) {
          setUserData(response.data.user);
          sessionStorage.setItem("userData", JSON.stringify({
            isLoggedIn: true,
            userData: response.data.user
          }));
        }
      } catch (err) {
        console.error("Error fetching user details:", err);
      }
    };

    fetchUserDetails();

    // Limpiar el timer si el componente se desmonta
    return () => clearTimeout(redirectTimer);
  }, [navigate]);

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-gray-100 p-4">
      <div className="bg-white shadow-md rounded-lg p-6 max-w-md w-full text-center">
        <h2 className="text-2xl font-bold text-gray-800">Bienvenido</h2>
        <p className="mt-2 text-gray-600">Has iniciado sesión con éxito.</p>
        {userData && (
          <div className="mt-4 p-4 bg-blue-100 text-blue-700 rounded-lg">
            <p><strong>Nombre:</strong> {userData.name}</p>
            <p><strong>Email:</strong> {userData.email}</p>
          </div>
        )}
      </div>
    </div>
  );
}

export default UserHomeScreen;