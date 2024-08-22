import { Mistral } from "@mistralai/mistralai";
import { completeImpact } from "@genai-impact/ecologits-mistral";
import { ecologits } from "@genai-impact/ecologits.js";

const apiKey = process.env.MISTRAL_API_KEY;

const client = new Mistral({ apiKey });

const main = async () => {
  const provider = "openai";
  const model = "mistral-tiny";

  try {
    const startDate = new Date();

    // CUSTOM PROVIDER API CALL
    const response = await client.chat.complete({
      model: model,
      messages: [{ role: "user", content: "What is the best French cheese?" }],
    });
    const impacts = completeImpact(response, model, startDate);

    // COMMON DISPLAY
    // Get estimated environmental impacts of the inference
    console.log(
      // @ts-ignore
      `Energy consumption: ${impacts.energy.value} ${impacts.energy.unit}`
    );
    console.log(
      // @ts-ignore
      `GHG emissions: ${impacts.gwp.value} ${impacts.gwp.unit}`
    );
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
