f

export default async function handler(req, res) {
  if (req.method === 'GET') {
    try {
      const preguntaId = req.query.id; // Obtener el ID de la pregunta desde la URL

      // Verificar que se proporcione el ID de la pregunta
      if (!preguntaId) {
        return res.status(400).json({ success: false, error: 'ID de pregunta faltante' });
      }

      // Consultar la base de datos para obtener la pregunta por su ID
      const getPreguntaQuery = 'SELECT * FROM PreguntaAlternativa WHERE id = $1';
      const preguntaResult = await db.query(getPreguntaQuery, [preguntaId]);

      // Verificar si se encontró la pregunta
      if (preguntaResult.rows.length === 0) {
        return res.status(404).json({ success: false, error: 'Pregunta no encontrada' });
      }

      const pregunta = preguntaResult.rows[0];
      const alternativas = JSON.parse(pregunta.Alternativas); // Parsear las alternativas desde JSON

      // Devolver las alternativas de la pregunta
      return res.status(200).json({ success: true, alternativas });
    } catch (error) {
      console.error('Error al buscar la pregunta:', error);
      return res.status(500).json({ success: false, error: 'Error interno del servidor' });
    }
  } else if (req.method === 'POST') {
    try {
      const { enunciado, alternativaCorrecta, alternativas, dominioId } = req.body;

      // Verificar que se proporcionen todos los datos necesarios
      if (!enunciado || !alternativaCorrecta || !alternativas || alternativas.length < 3 || !dominioId) {
        res.status(400).json({ success: false, error: 'Datos de pregunta faltantes o incompletos' });
        return;
      }

      // Convertir alternativas a una cadena JSON válida
      const alternativasJSON = JSON.stringify(alternativas);

      // Insertar la pregunta en la base de datos
      const insertPreguntaQuery = 'INSERT INTO PreguntaAlternativa (Enunciado, Alternativas, Alternativa_correcta, Dominio_id) VALUES ($1, $2, $3, $4) RETURNING id';
      const preguntaResult = await db.query(insertPreguntaQuery, [enunciado, alternativasJSON, alternativaCorrecta, dominioId]);

      res.status(201).json({ success: true, message: 'Pregunta agregada correctamente' });
    } catch (error) { 
      console.error('Error al agregar la pregunta:', error);
      res.status(500).json({ success: false, error: 'Error interno del servidor' });
    }
  } else if (req.method === 'PUT') {
    console.log("ENTRAAA ACA")
    try {
      const { id } = req.query; // Obtener el ID de la pregunta desde la URL
      const { enunciado, alternativaCorrecta, alternativas, dominioId } = req.body;

      // Verificar que se proporcionen todos los datos necesarios
      if (!id || !enunciado || !alternativaCorrecta || !alternativas || alternativas.length < 3 || !dominioId) {
        res.status(400).json({ success: false, error: 'Datos de pregunta faltantes o incompletos' });
        return;
      }

      // Convertir alternativas a una cadena JSON válida
      const alternativasJSON = JSON.stringify(alternativas);
      console.log("aaaal",alternativas)

      // Actualizar la pregunta en la base de datos
      const updatePreguntaQuery = 'UPDATE PreguntaAlternativa SET Enunciado = $1, Alternativas = $2, Alternativa_correcta = $3, Dominio_id = $4 WHERE id = $5';
      await db.query(updatePreguntaQuery, [enunciado, alternativasJSON, alternativaCorrecta, dominioId, id]);

      res.status(200).json({ success: true, message: 'Pregunta actualizada correctamente' });
    } catch (error) {
      console.error('Error al actualizar la pregunta:', error);
      res.status(500).json({ success: false, error: 'Error interno del servidor' });
    }
  } else {
    res.status(405).json({ success: false, error: 'Método no permitido' });
  }
}
