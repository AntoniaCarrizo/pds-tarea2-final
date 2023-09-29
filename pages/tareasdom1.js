import React, { useEffect, useState } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faBook } from '@fortawesome/free-solid-svg-icons';

const TareasDom1 = () => {
  // Obtén el usuario del contexto
  // Estado para almacenar el usuario de la URL
  const [usuarioDeURL, setUsuarioDeURL] = useState(null);

  useEffect(() => {
    // Obtiene la cadena de consulta de la URL
    const queryString = window.location.search;
    const urlParams = new URLSearchParams(queryString);

    // Obtiene el valor 'user' de la cadena de consulta
    const userFromURL = urlParams.get('user');

    if (userFromURL) {
      try {
        // Intenta parsear el usuario desde JSON
        const usuarioParseado = JSON.parse(decodeURIComponent(userFromURL));
        setUsuarioDeURL(usuarioParseado);
      } catch (error) {
        console.error('Error al analizar el usuario de la URL:', error);
      }
    }
  }, []);

  return (
    <div className="bg-purple-200 text-blue-900 min-h-screen flex flex-col justify-center items-center">
      <div className="p-4 rounded-lg shadow-md text-center">
        <h2 className="flex items-center">
          <FontAwesomeIcon icon={faBook} className="mr-2" />
          <span className="text-xl font-semibold">
            Tema: Características de las ondas (rapidez, longitud de onda y frecuencia)
          </span>
        </h2>
        <p className="mt-2">Tipo de pregunta: [Agrega aquí el tipo de pregunta]</p>

        {/* Muestra el nombre del usuario si está disponible en la URL */}
        {usuarioDeURL && (
          <p className="mt-4">Estudiante: {usuarioDeURL.nombre_usuario}</p>
        )}
      </div>
    </div>
  );
};

export default TareasDom1;
