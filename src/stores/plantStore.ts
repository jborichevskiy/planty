import { create } from 'zustand';
import { sync } from '@tonk/keepsync';

interface WateringEntry {
  timestamp: number;
  person: string;
}

interface PlantState {
  lastWatering: number | null;
  wateringHistory: WateringEntry[];
  waterers: string[];
  waterPlant: (person: string) => void;
  addWaterer: (name: string) => void;
  removeWaterer: (name: string) => void;
  deleteWateringEntry: (index: number) => void;
  getDaysSinceWatering: () => number;
}

export const usePlantStore = create<PlantState>(
  sync(
    (set, get) => ({
      lastWatering: null,
      wateringHistory: [],
      waterers: [],
      
      waterPlant: (person: string) => {
        const timestamp = Date.now();
        set((state) => ({
          lastWatering: timestamp,
          wateringHistory: [
            { timestamp, person },
            ...state.wateringHistory,
          ],
        }));
      },
      
      addWaterer: (name: string) => {
        set((state) => ({
          waterers: [...state.waterers, name],
        }));
      },
      
      removeWaterer: (name: string) => {
        set((state) => ({
          waterers: state.waterers.filter((w) => w !== name),
        }));
      },
      
      deleteWateringEntry: (index: number) => {
        set((state) => {
          const newHistory = [...state.wateringHistory];
          newHistory.splice(index, 1);
          
          // Update lastWatering if we're deleting the most recent entry
          const lastWatering = newHistory.length > 0 
            ? newHistory[0].timestamp 
            : null;
            
          return {
            wateringHistory: newHistory,
            lastWatering,
          };
        });
      },
      
      getDaysSinceWatering: () => {
        const { lastWatering } = get();
        if (!lastWatering) return Infinity;
        
        const now = Date.now();
        const diffMs = now - lastWatering;
        const diffDays = diffMs / (1000 * 60 * 60 * 24);
        return diffDays;
      },
    }),
    {
      docId: 'plant-watering-tracker',
    }
  )
);