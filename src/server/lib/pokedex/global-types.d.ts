import { type Nonstandard } from "../formats-data/format-types";

export type ID = "" | (string & { __isID: true });

export interface SpeciesAbility {
  0: string;
  1?: string;
  H?: string;
  S?: string;
}

export type GenderName = "M" | "F" | "N" | "";

export type StatIDExceptHP = "atk" | "def" | "spa" | "spd" | "spe";
export type StatID = "hp" | StatIDExceptHP;
export type StatsTable = { [stat in StatID]: number };

export type AnyObject = Record<string, unknown>;

export type EffectType =
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

export interface EffectData {
  name?: string;
  desc?: string;
  duration?: number;
  effectType?: string;
  infiltrates?: boolean;
  isNonstandard?: Nonstandard | null;
  shortDesc?: string;
}

export interface BasicEffect extends EffectData {
  id: ID;
  effectType: EffectType;
  exists: boolean;
  fullname: string;
  gen: number;
  sourceEffect: string;
  toString: () => string;
}
