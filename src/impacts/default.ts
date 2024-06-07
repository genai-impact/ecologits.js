const energy = {
  type: "energy",
  name: "Energy",
  unit: "kWh",
  value: 0,
};
const gwp = {
  type: "GWP",
  name: "Global Warming Potential",
  unit: "kgCO2eq",
  value: 0,
};
const adpe = {
  type: "ADPe",
  name: "Abiotic Depletion Potential (elements)",
  unit: "kgSbeq",
  value: 0,
};
const pe = {
  type: "PE",
  name: "Primary Energy",
  unit: "MJ",
  value: 0,
};

export const DEFAULT_IMPACT = {
  energy,
  gwp: gwp,
  adpe: adpe,
  pe: pe,
  usage: { energy, gwp, adpe, pe },
  embodied: { gwp, adpe, pe },
};
