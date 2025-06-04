// server.js
import express from 'express';
import dotenv from 'dotenv';
import fetch from 'node-fetch';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

// ✅ Carrega variáveis de ambiente
dotenv.config();

// ✅ Suporte a ES Modules (__dirname)
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// ✅ Inicializa o app
const app = express();
const PORT = 3000;

// ✅ Middleware
app.use(express.static(path.join(__dirname, 'public')));
app.use(express.json());

// ✅ Log de inicialização
console.log('🟡 Iniciando servidor...');

// 🔹 Rota de Chat com OpenAI
app.post('/api/chat', async (req, res) => {
  const { detail, query } = req.body;

  const prompt = `Baseando-se na seguinte informação: "${detail}", responda de forma natural e amigável à pergunta: "${query}".`;

  try {
    const response = await fetch('https://api.openai.com/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${process.env.OPENAI_API_KEY}`,
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        model: 'gpt-3.5-turbo',
        messages: [
          { role: 'system', content: 'Você é um assistente útil.' },
          { role: 'user', content: prompt }
        ],
        max_tokens: 100,
        temperature: 0.5
      })
    });

    const data = await response.json();
    const reply = data.choices?.[0]?.message?.content?.trim() || 'Sem resposta da OpenAI';
    res.json({ answer: reply });
  } catch (err) {
    console.error('❌ Erro na OpenAI:', err);
    res.status(500).json({ error: 'Erro ao processar resposta.' });
  }
});

// 🔹 Rota para carregar dados (data/data.json)
app.get('/api/data', (req, res) => {
  const dataPath = path.join(__dirname, 'data', 'data.json');

  fs.readFile(dataPath, 'utf8', (err, jsonData) => {
    if (err) {
      console.error('❌ Erro ao ler data.json:', err);
      return res.status(500).json({ error: 'Erro ao carregar os dados.' });
    }

    try {
      const parsedData = JSON.parse(jsonData);
      res.json(parsedData);
    } catch (parseError) {
      console.error('❌ Erro ao interpretar JSON:', parseError);
      res.status(500).json({ error: 'Erro ao interpretar os dados.' });
    }
  });
});

// ✅ Inicia o servidor
app.listen(PORT, () => {
  console.log(`✅ Servidor rodando em http://localhost:${PORT}`);
});
app.get('/api/data', (req, res) => {
    const dataPath = path.join(__dirname, 'data', 'data.json');
    console.log('📂 Caminho do arquivo:', dataPath); // << DEBUG
  
    fs.readFile(dataPath, 'utf8', (err, jsonData) => {
      if (err) {
        console.error('❌ Erro ao ler data.json:', err);
        return res.status(500).json({ error: 'Erro ao carregar os dados.' });
      }
  
      try {
        const parsedData = JSON.parse(jsonData);
        res.json(parsedData);
      } catch (parseError) {
        console.error('❌ Erro ao interpretar JSON:', parseError);
        res.status(500).json({ error: 'Erro ao interpretar os dados.' });
      }
    });
  });