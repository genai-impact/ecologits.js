import { Mistral } from "@mistralai/mistralai";
import { CompletionEvent } from "@mistralai/mistralai/models/components/completionevent.js";
import { ChatCompletionResponse } from "@mistralai/mistralai/models/components/index.js";
import { Impacts } from "@genai-impact/ecologits.js";

declare global {
  type ChatType = Parameters<Mistral["chat"]["stream"]>;
  type EcoLogitsChatCompletionResponse = ChatCompletionResponse & {
    impacts: Impacts;
  };
  type EcoLogitsCompletionEvent = CompletionEvent & {
    data: CompletionEvent["data"] & { impacts: Impacts };
  };
}
