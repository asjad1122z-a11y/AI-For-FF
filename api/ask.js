// /api/ask.js
export default async function handler(req, res) {
  try {
    // Get the 'ask' query parameter
    const { ask } = req.query;
    const API_KEY = process.env.OPENAI_API_KEY;

    if (!ask) {
      return res.status(400).json({ error: "No prompt provided" });
    }

    // Call OpenAI ChatCompletion API
    const response = await fetch("https://api.openai.com/v1/chat/completions", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "Authorization": `Bearer ${API_KEY}`
      },
      body: JSON.stringify({
        model: "gpt-3.5-turbo",   // or "gpt-4"
        messages: [
          { role: "user", content: ask }
        ],
        temperature: 0.7
      })
    });

    const data = await response.json();

    // Safely extract the AI reply
    const message = data?.choices?.[0]?.message?.content || "No response";

    res.status(response.ok ? 200 : response.status).json({ message });

  } catch (error) {
    res.status(500).json({ error: error.toString() });
  }
}
