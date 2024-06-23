import { OpenAIInstrumentor } from "./tracers/openai_tracer";

export class Ecologits {
  static initialized: boolean = false;
  constructor() {
    console.log("Ecologits constructor");
  }
  static async init() {
    console.log("Ecologits init");
    if (!this.initialized) {
      initInstruments();
      this.initialized = true;
    }
  }
}
const initInstruments = () => {
  initOpenAIInstrumentor();
};
const initOpenAIInstrumentor = async () => {
  const isOpenAIModuleAvailable: boolean = isModuleAvailable("openai");
  console.log(`Is OpenAI module available? ${isOpenAIModuleAvailable}`);
  if (isOpenAIModuleAvailable) {
    const instrumentor = new OpenAIInstrumentor();
    instrumentor.instrument();
  }
};

/**
 * True if the module is available
 * @param moduleName
 * @returns
 */
const isModuleAvailable = (moduleName: string): boolean => {
  try {
    require.resolve(moduleName);
    return true;
  } catch (error) {
    if (error.code === "MODULE_NOT_FOUND") {
      return false;
    }
    throw error;
  }
};
