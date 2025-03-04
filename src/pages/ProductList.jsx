import { useState, useEffect } from 'react';
import axios from 'axios';
import { Link } from 'react-router-dom';
import { useUser } from '../context/UserContext';

const ProductList = () => {
  const [products, setProducts] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const { user } = useUser();
  const itemsPerPage = 8;

  // Estilos completos
  const styles = {
    container: {
      maxWidth: '1280px',
      margin: '0 auto',
      padding: '2rem',
      minHeight: '100vh'
    },
    header: {
      display: 'flex',
      justifyContent: 'space-between',
      alignItems: 'center',
      marginBottom: '3rem'
    },
    title: {
      fontSize: '2rem',
      fontWeight: '700',
      color: '#1a202c',
      fontFamily: '"Georgia", serif'
    },
    newProductButton: {
      backgroundColor: '#059669',
      color: 'white',
      padding: '0.75rem 1.5rem',
      borderRadius: '12px',
      display: 'flex',
      alignItems: 'center',
      gap: '0.5rem',
      transition: 'all 0.3s ease',
      textDecoration: 'none',
      ':hover': {
        backgroundColor: '#047857',
        transform: 'translateY(-2px)',
        boxShadow: '0 4px 6px rgba(0, 0, 0, 0.1)'
      }
    },
    productsGrid: {
      display: 'grid',
      gap: '1.5rem',
      gridTemplateColumns: 'repeat(auto-fill, minmax(280px, 1fr))'
    },
    productCard: {
      backgroundColor: 'white',
      borderRadius: '16px',
      padding: '1.5rem',
      boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1)',
      transition: 'box-shadow 0.3s ease',
      border: '1px solid #f7fafc',
      ':hover': {
        boxShadow: '0 10px 15px -3px rgba(0, 0, 0, 0.1)'
      }
    },
    imageContainer: {
      position: 'relative',
      overflow: 'hidden',
      borderRadius: '12px',
      aspectRatio: '1/1',
      backgroundColor: '#f8fafc'
    },
    productImage: {
      width: '100%',
      height: '100%',
      objectFit: 'cover',
      transition: 'transform 0.3s ease',
      ':hover': {
        transform: 'scale(1.05)'
      }
    },
    productName: {
      fontSize: '1.125rem',
      fontWeight: '600',
      color: '#1a202c',
      marginBottom: '0.5rem',
      overflow: 'hidden',
      textOverflow: 'ellipsis',
      whiteSpace: 'nowrap'
    },
    priceStockContainer: {
      display: 'flex',
      justifyContent: 'space-between',
      alignItems: 'center',
      marginBottom: '1rem'
    },
    priceTag: {
      backgroundColor: '#d1fae5',
      color: '#065f46',
      padding: '0.25rem 0.75rem',
      borderRadius: '999px',
      fontSize: '0.875rem'
    },
    stockInfo: {
      display: 'flex',
      alignItems: 'center',
      gap: '0.25rem',
      color: '#4a5568'
    },
    actionButtons: {
      display: 'flex',
      justifyContent: 'flex-end',
      gap: '0.5rem',
      marginTop: '1rem',
      paddingTop: '1rem',
      borderTop: '1px solid #f7fafc'
    },
    editButton: {
      backgroundColor: '#3b82f6',
      color: 'white',
      padding: '0.5rem 1rem',
      borderRadius: '8px',
      border: 'none',
      cursor: 'pointer',
      display: 'flex',
      alignItems: 'center',
      gap: '0.5rem',
      transition: 'background-color 0.3s ease',
      textDecoration: 'none',
      ':hover': {
        backgroundColor: '#2563eb'
      }
    },
    deleteButton: {
      backgroundColor: '#ef4444',
      color: 'white',
      padding: '0.5rem 1rem',
      borderRadius: '8px',
      border: 'none',
      cursor: 'pointer',
      display: 'flex',
      alignItems: 'center',
      gap: '0.5rem',
      transition: 'background-color 0.3s ease',
      ':hover': {
        backgroundColor: '#dc2626'
      }
    },
    pagination: {
      display: 'flex',
      justifyContent: 'center',
      gap: '0.5rem',
      marginTop: '2rem'
    },
    pageButton: {
      backgroundColor: 'white',
      color: '#4a5568',
      padding: '0.5rem 1rem',
      borderRadius: '8px',
      border: '1px solid #e2e8f0',
      display: 'flex',
      alignItems: 'center',
      transition: 'background-color 0.3s ease',
      cursor: 'pointer',
      ':hover:not(:disabled)': {
        backgroundColor: '#f8fafc'
      },
      ':disabled': {
        opacity: 0.5,
        cursor: 'not-allowed'
      }
    },
    currentPage: {
      margin: '0 0.5rem',
      fontWeight: '600',
      color: '#059669'
    },
    emptyState: {
      textAlign: 'center',
      padding: '3rem 0',
      gridColumn: '1 / -1'
    },
    emptyIcon: {
      width: '6rem',
      height: '6rem',
      color: '#cbd5e0',
      margin: '0 auto'
    }
  };

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const response = await axios.get(`${import.meta.env.VITE_API_URL}/api/products?page=${currentPage}&limit=${itemsPerPage}`);
        if (Array.isArray(response.data)) {
          setProducts(response.data);
          setTotalPages(1);
        }
      } catch (error) {
        console.error('Error fetching products:', error);
      }
    };
    fetchProducts();
  }, [currentPage]);

  const handleDelete = async (productId) => {
    if (window.confirm('¿Estás seguro de eliminar este producto?')) {
      try {
        const response = await axios.delete(`${import.meta.env.VITE_API_URL}/api/products/${productId}`, {
          headers: { Authorization: `Bearer ${sessionStorage.getItem('authToken')}` }
        });
  
        // Verificamos si la eliminación fue exitosa
        if (response.status === 200) {
          // Filtramos el producto eliminado del estado
          setProducts((prevProducts) => prevProducts.filter(product => product.id !== productId));
          alert('Producto eliminado correctamente');
        } else {
          alert('Error al eliminar el producto');
        }
      } catch (error) {
        // Manejo de error más detallado
        if (error.response && error.response.status === 404) {
          alert('Producto no encontrado');
        } else {
          console.error('Error deleting product:', error);
          alert('Hubo un error al intentar eliminar el producto');
        }
      }
    }
  };
  

  return (
    <div style={styles.container}>
      <div style={styles.header}>
        <h1 style={styles.title}>Productos</h1>
        {user?.role === 'ADMIN' && (
          <Link to="/products/new" style={styles.newProductButton}>
            <svg xmlns="http://www.w3.org/2000/svg" style={{ width: '1.25rem', height: '1.25rem' }} viewBox="0 0 20 20" fill="currentColor">
              <path fillRule="evenodd" d="M10 3a1 1 0 011 1v5h5a1 1 0 110 2h-5v5a1 1 0 11-2 0v-5H4a1 1 0 110-2h5V4a1 1 0 011-1z" clipRule="evenodd" />
            </svg>
            Nuevo Producto
          </Link>
        )}
      </div>

      <div style={styles.productsGrid}>
        {products.length > 0 ? (
          products.map(product => (
            <div key={product.id} style={styles.productCard}>
              <div style={styles.imageContainer}>
                {JSON.parse(product.image)[0] ? (
                  <img 
                    src={JSON.parse(product.image)[0]} 
                    alt={product.name}
                    style={styles.productImage}
                    loading="lazy"
                  />
                ) : (
                  <div style={{ 
                    width: '100%',
                    height: '100%',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center'
                  }}>
                    <svg style={{ width: '3rem', height: '3rem', color: '#a0aec0' }} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                    </svg>
                  </div>
                )}
              </div>

              <div style={{ paddingTop: '1rem' }}>
                <h3 style={styles.productName}>{product.name}</h3>
                <div style={styles.priceStockContainer}>
                  <span style={styles.priceTag}>${product.price}</span>
                  <div style={styles.stockInfo}>
                    <svg style={{ width: '1.25rem', height: '1.25rem' }} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 8h14M5 8a2 2 0 110-4h14a2 2 0 110 4M5 8v10a2 2 0 002 2h10a2 2 0 002-2V8m-9 4h4" />
                    </svg>
                    <span>{product.stock}</span>
                  </div>
                </div>
                
                {user?.role === 'ADMIN' && (
                  <div style={styles.actionButtons}>
                    <Link
                      to={`/products/edit/${product.id}`}
                      style={styles.editButton}
                    >
                      <svg style={{ width: '1rem', height: '1rem' }} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15.232 5.232l3.536 3.536m-2.036-5.036a2.5 2.5 0 113.536 3.536L6.5 21.036H3v-3.572L16.732 3.732z" />
                      </svg>
                      Editar
                    </Link>
                    <button
                      onClick={() => handleDelete(product.id)}
                      style={styles.deleteButton}
                    >
                      <svg style={{ width: '1rem', height: '1rem' }} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                      </svg>
                      Eliminar
                    </button>
                  </div>
                )}
              </div>
            </div>
          ))
        ) : (
          <div style={styles.emptyState}>
            <svg style={styles.emptyIcon} fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 7v10c0 2.21 3.582 4 8 4s8-1.79 8-4V7M4 7c0 2.21 3.582 4 8 4s8-1.79 8-4M4 7c0-2.21 3.582-4 8-4s8 1.79 8 4m0 5c0 2.21-3.582 4-8 4s-8-1.79-8-4" />
            </svg>
            <h3 style={{ fontSize: '1.25rem', fontWeight: '500', color: '#1a202c', marginTop: '0.5rem' }}>
              No hay productos
            </h3>
            <p style={{ color: '#718096', marginTop: '0.25rem' }}>
              Agrega nuevos productos usando el botón superior
            </p>
          </div>
        )}
      </div>

      <div style={styles.pagination}>
        <button
          onClick={() => setCurrentPage(prev => Math.max(1, prev - 1))}
          disabled={currentPage === 1}
          style={styles.pageButton}
        >
          <svg style={{ width: '1.25rem', height: '1.25rem', marginRight: '0.5rem' }} fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
          </svg>
          Anterior
        </button>
        
        <div style={styles.pageButton}>
          Página <span style={styles.currentPage}>{currentPage}</span> de {totalPages}
        </div>
        
        <button
          onClick={() => setCurrentPage(prev => Math.min(totalPages, prev + 1))}
          disabled={currentPage === totalPages}
          style={styles.pageButton}
        >
          Siguiente
          <svg style={{ width: '1.25rem', height: '1.25rem', marginLeft: '0.5rem' }} fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
          </svg>
        </button>
      </div>
    </div>
  );
};

export default ProductList;