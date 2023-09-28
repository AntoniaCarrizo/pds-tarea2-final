import React, { createContext, useState, useContext } from 'react';

const PreguntaContext = createContext();

export function usePregunta() {
  return useContext(PreguntaContext);
}

export function PreguntaProvider({ children }) {
  const [pregunta, setPregunta] = useState(null);

  // Aquí puedes definir las funciones o estados relacionados con la pregunta

  return (
    <PreguntaContext.Provider value={{ pregunta, setPregunta }}>
      {children}
    </PreguntaContext.Provider>
  );
}
