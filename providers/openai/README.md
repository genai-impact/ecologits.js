# Ecologits.js - OpenAI provider

## Install

### `npm`

```
npm install @genai-impact/ecologits-openai
```

### `yarn`

```
yarn add @genai-impact/ecologits-openai
```

## Usage

```ts
import OpenAI from "@genai-impact/ecologits-openai";

const client = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});
const main = async () => {
  try {
    const response = await client.chat.completions.create({
      messages: [{ role: "user", content: "Tell me a funny joke!" }],
      model: "gpt-3.5-turbo",
    });
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