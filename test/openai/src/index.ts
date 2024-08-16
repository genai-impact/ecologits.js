import { completeImpact } from "@genai-impact/ecologits-openai";
import OpenAI from "openai";

const client = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

const model = "gpt-3.5-turbo";

const main = async () => {
  try {
    const startDate = new Date();
    const response = await client.chat.completions.create({
      messages: [{ role: "user", content: "Tell me a funny joke!" }],
      model,
    });
    const impacts = completeImpact(response, model, startDate);
    // Get estimated environmental impacts of the inference
    console.log(
      `Energy consumption: ${impacts.energy.value} ${impacts.energy.unit}`
    );
    console.log(`GHG emissions: ${impacts.gwp.value} ${impacts.gwp.unit}`);
  } catch (e) {
    console.error(e);
    throw e;
  }
};
main();
