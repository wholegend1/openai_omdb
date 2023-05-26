import { OpenAIApi } from "openai";

const openai = new OpenAIApi("YOUR_OPENAI_API_KEY");

export const generateMovieReview = async (movieTitle) => {
  try {
    const response = await openai.complete({
      engine: "text-davinci-003",
      prompt: `Write a review of the movie ${movieTitle}.`,
      maxTokens: 100,
      temperature: 0.7,
      topP: 1,
      frequencyPenalty: 0,
      presencePenalty: 0,
    });

    return response.choices[0].text;
  } catch (error) {
    console.error("Error generating movie review:", error);
    return null;
  }
};
