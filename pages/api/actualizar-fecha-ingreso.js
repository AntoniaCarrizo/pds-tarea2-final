import { db } from '@vercel/postgres';

export default async function handler(req, res) {
  if (req.method === 'PUT') {
    try {
      const { nombre_usuario } = req.body;
      console.log(nombre_usuario)
      // Actualizar la fecha de último ingreso en la base de datos
      const updateQuery = 'UPDATE Estudiante SET fecha_ultimo_ingreso = NOW() WHERE nombre_usuario = $1';
      await db.query(updateQuery, [nombre_usuario]);

      res.status(200).json({ success: true, message: 'Fecha de último ingreso actualizada con éxito' });
    } catch (error) {
      console.error('Error al actualizar la fecha de último ingreso:', error);
      res.status(500).json({ success: false, error: 'Error al actualizar la fecha de último ingreso' });
    }
  } else {
    res.status(405).json({ success: false, error: 'Método no permitido' });
  }
}
