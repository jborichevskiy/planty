import React, { useState, useEffect } from 'react';
import { usePlantStore } from '../stores/plantStore';

export const Plant: React.FC = () => {
  const { lastWatering, waterPlant, waterers, addWaterer, getDaysSinceWatering } = usePlantStore();
  const [showWaterers, setShowWaterers] = useState(false);
  const [newWatererName, setNewWatererName] = useState('');
  const [textColor, setTextColor] = useState('text-amber-800'); // neutral color
  const [isLoading, setIsLoading] = useState(true);
  
  const daysSinceWatering = getDaysSinceWatering();
  
  // Add loading effect
  useEffect(() => {
    const timer = setTimeout(() => {
      setIsLoading(false);
    }, 1500);
    
    return () => clearTimeout(timer);
  }, []);
  
  // Update text color based on days since watering
  useEffect(() => {
    if (daysSinceWatering >= 4) {
      setTextColor('text-red-600'); // more red
    } else if (daysSinceWatering >= 3.5) {
      setTextColor('text-red-400'); // subtle color change
    } else {
      setTextColor('text-amber-800'); // neutral color
    }
  }, [daysSinceWatering]);

  const handlePlantClick = () => {
    if (!showWaterers) {
      setShowWaterers(true);
    }
  };

  const handleWatererSelect = (waterer: string) => {
    waterPlant(waterer);
    setShowWaterers(false);
  };
  
  const handleAddNewWaterer = () => {
    if (newWatererName.trim()) {
      const name = newWatererName.trim();
      addWaterer(name);
      waterPlant(name);
      setNewWatererName('');
      setShowWaterers(false);
    }
  };

  const getTimeSinceText = () => {
    if (!lastWatering) return 'Never watered';
    if (daysSinceWatering < 1) return 'Today';
    if (daysSinceWatering < 2) return 'Yesterday';
    return `${Math.floor(daysSinceWatering)} days ago`;
  };

  return (
    <div className="flex flex-col items-center justify-center h-full">
      {/* Plant emoji - always visible */}
      <div className="text-9xl mb-8 transition-opacity duration-600 cursor-pointer"
           style={{ opacity: isLoading ? 0.5 : 1 }}
           onClick={!isLoading ? handlePlantClick : undefined}>
        🪴
      </div>
        
      {/* Content that changes */}
      {isLoading ? (
        <div className="text-center text-xl font-medium text-amber-800">
          <p className="flex items-center">
            Remembering
            <span className="ml-1 animate-pulse">.</span>
            <span className="ml-1 animate-pulse animation-delay-200">.</span>
            <span className="ml-1 animate-pulse animation-delay-400">.</span>
          </p>
        </div>
      ) : (
        <div className={`text-center text-xl font-medium ${textColor} transition-colors duration-500 fade-in`}>
          Last watered: {getTimeSinceText()}
        </div>
      )}

      {/* Waterers selection popup */}
      {showWaterers && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-10">
          <div className="bg-white rounded-lg p-6 max-w-sm w-full">
            <h2 className="text-xl font-bold mb-4">Who's watering the plant?</h2>
            
            {/* Existing waterers */}
            {waterers.length > 0 && (
              <div className="space-y-2 mb-4">
                {waterers.map((waterer) => (
                  <button
                    key={waterer}
                    className="block w-full text-left px-4 py-2 rounded hover:bg-gray-100"
                    onClick={() => handleWatererSelect(waterer)}
                  >
                    {waterer}
                  </button>
                ))}
              </div>
            )}
            
            {/* Add new waterer form */}
            <div className="mt-4 border-t pt-4">
              <h3 className="font-medium mb-2">Add a new waterer:</h3>
              <div className="flex mb-4">
                <input
                  type="text"
                  value={newWatererName}
                  onChange={(e) => setNewWatererName(e.target.value)}
                  placeholder="Enter name"
                  className="flex-1 border rounded-l px-3 py-2"
                />
                <button
                  onClick={handleAddNewWaterer}
                  className="bg-green-600 text-white px-4 py-2 rounded-r"
                  disabled={!newWatererName.trim()}
                >
                  Add & Water
                </button>
              </div>
            </div>
            
            <button
              className="mt-2 w-full py-2 bg-gray-200 rounded hover:bg-gray-300"
              onClick={() => setShowWaterers(false)}
            >
              Cancel
            </button>
          </div>
        </div>
      )}
    </div>
  );
};