import React, { useState, useEffect } from 'react';

import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import {
  faChartBar,
  faClock,
  faBook,
  faTasks,
  faEdit,
  faPlus,
  faTrash,
  faPen,
  faSave,
} from '@fortawesome/free-solid-svg-icons';

const ProfesorDashboard = () => {
  const [selectedTab, setSelectedTab] = useState('avance'); // Pestaña seleccionada por defecto
  const [editandoIndex, setEditandoIndex] = useState(-1); // Nuevo estado para rastrear el índice de la pregunta editada

  const [mostrarFormulario, setMostrarFormulario] = useState(false);
  const [enunciado, setEnunciado] = useState('');
  const [alternativas, setAlternativas] = useState([]);
  const [nuevaAlternativa, setNuevaAlternativa] = useState({ texto: '', hint: '' });
  const [alternativaCorrecta, setAlternativaCorrecta] = useState(null);
  const [dominios, setDominios] = useState([]); // Estado para almacenar la lista de dominios
  const [dominioSeleccionado, setDominioSeleccionado] = useState(''); // Estado para almacenar el dominio seleccionado

  const [preguntaCreadaExitosamente, setPreguntaCreadaExitosamente] = useState(false);
  const [editandoPregunta, setEditandoPregunta] = useState(false);
  const [preguntaEditada, setPreguntaEditada] = useState({});
  const [preguntas, setPreguntas] = useState([]); // Estado para almacenar la lista de preguntas
// ... (código previo)

  const [modalAbierto, setModalAbierto] = useState(false);
  const [preguntaEnEdicion, setPreguntaEnEdicion] = useState(null);

  // ... (resto del código)

  const abrirModalEdicion = (index) => {
    setPreguntaEnEdicion(preguntas[index]);
    setModalAbierto(true);
  };

  const cerrarModalEdicion = () => {
    setPreguntaEnEdicion(null);
    setModalAbierto(false);
  };

  useEffect(() => {
    // Obtener la lista de dominios al cargar el componente
    fetch('/api/dominios')
      .then((response) => response.json())
      .then((data) => {
        if (data.success) {
          setDominios(data.dominios);
        } else {
          console.error('Error al obtener la lista de dominios');
        }
      })
      .catch((error) => {
        console.error('Error en la solicitud:', error);
      });

    // Obtener la lista de preguntas al cargar el componente
    fetch('/api/preguntas')
      .then((response) => response.json())
      .then((data) => {
        if (data.success) {
          setPreguntas(data.preguntas);
        } else {
          console.error('Error al obtener la lista de preguntas');
        }
      })
      .catch((error) => {
        console.error('Error en la solicitud:', error);
      });
  }, []);
  

  const handleTabChange = (tab) => {
    setSelectedTab(tab);
  };

  const mostrarFormularioCrear = () => {
    setMostrarFormulario(true);
    setEditandoPregunta(false);
    setPreguntaEditada({});
  };

  const editarPregunta = (index) => {
    setEditandoIndex(index); // Establecer el índice de la pregunta que se está editando
    setEditandoPregunta(true);
    setPreguntaEditada(preguntas[index]);
  };

  
  

  const handleCrearPregunta = async (e) => {
    e.preventDefault();

    // Verificar si hay al menos 3 alternativas
    if (alternativas.length < 3) {
      alert('La pregunta debe tener al menos 3 alternativas');
      return;
    }

    const preguntaData = {
      enunciado,
      alternativaCorrecta,
      alternativas,
      dominioId: dominioSeleccionado,
    };

    try {
      const response = await fetch('/api/pregunta_alternativa', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(preguntaData),
      });

      if (response.ok) {
        console.log('Pregunta creada con éxito');
        setPreguntaCreadaExitosamente(true);
        setMostrarFormulario(false);
        setEnunciado('');
        setAlternativas([]);
        setNuevaAlternativa({ texto: '', hint: '' });
        setAlternativaCorrecta(null);
        setDominioSeleccionado('');
        // Actualizar la lista de preguntas
        const nuevaPregunta = await response.json();
        setPreguntas([...preguntas, nuevaPregunta]);
        setTimeout(() => {
          setPreguntaCreadaExitosamente(false);
        }, 3000);
      } else {
        console.error('Error al crear la pregunta');
        alert('Hubo un error al crear la pregunta');
      }
    } catch (error) {
      console.error('Error en la solicitud:', error);
      alert('Error en la solicitud');
    }
  };

  const agregarAlternativa = () => {
    if (nuevaAlternativa.texto && nuevaAlternativa.hint) {
      setAlternativas([...alternativas, nuevaAlternativa]);
      setNuevaAlternativa({ texto: '', hint: '' });
    }
  };
  const agregarAlternativaEdicion = () => {
    if (nuevaAlternativa.texto && nuevaAlternativa.hint) {
      const preguntaEditada = { ...preguntaEnEdicion };
      preguntaEditada.alternativas.push(nuevaAlternativa);
      setPreguntaEnEdicion(preguntaEditada);
      setNuevaAlternativa({ texto: '', hint: '' });
    }
  };
  

  const eliminarAlternativa = (index) => {
    const nuevasAlternativas = [...alternativas];
    nuevasAlternativas.splice(index, 1);
    setAlternativas(nuevasAlternativas);
  };
  const eliminarAlternativaEdicion = (index) => {
    const preguntaEditada = { ...preguntaEnEdicion };
    preguntaEditada.alternativas.splice(index, 1);
    setPreguntaEnEdicion(preguntaEditada);
  };
  
  const toggleFormularioCrear = () => {
    // Invierte el estado actual de mostrarFormulario
    setMostrarFormulario(!mostrarFormulario);
    if (editandoPregunta) {
      // Si se estaba editando una pregunta, deja de editar al cerrar el formulario
      setEditandoPregunta(false);
      setPreguntaEditada({});
    }
  };

  const eliminarPregunta = async (id) => {
    try {
      const response = await fetch(`/api/preguntas?id=${id}`, {
        method: 'DELETE',
      });
  
      if (response.ok) {
        console.log('Pregunta eliminada con éxito');
        // Actualiza la lista de preguntas eliminando la pregunta con el ID correspondiente
        const nuevasPreguntas = preguntas.filter((pregunta) => pregunta.id !== id);
        setPreguntas(nuevasPreguntas);
      } else {
        console.error('Error al eliminar la pregunta');
        alert('Hubo un error al eliminar la pregunta');
      }
    } catch (error) {
      console.error('Error en la solicitud:', error);
      alert('Error en la solicitud');
    }
  };
  const guardarPreguntaEditada = async () => {
    try {
      const response = await fetch(`/api/preguntas/`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(preguntaEnEdicion),

      });
      if (response.ok) {
        console.log('Pregunta actualizada con éxito');
        // No es necesario actualizar la lista de preguntas manualmente
        // El servidor debe responder con la pregunta actualizada
        setEditandoPregunta(false);
      } else {
        console.error('Error al actualizar la pregunta');
        alert('Hubo un error al actualizar la pregunta');
      }
    } catch (error) {
    }
  };
  

  return (
    <div className="bg-blue-100 min-h-screen">
      {/* Encabezado del Dashboard */}
      <header className="bg-blue-500 py-4 text-white text-center">
        <h1 className="text-2xl font-bold">Dashboard del Profesor</h1>
      </header>
  
      {/* Menú de Navegación */}
      <nav className="bg-blue-400 p-4">
        <ul className="flex justify-center space-x-4">
          <li
            className={`cursor-pointer ${selectedTab === 'avance' ? 'font-bold' : ''}`}
            onClick={() => handleTabChange('avance')}
          >
            <FontAwesomeIcon icon={faChartBar} className="mr-2" />
            Avance General
          </li>
          <li
            className={`cursor-pointer ${selectedTab === 'tiempoUso' ? 'font-bold' : ''}`}
            onClick={() => handleTabChange('tiempoUso')}
          >
            <FontAwesomeIcon icon={faClock} className="mr-2" />
            Tiempo de Uso
          </li>
          <li
            className={`cursor-pointer ${selectedTab === 'dificultad' ? 'font-bold' : ''}`}
            onClick={() => handleTabChange('dificultad')}
          >
            <FontAwesomeIcon icon={faBook} className="mr-2" />
            Dificultad de Temas
          </li>
          <li
            className={`cursor-pointer ${selectedTab === 'tareaDestacada' ? 'font-bold' : ''}`}
            onClick={() => handleTabChange('tareaDestacada')}
          >
            <FontAwesomeIcon icon={faTasks} className="mr-2" />
            Tarea Destacada
          </li>
          <li
            className={`cursor-pointer ${
              selectedTab === 'administrarPreguntas' ? 'font-bold' : ''
            }`}
            onClick={() => handleTabChange('administrarPreguntas')}
          >
            <FontAwesomeIcon icon={faEdit} className="mr-2" />
            Administrar Preguntas
          </li>
        </ul>
      </nav>
  
      {/* Contenido del Dashboard según la pestaña seleccionada */}
      <main className="p-4">
        {selectedTab === 'administrarPreguntas' && (
          <div className="text-blue-900 bg-blue-200 p-4 rounded-lg text-center">
            <h2 className="text-xl font-bold mb-4">Administrar Preguntas</h2>
            <button
              onClick={toggleFormularioCrear}
              className="bg-blue-500 text-white px-4 py-2 rounded-md"
            >
                  <FontAwesomeIcon icon={faPlus} /> Crear Pregunta
            
            </button>
            <br />
            <br />
            {mostrarFormulario && !editandoPregunta && (
              <form onSubmit={handleCrearPregunta}>
                <div>
                  <label>Enunciado: </label>
                  <input
                    type="text"
                    value={enunciado}
                    onChange={(e) => setEnunciado(e.target.value)}
                  />
                </div>
                <div>
                  <br></br>
                  <label>Seleccionar dominio:</label>
                  <select
                    value={dominioSeleccionado}
                    onChange={(e) => setDominioSeleccionado(e.target.value)}
                  >
                    <option value="" disabled>
                      Seleccione un dominio
                    </option>
                    {dominios.map((dominio) => (
                      <option key={dominio.id} value={dominio.id}>
                        {dominio.titulo}
                      </option>
                    ))}
                  </select>
                </div>
                <div>
                  <br></br>
                  <label>Alternativas:</label>
                  <br></br>
                  (debe agregar el texto y un hint que indique porque la alternativa incorrecta es incorrecta)
                  {alternativas.map((alternativa, index) => (
                    <div key={index}>
                      <br></br>
                      <input
                        type="text"
                        placeholder="Texto Alternativa"
                        value={alternativa.texto}
                        onChange={(e) => {
                          const nuevasAlternativas = [...alternativas];
                          nuevasAlternativas[index].texto = e.target.value;
                          setAlternativas(nuevasAlternativas);
                        }}
                        className="mx-auto"
                      />
                      <button
                        type="button"
                        onClick={() => eliminarAlternativa(index)}
                        className="text-red-500 ml-2"
                      >
                        <FontAwesomeIcon icon={faTrash} />
                      </button>
                    </div>
                  ))}
                  <br></br>
                  <div className="mx-auto">
                    <input
                      type="text"
                      placeholder="Texto Alternativa"
                      value={nuevaAlternativa.texto}
                      onChange={(e) =>
                        setNuevaAlternativa({ ...nuevaAlternativa, texto: e.target.value })
                      }
                    />
                    <br />
                    <input
                      type="text"
                      placeholder="Hint"
                      value={nuevaAlternativa.hint}
                      onChange={(e) =>
                        setNuevaAlternativa({ ...nuevaAlternativa, hint: e.target.value })
                      }
                    />
                    <br />
                    <button type="button" onClick={agregarAlternativa}>
                      + Agregar Alternativa
                    </button>
                  </div>
                  <br />
                  {alternativas.length >= 3 && (
                    <div className="mx-auto">
                      <label>Seleccione alternativa correcta:</label>
                      <select
                        value={alternativaCorrecta}
                        onChange={(e) => setAlternativaCorrecta(e.target.value)}
                      >
                        <option value="" disabled>
                          Seleccione una alternativa
                        </option>
                        {alternativas.map((alternativa, index) => (
                          <option key={index} value={alternativa.texto}>
                            {alternativa.texto}
                          </option>
                        ))}
                      </select>
                      <br />
                      <br></br>
                      {alternativaCorrecta && (
                        <button
                          type="submit"
                          className="bg-pink-500 text-white px-4 py-2 rounded-md"
                        >
                          Crear Pregunta
                        </button>
                      )}
                    </div>
                  )}
                </div>
              </form>
            )}
            
            <div className="mt-4">
              <h2 className="text-xl font-bold mb-4">Lista de Preguntas</h2>

              <ul>
                {preguntas.map((pregunta, index) => (
                  <li key={index}>
                    <span>{pregunta.enunciado}</span>
                    <button onClick={() => abrirModalEdicion(index)} className="ml-2">
  <FontAwesomeIcon icon={faPen} /> Editar
</button>

                    <button onClick={() => eliminarPregunta(pregunta.id)} className="ml-2 text-red-500">
                      <FontAwesomeIcon icon={faTrash} /> Eliminar
                    </button>
                  </li>
                ))}
              </ul>
            </div>
            
            {modalAbierto && preguntaEnEdicion && (
  <div className="fixed inset-0 flex items-center justify-center z-50">
    <div className="absolute inset-0 bg-black opacity-50"></div>
    <div className="bg-white p-4 rounded-lg z-10">
      <h3 className="text-lg font-bold mb-4">Editar Pregunta</h3>
      <form onSubmit={guardarPreguntaEditada}>
        
        <div>
          <label>Enunciado:</label>
          <input
            type="text"
            value={preguntaEnEdicion.enunciado}
            onChange={(e) =>
              setPreguntaEnEdicion({ ...preguntaEnEdicion, enunciado: e.target.value })
            }
          />

          {console.log(preguntaEnEdicion)}
          <br></br>
          <br></br>
        </div>
        <div>
          <label>Seleccionar dominio:</label>
          <select
            value={preguntaEnEdicion.dominioId}
            onChange={(e) =>
              setPreguntaEnEdicion({ ...preguntaEnEdicion, dominioId: e.target.value })
            }
          >
            <option value="" disabled>
              Seleccione un dominio
            </option>
            {dominios.map((dominio) => (
              <option key={dominio.id} value={dominio.id}>
                {dominio.titulo}
              </option>
            ))}
          </select>
          
        </div>
        <br></br>
        <div>
          <label>Alternativas:</label>
          <br />
          (Debe agregar el texto y un hint que indique por qué la alternativa incorrecta es incorrecta)
          {preguntaEnEdicion.alternativas.map((alternativa, index) => (
            <div key={index}>
              <br />
              Alternativa: 
              <input
                type="text"
                placeholder="Texto Alternativa"
                value={alternativa.texto}
                onChange={(e) => {
                  const nuevasAlternativas = [...preguntaEnEdicion.alternativas];
                  nuevasAlternativas[index].texto = e.target.value;
                  setPreguntaEnEdicion({
                    ...preguntaEnEdicion,
                    alternativas: nuevasAlternativas,
                  });
                }}
                className="mx-auto"
              />
              <br></br>
              Hint:
              <input
                type="text"
                placeholder="Hint"
                value={alternativa.hint}
                onChange={(e) => {
                  const nuevasAlternativas = [...preguntaEnEdicion.alternativas];
                  nuevasAlternativas[index].hint = e.target.value;
                  setPreguntaEnEdicion({
                    ...preguntaEnEdicion,
                    alternativas: nuevasAlternativas,
                  });
                }}
                className="mx-auto"
              />
              <button
                type="button"
                onClick={() => eliminarAlternativaEdicion(index)}
                className="text-red-500 ml-2"
              >
                <FontAwesomeIcon icon={faTrash} />
              </button>
            </div>
          ))}
          <br />
          <div className="mx-auto">
            <input
              type="text"
              placeholder="Texto Alternativa"
              value={nuevaAlternativa.texto}
              onChange={(e) =>
                setNuevaAlternativa({ ...nuevaAlternativa, texto: e.target.value })
              }
            />
            <br />
            <input
              type="text"
              placeholder="Hint"
              value={nuevaAlternativa.hint}
              onChange={(e) =>
                setNuevaAlternativa({ ...nuevaAlternativa, hint: e.target.value })
              }
            />
            <br />
            <button type="button" onClick={agregarAlternativaEdicion}>
              + Agregar Alternativa
            </button>
          </div>
          <br />
          {preguntaEnEdicion.alternativas.length >= 3 && (
            <div className="mx-auto">
              <label>Seleccione alternativa correcta:</label>
              <select
                value={preguntaEnEdicion.alternativaCorrecta}
                onChange={(e) =>
                  setPreguntaEnEdicion({
                    ...preguntaEnEdicion,
                    alternativaCorrecta: e.target.value,
                  })
                }
              >
                <option value="" disabled>
                  Seleccione una alternativa
                </option>
                {preguntaEnEdicion.alternativas.map((alternativa, index) => (
                  <option key={index} value={alternativa.texto}>
                    {alternativa.texto}
                  </option>
                ))}
              </select>
            </div>
          )}
        </div>
        <br />
        <div className="flex justify-between">
          {/* Agregar un botón para guardar los cambios */}
          <button type="submit" className="bg-green-500 text-white px-4 py-2 rounded-md">
            Guardar Cambios
          </button>
          {/* Agregar un botón para cerrar el modal */}
          <button onClick={cerrarModalEdicion} className="bg-red-500 text-white px-4 py-2 rounded-md">
            Cerrar
          </button>
        </div>
      </form>
    </div>
  </div>
)}


          </div>
        )}
      </main>
    </div>
  );
  
};

export default ProfesorDashboard;
