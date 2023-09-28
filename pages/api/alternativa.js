import { db } from '@vercel/postgres';

export default async function handler(req, res) {
  if (req.method === 'GET') {
    try {
      const dominioId = req.query.dominio; // Obtener el ID del dominio desde la URL
      const cantidad = req.query.cantidad; // Obtener la cantidad de preguntas desde la URL

      // Verificar que se proporcione el ID del dominio y la cantidad
      if (!dominioId || !cantidad) {
        return res.status(400).json({ success: false, error: 'ID de dominio o cantidad faltante' });
      }

      // Consultar la base de datos para obtener varias preguntas aleatorias con el dominio ID
      const getPreguntasQuery = 'SELECT * FROM PreguntaAlternativa WHERE Dominio_id = $1 ORDER BY RANDOM() LIMIT $2';
      const preguntaResult = await db.query(getPreguntasQuery, [dominioId, cantidad]);

      // Verificar si se encontraron preguntas
      if (preguntaResult.rows.length === 0) {
        return res.status(404).json({ success: false, error: 'Preguntas no encontradas para el dominio proporcionado' });
      }

      // Parsea las alternativas desde JSON si es necesario para cada pregunta
      const preguntas = preguntaResult.rows.map((pregunta) => {
        if (pregunta.Alternativas) {
          pregunta.Alternativas = JSON.parse(pregunta.Alternativas);
        }
        return pregunta;
      });

      // Devolver las preguntas completas como un arreglo
      return res.status(200).json({ success: true, preguntas });
    } catch (error) {
      console.error('Error al buscar las preguntas:', error);
      return res.status(500).json({ success: false, error: 'Error interno del servidor' });
    }
  }
}
