import fs from "fs";
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

class EcoLogitsData {
  data: ModelData[] = [];

  constructor() {
    const res = fs.readFileSync("./src/data/models.csv");
    const lines = res.toString().split("\n");
    this.data = lines.slice(1, lines.length).map((line) => {
      const infos = line.split(",");
      return {
        provider: infos[0],
        name: infos[1],
        totalParameters: infos[2].split(";").map((x) => parseFloat(x)),
        activeParameters: infos[3].split(";").map((x) => parseFloat(x)),
        warnings: infos[4],
        sources: infos[5],
      } as ModelData;
    });
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

export default new EcoLogitsData();
