import React, { useState } from "react";
import Navigation from "./componentes/Navigation";
import Services from "./componentes/Services";
import Products from "./componentes/Products";
import Cart from "./componentes/Cart";
import Footer from "./componentes/Footer";
import "./App.css";
import Header from "./componentes/Header";
import Login from "./componentes/Login";
import AdminOrders from "./componentes/AdmiOrders";
import AdminModal from "./componentes/adminModal";
// Y luego úsalo en tu JSX:

function App() {
  const [cartItems, setCartItems] = useState([]);
  const [isCartOpen, setIsCartOpen] = useState(false);
  const [isAdminModalOpen, setIsAdminModalOpen] = useState(false);

  // Estado de autenticación
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [currentUser, setCurrentUser] = useState(null);

  const addToCart = (item) => {
    setCartItems([...cartItems, item]);
  };

  const removeFromCart = (item) => {
    setCartItems(cartItems.filter((i) => i.serviceId !== item.serviceId));
  };

  const openCart = () => {
    setIsCartOpen(true);
  };

  const closeCart = () => {
    setIsCartOpen(false);
  };

  // Función de login
  const handleLoginSuccess = (userData) => {
    setIsAuthenticated(true);
    setCurrentUser(userData);
  };

  return (
    <div className="App">
      {!isAuthenticated ? (
        <Login onLoginSuccess={handleLoginSuccess} />
      ) : (
        <>
          <Header />
          <Navigation />
          <main>
            <Services
              cartItems={cartItems}
              addToCart={addToCart}
              removeFromCart={removeFromCart}
            />
            <Products
              cartItems={cartItems}
              addToCart={addToCart}
              removeFromCart={removeFromCart}
            />
          </main>
          {currentUser?.role === "admin" && (
            <div style={{ textAlign: "right", padding: "20px" }}>
              <button
                onClick={() => setIsAdminModalOpen(true)}
                style={{
                  backgroundColor: "#007bff",
                  color: "white",
                  border: "none",
                  padding: "10px 20px",
                  cursor: "pointer",
                  position: "fixed",
                  top: "1rem",
                  right: "5rem",
                  borderRadius:'50%',
                }}
              >
                Icono
              </button>
              <AdminModal
                isOpen={isAdminModalOpen}
                onClose={() => setIsAdminModalOpen(false)}
              />
            </div>
          )}
          {currentUser?.role === "admin" ? (
            <AdminOrders
              isOpen={isCartOpen}
              onClose={closeCart}
              openCart={openCart}
            />
          ) : (
            <Cart
              cartItems={cartItems}
              isOpen={isCartOpen}
              openCart={openCart}
              closeCart={closeCart}
              removeFromCart={removeFromCart}
            />
          )}
          <Footer />
        </>
      )}
    </div>
  );
}

export default App;
