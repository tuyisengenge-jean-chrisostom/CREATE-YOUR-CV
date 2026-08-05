const response = await fetch('https://api.groq.com/openai/v1/chat/completions', {
  method: 'POST',
  headers: {
    'Content-Type': 'application/json',
    Authorization: `Bearer ${API_KEY}`
  },
  body: JSON.stringify({
    model: 'llama-3.3-70b-versatile', // ✅ Updated model name
    messages: [
      { role: 'system', content: 'You are iMENA AI, an expert CV coach. Provide concise, actionable advice.' },
      { role: 'user', content: prompt }
    ],
    temperature: 0.7
  })
});
