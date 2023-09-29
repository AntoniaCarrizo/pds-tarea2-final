import { createContext, useContext, useState } from 'react';

// Crea el contexto de usuario
const UserContext = createContext();

// Proporciona un componente envolvente para el contexto
const UserProvider = ({ children }) => {
  // Define el estado o datos del usuario aquí
  const [usuario, setUsuario] = useState(null);

  // Función para actualizar el usuario
  const setUser = (nuevoUsuario) => {
    setUsuario(nuevoUsuario);
  };

  // Puedes proporcionar más funciones o datos aquí según tus necesidades

  return (
    <UserContext.Provider value={{ usuario, setUser }}>
      {children}
    </UserContext.Provider>
  );
};

// Crea un hook personalizado para acceder al contexto más fácilmente
const useUser = () => {
  return useContext(UserContext);
};

export { UserProvider, useUser };
