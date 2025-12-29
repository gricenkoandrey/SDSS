export interface NutritionalData {
  dishName: string;
  calories: number;
  macros: {
    protein: number;
    fat: number;
    carbs: number;
  };
  ingredients: string[];
  summary: string;
}

export interface HistoryItem {
  id: string;
  timestamp: number;
  data: NutritionalData;
}

export enum AppState {
  IDLE = 'IDLE',
  ANALYZING = 'ANALYZING',
  RESULT = 'RESULT',
  ERROR = 'ERROR',
  HISTORY = 'HISTORY'
}
