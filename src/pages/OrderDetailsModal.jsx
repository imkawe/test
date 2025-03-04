import React from "react";
import { FaPrint, FaUser, FaMapMarkerAlt, FaEnvelope, FaBox, FaMoneyBillWave } from "react-icons/fa";

const OrderDetailsModal = ({ order, onClose }) => {
  if (!order) return null;

  const formatDate = (dateString) => {
    const options = { 
      year: 'numeric', 
      month: 'long', 
      day: 'numeric', 
      hour: '2-digit', 
      minute: '2-digit' 
    };
    return new Date(dateString).toLocaleDateString('es-ES', options);
  };

  const calculateDiscount = (item) => {
    const discountAmount = (item.unit_price * item.quantity * item.discount) / 100;
    return {
      percentage: item.discount,
      amount: discountAmount,
      originalTotal: item.unit_price * item.quantity,
      finalPrice: item.total_price
    };
  };

  const renderDetails = (details) => {
    if (!details || Object.keys(details).length === 0) return null;
    
    return (
      <div className="mt-4 p-3 bg-gray-50 rounded-lg border">
        <h4 className="font-semibold mb-3 text-blue-600 text-sm">Detalles Específicos:</h4>
        <div className="grid grid-cols-2 gap-3">
          {Object.entries(details).map(([key, value]) => (
            <div key={key} className="flex items-center justify-between border-b pb-2">
              <span className="capitalize text-gray-600 font-medium text-sm">
                {key.replace(/_/g, ' ')}:
              </span>
              {typeof value === 'string' && value.startsWith('http') ? (
                <img 
                  src={value} 
                  alt={key} 
                  className="w-14 h-14 object-cover rounded-lg border shadow-sm"
                />
              ) : (
                <span className="text-gray-800 text-sm">{value}</span>
              )}
            </div>
          ))}
        </div>
      </div>
    );
  };

  return (
    <div className="fixed inset-0 bg-black/60 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-lg p-6 w-full max-w-2xl relative max-h-[90vh] overflow-y-auto">
        <button className="absolute top-3 right-3 text-gray-500 hover:text-gray-700" onClick={onClose}>✕</button>

        <div className="text-center mb-6">
          <h2 className="text-2xl font-bold text-blue-600">Detalles Completo del Pedido #{order.order_id}</h2>
          <p className="text-sm text-gray-500 mt-2">{formatDate(order.created_at)}</p>
        </div>

        {/* Sección de Información del Cliente */}
        <div className="bg-gray-50 p-4 rounded-lg mb-6">
          <h3 className="text-lg font-semibold mb-3 flex items-center gap-2">
            <FaUser className="text-blue-500" /> Información del Cliente
          </h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <p className="font-medium">Nombre:</p>
              <p>{order.user_name}</p>
            </div>
            <div>
              <p className="font-medium">Email:</p>
              <p className="text-blue-600 break-all">
                <FaEnvelope className="inline mr-2" />
                {order.user_email}
              </p>
            </div>
          </div>
        </div>

        {/* Sección de Dirección */}
        <div className="bg-gray-50 p-4 rounded-lg mb-6">
          <h3 className="text-lg font-semibold mb-3 flex items-center gap-2">
            <FaMapMarkerAlt className="text-blue-500" /> Dirección de Entrega
          </h3>
          {order.address ? (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <p className="font-medium">Dirección:</p>
                <p>{order.address?.address_line || 'N/A'}</p>
              </div>
              <div>
                <p className="font-medium">Ciudad/Estado:</p>
                <p>{order.address?.city || 'N/A'}, {order.address?.state || 'N/A'}</p>
              </div>
              <div>
                <p className="font-medium">Código Postal:</p>
                <p>{order.address?.pincode || 'N/A'}</p>
              </div>
              <div>
                <p className="font-medium">Teléfono:</p>
                <p>{order.address?.mobile || 'N/A'}</p>
              </div>
            </div>
          ) : (
            <p className="text-red-500">Dirección no disponible</p>
          )}
        </div>

        {/* Estado del Pedido */}
        <div className={`p-4 rounded-lg mb-6 ${order.status === 'CANCELLED' ? 'bg-red-100' : order.status === 'COMPLETED' ? 'bg-green-100' : 'bg-yellow-100'}`}>          
          <h3 className="text-lg font-semibold flex items-center gap-2">
            <FaBox className="text-purple-500" /> Estado Actual:
            <span className={`px-3 py-1 rounded-full text-sm ${order.status === 'CANCELLED' ? 'bg-red-200 text-red-800' : order.status === 'COMPLETED' ? 'bg-green-200 text-green-800' : 'bg-yellow-200 text-yellow-800'}`}>{order.status}</span>
          </h3>
        </div>

        {/* Productos */}
        <div className="mb-6">
          <h3 className="text-lg font-semibold mb-4 flex items-center gap-2">
            <FaBox className="text-green-500" /> Productos Adquiridos
          </h3>
          <div className="space-y-4">
            {order.items.map((item, index) => {
              const images = Array.isArray(item.image) ? item.image : JSON.parse(item.image || "[]");
              const discountDetails = calculateDiscount(item);
              const moreDetails = item.more_details || {};

              return (
                <div key={index} className="border rounded-lg p-4">
                  {/* Imágenes del Producto */}
                  <div className="flex gap-4 mb-3 flex-wrap">
                    {images.map((img, imgIndex) => (
                      <img
                        key={imgIndex}
                        src={img}
                        alt={item.name}
                        className="w-20 h-20 object-cover rounded border"
                      />
                    ))}
                  </div>

                  {/* Detalles Principales */}
                  <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-4">
                    <div>
                      <p className="font-medium">Producto:</p>
                      <p className="font-semibold">{item.name}</p>
                    </div>
                    <div>
                      <p className="font-medium">Precio Unitario:</p>
                      <p>${parseFloat(item.unit_price).toFixed(2)}</p>
                    </div>
                    <div>
                      <p className="font-medium">Cantidad:</p>
                      <p>{item.quantity}</p>
                    </div>
                    <div>
                      <p className="font-medium">Total:</p>
                      <p className="text-green-600 font-bold">${item.total_price.toFixed(2)}</p>
                    </div>
                  </div>

                  {/* Detalles Específicos */}
                  {moreDetails && Object.keys(moreDetails).length > 0 && renderDetails(moreDetails)}

                  {/* Descuentos */}
                  {item.discount > 0 && (
                    <div className="mt-4 bg-blue-50 p-3 rounded-lg">
                      <p className="font-semibold text-blue-800">
                        Descuento aplicado: {discountDetails.percentage}% 
                        <span className="block text-sm font-normal">
                          (Ahorro: ${discountDetails.amount.toFixed(2)})
                        </span>
                      </p>
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        </div>

        {/* Resumen Financiero */}
        <div className="bg-blue-50 p-4 rounded-lg">
          <h3 className="text-lg font-semibold mb-4 flex items-center gap-2">
            <FaMoneyBillWave className="text-green-500" /> Resumen Financiero
          </h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <p className="font-medium">Total de Productos:</p>
              <p>{order.items.length}</p>
            </div>
            <div>
              <p className="font-medium">Total General:</p>
              <p className="text-2xl font-bold text-blue-600">${order.total_amt.toFixed(2)}</p>
            </div>
          </div>
        </div>

        {/* Botón de Impresión */}
        <div className="mt-6 flex justify-end">
          <button 
            onClick={() => window.print()} 
            className="bg-blue-600 text-white px-6 py-2 rounded-lg hover:bg-blue-700 flex items-center gap-2"
          >
            <FaPrint /> Imprimir Comprobante
          </button>
        </div>
      </div>
    </div>
  );
};

export default OrderDetailsModal;