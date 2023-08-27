const { Configuration, OpenAIApi } = require("openai");

export default async function handler(req, res) {
  res.setHeader("Content-Type", "application/json");

  if (req.method === "POST") {
    const maxTokens = 100;
    const apiKey = process.env.OPENAI_API_KEY;

    if (!apiKey) {
      return res.status(500).json({ error: "Missing OPENAI_API_KEY" });
    }

    const configuration = new Configuration({ apiKey });
    const openai = new OpenAIApi(configuration);

    try {
      // 根據傳入的輸入類型，動態設定 prompt 和 messages
      const translateInput = req.body.inputType; // 假設這是傳入的輸入類型

      let prompt = "";
      let userMessage = "";

      if (translateInput === "Title") {
        prompt = req.body.Title || "";
        userMessage =
          "I will give you Title and you have to translate it and throw it back to me";
      } else if (translateInput === "Introduction") {
        prompt = req.body.Introduction || "";
        userMessage =
          "I will give you Introduction and you have to translate it and throw it back to me";
      } else if (translateInput === "Review") {
        prompt = req.body.Review || "";
        userMessage =
          "I will give you Review and you have to translate it and throw it back to me";
      }
      console.log("prompt", prompt, userMessage);
      const messages = [
        {
          role: "system",
          content:
            "You will get the input, and your task is to translate the English part into Traditional Chinese.",
        },
        {
          role: "user",
          content: userMessage,
        },
        {
          role: "user",
          content: prompt,
        },
      ];

      // 進行 API 請求
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
        response.data.choices[0].finish_reason !== "stop" &&
        temp <= 5
      ) {
        const assistantResponse = translateResponse;
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
      

      res.status(200).json({ translateResponse });
    } catch (error) {
      console.error("Failed to Translate:", error);
      res.status(500).json({ error: "Failed to Translate" });
    }
  } else {
    res.status(405).json({ error: "Method not allowed" });
  }
}
