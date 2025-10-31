
import React from 'react';

const Header: React.FC = () => {
  return (
    <header className="text-center border-b-2 border-cyan-500/30 pb-4">
      <h1 className="text-4xl sm:text-5xl font-bold font-orbitron text-cyan-400 tracking-wider">
        CHW TEAM BUILDER
      </h1>
      <p className="text-gray-400 mt-2 text-lg">
        AI-Augmented Community Health Worker Simulation
      </p>
    </header>
  );
};

export default Header;
