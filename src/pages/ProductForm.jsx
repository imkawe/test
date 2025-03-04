




import { useState, useEffect } from "react";
import axios from "axios";
import { toast } from "react-toastify";
import { FaCloudUploadAlt } from "react-icons/fa";
import { MdDelete } from "react-icons/md";

const ProductForm = ({ initialData, onSubmit, isSubmitting }) => {
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
    category_id: 4 // ID fijo según AddProduct
  });

  const [loadingImages, setLoadingImages] = useState(false);

  useEffect(() => {
    if (initialData) {
      setProduct({
        ...initialData,
        stock: initialData.stock?.toString() || "",
        price: initialData.price?.toString() || "",
        discount: initialData.discount?.toString() || "",
        more_details: typeof initialData.more_details === 'string' 
          ? initialData.more_details 
          : JSON.stringify(initialData.more_details)
      });
    }
  }, [initialData]);

  const handleImageUpload = async (e) => {
    const files = e.target.files;
    if (!files?.length) return;

    setLoadingImages(true);
    const cloudName = import.meta.env.VITE_CLOUDINARY_CLOUD_NAME;
    const uploadPreset = import.meta.env.VITE_CLOUDINARY_UPLOAD_PRESET;
    
    
    try {
      const newImages = await Promise.all(
        Array.from(files).map(async (file) => {
          const formData = new FormData();
          formData.append("file", file);
          formData.append("upload_preset", uploadPreset);

          const res = await axios.post(
            `https://api.cloudinary.com/v1_1/${cloudName}/image/upload`,
            formData
          );
          return res.data.secure_url;
        })
      );

      setProduct(prev => ({
        ...prev,
        image: [...prev.image, ...newImages]
      }));
      toast.success("¡Imágenes subidas!");
    } catch (error) {
      toast.error("Error subiendo imágenes");
    }
    setLoadingImages(false);
  };

  const handleRemoveImage = (index) => {
    setProduct(prev => ({
      ...prev,
      image: prev.image.filter((_, i) => i !== index)
    }));
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setProduct(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    
    // Validaciones
    if (product.image.length === 0) return toast.warn("Sube al menos 1 imagen");
    if (product.discount > 100 || product.discount < 0) return toast.error("Descuento inválido");

    try {
      JSON.parse(product.more_details);
    } catch (error) {
      return toast.error("Formato JSON inválido en detalles adicionales");
    }

    const formattedData = {
      ...product,
      stock: Number(product.stock),
      price: Number(product.price),
      discount: Number(product.discount),
      more_details: JSON.parse(product.more_details)
    };

    onSubmit(formattedData);
  };

  return (
    <div style={styles.container}>
      <header style={styles.header}>
        <h1 style={styles.title}>
          {initialData ? "Editar Producto" : "Nuevo Producto"}
        </h1>
        <p style={styles.subtitle}>
          {initialData ? "Modifica los detalles del producto" : "Registra los detalles de tu producto"}
        </p>
      </header>

      <form onSubmit={handleSubmit} style={styles.form}>
        <div style={styles.grid}>
          {/* Columna Izquierda */}
          <div style={styles.formColumn}>
            <div style={styles.formGroup}>
              <label style={styles.label}>Nombre del Producto*</label>
              <input
                name="name"
                value={product.name}
                onChange={handleChange}
                style={styles.input}
                placeholder="Ej: Zapatos deportivos"
                required
              />
            </div>

            <div style={styles.formGroup}>
              <label style={styles.label}>Precio (USD)*</label>
              <div style={styles.inputWithSymbol}>
                <span style={styles.currency}>$</span>
                <input
                  type="number"
                  name="price"
                  value={product.price}
                  onChange={handleChange}
                  style={{...styles.input, paddingLeft: '32px'}}
                  min="0"
                  step="0.01"
                  required
                />
              </div>
            </div>

            <div style={styles.formGroup}>
              <label style={styles.label}>Descuento (%)</label>
              <input
                type="number"
                name="discount"
                value={product.discount}
                onChange={handleChange}
                style={styles.input}
                min="0"
                max="100"
                placeholder="0-100%"
              />
            </div>
          </div>

          {/* Columna Derecha */}
          <div style={styles.formColumn}>
            <div style={styles.formGroup}>
              <label style={styles.label}>Stock Disponible*</label>
              <input
                type="number"
                name="stock"
                value={product.stock}
                onChange={handleChange}
                style={styles.input}
                min="0"
                placeholder="Cantidad en inventario"
                required
              />
            </div>

            <div style={styles.formGroup}>
              <label style={styles.label}>Unidad de Medida*</label>
              <div style={styles.selectWrapper}>
                <select
                  name="unit"
                  value={product.unit}
                  onChange={handleChange}
                  style={styles.select}
                  required
                >
                  <option value="">Seleccionar unidad</option>
                  <option value="unidad">Unidad</option>
                  <option value="par">Par</option>
                  <option value="kg">Kilogramo</option>
                  <option value="litro">Litro</option>
                </select>
              </div>
            </div>

            <div style={styles.formGroup}>
              <label style={styles.label}>Estado</label>
              <div style={styles.switchContainer}>
                <label style={styles.switch}>
                  <input
                    type="checkbox"
                    checked={product.publish}
                    onChange={(e) => setProduct(prev => ({
                      ...prev,
                      publish: e.target.checked
                    }))}
                  />
                  <span style={styles.slider}></span>
                </label>
                <span style={styles.switchLabel}>
                  {product.publish ? "Público" : "Oculto"}
                </span>
              </div>
            </div>
          </div>
        </div>

        {/* Campos Adicionales */}
        <div style={styles.formGroup}>
          <label style={styles.label}>Descripción Detallada*</label>
          <textarea
            name="description"
            value={product.description}
            onChange={handleChange}
            style={{...styles.input, ...styles.textarea}}
            placeholder="Describe características principales del producto"
            rows={4}
            required
          />
        </div>

        <div style={styles.formGroup}>
          <label style={styles.label}>Detalles Técnicos (JSON)*</label>
          <textarea
            name="more_details"
            value={product.more_details}
            onChange={handleChange}
            style={{...styles.input, ...styles.textarea}}
            placeholder='Ej: {"color": "rojo", "material": "cuero"}'
            required
          />
        </div>

        {/* Sección Imágenes */}
        <div style={styles.formGroup}>
          <label style={styles.label}>Imágenes del Producto*</label>
          <div 
            style={styles.uploadArea}
            onClick={() => document.getElementById("fileInput").click()}
          >
            <FaCloudUploadAlt style={styles.uploadIcon} />
            <div style={styles.uploadTextContainer}>
              <p style={styles.uploadMainText}>
                {loadingImages ? "Subiendo..." : "Arrastra tus imágenes aquí"}
              </p>
              <p style={styles.uploadSubText}>Formatos soportados: PNG, JPG (Máx. 10MB)</p>
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
          
          <div style={styles.imageGrid}>
            {product.image.map((img, index) => (
              <div key={index} style={styles.imageCard}>
                <img 
                  src={img} 
                  alt={`Vista previa ${index}`} 
                  style={styles.imagePreview}
                />
                <button 
                  type="button" 
                  style={styles.deleteButton}
                  onClick={() => handleRemoveImage(index)}
                >
                  <MdDelete style={styles.deleteIcon} />
                </button>
              </div>
            ))}
          </div>
        </div>

        <button 
          type="submit" 
          style={styles.submitButton}
          disabled={isSubmitting}
        >
          {isSubmitting 
            ? (initialData ? "Guardando..." : "Publicando...") 
            : (initialData ? "Guardar Cambios" : "Publicar Producto")}
        </button>
      </form>
    </div>
  );
};

