import { HistoryItem, NutritionalData } from '../types';

const STORAGE_KEY = 'nutriscan_history_v1';

export const saveHistoryItem = (data: NutritionalData): void => {
  try {
    const newItem: HistoryItem = {
      id: crypto.randomUUID(),
      timestamp: Date.now(),
      data
    };
    
    const existingHistory = getHistoryItems();
    const updatedHistory = [newItem, ...existingHistory].slice(0, 50); // Keep last 50 items
    
    localStorage.setItem(STORAGE_KEY, JSON.stringify(updatedHistory));
  } catch (error) {
    console.error('Failed to save history:', error);
  }
};

export const getHistoryItems = (): HistoryItem[] => {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    return raw ? JSON.parse(raw) : [];
  } catch (error) {
    console.error('Failed to read history:', error);
    return [];
  }
};

export const clearHistory = (): void => {
  try {
    localStorage.removeItem(STORAGE_KEY);
  } catch (error) {
    console.error('Failed to clear history:', error);
  }
};
