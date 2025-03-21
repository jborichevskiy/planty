import React from 'react';
import { Link } from 'react-router-dom';
import { WateringHistory } from '../components/WateringHistory';

export const HistoryView: React.FC = () => {
  return (
    <div className="min-h-screen bg-amber-50 flex flex-col">
      <header className="py-4 px-6 bg-amber-100 shadow-sm">
        <div className="flex justify-between items-center">
          <h1 className="text-xl font-semibold text-amber-800">Planty</h1>
          <Link 
            to="/" 
            className="text-amber-800 hover:text-amber-600"
          >
            Back to Plant
          </Link>
        </div>
      </header>
      
      <main className="flex-grow p-6">
        <WateringHistory />
      </main>
    </div>
  );
};