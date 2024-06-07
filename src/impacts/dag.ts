import * as Llm from "./llm";

const MODEL_QUANTIZATION_BITS = 4;

const GPU_ENERGY_ALPHA = 8.91e-8;
const GPU_ENERGY_BETA = 1.43e-6;
const GPU_LATENCY_ALPHA = 8.02e-4;
const GPU_LATENCY_BETA = 2.23e-2;
const GPU_MEMORY = 80; // GB
const GPU_EMBODIED_IMPACT_GWP = 143;
const GPU_EMBODIED_IMPACT_ADPE = 5.1e-3;
const GPU_EMBODIED_IMPACT_PE = 1828;

const SERVER_GPUS = 8;
const SERVER_POWER = 1; // kW
const SERVER_EMBODIED_IMPACT_GWP = 3000;
const SERVER_EMBODIED_IMPACT_ADPE = 0.24;
const SERVER_EMBODIED_IMPACT_PE = 38000;

const HARDWARE_LIFESPAN = 5 * 365 * 24 * 60 * 60;

const DATACENTER_PUE = 1.2;

const IF_ELECTRICITY_MIX_GWP = 5.90478e-1; // kgCO2eq / kWh (World)
const IF_ELECTRICITY_MIX_ADPE = 7.37708e-8; // kgSbeq / kWh (World);
const IF_ELECTRICITY_MIX_PE = 9.988; // MJ / kWh (World);

type ComputeLLmImpactsProps = {
  modelActiveParameterCount: number;
  modelTotalParameterCount: number;
  outputTokenCount: number;
  requestLatency: number;
  modelQuantizationBits: number;
  gpuEnergyAlpha: number;
  gpuEnergyBeta: number;
  gpuLatencyAlpha: number;
  gpuLatencyBeta: number;
  gpuMemory: number;
  gpuEmbodiedGwp: number;
  gpuEmbodiedAdpe: number;
  gpuEmbodiedPe: number;
  serverGpuCount: number;
  serverPower: number;
  serverEmbodiedGwp: number;
  serverEmbodiedAdpe: number;
  serverEmbodiedPe: number;
  serverLifetime: number;
  datacenterPue: number;
  ifElectricityMixGwp: number;
  ifElectricityMixAdpe: number;
  ifElectricityMixPe: number;
};

type CalculatedProps = {
  gpuEnergy: number;
  generationLatency: number;
  modelRequiredMemory: number;
  gpuRequiredCount: number;
  serverEnergy: number;
  requestEnergy: number;
  requestUsageGwp: number;
  requestUsageAdpe: number;
  requestUsagePe: number;
  serverGpuEmbodiedGwp: number;
  serverGpuEmbodiedAdpe: number;
  serverGpuEmbodiedPe: number;
  requestEmbodiedGwp: number;
  requestEmbodiedAdpe: number;
  requestEmbodiedPe: number;
};
const DEFAULT_CALCULATED_PROPS: CalculatedProps = {
  gpuEnergy: 0,
  generationLatency: 0,
  modelRequiredMemory: 0,
  gpuRequiredCount: 0,
  serverEnergy: 0,
  requestEnergy: 0,
  requestUsageGwp: 0,
  requestUsageAdpe: 0,
  requestUsagePe: 0,
  serverGpuEmbodiedGwp: 0,
  serverGpuEmbodiedAdpe: 0,
  serverGpuEmbodiedPe: 0,
  requestEmbodiedGwp: 0,
  requestEmbodiedAdpe: 0,
  requestEmbodiedPe: 0,
};

function dagExecute(props: ComputeLLmImpactsProps) {
  const allProps: ComputeLLmImpactsProps & CalculatedProps = {
    ...DEFAULT_CALCULATED_PROPS, // add default values to const that are going to be calculated
    ...props,
  };
  const funcs = Object.keys(Llm); // get all calcul functions
  return funcs.reduce((acc, fn) => {
    const res = Llm[fn as keyof typeof Llm](allProps);
    allProps[fn as keyof typeof DEFAULT_CALCULATED_PROPS] = res;
    return { ...acc, [fn]: res };
  }, {} as { [key: string]: number });
}

