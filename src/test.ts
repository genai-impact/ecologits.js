import type { Impacts } from "./index";
import { Ecologits } from "./index";
import OpenAI from "openai";
import type OpenAITypes from "openai"; // TODO : remove dependency

Ecologits.init();

const client = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});
const main = async () => {
  try {
    const response = (await client.chat.completions.create({
      messages: [{ role: "user", content: "Tell me a funny joke!" }],
      model: "gpt-3.5-turbo",
    })) as OpenAITypes.Chat.Completions.ChatCompletion & { impacts: Impacts };
    // Get estimated environmental impacts of the inference
    console.log(`Response: ${JSON.stringify(response, undefined, 2)}`);
    console.log(
      `Energy consumption: ${response.impacts.energy.value} ${response.impacts.energy.unit}`
    );
    console.log(
      `GHG emissions: ${response.impacts.gwp.value} ${response.impacts.gwp.unit}`
    );
  } catch (e) {
    console.error(e);
    throw e;
  }
};
main();
