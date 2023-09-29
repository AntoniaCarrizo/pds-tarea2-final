import { db } from '@vercel/postgres';

export default async function handler(req, res) {
  if (req.method === 'GET') {
    try {
      // Consultar la base de datos para obtener la lista de dominios
      const query = 'SELECT id, titulo FROM Dominio';
      const result = await db.query(query);

      // Obtener los dominios como resultado de la consulta
      const dominios = result.rows;

      res.status(200).json({ success: true, dominios });
    } catch (error) {
      console.error('Error al obtener la lista de dominios:', error);
      res.status(500).json({ success: false, error: 'Error al obtener la lista de dominios' });
    }
  } else {
    res.status(405).json({ success: false, error: 'Método no permitido' });
  }
}
