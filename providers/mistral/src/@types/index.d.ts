import { Mistral } from "@mistralai/mistralai";
import { EventStream } from "@mistralai/mistralai/lib/event-streams.js";
import { CompletionEvent } from "@mistralai/mistralai/models/components/completionevent.js";
import { ChatCompletionResponse } from "@mistralai/mistralai/models/components/index.js";
import { Impacts } from "core";

declare global {
  type ChatType = Parameters<Mistral["chat"]["stream"]>;
  type EcoLogitsChatCompletionResponse = ChatCompletionResponse & {
    impacts: Impacts;
  };
  type EcoLogitsCompletionEvent = CompletionEvent & {
    data: CompletionEvent["data"] & { impacts: Impacts };
  };
}

declare module "@genai-impact/ecologits-mistral" {
  namespace Mistral {
    interface Chat {
      complete(
        request: ChatType[0],
        options?: ChatType[1]
      ): Promise<EcoLogitsChatCompletionResponse>;
      stream(
        request: ChatType[0],
        options?: ChatType[1]
      ): Promise<EventStream<EcoLogitsCompletionEvent>>;
    }
  }
}
