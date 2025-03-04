import React, { useEffect, useState } from "react";
import { useUser } from "../context/UserContext";
import axios from "axios";
import { toast } from "react-toastify";
import { Navigate } from "react-router-dom";
import { FaEye, FaEdit, FaTrash } from "react-icons/fa";
import OrderForm from "./OrderForm";
import OrderDetailsModal from "./OrderDetailsModal";

const AdminOrders = () => {
  const { user } = useUser();
  const [orders, setOrders] = useState([]);
  const [filteredOrders, setFilteredOrders] = useState([]); // Nuevo estado para búsqueda
  const [searchTerm, setSearchTerm] = useState(""); // Estado para el input de búsqueda
  const [loading, setLoading] = useState(true);
  const [editingOrder, setEditingOrder] = useState(null);
  const [selectedOrder, setSelectedOrder] = useState(null);
  const [orderToDelete, setOrderToDelete] = useState(null);

  const fetchOrders = async () => {
    try {
      const response = await axios.get(`${import.meta.env.VITE_API_URL}/api/orders`, {
        headers: { 
          Authorization: `Bearer ${sessionStorage.getItem("authToken")}` 
        }
      });
      
      if (response.data.success) {
        setOrders(response.data.data);
        setFilteredOrders(response.data.data); // Inicializar lista filtrada
      }
    } catch (error) {
      toast.error(error.response?.data?.error || "Error al cargar órdenes");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (user?.role === "ADMIN") fetchOrders();
  }, [user]);

  useEffect(() => {
    // Filtrar órdenes según el término de búsqueda
    const filtered = orders.filter(order =>
      order.order_id.toString().includes(searchTerm) ||
      (order.user_name && order.user_name.toLowerCase().includes(searchTerm.toLowerCase())) ||
      order.status.toLowerCase().includes(searchTerm.toLowerCase()) ||
      new Date(order.created_at).toLocaleDateString("es-ES").includes(searchTerm)
    );
    setFilteredOrders(filtered);
  }, [searchTerm, orders]);

  const handleDelete = async () => {
    try {
      if (orderToDelete?.status !== "CANCELLED") {
        toast.error("La orden debe estar cancelada antes de eliminarla");
        return;
      }

      await axios.delete(`${import.meta.env.VITE_API_URL}/api/orders/${orderToDelete.order_id}`, {
        headers: { 
          Authorization: `Bearer ${sessionStorage.getItem("authToken")}` 
        }
      });
      
      setOrders(prev => prev.filter(order => order.order_id !== orderToDelete.order_id));
      toast.success(`Orden #${orderToDelete.order_id} eliminada`);
    } catch (error) {
      toast.error(error.response?.data?.error || "Error al eliminar orden");
    } finally {
      setOrderToDelete(null);
    }
  };

  if (!user || user.role !== "ADMIN") return <Navigate to="/" />;

  if (loading) {
    return (
      <div className="flex justify-center items-center h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500" />
      </div>
    );
  }

  return (
    <div className="max-w-6xl mx-auto p-4">
      <h1 className="text-3xl font-bold mb-8 text-gray-800">Gestión de Órdenes</h1>

      {/* 🔍 Barra de búsqueda */}
      <input
        type="text"
        placeholder="Buscar por ID, usuario, fecha o estado..."
        value={searchTerm}
        onChange={(e) => setSearchTerm(e.target.value)}
        className="w-full p-2 mb-4 border rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-400"
      />

      {editingOrder && (
        <OrderForm 
          order={editingOrder}
          onClose={() => setEditingOrder(null)}
          onUpdate={fetchOrders}
        />
      )}

      <OrderDetailsModal 
        order={selectedOrder}
        onClose={() => setSelectedOrder(null)}
      />

      {orderToDelete && (
        <>
          <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-40 transition-opacity"/>
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
            <div className="bg-white rounded-xl p-6 max-w-md w-full shadow-2xl">
              <h3 className="text-lg font-bold mb-3">¿Eliminar orden?</h3>
              <p className="text-gray-600 mb-5">Esta acción no se puede deshacer</p>
              <div className="flex justify-end gap-3">
                <button
                  onClick={() => setOrderToDelete(null)}
                  className="px-4 py-2 text-gray-600 hover:bg-gray-100 rounded-lg transition-colors"
                >
                  Cancelar
                </button>
                <button
                  onClick={handleDelete}
                  className="px-4 py-2 bg-red-500 text-white hover:bg-red-600 rounded-lg transition-colors"
                >
                  Confirmar
                </button>
              </div>
            </div>
          </div>
        </>
      )}

      <div className="overflow-x-auto bg-white rounded-lg shadow-md">
        <table className="min-w-full">
          <thead className="bg-gray-100">
            <tr>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">ID</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Usuario</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Fecha</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Total</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Estado</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Método de Pago</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Acciones</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-200">
            {filteredOrders.map((order) => (
              <tr key={order.order_id}>
                <td className="px-6 py-4 whitespace-nowrap">#{order.order_id}</td>
                <td className="px-6 py-4 whitespace-nowrap">{order.user_name || "Desconocido"}</td>
                <td className="px-6 py-4 whitespace-nowrap">
                  {new Date(order.created_at).toLocaleDateString("es-ES")}
                </td>
                <td className="px-6 py-4 whitespace-nowrap">${order.total_amt?.toFixed(2)}</td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <span className={`px-2 py-1 rounded-full text-xs ${
                    order.status === "PENDING" ? "bg-yellow-100 text-yellow-800" :
                    order.status === "COMPLETED" ? "bg-green-100 text-green-800" :
                    "bg-red-100 text-red-800"
                  }`}>
                    {order.status}
                  </span>
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  {order.metodo_de_pago === "cash" ? "Cash" :
                   order.payment_id ? "PayPal" : // Si hay payment_id, es PayPal
                   "No especificado"}
                </td>
                <td className="px-6 py-4 whitespace-nowrap space-x-2">
                  <button onClick={() => setSelectedOrder(order)} className="text-blue-600 hover:text-blue-900 p-1">
                    <FaEye size={18} />
                  </button>
                  <button onClick={() => setEditingOrder(order)} className="text-green-600 hover:text-green-900 p-1">
                    <FaEdit size={18} />
                  </button>
                  <button onClick={() => setOrderToDelete(order)} className="text-red-600 hover:text-red-900 p-1">
                    <FaTrash size={18} />
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default AdminOrders;