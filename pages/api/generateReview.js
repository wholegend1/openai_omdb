const { Configuration, OpenAIApi } = require("openai");
export default async function handler(req, res) {
  res.setHeader("Content-Type", "application/json");
  if (req.method === "POST") {
    if(!process.env.OPENAI_API_KEY) {
      return res.status(500).json({ error: "Missing OPENAI_API_KEY" });
    }
    const configuration = new Configuration({
      apiKey: process.env.OPENAI_API_KEY,
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
    `;
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
      let generatedReview = response.data.choices[0]?.message?.content;
      while (
        response.data.usage.completion_tokens >= maxTokens &&
        !generatedReview.includes("}")
      ) {
        // 提取助理的回應
        const assistantResponse = response.data.choices[0]?.message?.content;

        // 傳遞助理的回應作為新的 prompt 並重新生成
        let newResponse = await openai.createChatCompletion({
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
        console.log(newResponse.data.choices[0]?.message?.content);
        generatedReview += newResponse.data.choices[0]?.message?.content;
      }
      console.log("Generated review:", generatedReview);
      const { title, introduction, review } = JSON.parse(generatedReview);
      // const parts = generatedReview.split("\n\n");
      res.status(200).json({ title, introduction, review });
    } catch (error) {
      console.error("Failed to generate review:", error);
      res.status(500).json({ error: "Failed to generate review" });
    }
  } else {
    res.status(405).json({ error: "Method not allowed" });
  }
}
