# ecologits.js

This repository is a tentative of porting the [genai-impact/ecologits python library](https://github.com/genai-impact/ecologits) to JavaScript.

🌱 EcoLogits tracks the energy consumption and environmental impacts of using generative AI models through APIs.

## Installation

Installation depends on the model providers that you use in your code.

### Open AI

```bash
npm install @genai-impact/ecologits-openai
```

### Mistral AI

```bash
npm install @genai-impact/ecologits-mistral
```

## Usage

The usage will depend on the model provider used in your code.
But the principle is simple :

- import the provider wrapper from `@genai-impact/ecologits-<provider>`
- use it (e.g. `MistralClient` / `OpenAI`) as you would usually.
- The wrapper adds an `impacts` attribute to the response containing EcoLogits metrics.

> [!WARNING] As usual, you'll need to provide your credentials to your API provider in the environment variables as instructed by them, or pass them directly to the client as you would normally.

```ts
import MistralClient from "@genai-impact/ecologits-mistral";
import { ChatCompletionResponse } from "@mistralai/mistralai";
import { Impacts } from "core";

const apiKey = process.env.MISTRAL_API_KEY;

const client = new MistralClient(apiKey);

const main = async () => {
  try {
    const response = (await client.chat({
      model: "mistral-tiny",
      messages: [{ role: "user", content: "What is the best French cheese?" }],
    })) as ChatCompletionResponse & { impacts: Impacts };
    // Get estimated environmental impacts of the inference
    console.log(
      `Energy consumption: ${response.impacts.energy.value} ${response.impacts.energy.unit}`
    );
    console.log(
      `GHG emissions: ${response.impacts.gwp.value} ${response.impacts.gwp.unit}`
    );
  } catch (e) {
    console.error(e);
    throw e;
  }
};
main();
```

## Contributing

Look for open issues and feel free to contribute to this project by opening an issue or a pull request.
We're always open to covering more model providers.

### Current challenges

- [ ] Setting up CI with automatic publication to npm.js of each package
- [ ] port tests from python to js
- [ ] reduce work to keep the library up-to-date with the python library (etc)
