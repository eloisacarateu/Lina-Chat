// api/data.js
import fs from 'fs';
import path from 'path';

export default function handler(req, res) {
  const filePath = path.join(process.cwd(), 'data', 'data.json');

  try {
    const jsonData = fs.readFileSync(filePath, 'utf8');
    const data = JSON.parse(jsonData);
    res.status(200).json(data);
  } catch (error) {
    console.error('❌ Erro no /api/data:', error);
    res.status(500).json({ error: 'Erro ao carregar os dados.' });
  }
}
