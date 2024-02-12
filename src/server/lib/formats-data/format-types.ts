import { Gen1FormatsData } from "./gen1";
import { Gen2FormatsData } from "./gen2";
import { Gen3FormatsData } from "./gen3";
import { Gen4FormatsData } from "./gen4";
import { Gen5FormatsData } from "./gen5";
import { Gen6FormatsData } from "./gen6";
import { Gen7FormatsData } from "./gen7";
import { Gen8FormatsData } from "./gen8";
import { Gen9FormatsData } from "./gen9";

export const Generations = {
  1: Gen1FormatsData,
  2: Gen2FormatsData,
  3: Gen3FormatsData,
  4: Gen4FormatsData,
  5: Gen5FormatsData,
  6: Gen6FormatsData,
  7: Gen7FormatsData,
  8: Gen8FormatsData,
  9: Gen9FormatsData,
};

export type TierTypes = {
  singles:
    | "AG"
    | "Uber"
    | "(Uber)"
    | "OU"
    | "(OU)"
    | "UUBL"
    | "UU"
    | "RUBL"
    | "RU"
    | "NUBL"
    | "NU"
    | "(NU)"
    | "PUBL"
    | "PU"
    | "(PU)"
    | "ZUBL"
    | "ZU"
    | "NFE"
    | "LC";
  doubles:
    | "DUber"
    | "(DUber)"
    | "DOU"
    | "(DOU)"
    | "DBL"
    | "DUU"
    | "(DUU)"
    | "NFE"
    | "LC";
  other: "Unreleased" | "Illegal" | "CAP" | "CAP NFE" | "CAP LC";
};

export type Nonstandard =
  | "Past"
  | "Future"
  | "Unobtainable"
  | "CAP"
  | "LGPE"
  | "Custom"
  | "Gigantamax";

export interface SpeciesFormatsData {
  doublesTier?: TierTypes["doubles"] | TierTypes["other"];
  gmaxUnreleased?: boolean;
  isNonstandard?: Nonstandard | null;
  natDexTier?: TierTypes["singles"] | TierTypes["other"];
  tier?: TierTypes["singles"] | TierTypes["other"];
}
