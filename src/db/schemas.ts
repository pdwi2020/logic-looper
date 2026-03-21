export interface DailyActivity {
  date: string;
  solved: boolean;
  score: number;
  timeTaken: number;
  difficulty: number;
  synced: boolean;
}

export interface Achievement {
  id: string;
  label: string;
  description: string;
  unlockedAt: string | null;
  type: 'streak' | 'milestone' | 'perfect';
}
