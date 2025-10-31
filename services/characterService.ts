import { Character, Rarity, Role, Stats, Team, Gadget, Synergy } from '../types';

const firstNames = ['Aline', 'Benigne', 'Claude', 'Divine', 'Eric', 'Fabrice', 'Grace', 'Herve', 'Irene', 'Jean', 'Kevin', 'Linda', 'Marie', 'Noella', 'Olivier', 'Pascal', 'Quintin', 'Ruth', 'Serge', 'Tatiana', 'Uwineza', 'Victor', 'Wendy', 'Xavier', 'Yvonne', 'Zola'];
const lastNames = ['Habimana', 'Hakizimana', 'Bizimana', 'Dusingizimana', 'Mugisha', 'Ndayisenga', 'Niyonzima', 'Tuyisenge', 'Uwamahoro', 'Manirakiza', 'Nshimiyimana', 'Gakire', 'Kaneza', 'Mutesi', 'Rutayisire'];

export const INITIAL_INVESTMENT = 50000;
export const GADGET_OPERATION_FEE = 15000;

export const GADGET_OPTIONS: Gadget[] = [
  {
    id: 'g1',
    name: 'Standard Kit',
    description: 'Basic, reliable diagnostic and communication tools for everyday tasks.',
    cost: 5000,
    statBoost: { knowledge: 2, techSavvy: 3 },
  },
  {
    id: 'g2',
    name: 'Advanced Field Unit',
    description: 'Upgraded sensor suite and AI co-processor for complex diagnostics.',
    cost: 12000,
    statBoost: { knowledge: 5, techSavvy: 8, resilience: 2 },
  },
  {
    id: 'g3',
    name: 'Mobile Health Hub',
    description: 'Top-tier, networked equipment providing real-time data analysis and expert consultation links.',
    cost: 25000,
    statBoost: { knowledge: 8, techSavvy: 12, communication: 5 },
  },
];

const RARITY_CONFIG = {
  [Rarity.N]: { min: 20, max: 50, multiplier: 1.0 },
  [Rarity.R]: { min: 45, max: 75, multiplier: 1.5 },
  [Rarity.SR]: { min: 70, max: 99, multiplier: 2.5 },
};

const ROLE_BIAS: Record<Role, Partial<Stats>> = {
  [Role.TECHNICIAN]: { techSavvy: 1.6, resilience: 1.1 },
  [Role.AI_CHW_TREAT]: { knowledge: 1.4, resilience: 1.3 },
  [Role.AI_CHW_EXAMINE]: { knowledge: 1.3, communication: 1.4 },
  [Role.APPRENTICE]: { knowledge: 1.0, communication: 1.0, techSavvy: 1.0, resilience: 1.0 },
};

const getRandomInt = (min: number, max: number): number => Math.floor(Math.random() * (max - min + 1)) + min;
const getRandomElement = <T,>(arr: T[]): T => arr[Math.floor(Math.random() * arr.length)];

const generateStats = (rarity: Rarity, role: Role, experience: number): Stats => {
  const { min, max } = RARITY_CONFIG[rarity];
  const bias = ROLE_BIAS[role];
  const experienceBonus = (experience - 1) * 5; // +0 for 1yr, +5 for 2yr, +10 for 3yr

  const baseStats: Stats = {
    knowledge: getRandomInt(min, max) + experienceBonus,
    communication: getRandomInt(min, max) + experienceBonus,
    techSavvy: getRandomInt(min, max) + experienceBonus,
    resilience: getRandomInt(min, max) + experienceBonus,
  };
  
  // Technicians have a high tech savvy, but with some variance
  if (role === Role.TECHNICIAN) {
    baseStats.techSavvy = Math.max(baseStats.techSavvy, getRandomInt(70, 99));
  }
  
  return {
    knowledge: Math.min(99, Math.round(baseStats.knowledge * (bias.knowledge || 1))),
    communication: Math.min(99, Math.round(baseStats.communication * (bias.communication || 1))),
    techSavvy: Math.min(99, Math.round(baseStats.techSavvy * (bias.techSavvy || 1))),
    resilience: Math.min(99, Math.round(baseStats.resilience * (bias.resilience || 1))),
  };
};

const calculateCost = (stats: Stats, rarity: Rarity): number => {
  const statSum = stats.knowledge + stats.communication + stats.techSavvy + stats.resilience;
  const { multiplier } = RARITY_CONFIG[rarity];
  const score = statSum * multiplier;
  const minScore = 20 * 4 * RARITY_CONFIG[Rarity.N].multiplier;
  const maxScore = 99 * 4 * RARITY_CONFIG[Rarity.SR].multiplier;
  const costRange = 4000 - 2500;
  const scoreRange = maxScore - minScore;
  const calculatedCost = 2500 + ((score - minScore) / scoreRange) * costRange;
  return Math.round(Math.max(2500, Math.min(4000, calculatedCost)) / 10) * 10;
};

const generateCharacter = (role: Role): Character => {
  const id = `${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;
  const name = `${getRandomElement(firstNames)} ${getRandomElement(lastNames)}`;
  
  let rarityRoll = Math.random();
  // Apprentices are less likely to be SR
  if (role === Role.APPRENTICE && rarityRoll > 0.95) rarityRoll = 0.9;
  const rarity = rarityRoll < 0.6 ? Rarity.N : rarityRoll < 0.9 ? Rarity.R : Rarity.SR;
  
  const experience = role === Role.APPRENTICE ? 1 : getRandomInt(1, 3);
  const stats = generateStats(rarity, role, experience);
  const cost = calculateCost(stats, rarity);
  const portraitUrl = `https://i.pravatar.cc/150?u=${id}`;
  const totalStats = stats.knowledge + stats.communication + stats.techSavvy + stats.resilience;

  return { id, name, role, rarity, stats, cost, portraitUrl, experience, totalStats };
};

