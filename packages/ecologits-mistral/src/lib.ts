import { ChatCompletionResponse } from "@mistralai/mistralai/models/components/chatcompletionresponse.js";
import { CompletionEvent } from "@mistralai/mistralai/models/components/completionevent.js";

import ecologits from "@genai-impact/ecologits.js";

const PROVIDER = "mistralai";

export const streamEventImpact = (
  item: CompletionEvent,
  model: string,
  startDate: Date
) => {
  const tokens = item.data.usage?.completionTokens || 0;
  const requestLatency = new Date().getTime() - startDate.getTime();
  return ecologits.computeLlmImpacts(PROVIDER, model, tokens, requestLatency);
};

export const completeImpact = (
  completion: ChatCompletionResponse,
  model: string,
  startDate: Date
) => {
  const tokens = completion.usage?.completionTokens || 0;
  const requestLatency = new Date().getTime() - startDate.getTime();
  return ecologits.computeLlmImpacts(PROVIDER, model, tokens, requestLatency);
};
