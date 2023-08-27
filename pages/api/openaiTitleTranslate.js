const { Configuration, OpenAIApi } = require("openai");
export default async function handler(req, res) {
  res.setHeader("Content-Type", "application/json");
  if (req.method === "POST") {
    let maxTokens = 0;
    let messages=[];
    let prompt = "";
      maxTokens = 100;
      prompt = req.body.title || "";
      messages = [
        {
          role: "system",
          content:
            "You will get Title, and your task is to translate the English part into Traditional Chinese.",
        },
        {
          role: "user",
          content:
            "I will give you Title and you have to translate it and throw it back to me",
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
      const response = await openai.createChatCompletion({
        model: "gpt-3.5-turbo",
        messages: messages,
        temperature: 0.7,
        max_tokens: maxTokens,
        top_p: 1,
        frequency_penalty: 0,
        presence_penalty: 0,
      });
      let translateResponse = response.data.choices[0]?.message?.content;
      while (response.data.choices[0].finish_reason !== "stop" ) {
        // 提取助理的回應
        const assistantResponse = translateResponse;

        // 傳遞助理的回應作為新的 prompt 並重新生成
        let newResponse = await openai.createChatCompletion({
          model: "gpt-3.5-turbo",
          messages: [
            {
              role: "system",
              content:
                "You will get Title, and your task is to translate the English part into Traditional Chinese.",
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
        console.log(
          "newResponse",
          newResponse.data.choices[0]?.message?.content
        );
        translateResponse += newResponse.data.choices[0]?.message?.content;
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
