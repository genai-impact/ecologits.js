import OpenAI from "@genai-impact/ecologits-openai";
import { Impacts } from "core";

const client = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});
const main = async () => {
  try {
    const response = (await client.chat.completions.create({
      messages: [{ role: "user", content: "Tell me a funny joke!" }],
      model: "gpt-3.5-turbo",
    })) as Awaited<ReturnType<typeof client.chat.completions.create>> & {
      impacts: Impacts;
    };
    // Get estimated environmental impacts of the inference
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
