import React, { useState, useEffect } from "react";
import axios from "axios";
import { toast } from "react-toastify";

const OrderForm = ({ order, onClose, onUpdate }) => {
  const [formData, setFormData] = useState({
    user_id: "",
    delivery_address: "",
    payment_method: "cash",
    status: "PENDING",
    total_amt: 0,
    products: []
  });

  useEffect(() => {
    if (order) {
      setFormData({
        user_id: order.user_id,
        delivery_address: order.delivery_address || "",
        payment_method: order.metodo_de_pago || "cash",
        status: order.status,
        total_amt: order.total_amt,
        products: order.products || []
      });
    }
  }, [order]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    const requiredFields = ['user_id', 'status', 'total_amt', 'payment_method'];
    if (requiredFields.some(field => !formData[field])) {
      return toast.error("Complete los campos requeridos");
    }

    try {
      const payload = {
        ...formData,
        metodo_de_pago: formData.payment_method,
        products: formData.products.map(p => ({
          product_id: p.product_id,
          quantity: p.quantity,
          price: p.price
        }))
      };

      const response = await axios.put(
        `${import.meta.env.VITE_API_URL}/api/orders/${order.order_id}`,
        payload,
        {
          headers: {
            Authorization: `Bearer ${sessionStorage.getItem("authToken")}`
          }
        }
      );

      if (response.data.success) {
        toast.success("Orden actualizada!");
        onUpdate();
        onClose();
      }
    } catch (error) {
      toast.error(error.response?.data?.error || "Error al actualizar");
    }
  };

  const handleProductChange = (index, field, value) => {
    const updatedProducts = [...formData.products];
    updatedProducts[index][field] = field === 'quantity' ? parseInt(value) : value;
    setFormData({ ...formData, products: updatedProducts });
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white p-6 rounded-lg w-full max-w-2xl max-h-[90vh] overflow-y-auto">
        <button
          className="absolute top-3 right-3 text-gray-500 hover:text-gray-700"
          onClick={onClose}
        >
          ✕
        </button>
        
        <h2 className="text-xl font-bold mb-4">Editar Orden #{order?.order_id}</h2>
        
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="grid grid-cols-2 gap-4">
      

            <div>
              <label className="block mb-2">Estado</label>
              <select
                value={formData.status}
                onChange={(e) => setFormData(p => ({ ...p, status: e.target.value }))}
                className="w-full p-2 border rounded"
              >
                <option value="PENDING">Pendiente</option>
                <option value="COMPLETED">Completada</option>
                <option value="CANCELLED">Cancelada</option>
              </select>
            </div>

            <div>
              <label className="block mb-2">Método de Pago</label>
              <select
                value={formData.payment_method}
                onChange={(e) => setFormData(p => ({ ...p, payment_method: e.target.value }))}
                className="w-full p-2 border rounded"
              >
                <option value="cash">Efectivo</option>
                <option value="paypal">PayPal</option>
                <option value="card">Tarjeta</option>
              </select>
            </div>

            <div>
              <label className="block mb-2">Total</label>
              <input
                type="number"
                value={formData.total_amt}
                onChange={(e) => setFormData(p => ({ ...p, total_amt: parseFloat(e.target.value) }))}
                className="w-full p-2 border rounded"
                min="0"
                step="0.01"
                required
              />
            </div>
          </div>

          <div>
            <label className="block mb-2">Dirección de Entrega</label>
            <textarea
              value={formData.delivery_address}
              onChange={(e) => setFormData(p => ({ ...p, delivery_address: e.target.value }))}
              className="w-full p-2 border rounded"
              rows="3"
            />
          </div>

          <div>
            <h3 className="font-bold mb-2">Productos</h3>
            {formData.products.map((product, index) => (
              <div key={index} className="border p-3 rounded mb-2">
                <div className="grid grid-cols-3 gap-4">
                  <div>
                    <label>Cantidad</label>
                    <input
                      type="number"
                      value={product.quantity}
                      onChange={(e) => handleProductChange(index, 'quantity', e.target.value)}
                      className="w-full p-1 border rounded"
                    />
                  </div>
                  <div>
                    <label>Precio Unitario</label>
                    <input
                      type="number"
                      value={product.price}
                      onChange={(e) => handleProductChange(index, 'price', e.target.value)}
                      className="w-full p-1 border rounded"
                      step="0.01"
                    />
                  </div>
                  <div>
                    <label>Total</label>
                    <input
                      type="number"
                      value={(product.quantity * product.price).toFixed(2)}
                      className="w-full p-1 border rounded bg-gray-100"
                      readOnly
                    />
                  </div>
                </div>
              </div>
            ))}
          </div>

          <div className="flex justify-end gap-2">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 bg-gray-300 rounded hover:bg-gray-400"
            >
              Cancelar
            </button>
            <button
              type="submit"
              className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600"
            >
              Guardar Cambios
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default OrderForm;