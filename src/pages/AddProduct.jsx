import { useState } from "react";
import axios from "axios";
import { toast } from "react-toastify";
import { FaCloudUploadAlt } from "react-icons/fa";
import { MdDelete } from "react-icons/md";

const AddProduct = () => {
  const [product, setProduct] = useState({
    name: "",
    image: [],
    unit: "",
    stock: "",
    price: "",
    discount: "",
    description: "",
    more_details: "{}",
    publish: true,
  });
  const [loading, setLoading] = useState(false);

  const handleChange = (e) => {
    setProduct({ ...product, [e.target.name]: e.target.value });
  };

  const handleImageUpload = async (e) => {
    const files = e.target.files;
    if (!files?.length) return;

    setLoading(true);
    const cloudName = import.meta.env.VITE_CLOUDINARY_CLOUD_NAME;
    const uploadPreset = import.meta.env.VITE_CLOUDINARY_UPLOAD_PRESET;
    
    const uploadedImages = [...product.image];

    try {
      await Promise.all(
        Array.from(files).map(async (file) => {
          const formData = new FormData();
          formData.append("file", file);
          formData.append("upload_preset", uploadPreset);

          const res = await axios.post(
            `https://api.cloudinary.com/v1_1/${cloudName}/image/upload`,
            formData
          );
          uploadedImages.push(res.data.secure_url);
        })
      );
      toast.success("¡Imágenes subidas!");
    } catch (error) {
      toast.error("Error subiendo imágenes");
    }

    setProduct(prev => ({ ...prev, image: uploadedImages }));
    setLoading(false);
  };

  const handleRemoveImage = (index) => {
    setProduct(prev => ({
      ...prev,
      image: prev.image.filter((_, i) => i !== index)
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const token = sessionStorage.getItem("authToken");

    if (!token) {
      toast.error("Inicia sesión primero");
      return;
    }

    // Validaciones rápidas
    if (product.image.length === 0) return toast.warn("Sube al menos 1 imagen");
    if (product.discount > 100 || product.discount < 0) return toast.error("Descuento inválido");

    try {
      const productData = {
        ...product,
        category_id: 4, // ID FIJO
        stock: Number(product.stock),
        price: Number(product.price),
        discount: Number(product.discount),
        more_details: JSON.parse(product.more_details)
      };

      await axios.post(`${import.meta.env.VITE_API_URL}/api/products`, productData, {
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json"
        }
      });

      toast.success("✔ Producto creado!");
      // Resetear formulario
      setProduct({
        name: "",
        image: [],
        unit: "",
        stock: "",
        price: "",
        discount: "",
        description: "",
        more_details: "{}",
        publish: true,
      });

    } catch (error) {
      console.error("Error:", error);
      toast.error(error.response?.data?.error || "Error desconocido");
    }
  };


  return (
    <div className="max-w-[1000px] mx-auto my-8 p-8 bg-white rounded-xl shadow-lg">
      <header className="text-center mb-8">
        <h1 className="text-2xl font-bold text-gray-900 mb-2">Nuevo Producto</h1>
        <p className="text-gray-600">Registra los detalles de tu producto</p>
      </header>

      <form onSubmit={handleSubmit} className="flex flex-col gap-8">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          {/* Columna Izquierda */}
          <div className="flex flex-col gap-6">
            <div className="flex flex-col gap-3">
              <label className="text-sm font-semibold text-gray-800">Nombre del Producto*</label>
              <input
                name="name"
                value={product.name}
                onChange={handleChange}
                className="w-full p-3 border border-gray-300 rounded-lg bg-gray-50 focus:outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-200"
                placeholder="Ej: Zapatos deportivos"
                required
              />
            </div>

            <div className="flex flex-col gap-3">
              <label className="text-sm font-semibold text-gray-800">Precio (USD)*</label>
              <div className="relative">
                <span className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-600">$</span>
                <input
                  type="number"
                  name="price"
                  value={product.price}
                  onChange={handleChange}
                  className="w-full p-3 pl-8 border border-gray-300 rounded-lg bg-gray-50 focus:outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-200"
                  min="0"
                  step="0.01"
                  required
                />
              </div>
            </div>

            <div className="flex flex-col gap-3">
              <label className="text-sm font-semibold text-gray-800">Descuento (%)</label>
              <input
                type="number"
                name="discount"
                value={product.discount}
                onChange={handleChange}
                className="w-full p-3 border border-gray-300 rounded-lg bg-gray-50 focus:outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-200"
                min="0"
                max="100"
                placeholder="0-100%"
              />
            </div>
          </div>

          {/* Columna Derecha */}
          <div className="flex flex-col gap-6">
            <div className="flex flex-col gap-3">
              <label className="text-sm font-semibold text-gray-800">Stock Disponible*</label>
              <input
                type="number"
                name="stock"
                value={product.stock}
                onChange={handleChange}
                className="w-full p-3 border border-gray-300 rounded-lg bg-gray-50 focus:outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-200"
                min="0"
                placeholder="Cantidad en inventario"
                required
              />
            </div>

            <div className="flex flex-col gap-3">
              <label className="text-sm font-semibold text-gray-800">Unidad de Medida*</label>
              <select
                name="unit"
                value={product.unit}
                onChange={handleChange}
                className="w-full p-3 border border-gray-300 rounded-lg bg-gray-50 focus:outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-200 appearance-none"
                required
              >
                <option value="">Seleccionar unidad</option>
                <option value="unidad">Unidad</option>
                <option value="par">Par</option>
                <option value="kg">Kilogramo</option>
                <option value="litro">Litro</option>
              </select>
            </div>

            <div className="flex flex-col gap-3">
              <label className="text-sm font-semibold text-gray-800">Estado</label>
              <div className="flex items-center gap-3">
                <label className="relative inline-block w-12 h-7">
                  <input
                    type="checkbox"
                    checked={product.publish}
                    onChange={(e) => setProduct(prev => ({...prev, publish: e.target.checked}))}
                    className="opacity-0 w-0 h-0 peer"
                  />
                  <span className="absolute cursor-pointer top-0 left-0 right-0 bottom-0 bg-gray-200 rounded-full transition-all duration-300 before:absolute before:h-5 before:w-5 before:left-1 before:bottom-1 before:bg-white before:rounded-full before:transition-all before:duration-300 peer-checked:bg-blue-500 peer-checked:before:left-6"></span>
                </label>
                <span className="text-sm text-gray-700">
                  {product.publish ? "Público" : "Oculto"}
                </span>
              </div>
            </div>
          </div>
        </div>

        {/* Descripción */}
        <div className="flex flex-col gap-3">
          <label className="text-sm font-semibold text-gray-800">Descripción Detallada*</label>
          <textarea
            name="description"
            value={product.description}
            onChange={handleChange}
            className="w-full p-3 border border-gray-300 rounded-lg bg-gray-50 focus:outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-200 h-32 resize-y"
            placeholder="Describe características principales del producto"
            required
          />
        </div>

        {/* Subida de imágenes */}
        <div className="flex flex-col gap-3">
          <label className="text-sm font-semibold text-gray-800">Imágenes del Producto*</label>
          <div 
            className="border-2 border-dashed border-gray-300 rounded-xl p-8 flex flex-col items-center justify-center cursor-pointer bg-gray-50 hover:border-blue-500 hover:bg-blue-50 transition-colors min-h-[180px]"
            onClick={() => document.getElementById("fileInput").click()}
          >
            <FaCloudUploadAlt className="text-4xl text-gray-600 mb-4" />
            <div className="text-center">
              <p className="text-gray-900 font-medium">
                {loading ? "Subiendo archivos..." : "Arrastra tus imágenes aquí"}
              </p>
              <p className="text-gray-600 text-sm mt-1">
                Formatos soportados: PNG, JPG (Máx. 10MB)
              </p>
            </div>
            <input
              type="file"
              id="fileInput"
              hidden
              multiple
              onChange={handleImageUpload}
              accept="image/*"
            />
          </div>
          
          {/* Previsualización de imágenes */}
          <div className="grid grid-cols-[repeat(auto-fill,minmax(150px,1fr))] gap-4 mt-6">
            {product.image.map((img, index) => (
              <div key={index} className="relative rounded-lg overflow-hidden shadow-md hover:translate-y-[-2px] transition-transform">
                <img 
                  src={img} 
                  alt={`Vista previa ${index}`} 
                  className="w-full h-36 object-cover"
                />
                <button 
                  type="button" 
                  className="absolute top-2 right-2 bg-white/90 rounded-full p-1 shadow-sm hover:bg-white"
                  onClick={() => handleRemoveImage(index)}
                >
                  <MdDelete className="text-red-600 text-xl" />
                </button>
              </div>
            ))}
          </div>
        </div>

        <button 
          type="submit" 
          className="w-full p-4 bg-blue-500 text-white rounded-lg font-semibold hover:bg-blue-600 transition-colors disabled:opacity-70 disabled:cursor-not-allowed"
          disabled={loading}
        >
          {loading ? "Publicando..." : "Publicar Producto"}
        </button>
      </form>
    </div>
  );
  };
  
  export default AddProduct;