import OpenAi from "openai";
import type { APIPromise, RequestOptions } from "openai/core";
import type { Stream } from "openai/streaming";
import type {
  ChatCompletion,
  ChatCompletionCreateParamsStreaming,
  ChatCompletionChunk,
  ChatCompletionCreateParamsNonStreaming,
  ChatCompletionCreateParamsBase,
  ChatCompletionCreateParams,
} from "openai/resources/chat/completions";
import type { Impact } from "../impacts/types";
import ecologitsData from "../tracers/utils";

const PROVIDER = "openai";

class CompletionsWraper extends OpenAi.Chat.Completions {
  create(
    body: ChatCompletionCreateParamsNonStreaming,
    options?: RequestOptions
  ): APIPromise<ChatCompletion & { impact: Impact }>;
  create(
    body: ChatCompletionCreateParamsStreaming,
    options?: RequestOptions
  ): APIPromise<Stream<ChatCompletionChunk>>;
  create(
    body: ChatCompletionCreateParamsBase,
    options?: RequestOptions
  ): APIPromise<
    Stream<ChatCompletionChunk> | (ChatCompletion & { impact: Impact })
  >;
  create(
    body: ChatCompletionCreateParams,
    options?: RequestOptions
  ):
    | APIPromise<ChatCompletion & { impact: Impact }>
    | APIPromise<Stream<ChatCompletionChunk>> {
    const timerStart = new Date();
    const streamed = body.stream ?? false;

    if (streamed) {
      return this._client.post("/chat/completions", {
        body,
        ...options,
        stream: streamed,
      }) as APIPromise<Stream<ChatCompletionChunk>>;
    }

    const res = this._client.post("/chat/completions", {
      body,
      ...options,
      stream: streamed,
    }) as APIPromise<ChatCompletion>;
    return res.then((resp) => {
      const requestLatency = new Date().getTime() - timerStart.getTime();
      const tokens = resp.usage?.completion_tokens || 0;
      const impacts = ecologitsData.computeLlmImpacts(
        PROVIDER,
        body.model,
        tokens,
        requestLatency
      );
      return { ...resp, impact: impacts };
    }) as APIPromise<ChatCompletion & { impact: Impact }>;
  }
}

class ChatWraper extends OpenAi.Chat {
  completions: OpenAi.Chat.Completions = new CompletionsWraper(this._client);
}

export class OpenAiWrapper extends OpenAi {
  chat: OpenAi.Chat = new ChatWraper(this);
}
