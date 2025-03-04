// components/ProductActions.jsx
import { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import axios from "axios";
import { toast } from "react-toastify";
import ProductForm from "./ProductForm";

const ProductActions = ({ actionType }) => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [product, setProduct] = useState(null);
  const [loading, setLoading] = useState(true);
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    const fetchProduct = async () => {
      try {
        const res = await axios.get(`${import.meta.env.VITE_API_URL}/api/products/${id}`);
        setProduct(res.data);
      } catch (error) {
        toast.error("Error cargando producto");
        navigate("/products");
      } finally {
        setLoading(false);
      }
    };

    if (actionType !== "create") fetchProduct();
  }, [id, actionType, navigate]);

  const handleSubmit = async (formData) => {
    setIsSubmitting(true);
    try {
      const token = sessionStorage.getItem("authToken");
      
      if (actionType === "edit") {
        await axios.put(`${import.meta.env.VITE_API_URL}/api/products/${id}`, formData, {
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json"
          }
        });
        toast.success("Producto actualizado correctamente");
      } else if (actionType === "delete") {
        await axios.delete(`${import.meta.env.VITE_API_URL}/api/products/${id}`, {
          headers: { Authorization: `Bearer ${token}` }
        });
        toast.success("Producto eliminado correctamente");
      }
      
      navigate("/products");
    } catch (error) {
      toast.error(error.response?.data?.error || "Error en la operación");
    } finally {
      setIsSubmitting(false);
    }
  };

  if (loading) return <div style={styles.loading}>Cargando...</div>;

  return actionType === "delete" ? (
    <div style={styles.confirmationContainer}>
      <h2 style={styles.confirmationTitle}>¿Eliminar producto?</h2>
      <p style={styles.confirmationText}>
        Estás a punto de eliminar: <strong>{product.name}</strong>
      </p>
      <div style={styles.buttonGroup}>
        <button
          style={styles.cancelButton}
          onClick={() => navigate("/products")}
        >
          Cancelar
        </button>
        <button
          style={styles.deleteButton}
          onClick={() => handleSubmit()}
          disabled={isSubmitting}
        >
          {isSubmitting ? "Eliminando..." : "Confirmar Eliminación"}
        </button>
      </div>
    </div>
  ) : (
    <ProductForm 
      initialData={product}
      onSubmit={handleSubmit}
      isSubmitting={isSubmitting}
    />
  );
};

const styles = {
  loading: {
    textAlign: 'center',
    fontSize: '1.2rem',
    color: '#4a5568',
    padding: '2rem'
  },
  confirmationContainer: {
    maxWidth: '600px',
    margin: '2rem auto',
    padding: '2rem',
    backgroundColor: '#fff',
    borderRadius: '12px',
    boxShadow: '0 4px 20px rgba(0,0,0,0.08)',
    textAlign: 'center'
  },
  confirmationTitle: {
    fontSize: '1.8rem',
    color: '#2d3748',
    marginBottom: '1rem'
  },
  confirmationText: {
    fontSize: '1.1rem',
    color: '#718096',
    marginBottom: '2rem'
  },
  buttonGroup: {
    display: 'flex',
    justifyContent: 'center',
    gap: '1rem',
    marginTop: '1.5rem'
  },
  cancelButton: {
    padding: '0.8rem 1.5rem',
    backgroundColor: '#e2e8f0',
    color: '#2d3748',
    border: 'none',
    borderRadius: '8px',
    cursor: 'pointer',
    transition: 'all 0.2s ease',
    ':hover': {
      backgroundColor: '#cbd5e0'
    }
  },
  deleteButton: {
    padding: '0.8rem 1.5rem',
    backgroundColor: '#e53e3e',
    color: 'white',
    border: 'none',
    borderRadius: '8px',
    cursor: 'pointer',
    transition: 'all 0.2s ease',
    ':hover': {
      backgroundColor: '#c53030'
    }
  }
};

export default ProductActions;