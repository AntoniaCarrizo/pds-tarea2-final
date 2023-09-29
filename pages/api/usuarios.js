import { db } from '@vercel/postgres';
export default async function handler(req, res) {
    if (req.method === 'POST' || req.method === 'PUT') { // Cambia a POST o PUT
      try {
        const { nombre_usuario } = req.body; // Obtén el username desde el cuerpo de la solicitud
  
        // Consultar la base de datos para buscar un usuario por nombre de usuario
        const query = 'SELECT * FROM Estudiante WHERE nombre_usuario = $1';
        const result = await db.query(query, [nombre_usuario]);
  
        // Obtener el usuario como resultado de la consulta
        const usuario = result.rows[0];
  
        if (usuario) {
          res.status(200).json({ success: true, usuario });
        } else {
          res.status(404).json({ success: false, error: 'Usuario no encontrado' });
        }
      } catch (error) {
        console.error('Error al buscar el usuario:', error);
        res.status(500).json({ success: false, error: 'Error al buscar el usuario' });
      }
    } else {
      res.status(405).json({ success: false, error: 'Método no permitido' });
    }
  }
  