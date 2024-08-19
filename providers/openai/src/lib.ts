import { ecoLogitsData } from "./core/index.js";
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
  return ecoLogitsData.computeLlmImpacts(
    PROVIDER,
    model,
    tokens,
    requestLatency
  );
};

export const completeImpact = (
  completion: ChatCompletion,
  model: string,
  startDate: Date
) => {
  const tokens = completion.usage?.completion_tokens || 0;
  const requestLatency = new Date().getTime() - startDate.getTime();
  return ecoLogitsData.computeLlmImpacts(
    PROVIDER,
    model,
    tokens,
    requestLatency
  );
};
