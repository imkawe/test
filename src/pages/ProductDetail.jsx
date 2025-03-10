import React, { useEffect, useRef, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { FaAngleRight, FaAngleLeft, FaPlus, FaMinus, FaTag, FaAmazon } from 'react-icons/fa6';
import { useUser } from '../context/UserContext';
import image1 from '../assets/minute_delivery.png';
import image2 from '../assets/Best_Prices_Offers.png';
import image3 from '../assets/Wide_Assortment.png';
import { toast } from 'react-toastify';
const ProductDetail = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { user } = useUser();
  const [cart, setCart] = useState([]);
  const [product, setProduct] = useState(null);
  const [imageIndex, setImageIndex] = useState(0);
  const [zoomStyle, setZoomStyle] = useState({});
  const [selectedColor, setSelectedColor] = useState('');
  const [selectedSize, setSelectedSize] = useState('');
  const [variantImages, setVariantImages] = useState([]);
  const [touchStartX, setTouchStartX] = useState(null);
  const imageContainer = useRef();
  const [selectedBundle, setSelectedBundle] = useState('');
  // Procesar imágenes
  const processImage = (image) => {
    if (Array.isArray(image)) return image;
    if (typeof image === 'string' && image.startsWith("[")) {
      try {
        return JSON.parse(image);
      } catch {
        return [image];
      }
    }
    return [image];
  };

  // Fetch del producto
  useEffect(() => {
    const fetchProduct = async () => {
      try {
        const response = await fetch(`${import.meta.env.VITE_API_URL}/api/products/${id}`);
        if (!response.ok) throw new Error('Producto no encontrado');
        const data = await response.json();
        
        // Parsear more_details si es necesario
        const moreDetails = typeof data.more_details === 'string' 
          ? JSON.parse(data.more_details) 
          : data.more_details || {};
        
        setProduct({ 
          ...data, 
          image: processImage(data.image),
          more_details: moreDetails,
        });
        
        setSelectedColor('');
        setSelectedSize('');
      } catch (error) {
        console.error('Error fetching product:', error);
        navigate('/404');
      }
    };
    fetchProduct();
  }, [id, navigate]);

  // Actualizar imágenes al cambiar el color
  useEffect(() => {
    if (selectedColor && product?.more_details?.colorImages?.[selectedColor]) {
      const colorImages = product.more_details.colorImages[selectedColor];
      setVariantImages(Array.isArray(colorImages) ? colorImages : [colorImages]);
    } else {
      setVariantImages(Array.isArray(product?.image) ? product.image : [product?.image]);
    }
    setImageIndex(0);
  }, [selectedColor, product]);

  // Cargar el carrito desde sessionStorage
  useEffect(() => {
    const loadCart = () => {
      try {
        const savedCart = JSON.parse(sessionStorage.getItem("cart") || '[]');
        setCart(savedCart);
      } catch (error) {
        console.error('Error loading cart:', error);
        sessionStorage.removeItem("cart");
        setCart([]);
      }
    };
    loadCart();
  }, []);

  // Actualizar el carrito
  const updateCart = (newCart) => {
    const validCart = newCart.filter(item => 
      item?.id &&
      typeof item.quantity === 'number' &&
      item.quantity > 0 &&
      item.stock >= item.quantity
    );
    
    setCart(validCart);
    sessionStorage.setItem("cart", JSON.stringify(validCart));
    window.dispatchEvent(new Event("cartUpdated"));
  };

  // Calcular el stock disponible
  const getVariantStock = () => {
    const { more_details } = product || {};
    if (selectedColor && selectedSize) {
      return more_details?.inventory?.[selectedColor]?.[selectedSize] || 0;
    }
    if (selectedColor && more_details?.sizes?.length === 0) {
      return more_details?.inventory?.[selectedColor] || 0;
    }
    if (selectedColor && more_details?.sizes?.length > 0) {
      return Object.values(more_details?.inventory?.[selectedColor] || {}).reduce((a, b) => a + b, 0);
    }
    return product?.stock || 0;
  };

  const currentStock = getVariantStock();
  const cartItem = cart.find(item => 
    item.id === product?.id &&
    item.color === selectedColor &&
    item.size === selectedSize
  );

  const remainingStock = currentStock - (cartItem?.quantity || 0);

  // Añadir al carrito
  const addToCart = () => {
    if (!user || !product) return;
    
    if (product?.more_details?.colors?.length > 0 && !selectedColor) {
      toast.error('Por favor selecciona un color', {
        position: "top-right",
        autoClose: 3000,
        hideProgressBar: false,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
      });
      return;
    }
    if (product?.more_details?.sizes?.length > 0 && !selectedSize) {
 
      toast.error('Por favor selecciona una talla', {
        position: "top-right",
        autoClose: 3000,
        hideProgressBar: false,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
      });
      return;
    }
    if (more_details?.bundle?.length > 0 && !selectedBundle) {

      toast.error('Por favor selecciona un bundle', {
        position: "top-right",
        autoClose: 3000,
        hideProgressBar: false,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
      });
      return;
    }

    const cartProduct = {
      id: product.id,
      name: product.name,
      price: product.price,
      image: variantImages[0] || product.image[0],
      discount: product.discount || 0,
      stock: currentStock,
      color: selectedColor,
      size: selectedSize,
      bundle: selectedBundle, // Incluir el bundle seleccionado
      quantity: 1,
    };

    const existingIndex = cart.findIndex(item => 
      item.id === cartProduct.id &&
      item.color === cartProduct.color &&
      item.size === cartProduct.size &&
      item.bundle === cartProduct.bundle // Verificar también el bundle
    );

    const newCart = [...cart];
    if (existingIndex > -1) {
      newCart[existingIndex].quantity += 1;
    } else {
      newCart.push(cartProduct);
    }

    updateCart(newCart);
  };

  // Eliminar del carrito
  const removeFromCart = () => {
    const existingIndex = cart.findIndex(item => 
      item.id === product?.id &&
      item.color === selectedColor &&
      item.size === selectedSize &&
      item.bundle === selectedBundle // Verificar también el bundle
    );

    if (existingIndex === -1) return;

    const newCart = [...cart];
    if (newCart[existingIndex].quantity > 1) {
      newCart[existingIndex].quantity -= 1;
    } else {
      newCart.splice(existingIndex, 1);
    }

    updateCart(newCart);
  };

  // Renderizar el componente
  if (!product) return (
    <div className="text-center py-20 text-gray-600">
      Cargando detalles del producto...
    </div>
  );

  const { more_details } = product;
  const finalPrice = product.discount > 0
    ? (product.price * (1 - product.discount / 100)).toFixed(2)
    : product.price.toFixed(2);

  const imagesToShow = variantImages.length ? variantImages : (Array.isArray(product.image) ? product.image : [product.image]);
  const mainImage = imagesToShow[imageIndex] || '/placeholder.jpg';

  return (
    <section className="container mx-auto px-4 py-8 max-w-6xl">
      <div className="grid lg:grid-cols-2 gap-6">
        {/* Galería de Imágenes */}
        <div className="space-y-4">
          <div className="relative group bg-white rounded-lg shadow-md overflow-hidden border border-gray-100">
            <div
              className="h-96 relative transition-transform duration-300"
              onMouseMove={(e) => {
                const rect = e.currentTarget.getBoundingClientRect();
                const x = ((e.clientX - rect.left) / rect.width) * 100;
                const y = ((e.clientY - rect.top) / rect.height) * 100;
                setZoomStyle({ transformOrigin: `${x}% ${y}%`, transform: 'scale(2)' });
              }}
              onMouseLeave={() => setZoomStyle({ transform: 'scale(1)' })}
              onTouchStart={(e) => setTouchStartX(e.touches[0].clientX)}
              onTouchMove={(e) => {
                if (!touchStartX) return;
                const touchEndX = e.touches[0].clientX;
                const deltaX = touchEndX - touchStartX;

                if (deltaX > 50) {
                  setImageIndex((prev) => (prev > 0 ? prev - 1 : imagesToShow.length - 1));
                  setTouchStartX(null);
                } else if (deltaX < -50) {
                  setImageIndex((prev) => (prev < imagesToShow.length - 1 ? prev + 1 : 0));
                  setTouchStartX(null);
                }
              }}
              onTouchEnd={() => setTouchStartX(null)}
            >
              <img
                src={mainImage}
                className="w-full h-full object-contain transition-all duration-300"
                style={zoomStyle}
                alt={product.name}
              />
              {product.discount > 0 && (
                <div className="absolute top-3 left-3 bg-gradient-to-r from-red-600 to-red-500 text-white px-3 py-1.5 rounded-full flex items-center gap-2 shadow-lg transform -rotate-2">
                  <FaTag className="text-sm" />
                  <span className="font-bold">{product.discount}% OFF</span>
                </div>
              )}
            </div>
          </div>

          {imagesToShow.length > 1 && (
            <div className="relative">
              <div className="flex justify-center gap-2 mb-3">
                {imagesToShow.map((_, index) => (
                  <button
                    key={`indicator-${index}`}
                    className={`h-2 w-8 rounded-full transition-all ${
                      index === imageIndex ? 'bg-emerald-600' : 'bg-gray-200 hover:bg-gray-300'
                    }`}
                    onClick={() => setImageIndex(index)}
                    aria-label={`Ver imagen ${index + 1}`}
                  />
                ))}
              </div>

              <div className="relative group">
                <div
                  ref={imageContainer}
                  className="flex gap-3 overflow-x-auto scrollbar-hide pb-4"
                >
                  {imagesToShow.map((img, index) => (
                    <button
                      key={img + index}
                      onClick={() => setImageIndex(index)}
                      className={`flex-shrink-0 w-16 h-16 transition-all duration-300 ${
                        index === imageIndex 
                          ? "ring-2 ring-emerald-500 scale-105 shadow-md" 
                          : "opacity-75 hover:opacity-100 hover:ring-1 ring-gray-200"
                      } rounded-lg overflow-hidden`}
                    >
                      <img
                        src={img}
                        alt={`Miniatura ${index + 1}`}
                        className="w-full h-full object-cover"
                      />
                    </button>
                  ))}
                </div>

                <div className="absolute inset-0 flex items-center justify-between pointer-events-none">
                  <button
                    onClick={() => imageContainer.current?.scrollBy({ left: -200, behavior: 'smooth' })}
                    className="p-2 bg-white/90 backdrop-blur-sm shadow-md rounded-full pointer-events-auto transform -translate-x-2 hover:-translate-x-3 transition-all hover:bg-emerald-50"
                  >
                    <FaAngleLeft className="text-lg text-gray-700" />
                  </button>
                  <button
                    onClick={() => imageContainer.current?.scrollBy({ left: 200, behavior: 'smooth' })}
                    className="p-2 bg-white/90 backdrop-blur-sm shadow-md rounded-full pointer-events-auto transform translate-x-2 hover:translate-x-3 transition-all hover:bg-emerald-50"
                  >
                    <FaAngleRight className="text-lg text-gray-700" />
                  </button>
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Detalles del Producto */}
        <div className="space-y-6">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">{product.name}</h1>
          <p className="text-sm text-gray-500">SKU: HDK8566698ID{product.id}</p>

          {/* Precio y Descuento */}
          <div className="bg-gray-50 p-6 rounded-lg shadow-sm border border-gray-100">
            <div className="space-y-4">
              <div className="flex items-baseline gap-4">
                <span className="text-3xl font-bold text-gray-900">${finalPrice}</span>
                {product.discount > 0 && (
                  <div className="flex flex-col">
                    <span className="text-gray-400 line-through text-lg">${product.price.toFixed(2)}</span>
                    <div className="flex gap-2 items-center text-emerald-600">
                      <FaTag className="text-sm" />
                      <span className="font-bold">
                        Ahorras ${(product.price * (product.discount / 100)).toFixed(2)}
                      </span>
                    </div>
                  </div>
                )}
              </div>
              <div className="flex items-center gap-2 text-sm">
                <span className="text-emerald-600 font-bold">Envío gratis en 24/48h</span>
              </div>
            </div>

            {user ? (
              <div className="space-y-5 mt-6">
                {/* Selector de Color */}
                {more_details?.colors?.length > 0 && (
                  <div>
                    <label className="block text-sm font-bold text-gray-900 mb-2">Color:</label>
                    <div className="flex gap-2">
                      {more_details.colors.map((color) => (
                        <button
                          key={color}
                          onClick={() => setSelectedColor(color)}
                          className={`px-4 py-2 rounded-full border ${
                            selectedColor === color ? "bg-emerald-500 text-white" : "bg-white text-gray-700 hover:bg-gray-100"
                          }`}
                        >
                          {color}
                        </button>
                      ))}
                    </div>
                  </div>
                )}

                {/* Selector de Talla */}
                {more_details?.sizes?.length > 0 && (
                  <div>
                    <label className="block text-sm font-bold text-gray-900 mb-2">Talla:</label>
                    <div className="flex gap-2">
                      {more_details.sizes.map((size) => (
                        <button
                          key={size}
                          onClick={() => setSelectedSize(size)}
                          className={`px-4 py-2 rounded-full border ${
                            selectedSize === size ? "bg-emerald-500 text-white" : "bg-white text-gray-700 hover:bg-gray-100"
                          }`}
                        >
                          {size}
                        </button>
                      ))}
                    </div>
                  </div>
                )}

                {/* Botón de añadir al carrito */}
                <div className="flex items-center gap-6">
                  {cartItem ? (
                    <>
                      <div className="flex items-center gap-5 bg-white p-4 rounded-lg shadow-sm">
                        <button
                          onClick={removeFromCart}
                          className="p-3 bg-white border border-gray-200 rounded-lg hover:bg-red-50 hover:border-red-200 transition-all shadow-sm"
                          disabled={cartItem.quantity <= 0}
                        >
                          <FaMinus className="text-red-600" />
                        </button>
                        <span className="font-bold text-2xl text-gray-800 min-w-[2.5rem] text-center">
                          {cartItem.quantity}
                        </span>
                        <button
                          onClick={addToCart}
                          className="p-3 bg-white border border-gray-200 rounded-lg hover:bg-green-50 hover:border-green-200 transition-all shadow-sm"
                          disabled={remainingStock < 1}
                        >
                          <FaPlus className="text-green-600" />
                        </button>
                      </div>
                      <div className="flex flex-col">
                        <span className="text-xl font-bold text-gray-900">
                          Total: ${(finalPrice * cartItem.quantity).toFixed(2)}
                        </span>
                        {product.discount > 0 && (
                          <span className="text-sm font-medium text-emerald-600">
                            Ahorro total: ${(product.price * (product.discount / 100) * cartItem.quantity).toFixed(2)}
                          </span>
                        )}
                      </div>
                    </>
                  ) : (
                    <button
                      onClick={addToCart}
                      className="w-full bg-gradient-to-r from-emerald-600 to-emerald-500 hover:from-emerald-700 hover:to-emerald-600 text-white px-8 py-3 rounded-lg text-lg font-bold transition-all flex items-center justify-center gap-3 shadow-lg transform hover:-translate-y-0.5"
                      disabled={remainingStock < 1}
                    >
                      <FaPlus className="text-xl" />
                      Añadir al carrito
                    </button>
                  )}
                </div>

                {/* Disponibilidad */}
                {(more_details?.colors?.length > 0 || more_details?.sizes?.length > 0) && (
                  <div className="flex items-center gap-3 py-3">
                    <span className="font-bold text-gray-900">Disponibilidad:</span>
                    <span
                      className={`px-3 py-1.5 rounded-full text-sm font-bold ${
                        remainingStock > 0
                          ? 'bg-emerald-100 text-emerald-800'
                          : 'bg-rose-100 text-rose-800'
                      }`}
                    >
                      {remainingStock > 0 
                        ? `✔ ${remainingStock} disponibles` 
                        : '⛔ Stock agotado'}
                    </span>
                  </div>
                )}
              </div>
            ) : (
              <div className="bg-gradient-to-r from-blue-50 to-indigo-50 p-4 rounded-lg shadow-sm border border-blue-100 mt-6">
                <button
                  className="text-blue-800 hover:text-blue-900 font-bold flex items-center gap-2 text-lg"
                  onClick={() => navigate('/login')}
                >
                  🔒 Inicia sesión para comprar
                  <FaAngleRight className="mt-1" />
                </button>
              </div>
            )}
          </div>

          {/* Descripción del Producto */}
          {product.description && (
            <div className="pt-6 border-t border-gray-200">
              <h2 className="text-2xl font-bold text-gray-900 mb-4">Descripción</h2>
              <div className="prose prose-lg text-gray-600 space-y-4">
                {product.description.split('\n').map((line, index) => (
                  <p key={index} className="leading-relaxed">
                    {line}
                  </p>
                ))}
              </div>
            </div>
          )}

          {/* Bundle (Pack) */}
    {/* Selector de Bundle */}
{/* Selector de Bundle */}
{more_details?.bundle?.length > 0 && (
  <div className="mt-6">
    <label className="block text-sm font-bold text-gray-900 mb-2">Bundle (Pack):</label>
    <div className="flex flex-wrap gap-2">
      {more_details.bundle.map((bundle, index) => (
        <button
          key={index}
          onClick={() => setSelectedBundle(bundle)}
          className={`px-4 py-2 rounded-full border ${
            selectedBundle === bundle
              ? "bg-emerald-500 text-white"
              : "bg-white text-gray-700 hover:bg-gray-100"
          }`}
        >
          {bundle}
        </button>
      ))}
    </div>
  </div>
)}

          {/* Material */}
          {more_details?.material && (
            <div className="pt-6 border-t border-gray-200">
              <h2 className="text-2xl font-bold text-gray-900 mb-4">Material</h2>
              {more_details.material.split('\n').map((line, index) => (
                <p key={index} className="text-gray-900">{line.trim()}</p>
              ))}
            </div>
          )}

          {/* Enlace de Amazon */}
          {more_details?.amazon_affiliate_link && (
            <div className="mt-4">
              <a
                href={more_details.amazon_affiliate_link}
                target="_blank"
                rel="noopener noreferrer"
                className="w-full bg-gradient-to-r from-yellow-400 to-yellow-500 hover:from-yellow-500 hover:to-yellow-600 text-white px-8 py-3 rounded-lg text-lg font-bold transition-all flex items-center justify-center gap-3 shadow-lg transform hover:-translate-y-0.5"
              >
                <FaAmazon className="text-xl" />
                Comprar en Amazon
              </a>
              <p className="text-sm text-gray-500 mt-2">
                También puedes comprar este producto en Amazon.
              </p>
            </div>
          )}
        </div>
      </div>

      {/* Why Shop With Us - Horizontal Layout */}
      <div className="mt-12 pt-8 border-t border-gray-200">
        <h2 className="text-2xl font-bold text-gray-900 mb-6 text-center">
          ¿Por qué comprar con nosotros?
        </h2>
        <div className="grid md:grid-cols-3 gap-6">
          <div className="bg-white p-5 rounded-lg shadow-sm hover:shadow-md transition-all border border-gray-100 flex flex-col items-center text-center">
            <img src={image1} alt="Entrega rápida" className="w-16 h-16 mb-4" />
            <div>
              <h3 className="font-bold text-lg text-gray-900 mb-2">Entrega rápida</h3>
              <p className="text-gray-600">
                Recibe tu pedido en la puerta de tu casa más rápido que nunca.
              </p>
            </div>
          </div>
          <div className="bg-white p-5 rounded-lg shadow-sm hover:shadow-md transition-all border border-gray-100 flex flex-col items-center text-center">
            <img src={image2} alt="Mejores precios y ofertas" className="w-16 h-16 mb-4" />
            <div>
              <h3 className="font-bold text-lg text-gray-900 mb-2">Mejores precios y ofertas</h3>
              <p className="text-gray-600">
                Los mejores precios con ofertas directas de los fabricantes.
              </p>
            </div>
          </div>
          <div className="bg-white p-5 rounded-lg shadow-sm hover:shadow-md transition-all border border-gray-100 flex flex-col items-center text-center">
            <img src={image3} alt="Amplia variedad" className="w-16 h-16 mb-4" />
            <div>
              <h3 className="font-bold text-lg text-gray-900 mb-2">Productos probados, calidad garantizada</h3>
              <p className="text-gray-600">
                Una amplia selección de artículos en cuidado personal, tecnología y mucho más.
                ¡Encuentra lo que necesitas con la garantía de calidad que nos respalda!
              </p>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default ProductDetail;