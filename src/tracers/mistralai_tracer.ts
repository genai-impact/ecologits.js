import { OnRequireFn } from "require-in-the-middle";
import MistralClient, {
  ChatCompletionResponse,
  ChatCompletionResponseChunk,
  ChatRequest,
  ChatRequestOptions,
} from "@mistralai/mistralai";

import EcoLogitsData from "../tracers/utils";
import { BaseInstrumentor } from "./baseInstrumentor";

const PROVIDER = "mistralai";

/**
 * Wrapper around the chat method to add impacts to the response
 *
 */

/**
 * Wrap the two chat methods to add impacts to the response
 */
class MistralAiWrapper extends MistralClient {
  chat: MistralClient["chat"] = async (request, options?) => {
    const timerStart = new Date().getTime();
    return super.chat(request, options).then(async (response) => {
      const requestLatency = new Date().getTime() - timerStart;
      const ecologitsData = await EcoLogitsData.build();
      const tokens = response.usage?.completion_tokens || 0;
      const impacts = ecologitsData.computeLlmImpacts(
        PROVIDER,
        request.model,
        tokens,
        requestLatency
      );
      return { ...response, impacts };
    });
  };

  // chatStream: MistralClient["chatStream"] = async (request, options?) => {
  //   const timerStart = new Date().getTime();
  //   for await (const item of super.chatStream(request, options)) {
  // TODO: implement token counting
  //   };
  // };
}

/**
 * Wraps the chat method to add impacts to the response
 *
 */
const chatCompletionsCreateHook: OnRequireFn = (
  exported: any,
  name: string
) => {
  if (name === PROVIDER) {
    console.debug(`Hooking ${name}`);
    exported = MistralAiWrapper;
  } else {
    console.debug(`Skipping ${name}`);
  }
  return exported;
};

/**
 * Instrument mistralai chat completions to add impacts to the response
 *
 */
export class MistralAiInstrumentor extends BaseInstrumentor {
  constructor() {
    super(PROVIDER, chatCompletionsCreateHook);
  }
}
