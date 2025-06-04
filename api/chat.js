export default async function handler(req, res) {
    if (req.method !== 'POST') {
      return res.status(405).json({ error: 'Método não permitido' });
    }
  
    const { detail, query } = req.body;
  
    const prompt = `Aqui estão algumas informações internas:\nBaseando-se na seguinte informação: "${detail}", responda de forma natural e amigável à pergunta: "${query}".`;
  
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
      const reply = data.choices?.[0]?.message?.content.trim();
  
      res.status(200).json({ answer: reply });
    } catch (error) {
      console.error('Erro na API OpenAI:', error);
      res.status(500).json({ error: 'Erro ao consultar a OpenAI.' });
    }
  }
  
