import type { BuildingStructure } from "@/lib/calculators/real-estate-yield";

export const STRUCTURE_OPTIONS: { value: BuildingStructure; label: string }[] =
  [
    { value: "rc", label: "RC造（耐用47年）" },
    { value: "steel", label: "重量鉄骨造（耐用34年）" },
    { value: "wood", label: "木造（耐用22年）" },
  ];
