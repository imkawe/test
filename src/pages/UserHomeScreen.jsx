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
    }, 1000);

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
    <div style={{ padding: "20px", maxWidth: "600px", margin: "0 auto" }}>
      <h2 style={{ textAlign: "center", color: "#2c3e50" }}>
        Welcome to User Home Screen
      </h2>
      
      {userData ? (
        <div style={{
          marginTop: "30px",
          padding: "20px",
          borderRadius: "10px",
          boxShadow: "0 2px 5px rgba(0,0,0,0.1)"
        }}>
          <h3 style={{ color: "#3498db" }}>User Details</h3>
          <p><strong>Name:</strong> {userData.name}</p>
          <p><strong>Email:</strong> {userData.email}</p>
        </div>
      ) : (
        <p style={{ textAlign: "center", marginTop: "20px" }}>
          Loading user details...
        </p>
      )}
      
      <p style={{
        textAlign: "center",
        marginTop: "20px",
        color: "#e74c3c",
        fontWeight: "bold"
      }}>
        Redirecting to home page in 2 seconds...
      </p>
    </div>
  );
}

export default UserHomeScreen;