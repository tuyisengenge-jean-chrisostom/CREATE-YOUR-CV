export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  const { prompt } = req.body;
  if (!prompt || typeof prompt !== 'string' || prompt.trim() === '') {
    return res.status(400).json({ error: 'Prompt is required.' });
  }

  const API_KEY = process.env.DEEPSEEK_KEY;
  if (!API_KEY) {
    return res.status(500).json({ error: 'Missing API key.' });
  }

  try {
    const response = await fetch('https://api.groq.com/openai/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${API_KEY}`
      },
      body: JSON.stringify({
        model: 'mixtral-8x7b-32768',  // one of the free models
        messages: [
          { role: 'system', content: 'You are iMENA AI, an expert CV coach. Provide concise, actionable advice.' },
          { role: 'user', content: prompt }
        ],
        temperature: 0.7
      })
    });

    const responseBody = await response.text();
    if (!response.ok) {
      console.error('Groq API error:', response.status, responseBody);
      return res.status(response.status).json({ error: `Groq error: ${response.status} - ${responseBody}` });
    }

    const data = JSON.parse(responseBody);
    const reply = data.choices[0].message.content;
    res.status(200).json({ reply });
  } catch (error) {
    console.error('AI handler error:', error);
    res.status(500).json({ error: 'AI service error: ' + error.message });
  }
}
