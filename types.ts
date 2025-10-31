export enum Rarity {
  N = 'Normal',
  R = 'Rare',
  SR = 'Super Rare',
}

export enum Role {
  TECHNICIAN = 'Technician',
  AI_CHW_TREAT = 'AI-CHW (Treatment)',
  AI_CHW_EXAMINE = 'AI-CHW (Examine)',
  APPRENTICE = 'Apprentice',
}

export interface Stats {
  knowledge: number;
  communication: number;
  techSavvy: number;
  resilience: number;
}

export interface Gadget {
  id: string;
  name: string;
  description: string;
  cost: number;
  statBoost: Partial<Stats>;
}

export interface Character {
  id:string;
  name: string;
  role: Role;
  rarity: Rarity;
  stats: Stats;
  totalStats: number;
  cost: number;
  portraitUrl: string;
  experience: number; // in years
  isLeader?: boolean;
}

export interface Synergy {
  name: string;
  description: string;
  effect: number; // e.g., +5, -8
}

export interface Team {
  members: Character[];
  gadget: Gadget;
  totalPersonnelCost: number;
  totalOperatingCost: number;
  grandTotalCost: number;
  efficiencyScore: number;
  synergies: Synergy[];
}