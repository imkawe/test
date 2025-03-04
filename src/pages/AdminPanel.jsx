import { useUser } from "../context/UserContext";
import { Navigate, Link } from "react-router-dom";

const AdminPanel = () => {
  const { user } = useUser();

  if (!user || user.role !== "ADMIN") {
    return <Navigate to="/" />;
  }

  return (
    <div className="p-10 max-w-4xl mx-auto text-center">
      <h2 className="text-3xl font-bold text-gray-800 mb-10">
        Panel de Administración
      </h2>

      <div className="flex flex-col gap-6 max-w-xs mx-auto">
        <Link
          to="/products"
          className="block px-6 py-4 bg-blue-500 text-white rounded-lg text-lg font-medium hover:bg-blue-600 transition-all duration-300 hover:-translate-y-1"
        >
          📦 Administrar Productos
        </Link>
        <Link
          to="/admin/add-product"
          className="block px-6 py-4 bg-blue-500 text-white rounded-lg text-lg font-medium hover:bg-blue-600 transition-all duration-300 hover:-translate-y-1"
        >
          ➕ Agregar Nuevo Producto
        </Link>
        <Link
          to="/admin/orders"
          className="block px-6 py-4 bg-blue-500 text-white rounded-lg text-lg font-medium hover:bg-blue-600 transition-all duration-300 hover:-translate-y-1"
        >
          📑 Gestionar Órdenes
        </Link>
      </div>
    </div>
  );
};

export default AdminPanel;