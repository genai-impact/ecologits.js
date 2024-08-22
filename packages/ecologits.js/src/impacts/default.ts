import { Impacts, ImpactMetric } from "../types.js";

const energy: ImpactMetric = {
  type: "energy",
  name: "Energy",
  unit: "kWh",
  value: undefined,
};
const gwp: ImpactMetric = {
  type: "GWP",
  name: "Global Warming Potential",
  unit: "kgCO2eq",
  value: undefined,
};
const adpe: ImpactMetric = {
  type: "ADPe",
  name: "Abiotic Depletion Potential (elements)",
  unit: "kgSbeq",
  value: undefined,
};
const pe: ImpactMetric = {
  type: "PE",
  name: "Primary Energy",
  unit: "MJ",
  value: undefined,
};

export const DEFAULT_IMPACT: Impacts = {
  energy,
  gwp: gwp,
  adpe: adpe,
  pe: pe,
  usage: { energy, gwp, adpe, pe },
  embodied: { gwp, adpe, pe },
};
