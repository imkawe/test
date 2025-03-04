import axios from "axios";
import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import { useUser } from "../context/UserContext"; // ✅ Hook correctamente importado
import { FiMail, FiLock, FiAlertCircle } from "react-icons/fi";

const Login = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [errors, setErrors] = useState({});
  const [isLoading, setIsLoading] = useState(false);
  const navigate = useNavigate();
  const { setUser } = useUser(); // ✅ Hook correctamente utilizado

  const validateForm = () => {
    const errors = {};
    if (!email) {
      errors.email = "El email es obligatorio";
    } else if (!/\S+@\S+\.\S+/.test(email)) {
      errors.email = "Email inválido";
    }
    if (!password) {
      errors.password = "La contraseña es obligatoria";
    }
    return errors;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const validationErrors = validateForm();
    if (Object.keys(validationErrors).length > 0) {
      setErrors(validationErrors);
      return;
    }

    setIsLoading(true);
    
    try {
      const { data } = await axios.post(`${import.meta.env.VITE_API_URL}/api/user/login`, {
        email,
        password,
      });

      if (data.success) {
        toast.success("¡Bienvenido de vuelta!");
        sessionStorage.setItem("authToken", data.token);
        
        // ✅ Actualización del contexto de usuario
        setUser({ 
          isLoggedIn: true, 
          userData: {
            ...data.user,
            avatar: data.user.avatar || "/img1.png"
          }
        });

        navigate("/homeScreen");
      }
    } catch (error) {
      console.error("Error:", error);
      toast.error(error.response?.data?.message || "Credenciales incorrectas");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 flex items-center justify-center p-4">
      <div className="w-full max-w-md bg-white rounded-2xl shadow-lg p-8 transition-all duration-300 hover:shadow-xl">


        <h2 className="text-3xl font-bold text-gray-800 text-center mb-8">
          Iniciar Sesión
        </h2>

        <form onSubmit={handleSubmit} className="space-y-6">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Correo Electrónico
            </label>
            <div className="relative">
              <FiMail className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
              <input
                type="email"
                value={email}
                onChange={(e) => {
                  setEmail(e.target.value);
                  setErrors({ ...errors, email: "" });
                }}
                className={`w-full pl-10 pr-4 py-3 rounded-lg border ${
                  errors.email ? "border-red-500" : "border-gray-200"
                } focus:ring-2 focus:ring-blue-500 focus:border-transparent`}
                placeholder="tucorreo@ejemplo.com"
              />
            </div>
            {errors.email && (
              <p className="text-red-500 text-sm mt-2 flex items-center">
                <FiAlertCircle className="mr-1" /> {errors.email}
              </p>
            )}
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Contraseña
            </label>
            <div className="relative">
              <FiLock className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
              <input
                type="password"
                value={password}
                onChange={(e) => {
                  setPassword(e.target.value);
                  setErrors({ ...errors, password: "" });
                }}
                className={`w-full pl-10 pr-4 py-3 rounded-lg border ${
                  errors.password ? "border-red-500" : "border-gray-200"
                } focus:ring-2 focus:ring-blue-500 focus:border-transparent`}
                placeholder="••••••••"
              />
            </div>
            {errors.password && (
              <p className="text-red-500 text-sm mt-2 flex items-center">
                <FiAlertCircle className="mr-1" /> {errors.password}
              </p>
            )}
          </div>

          <button
            type="submit"
            disabled={isLoading}
            className={`w-full py-3 px-4 rounded-lg bg-blue-600 text-white font-semibold transition-all ${
              isLoading 
                ? "opacity-75 cursor-not-allowed" 
                : "hover:bg-blue-700 hover:shadow-md"
            }`}
          >
            {isLoading ? "Cargando..." : "Iniciar Sesión"}
          </button>

          <div className="text-center mt-6">
            <span className="text-gray-600">¿No tienes cuenta? </span>
            <Link
              to="/signUp"
              className="text-blue-600 hover:text-blue-800 font-medium transition-colors"
            >
              Regístrate aquí
            </Link>
          </div>
        </form>
      </div>
    </div>
  );
};

export default Login;