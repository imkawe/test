import { Link } from "react-router-dom";
import { FaFacebook, FaInstagram, FaTwitter,FaPinterest } from "react-icons/fa";
import logo from "../assets/ib.png";

const Footer = () => {
  return (
<footer className="py-10 bg-gray-100 text-gray-800">


      <div className="max-w-6xl mx-auto px-6">
        {/* Contenedor con tres columnas */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 text-center md:text-left">
          {/* Enlaces de navegación */}
          <div className="flex flex-col space-y-3">
            <h3 className="text-lg font-semibold text-gray-700">Enlaces</h3>
            <Link to="/" className="hover:text-blue-600 transition-colors">Inicio</Link>
            <Link to="/about-us" className="hover:text-blue-600 transition-colors">Acerca de Nosotros</Link>
            <Link to="/contact-us" className="hover:text-blue-600 transition-colors">Contacto</Link>
          </div>

          {/* Políticas */}
          <div className="flex flex-col space-y-3">
            <h3 className="text-lg font-semibold text-gray-700">Políticas</h3>
            <Link to="/shipping-policy" className="hover:text-blue-600 transition-colors">
              Política de Envío
            </Link>
            <Link to="/privacy-policy" className="hover:text-blue-600 transition-colors">
              Política de Privacidad
            </Link>
      
          </div>

          {/* Logo y redes sociales alineados a la derecha */}
          <div className="flex flex-col items-center md:items-end">
            <Link to="/" className="flex items-center">
              <img src={logo} alt="Logo de Sptrio" className="h-12 w-auto" />
            </Link>
            <p className="mt-2 text-lg font-semibold text-gray-700">
              La mejor experiencia de compra en línea
            </p>
            <div className="mt-4 flex space-x-4">
              <a href="https://www.facebook.com/profile.php?id=61567131791123" target="_blank" rel="noopener noreferrer" className="text-gray-600 hover:text-blue-600 transition-colors">
                <FaFacebook size={24} />
              </a>
              <a href="https://www.pinterest.com/ibameus" target="_blank" rel="noopener noreferrer" className="text-gray-600 hover:text-red-600 transition-colors">
  <FaPinterest size={24} />
</a>
              <a href="https://x.com/ibames" target="_blank" rel="noopener noreferrer" className="text-gray-600 hover:text-blue-400 transition-colors">
                <FaTwitter size={24} />
              </a>
            </div>
          </div>
        </div>

        {/* Derechos reservados */}
        <div className="mt-8 border-t border-gray-300 pt-4 text-center text-sm text-gray-500">
          &copy; {new Date().getFullYear()} Sptrio. Todos los derechos reservados.
        </div>
      </div>
    </footer>
  );
};

export default Footer;
