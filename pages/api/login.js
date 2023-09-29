import { db } from '@vercel/postgres';

export default async function handler(req, res) {
  if (req.method === 'POST') {
    try {
      const { profesorUsername, profesorPassword, estudianteUsername, estudiantePassword } = req.body;

      let query, nombreDelUsuario, contraseña;

      // Verificar si se proporcionaron credenciales de profesor o estudiante
      if (profesorUsername && profesorPassword) {
        // Consultar la base de datos para verificar las credenciales del profesor
        query = 'SELECT * FROM Profesor WHERE nombre_usuario = $1 AND contrasena = $2';
        nombreDelUsuario = profesorUsername;
        contraseña= profesorPassword;
      } else if (estudianteUsername && estudiantePassword) {
        console.log(profesorUsername)
        console.log(estudianteUsername)
        console.log(profesorPassword)
        console.log(estudiantePassword)
        // Consultar la base de datos para verificar las credenciales del estudiante
        query = 'SELECT * FROM Estudiante WHERE nombre_usuario = $1 AND contrasena = $2';
        nombreDelUsuario = estudianteUsername;
        contraseña= estudiantePassword;
      } else {
        res.status(400).json({ success: false, error: 'Credenciales faltantes' });
        return;
      }

      const result = await db.query(query, [nombreDelUsuario, contraseña]);

      if (result.rows.length === 1) {
        // Credenciales válidas
        const usuario = result.rows[0]; // Supongamos que el nombre del usuario se encuentra en una columna llamada 'nombre'
        const nombreDelUsuario = usuario.nombre; // Obtén el nombre del usuario

        res.status(200).json({ success: true, usuarioNombre: nombreDelUsuario }); // Enviar el nombre del usuario como parte de la respuesta
      } else {
        // Credenciales inválidas
        res.status(401).json({ success: false, error: 'Nombre de usuario o contraseña incorrectos' });
      }
    } catch (error) {
      console.error('Error en la verificación del usuario:', error);
      res.status(500).json({ success: false, error: 'Error en la verificación del usuario' });
    }
  } else {
    res.status(405).json({ success: false, error: 'Método no permitido' });
  }
}
