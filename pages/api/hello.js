// Next.js API route support: https://nextjs.org/docs/api-routes/introduction
import {db} from '@vercel/postgres'
export default async function handler(req, res) {
  const client = await db.connect();
  const profesores = await client.sql`SELECT * FROM Estudiante;`;
  return res.status(200).json({profesores})
}

