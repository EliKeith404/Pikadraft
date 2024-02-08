type ID = "" | (string & { __isID: true });

interface SpeciesAbility {
  0: string;
  1?: string;
  H?: string;
  S?: string;
}

type GenderName = "M" | "F" | "N" | "";

type StatIDExceptHP = "atk" | "def" | "spa" | "spd" | "spe";
type StatID = "hp" | StatIDExceptHP;
type StatsTable = { [stat in StatID]: number };

interface AnyObject {
  [k: string]: any;
}
type EffectType =
  | "Condition"
  | "Pokemon"
  | "Move"
  | "Item"
  | "Ability"
  | "Format"
  | "Nature"
  | "Ruleset"
  | "Weather"
  | "Status"
  | "Terastal"
  | "Rule"
  | "ValidatorRule";

interface EffectData {
  name?: string;
  desc?: string;
  duration?: number;
  effectType?: string;
  infiltrates?: boolean;
  isNonstandard?: Nonstandard | null;
  shortDesc?: string;
}

interface BasicEffect extends EffectData {
  id: ID;
  effectType: EffectType;
  exists: boolean;
  fullname: string;
  gen: number;
  sourceEffect: string;
  toString: () => string;
}
