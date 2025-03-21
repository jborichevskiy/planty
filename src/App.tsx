import React, { useEffect } from "react";
import { Route, Routes } from "react-router-dom";
import { HelloWorld, PlantView, HistoryView } from "./views";
import { configureSyncEngine } from '@tonk/keepsync';

const App: React.FC = () => {
  // Initialize the sync engine
  useEffect(() => {
    configureSyncEngine({
      url: 'ws://localhost:4080',
      name: 'PlantWateringTracker',
      onSync: (docId) => console.log(`Document ${docId} synced`),
      onError: (error) => console.error('Sync error:', error),
    });
  }, []);

  return (
    <Routes>
      <Route path="/" element={<PlantView />} />
      <Route path="/history" element={<HistoryView />} />
      <Route path="/hello" element={<HelloWorld />} />
    </Routes>
  );
};

export default App;
