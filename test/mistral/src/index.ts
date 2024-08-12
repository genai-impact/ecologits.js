import MistralClient from "@genai-impact/ecologits-mistral";
import { ChatCompletionResponse } from "@mistralai/mistralai";
import { Impacts } from "core";

const apiKey = process.env.MISTRAL_API_KEY;

const client = new MistralClient(apiKey);

const main = async () => {
  try {
    const response = (await client.chat({
      model: "mistral-tiny",
      messages: [{ role: "user", content: "What is the best French cheese?" }],
    })) as ChatCompletionResponse & { impacts: Impacts };
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