export default function computeLlmImpacts(
  modelActiveParameterCount: number,
  modelTotalParameterCount: number,
  outputTokenCount: number,
  requestLatency: number,
  modelQuantizationBits: number = MODEL_QUANTIZATION_BITS,
  gpuEnergyAlpha: number = GPU_ENERGY_ALPHA,
  gpuEnergyBeta: number = GPU_ENERGY_BETA,
  gpuLatencyAlpha: number = GPU_LATENCY_ALPHA,
  gpuLatencyBeta: number = GPU_LATENCY_BETA,
  gpuMemory: number = GPU_MEMORY,
  gpuEmbodiedGwp: number = GPU_EMBODIED_IMPACT_GWP,
  gpuEmbodiedAdpe: number = GPU_EMBODIED_IMPACT_ADPE,
  gpuEmbodiedPe: number = GPU_EMBODIED_IMPACT_PE,
  serverGpuCount: number = SERVER_GPUS,
  serverPower: number = SERVER_POWER,
  serverEmbodiedGwp: number = SERVER_EMBODIED_IMPACT_GWP,
  serverEmbodiedAdpe: number = SERVER_EMBODIED_IMPACT_ADPE,
  serverEmbodiedPe: number = SERVER_EMBODIED_IMPACT_PE,
  serverLifetime: number = HARDWARE_LIFESPAN,
  datacenterPue: number = DATACENTER_PUE,
  ifElectricityMixGwp: number = IF_ELECTRICITY_MIX_GWP,
  ifElectricityMixAdpe: number = IF_ELECTRICITY_MIX_ADPE,
  ifElectricityMixPe: number = IF_ELECTRICITY_MIX_PE
) {
  const results = dagExecute({
    modelActiveParameterCount,
    modelTotalParameterCount,
    outputTokenCount,
    requestLatency,
    modelQuantizationBits,
    gpuEnergyAlpha,
    gpuEnergyBeta,
    gpuLatencyAlpha,
    gpuLatencyBeta,
    gpuMemory,
    gpuEmbodiedGwp,
    gpuEmbodiedAdpe,
    gpuEmbodiedPe,
    serverGpuCount,
    serverPower,
    serverEmbodiedGwp,
    serverEmbodiedAdpe,
    serverEmbodiedPe,
    serverLifetime,
    datacenterPue,
    ifElectricityMixGwp,
    ifElectricityMixAdpe,
    ifElectricityMixPe,
  });
  const energy = {
    type: "energy",
    name: "Energy",
    unit: "kWh",
    value: results["requestEnergy"],
  };
  const gwpUsage = {
    type: "GWP",
    name: "Global Warming Potential",
    unit: "kgCO2eq",
    value: results["requestUsageGwp"],
  };
  const adpeUsage = {
    type: "ADPe",
    name: "Abiotic Depletion Potential (elements)",
    unit: "kgSbeq",
    value: results["requestUsageAdpe"],
  };
  const peUsage = {
    type: "PE",
    name: "Primary Energy",
    unit: "MJ",
    value: results["requestUsagePe"],
  };
  const gwpEmbodied = {
    type: "GWP",
    name: "Global Warming Potential",
    unit: "kgCO2eq",
    value: results["requestEmbodiedGwp"],
  };
  const adpeEmbodied = {
    type: "ADPe",
    name: "Abiotic Depletion Potential (elements)",
    unit: "kgSbeq",
    value: results["requestEmbodiedAdpe"],
  };
  const peEmbodied = {
    type: "PE",
    name: "Primary Energy",
    unit: "MJ",
    value: results["requestEmbodiedPe"],
  };
  return {
    energy,
    gwp: { ...gwpUsage, value: gwpUsage.value + gwpEmbodied.value },
    adpe: { ...adpeUsage, value: adpeUsage.value + adpeEmbodied.value },
    pe: { ...peUsage, value: peUsage.value + peEmbodied.value },
    usage: {
      energy,
      gwp: gwpUsage,
      adpe: adpeUsage,
      pe: peUsage,
    },
    embodied: {
      gwp: gwpEmbodied,
      adpe: adpeEmbodied,
      pe: peEmbodied,
    },
  };
}
