import React, { useState } from 'react';
import Cookies from 'js-cookie'; 


const IndexPage = () => {
  const [showProfesorForm, setShowProfesorForm] = useState(false);
  const [showEstudianteForm, setShowEstudianteForm] = useState(false);
  const [profesorUsername, setProfesorUsername] = useState('');
  const [profesorPassword, setProfesorPassword] = useState('');
  const [estudianteUsername, setEstudianteUsername] = useState('');
  const [estudiantePassword, setEstudiantePassword] = useState('');
  const [profesorError, setProfesorError] = useState('');
  const [estudianteError, setEstudianteError] = useState('');



  const handleProfesorSubmit = async (e) => {
    e.preventDefault();
  
    try {
      const response = await fetch('/api/login', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          profesorUsername,
          profesorPassword,
        }),
      });
  
      const data = await response.json();
  
      if (data.success) {
        // Credenciales válidas, redirigir al profesor al panel de control
        // Suponiendo que tienes una página llamada '/dashboard_profesor'
        window.location.href = '/dashboard_profesor';
      } else {
        setProfesorError(data.error || 'Nombre de usuario o contraseña incorrectos');
      }
    } catch (error) {
      console.error('Error en la verificación del profesor:', error);
      setProfesorError('Error en la verificación del profesor');
    }
  };
  

  const handleEstudianteSubmit = async (e) => {
    e.preventDefault();
    try {
      const response = await fetch('/api/login', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          estudianteUsername,
          estudiantePassword,
        }),
      });

      const data = await response.json();

      if (data.success) {
        // Almacena el nombre del estudiante en una cookie
        // Ejemplo de configuración de la cookie
Cookies.set('estudianteUsername', estudianteUsername, { expires: 7 }); // Reemplaza 'nombre_de_usuario' con el nombre real del estudiante

        window.location.href = '/dashboard_estudiante';
      } else {
        setEstudianteError(data.error || 'Nombre de usuario o contraseña incorrectos');
      }
    } catch (error) {
      console.error('Error en la verificación del estudiante:', error);
      setEstudianteError('Error en la verificación del estudiante');
    }
  };
  
  

  return (
    <div className="min-h-screen flex items-center justify-center bg-yellow-200">
      <div className="bg-white p-8 rounded-lg shadow-md">
        <h1 className="text-2xl font-bold mb-4 text-blue-500 text-center">Iniciar Sesión</h1>

        <div>
          <button
            className="bg-blue-500 text-white px-4 py-2 rounded-md mr-4"
            onClick={() => {
              setShowProfesorForm(true);
              setShowEstudianteForm(false); // Ocultar el formulario de estudiante
            }}
          >
            Iniciar Sesión Profesor
          </button>
          <button
            className="bg-green-500 text-white px-4 py-2 rounded-md"
            onClick={() => {
              setShowEstudianteForm(true);
              setShowProfesorForm(false); // Ocultar el formulario de profesor
            }}
          >
            Iniciar Sesión Estudiante
          </button>
        </div>
        {showProfesorForm && (
          <form onSubmit={handleProfesorSubmit}>
            <input
              type="text"
              placeholder="Nombre de usuario"
              className="w-full border rounded-md py-2 px-3 mt-4 text-blue-500"
              value={profesorUsername}
              onChange={(e) => setProfesorUsername(e.target.value)}
            />
            <input
              type="password"
              placeholder="Contraseña"
              className="w-full border rounded-md py-2 px-3 mt-2 text-blue-500"
              value={profesorPassword}
              onChange={(e) => setProfesorPassword(e.target.value)}
            />
            <button
              type="submit"
              className="bg-blue-500 text-white px-4 py-2 rounded-md mt-4"
            >
              Iniciar
            </button>
            {profesorError && (
              <p className="text-red-500 mt-2">{profesorError}</p>
            )}
          </form>
        )}
        {showEstudianteForm && (
          <form onSubmit={handleEstudianteSubmit}>
            <input
              type="text"
              placeholder="Nombre de usuario"
              className="w-full border rounded-md py-2 px-3 mt-4 text-blue-500"
              value={estudianteUsername}
              onChange={(e) => setEstudianteUsername(e.target.value)}
            />
            <input
              type="password"
              placeholder="Contraseña"
              className="w-full border rounded-md py-2 px-3 mt-2 text-blue-500"
              value={estudiantePassword}
              onChange={(e) => setEstudiantePassword(e.target.value)}
            />
            <button
              type="submit"
              className="bg-green-500 text-white px-4 py-2 rounded-md mt-4"
            >
              Iniciar
            </button>
            {estudianteError && (
              <p className="text-red-500 mt-2">{estudianteError}</p>
            )}
          </form>
        )}
      </div>
    </div>
  );
};

export default IndexPage;
