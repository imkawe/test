import React, { useEffect, useState } from "react";
import { useUser } from "../context/UserContext";
import { Link, useNavigate } from "react-router-dom";
import AddressForm from "../pages/AddressForm";
import { FaEdit, FaTrash, FaPlus, FaUser, FaMapMarkerAlt } from "react-icons/fa";
import axios from "axios";
import { toast } from "react-toastify";

const transformAddress = (address) => {
  if (!address) return {};

  return {
    id: address.id || null,
    firstName: address.first_name || '', // Asegúrate de que el campo sea first_name
    lastName: address.last_name || '',   // Asegúrate de que el campo sea last_name
    addressLine: address.address_line || '', // Asegúrate de que el campo sea address_line
    city: address.city || '',
    state: address.state || '',
    pincode: address.pincode || '',
    country: address.country || '',
    mobile: address.mobile || '',
    userId: address.user_id || null
  };
};

const Profile = () => {
  const { user } = useUser();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(true);
  const [addresses, setAddresses] = useState([]);
  const [selectedAddress, setSelectedAddress] = useState(null);
  const [activeModal, setActiveModal] = useState(null);
  const [addressToDelete, setAddressToDelete] = useState(null);

  const getAuthHeader = () => ({
    headers: { Authorization: `Bearer ${sessionStorage.getItem("authToken")}` }
  });

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

  if (loading) return (
    <div className="flex flex-col items-center justify-center h-screen">
      <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"/>
      <p className="mt-4 text-gray-600">Cargando perfil...</p>
    </div>
  );

  if (!user) return (
    <div className="text-center p-8">
      <p className="text-red-500 mb-4">Debes iniciar sesión para ver esta página</p>
      <Link to="/login" className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600">
        Ir al login
      </Link>
    </div>
  );

  return (
    <div className="max-w-6xl mx-auto p-4 relative">
      <header className="text-center mb-8">
        <h1 className="text-3xl font-bold flex items-center justify-center gap-2">
          <FaUser /> Mi Perfil
        </h1>
      </header>

      <div className="grid md:grid-cols-2 gap-6">
        {/* Sección Perfil */}
        <section className="bg-white p-6 rounded-xl shadow-lg">
          <div className="text-center">
            <img 
              src={user.avatar || `${window.location.origin}/img1.png`} 
              alt="Avatar"
              className="w-32 h-32 rounded-full border-4 border-gray-100 mx-auto mb-4"
              onError={(e) => e.target.src = `${window.location.origin}/img1.png`}
            />
            <h2 className="text-xl font-semibold">{user.name}</h2>
            <p className="text-gray-600 mt-2">{user.email}</p>
            <p className="text-gray-600">{user.mobile || "Sin teléfono registrado"}</p>
            
            <Link 
              to="/edit-profile" 
              className="mt-4 inline-flex items-center bg-blue-500 text-white px-4 py-2 rounded-lg hover:bg-blue-600 transition-colors"
            >
              <FaEdit className="mr-2" /> Editar Perfil
            </Link>
          </div>
        </section>

        {/* Sección Direcciones */}
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
              addresses.map(address => (
                <div key={address.id} className="border rounded-xl p-4 relative hover:shadow-md transition-shadow">
                  <div className="pr-12">
                    <h3 className="font-semibold">{address.firstName} {address.lastName}</h3>
                    <p>{address.addressLine}</p>
                    <p className="text-gray-600">
                      {address.city}
                      {address.state && `, ${address.state}`}
                    </p>
                    <p className="text-gray-600">C.P. {address.pincode}</p>
                    <p className="text-gray-600">{address.country}</p>
                    <p className="text-gray-600">Tel: {parseInt(address.mobile)}</p>
                  </div>
                  <div className="absolute top-2 right-2 flex gap-2">
                    <button
                      className="text-blue-500 hover:text-blue-700 transition-colors"
                      onClick={() => {
                        setSelectedAddress(address);
                        setActiveModal('address');
                      }}
                    >
                      <FaEdit />
                    </button>
                    <button
                      className="text-red-500 hover:text-red-700 transition-colors"
                      onClick={() => {
                        setAddressToDelete(address.id);
                        setActiveModal('delete');
                      }}
                    >
                      <FaTrash />
                    </button>
                  </div>
                </div>
              ))
            )}
          </div>
        </section>
      </div>

      {/* Overlay y Modales */}
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
  );
};

export default Profile;