import React, { Suspense, lazy, useState } from "react";
import { Routes, Route } from "react-router-dom";
import Header from "./components/Header";
import Footer from "./components/Footer";
import Home from "./pages/Home";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import UserHomeScreen from "./pages/UserHomeScreen";
import ProtectedRoute from "./components/ProtectedRoute";
import AdminPanel from "./pages/AdminPanel";
import ProductList from "./pages/ProductList";
import "./index.css";
import CheckoutSuccess from './pages/CheckoutSuccess';
import CheckoutCancel from './pages/CheckoutCancel';

import AboutUs from './components/AboutUs';
import ShippingPolicy from './components/ShippingPolicy';
import PrivacyPolicy from './components/PrivacyPolicy';
import ContactForm from "./components/ContactForm";
const Login = lazy(() => import("./pages/Login"));
const Signup = lazy(() => import("./pages/Signup"));
const NotFound = lazy(() => import("./pages/NotFound"));
const Profile = lazy(() => import("./pages/Profile"));
const EditProfile = lazy(() => import("./pages/EditProfile"));
const AddProduct = lazy(() => import("./pages/AddProduct"));
const ProductActions = lazy(() => import("./pages/ProductActions"));
const Cart = lazy(() => import("./pages/Cart"));
const ProductDetail = lazy(() => import("./pages/ProductDetail"));
const Checkout = lazy(() => import("./pages/Checkout"));
const MyOrders = lazy(() => import("./pages/MyOrders"));
const OrderDetail = lazy(() => import("./pages/OrderDetail"));
const AdminOrders = lazy(() => import("./pages/AdminOrders"));

const App = () => {
  const [searchQuery, setSearchQuery] = useState("");

  // Función para manejar la búsqueda
  const handleSearch = (query) => {
    setSearchQuery(query);
  };

  return (

    <div className="flex flex-col min-h-screen">
      {/* Header con función de búsqueda */}
      <Header onSearch={handleSearch} />

      {/* Línea separadora entre Header y contenido */}
      <div className="border-t border-gray-300"></div>

      {/* Contenido principal */}
      <main className="flex-grow">
        <Suspense fallback={<div>Loading...</div>}>
          <div className="pt-[80px]">
            <Routes>
              <Route path="/" element={<Home searchQuery={searchQuery} />} />
              <Route path="/login" element={<Login />} />
              <Route path="/signup" element={<Signup />} />
              <Route path="/homeScreen" element={<UserHomeScreen />} />
              <Route path="/profile" element={<Profile />} />
              <Route path="/admin/add-product" element={<AddProduct />} />
              <Route path="/about-us" element={<AboutUs />} />
              <Route path="/shipping-policy" element={<ShippingPolicy  />} />
              <Route path="/privacy-policy" element={<PrivacyPolicy  />} />
              <Route path="/contact-us" element={< ContactForm  />} />
             
              <Route path="/cart" element={<Cart />} />
              <Route
                path="/checkout"
                element={
                  <ProtectedRoute>
                    <Checkout />
                  </ProtectedRoute>
                }
              />
              <Route path="/checkout/success" element={<CheckoutSuccess />} />
              <Route path="/checkout/cancel" element={<CheckoutCancel />} />
              <Route
                path="/products"
                element={
                  <ProtectedRoute>
                    <ProductList />
                  </ProtectedRoute>
                }
              />
              <Route
                path="/products/new"
                element={
                  <ProtectedRoute adminOnly>
                    <AddProduct />
                  </ProtectedRoute>
                }
              />
              <Route
                path="/edit-profile"
                element={
                  <ProtectedRoute>
                    <EditProfile />
                  </ProtectedRoute>
                }
              />
              <Route
                path="/admin"
                element={
                  <ProtectedRoute>
                    <AdminPanel />
                  </ProtectedRoute>
                }
              />
              <Route
                path="/my-orders"
                element={
                  <ProtectedRoute>
                    <MyOrders />
                  </ProtectedRoute>
                }
              />
              <Route
                path="/products/edit/:id"
                element={
                  <ProtectedRoute adminOnly>
                    <ProductActions actionType="edit" />
                  </ProtectedRoute>
                }
              />
              <Route
                path="/products/delete/:id"
                element={
                  <ProtectedRoute adminOnly>
                    <ProductActions actionType="delete" />
                  </ProtectedRoute>
                }
              />
              <Route
                path="/order/:order_id"
                element={
                  <ProtectedRoute>
                    <OrderDetail />
                  </ProtectedRoute>
                }
              />
              <Route
                path="/admin/orders"
                element={
                  <ProtectedRoute adminOnly>
                    <AdminOrders />
                  </ProtectedRoute>
                }
              />
              <Route path="/products/:id" element={<ProductDetail />} />
              <Route path="*" element={<NotFound />} />
            </Routes>
          </div>
        </Suspense>
      </main>

      {/* Línea separadora entre contenido y Footer */}
      <div className="border-t border-gray-300"></div>

      {/* Footer */}
      <Footer />

      <ToastContainer
        position="top-center"
        autoClose={1000}
        hideProgressBar={true}
        closeOnClick
        theme="colored"
      />
    </div>
 
  );
};

export default App;
