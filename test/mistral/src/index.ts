import { Mistral } from "@mistralai/mistralai";
import { completeImpact } from "@genai-impact/ecologits-mistral";

const apiKey = process.env.MISTRAL_API_KEY;

const client = new Mistral({ apiKey });

const main = async () => {
  try {
    const startDate = new Date();
    const response = await client.chat.complete({
      model: "mistral-tiny",
      messages: [{ role: "user", content: "What is the best French cheese?" }],
    });
    const impacts = completeImpact(response, "mistral-tiny", startDate);
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
};
main();
