import React from 'react';
import { Team, Synergy } from '../types';
import { CostIcon, EfficiencyIcon, InvestmentIcon, TeamIcon, TechSavvyIcon } from './icons';

interface TeamSummaryProps {
  team: Team | null;
  initialInvestment: number;
}

const StatBox: React.FC<{ icon: React.ReactNode; label: string; value: string | React.ReactNode; color: string; }> = ({ icon, label, value, color }) => (
  <div className={`bg-gray-800 p-4 rounded-lg flex items-center shadow-lg border-l-4 ${color}`}>
    <div className="mr-4 text-3xl">{icon}</div>
    <div>
      <p className="text-sm text-gray-400">{label}</p>
      <p className="text-xl font-bold font-orbitron">{value}</p>
    </div>
  </div>
);

const DetailRow: React.FC<{ label: string; value: string; isSub?: boolean }> = ({ label, value, isSub }) => (
  <div className={`flex justify-between items-baseline ${isSub ? 'ml-6 text-sm' : 'text-base'}`}>
    <span className={isSub ? 'text-gray-400' : 'text-gray-200'}>{label}</span>
    <span className={`font-semibold font-orbitron ${isSub ? 'text-gray-300' : 'text-white'}`}>{value}</span>
  </div>
);

const SynergyRow: React.FC<{ synergy: Synergy }> = ({ synergy }) => {
    const isPositive = synergy.effect > 0;
    const color = isPositive ? 'text-green-400' : 'text-red-400';
    const sign = isPositive ? '+' : '';

    return (
        <div className="flex justify-between items-start py-2">
            <div>
                <p className={`font-semibold ${color}`}>{synergy.name}</p>
                <p className="text-xs text-gray-400">{synergy.description}</p>
            </div>
            <p className={`font-bold font-orbitron text-lg ml-4 ${color}`}>
                {sign}{synergy.effect}
            </p>
        </div>
    )
}

const TeamSummary: React.FC<TeamSummaryProps> = ({ team, initialInvestment }) => {
  if (!team) return null;

  const formatCurrency = (value: number) => `$${value.toLocaleString()}`;

  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
      {/* Left Column: Stats & Cost */}
      <div className="space-y-6">
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <StatBox 
              icon={<EfficiencyIcon />} 
              label="Team Efficiency Score" 
              value={`${team.efficiencyScore} / 99`}
              color="border-cyan-400"
            />
            <StatBox 
              icon={<TechSavvyIcon />} 
              label="Equipped Gadget" 
              value={team.gadget.name}
              color="border-purple-400"
            />
        </div>
        <div className="bg-gray-800 p-4 rounded-lg shadow-lg border-l-4 border-yellow-400">
          <div className="flex items-center mb-3">
              <div className="mr-4 text-3xl text-yellow-400"><CostIcon/></div>
              <div>
                  <p className="text-sm text-gray-400">Cost Analysis</p>
                  <p className="text-xl font-bold font-orbitron text-yellow-200">
                    Grand Total: {formatCurrency(team.grandTotalCost)}
                  </p>
              </div>
          </div>
          <div className="space-y-2 p-2">
            <DetailRow label="Total Operating Cost" value={formatCurrency(team.totalOperatingCost)} />
            {/* Fix: Corrected typo from formatcurrency to formatCurrency */}
            <DetailRow label="Personnel Salaries" value={formatCurrency(team.totalPersonnelCost)} isSub />
            <DetailRow label="Gadget Purchase" value={formatCurrency(team.gadget.cost)} isSub />
            <DetailRow label="Gadget Operation Fee" value={formatCurrency(15000)} isSub />
            <hr className="border-gray-700 my-1"/>
            <DetailRow label="Initial Investment" value={formatCurrency(initialInvestment)} />
          </div>
        </div>
      </div>

      {/* Right Column: Efficiency Analysis */}
      <div className="bg-gray-800 p-4 rounded-lg shadow-lg border-l-4 border-cyan-400">
         <div className="flex items-center mb-3">
              <div className="mr-4 text-3xl text-cyan-400"><EfficiencyIcon/></div>
              <div>
                  <p className="text-sm text-gray-400">Efficiency Analysis</p>
                  <p className="text-xl font-bold font-orbitron text-cyan-200">
                    Score Calculation Breakdown
                  </p>
              </div>
          </div>
          <div className="p-2 divide-y divide-gray-700">
            {team.synergies.length === 0 && (
                <div className="text-center py-4">
                    <p className="text-gray-400">This team is perfectly average with no notable synergies.</p>
                </div>
            )}
            {team.synergies.map(synergy => <SynergyRow key={synergy.name} synergy={synergy} />)}
          </div>
      </div>
    </div>
  );
};

export default TeamSummary;