export const generateApplicantPool = (): Character[] => {
  const pool: Character[] = [];
  const roles: Record<Role, number> = {
    [Role.TECHNICIAN]: 3,
    [Role.AI_CHW_TREAT]: 5,
    [Role.AI_CHW_EXAMINE]: 5,
    [Role.APPRENTICE]: 7,
  };
  
  (Object.keys(roles) as Role[]).forEach(role => {
    for (let i = 0; i < roles[role]; i++) {
      pool.push(generateCharacter(role));
    }
  });

  return pool.sort(() => Math.random() - 0.5);
};


const calculateTeamEfficiency = (members: Character[], gadget: Gadget): { finalScore: number, synergies: Synergy[] } => {
  const coreMembers = members.filter(m => m.role !== Role.APPRENTICE);
  const apprentices = members.filter(m => m.role === Role.APPRENTICE);
  const synergies: Synergy[] = [];

  if (coreMembers.length === 0) return { finalScore: 0, synergies: [] };

  const avg = (key: keyof Stats) => {
    const baseAvg = coreMembers.reduce((sum, m) => sum + m.stats[key], 0) / coreMembers.length;
    const boost = gadget.statBoost[key] || 0;
    return Math.min(99, baseAvg + boost);
  };

  const avgStats = {
      knowledge: avg('knowledge'),
      communication: avg('communication'),
      techSavvy: avg('techSavvy'),
      resilience: avg('resilience'),
  };

  // Base Score Calculation
  const baseScore = 
    avgStats.knowledge * 0.35 +
    avgStats.communication * 0.25 +
    avgStats.techSavvy * 0.25 +
    avgStats.resilience * 0.15;

  let totalSynergyEffect = 0;

  // Positive Synergies
  if (avgStats.communication > 75) synergies.push({ name: 'Unified Front', description: 'Excellent coordination boosts overall effectiveness.', effect: 5 });
  if (avgStats.resilience > 75) synergies.push({ name: 'Iron Will', description: 'The team withstands high-pressure situations.', effect: 5 });
  if (avgStats.techSavvy > 75) synergies.push({ name: 'Well-Oiled Machine', description: 'Seamless use of technology maximizes speed.', effect: 5 });
  if (avgStats.knowledge > 75) synergies.push({ name: 'Knowledge Powerhouse', description: 'Deep expertise allows for handling complex cases.', effect: 5 });
  if (Object.values(avgStats).every(s => s > 60)) synergies.push({ name: 'Synergistic Core', description: 'A well-balanced team with no major weaknesses.', effect: 10 });

  // Negative Synergies
  if (avgStats.communication < 40) synergies.push({ name: 'Division', description: 'Poor communication leads to mistakes and distrust.', effect: -8 });
  if (avgStats.resilience < 40) synergies.push({ name: 'Glass Body', description: 'The team is prone to burnout and performance drops under stress.', effect: -8 });
  if (avgStats.techSavvy < 40) synergies.push({ name: 'Tech Lag', description: 'Inefficient use of gadgets slows down operations.', effect: -8 });
  if (avgStats.knowledge < 40) synergies.push({ name: 'Knowledge Gap', description: 'Lacking expertise, the team struggles with diagnostics.', effect: -8 });
  
  // Apprentice Burden Synergy
  if (apprentices.length > 0 && avgStats.resilience < 50) {
      const resilienceDeficit = 50 - avgStats.resilience; // How much below the threshold the team is
      const apprenticeAvgStats = apprentices.reduce((sum, a) => sum + a.totalStats, 0) / apprentices.length / 4;
      const apprenticePenalty = Math.round((resilienceDeficit / 10) * ((50 - apprenticeAvgStats) / 10)); // Penalty scales with both factors
      
      if (apprenticePenalty > 0) {
        synergies.push({ 
            name: 'Apprentice Burden', 
            description: 'Low team resilience forces the apprentice into critical roles, causing errors.', 
            effect: -apprenticePenalty 
        });
      }
  }

  synergies.forEach(s => totalSynergyEffect += s.effect);

  const finalScore = baseScore + totalSynergyEffect;
  
  return {
    finalScore: Math.round(Math.max(0, Math.min(99, finalScore))),
    synergies,
  };
};


export const buildTeam = (members: Character[], gadget: Gadget): Team => {
  const leader = members.reduce((prev, current) => 
    (prev.stats.communication > current.stats.communication) ? prev : current
  );

  const finalMembers = members.map(member => ({
    ...member,
    isLeader: member.id === leader.id,
  }));
  
  const totalPersonnelCost = finalMembers.reduce((sum, member) => sum + member.cost, 0);
  const totalOperatingCost = totalPersonnelCost + gadget.cost + GADGET_OPERATION_FEE;
  const grandTotalCost = totalOperatingCost + INITIAL_INVESTMENT;
  const { finalScore, synergies } = calculateTeamEfficiency(finalMembers, gadget);

  return { 
    members: finalMembers, 
    gadget,
    totalPersonnelCost, 
    totalOperatingCost,
    grandTotalCost,
    efficiencyScore: finalScore,
    synergies,
  };
};