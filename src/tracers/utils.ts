import fetch from "node-fetch";
import computeLlmImpacts from "../impacts/dag";
import { DEFAULT_IMPACT } from "../impacts/default";

type ModelData = {
  provider: string;
  name: string;
  totalParameters: number[];
  activeParameters: number[];
  warnings: string;
  sources: string;
};

let cachedData: EcoLogitsData | undefined;

class EcoLogitsData {
  data: ModelData[] = [];

  constructor(data: ModelData[]) {
    if (data.length === undefined) {
      throw new Error("Cannot be called directly. Use build() instead.");
    }
    this.data = data;
  }

  static async build() {
    if (cachedData) return cachedData;
    const url =
      "https://raw.githubusercontent.com/genai-impact/ecologits/main/ecologits/data/models.csv";
    const data = await fetch(url).then((res) => {
      return res.text().then(
        (text) =>
          new EcoLogitsData(
            text
              .split("\n")
              .slice(1, text.length)
              .map((line) => {
                const infos = line.split(",");
                return {
                  provider: infos[0],
                  name: infos[1],
                  totalParameters: infos[2]
                    .split(";")
                    .map((x) => parseFloat(x)),
                  activeParameters: infos[3]
                    .split(";")
                    .map((x) => parseFloat(x)),
                  warnings: infos[4],
                  sources: infos[5],
                } as ModelData;
              })
          )
      );
    });
    cachedData = data;
    return data;
  }

  findModel(provider: string, name: string): ModelData | undefined {
    return this.data.find(
      (model) => model.provider === provider && model.name === name
    );
  }

  average(arr: number[]): number {
    return arr.reduce((a, b) => a + b, 0) / arr.length;
  }

  computeLlmImpacts(
    provider: string,
    modelName: string,
    outputTokenCount: number,
    requestLatency: number
  ) {
    const model = this.findModel(provider, modelName);
    if (!model) {
      return DEFAULT_IMPACT;
    }
    const modelActiveParams = this.average(model.activeParameters);
    const modelTotalParams = this.average(model.totalParameters);
    return computeLlmImpacts(
      modelActiveParams,
      modelTotalParams,
      outputTokenCount,
      requestLatency
    );
  }
}

export default EcoLogitsData;
