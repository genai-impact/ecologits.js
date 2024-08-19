import ecologits from "@genai-impact/ecologits.js";
import {
  ChatCompletion,
  ChatCompletionChunk,
} from "openai/resources/index.mjs";
const PROVIDER = "openai";

export const streamEventImpact = (
  item: ChatCompletionChunk,
  model: string,
  startDate: Date
) => {
  const tokens = item.usage?.completion_tokens || 0;
  const requestLatency = new Date().getTime() - startDate.getTime();
  return ecologits.computeLlmImpacts(PROVIDER, model, tokens, requestLatency);
};

export const completeImpact = (
  completion: ChatCompletion,
  model: string,
  startDate: Date
) => {
  const tokens = completion.usage?.completion_tokens || 0;
  const requestLatency = new Date().getTime() - startDate.getTime();
  return ecologits.computeLlmImpacts(PROVIDER, model, tokens, requestLatency);
};
