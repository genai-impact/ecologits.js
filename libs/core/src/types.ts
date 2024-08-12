export type ImpactMetric = {
  type: "energy" | "GWP" | "ADPe" | "PE";
  name: string;
  unit: string;
  value: number;
};

export type Impacts = {
  energy: ImpactMetric;
  gwp: ImpactMetric;
  adpe: ImpactMetric;
  pe: ImpactMetric;
  usage: {
    energy: ImpactMetric;
    gwp: ImpactMetric;
    adpe: ImpactMetric;
    pe: ImpactMetric;
  };
  embodied: {
    gwp: ImpactMetric;
    adpe: ImpactMetric;
    pe: ImpactMetric;
  };
};
