# ecologits.js

This repository is a tentative of porting the [genai-impact/ecologits python library](https://github.com/genai-impact/ecologits) to JavaScript.

🌱 EcoLogits tracks the energy consumption and environmental impacts of using generative AI models through APIs.

## Installation

### Using npm

```bash
npm install ecologits.js
```

### Using yarn

```bash
yarn add ecologits.js
```

## Usage

⚠️ This is the preliminary usage, which will hopefully change in the near future to be more similar to the python library.

**Warning**: as usual, you'll need to provide your credentials to your API provider in the environment variables as instructed by them, or pass them directly to the client as you would normally.

```ts
import { OpenAI, type Impact } from "ecologits.js";
import type OpenAITypes from "openai"; // TODO : remove dependency

const client = new OpenAI();
const main = async () => {
  const response = (await client.chat.completions.create({
    messages: [{ role: "user", content: "Tell me a funny joke!" }],
    model: "gpt-3.5-turbo",
  })) as OpenAITypes.Chat.Completions.ChatCompletion & { impacts: Impacts };

  // Get estimated environmental impacts of the inference
  console.log(
    `Response  (${response.choices[0].message.content.length} tokens):
   """${response.choices[0].message.content}"""\n`
  );
  console.log(
    `Energy consumption: ${response.impacts.energy.value} ${response.impacts.energy.unit}`
  );
  console.log(
    `GHG emissions: ${response.impacts.gwp.value} ${response.impacts.gwp.unit}`
  );
};
main();
```

## Porting Status

- [x] `openAI` tracer
- [ ] `mistral` tracer
- [ ] `anthropic` tracer
- [ ] `huggingface` tracer
- [ ] `cohere` tracer

## Current challenges

- [ ] 🔥 Patching the providers responses with the `impacts` object like in the python library (with seamless types exposition)
- [ ] publishing the package to npm
- [ ] port tests from python to js
- [ ] reduce work to keep the library up-to-date with the python library (csv files, etc)

## Contributing

Feel free to contribute to this project by opening an issue or a pull request.

