import React from "react";
import ReactDOM from "react-dom/client";
import { BrowserRouter } from "react-router-dom";
import App from "./App";
import { UserProvider } from "./context/UserContext"; // 👈 Importa UserProvider
import "./index.css"; 
import { CartProvider } from "./context/CartContext";
ReactDOM.createRoot(document.getElementById("root")).render(
  <UserProvider>  {/* 👈 Agrega este wrapper */}
    <CartProvider>
    <BrowserRouter>
      <App />
    </BrowserRouter>
    </CartProvider>
  </UserProvider>
);
