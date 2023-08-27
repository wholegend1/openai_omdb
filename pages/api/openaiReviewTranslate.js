const { Configuration, OpenAIApi } = require("openai");
export default async function handler(req, res) {
  res.setHeader("Content-Type", "application/json");
  if (req.method === "POST") {
    const maxTokens = 256;
    const { Title, Introduction, Review } = req.body.movieReview || "";
    const prompt = `{
      "title": "${Title}",
      "introduction": "${Introduction}",
      "review": "${Review}"
    }`;
    const messages = [
      {
        role: "system",
        content: "You are an expert translation",
      },
      {
        role: "user",
        content: `Translate the following movie review from English to Traditional Chinese. Keep the JSON structure and keys in English, only translate the values, without any output:\n
              {"title":"",introduction:"",review:""}`,
      },
      {
        role: "user",
        content: prompt,
      },
    ];
    if (!process.env.OPENAI_API_KEY) {
      return res.status(500).json({ error: "Missing OPENAI_API_KEY" });
    }
    const configuration = new Configuration({
      apiKey: process.env.OPENAI_API_KEY,
    });
    const openai = new OpenAIApi(configuration);
    if (prompt.trim().length === 0) {
      res.status(400).json({
        error: "Please enter a valid prompt",
      });
      return;
    }
    try {
      let response = await openai.createChatCompletion({
        model: "gpt-3.5-turbo",
        messages: messages,
        temperature: 0.7,
        max_tokens: maxTokens,
        top_p: 1,
        frequency_penalty: 0,
        presence_penalty: 0,
      });
      let translateResponse = response.data.choices[0]?.message?.content;
      let temp = 0;
      while (
        !translateResponse.includes("}") &&
        response.data.choices[0].finish_reason !== "stop" &&
        temp <= 5
      ) {
        const assistantResponse = translateResponse;
        console.log("assistantResponse", assistantResponse);
        response = await openai.createChatCompletion({
          model: "gpt-3.5-turbo",
          messages: [
            {
              role: "system",
              content: "You are an expert translation.",
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
          max_tokens: maxTokens,
          top_p: 1,
          frequency_penalty: 0,
          presence_penalty: 0,
        });
        temp += 1;
        translateResponse += response.data.choices[0]?.message?.content;
      }
      console.log(
        "translateResponse",
        translateResponse,
        response.data.choices[0].finish_reason 
      );
      if (
        response.data.choices[0].finish_reason === "stop" &&
        !translateResponse.includes("}")
      ) {
        translateResponse += "}";
      }
      const { title, introduction, review } = JSON.parse(translateResponse);
      console.log("translateResponse", title, introduction, review);
      res.status(200).json({
        Title: title,
        Introduction: introduction,
        Review: review,
      });
    } catch (error) {
      console.error("Failed to Translate:", error);
      res.status(500).json({ error: "Failed to Translate" });
    }
  } else {
    res.status(405).json({ error: "Method not allowed" });
  }
}


// 只差錯誤處理

