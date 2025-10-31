import React from 'react';
import { Character, Rarity } from '../types';
import { KnowledgeIcon, CommunicationIcon, TechSavvyIcon, ResilienceIcon, CostIcon, StarIcon, BriefcaseIcon } from './icons';

interface CharacterCardProps {
  character: Character;
}

const RarityBadge: React.FC<{ rarity: Rarity }> = ({ rarity }) => {
  const styles: { [key in Rarity]: string } = {
    [Rarity.N]: 'bg-gray-600 text-gray-100 border-gray-500',
    [Rarity.R]: 'bg-blue-600 text-blue-100 border-blue-500',
    [Rarity.SR]: 'bg-purple-700 text-purple-100 border-purple-500 animate-pulse-slow',
  };
  return (
    <div className={`absolute top-3 right-3 px-2 py-1 text-xs font-bold rounded-full border-2 ${styles[rarity]}`}>
      {rarity.split(' ')[0].toUpperCase()}
    </div>
  );
};

const StatBar: React.FC<{ icon: React.ReactNode; label: string; value: number }> = ({ icon, label, value }) => {
  const getBarColor = (val: number) => {
    if (val > 75) return 'bg-purple-500';
    if (val > 50) return 'bg-cyan-500';
    if (val > 25) return 'bg-blue-500';
    return 'bg-gray-600';
  };

  return (
    <div className="flex items-center space-x-3">
      <div className="text-cyan-400 text-xl">{icon}</div>
      <div className="w-full">
        <div className="flex justify-between items-baseline mb-1">
          <p className="text-sm font-medium text-gray-300">{label}</p>
          <p className="text-sm font-bold text-white">{value}</p>
        </div>
        <div className="w-full bg-gray-700 rounded-full h-2.5">
          <div className={`${getBarColor(value)} h-2.5 rounded-full transition-all duration-500`} style={{ width: `${value}%` }}></div>
        </div>
      </div>
    </div>
  );
};

const CharacterCard: React.FC<CharacterCardProps> = ({ character }) => {
  return (
    <div className="bg-gray-800/50 backdrop-blur-sm border border-gray-700 rounded-xl shadow-lg overflow-hidden transform hover:scale-[1.02] hover:border-cyan-500 transition-all duration-300">
      <div className="relative">
        <img className="w-full h-48 object-cover object-center" src={character.portraitUrl} alt={character.name} />
        <div className="absolute inset-0 bg-gradient-to-t from-gray-800 to-transparent"></div>
        <RarityBadge rarity={character.rarity} />
        <div className="absolute bottom-0 left-0 p-4 w-full">
          <h3 className="text-xl font-bold text-white truncate">{character.name}</h3>
          <div className="flex items-center justify-between mt-1">
            <p className="text-sm text-cyan-300 font-medium">{character.role}</p>
             {character.isLeader && (
              <div className="flex items-center text-yellow-300 bg-yellow-500/20 px-2 py-0.5 rounded-full text-xs font-bold border border-yellow-500/50">
                  <StarIcon />
                  <span className="ml-1">LEADER</span>
              </div>
            )}
          </div>
        </div>
      </div>
      <div className="p-4 space-y-4">
        <StatBar icon={<KnowledgeIcon />} label="Knowledge" value={character.stats.knowledge} />
        <StatBar icon={<CommunicationIcon />} label="Communication" value={character.stats.communication} />
        <StatBar icon={<TechSavvyIcon />} label="Tech Savvy" value={character.stats.techSavvy} />
        <StatBar icon={<ResilienceIcon />} label="Resilience" value={character.stats.resilience} />
      </div>
      <div className="bg-gray-900/50 px-4 py-2 flex justify-between items-center text-sm">
        <div className="flex items-center space-x-2 text-gray-400">
          <BriefcaseIcon />
          <span>{character.experience} Year(s) Exp.</span>
        </div>
        <div className="flex items-center space-x-2 text-green-400">
            <CostIcon />
            <span className="font-bold text-lg text-green-300">${character.cost.toLocaleString()}</span>
        </div>
      </div>
    </div>
  );
};

export default CharacterCard;
