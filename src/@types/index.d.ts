type ImpactPart = {
  type: "energy" | "GWP" | "ADPe" | "PE";
  name: string;
  unit: string;
  value: number;
};

type Impacts = {
  energy: ImpactPart;
  gwp: ImpactPart;
  adpe: ImpactPart;
  pe: ImpactPart;
  usage: {
    energy: ImpactPart;
    gwp: ImpactPart;
    adpe: ImpactPart;
    pe: ImpactPart;
  };
  embodied: {
    gwp: ImpactPart;
    adpe: ImpactPart;
    pe: ImpactPart;
  };
};
