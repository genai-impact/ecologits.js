import { completeImpact } from "@genai-impact/ecologits-openai";
import { ecologits } from "@genai-impact/ecologits.js";
import OpenAI from "openai";

const client = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

const main = async () => {
  const model = "gpt-3.5-turbo";
  const provider = "openai";

  try {
    const startDate = new Date();

    // CUSTOM PROVIDER API CALL
    const response = await client.chat.completions.create({
      messages: [{ role: "user", content: "Tell me a funny joke!" }],
      model,
    });
    const impacts = completeImpact(response, model, startDate);

    // COMMON DISPLAY
    // Get estimated environmental impacts of the inference
    console.log(
      `Energy consumption: ${impacts.energy.value} ${impacts.energy.unit}`
    );
    console.log(`GHG emissions: ${impacts.gwp.value} ${impacts.gwp.unit}`);
  } catch (e) {
    console.error(e);
    throw e;
  }

  ecologits.data
    .filter((model) => model.provider === provider)
    .forEach((model) => {
      const impacts = ecologits.computeLlmImpacts(
        provider,
        model.name,
        1000,
        10
      );
      console.log(
        model.name,
        "-->",
        (impacts.energy.value * 1000).toFixed(2),
        "Wh"
      );
    });
};
main();
