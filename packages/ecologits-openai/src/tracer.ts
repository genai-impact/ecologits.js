import OriginOpenAI from "openai";
import type { APIPromise, RequestOptions } from "openai/core";
import { Stream } from "openai/streaming";
import type {
  ChatCompletion,
  ChatCompletionCreateParamsStreaming,
  ChatCompletionChunk,
  ChatCompletionCreateParamsNonStreaming,
  ChatCompletionCreateParamsBase,
  ChatCompletionCreateParams,
} from "openai/resources/chat/completions";

import ecologits, { type Impacts } from "@genai-impact/ecologits.js";

const PROVIDER = "openai";

async function mapStream(
  timerStart: Date,
  model: string,
  stream: Stream<ChatCompletionChunk>
) {
  let tokens = 0;

  async function* iterator() {
    for await (const item of stream) {
      tokens += 1;
      const requestLatency = new Date().getTime() - timerStart.getTime();
      const impacts = ecologits.computeLlmImpacts(
        PROVIDER,
        model,
        tokens,
        requestLatency
      );
      yield { ...item, impacts };
    }
  }
  return new Stream(iterator, stream.controller);
}

async function createStream(
  timerStart: Date,
  model: string,
  stream: APIPromise<Stream<ChatCompletionChunk>>
) {
  const res = await stream;
  return mapStream(timerStart, model, res);
}

class CompletionsWraper extends OriginOpenAI.Chat.Completions {
  create(
    body: ChatCompletionCreateParamsNonStreaming,
    options?: RequestOptions
  ): APIPromise<ChatCompletion & { impacts: Impacts }>;
  create(
    body: ChatCompletionCreateParamsStreaming,
    options?: RequestOptions
  ): APIPromise<Stream<ChatCompletionChunk & { impacts: Impacts }>>;
  create(
    body: ChatCompletionCreateParamsBase,
    options?: RequestOptions
  ): APIPromise<
    Stream<ChatCompletionChunk> | (ChatCompletion & { impacts: Impacts })
  >;
  create(
    body: ChatCompletionCreateParams,
    options?: RequestOptions
  ):
    | APIPromise<ChatCompletion & { impacts: Impacts }>
    | APIPromise<Stream<ChatCompletionChunk & { impacts: Impacts }>> {
    const timerStart = new Date();
    const streamed = body.stream ?? false;

    if (streamed) {
      const stream = this._client.post("/chat/completions", {
        body,
        ...options,
        stream: streamed,
      }) as APIPromise<Stream<ChatCompletionChunk>>;
      return createStream(timerStart, body.model, stream) as APIPromise<
        Stream<ChatCompletionChunk & { impacts: Impacts }>
      >;
    }

    const res = this._client.post("/chat/completions", {
      body,
      ...options,
      stream: streamed,
    }) as APIPromise<ChatCompletion>;
    return res.then(async (resp) => {
      const requestLatency = new Date().getTime() - timerStart.getTime();
      const tokens = resp.usage?.completion_tokens || 0;
      const impacts = ecologits.computeLlmImpacts(
        PROVIDER,
        body.model,
        tokens,
        requestLatency
      );
      return { ...resp, impacts };
    }) as APIPromise<ChatCompletion & { impacts: Impacts }>;
  }
}

class Chat extends OriginOpenAI.Chat {
  completions: OriginOpenAI.Chat.Completions = new CompletionsWraper(
    this._client
  );
}

export default class OpenAI extends OriginOpenAI {
  //@ts-ignore : _options is considered "private" in openai types
  chat: OriginOpenAI.Chat = new Chat(this);
}
