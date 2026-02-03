import OpenAI from "openai";

const client = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY
});

export default async function handler(req, res) {
  const { key, ask } = req.query;

  // protect your API
  if (key !== "mysecretkey") {
    return res.status(401).json({ error: "Invalid API key" });
  }

  if (!ask) {
    return res.status(400).json({ error: "Question missing" });
  }

  try {
    const response = await client.chat.completions.create({
      model: "gpt-4o-mini",
      messages: [
        { role: "system", content: "You are a helpful AI assistant." },
        { role: "user", content: ask }
      ]
    });

    res.json({
      question: ask,
      answer: response.choices[0].message.content
    });

  } catch (err) {
    res.status(500).json({ error: "AI error", details: err.message });
  }
}
