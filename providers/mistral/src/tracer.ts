import { Mistral, SDKOptions } from "@mistralai/mistralai";
import { EventStream } from "@mistralai/mistralai/lib/event-streams.js";
import { CompletionEvent } from "@mistralai/mistralai/models/components/completionevent.js";
import { ecoLogitsData } from "ecologits-core";

const PROVIDER = "mistralai";

export class MistralAiWrapper extends Mistral {
  // private _origChat: Mistral["chat"];
  constructor(options: SDKOptions) {
    super(options);
    const _complete = this.chat.complete;
    const _stream = this.chat.stream;

    const complete = async (request: ChatType[0], options?: ChatType[1]) => {
      const timerStart = new Date().getTime();
      const completion = await _complete(request, options);
      const requestLatency = new Date().getTime() - timerStart;

      const tokens = completion.usage?.completionTokens || 0;
      const impacts = ecoLogitsData.computeLlmImpacts(
        PROVIDER,
        request.model as string,
        tokens,
        requestLatency
      );
      return { ...completion, impacts } as EcoLogitsChatCompletionResponse;
    };
    this.chat.complete = complete;

    const streamWrapper = async function (
      request: ChatType[0],
      options?: ChatType[1]
    ) {
      const timerStart = new Date().getTime();
      // let tokens = 0;
      const stream = await _stream(request, options);

      async function* iterator() {
        for await (const item of stream) {
          // tokens += 1;
          const tokens = item.data.usage?.completionTokens || 0;
          const requestLatency = new Date().getTime() - timerStart;
          const impacts = ecoLogitsData.computeLlmImpacts(
            PROVIDER,
            request.model as string,
            tokens,
            requestLatency
          );
          yield {
            ...item,
            data: { ...item.data, impacts },
          } as EcoLogitsCompletionEvent;
        }
      }
      // FIXME if necessary, EventStream is quite complicated to overwrite
      return iterator() as unknown as EventStream<CompletionEvent>;
    };

    this.chat.stream = streamWrapper;
  }
}
