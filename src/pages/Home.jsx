import React, { useEffect, useState } from "react";
import { useUser } from "../context/UserContext";
import { Link, useNavigate } from "react-router-dom";
import { FaPlus, FaMinus } from "react-icons/fa";
import bannerDesktop from "../assets/banner.jpg";
import bannerMobile from "../assets/banner-mobile.jpg";
import logo from "../assets/ib.png";
import Footer from "../components/Footer";
import {  FaTag, FaStar } from 'react-icons/fa6';
const Home = ({ searchQuery = "" }) => {
  const [products, setProducts] = useState([]);
  const [filteredProducts, setFilteredProducts] = useState([]);
  const [cart, setCart] = useState([]);
  const { user } = useUser();
  const navigate = useNavigate();

  // Obtener productos desde la API
  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const response = await fetch(`${import.meta.env.VITE_API_URL}/api/products`);
        const data = await response.json();
  
        // Ordenar productos por created_at (más recientes primero)
        const sortedProducts = data.sort((a, b) => new Date(b.created_at) - new Date(a.created_at));
  
        setProducts(sortedProducts);
        setFilteredProducts(sortedProducts); // Mostrar productos ordenados
      } catch (error) {
        console.error("Error al obtener productos:", error);
      }
    };
    fetchProducts();
  }, []);

  // Filtrar productos cuando searchQuery cambie
  useEffect(() => {
    if (searchQuery.trim() === "") {
      // Si la búsqueda está vacía, mostrar todos los productos
      setFilteredProducts(products);
    } else {
      // Filtrar productos que coincidan con la búsqueda
      const filtered = products.filter((product) =>
        product.name.toLowerCase().includes(searchQuery.toLowerCase())
      );
      setFilteredProducts(filtered);
    }
  }, [searchQuery, products]);

  // Cargar carrito desde sessionStorage
  useEffect(() => {
    const savedCart = JSON.parse(sessionStorage.getItem("cart")) || [];
    setCart(savedCart);
  }, []);

  // Escuchar eventos de actualización del carrito
  useEffect(() => {
    const handleCartUpdate = () => {
      const updatedCart = JSON.parse(sessionStorage.getItem("cart")) || [];
      setCart(updatedCart);
    };
    window.addEventListener("cartUpdated", handleCartUpdate);
    return () => window.removeEventListener("cartUpdated", handleCartUpdate);
  }, []);

  // Actualizar el carrito y sessionStorage
  const updateCart = (newCart) => {
    setCart(newCart);
    sessionStorage.setItem("cart", JSON.stringify(newCart));
    window.dispatchEvent(new Event("cartUpdated"));
  };

  // Añadir producto al carrito
  const addToCart = (product) => {
    if (!user) return;
    const existingProduct = cart.find((item) => item.id === product.id);
    if (existingProduct) {
      const updatedCart = cart.map((item) =>
        item.id === product.id ? { ...item, quantity: item.quantity + 1 } : item
      );
      updateCart(updatedCart);
    } else {
      updateCart([...cart, { ...product, quantity: 1 }]);
    }
  };

  // Eliminar producto del carrito
  const removeFromCart = (productId) => {
    const updatedCart = cart
      .map((item) =>
        item.id === productId ? { ...item, quantity: item.quantity - 1 } : item
      )
      .filter((item) => item.quantity > 0);
    updateCart(updatedCart);
  };

  return (
    <div className="max-w-7xl mx-auto p-4 sm:p-6">
      {/* Banner Promocional */}
      <div className="w-full mb-6 sm:mb-8">
        <img
          src={bannerMobile}
          alt="Oferta especial"
          className="w-full sm:hidden rounded-lg shadow-md"
        />
        <img
          src={bannerDesktop}
          alt="Oferta especial"
          className="w-full hidden sm:block rounded-lg shadow-md"
        />
      </div>

      {/* Lista de Productos */}
      <div className="grid grid-cols-2 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6">
        {filteredProducts.map((product) => {
          const cartItem = cart.find((item) => item.id === product.id);
          const discountedPrice = product.price * (1 - product.discount / 100);

          return (
            <div
              key={product.id}
              className="bg-white rounded-lg shadow-lg overflow-hidden hover:shadow-xl transition-all p-3 sm:p-4 flex flex-col relative border border-gray-200"
            >
              {/* Etiquetas superiores */}
              <div className="flex flex-col sm:flex-row sm:justify-between items-start mb-2 gap-1">
  {product.discount > 0 && (
    <div className="flex items-center bg-red-500 text-white px-3 py-1 rounded-full text-xs sm:text-sm font-bold gap-1">
      <FaTag className="text-sm" />
      <span>{product.discount}% OFF</span>
    </div>
  )}
</div>

              {/* Contenedor de imagen ajustado */}
              <div className="relative w-full h-32 sm:h-40 overflow-hidden mb-3 sm:mb-4">
                <img
                  src={
                    product.image.startsWith("[")
                      ? JSON.parse(product.image)[0]
                      : product.image
                  }
                  alt={product.name}
                  className="w-full h-full object-contain cursor-pointer hover:scale-105 transition-transform duration-300"
                  onClick={() => navigate(`/products/${product.id}`)}
                />
              </div>

              {/* Contenido inferior */}
              <div className="flex flex-col flex-grow">
  <h3 className="font-semibold text-base sm:text-lg cursor-pointer hover:text-blue-600 line-clamp-2 text-left mb-2 sm:mb-3">
    {product.name}
  </h3>

  <div className="mt-auto">
    <div className="flex flex-col sm:flex-row sm:justify-between items-start sm:items-center gap-2">
      {/* Precios */}
      <div className="flex flex-col">
        {product.discount > 0 && (
          <span className="text-gray-400 line-through text-sm sm:text-base">
            ${product.price.toFixed(2)}
          </span>
        )}
        <span
          className="text-lg sm:text-xl font-bold"
          style={{ color: "rgb(0, 0, 0)" }} // Aplicar el color personalizado
        >
          ${discountedPrice.toFixed(2)}
        </span>
      </div>

      {/* Botones */}
      {user && (
        <div className="w-full sm:w-auto">
          {cartItem ? (
            <div className="flex items-center justify-between sm:justify-start gap-2">
              <button
                onClick={() => removeFromCart(product.id)}
                className="bg-red-500 text-white p-2 rounded-lg hover:bg-red-600 transition"
              >
                <FaMinus size={14} />
              </button>
              <span className="font-bold text-base sm:text-lg">{cartItem.quantity}</span>
              <button
                onClick={() => addToCart(product)}
                className="bg-green-500 text-white p-2 rounded-lg hover:bg-green-600 transition"
                disabled={product.stock === 0}
              >
                <FaPlus size={14} />
              </button>
            </div>
          ) : (
            <button
              onClick={() => addToCart(product)}
              className="w-full bg-blue-600 text-white py-2 rounded-lg hover:bg-blue-700 transition disabled:opacity-50 flex items-center justify-center gap-1 text-sm sm:text-base"
              disabled={product.stock === 0}
            >
              <FaPlus className="text-xs sm:text-sm" />
              {product.stock > 0 ? "Añadir" : "Agotado"}
            </button>
          )}
        </div>
      )}
    </div>
  </div>
</div>
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default Home;