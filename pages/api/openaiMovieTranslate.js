const { Configuration, OpenAIApi } = require("openai");
export default async function handler(req, res) {
  res.setHeader("Content-Type", "application/json");
  if (req.method === "POST") {
    const maxTokens = 256;
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
      Poster,
      imdbID,
    } = req.body.movieDetail || "";
    const prompt = `{
      "title": "${Title}",
      "year": "${Year}",
      "rated": "${Rated}",
      "released": "${Released}",
      "genre": "${Genre}",
      "writer": "${Writer}",
      "actors": "${Actors}",
      "plot": "${Plot}",
      "language": "${Language}",
      "awards": "${Awards}",
    `;
    const messages = [
      {
        role: "system",
        content: "You are an expert translation",
      },
      {
        role: "user",
        content: `Translate the following movie details from English to Traditional Chinese. Keep the JSON structure and keys in English, without any output:\n
              {"title":"",year:"",rated:"",released:"",genre:"",writer:"",actors:"",plot:"",language:"",awards:""}`,
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
        response.data.choices[0].finish_reason !== "stop" &&
        !translateResponse.includes("}") &&
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
        console.log("newresponse", response.data.choices[0]?.message?.content);
        temp += 1;
        translateResponse += response.data.choices[0]?.message?.content;
      }
      if (
        response.data.choices[0].finish_reason === "stop" &&
        !translateResponse.includes("}")
      ) {
        translateResponse += "}";
      }
      const {
        title,
        year,
        rated,
        released,
        genre,
        writer,
        actors,
        plot,
        language,
        awards,
      } = JSON.parse(translateResponse);
      console.log(
        "translateResponse",
        title,
        year,
        rated,
        released,
        genre,
        writer,
        actors,
        plot,
        language,
        awards
      );
      res.status(200).json({
        imdbID: imdbID,
        Poster: Poster,
        Title: title,
        Year: year,
        Rated: rated,
        Released: released,
        Genre: genre,
        Writer: writer,
        Actors: actors,
        Plot: plot,
        Language: language,
        Awards: awards,
      });
    } catch (error) {
      console.error("Failed to Translate:", error);
      res.status(500).json({ error: "Failed to Translate" });
    }
  } else {
    res.status(405).json({ error: "Method not allowed" });
  }
}
