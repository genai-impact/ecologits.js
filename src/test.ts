import type { Impacts } from "./index";
import { OpenAI } from "./index";

import type OpenAITypes from "openai"; // TODO : remove dependency

const client = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});
const main = async () => {
  const response = (await client.chat.completions.create({
    messages: [{ role: "user", content: "Tell me a funny joke!" }],
    model: "gpt-3.5-turbo",
  })) as OpenAITypes.Chat.Completions.ChatCompletion & { impacts: Impacts };

  // Get estimated environmental impacts of the inference
  console.log(
    `Energy consumption: ${response.impacts.energy.value} ${response.impacts.energy.unit}`
  );
  console.log(
    `GHG emissions: ${response.impacts.gwp.value} ${response.impacts.gwp.unit}`
  );
};
main();
