import React, { useEffect, useState } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faBook } from '@fortawesome/free-solid-svg-icons';
import Alternativas from './plantillas/alternativas'; // Importa el componente de Alternativas
import Plantilla1Dom1 from './plantillas/plantilla1-dom1'; // Importa la primera plantilla
import Plantilla2Dom1 from './plantillas/plantilla2-dom1'; // Importa la segunda plantilla
import React from 'react';
  
// Estilos CSS para la barra de progreso
const progressBarStyles = {
  width: '100%',
  height: '20px',
  backgroundColor: '#ccc',
  borderRadius: '10px',
};

const filledProgressBarStyles = {
  height: '100%',
  backgroundColor: 'green',
  borderRadius: '10px',
};

const TareasDom1 = () => {
  // Estado para controlar si se muestra el contenido de Alternativas
  const [mostrarAlternativas, setMostrarAlternativas] = useState(false); // Cambia a false inicialmente
  const [generarValorAleatorio, SetgenerarValorAleatorio] = useState(0);
  // Estado para controlar qué plantilla se mostrará aleatoriamente
  const [mostrarPlantillaAleatoria, setMostrarPlantillaAleatoria] = useState(false);

  // Obtén el usuario del contexto
  // Estado para almacenar el usuario de la URL
  const [usuarioDeURL, setUsuarioDeURL] = useState(null);

  // Estado para controlar el número de preguntas y el límite de preguntas
  const [numeroPregunta, setNumeroPregunta] = useState(1);
  const [limitePreguntas, setLimitePreguntas] = useState(3); // Inicialmente, límite de 3 preguntas

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

  useEffect(() => {
    if (usuarioDeURL) {
      // Si usuarioDeURL existe, verifica su valor de ultima_tarea y decide qué mostrar
      const ultimaTareaGuardada = localStorage.getItem('ultimaTarea');
      if (ultimaTareaGuardada=== "calculo" || usuarioDeURL.ultima_tarea === null || ultimaTareaGuardada=== null) {
        setMostrarAlternativas(true);
        setMostrarPlantillaAleatoria(false);
        const numero_aleatorio_entero = Math.floor(Math.random() * (5 - 3 + 1)) + 3;

        setLimitePreguntas(numero_aleatorio_entero);
      } else if (ultimaTareaGuardada=== "alternativas") {
        console.log("ENTRO AQUI ")
        setMostrarAlternativas(false);
        setMostrarPlantillaAleatoria(true);
        SetgenerarValorAleatorio(Math.random());
      }
    }
  }, [usuarioDeURL]);

  // Función para generar una plantilla aleatoria
  const obtenerPlantillaAleatoria = () => {
    const plantillas = [Plantilla1Dom1, Plantilla2Dom1];
    const indiceAleatorio = Math.floor(Math.random() * plantillas.length);
    return plantillas[indiceAleatorio];
  };

  // Componente de la plantilla aleatoria
  const PlantillaAleatoria = mostrarPlantillaAleatoria ? obtenerPlantillaAleatoria() : null;

  
  useEffect(() => {
    // Esta función se ejecutará cada 1000 milisegundos (1 segundo)
    const intervalId = setInterval(() => {
      const resultadosGuardados = JSON.parse(localStorage.getItem('resultados'));
      const preguntasCorrectasGuardadas = JSON.parse(localStorage.getItem('preguntasCorrectas'));
      const ultimaTareaGuardada = localStorage.getItem('ultimaTarea');
      let cambio = localStorage.getItem('cambio'); // Obtener el valor de 'cambio'

      if (cambio === 'si') {
        // Cambiar el valor de 'cambio' a 'no' y almacenarlo en localStorage
        cambio = 'no';
        localStorage.setItem('cambio', cambio);

        let idEstudiante;
        if (usuarioDeURL) {
          idEstudiante = usuarioDeURL.id; // Debes implementar esta función
        }
        // Crear el objeto de datos a enviar en la solicitud POST
        const data = {
          idEstudiante,
          resultados: resultadosGuardados,
          preguntasCorrectas: preguntasCorrectasGuardadas,
          ultimaTarea: ultimaTareaGuardada,
        };

        // Realizar la solicitud a la API para cambiar el modelo Estudiante
        fetch('/api/estudiante', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify(data), // Enviar los datos como JSON
        })
          .then((response) => {
            if (response.ok) {
              console.log('El modelo Estudiante se cambió con éxito.');
            } else {
              console.error('Error al cambiar el modelo Estudiante:', response.statusText);
            }
          })
          .catch((error) => {
            console.error('Error al cambiar el modelo Estudiante:', error);
          });
          window.location.reload();
      }

      
    }, 1000);

    // Limpia el intervalo cuando el componente se desmonta o el efecto se vuelve a ejecutar
    return () => {
      clearInterval(intervalId);
    };
  }, []); // El arreglo de dependencias está vacío para que solo se ejecute en el montaje inicial

  return (
    <div className="bg-purple-200 text-blue-900 min-h-screen flex flex-col justify-center items-center">
      <div className="p-4 rounded-lg shadow-md text-center">
        <h2 className="flex items-center">
          <FontAwesomeIcon icon={faBook} className="mr-2" />
          <span className="text-xl font-semibold">
            Tema: Características de las ondas (rapidez, longitud de onda y frecuencia)
          </span>
        </h2>
        {/* Muestra el nombre del usuario si está disponible en la URL */}
        {usuarioDeURL && (
          <>
            <p className="mt-4">Estudiante: {usuarioDeURL.nombre_usuario}</p>
            <p className="mt-4">Avance: </p>
            {/* Barra de progreso */}
            {usuarioDeURL.avance && (
              <div style={progressBarStyles}>
                <div
                  style={{
                    ...filledProgressBarStyles,
                    width: `${(usuarioDeURL.avance['1'] / 10) * 100}%`, // Calcula el ancho de la barra de progreso
                  }}
                ></div>
              </div>
            )}

          </>
        )}
      </div>

      {/* Mostrar el contenido de Alternativas.js si mostrarAlternativas es true */}
      {mostrarAlternativas && <Alternativas datos={{ dominio: 1, avance: usuarioDeURL.avance, numeroPreguntas: limitePreguntas }} />}

      {/* Mostrar la plantilla aleatoria si mostrarPlantillaAleatoria es true */}
      {PlantillaAleatoria}
            {/* Mostrar una de las plantillas aleatoriamente */}
            
      {mostrarPlantillaAleatoria ? (
        
        // Muestra Plantilla1Dom1 si el valor aleatorio es menor que 0.5, de lo contrario, muestra Plantilla2Dom2
        generarValorAleatorio < 0.5 ? <Plantilla1Dom1 /> : <Plantilla2Dom1 />
      ) : null}



      {/* Botón "Saltar Tarea" */}
      <button
        onClick={() => {
          window.location.reload(); // Actualiza la página
        }}
        className="bg-purple-900 text-white rounded-lg p-2 mt-4"
      >
        Saltar Tarea
      </button>
    </div>
  );
};

export default TareasDom1;