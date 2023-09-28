import { db } from '@vercel/postgres';

export default async function handler(req, res) {
  if (req.method === 'POST') {
    try {
      // Obtener los datos enviados en la solicitud
      const { idEstudiante,ultimaTarea, resultados, preguntasCorrectas } = req.body;

      // Actualizar el modelo del estudiante en la base de datos
      const updateEstudianteQuery = `
        UPDATE Estudiante
        SET ultima_tarea_nuevo = $1, ultima_tarea_resultado = $2, preguntas_respondidas_new = $3
        WHERE id = $4
      `;

      // Convierte resultados y preguntasCorrectas a JSON antes de almacenarlos en la base de datos
      const resultadosJSON = JSON.stringify(resultados);
      const preguntasCorrectasJSON = JSON.stringify(preguntasCorrectas);

      await db.query(updateEstudianteQuery, [ultimaTarea, resultadosJSON, preguntasCorrectasJSON, idEstudiante]);

      res.status(200).json({ success: true, message: 'Modelo del estudiante actualizado correctamente' });
    } catch (error) {
      console.error('Error al actualizar el modelo del estudiante:', error);
      res.status(500).json({ success: false, error: 'Error al actualizar el modelo del estudiante' });
    }
  } else {
    res.status(405).json({ success: false, error: 'Método no permitido' });
  }
}
