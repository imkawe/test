// Context/UserContext.js
import { createContext, useState, useEffect, useContext } from "react";

const UserContext = createContext(null);

export const UserProvider = ({ children }) => {
  const [user, setUser] = useState(null);

  useEffect(() => {
    const updateUserFromStorage = () => {
      const storedUser = sessionStorage.getItem("userData");
      if (storedUser) {
        const parsedUser = JSON.parse(storedUser);
        setUser(parsedUser.userData);
      }
    };

    updateUserFromStorage();

    // Agregamos un evento para detectar cambios en sessionStorage
    window.addEventListener("storage", updateUserFromStorage);

    return () => {
      window.removeEventListener("storage", updateUserFromStorage);
    };
  }, []);

  return (
    <UserContext.Provider value={{ user, setUser }}>
      {children}
    </UserContext.Provider>
  );
};

export const useUser = () => {
  const context = useContext(UserContext);
  if (!context) {
    throw new Error("useUser debe estar dentro de UserProvider");
  }
  return context;
};
