import MistralClient from "@mistralai/mistralai";
import { ecoLogitsData } from "core";

const PROVIDER = "mistralai";

/**
 * Wrapper around the chat method to add impacts to the response
 *
 */

/**
 * Wrap the two chat methods to add impacts to the response
 */
export class MistralAiWrapper extends MistralClient {
  oldChat: MistralClient["chat"];
  constructor(
    apiKey?: string,
    endpoint?: string,
    maxRetries?: number,
    timeout?: number
  ) {
    super(apiKey, endpoint, maxRetries, timeout);
    this.oldChat = this.chat;
    this.chat = async (request, options?) => {
      const timerStart = new Date().getTime();
      return this.oldChat(request, options).then(async (response) => {
        const requestLatency = new Date().getTime() - timerStart;
        const tokens = response.usage?.completion_tokens || 0;
        const impacts = ecoLogitsData.computeLlmImpacts(
          PROVIDER,
          request.model,
          tokens,
          requestLatency
        );
        return { ...response, impacts };
      });
    };
  }

  // chatStream: MistralClient["chatStream"] = async function* (request, options?) {
  //   const timerStart = new Date().getTime();
  //   const ecologitsData = await EcoLogitsData.build();
  //   // let tokens = 0;
  //   const stream = super.chatStream(request, options);

  //   async function* iterator() {
  //     for await (const item of stream) {
  //       // tokens += 1;
  //       const tokens = item.usage?.completion_tokens || 0;
  //       const requestLatency = new Date().getTime() - timerStart;
  //       const impacts = ecologitsData.computeLlmImpacts(
  //         PROVIDER,
  //         request.model,
  //         tokens,
  //         requestLatency
  //       );
  //       yield ({ ...item, impacts });
  //     };
  //   }
  //   return iterator();
  // };
}
