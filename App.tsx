import React, { useState, useEffect, useCallback } from 'react';
import { Team, Character, Gadget } from './types';
import { generateApplicantPool, buildTeam, GADGET_OPTIONS, INITIAL_INVESTMENT, GADGET_OPERATION_FEE } from './services/characterService';
import CharacterCard from './components/CharacterCard';
import TeamSummary from './components/TeamSummary';
import Header from './components/Header';
import { ApplicantSelector } from './components/ApplicantSelector';
import { GadgetSelector } from './components/GadgetSelector';

const App: React.FC = () => {
  const [applicantPool, setApplicantPool] = useState<Character[]>([]);
  const [selectedApplicants, setSelectedApplicants] = useState<Character[]>([]);
  const [selectedGadget, setSelectedGadget] = useState<Gadget | null>(null);
  const [team, setTeam] = useState<Team | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  const startNewSimulation = useCallback(() => {
    setIsLoading(true);
    setTeam(null);
    setSelectedApplicants([]);
    setSelectedGadget(null);
    setTimeout(() => {
      setApplicantPool(generateApplicantPool());
      setIsLoading(false);
    }, 500);
  }, []);

  useEffect(() => {
    startNewSimulation();
  }, [startNewSimulation]);

  const handleSelectApplicant = (applicant: Character) => {
    setSelectedApplicants(prev => {
      if (prev.find(c => c.id === applicant.id)) {
        return prev.filter(c => c.id !== applicant.id);
      }
      if (prev.length < 5) {
        return [...prev, applicant];
      }
      return prev;
    });
  };

  const handleAnalyzeTeam = () => {
    if (selectedApplicants.length === 5 && selectedGadget) {
      const finalTeam = buildTeam(selectedApplicants, selectedGadget);
      setTeam(finalTeam);
    }
  };

  const isReadyToAnalyze = selectedApplicants.length === 5 && selectedGadget !== null;

  return (
    <div className="min-h-screen bg-gray-900 text-gray-200 p-4 sm:p-6 lg:p-8">
      <div className="max-w-7xl mx-auto">
        <Header />

        <main className="mt-8 space-y-12">
          {/*-- Step 1 & 2: Recruitment and Equipment --*/}
          {!team && (
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
              <div className="lg:col-span-2">
                <ApplicantSelector
                  applicants={applicantPool}
                  selected={selectedApplicants}
                  onSelect={handleSelectApplicant}
                  isLoading={isLoading}
                />
              </div>
              <div>
                <GadgetSelector
                  gadgets={GADGET_OPTIONS}
                  selected={selectedGadget}
                  onSelect={setSelectedGadget}
                />
              </div>
            </div>
          )}

          {/*-- Controls --*/}
          <div className="text-center">
            {!team ? (
              <button
                onClick={handleAnalyzeTeam}
                disabled={!isReadyToAnalyze || isLoading}
                className="bg-cyan-500 hover:bg-cyan-400 disabled:bg-cyan-800 disabled:cursor-not-allowed text-white font-bold py-3 px-8 rounded-lg text-xl shadow-lg shadow-cyan-500/20 transform hover:scale-105 transition-all duration-300 ease-in-out font-orbitron"
              >
                ANALYZE TEAM PERFORMANCE
              </button>
            ) : (
              <button
                onClick={startNewSimulation}
                className="bg-purple-500 hover:bg-purple-400 text-white font-bold py-3 px-8 rounded-lg text-xl shadow-lg shadow-purple-500/20 transform hover:scale-105 transition-all duration-300 ease-in-out font-orbitron"
              >
                START OVER
              </button>
            )}
          </div>
          
          {/*-- Step 3: Analysis --*/}
          {team && (
            <div id="team-analysis">
              <TeamSummary
                team={team}
                initialInvestment={INITIAL_INVESTMENT}
              />
              <div className="mt-8">
                <h2 className="text-2xl font-bold font-orbitron text-cyan-400">FINAL TEAM ROSTER</h2>
                <div className="mt-4 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5 gap-6">
                  {team.members.map((character: Character) => (
                    <CharacterCard key={character.id} character={character} />
                  ))}
                </div>
              </div>
            </div>
          )}
        </main>
      </div>
    </div>
  );
};

export default App;
