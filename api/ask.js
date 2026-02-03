export default async function handler(req, res) {
  try {
    const { ask, key } = req.query;

    // Optional: simple key check if you want
    const EXPECTED_KEY = "mysecretkey"; 
    if (key !== EXPECTED_KEY) {
      return res.status(401).json({ error: "Invalid API key in query" });
    }

    if (!ask) {
      return res.status(400).json({ error: "No prompt provided" });
    }

    const API_KEY = process.env.OPENAI_API_KEY;
    if (!API_KEY) {
      return res.status(500).json({ error: "OpenAI API key not set" });
    }

    // Call OpenAI ChatCompletion API
    const response = await fetch("https://api.openai.com/v1/chat/completions", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "Authorization": `Bearer ${API_KEY}`
      },
      body: JSON.stringify({
        model: "gpt-3.5-turbo", // or "gpt-4"
        messages: [{ role: "user", content: ask }],
        temperature: 0.7
      })
    });

    const data = await response.json();

    const message = data?.choices?.[0]?.message?.content || "No response";

    res.status(response.ok ? 200 : response.status).json({ message });

  } catch (error) {
    res.status(500).json({ error: error.toString() });
  }
}
