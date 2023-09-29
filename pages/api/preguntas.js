import { db } from '@vercel/postgres';

export default async function handler(req, res) {
    
  if (req.method === 'GET') {
    try {
      // Consultar la base de datos para obtener la lista de preguntas con alternativas y el ID del dominio
      const query = `
        SELECT
          PA.id,
          PA.enunciado,
          PA.alternativas,
          PA.alternativa_correcta,
          PA.Dominio_id AS dominioId
        FROM PreguntaAlternativa PA
      `;
      const result = await db.query(query);

      // Obtener las preguntas como resultado de la consulta
      const preguntas = result.rows;

      res.status(200).json({ success: true, preguntas });
    } catch (error) {
      console.error('Error al obtener la lista de preguntas:', error);
      res.status(500).json({ success: false, error: 'Error al obtener la lista de preguntas' });
    }
  } else if (req.method === 'DELETE') {
    const { id } = req.query;
    try {
      // Elimina la pregunta de la base de datos utilizando el ID proporcionado
      const deleteQuery = 'DELETE FROM PreguntaAlternativa WHERE id = $1';
      await db.query(deleteQuery, [id]);

      res.status(200).json({ success: true, message: 'Pregunta eliminada con éxito' });
    } catch (error) {
      console.error('Error al eliminar la pregunta:', error);
      res.status(500).json({ success: false, error: 'Error al eliminar la pregunta' });
    }
  } 
    else if (req.method === 'PUT') {
      console.log("Entra aquí preguntas")
      try {
        // Obtener los datos del cuerpo de la solicitud
        const id = req.body.id
        const enunciado = req.body.enunciado
        const alternativaCorrecta = req.body.alternativa_correcta
        const alternativas = req.body.alternativas
        const dominioId = req.body.dominioid
        console.log(id, enunciado, alternativaCorrecta, alternativas, dominioId)
        // Verificar que se proporcionen todos los datos necesarios
        if (!id || !enunciado || !alternativaCorrecta || !alternativas || alternativas.length < 3 || !dominioId) {
          res.status(400).json({ success: false, error: 'Datos de pregunta faltantes o incompletos' });
          return;
        }
    
        // Convertir alternativas a una cadena JSON válida
        const alternativasJSON = JSON.stringify(alternativas);
    
        // Actualizar la pregunta en la base de datos
        const updatePreguntaQuery = `
          UPDATE PreguntaAlternativa
          SET enunciado = $1, alternativas = $2, alternativa_correcta = $3, Dominio_id = $4
          WHERE id = $5
        `;
        await db.query(updatePreguntaQuery, [enunciado, alternativasJSON, alternativaCorrecta, dominioId, id]);
    
        res.status(200).json({ success: true, message: 'Pregunta actualizada correctamente' });
      } catch (error) {
        console.error('Error al actualizar la pregunta:', error);
        res.status(500).json({ success: false, error: 'Error al actualizar la pregunta' });
      }
    
    
  }else {
    res.status(405).json({ success: false, error: 'Método no permitido' });
  }
}
