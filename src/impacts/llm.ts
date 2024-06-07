type GpuEnergyProps = {
  modelActiveParameterCount: number;
  outputTokenCount: number;
  gpuEnergyAlpha: number;
  gpuEnergyBeta: number;
};
export function gpuEnergy(props: GpuEnergyProps): number {
  return (
    props.outputTokenCount *
    (props.gpuEnergyAlpha * props.modelActiveParameterCount +
      props.gpuEnergyBeta)
  );
}

type GenerationLatencyProps = {
  modelActiveParameterCount: number;
  outputTokenCount: number;
  gpuLatencyAlpha: number;
  gpuLatencyBeta: number;
  requestLatency: number;
};
export function generationLatency(props: GenerationLatencyProps): number {
  const gpuLatency =
    props.outputTokenCount *
    (props.gpuLatencyAlpha * props.modelActiveParameterCount +
      props.gpuLatencyBeta);
  return Math.min(gpuLatency, props.requestLatency);
}

type ModelRequiredMemoryProps = {
  modelTotalParameterCount: number;
  modelQuantizationBits: number;
};
export function modelRequiredMemory(props: ModelRequiredMemoryProps): number {
  return (
    (1.2 * props.modelTotalParameterCount * props.modelQuantizationBits) / 8
  );
}

type GpuRequiredCoutProps = {
  modelRequiredMemory: number;
  gpuMemory: number;
};
export function gpuRequiredCount(props: GpuRequiredCoutProps): number {
  return Math.ceil(props.modelRequiredMemory / props.gpuMemory);
}

type ServerEnergyProps = {
  generationLatency: number;
  serverPower: number;
  serverGpuCount: number;
  gpuRequiredCount: number;
};
export function serverEnergy(props: ServerEnergyProps): number {
  return (
    (props.generationLatency / 3600) *
    props.serverPower *
    (props.gpuRequiredCount / props.serverGpuCount)
  );
}

type RequestEnergyProps = {
  datacenterPue: number;
  serverEnergy: number;
  gpuRequiredCount: number;
  gpuEnergy: number;
};
export function requestEnergy(props: RequestEnergyProps): number {
  return (
    props.datacenterPue *
    (props.serverEnergy + props.gpuRequiredCount * props.gpuEnergy)
  );
}

type RequestUsageGwpProps = {
  requestEnergy: number;
  ifElectricityMixGwp: number;
};
export function requestUsageGwp(props: RequestUsageGwpProps): number {
  return props.requestEnergy * props.ifElectricityMixGwp;
}

type RequestUsageAdpeProps = {
  requestEnergy: number;
  ifElectricityMixAdpe: number;
};
export function requestUsageAdpe(props: RequestUsageAdpeProps): number {
  return props.requestEnergy * props.ifElectricityMixAdpe;
}

type RequestUsagePeProps = {
  requestEnergy: number;
  ifElectricityMixPe: number;
};
export function requestUsagePe(props: RequestUsagePeProps): number {
  return props.requestEnergy * props.ifElectricityMixPe;
}

type ServerGpuEmbodiedGwpProps = {
  serverEmbodiedGwp: number;
  serverGpuCount: number;
  gpuEmbodiedGwp: number;
  gpuRequiredCount: number;
};
export function serverGpuEmbodiedGwp(props: ServerGpuEmbodiedGwpProps): number {
  return (
    (props.gpuRequiredCount / props.serverGpuCount) * props.serverEmbodiedGwp +
    props.gpuRequiredCount * props.gpuEmbodiedGwp
  );
}

type ServerGpuEmbodiedAdpeProps = {
  serverEmbodiedAdpe: number;
  serverGpuCount: number;
  gpuEmbodiedAdpe: number;
  gpuRequiredCount: number;
};
export function serverGpuEmbodiedAdpe(
  props: ServerGpuEmbodiedAdpeProps
): number {
  return (
    (props.gpuRequiredCount / props.serverGpuCount) * props.serverEmbodiedAdpe +
    props.gpuRequiredCount * props.gpuEmbodiedAdpe
  );
}

type ServerGpuEmbodiedPeProps = {
  serverEmbodiedPe: number;
  serverGpuCount: number;
  gpuEmbodiedPe: number;
  gpuRequiredCount: number;
};
export function serverGpuEmbodiedPe(props: ServerGpuEmbodiedPeProps): number {
  return (
    (props.gpuRequiredCount / props.serverGpuCount) * props.serverEmbodiedPe +
    props.gpuRequiredCount * props.gpuEmbodiedPe
  );
}

type RequestEmbodiedGwpProps = {
  serverGpuEmbodiedGwp: number;
  serverLifetime: number;
  generationLatency: number;
};
export function requestEmbodiedGwp(props: RequestEmbodiedGwpProps): number {
  return (
    (props.generationLatency / props.serverLifetime) *
    props.serverGpuEmbodiedGwp
  );
}

type RequestEmbodiedAdpeProps = {
  serverGpuEmbodiedAdpe: number;
  serverLifetime: number;
  generationLatency: number;
};
export function requestEmbodiedAdpe(props: RequestEmbodiedAdpeProps): number {
  return (
    (props.generationLatency / props.serverLifetime) *
    props.serverGpuEmbodiedAdpe
  );
}

type RequestEmbodiedPeProps = {
  serverGpuEmbodiedPe: number;
  serverLifetime: number;
  generationLatency: number;
};
export function requestEmbodiedPe(props: RequestEmbodiedPeProps): number {
  return (
    (props.generationLatency / props.serverLifetime) * props.serverGpuEmbodiedPe
  );
}
