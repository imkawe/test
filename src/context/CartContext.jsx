import React, { createContext, useContext, useReducer, useEffect } from "react";

const CartContext = createContext();

const cartReducer = (state, action) => {
  switch (action.type) {
    case "ADD_ITEM":
      const existingItem = state.find(item => item.id === action.payload.id);
      if (existingItem) {
        return state.map(item =>
          item.id === action.payload.id
            ? { ...item, quantity: item.quantity + action.payload.quantity }
            : item
        );
      }
      return [...state, action.payload];

    case "REMOVE_ITEM":
      return state.filter(item => item.id !== action.payload.id);

    case "UPDATE_QUANTITY":
      return state.map(item =>
        item.id === action.payload.id
          ? { ...item, quantity: Math.max(1, action.payload.quantity) }
          : item
      );

    case "CLEAR_CART":
      window.dispatchEvent(new Event("cartUpdated")); // Notificar a otros componentes
      return [];

    default:
      return state;
  }
};

export const CartProvider = ({ children }) => {
  const [cart, dispatch] = useReducer(cartReducer, [], () => {
    if (typeof window !== "undefined") {
      return JSON.parse(sessionStorage.getItem("cart")) || [];
    }
    return [];
  });

  useEffect(() => {
    sessionStorage.setItem("cart", JSON.stringify(cart));
    window.dispatchEvent(new Event("cartUpdated")); // Notificar cambios
  }, [cart]);

  const getItemQuantity = (id) => {
    return cart.find(item => item.id === id)?.quantity || 0;
  };

  const value = {
    cart,
    cartCount: cart.reduce((total, item) => total + item.quantity, 0),
    cartTotal: cart.reduce((total, item) => total + (item.price * item.quantity * (1 - item.discount / 100)), 0),
    addItem: (item) => {
      if (item.quantity < 1) return;
      dispatch({ type: "ADD_ITEM", payload: item });
    },
    removeItem: (id) => dispatch({ type: "REMOVE_ITEM", payload: { id } }),
    updateQuantity: (id, newQuantity) => {
      if (newQuantity < 1) return;
      dispatch({ type: "UPDATE_QUANTITY", payload: { id, quantity: newQuantity } });
    },
    clearCart: () => dispatch({ type: "CLEAR_CART" }),
    getItemQuantity
  };

  return <CartContext.Provider value={value}>{children}</CartContext.Provider>;
};

export const useCart = () => {
  const context = useContext(CartContext);
  if (!context) {
    throw new Error("useCart debe usarse dentro de un CartProvider");
  }
  return context;
};