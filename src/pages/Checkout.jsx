import React, { useEffect, useState } from "react";
import { useUser } from "../context/UserContext";
import { useCart } from "../context/CartContext";
import { useNavigate } from "react-router-dom";
import AddressForm from "../pages/AddressForm";
import { FaEdit, FaTrash, FaPlus, FaMapMarkerAlt, FaMoneyBillWave, FaCreditCard, FaShoppingBag, FaExclamationCircle } from "react-icons/fa";
import axios from "axios";
import { toast } from "react-toastify";
import { PayPalScriptProvider, PayPalButtons } from "@paypal/react-paypal-js";

// Función para transformar la dirección
const transformAddress = (address) => {
  if (!address) return {};

  return {
    id: address.id || null,
    firstName: address.first_name || '', 
    lastName: address.last_name || '',  
    addressLine: address.address_line || '',
    city: address.city || '',
    state: address.state || '',
    pincode: address.pincode || '',
    country: address.country || '',
    mobile: address.mobile || '',
    userId: address.user_id || null
  };
};


// Función para parsear la imagen
const parseImage = (image) => {
  try {
    return JSON.parse(image)?.[0] || image || "/placeholder.jpg";
  } catch {
    return image || "/placeholder.jpg";
  }
};

const Checkout = () => {
  const { user } = useUser();
  const { cart: contextCart, cartTotal, clearCart } = useCart();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(true);
  const [addresses, setAddresses] = useState([]);
  const [selectedAddressId, setSelectedAddressId] = useState(null);
  const [paymentMethod, setPaymentMethod] = useState("cash");
  const [activeModal, setActiveModal] = useState(null);
  const [addressToDelete, setAddressToDelete] = useState(null);
  const [localCart, setLocalCart] = useState([]);
  const [selectedAddress, setSelectedAddress] = useState(null);

  const [cartSummary, setCartSummary] = useState({
    totalOriginal: 0,
    totalDiscounted: 0,
    totalItems: 0,
    totalSavings: 0
  });

  // Obtener el encabezado de autenticación
  const getAuthHeader = () => ({
    headers: { Authorization: `Bearer ${sessionStorage.getItem("authToken")}` }
  });

  // Cargar y sincronizar el carrito
  useEffect(() => {
    const loadCart = () => {
      try {
        const sessionCart = sessionStorage.getItem("cart");
        const cartData = sessionCart ? JSON.parse(sessionCart) : [];
        setLocalCart(cartData);
        calculateCartSummary(cartData);
      } catch (error) {
        console.error("Error cargando carrito:", error);
        setLocalCart([]);
      }
    };

    loadCart();
    window.addEventListener("storage", loadCart);
    return () => window.removeEventListener("storage", loadCart);
  }, []);

  // Calcular el resumen del carrito
  const calculateCartSummary = (cart) => {
    const summary = cart.reduce((acc, item) => {
      const discountedPrice = item.price * (1 - item.discount / 100);
      const total = discountedPrice * item.quantity;

      return {
        totalOriginal: acc.totalOriginal + item.price * item.quantity,
        totalDiscounted: acc.totalDiscounted + total,
        totalItems: acc.totalItems + item.quantity,
        totalSavings: acc.totalSavings + (item.price * item.quantity - total),
      };
    }, { totalOriginal: 0, totalDiscounted: 0, totalItems: 0, totalSavings: 0 });

    setCartSummary(summary);
  };

  // Cargar direcciones del usuario
  useEffect(() => {
    const fetchAddresses = async () => {
      try {
        const { data } = await axios.get(`${import.meta.env.VITE_API_URL}/api/addresses`, getAuthHeader());
        console.log("Datos actualizados:", data.data);
        setAddresses(data.data.map(transformAddress));
      } catch (error) {
        toast.error("Error cargando direcciones");
      } finally {
        setLoading(false);
      }
    };
  
    if (user) fetchAddresses();
  }, [user, addresses]); // Agrega 'addresses' como dependencia

  // Crear orden en efectivo
  const handleCreateOrder = async () => {
    if (!selectedAddressId) {
      toast.error("Por favor, selecciona una dirección de entrega.");
      return;
    }

    setLoading(true);

    try {
      const orderData = {
        userId: user.id,
        delivery_address: selectedAddressId,
        paymentMethod: paymentMethod,
        items: localCart.map(item => ({
          product_id: item.id,
          quantity: item.quantity,
          unit_price: parseFloat(item.price),
          discount: item.discount || 0,
          color: item.color,
          size: item.size,
          image: item.image,
        })),
        subTotalAmt: cartSummary.totalOriginal,
        totalAmt: cartSummary.totalDiscounted,
      };

      const response = await axios.post(
        `${import.meta.env.VITE_API_URL}/api/orders`,
        orderData,
        getAuthHeader()
      );

      if (response.data.success) {
        toast.success("Orden creada exitosamente.");
        sessionStorage.removeItem("cart");
        clearCart();
        navigate("/my-orders");
      }
    } catch (error) {
      console.error("Error creando la orden:", error);
      toast.error(error.response?.data?.message || "Error al crear la orden.");
    } finally {
      setLoading(false);
    }
  };

  // Crear orden con PayPal
  const createPayPalOrder = async () => {
    try {
      if (!selectedAddressId) {
        toast.error("Selecciona una dirección de entrega");
        throw new Error("Dirección requerida");
      }

      const orderData = {
        amount: cartSummary.totalDiscounted.toFixed(2),
        delivery_address: selectedAddressId,
        items: localCart.map(item => ({
          product_id: item.id,
          name: item.name.substring(0, 127),
          unit_price: item.price,
          quantity: item.quantity,
          discount: item.discount || 0,
          color: item.color || null,
          size: item.size || null,
          image: item.image,
        }))
      };

      const response = await axios.post(
        `${import.meta.env.VITE_API_URL}/api/orders/paypal`,
        orderData,
        getAuthHeader()
      );

      return response.data.paypal.id;
    } catch (error) {
      console.error('Error completo:', error);
      toast.error(error.response?.data?.message || "Error en PayPal");
      throw error;
    }
  };

  // Manejar la aprobación del pago
  const onPayPalApprove = async (data, actions) => {
    try {
      await actions.order.capture();
      await axios.post(
        `${import.meta.env.VITE_API_URL}/api/orders/paypal/capture`,
        {
          paypalOrderId: data.orderID,
          amount: cartSummary.totalDiscounted
        },
        getAuthHeader()
      );

      sessionStorage.removeItem("cart");
      clearCart();
      navigate("/my-orders");
      toast.success("¡Pago completado exitosamente!");
    } catch (error) {
      console.error("Error en pago PayPal:", error);
      toast.error("Error al procesar el pago");
    }
  };

  // Manejar el envío del formulario de dirección
  const handleAddressSubmit = async (formData) => {
    try {
      // Validar campos obligatorios
      const requiredFields = [
        { key: "firstName", name: "Nombre" },
        { key: "lastName", name: "Apellido" },
        { key: "addressLine", name: "Dirección" },
        { key: "city", name: "Ciudad" },
        { key: "pincode", name: "Código Postal" },
        { key: "country", name: "País" },
        { key: "mobile", name: "Teléfono" }
      ];
  
      const missingFields = requiredFields.filter(({ key }) => !formData[key]).map(({ name }) => name);
      if (missingFields.length > 0) {
        toast.error(`Faltan campos obligatorios: ${missingFields.join(", ")}`);
        return;
      }
  
      const payload = {
        first_name: formData.firstName,
        last_name: formData.lastName,
        address_line: formData.addressLine,
        city: formData.city,
        state: formData.state,
        pincode: formData.pincode,
        country: formData.country,
        mobile: parseInt(formData.mobile.replace(/\D/g, '')),
        user_id: user.id
      };
  
      const url = selectedAddress 
        ? `${import.meta.env.VITE_API_URL}/api/addresses/${selectedAddress.id}`
        : `${import.meta.env.VITE_API_URL}/api/addresses`;
  
      const { data } = await axios[selectedAddress ? "put" : "post"](url, payload, getAuthHeader());
      
      setAddresses(prev => {
        const transformed = transformAddress(data.data);
        return selectedAddress 
          ? prev.map(a => (a.id === transformed.id ? transformed : a))
          : [...prev, transformed]; // Se coloca al final para que no se "desaparezca"
      });

      

      toast.success(selectedAddress ? "Dirección actualizada" : "Dirección creada");
      setActiveModal(null);
    } catch (error) {
      toast.error(error.response?.data?.error || "Error en la operación");
    }
  };


  // Manejar la eliminación de una dirección
  const handleDeleteAddress = async () => {
    try {
      await axios.delete(`${import.meta.env.VITE_API_URL}/api/addresses/${addressToDelete}`, getAuthHeader());
      setAddresses(prev => prev.filter(a => a.id !== addressToDelete));
      toast.success("Dirección eliminada correctamente");
    } catch (error) {
      toast.error(error.response?.data?.error || "Error eliminando dirección");
    } finally {
      setAddressToDelete(null);
      setActiveModal(null);
    }
  };

  return (
    <PayPalScriptProvider options={{ 
      "client-id": "AaRU0Kwu72KFarOUC_CYxxssA0s852wpFICKHoR_mqjOdLlqu0RKY4NQp9NmnKBFITZMDkO0OiltA0xY", 
      currency: "USD",
      intent: "capture"
    }}>
      <div className="max-w-6xl mx-auto p-4 relative">
        <h1 className="text-3xl font-bold mb-8 flex items-center gap-2">
          <FaMapMarkerAlt className="text-emerald-600" />
          Finalizar Compra
        </h1>

        <div className="grid md:grid-cols-2 gap-8">
          {/* Sección de Direcciones */}
          <section className="bg-white p-6 rounded-xl shadow-lg">
            <div className="flex justify-between items-center mb-6">
              <h2 className="text-xl font-bold flex items-center gap-2">
                <FaMapMarkerAlt /> Mis Direcciones
              </h2>
              <button 
                onClick={() => {
                  setSelectedAddress(null);
                  setActiveModal('address');
                }}
                className="bg-green-500 text-white px-4 py-2 rounded-lg hover:bg-green-600 flex items-center transition-colors"
              >
                <FaPlus className="mr-2" /> Nueva Dirección
              </button>
            </div>

            <div className="grid gap-4">
              {addresses.length === 0 ? (
                <p className="text-gray-500 text-center py-4">No hay direcciones registradas</p>
              ) : (
                addresses.map((address) => (
                  <div
                    key={address.id}
                    className={`border p-4 rounded-lg flex items-center justify-between ${
                      selectedAddressId === address.id ? "border-2 border-emerald-500 bg-emerald-50" : "border-gray-200"
                    }`}
                  >
<div>
<p><h3 className="font-semibold">{address.firstName} {address.lastName}</h3></p>
      <p>{address.addressLine}</p>
      <p>
        {address.city}, {address.state && `${address.state},`} C.P. {address.pincode}
      </p>
      <p>{address.country}</p>
      <p>Tel: {address.mobile}</p>
    </div>

    {/* Botones de Editar y Eliminar */}
    <div className="flex items-center gap-2">
      <button
        onClick={() => {
          setSelectedAddress(address);
          setActiveModal('address');
        }}
        className="text-blue-500 hover:text-blue-700 transition-colors"
      >
        <FaEdit />
      </button>
      <button
        onClick={() => {
          setAddressToDelete(address.id);
          setActiveModal('delete');
        }}
        className="text-red-500 hover:text-red-700 transition-colors"
      >
        <FaTrash />
      </button>
      <input
        type="radio"
        name="address"
        value={address.id}
        checked={selectedAddressId === address.id}
        onChange={() => setSelectedAddressId(address.id)}
        className="form-radio h-5 w-5 text-emerald-600"
      />
    </div>
                  </div>
                ))
              )}
            </div>
          </section>

          {/* Sección de Resumen del Carrito */}
          <section className="bg-white p-6 rounded-xl shadow-lg">
            <h2 className="text-xl font-bold mb-6 flex items-center gap-2">
              <FaShoppingBag /> Resumen del Carrito
            </h2>

            {localCart.length === 0 ? (
              <p className="text-gray-500">Tu carrito está vacío.</p>
            ) : (
              <div className="space-y-4">
                {localCart.map((item) => {
                  const discountedPrice = item.price * (1 - item.discount / 100);
                  const totalPrice = discountedPrice * item.quantity;

                  return (
                    <div key={`${item.id}-${item.color}-${item.size}`} className="flex items-center gap-4 p-4 border rounded-lg">
                      <div className="w-20 h-20 flex-shrink-0">
                        <img
                          src={parseImage(item.image)}
                          alt={item.name}
                          className="w-full h-full object-cover rounded-lg"
                        />
                      </div>
                      <div className="flex-1">
                        <h3 className="font-semibold">{item.name}</h3>
                        {item.color && <p className="text-gray-600">Color: {item.color}</p>}
                        {item.size && <p className="text-gray-600">Tamaño: {item.size}</p>}
                        <p className="text-gray-600">Cantidad: {item.quantity}</p>
                        <p className="text-gray-600">Precio: ${discountedPrice.toFixed(2)} c/u</p>
                        <p className="text-gray-600">Total: ${totalPrice.toFixed(2)}</p>
                      </div>
                    </div>
                  );
                })}
              </div>
            )}
          </section>

          {/* Sección de Método de Pago y Resumen */}
          <section className="bg-white p-6 rounded-xl shadow-lg">
            <h2 className="text-xl font-bold mb-6 flex items-center gap-2">
              <FaMoneyBillWave /> Método de Pago
            </h2>

            <div className="space-y-4">
              <label className="inline-flex items-center">
                <input
                  type="radio"
                  name="paymentMethod"
                  value="cash"
                  checked={paymentMethod === "cash"}
                  onChange={() => setPaymentMethod("cash")}
                  className="form-radio h-4 w-4 text-indigo-600 transition duration-150 ease-in-out"
                />
                <span className="ml-2">Pago en Efectivo</span>
              </label>

              <label className="inline-flex items-center">
                <input
                  type="radio"
                  name="paymentMethod"
                  value="paypal"
                  checked={paymentMethod === "paypal"}
                  onChange={() => setPaymentMethod("paypal")}
                  className="form-radio h-4 w-4 text-indigo-600 transition duration-150 ease-in-out"
                />
                <span className="ml-2">PayPal</span>
              </label>
            </div>

            {/* Resumen de la Orden */}
            <div className="mt-8 bg-gray-50 rounded-xl p-6 border border-gray-100">
              <h3 className="text-xl font-semibold text-gray-900 mb-6">Resumen de la Orden</h3>
              <div className="space-y-4">
                <div className="flex justify-between">
                  <span className="text-gray-600">Subtotal:</span>
                  <span className="font-medium text-gray-900">${cartSummary.totalOriginal.toFixed(2)}</span>
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
                  <span className="text-lg font-semibold">Total:</span>
                  <span className="text-xl font-bold text-gray-900">${cartSummary.totalDiscounted.toFixed(2)}</span>
                </div>
              </div>

              {paymentMethod === "paypal" ? (
                selectedAddressId ? (
                  <PayPalButtons
                    createOrder={createPayPalOrder}
                    onApprove={onPayPalApprove}
                    onError={(err) => {
                      console.error("PayPal Error:", err);
                      toast.error("Error en el proceso de PayPal");
                    }}
                    style={{
                      layout: 'vertical',
                      color: 'gold',
                      shape: 'rect'
                    }}
                  />
                ) : (
                  <div className="mt-6 text-red-500 flex items-center gap-2">
                    <FaExclamationCircle />
                    <span>Elige una dirección para completar la compra</span>
                  </div>
                )
              ) : (
                <button
                  onClick={handleCreateOrder}
                  disabled={loading || !selectedAddressId}
                  className="mt-6 w-full flex items-center justify-center gap-2 py-4 px-6 bg-emerald-600 hover:bg-emerald-700 text-white rounded-lg font-semibold transition-colors shadow-md disabled:bg-gray-300 disabled:cursor-not-allowed"
                >
                  {loading ? "Procesando..." : "Confirmar Orden"}
                </button>
              )}
            </div>
          </section>
        </div>

        {/* Modales */}
        {activeModal && (
          <>
            <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-40 transition-opacity"/>
            
            {activeModal === 'delete' && (
              <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
                <div className="bg-white rounded-xl p-6 max-w-md w-full shadow-2xl">
                  <h3 className="text-lg font-bold mb-3">¿Eliminar dirección?</h3>
                  <p className="text-gray-600 mb-5">Esta acción no se puede deshacer</p>
                  <div className="flex justify-end gap-3">
                    <button
                      onClick={() => setActiveModal(null)}
                      className="px-4 py-2 text-gray-600 hover:bg-gray-100 rounded-lg transition-colors"
                    >
                      Cancelar
                    </button>
                    <button
                      onClick={handleDeleteAddress}
                      className="px-4 py-2 bg-red-500 text-white hover:bg-red-600 rounded-lg transition-colors"
                    >
                      Confirmar
                    </button>
                  </div>
                </div>
              </div>
            )}

            {activeModal === 'address' && (
              <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
                <div className="bg-white rounded-xl p-6 w-full max-w-md shadow-2xl">
                  <div className="flex justify-between items-center mb-4">
                    <h3 className="text-lg font-bold">
                      {selectedAddress ? "Editar Dirección" : "Nueva Dirección"}
                    </h3>
                    <button
                      onClick={() => setActiveModal(null)}
                      className="text-gray-500 hover:text-gray-700 transition-colors"
                    >
                      ✕
                    </button>
                  </div>
                  <AddressForm
                    initialValues={selectedAddress}
                    onSubmit={handleAddressSubmit}
                    onCancel={() => setActiveModal(null)}
                  />
                </div>
              </div>
            )}
          </>
        )}
      </div>
    </PayPalScriptProvider>
  );
};

export default Checkout;