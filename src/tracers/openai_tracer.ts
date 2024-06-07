import OpenAi from "openai";
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
import type { Impact } from "../impacts/types";
import ecologitsData from "../tracers/utils";

const PROVIDER = "openai";

function mapStream(
  timerStart: Date,
  model: string,
  stream: Stream<ChatCompletionChunk>
) {
  let tokens = 0;

  async function* iterator() {
    for await (const item of stream) {
      tokens += 1;
      const requestLatency = new Date().getTime() - timerStart.getTime();
      const impacts = ecologitsData.computeLlmImpacts(
        PROVIDER,
        model,
        tokens,
        requestLatency
      );
      yield { ...item, impact: impacts };
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

class CompletionsWraper extends OpenAi.Chat.Completions {
  create(
    body: ChatCompletionCreateParamsNonStreaming,
    options?: RequestOptions
  ): APIPromise<ChatCompletion & { impact: Impact }>;
  create(
    body: ChatCompletionCreateParamsStreaming,
    options?: RequestOptions
  ): APIPromise<Stream<ChatCompletionChunk & { impact: Impact }>>;
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
    | APIPromise<Stream<ChatCompletionChunk & { impact: Impact }>> {
    const timerStart = new Date();
    const streamed = body.stream ?? false;

    if (streamed) {
      const stream = this._client.post("/chat/completions", {
        body,
        ...options,
        stream: streamed,
      }) as APIPromise<Stream<ChatCompletionChunk>>;
      return createStream(timerStart, body.model, stream) as APIPromise<
        Stream<ChatCompletionChunk & { impact: Impact }>
      >;
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
