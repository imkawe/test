import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { FaPlus, FaMinus, FaShoppingBag } from "react-icons/fa";

const Cart = () => {
  const [cart, setCart] = useState([]);

  useEffect(() => {
    const savedCart = JSON.parse(sessionStorage.getItem("cart")) || [];
    setCart(savedCart);
  }, []);

  const updateCart = (newCart) => {
    setCart(newCart);
    sessionStorage.setItem("cart", JSON.stringify(newCart));
    window.dispatchEvent(new Event("cartUpdated"));
  };

  const changeQuantity = (itemId, color, size, bundle, delta) => {
    const newCart = cart
      .map(item => {
        if (
          item.id === itemId &&
          item.color === color &&
          item.size === size &&
          item.bundle === bundle // Verificar también el bundle
        ) {
          return { ...item, quantity: Math.max(0, item.quantity + delta) };
        }
        return item;
      })
      .filter(item => item.quantity > 0);

    updateCart(newCart);
  };

  const parseImage = (image) => {
    if (Array.isArray(image)) return image[0];
    try {
      const parsed = JSON.parse(image);
      return Array.isArray(parsed) ? parsed[0] : image;
    } catch {
      return image || '/placeholder.jpg';
    }
  };

  const calculateDiscountedPrice = (price, discount) => {
    return discount ? (price * (1 - discount / 100)).toFixed(2) : price.toFixed(2);
  };

  const cartSummary = cart.reduce((acc, item) => {
    const discountedPrice = calculateDiscountedPrice(item.price, item.discount);
    return {
      totalOriginal: acc.totalOriginal + (item.price * item.quantity),
      totalDiscounted: acc.totalDiscounted + (discountedPrice * item.quantity),
      totalItems: acc.totalItems + item.quantity,
      totalSavings: acc.totalSavings + ((item.price - discountedPrice) * item.quantity)
    };
  }, { totalOriginal: 0, totalDiscounted: 0, totalItems: 0, totalSavings: 0 });

  return (
    <div className="max-w-4xl mx-auto px-4 py-8 min-h-screen">
      <div className="bg-white rounded-xl shadow-lg p-6 md:p-8">
        <div className="mb-8 text-center">
          <h1 className="text-3xl font-bold text-gray-900 flex items-center justify-center gap-2">
            <FaShoppingBag className="text-emerald-600" />
            Tu Carrito
          </h1>
          <p className="text-gray-500 mt-2">
            {cartSummary.totalItems} artículo{cartSummary.totalItems !== 1 && 's'} en tu carrito
          </p>
        </div>

        {cart.length > 0 ? (
          <div className="space-y-8">
            <div className="space-y-6">
              {cart.map((item) => {
                const discountedPrice = calculateDiscountedPrice(item.price, item.discount);
                
                return (
                  <div 
                    key={`${item.id}-${item.color}-${item.size}-${item.bundle}`}
                    className="flex flex-col md:flex-row items-center gap-6 p-4 bg-white rounded-xl border border-gray-100 shadow-sm"
                  >
                    <div className="w-32 h-32 flex-shrink-0 bg-white p-2 border rounded-lg">
                      <img
                        src={parseImage(item.image)}
                        alt={item.name}
                        className="w-full h-full object-contain"
                      />
                    </div>

                    <div className="flex-1 w-full text-center md:text-left space-y-2">
                      <h3 className="text-lg font-semibold text-gray-900">
                        <Link 
                          to={`/product/${item.id}`}
                          className="hover:text-emerald-600 transition-colors"
                        >
                          {item.name}
                        </Link>
                      </h3>
                      
                      <div className="flex gap-2 text-sm justify-center md:justify-start">
                        {item.color && (
                          <span className="bg-emerald-100 text-emerald-800 px-2 py-1 rounded-full">
                            Color: {item.color}
                          </span>
                        )}
                        {item.size && (
                          <span className="bg-blue-100 text-blue-800 px-2 py-1 rounded-full">
                            Talla: {item.size}
                          </span>
                        )}
                        {item.bundle && (
                          <span className="bg-purple-100 text-purple-800 px-2 py-1 rounded-full">
                            Bundle: {item.bundle}
                          </span>
                        )}
                      </div>

                      <div className="flex items-center gap-2 flex-wrap justify-center md:justify-start">
                        {item.discount > 0 && (
                          <span className="line-through text-gray-400">
                            ${item.price.toFixed(2)}
                          </span>
                        )}
                        <span className="text-emerald-600 font-medium">
                          ${discountedPrice}
                        </span>
                        {item.discount > 0 && (
                          <span className="text-red-500 text-sm">
                            (-{item.discount}%)
                          </span>
                        )}
                      </div>
                    </div>

                    <div className="flex items-center gap-3 bg-gray-50 rounded-full p-2">
                      <button
                        onClick={() => changeQuantity(item.id, item.color, item.size, item.bundle, -1)}
                        className="w-10 h-10 rounded-full bg-white text-emerald-600 hover:bg-emerald-50 transition-colors flex items-center justify-center shadow-sm"
                      >
                        <FaMinus size={14} />
                      </button>
                      <span className="text-lg font-medium w-6 text-gray-700">
                        {item.quantity}
                      </span>
                      <button
                        onClick={() => changeQuantity(item.id, item.color, item.size, item.bundle, 1)}
                        className="w-10 h-10 rounded-full bg-white text-emerald-600 hover:bg-emerald-50 transition-colors flex items-center justify-center shadow-sm"
                      >
                        <FaPlus size={14} />
                      </button>
                    </div>
                  </div>
                );
              })}
            </div>

            <div className="bg-gray-50 rounded-xl p-6 border border-gray-100">
              <h3 className="text-xl font-semibold text-gray-900 mb-6">Resumen de compra</h3>
              <div className="space-y-4">
                <div className="flex justify-between">
                  <span className="text-gray-600">Subtotal ({cartSummary.totalItems} items):</span>
                  <span className="font-medium text-gray-900">
                    ${cartSummary.totalOriginal.toFixed(2)}
                  </span>
                </div>
                {cartSummary.totalSavings > 0 && (
                  <div className="flex justify-between text-red-500">
                    <span>Ahorras:</span>
                    <span className="font-medium">-${cartSummary.totalSavings.toFixed(2)}</span>
                  </div>
                )}
                <div className="flex justify-between">
                  <span className="text-gray-600">Envío:</span>
                  <span className="text-emerald-600 font-medium">Gratis</span>
                </div>
                <div className="pt-4 border-t border-gray-200 flex justify-between">
                  <span className="text-lg font-semibold">Total a pagar:</span>
                  <span className="text-xl font-bold text-gray-900">
                    ${cartSummary.totalDiscounted.toFixed(2)}
                  </span>
                </div>
              </div>

              <Link
                to="/checkout"
                className="mt-6 w-full flex items-center justify-center gap-2 py-4 px-6 bg-emerald-600 hover:bg-emerald-700 text-white rounded-lg font-semibold transition-colors shadow-md"
              >
                Proceder al Pago
              </Link>
            </div>
          </div>
        ) : (
          <div className="text-center py-12">
            <div className="max-w-md mx-auto">
              <FaShoppingBag className="text-6xl text-gray-200 mx-auto mb-4" />
              <h3 className="text-xl font-semibold text-gray-900 mb-2">Carrito vacío</h3>
              <p className="text-gray-500 mb-6">Agrega productos para continuar</p>
              <Link
                to="/"
                className="inline-block px-8 py-3 bg-emerald-600 hover:bg-emerald-700 text-white rounded-lg transition-colors font-medium shadow-md"
              >
                Explorar Productos
              </Link>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default Cart;