// /api/ask.js
export default async function handler(req, res) {
  try {
    const { ask } = req.query;
    const API_KEY = process.env.GEMINI_API_KEY;

    if (!ask) {
      return res.status(400).json({ error: "No prompt provided" });
    }

    // Build body for Gemini generateContent
    const body = {
      contents: [
        { parts: [ { text: ask } ] }
      ]
    };

    const response = await fetch(
      "https://generativelanguage.googleapis.com/v1beta/models/gemini-2.5-flash:generateContent",
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "x-goog-api-key": API_KEY
        },
        body: JSON.stringify(body)
      }
    );

    // Return the JSON response
    const data = await response.json();
    res.status(response.ok ? 200 : response.status).json(data);
  } catch (error) {
    res.status(500).json({ error: error.toString() });
  }
}
