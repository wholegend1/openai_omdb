
export default async function handler(req, res) {
  res.setHeader("Content-Type", "application/json");
  if (req.method === "POST") {
    const { Configuration, OpenAIApi } = require("openai");

    const configuration = new Configuration({
      apiKey: process.env.OPENAI_API_KEY,
    });
    const openai = new OpenAIApi(configuration);
    const prompt = req.body.movieTitle || "";
    if (prompt.trim().length === 0) {
      res.status(400).json({
        error: {
          message: "Please enter a valid prompt",
        },
      });
      return;
    }
    try {
      const response = await openai.createCompletion({
        model: "text-davinci-003",
        prompt: `Write a review of the movie ${prompt}.`,
        max_tokens: 100,
        temperature: 0.7,
        top_p: 1,
        frequency_penalty: 0.0,
        presence_penalty: 0.0,
      });
      const generatedReview = response.data.choices[0].text.trim();
      res.status(200).json({ generatedReview });
    } catch (error) {
      console.error("Failed to generate review:", error);
      res.status(500).json({ error: "Failed to generate review" });
    }
  } else {
    res.status(405).json({ error: "Method not allowed" });
  }
}
