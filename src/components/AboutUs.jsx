import React from 'react';
import { FaShippingFast, FaHandHoldingUsd, FaRecycle, FaShieldAlt, FaSmile, FaHeart } from 'react-icons/fa';
import logo from "../assets/ibxx.png";
import { Link } from 'react-router-dom';
const AboutUs = () => {
  return (
    <div className="min-h-screen bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
      {/* Hero Section */}
      <div className="max-w-7xl mx-auto text-center mb-16">
        <h1 className="text-4xl font-extrabold text-gray-900 sm:text-5xl md:text-6xl">
          <span className="block" style={{ color: '#4b5ae4' }}>Tu aliado en compras inteligentes</span>
        </h1>
        <p className="mt-3 max-w-md mx-auto text-base text-gray-500 sm:text-lg md:mt-5 md:text-xl md:max-w-3xl">
          Encontrando lo esencial a precios que hacen sonreír a tu bolsillo
        </p>
      </div>

      {/* Nuestra Misión */}
      <div className="max-w-7xl mx-auto mb-20">
        <div className="bg-white rounded-2xl shadow-xl p-8 md:p-12 lg:flex">
          <div className="lg:w-1/2">
            <img 
              src={logo} 
              alt="Nuestra tienda" 
              className="rounded-lg h-64 w-full object-cover"
            />
          </div>
          <div className="lg:w-1/2 lg:pl-12 mt-8 lg:mt-0">
            <h2 className="text-3xl font-extrabold text-gray-900 mb-6">
              ¿Por qué existimos?
            </h2>
            <p className="text-lg text-gray-500 mb-6">
              En un mundo donde cada centavo cuenta, nos propusimos crear un espacio donde 
              calidad y economía van de la mano. Somos más que una tienda - somos 
              solucionadores de problemas cotidianos.
            </p>
            <div className="flex items-center mb-4">
              <FaHandHoldingUsd className="text-[#4b5ae4] text-2xl mr-3" />
              <span className="text-gray-700 font-medium">Precios imbatibles</span>
            </div>
            <div className="flex items-center mb-4">
              <FaShippingFast className="text-[#4b5ae4] text-2xl mr-3" />
              <span className="text-gray-700 font-medium">Envíos rápidos y económicos</span>
            </div>
            <div className="flex items-center">
              <FaRecycle className="text-[#4b5ae4] text-2xl mr-3" />
              <span className="text-gray-700 font-medium">Productos duraderos y prácticos</span>
            </div>
          </div>
        </div>
      </div>

      {/* Nuestros Valores */}
      <div className="max-w-7xl mx-auto mb-20">
        <h2 className="text-3xl font-extrabold text-center text-gray-900 mb-12">
          Pilares de nuestra filosofía
        </h2>
        <div className="grid md:grid-cols-3 gap-8">
          <div className="bg-white p-6 rounded-xl shadow-lg">
            <div className="text-[#4b5ae4] text-4xl mb-4">
              <FaShieldAlt />
            </div>
            <h3 className="text-xl font-bold mb-3">Transparencia Absoluta</h3>
            <p className="text-gray-600">
              Sin costos ocultos, sin sorpresas. Lo que ves es lo que pagas, siempre.
            </p>
          </div>

          <div className="bg-white p-6 rounded-xl shadow-lg">
            <div className="text-[#4b5ae4] text-4xl mb-4">
              <FaHeart />
            </div>
            <h3 className="text-xl font-bold mb-3">Comunidad First</h3>
            <p className="text-gray-600">
              Tus sugerencias moldean nuestro catálogo. ¡Juntos encontramos las mejores soluciones!
            </p>
          </div>

          <div className="bg-white p-6 rounded-xl shadow-lg">
            <div className="text-[#4b5ae4] text-4xl mb-4">
              <FaSmile />
            </div>
            <h3 className="text-xl font-bold mb-3">Felicidad Garantizada</h3>
            <p className="text-gray-600">
              Si no amas tu compra, te devolvemos cada centavo. Sin preguntas.
            </p>
          </div>
        </div>
      </div>

      {/* Compromiso */}
      <div className="max-w-7xl mx-auto text-white rounded-2xl p-8 md:p-12 text-center" style={{ backgroundColor: '#4b5ae4' }}>
        <h2 className="text-3xl font-bold mb-6">Nuestra Promesa</h2>
        <p className="text-lg mb-6">
          "En cada producto que ofrecemos, buscamos ese punto mágico donde 
          lo accesible se encuentra con lo indispensable"
        </p>
        <div className="grid md:grid-cols-3 gap-6">
          <div>
            <div className="text-4xl mb-2">✓</div>
            <p>Devoluciones fáciles en 30 días</p>
          </div>
          <div>
            <div className="text-4xl mb-2">🔒</div>
            <p>Pagos 100% seguros</p>
          </div>
          <div>
            <div className="text-4xl mb-2">🛎️</div>
            <p>Soporte personalizado 24/7</p>
          </div>
        </div>
      </div>

      {/* Llamado a la acción */}
      <div className="max-w-7xl mx-auto mt-20 text-center">
        <h2 className="text-2xl font-bold text-gray-900 mb-4">
          ¿Listo para comprar diferente?
        </h2>
        <p className="text-gray-600 mb-8">
          Descubre por qué miles de personas eligen nuestra tienda para sus necesidades diarias
        </p>
        <button
  className="text-white px-8 py-3 rounded-lg text-lg font-semibold hover:bg-[#3a48b7] transition-colors"
  style={{ backgroundColor: '#4b5ae4' }}
>
  <Link to="/" className="text-white no-underline">
    Explora Nuestros Productos
  </Link>
</button>
      </div>
    </div>
  );
};

export default AboutUs;