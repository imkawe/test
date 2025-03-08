import React, { useEffect, useRef, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { FaAngleRight, FaAngleLeft, FaPlus, FaMinus, FaTag, FaStar } from 'react-icons/fa6';
import { useUser } from '../context/UserContext';
import image1 from '../assets/minute_delivery.png';
import image2 from '../assets/Best_Prices_Offers.png';
import image3 from '../assets/Wide_Assortment.png';

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
  const imageContainer = useRef();

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

  const parseDetails = () => {
    try {
      const details = product?.more_details 
        ? typeof product.more_details === 'string'
          ? JSON.parse(product.more_details)
          : product.more_details
        : {};
      return {
        colors: details.colors || [],
        sizes: details.sizes || [],
        colorImages: details.colorImages || {},
        inventory: details.inventory || {},
        specs: details.specs || {},
        rating: details.rating || null
      };
    } catch (error) {
      console.error('Error parsing details:', error);
      return {
        colors: [],
        sizes: [],
        colorImages: {},
        inventory: {},
        specs: {},
        rating: null
      };
    }
  };

  const details = parseDetails();
  const { colors, sizes, inventory, specs, rating, colorImages } = details;
  const availableSizes = selectedColor 
    ? sizes.filter(size => inventory[selectedColor]?.[size] > 0)
    : sizes;

  useEffect(() => {
    const fetchProduct = async () => {
      try {
        const response = await fetch(`${import.meta.env.VITE_API_URL}/api/products/${id}`);
        if (!response.ok) throw new Error('Producto no encontrado');
        const data = await response.json();
        
        setProduct({
          ...data,
          image: processImage(data.image)
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

  useEffect(() => {
    if (selectedColor && colorImages[selectedColor]) {
      setVariantImages(processImage(colorImages[selectedColor]));
    } else {
      setVariantImages(processImage(product?.image));
    }
    setImageIndex(0);
  }, [selectedColor, product]);

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

  const getVariantStock = () => {
    if (selectedColor && selectedSize) {
      return inventory[selectedColor]?.[selectedSize] || 0;
    }
    if (selectedColor && sizes.length === 0) {
      return inventory[selectedColor] || 0;
    }
    if (selectedColor && sizes.length > 0) {
      return Object.values(inventory[selectedColor] || {}).reduce((a, b) => a + b, 0);
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

  const calculateSavings = (quantity = 1) => {
    return (product?.price * (product.discount / 100) * quantity).toFixed(2);
  };

  const addToCart = () => {
    if (!user || !product) return;
    
    if (colors.length > 0 && !selectedColor) {
      alert('Por favor selecciona un color');
      return;
    }
    if (sizes.length > 0 && !selectedSize) {
      alert('Por favor selecciona una talla');
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
      quantity: 1
    };

    const existingIndex = cart.findIndex(item => 
      item.id === cartProduct.id &&
      item.color === cartProduct.color &&
      item.size === cartProduct.size
    );

    const newCart = [...cart];
    if (existingIndex > -1) {
      newCart[existingIndex].quantity += 1;
    } else {
      newCart.push(cartProduct);
    }

    updateCart(newCart);
  };

  const removeFromCart = () => {
    const existingIndex = cart.findIndex(item => 
      item.id === product?.id &&
      item.color === selectedColor &&
      item.size === selectedSize
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

  const handleScroll = (direction) => {
    imageContainer.current?.scrollBy({ 
      left: direction * 200, 
      behavior: 'smooth' 
    });
  };

  const handleMouseMove = (e) => {
    const rect = e.currentTarget.getBoundingClientRect();
    const x = ((e.clientX - rect.left) / rect.width) * 100;
    const y = ((e.clientY - rect.top) / rect.height) * 100;
    setZoomStyle({ 
      transformOrigin: `${x}% ${y}%`, 
      transform: 'scale(2)' 
    });
  };

  const handleMouseLeave = () => {
    setZoomStyle({ transform: 'scale(1)' });
  };

  if (!product) return (
    <div className="text-center py-20 text-gray-600">
      Cargando detalles del producto...
    </div>
  );

  const finalPrice = product.discount > 0
    ? (product.price * (1 - product.discount / 100)).toFixed(2)
    : product.price.toFixed(2);

  const imagesToShow = variantImages.length ? variantImages : processImage(product.image);
  const mainImage = imagesToShow[imageIndex] || '/placeholder.jpg';

  return (
    <section className="container mx-auto px-4 py-8 max-w-6xl">
      {/* Galería de Imágenes */}
      <div className="grid lg:grid-cols-2 gap-6">
        <div className="space-y-4">
          <div className="relative group bg-white rounded-lg shadow-md overflow-hidden border border-gray-100">
            <div
              className="h-96 relative transition-transform duration-300"
              onMouseMove={handleMouseMove}
              onMouseLeave={handleMouseLeave}
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
                    onClick={() => handleScroll(-1)}
                    className="p-2 bg-white/90 backdrop-blur-sm shadow-md rounded-full pointer-events-auto transform -translate-x-2 hover:-translate-x-3 transition-all hover:bg-emerald-50"
                  >
                    <FaAngleLeft className="text-lg text-gray-700" />
                  </button>
                  <button
                    onClick={() => handleScroll(1)}
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
          {/* Nombre del Producto y SKU */}
          <div>
            <h1 className="text-3xl font-bold text-gray-900 mb-2">
              {product.name}
            </h1>
            <p className="text-sm text-gray-500">
              SKU: HDK8566698ID{product.id}
            </p>
          </div>

          {/* Precio y Descuento */}
          <div className="bg-gray-50 p-6 rounded-lg shadow-sm border border-gray-100">
            <div className="space-y-4">
              <div className="flex items-baseline gap-4">
                <span className="text-3xl font-bold text-gray-900">
                  ${finalPrice}
                </span>
                {product.discount > 0 && (
                  <div className="flex flex-col">
                    <span className="text-gray-400 line-through text-lg">
                      ${product.price.toFixed(2)}
                    </span>
                    <div className="flex gap-2 items-center text-emerald-600">
                      <FaTag className="text-sm" />
                      <span className="font-bold">
                        Ahorras ${calculateSavings()}
                        {cartItem?.quantity > 1 && (
                          <span> (${calculateSavings(cartItem.quantity)} total)</span>
                        )}
                      </span>
                    </div>
                  </div>
                )}
              </div>
              <div className="flex items-center gap-2 text-sm">
                <span className="text-emerald-600 font-bold">
                  Envío gratis en 24/48h
                </span>
              </div>
            </div>
      
            {user ? (
              <div className="space-y-5 mt-6">
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
                            Ahorro total: ${calculateSavings(cartItem.quantity)}
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
                {(colors.length > 0 || sizes.length > 0) && (
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
    
          {Object.keys(specs).length > 0 && (
            <div className="pt-6 border-t border-gray-200">
              <h2 className="text-2xl font-bold text-gray-900 mb-4">Especificaciones</h2>
              <dl className="grid grid-cols-2 gap-4">
                {Object.entries(specs).map(([key, value]) => (
                  <div className="col-span-1 bg-gray-50 p-3 rounded-lg" key={key}>
                    <dt className="text-gray-500 capitalize text-sm">{key}:</dt>
                    <dd className="font-bold text-gray-900">{value}</dd>
                  </div>
                ))}
              </dl>
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
              <h3 className="font-bold text-lg text-gray-900 mb-2">
                Entrega rápida
              </h3>
              <p className="text-gray-600">
                Recibe tu pedido en la puerta de tu casa más rápido que nunca.
              </p>
            </div>
          </div>
          <div className="bg-white p-5 rounded-lg shadow-sm hover:shadow-md transition-all border border-gray-100 flex flex-col items-center text-center">
            <img src={image2} alt="Mejores precios y ofertas" className="w-16 h-16 mb-4" />
            <div>
              <h3 className="font-bold text-lg text-gray-900 mb-2">
                Mejores precios y ofertas
              </h3>
              <p className="text-gray-600">
                Los mejores precios con ofertas directas de los fabricantes.
              </p>
            </div>
          </div>
          <div className="bg-white p-5 rounded-lg shadow-sm hover:shadow-md transition-all border border-gray-100 flex flex-col items-center text-center">
            <img src={image3} alt="Amplia variedad" className="w-16 h-16 mb-4" />
            <div>
              <h3 className="font-bold text-lg text-gray-900 mb-2">
              Nuestros productos pasan rigurosas pruebas de calidad antes de llegar a ti.

              </h3>
              <p className="text-gray-600">
              Explora una amplia selección de artículos en cuidado personal, hogar, tecnología y mucho más.
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