import React, { useState, useMemo } from 'react';
import { Character, Rarity } from '../types';
import { KnowledgeIcon, CommunicationIcon, TechSavvyIcon, ResilienceIcon } from './icons';

interface ApplicantCardProps {
  character: Character;
  isSelected: boolean;
  isSelectable: boolean;
  onSelect: (character: Character) => void;
}

const StatDisplay: React.FC<{ icon: React.ReactNode, value: number }> = ({ icon, value }) => (
    <div className="flex items-center space-x-1">
        <div className="text-cyan-400 w-4 h-4">{icon}</div>
        <span className="text-sm font-semibold text-gray-200 w-6 text-right">{value}</span>
    </div>
)

const ApplicantCard: React.FC<ApplicantCardProps> = ({ character, isSelected, isSelectable, onSelect }) => {
  const rarityColor = {
    [Rarity.N]: 'border-gray-600',
    [Rarity.R]: 'border-blue-500',
    [Rarity.SR]: 'border-purple-500',
  };

  return (
    <div
      onClick={() => (isSelectable || isSelected) && onSelect(character)}
      className={`
        bg-gray-800 rounded-lg p-3 border-2 flex flex-col justify-between
        transform transition-all duration-200 ease-in-out
        ${isSelected ? 'ring-4 ring-cyan-400 border-cyan-400 scale-105' : rarityColor[character.rarity]}
        ${isSelectable || isSelected ? 'cursor-pointer hover:border-cyan-300' : 'opacity-50 cursor-not-allowed'}
      `}
    >
      <div className="flex items-center space-x-3">
        <img className="w-16 h-16 rounded-full object-cover" src={character.portraitUrl} alt={character.name} />
        <div className="flex-1">
          <p className="font-bold text-white truncate">{character.name}</p>
          <p className="text-sm text-cyan-300">{character.role}</p>
          <p className="text-xs text-gray-400">{character.experience} Year(s) Exp.</p>
        </div>
        <div className="text-right">
            <p className="font-orbitron font-bold text-lg text-green-300">${character.cost}</p>
            <p className={`text-xs font-bold ${
                character.rarity === Rarity.SR ? 'text-purple-400' : 
                character.rarity === Rarity.R ? 'text-blue-400' : 'text-gray-400'
            }`}>
                {character.rarity}
            </p>
        </div>
      </div>
      <div className="grid grid-cols-2 gap-x-3 gap-y-1 mt-3 pt-2 border-t border-gray-700/50">
          <StatDisplay icon={<KnowledgeIcon />} value={character.stats.knowledge} />
          <StatDisplay icon={<CommunicationIcon />} value={character.stats.communication} />
          <StatDisplay icon={<TechSavvyIcon />} value={character.stats.techSavvy} />
          <StatDisplay icon={<ResilienceIcon />} value={character.stats.resilience} />
      </div>
    </div>
  );
};


interface ApplicantSelectorProps {
  applicants: Character[];
  selected: Character[];
  onSelect: (character: Character) => void;
  isLoading: boolean;
}

type SortKey = 'role' | 'overall' | 'knowledge' | 'communication' | 'techSavvy' | 'resilience';

export const ApplicantSelector: React.FC<ApplicantSelectorProps> = ({ applicants, selected, onSelect, isLoading }) => {
  const isSelectable = selected.length < 5;
  const [sortBy, setSortBy] = useState<SortKey>('role');

  const sortedApplicants = useMemo(() => {
    const sorted = [...applicants];
    switch (sortBy) {
        case 'role':
            return sorted.sort((a, b) => a.role.localeCompare(b.role) || b.totalStats - a.totalStats);
        case 'overall':
            return sorted.sort((a, b) => b.totalStats - a.totalStats);
        case 'knowledge':
            return sorted.sort((a, b) => b.stats.knowledge - a.stats.knowledge);
        case 'communication':
            return sorted.sort((a, b) => b.stats.communication - a.stats.communication);
        case 'techSavvy':
            return sorted.sort((a, b) => b.stats.techSavvy - a.stats.techSavvy);
        case 'resilience':
            return sorted.sort((a, b) => b.stats.resilience - a.stats.resilience);
        default:
            return sorted;
    }
  }, [applicants, sortBy]);

  return (
    <div className="bg-gray-800/50 p-6 rounded-xl border border-gray-700">
      <div className="flex flex-wrap justify-between items-center gap-4">
        <div>
            <h2 className="text-2xl font-bold font-orbitron text-cyan-400">
            STEP 1: RECRUIT YOUR TEAM
            </h2>
            <p className="mt-1 text-gray-400">
            Select 5 applicants from the pool.
            </p>
        </div>
        <span className="font-bold text-white bg-cyan-500/20 px-3 py-2 rounded-lg">
            {selected.length} / 5 Selected
        </span>
      </div>

      <div className="mt-4 flex justify-end">
        <div className="flex items-center space-x-2">
            <label htmlFor="sort-applicants" className="text-sm font-medium text-gray-400">Sort by:</label>
            <select 
                id="sort-applicants"
                value={sortBy}
                onChange={(e) => setSortBy(e.target.value as SortKey)}
                className="bg-gray-700 border border-gray-600 text-white text-sm rounded-lg focus:ring-cyan-500 focus:border-cyan-500 block w-full p-2"
            >
                <option value="role">Job Role</option>
                <option value="overall">Overall Stats</option>
                <option value="knowledge">Knowledge</option>
                <option value="communication">Communication</option>
                <option value="techSavvy">Tech Savvy</option>
                <option value="resilience">Resilience</option>
            </select>
        </div>
      </div>

      <div className="mt-4 grid grid-cols-1 md:grid-cols-2 gap-4 h-[55vh] overflow-y-auto pr-2">
        {isLoading && Array.from({ length: 10 }).map((_, i) => (
          <div key={i} className="bg-gray-800 rounded-lg h-32 animate-pulse"></div>
        ))}
        {!isLoading && sortedApplicants.map(applicant => (
          <ApplicantCard
            key={applicant.id}
            character={applicant}
            isSelected={!!selected.find(c => c.id === applicant.id)}
            isSelectable={isSelectable}
            onSelect={onSelect}
          />
        ))}
      </div>
    </div>
  );
};
