import React, { useEffect, useState } from 'react';
import Cookies from 'js-cookie';
import { library } from '@fortawesome/fontawesome-svg-core';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faLock, faLockOpen } from '@fortawesome/free-solid-svg-icons';
import { useUser } from './usercontext'; // Importa useUser desde el contexto de usuario


const DashboardEstudiante = () => {
  const [estudianteUsername, setEstudianteUsername] = useState('');
  const [usuario, setUsuario] = useState(null);
  const [dominios, setDominios] = useState([]);
  const [usuarioAvance, setUsuarioAvance] = useState({}); // Estado para el avance del estudiante

  useEffect(() => {
    const usernameFromCookie = Cookies.get('estudianteUsername');
    if (usernameFromCookie) {
      setEstudianteUsername(usernameFromCookie);

      // Realiza una solicitud para obtener los detalles del usuario
      fetch('/api/usuarios', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ nombre_usuario: usernameFromCookie }),
      })
        .then((response) => response.json())
        .then((data) => {
          if (data.success) {
            setUsuario(data.usuario);
            setUsuarioAvance(data.usuario.avance);
            setUser(data.usuario);
            // Realiza una solicitud PUT para actualizar la fecha de último ingreso
            fetch('/api/actualizar-fecha-ingreso', {
              method: 'PUT', // Usa el método PUT para actualizar
              headers: {
                'Content-Type': 'application/json',
              },
              body: JSON.stringify({ nombre_usuario: usernameFromCookie }),
            })
              .then((response) => response.json())
              .then((data) => {
                if (data.success) {
                  // Fecha de último ingreso actualizada con éxito
                } else {
                  // Maneja el caso en que no se pueda actualizar la fecha
                  console.error('No se pudo actualizar la fecha de último ingreso:', data.error);
                }
              })
              .catch((error) => {
                console.error('Error al actualizar la fecha de último ingreso:', error);
              });
          } else {
            console.error('No se pudo encontrar el usuario:', data.error);
          }
        })
        .catch((error) => {
          console.error('Error al buscar el usuario:', error);
        });
    }
  }, []); // Ejecuta este efecto solo una vez después de la renderización inicial

  useEffect(() => {
    const usernameFromCookie = Cookies.get('estudianteUsername');
    if (usernameFromCookie) {
      setEstudianteUsername(usernameFromCookie);

      fetch('/api/usuarios', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ nombre_usuario: usernameFromCookie }),
      })
        .then((response) => response.json())
        .then((data) => {
          if (data.success) {
            // Formatea la fecha de último inicio
            const fechaUltimoIngreso = new Date(data.usuario.fecha_ultimo_ingreso);

            // Actualiza los detalles del usuario en el estado
            setUsuario({ ...data.usuario, fecha_ultimo_ingreso: fechaUltimoIngreso });
          } else {
            console.error('No se pudo encontrar el usuario:', data.error);
          }
        })
        .catch((error) => {
          console.error('Error al buscar el usuario:', error);
        });
    }
  }, []);

  useEffect(() => {
    fetch('/api/dominios', {
      method: 'GET',
    })
      .then((response) => response.json())
      .then((data) => {
        if (data.success) {
          setDominios(data.dominios);
        } else {
          console.error('No se pudieron obtener los dominios:', data.error);
        }
      })
      .catch((error) => {
        console.error('Error al buscar los dominios:', error);
      });
  }, []);

  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-pink-200">
      <div className="bg-white p-8 rounded-lg shadow-md text-center">
        <h1 className="text-2xl font-bold mb-4 text-blue-500">
          Bienvenido, {estudianteUsername}!
        </h1>

        {usuario && (
          <div>
            <p className="text-blue-500">Nombre: {usuario.nombre}</p>
            <p className="text-blue-500">Apellido: {usuario.apellido}</p>
            <p className="text-blue-500">Último inicio: {new Date(usuario.fecha_ultimo_ingreso).toLocaleDateString()}</p>
          </div>
        )}

        <div className="mt-4">
          {dominios.map((dominio, index) => (
            <button
              key={dominio.id}
              className={`bg-pink-500 text-white px-4 py-2 rounded-md m-2 flex items-center justify-center w-80 ${
                (index === 0 && usuarioAvance[dominio.id] !== 10) || (usuarioAvance[dominios[index - 1]?.id] === 10 && usuarioAvance[dominio.id] !== 10) ? 'cursor-pointer' : 'cursor-not-allowed'
              }`}
              onClick={() => {
                // Verifica si el avance es 0 y realiza acciones en consecuencia
                if ((index === 0 && usuarioAvance[dominio.id] !== 10) || (usuarioAvance[dominios[index - 1]?.id] === 10 && usuarioAvance[dominio.id] !== 10)) {
                  // Realiza acciones cuando se hace clic en un botón con avance permitido
                  console.log(`Hiciste clic en el dominio ${dominio.id}`);
                  window.location.href = `/tareasdom${dominio.id}?user=${encodeURIComponent(JSON.stringify(usuario))}`;
                } else {
                  // Realiza acciones cuando se hace clic en un botón con avance no permitido
                  console.log(`No puedes hacer clic en el dominio ${dominio.id}`);
                }
              }}
            >
              {dominio.titulo}
            </button>
          ))}
        </div>
      </div>
    </div>
  );
};

export default DashboardEstudiante;
