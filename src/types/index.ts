export type MoodType = 'ecstatic' | 'happy' | 'calm' | 'tired' | 'stressed' | 'anxious';

export interface MoodEntry {
  id: string;
  timestamp: string; // ISO string
  mood: MoodType;
  score: number; // 1-5
  energyLevel: number; // 1-5
  tags: string[]; // e.g. ["Midterms", "Social", "Good Sleep", "Gym"]
  note: string;
}

export type TaskPriority = 'high' | 'medium' | 'low';

export interface StudyTask {
  id: string;
  title: string;
  course: string;
  dueDate: string; // YYYY-MM-DD
  dueTime?: string; // HH:MM
  priority: TaskPriority;
  estimatedSessions: number; // Pomodoro count
  completedSessions: number;
  completed: boolean;
  createdAt: string;
}

export interface ScreenTimeCategory {
  socialMedia: number; // hours (e.g. 1.5)
  studyWork: number;
  gaming: number;
  videoStreaming: number;
  messaging: number;
}

export interface ScreenTimeLog {
  date: string; // YYYY-MM-DD
  hours: ScreenTimeCategory;
  phoneFreeStreak: number;
  detoxGoalActive: boolean;
}

export interface DigitalHabit {
  id: string;
  title: string;
  description: string;
  target: string;
  completed: boolean;
  category: 'screen' | 'mind' | 'evening';
}

export interface SleepLog {
  id: string;
  date: string; // YYYY-MM-DD
  bedtime: string; // HH:MM
  wakeTime: string; // HH:MM
  totalHours: number;
  quality: number; // 1 to 5 stars
  notes: string;
  windDownCompleted: string[]; // IDs of completed wind-down checklist items
}

export interface WindDownItem {
  id: string;
  label: string;
  tip: string;
  iconName: string;
}

export interface OfflineChallenge {
  id: string;
  title: string;
  description: string;
  durationMinutes: number;
  category: 'nature' | 'social' | 'mindful' | 'creativity' | 'physical';
  xp: number;
  completed: boolean;
  completedAt?: string;
}

export interface AchievementBadge {
  id: string;
  title: string;
  description: string;
  icon: string;
  category: 'focus' | 'sleep' | 'mind' | 'balance' | 'offline';
  unlocked: boolean;
  unlockedAt?: string;
  progress: number; // 0 to 100
}

export interface WeeklyGoal {
  id: string;
  title: string;
  category: 'academic' | 'wellness' | 'digital' | 'sleep';
  targetValue: number;
  currentValue: number;
  unit: string;
  completed: boolean;
}

export interface TrustedContact {
  id: string;
  name: string;
  role: string; // e.g. "Campus Counseling", "Roommate", "Academic Advisor"
  phone: string;
  email: string;
  isCrisisService: boolean;
  hours?: string;
  notes?: string;
}

export interface CyberSafetyTip {
  id: string;
  category: 'phishing' | 'accounts' | 'wifi' | 'privacy' | 'social';
  title: string;
  summary: string;
  actionChecklist: string[];
  severity: 'high' | 'medium' | 'info';
}

export interface FocusStats {
  todaySessions: number;
  todayMinutes: number;
  totalSessions: number;
  totalMinutes: number;
  streakDays: number;
  lastFocusDate: string;
}

export interface SocialComparisonCard {
  id: string;
  theme: string;
  socialMediaPost: string;
  curatedPerception: string;
  hiddenReality: string;
  reflectionPrompt: string;
}

export interface KindCommentAnalysis {
  input: string;
  flaggedPhrases: string[];
  toneRating: 'respectful' | 'harsh' | 'passive_aggressive' | 'oversharing';
  constructiveSuggestions: string[];
  safeActionGuidance: string;
}

export interface UserProfile {
  name: string;
  university: string;
  semester: string;
  dailyFocusTargetMinutes: number;
  dailySleepTargetHours: number;
  dailyMaxScreenHours: number;
  avatarColor: string;
  soundEnabled: boolean;
  lastActiveDate: string;
}
