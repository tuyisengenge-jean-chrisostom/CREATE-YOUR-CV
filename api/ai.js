export default async function handler(req, res) {
  // Only accept POST
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  const { prompt } = req.body;
  if (!prompt || typeof prompt !== 'string' || prompt.trim() === '') {
    return res.status(400).json({ error: 'Prompt is required.' });
  }

  // Check if API key is set
  const DEEPSEEK_API_KEY = process.env.DEEPSEEK_KEY;
  if (!DEEPSEEK_API_KEY) {
    console.error('❌ Missing DEEPSEEK_KEY environment variable');
    return res.status(500).json({ error: 'Server misconfiguration: missing API key.' });
  }

  try {
    console.log('📤 Calling DeepSeek API...');
    const response = await fetch('https://api.deepseek.com/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${DEEPSEEK_API_KEY}`
      },
      body: JSON.stringify({
        model: 'deepseek-chat',
        messages: [
          { role: 'system', content: 'You are iMENA AI, an expert CV coach. Provide concise, actionable advice.' },
          { role: 'user', content: prompt }
        ],
        temperature: 0.7
      })
    });

    if (!response.ok) {
      const errorText = await response.text();
      console.error('❌ DeepSeek error:', response.status, errorText);
      return res.status(response.status).json({ error: `DeepSeek API error: ${response.status}` });
    }

    const data = await response.json();
    const reply = data.choices?.[0]?.message?.content || 'No reply from AI.';
    console.log('✅ AI reply sent');
    res.status(200).json({ reply });
  } catch (error) {
    console.error('❌ AI handler error:', error);
    res.status(500).json({ error: 'AI service error: ' + error.message });
  }
}
