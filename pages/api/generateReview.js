const { Configuration, OpenAIApi } = require("openai");
export default async function handler(req, res) {
  res.setHeader("Content-Type", "application/json");
  if (req.method === "POST") {
    if(!process.env.OPENAI_API_KEY2) {
      return res.status(500).json({ error: "Missing OPENAI_API_KEY" });
    }
    const configuration = new Configuration({
      apiKey: process.env.OPENAI_API_KEY2,
    });
    const openai = new OpenAIApi(configuration);
    const {
      Title,
      Year,
      Rated,
      Released,
      Genre,
      Writer,
      Actors,
      Plot,
      Language,
      Awards,
    } = req.body.movieDetail || "";
    const prompt = `this is movieInfo {
      "Title": "${Title}",
      "Year": "${Year}",
      "Rated": "${Rated}",
      "Released": "${Released}",
      "Genre": "${Genre}",
      "Writer": "${Writer}",
      "Actors": "${Actors}",
      "Plot": "${Plot}",
      "Language": "${Language}",
      "Awards": "${Awards}
    }`;
    const maxTokens = 256;
    if (Title.trim().length === 0) {
      res.status(400).json({
        error: "Please enter a valid Title",
      });
      return;
    }
    try {
      const messages = [
        {
          role: "system",
          content: "You are an expert movie reviewer",
        },
        {
          role: "user",
          content: `I will give you movie info. Provide a brief introduction and review in following JSON format, without any output:\n
                     {"title":"",introduction:"",review:""}`,
        },
        {
          role: "user",
          content: prompt,
        },
      ];
      let response = await openai.createChatCompletion({
        model: "gpt-3.5-turbo",
        messages: messages,
        temperature: 0.7,
        max_tokens: maxTokens,
        top_p: 1,
        frequency_penalty: 0,
        presence_penalty: 0,
      });
      console.log("是啥小",response.data.choices[0], response.data.usage);
      let generatedReview = response.data.choices[0]?.message?.content;
      while (
        response.data.choices[0].finish_reason !== "stop" &&
        !generatedReview.includes("}")
      ) {
        const assistantResponse = response.data.choices[0]?.message?.content;

        response = await openai.createChatCompletion({
          model: "gpt-3.5-turbo",
          messages: [
            {
              role: "system",
              content: "You are an expert movie reviewer",
            },
            {
              role: "user",
              content: prompt,
            },
            {
              role: "assistant",
              content: assistantResponse,
            },
          ],
          temperature: 0.7,
          max_tokens: 256,
          top_p: 1,
          frequency_penalty: 0,
          presence_penalty: 0,
        });
        console.log(response.data.choices[0]?.message?.content);
        generatedReview += response.data.choices[0]?.message?.content;
      }     
      console.log("Generated review:", generatedReview);
      if (
        response.data.choices[0].finish_reason === "stop" &&
        !generatedReview.includes("}")
      ) {
        generatedReview += "}";
      }
      const { title, introduction, review } = JSON.parse(generatedReview);
      res.status(200).json({ Title:title,Introduction: introduction,Review: review });
    } catch (error) {
      console.error("Failed to generate review:", error);
      res.status(500).json({ error: "Failed to generate review" });
    }
  } else {
    res.status(405).json({ error: "Method not allowed" });
  }
}
