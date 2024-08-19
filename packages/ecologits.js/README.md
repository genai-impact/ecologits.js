# Ecologits.js - Core calculator

## Install

### `npm`

```
npm install @genai-impact/ecologits.js
```

### `yarn`

```
yarn add @genai-impact/ecologits.js
```

## Usage (Calculator only)

```ts
import { computeLlmImpacts, type Impacts } from "@genai-impact/ecologits.js";

const PROVIDER = // provider name, must match one of the providers in https://raw.githubusercontent.com/genai-impact/ecologits/main/ecologits/data/models.csv
const model = // the model name used


const main = async () => {
  try {
    const startDate = new Date();
    const response = // Interact with any LLM
    const requestLatency = new Date().getTime() - startDate.getTime();
    const tokens = response.data.usage.completionTokens; // data structure to retrieve number of tokens may vary depending on the provider
    const impacts = computeLlmImpacts(
        PROVIDER,
        model,
        tokens,
        requestLatency);
    // Get estimated environmental impacts of the inference
    console.log(
      // @ts-ignore
      `Energy consumption: ${impacts.energy.value} ${impacts.energy.unit}`
    );
    console.log(
      // @ts-ignore
      `GHG emissions: ${impacts.gwp.value} ${impacts.gwp.unit}`
    );
  } catch (e) {
    console.error(e);
    throw e;
  }
};
main();
```
