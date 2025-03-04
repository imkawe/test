import React, { useEffect, useState } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { useUser } from "../context/UserContext";
import logo from "../assets/ib.png";

const Header = ({ onSearch }) => {
  const location = useLocation();
  const { user, setUser } = useUser();
  const [dropdownVisible, setDropdownVisible] = useState(false);
  const [cart, setCart] = useState([]);
  const [searchQuery, setSearchQuery] = useState("");
  const navigate = useNavigate();

  // Actualizar carrito desde sessionStorage
  const updateCartFromStorage = () => {
    const savedCart = JSON.parse(sessionStorage.getItem("cart")) || [];
    setCart(savedCart);
  };

  useEffect(() => {
    updateCartFromStorage();

    // Escuchar eventos personalizados de actualización
    const handleCartUpdate = () => {
      updateCartFromStorage();
      setCart((prev) => [...prev]); // Forzar re-renderizado
    };

    window.addEventListener("cartUpdated", handleCartUpdate);
    return () => window.removeEventListener("cartUpdated", handleCartUpdate);
  }, []);

  // Cerrar dropdown al hacer click fuera
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (
        !event.target.closest(".profile-container") &&
        !event.target.closest(".mobile-menu-button")
      ) {
        setDropdownVisible(false);
      }
    };
    document.addEventListener("click", handleClickOutside);
    return () => document.removeEventListener("click", handleClickOutside);
  }, []);

  const logout = () => {
    sessionStorage.clear();
    setUser(null);
    setCart([]); // Asumiendo que tienes un estado `cart` y una función `setCart` para manejarlo
    navigate("/");
  };

  // Calcular total de items
  const cartItemsCount = cart.reduce(
    (total, item) => total + (item.quantity || 0),
    0
  );

  // Manejar la búsqueda en tiempo real
  const handleSearchChange = (e) => {
    const query = e.target.value;
    setSearchQuery(query);
    onSearch(query); // Actualiza la búsqueda en tiempo real
  };

  return (
<nav className="fixed top-0 left-0 w-full z-50 bg-white shadow-md px-4 py-3 flex justify-between items-center">
  {/* Logo */}
  <div className="navbar-logo flex items-center gap-4">
    <Link to="/" className="flex items-center">
      <img
        src={logo} // Ruta del logo
        alt="Logo de Sptrio" // Texto alternativo para accesibilidad
        className="h-10 w-auto hidden lg:block" // Oculta el logo en móviles y lo muestra en pantallas grandes
      />
    </Link>
  </div>

      {/* Barra de búsqueda */}
      <div className="flex items-center mx-4 max-w-md sm:max-w-xl w-full"> {/* Ajuste en el ancho máximo */}
  {/* Ícono de Home (visible solo en móviles) */}
  <button
    type="button"
    onClick={() => window.location.href = "/"}
    className="text-gray-500 hover:text-blue-600 mr-2 block sm:hidden"
  >
    <svg
      className="w-6 h-6"
      fill="none"
      stroke="currentColor"
      viewBox="0 0 24 24"
      xmlns="http://www.w3.org/2000/svg"
    >
      <path
        strokeLinecap="round"
        strokeLinejoin="round"
        strokeWidth={2}
        d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6"
      />
    </svg>
  </button>

  {/* Campo de búsqueda */}
  <div className="relative flex-grow sm:w-[45%]"> {/* Ancho mínimo del 45% en pantallas grandes */}
    <input
      type="text"
      placeholder="Buscar..."
      value={searchQuery}
      onChange={handleSearchChange}
      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm placeholder:text-sm"
    />
    <button
      type="button"
      className="absolute right-2 top-1/2 transform -translate-y-1/2 text-gray-500 hover:text-blue-600"
    >
      <svg
        className="w-5 h-5"
        fill="none"
        stroke="currentColor"
        viewBox="0 0 24 24"
        xmlns="http://www.w3.org/2000/svg"
      >
        <path
          strokeLinecap="round"
          strokeLinejoin="round"
          strokeWidth={2}
          d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
        />
      </svg>
    </button>
  </div>
</div>


      {/* Menú de hamburguesa para móviles */}
      <button
        className="lg:hidden p-2 focus:outline-none mobile-menu-button"
        onClick={() => setDropdownVisible(!dropdownVisible)}
      >
        <svg
          className="w-6 h-6 text-gray-700"
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M4 6h16M4 12h16m-7 6h7"
          />
        </svg>
      </button>

      {/* Menú principal */}
      <ul
        className={`lg:flex items-center gap-6 ${
          dropdownVisible ? "block" : "hidden"
        } lg:block`}
      >
        {/* Ícono del carrito en pantallas grandes */}
        <li className="hidden lg:block">
          <Link
            to="/cart"
            className="relative text-gray-700 hover:text-blue-600 transition"
          >
            <svg
              stroke="currentColor"
              fill="currentColor"
              strokeWidth="0"
              viewBox="0 0 16 16"
              className="h-6 w-6"
            >
              <path d="M0 2.5A.5.5 0 0 1 .5 2H2a.5.5 0 0 1 .485.379L2.89 4H14.5a.5.5 0 0 1 .485.621l-1.5 6A.5.5 0 0 1 13 11H4a.5.5 0 0 1-.485-.379L1.61 3H.5a.5.5 0 0 1-.5-.5M3.14 5l.5 2H5V5zM6 5v2h2V5zm3 0v2h2V5zm3 0v2h1.36l.5-2zm1.11 3H12v2h.61zM11 8H9v2h2zM8 8H6v2h2zM5 8H3.89l.5 2H5zm0 5a1 1 0 1 0 0 2 1 1 0 0 0 0-2m-2 1a2 2 0 1 1 4 0 2 2 0 0 1-4 0m9-1a1 1 0 1 0 0 2 1 1 0 0 0 0-2m-2 1a2 2 0 1 1 4 0 2 2 0 0 1-4 0" />
            </svg>

            {cartItemsCount > 0 && (
              <span className="absolute -top-2 -right-2 bg-red-500 text-white text-xs rounded-full h-5 w-5 flex items-center justify-center">
                {cartItemsCount}
              </span>
            )}
          </Link>
        </li>

        {/* Menú de usuario */}
        {user ? (
          <li className="relative profile-container">
            <button
              onClick={() => setDropdownVisible(!dropdownVisible)}
              className="flex items-center gap-2 relative group"
            >
              <img
                src={user.avatar || "/default-profile.png"}
                alt="Profile"
                className="h-8 w-8 rounded-full object-cover border-2 border-gray-200"
              />
              <span className="text-gray-700 font-medium">{user.name}</span>

              {/* Flecha indicadora */}
              <svg
                className={`w-4 h-4 ml-1 transition-transform ${
                  dropdownVisible ? "rotate-180" : ""
                }`}
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M19 9l-7 7-7-7"
                />
              </svg>
            </button>

            {dropdownVisible && (
              <div className="absolute right-0 mt-1 top-full w-48 bg-white rounded-md shadow-xl py-2 z-50 border border-gray-100">
                <Link
                  to="/profile"
                  className="block px-4 py-2.5 text-gray-700 hover:bg-gray-50 transition-colors"
                  onClick={() => setDropdownVisible(false)}
                >
                  Perfil
                </Link>
                {user.role === "ADMIN" && (
                  <Link
                    to="/admin"
                    className="block px-4 py-2.5 text-gray-700 hover:bg-gray-50 transition-colors"
                    onClick={() => setDropdownVisible(false)}
                  >
                    Panel Admin
                  </Link>
                )}
                <Link
                  to="/my-orders"
                  className="block px-4 py-2.5 text-gray-700 hover:bg-gray-50 transition-colors"
                  onClick={() => setDropdownVisible(false)}
                >
                  Mis Órdenes
                </Link>
                <button
                  onClick={() => {
                    logout();
                    setDropdownVisible(false);
                  }}
                  className="w-full text-left px-4 py-2.5 text-gray-700 hover:bg-gray-50 transition-colors border-t border-gray-100 mt-2"
                >
                  Cerrar Sesión
                </button>
              </div>
            )}
          </li>
        ) : (
          <>
            <li>
              <Link
                to="/login"
                className={`px-3 py-2 rounded-md ${
                  location.pathname === "/login"
                    ? "bg-blue-600 text-white"
                    : "text-gray-700 hover:bg-gray-100"
                }`}
              >
                Iniciar Sesión
              </Link>
            </li>
          
          </>
        )}
      </ul>

      {/* Ícono del carrito SOLO en móviles */}
      <Link
        to="/cart"
        className="lg:hidden relative text-gray-700 hover:text-blue-600 transition"
      >
        <svg
          stroke="currentColor"
          fill="currentColor"
          strokeWidth="0"
          viewBox="0 0 16 16"
          className="h-6 w-6"
        >
          <path d="M0 2.5A.5.5 0 0 1 .5 2H2a.5.5 0 0 1 .485.379L2.89 4H14.5a.5.5 0 0 1 .485.621l-1.5 6A.5.5 0 0 1 13 11H4a.5.5 0 0 1-.485-.379L1.61 3H.5a.5.5 0 0 1-.5-.5M3.14 5l.5 2H5V5zM6 5v2h2V5zm3 0v2h2V5zm3 0v2h1.36l.5-2zm1.11 3H12v2h.61zM11 8H9v2h2zM8 8H6v2h2zM5 8H3.89l.5 2H5zm0 5a1 1 0 1 0 0 2 1 1 0 0 0 0-2m-2 1a2 2 0 1 1 4 0 2 2 0 0 1-4 0m9-1a1 1 0 1 0 0 2 1 1 0 0 0 0-2m-2 1a2 2 0 1 1 4 0 2 2 0 0 1-4 0" />
        </svg>

        {cartItemsCount > 0 && (
          <span className="absolute -top-2 -right-2 bg-red-500 text-white text-xs rounded-full h-5 w-5 flex items-center justify-center">
            {cartItemsCount}
          </span>
        )}
      </Link>
    </nav>
  );
};

export default Header;