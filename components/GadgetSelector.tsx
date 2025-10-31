import React from 'react';
import { Gadget, Stats } from '../types';
import { CommunicationIcon, KnowledgeIcon, ResilienceIcon, TechSavvyIcon } from './icons';

interface GadgetSelectorProps {
  gadgets: Gadget[];
  selected: Gadget | null;
  onSelect: (gadget: Gadget) => void;
}

const StatBoost: React.FC<{ icon: React.ReactNode; value: number }> = ({ icon, value }) => (
    <div className="flex items-center space-x-1 text-purple-300">
        {icon}
        <span className="text-sm font-bold">+{value}</span>
    </div>
);


export const GadgetSelector: React.FC<GadgetSelectorProps> = ({ gadgets, selected, onSelect }) => {
    
    const getBoosts = (boosts: Partial<Stats>) => {
        const boostElements = [];
        if (boosts.knowledge) boostElements.push(<StatBoost key="k" icon={<KnowledgeIcon/>} value={boosts.knowledge}/>);
        if (boosts.communication) boostElements.push(<StatBoost key="c" icon={<CommunicationIcon/>} value={boosts.communication}/>);
        if (boosts.techSavvy) boostElements.push(<StatBoost key="t" icon={<TechSavvyIcon/>} value={boosts.techSavvy}/>);
        if (boosts.resilience) boostElements.push(<StatBoost key="r" icon={<ResilienceIcon/>} value={boosts.resilience}/>);
        return boostElements;
    }

  return (
    <div className="bg-gray-800/50 p-6 rounded-xl border border-gray-700">
      <h2 className="text-2xl font-bold font-orbitron text-cyan-400">
        STEP 2: EQUIP YOUR TEAM
      </h2>
      <p className="mt-1 mb-4 text-gray-400">Choose one technology gadget for the mission.</p>
      <div className="space-y-4">
        {gadgets.map(gadget => (
          <div
            key={gadget.id}
            onClick={() => onSelect(gadget)}
            className={`
              p-4 rounded-lg border-2 bg-gray-800 transition-all duration-200
              ${selected?.id === gadget.id ? 'ring-4 ring-cyan-400 border-cyan-400' : 'border-gray-700 hover:border-cyan-300'}
              cursor-pointer
            `}
          >
            <div className="flex justify-between items-start">
                <div>
                    <h3 className="text-lg font-bold text-white">{gadget.name}</h3>
                    <p className="text-sm text-gray-400 mt-1">{gadget.description}</p>
                </div>
                <p className="font-orbitron font-bold text-lg text-green-300 ml-4">${gadget.cost.toLocaleString()}</p>
            </div>
            <div className="mt-3 flex items-center space-x-4 border-t border-gray-700 pt-3">
                <span className="text-sm font-semibold text-purple-400">Boosts:</span>
                <div className="flex items-center space-x-3">
                    {getBoosts(gadget.statBoost)}
                </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};
