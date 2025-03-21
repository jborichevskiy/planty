import React, { useState, useEffect } from 'react';
import { usePlantStore } from '../stores/plantStore';

export const WateringHistory: React.FC = () => {
  const { wateringHistory, waterers, addWaterer, removeWaterer, deleteWateringEntry } = usePlantStore();
  const [newWaterer, setNewWaterer] = useState('');
  const [editingWaterer, setEditingWaterer] = useState<{ original: string, new: string } | null>(null);
  const [deletingEntry, setDeletingEntry] = useState<number | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  
  useEffect(() => {
    const timer = setTimeout(() => {
      setIsLoading(false);
    }, 1500);
    
    return () => clearTimeout(timer);
  }, []);

  const handleAddWaterer = () => {
    if (newWaterer.trim() && !waterers.includes(newWaterer.trim())) {
      addWaterer(newWaterer.trim());
      setNewWaterer('');
    }
  };

  const handleStartRename = (waterer: string) => {
    setEditingWaterer({ original: waterer, new: waterer });
  };

  const handleFinishRename = () => {
    if (editingWaterer && 
        editingWaterer.new.trim() && 
        editingWaterer.new !== editingWaterer.original && 
        !waterers.includes(editingWaterer.new.trim())) {
      // Add the new name first
      addWaterer(editingWaterer.new.trim());
      
      // Then remove the old one
      removeWaterer(editingWaterer.original);
    }
    setEditingWaterer(null);
  };

  const formatDate = (timestamp: number) => {
    const date = new Date(timestamp);
    return date.toLocaleDateString() + ' ' + date.toLocaleTimeString();
  };

  const handleDeleteHistoryEntry = (index: number) => {
    deleteWateringEntry(index);
    setDeletingEntry(null);
  };

  return (
    <div className="max-w-md mx-auto p-6">
      <h1 className="text-2xl font-bold mb-6">Watering History</h1>
      
      {isLoading ? (
        <div>
          <h2 className="text-xl font-semibold mb-4">Remembering<span className="ml-1 animate-pulse">.</span><span className="ml-1 animate-pulse animation-delay-200">.</span><span className="ml-1 animate-pulse animation-delay-400">.</span></h2>
          <div className="mt-8 bg-gray-100 rounded-md p-4 animate-pulse">
            <div className="h-6 bg-gray-200 rounded w-3/4 mb-4"></div>
            <div className="h-6 bg-gray-200 rounded w-1/2"></div>
          </div>
          <div className="mt-4 bg-gray-100 rounded-md p-4 animate-pulse">
            <div className="h-6 bg-gray-200 rounded w-2/3 mb-4"></div>
            <div className="h-6 bg-gray-200 rounded w-1/3"></div>
          </div>
        </div>
      ) : (
        <div className="fade-in">
          <div className="mb-8">
            <h2 className="text-xl font-semibold mb-4">Waterers</h2>
            <div className="flex flex-wrap gap-2 mb-4">
              {waterers.map((waterer) => (
                <div 
                  key={waterer} 
                  className="flex items-center bg-amber-100 rounded-full px-3 py-1"
                >
              {editingWaterer && editingWaterer.original === waterer ? (
                <>
                  <input
                    type="text"
                    value={editingWaterer.new}
                    onChange={(e) => setEditingWaterer({
                      ...editingWaterer,
                      new: e.target.value
                    })}
                    className="w-24 bg-transparent border-b border-amber-800 focus:outline-none"
                    autoFocus
                  />
                  <button 
                    className="ml-2 text-green-600 hover:text-green-800"
                    onClick={handleFinishRename}
                  >
                    ✓
                  </button>
                </>
              ) : (
                <>
                  <span>{waterer}</span>
                  <div className="ml-2 flex items-center">
                    <button 
                      className="text-amber-800 hover:text-amber-950 mr-1"
                      onClick={() => handleStartRename(waterer)}
                      title="Rename"
                    >
                      ✏️
                    </button>
                    <button 
                      className="text-red-500 hover:text-red-700"
                      onClick={() => removeWaterer(waterer)}
                      title="Delete"
                    >
                      ❌
                    </button>
                  </div>
                </>
              )}
            </div>
          ))}
        </div>

        <div className="flex">
          <input
            type="text"
            value={newWaterer}
            onChange={(e) => setNewWaterer(e.target.value)}
            placeholder="Add new waterer"
            className="flex-1 border rounded-l px-3 py-2"
          />
          <button
            onClick={handleAddWaterer}
            className="bg-green-600 text-white px-4 py-2 rounded-r"
          >
            Add
          </button>
        </div>
      </div>

      <div>
        <h2 className="text-xl font-semibold mb-4">History</h2>
        {wateringHistory.length === 0 ? (
          <p>No watering history yet.</p>
        ) : (
          <ul className="space-y-3">
            {wateringHistory.map((entry, index) => (
              <li key={index} className="border-b pb-2 relative">
                <div className="font-medium flex justify-between items-center">
                  <span>{entry.person}</span>
                  <button 
                    className="text-red-500 hover:text-red-700 text-sm"
                    onClick={() => setDeletingEntry(index)}
                    title="Delete entry"
                  >
                    ❌
                  </button>
                </div>
                <div className="text-sm text-gray-600">{formatDate(entry.timestamp)}</div>
                
                {/* Delete confirmation dialog */}
                {deletingEntry === index && (
                  <div className="absolute right-0 top-0 bg-white shadow-md rounded p-2 z-10 border">
                    <p className="text-sm mb-2">Delete this entry?</p>
                    <div className="flex gap-2">
                      <button 
                        className="px-2 py-1 bg-red-500 text-white text-xs rounded"
                        onClick={() => handleDeleteHistoryEntry(index)}
                      >
                        Yes
                      </button>
                      <button 
                        className="px-2 py-1 bg-gray-200 text-xs rounded"
                        onClick={() => setDeletingEntry(null)}
                      >
                        No
                      </button>
                    </div>
                  </div>
                )}
              </li>
            ))}
          </ul>
        )}
      </div>
      </div>
      )}
    </div>
  );
};