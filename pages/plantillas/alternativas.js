import React, { useState, useEffect } from 'react';


const Alternativas = (props) => {
  const { dominio, numeroPreguntas } = props.datos;
  const [preguntas, setPreguntas] = useState([]); // Estado para almacenar la lista de preguntas
  const [preguntaActual, setPreguntaActual] = useState(0); // Índice de la pregunta actual
  const [respuestas, setRespuestas] = useState({}); // Estado para almacenar las respuestas seleccionadas
  const [resultados, setResultados] = useState([]); // Estado para almacenar los resultados
  const [mostrarResultados, setMostrarResultados] = useState(false);
  const [intentosRestantes, setIntentosRestantes] = useState(2); // Número de intentos restantes, 2 en este caso
  const [mostrarVolverAIntentar, setMostrarVolverAIntentar] = useState(true); // Estado para mostrar/ocultar el botón "Volver a Intentar"
  const [resultado, setResultado] = useState([]);
  const [preguntasCorrectas, setPreguntasCorrectas] = useState([]);
  const [ultimaTarea, setultimaTarea] = useState([]);
  
  useEffect(() => {
    const obtenerPreguntas = async () => {
      try {
        const response = await fetch(`/api/alternativa?dominio=${dominio}&cantidad=${numeroPreguntas}`);
        
        if (response.ok) {
          const data = await response.json();
          if (data.success && data.preguntas) {
            setPreguntas(data.preguntas);
          } else {
            console.error('No se pudieron obtener las preguntas.');
          }
        } else {
          console.error('Error al obtener las preguntas:', response.statusText);
        }
      } catch (error) {
        console.error('Error al obtener las preguntas:', error);
      }
    };

    obtenerPreguntas();
  }, [dominio, numeroPreguntas]);

  useEffect(() => {
    // Cargar el estado de la pregunta actual y las respuestas desde el almacenamiento local al cargar la página
    const preguntaActualGuardada = localStorage.getItem('preguntaActual');
    const respuestasGuardadas = localStorage.getItem('respuestas');

    if (preguntaActualGuardada && respuestasGuardadas) {
      setPreguntaActual(parseInt(preguntaActualGuardada, 10));
      setRespuestas(JSON.parse(respuestasGuardadas));
    }
  }, []);

  useEffect(() => {
    // Almacenar el estado de la pregunta actual y las respuestas en el almacenamiento local cuando cambien
    localStorage.setItem('preguntaActual', preguntaActual.toString());
    localStorage.setItem('respuestas', JSON.stringify(respuestas));
  }, [preguntaActual, respuestas]);

  const handleSeleccionarRespuesta = (preguntaId, alternativa) => {
    setRespuestas({
      ...respuestas,
      [preguntaId]: alternativa,
    });
  };

  const handleSiguientePregunta = () => {
    if (preguntaActual < preguntas.length - 1) {
      setPreguntaActual(preguntaActual + 1);
    } else {
      // Todas las preguntas han sido respondidas
      // Puedes mostrar un resumen o realizar alguna acción
      console.log('Resumen de respuestas:', respuestas);
  
      // Verificar si todas las respuestas son correctas en el primer intento
      const respuestasCorrectas = preguntas.every((pregunta) => {
        const respuestaSeleccionada = respuestas[pregunta.id];
        return respuestaSeleccionada === pregunta.alternativa_correcta;
      });
  
      if (intentosRestantes === 2 && respuestasCorrectas) {
        // Si todas las respuestas son correctas en el primer intento, ocultar el botón "Volver a Intentar"
        setMostrarVolverAIntentar(false);
  
        // Obtener los ID de las respuestas correctas y almacenarlos en preguntasCorrectas
        const respuestasCorrectasIds = preguntas
          .filter((pregunta) => respuestas[pregunta.id] === pregunta.alternativa_correcta)
          .map((pregunta) => pregunta.id);
  
        setPreguntasCorrectas(respuestasCorrectasIds);
      }
  
      // Calcular los resultados
      const resultadosCalculados = preguntas.map((pregunta) => {
        const respuestaSeleccionada = respuestas[pregunta.id];
        const esCorrecta = respuestaSeleccionada === pregunta.alternativa_correcta;
        return {
          pregunta: pregunta.enunciado,
          alternativaRespondida: respuestaSeleccionada,
          esCorrecta,
          hint: pregunta.alternativas[respuestaSeleccionada],
        };
      });
  
      setResultados(resultadosCalculados);
      setMostrarResultados(true);
    }
  };
  

  const handleVolverAIntentar = () => {
    // Filtrar las preguntas incorrectamente respondidas
    const preguntasIncorrectas = preguntas.filter((pregunta) => {
      const respuestaSeleccionada = respuestas[pregunta.id];
      return respuestaSeleccionada !== pregunta.alternativa_correcta;
    });

    // Restaurar el número de intentos restantes
    setIntentosRestantes(intentosRestantes - 2);

    if (intentosRestantes === 1) {
      // Si es el último intento, mostrar los resultados finales
      setResultados(preguntasIncorrectas);
      setMostrarResultados(true);
      // Ocultar el botón "Volver a Intentar" después del segundo intento
      setMostrarVolverAIntentar(false);
    } else {
      // Si quedan intentos, mostrar solo las preguntas incorrectas
      setPreguntas(preguntasIncorrectas);
      setPreguntaActual(0);
      setRespuestas({});
      setMostrarResultados(false);
    }
  };

  const handleSiguienteTarea = () => {
    // Realizar redirección y pasar los datos en la URL
    const resultado = resultados.every((resultado) => resultado.esCorrecta) ? 'correcto' : 'incorrecto';
    const preguntasCorrectas = resultados
      .filter((resultado) => resultado.esCorrecta)
      .map((resultado) => resultado.pregunta);

    setResultado(resultado);
    setPreguntasCorrectas(preguntasCorrectas);
    setultimaTarea("alternativas");
    localStorage.setItem('resultados', JSON.stringify(resultados));
    localStorage.setItem('preguntasCorrectas', JSON.stringify(preguntasCorrectas));

    // Establece la tarea actual en localStorage
    localStorage.setItem('ultimaTarea', 'alternativas');
    localStorage.setItem('cambio', 'si');
  };

  return (
    <div className="p-8 bg-green-100 flex flex-col items-center justify-center">
      <h1 className="text-3xl font-semibold mb-4 text-blue-800">✏️ Pregunta de alternativas ✏️</h1>

      {mostrarResultados ? (
        <div>
          <h2 className="text-2xl font-semibold mb-4 text-green-800">Resultados:</h2>
          <ul>
            {resultados.map((resultado, index) => (
              <li key={index}>
                <p>Pregunta: {resultado.pregunta}</p>
                <p>Alternativa Respondida: {resultado.alternativaRespondida}</p>
                <p>Es Correcta: {resultado.esCorrecta ? 'Sí' : 'No'}</p>
                {resultado.esCorrecta ? null : (
                  <p className="text-1xl font-semibold mb-4 text-red-800">Hint: {resultado.hint}</p>
                )}
                <br />
              </li>
            ))}
          </ul>
          {intentosRestantes > 0 ? (
            mostrarVolverAIntentar && (
              <button
                onClick={handleVolverAIntentar}
                className="bg-blue-500 text-white py-2 px-4 mt-4 rounded-lg"
              >
                Volver a Intentar
              </button>
              
            )
          ) : (
            <p></p>
          )}
                      <button
              onClick={handleSiguienteTarea}
              className="bg-blue-500 text-white py-2 px-4 mt-4 rounded-lg"
            >
              Siguiente Tarea
            </button>
        </div>
      ) : (
        preguntas.length > 0 && preguntaActual < preguntas.length ? (
          <div>
            <p className="text-2xl  mb-4 text-green-700">Pregunta {preguntaActual + 1} de {preguntas.length}</p>
            <p>Enunciado: {preguntas[preguntaActual].enunciado}</p>
            <ul>
              {Object.entries(preguntas[preguntaActual].alternativas).map(([alternativa, hints], index) => (
                <li key={index}>
                  <label>
                    <input
                      type="radio"
                      name="alternativa"
                      value={alternativa}
                      checked={respuestas[preguntas[preguntaActual].id] === alternativa}
                      onChange={(e) =>
                        handleSeleccionarRespuesta(preguntas[preguntaActual].id, e.target.value)
                      }
                    />
                    {alternativa}
                  </label>
                </li>
              ))}
            </ul>
            <button
              onClick={handleSiguientePregunta}
              className="bg-blue-500 text-white py-2 px-4 mt-4 rounded-lg"
            >
              {preguntaActual < preguntas.length - 1 ? 'Siguiente Pregunta' : 'Ver Resultados'}
            </button>
          </div>
        ) : (
          <p>Cargando preguntas...</p>
        )
      )}
    </div>
  );
};

export default Alternativas;
