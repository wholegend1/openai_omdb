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
      const messages = [
        {
          role: "system",
          content:
            "You are an expert movie reviewer. Please provide an introduction and review for the movie: " +
            prompt +
            ". Imagine you are writing for a movie magazine and you want to give readers a sense of what the movie is about and your opinion on it.",
        },
        {
          role: "user",
          content: prompt,
        },
      ];
      const response = await openai.createChatCompletion({
        model: "gpt-3.5-turbo",
        messages: messages,
        temperature: 0.7,
        max_tokens: 256,
        top_p: 1,
        frequency_penalty: 0,
        presence_penalty: 0,
      });
      console.log("response", response);
      console.log("Generated review:", response.data);
      const generatedReview = response.data.choices[0]?.message?.content;
      const parts = generatedReview.split("\n\n");
      res.status(200).json({ parts });
    } catch (error) {
      console.error("Failed to generate review:", error);
      res.status(500).json({ error: "Failed to generate review" });
    }
  } else {
    res.status(405).json({ error: "Method not allowed" });
  }
}
