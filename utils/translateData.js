// utils.js

import axios from "axios";

export async function translateData(dataKey, content) {
  try {
    const translateRes = await axios.post(`/api/openaiTranslate`, {
      [dataKey]: content,
      inputType: dataKey,
    });
    console.log("translateRes", translateRes.data);
    return translateRes.data.translateResponse;
  } catch (error) {
    console.error(`Error translating ${dataKey}:`, error);
    return content; 
  }
}