// Estilos actualizados con camelCase para media queries
const styles = {
  container: {
    maxWidth: '1000px',
    margin: '2rem auto',
    padding: '2rem',
    backgroundColor: '#ffffff',
    borderRadius: '16px',
    boxShadow: '0 8px 30px rgba(0,0,0,0.12)',
  },
  grid: {
    display: 'grid',
    gridTemplateColumns: '1fr 1fr',
    gap: '2rem',
    '@media (maxWidth: 768px)': {
      gridTemplateColumns: '1fr',
    },
  },
  container: {
    maxWidth: '1000px',
    margin: '2rem auto',
    padding: '2rem',
    backgroundColor: '#ffffff',
    borderRadius: '16px',
    boxShadow: '0 8px 30px rgba(0,0,0,0.12)',
  },
  header: {
    textAlign: 'center',
    marginBottom: '2rem',
  },
  title: {
    fontSize: '2rem',
    fontWeight: '700',
    color: '#1a202c',
    marginBottom: '0.5rem',
  },
  subtitle: {
    fontSize: '1rem',
    color: '#718096',
  },
  form: {
    display: 'flex',
    flexDirection: 'column',
    gap: '2rem',
  },
  grid: {
    display: 'grid',
    gridTemplateColumns: '1fr 1fr',
    gap: '2rem',
    '@media (max-width: 768px)': {
      gridTemplateColumns: '1fr',
    },
  },
  formColumn: {
    display: 'flex',
    flexDirection: 'column',
    gap: '1.5rem',
  },
  formGroup: {
    display: 'flex',
    flexDirection: 'column',
    gap: '0.75rem',
  },
  label: {
    fontSize: '0.875rem',
    fontWeight: '600',
    color: '#2d3748',
  },
  input: {
    width: '100%',
    padding: '0.875rem 1rem',
    border: '1px solid #e2e8f0',
    borderRadius: '8px',
    fontSize: '1rem',
    backgroundColor: '#f8fafc',
    transition: 'all 0.2s ease',
    ':focus': {
      outline: 'none',
      borderColor: '#4299e1',
      boxShadow: '0 0 0 3px rgba(66, 153, 225, 0.2)',
    },
  },
  textarea: {
    height: '120px',
    resize: 'vertical',
  },
  inputWithSymbol: {
    position: 'relative',
  },
  currency: {
    position: 'absolute',
    left: '12px',
    top: '50%',
    transform: 'translateY(-50%)',
    color: '#718096',
    fontSize: '1rem',
  },
  selectWrapper: {
    position: 'relative',
  },
  select: {
    appearance: 'none',
    width: '100%',
    padding: '0.875rem 1rem',
    border: '1px solid #e2e8f0',
    borderRadius: '8px',
    fontSize: '1rem',
    backgroundColor: '#f8fafc',
  },
  switchContainer: {
    display: 'flex',
    alignItems: 'center',
    gap: '0.75rem',
  },
  switch: {
    position: 'relative',
    display: 'inline-block',
    width: '48px',
    height: '28px',
  },
  slider: {
    position: 'absolute',
    cursor: 'pointer',
    top: '0',
    left: '0',
    right: '0',
    bottom: '0',
    backgroundColor: '#e2e8f0',
    transition: '0.4s',
    borderRadius: '34px',
    ':before': {
      position: 'absolute',
      content: '""',
      height: '20px',
      width: '20px',
      left: '4px',
      bottom: '4px',
      backgroundColor: 'white',
      transition: '0.4s',
      borderRadius: '50%',
    },
  },
  switchLabel: {
    fontSize: '0.875rem',
    color: '#4a5568',
  },
  uploadArea: {
    border: '2px dashed #cbd5e0',
    borderRadius: '12px',
    padding: '2rem',
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    justifyContent: 'center',
    cursor: 'pointer',
    backgroundColor: '#f8fafc',
    transition: 'all 0.2s ease',
    minHeight: '180px',
    ':hover': {
      borderColor: '#4299e1',
      backgroundColor: '#ebf8ff',
    },
  },
  uploadIcon: {
    fontSize: '2.5rem',
    color: '#718096',
    marginBottom: '1rem',
  },
  uploadTextContainer: {
    textAlign: 'center',
  },
  uploadMainText: {
    color: '#2d3748',
    fontWeight: '500',
    margin: '0',
  },
  uploadSubText: {
    color: '#718096',
    fontSize: '0.875rem',
    margin: '0.5rem 0 0',
  },
  imageGrid: {
    display: 'grid',
    gridTemplateColumns: 'repeat(auto-fill, minmax(150px, 1fr))',
    gap: '1rem',
    marginTop: '1.5rem',
  },
  imageCard: {
    position: 'relative',
    borderRadius: '8px',
    overflow: 'hidden',
    boxShadow: '0 2px 8px rgba(0,0,0,0.1)',
    transition: 'transform 0.2s ease',
    ':hover': {
      transform: 'translateY(-2px)',
    },
  },
  imagePreview: {
    width: '100%',
    height: '150px',
    objectFit: 'cover',
  },
  deleteButton: {
    position: 'absolute',
    top: '8px',
    right: '8px',
    background: 'rgba(255,255,255,0.9)',
    borderRadius: '50%',
    padding: '4px',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    boxShadow: '0 2px 4px rgba(0,0,0,0.1)',
    border: 'none',
    cursor: 'pointer',
  },
  deleteIcon: {
    color: '#e53e3e',
    fontSize: '1.25rem',
  },
  submitButton: {
    width: '100%',
    padding: '1rem',
    backgroundColor: '#4299e1',
    color: 'white',
    border: 'none',
    borderRadius: '8px',
    fontSize: '1rem',
    fontWeight: '600',
    cursor: 'pointer',
    transition: 'all 0.2s ease',
    ':hover': {
      backgroundColor: '#3182ce',
    },
    ':disabled': {
      opacity: '0.7',
      cursor: 'not-allowed',
    },
  },
};

export default ProductForm;

