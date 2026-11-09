import {
  UserProfile,
  StudyTask,
  MoodEntry,
  ScreenTimeLog,
  DigitalHabit,
  SleepLog,
  OfflineChallenge,
  AchievementBadge,
  WeeklyGoal,
  TrustedContact,
  CyberSafetyTip
} from '../types';

const STORAGE_KEYS = {
  PROFILE: 'lifesync_profile_v1',
  TASKS: 'lifesync_tasks_v1',
  MOODS: 'lifesync_moods_v1',
  SCREENTIME: 'lifesync_screentime_v1',
  HABITS: 'lifesync_habits_v1',
  SLEEP: 'lifesync_sleep_v1',
  CHALLENGES: 'lifesync_challenges_v1',
  BADGES: 'lifesync_badges_v1',
  WEEKLY_GOALS: 'lifesync_weekly_goals_v1',
  CONTACTS: 'lifesync_contacts_v1',
  FIRST_RUN: 'lifesync_firstrun_done',
  FOCUS_STATS: 'lifesync_focus_stats_v1',
};

const defaultProfile: UserProfile = {
  name: 'Alex Rivera',
  university: 'University Campus',
  semester: 'Spring Semester',
  dailyFocusTargetMinutes: 100, // 4 Pomodoros
  dailySleepTargetHours: 8,
  dailyMaxScreenHours: 4.5,
  avatarColor: 'from-purple-500 to-indigo-600',
  soundEnabled: true,
  lastActiveDate: new Date().toISOString().split('T')[0],
};

const defaultTasks: StudyTask[] = [
  {
    id: 'task-1',
    title: 'Review Algorithms & Data Structures Lecture 8',
    course: 'Computer Science',
    dueDate: new Date(Date.now() + 86400000).toISOString().split('T')[0],
    dueTime: '15:00',
    priority: 'high',
    estimatedSessions: 3,
    completedSessions: 2,
    completed: false,
    createdAt: new Date().toISOString(),
  },
  {
    id: 'task-2',
    title: 'Draft Introduction for Ethics Essay',
    course: 'Philosophy',
    dueDate: new Date(Date.now() + 172800000).toISOString().split('T')[0],
    dueTime: '23:59',
    priority: 'medium',
    estimatedSessions: 2,
    completedSessions: 1,
    completed: false,
    createdAt: new Date().toISOString(),
  },
  {
    id: 'task-3',
    title: 'Practice Calculus Problem Set #5',
    course: 'Mathematics',
    dueDate: new Date().toISOString().split('T')[0],
    dueTime: '18:00',
    priority: 'high',
    estimatedSessions: 4,
    completedSessions: 4,
    completed: true,
    createdAt: new Date(Date.now() - 86400000).toISOString(),
  },
  {
    id: 'task-4',
    title: 'Read Chapter 4: Cognitive Psychology',
    course: 'Psychology',
    dueDate: new Date(Date.now() + 259200000).toISOString().split('T')[0],
    dueTime: '12:00',
    priority: 'low',
    estimatedSessions: 2,
    completedSessions: 0,
    completed: false,
    createdAt: new Date().toISOString(),
  },
];

const defaultMoods: MoodEntry[] = [
  {
    id: 'mood-1',
    timestamp: new Date(Date.now() - 86400000 * 2).toISOString(),
    mood: 'calm',
    score: 4,
    energyLevel: 3,
    tags: ['Good Sleep', 'Library Study', 'Tea'],
    note: 'Had a productive morning in the library corner. Felt balanced and focused.',
  },
  {
    id: 'mood-2',
    timestamp: new Date(Date.now() - 86400000).toISOString(),
    mood: 'tired',
    score: 3,
    energyLevel: 2,
    tags: ['Exam Prep', 'Late Study'],
    note: 'Spent a bit too long revising formulas. Need to get to bed earlier tonight.',
  },
  {
    id: 'mood-3',
    timestamp: new Date().toISOString(),
    mood: 'happy',
    score: 5,
    energyLevel: 4,
    tags: ['Completed Assignment', 'Campus Walk', 'Fresh Air'],
    note: 'Crushed my calculus problem set! Taking an afternoon breather outdoors.',
  },
];

const defaultScreenTime: ScreenTimeLog = {
  date: new Date().toISOString().split('T')[0],
  hours: {
    socialMedia: 1.2,
    studyWork: 3.5,
    gaming: 0.5,
    videoStreaming: 1.0,
    messaging: 0.6,
  },
  phoneFreeStreak: 4,
  detoxGoalActive: true,
};

const defaultHabits: DigitalHabit[] = [
  {
    id: 'habit-1',
    title: 'No Phone in Bed 30m Before Sleep',
    description: 'Keep the phone on the desk or nightstand to let melatonin release naturally.',
    target: '30 mins before sleep',
    completed: true,
    category: 'evening',
  },
  {
    id: 'habit-2',
    title: 'Social Media Cap (Max 90 mins)',
    description: 'Limit passive scrolling on Instagram, TikTok, and Reddit during study days.',
    target: '< 1.5 hrs / day',
    completed: true,
    category: 'screen',
  },
  {
    id: 'habit-3',
    title: 'Study Without Notification Buzzes',
    description: 'Switch to Do Not Disturb or Focus Mode when running Pomodoro timers.',
    target: 'During all focus sessions',
    completed: false,
    category: 'mind',
  },
  {
    id: 'habit-4',
    title: 'Hourly Screen Stretch & Eye Rest',
    description: 'Follow 20-20-20 rule: look at something 20 feet away for 20 seconds.',
    target: 'Every 50 mins',
    completed: true,
    category: 'screen',
  },
];

const defaultSleepLogs: SleepLog[] = [
  {
    id: 'sleep-1',
    date: new Date(Date.now() - 86400000 * 2).toISOString().split('T')[0],
    bedtime: '23:30',
    wakeTime: '07:15',
    totalHours: 7.75,
    quality: 4,
    notes: 'Slept soundly after reading fiction instead of looking at my phone.',
    windDownCompleted: ['w1', 'w2', 'w4'],
  },
  {
    id: 'sleep-2',
    date: new Date(Date.now() - 86400000).toISOString().split('T')[0],
    bedtime: '00:15',
    wakeTime: '06:45',
    totalHours: 6.5,
    quality: 3,
    notes: 'A bit restless thinking about the morning presentation.',
    windDownCompleted: ['w1'],
  },
  {
    id: 'sleep-3',
    date: new Date().toISOString().split('T')[0],
    bedtime: '23:15',
    wakeTime: '07:30',
    totalHours: 8.25,
    quality: 5,
    notes: 'Woke up feeling deeply refreshed and ready for classes!',
    windDownCompleted: ['w1', 'w2', 'w3', 'w4'],
  },
];

const defaultChallenges: OfflineChallenge[] = [
  {
    id: 'ch-1',
    title: '30-Minute Phone-Free Campus Walk',
    description: 'Leave the phone in your backpack and observe the trees, architecture, and fresh air.',
    durationMinutes: 30,
    category: 'nature',
    xp: 50,
    completed: true,
    completedAt: new Date(Date.now() - 86400000).toISOString(),
  },
  {
    id: 'ch-2',
    title: 'Read 15 Pages of a Physical Book',
    description: 'Enjoy real paper under natural light without blue light emission.',
    durationMinutes: 25,
    category: 'mindful',
    xp: 40,
    completed: false,
  },
  {
    id: 'ch-3',
    title: 'Face-to-Face Tea or Coffee Catchup',
    description: 'Meet a classmate or friend for 20 minutes without placing phones on the table.',
    durationMinutes: 20,
    category: 'social',
    xp: 60,
    completed: true,
    completedAt: new Date().toISOString(),
  },
  {
    id: 'ch-4',
    title: '15-Minute Paper Sketching or Free Journaling',
    description: 'Put thoughts, doodles, or goals onto a notebook using a physical pen.',
    durationMinutes: 15,
    category: 'creativity',
    xp: 35,
    completed: false,
  },
  {
    id: 'ch-5',
    title: 'Campus Gym or Dorm Stretch Session',
    description: 'Relieve neck, back, and hip tension accumulated from laptop studying.',
    durationMinutes: 20,
    category: 'physical',
    xp: 45,
    completed: false,
  },
];

const defaultBadges: AchievementBadge[] = [
  {
    id: 'b-1',
    title: 'Pomodoro Pioneer',
    description: 'Complete 10 focused 25-minute study sessions.',
    icon: 'Timer',
    category: 'focus',
    unlocked: true,
    unlockedAt: new Date(Date.now() - 172800000).toISOString(),
    progress: 100,
  },
  {
    id: 'b-2',
    title: 'Sleep Guardian',
    description: 'Log 8+ hours of quality sleep for 3 consecutive nights.',
    icon: 'Moon',
    category: 'sleep',
    unlocked: false,
    progress: 66,
  },
  {
    id: 'b-3',
    title: 'Zen Master',
    description: 'Complete 5 guided breathing sessions during study breaks.',
    icon: 'Wind',
    category: 'mind',
    unlocked: true,
    unlockedAt: new Date().toISOString(),
    progress: 100,
  },
  {
    id: 'b-4',
    title: 'Digital Balance Scholar',
    description: 'Keep non-study screen time below 2.5 hours for 5 days.',
    icon: 'SmartphoneOff',
    category: 'balance',
    unlocked: false,
    progress: 80,
  },
  {
    id: 'b-5',
    title: 'Offline Explorer',
    description: 'Complete 3 real-world offline campus challenges.',
    icon: 'Compass',
    category: 'offline',
    unlocked: true,
    unlockedAt: new Date().toISOString(),
    progress: 100,
  },
  {
    id: 'b-6',
    title: '7-Day Mindful Streak',
    description: 'Check in with LifeSync for 7 straight days.',
    icon: 'Flame',
    category: 'mind',
    unlocked: false,
    progress: 57,
  },
];

const defaultWeeklyGoals: WeeklyGoal[] = [
  {
    id: 'wg-1',
    title: 'Complete 16 Pomodoro Study Blocks',
    category: 'academic',
    targetValue: 16,
    currentValue: 11,
    unit: 'blocks',
    completed: false,
  },
  {
    id: 'wg-2',
    title: 'Average 7.5+ Hours of Sleep',
    category: 'sleep',
    targetValue: 7.5,
    currentValue: 7.5,
    unit: 'hrs/night',
    completed: true,
  },
  {
    id: 'wg-3',
    title: 'Log Daily Mood & Reflections',
    category: 'wellness',
    targetValue: 7,
    currentValue: 5,
    unit: 'days',
    completed: false,
  },
  {
    id: 'wg-4',
    title: 'Maintain Non-Study Screen < 3h/day',
    category: 'digital',
    targetValue: 5,
    currentValue: 4,
    unit: 'days',
    completed: false,
  },
];

const defaultContacts: TrustedContact[] = [
  {
    id: 'cnt-1',
    name: 'Campus Student Counseling Center',
    role: 'Confidential Mental Health & Well-being',
    phone: '1-800-273-8255',
    email: 'counseling@campus.edu',
    isCrisisService: true,
    hours: 'Mon-Fri 8:30 AM - 5:00 PM (Emergency on-call 24/7)',
    notes: 'Free confidential counseling and crisis walk-in support for all enrolled students.',
  },
  {
    id: 'cnt-2',
    name: '988 Suicide & Crisis Lifeline',
    role: 'National Crisis & Support Line',
    phone: '988',
    email: 'help@988lifeline.org',
    isCrisisService: true,
    hours: '24/7 Toll-Free & Confidential',
    notes: 'Free, immediate support via phone or text for emotional distress or mental health crises.',
  },
  {
    id: 'cnt-3',
    name: 'Crisis Text Line',
    role: 'Free 24/7 Text Support',
    phone: 'Text HOME to 741741',
    email: 'info@crisistextline.org',
    isCrisisService: true,
    hours: '24/7 Real-Time Texting',
    notes: 'Connect with a compassionate volunteer crisis counselor by texting directly.',
  },
  {
    id: 'cnt-4',
    name: 'Student Health & Wellness Clinic',
    role: 'Primary Care & Sleep Consultation',
    phone: '(555) 234-5678',
    email: 'healthcenter@campus.edu',
    isCrisisService: false,
    hours: 'Mon-Fri 8:00 AM - 6:00 PM',
    notes: 'Appointments for fatigue, physical wellness, and prescription management.',
  },
  {
    id: 'cnt-5',
    name: 'Jordan (Roommate & Study Partner)',
    role: 'Personal Trusted Contact',
    phone: '(555) 987-6543',
    email: 'jordan.student@campus.edu',
    isCrisisService: false,
    notes: 'Has my dorm key; great person to grab coffee with when feeling overwhelmed.',
  },
];

export const defaultCyberSafetyTips: CyberSafetyTip[] = [
  {
    id: 'cst-1',
    category: 'phishing',
    title: 'Detect Academic Job & Grant Phishing Scams',
    summary: 'Scammers frequently send fraudulent emails claiming to offer $400/week virtual assistant roles or research grants targeting university email accounts.',
    actionChecklist: [
      'Check the full sender address: official university communications will end in the exact institutional domain (e.g., @campus.edu).',
      'Never send personal banking info, purchase gift cards, or cash checks on behalf of unknown professors.',
      'Report suspicious emails to your campus IT Security Helpdesk using the "Report Phishing" button.',
    ],
    severity: 'high',
  },
  {
    id: 'cst-2',
    category: 'wifi',
    title: 'Safe Use of Campus & Coffee Shop Public Wi-Fi',
    summary: 'Unencrypted public wireless networks can allow bad actors on the same network to intercept unencrypted traffic or spoof portal logins.',
    actionChecklist: [
      'Always connect to eduroam or your authenticated university network using 802.1X security rather than open visitor networks.',
      'Ensure the browser padlock (HTTPS) is active on every website you visit.',
      'Use a trusted campus VPN when accessing sensitive portals like student grades, financial aid, or campus servers.',
    ],
    severity: 'medium',
  },
  {
    id: 'cst-3',
    category: 'accounts',
    title: 'Protect Your Student Portal with Multi-Factor (MFA/2FA)',
    summary: 'Credential stuffing is the #1 method student accounts get hijacked for academic fraud or identity misuse.',
    actionChecklist: [
      'Enable an authenticator app (like Google Authenticator) instead of SMS codes where possible.',
      'Never approve a Duo or 2FA prompt you did not initiate yourself (watch out for MFA fatigue attacks).',
      'Use a distinct, unique passphrase for your university login that you do not use on any other social app.',
    ],
    severity: 'high',
  },
  {
    id: 'cst-4',
    category: 'privacy',
    title: 'Keep Class Schedules & Dorm Locations Private',
    summary: 'Sharing full syllabi, room numbers, or real-time location tags on social media can compromise physical and digital privacy.',
    actionChecklist: [
      'Review social media visibility settings to ensure your accounts are set to friends/connections only.',
      'Avoid posting photos of student ID badges, keys, or class schedules with times and room numbers.',
      'Delay posting geotagged photos until after you have left the venue.',
    ],
    severity: 'medium',
  },
];

export const defaultWindDownItems = [
  {
    id: 'w1',
    label: 'Dim overhead dorm/bedroom lights',
    tip: 'Warm ambient lighting triggers melatonin synthesis.',
    iconName: 'Lamp',
  },
  {
    id: 'w2',
    label: 'Put phone in nightstand charging mode',
    tip: 'Avoid doomscrolling in bed to prevent hyper-arousal.',
    iconName: 'Moon',
  },
  {
    id: 'w3',
    label: 'Quick 3-minute gentle neck & spine stretch',
    tip: 'Relieves muscular strain from laptop desks.',
    iconName: 'Activity',
  },
  {
    id: 'w4',
    label: 'Read physical pages or journal reflections',
    tip: 'Transitions the prefrontal cortex into calm alpha waves.',
    iconName: 'BookOpen',
  },
];

// Focus Stats interface
export interface FocusStats {
  todaySessions: number;
  todayMinutes: number;
  totalSessions: number;
  totalMinutes: number;
  streakDays: number;
  lastFocusDate: string;
}

const defaultFocusStats: FocusStats = {
  todaySessions: 3,
  todayMinutes: 75,
  totalSessions: 14,
  totalMinutes: 350,
  streakDays: 4,
  lastFocusDate: new Date().toISOString().split('T')[0],
};

// Generic storage helper
export function loadFromStorage<T>(key: string, fallback: T): T {
  try {
    const raw = localStorage.getItem(key);
    if (!raw) return fallback;
    return JSON.parse(raw) as T;
  } catch {
    return fallback;
  }
}

export function saveToStorage<T>(key: string, data: T): void {
  try {
    localStorage.setItem(key, JSON.stringify(data));
  } catch (err) {
    console.error('Storage error:', err);
  }
}

export const storage = {
  getProfile: () => loadFromStorage<UserProfile>(STORAGE_KEYS.PROFILE, defaultProfile),
  setProfile: (p: UserProfile) => saveToStorage(STORAGE_KEYS.PROFILE, p),

  getTasks: () => loadFromStorage<StudyTask[]>(STORAGE_KEYS.TASKS, defaultTasks),
  setTasks: (t: StudyTask[]) => saveToStorage(STORAGE_KEYS.TASKS, t),

  getMoods: () => loadFromStorage<MoodEntry[]>(STORAGE_KEYS.MOODS, defaultMoods),
  setMoods: (m: MoodEntry[]) => saveToStorage(STORAGE_KEYS.MOODS, m),

  getScreenTime: () => loadFromStorage<ScreenTimeLog>(STORAGE_KEYS.SCREENTIME, defaultScreenTime),
  setScreenTime: (s: ScreenTimeLog) => saveToStorage(STORAGE_KEYS.SCREENTIME, s),

  getHabits: () => loadFromStorage<DigitalHabit[]>(STORAGE_KEYS.HABITS, defaultHabits),
  setHabits: (h: DigitalHabit[]) => saveToStorage(STORAGE_KEYS.HABITS, h),

  getSleepLogs: () => loadFromStorage<SleepLog[]>(STORAGE_KEYS.SLEEP, defaultSleepLogs),
  setSleepLogs: (s: SleepLog[]) => saveToStorage(STORAGE_KEYS.SLEEP, s),

  getChallenges: () => loadFromStorage<OfflineChallenge[]>(STORAGE_KEYS.CHALLENGES, defaultChallenges),
  setChallenges: (c: OfflineChallenge[]) => saveToStorage(STORAGE_KEYS.CHALLENGES, c),

  getBadges: () => loadFromStorage<AchievementBadge[]>(STORAGE_KEYS.BADGES, defaultBadges),
  setBadges: (b: AchievementBadge[]) => saveToStorage(STORAGE_KEYS.BADGES, b),

  getWeeklyGoals: () => loadFromStorage<WeeklyGoal[]>(STORAGE_KEYS.WEEKLY_GOALS, defaultWeeklyGoals),
  setWeeklyGoals: (g: WeeklyGoal[]) => saveToStorage(STORAGE_KEYS.WEEKLY_GOALS, g),

  getContacts: () => loadFromStorage<TrustedContact[]>(STORAGE_KEYS.CONTACTS, defaultContacts),
  setContacts: (c: TrustedContact[]) => saveToStorage(STORAGE_KEYS.CONTACTS, c),

  getFocusStats: () => loadFromStorage<FocusStats>(STORAGE_KEYS.FOCUS_STATS, defaultFocusStats),
  setFocusStats: (s: FocusStats) => saveToStorage(STORAGE_KEYS.FOCUS_STATS, s),

  /**
   * Complete export of all user data in JSON format (Privacy Shield)
   */
  exportAllData: () => {
    return {
      appName: 'LifeSync — Student Well-being App',
      exportDate: new Date().toISOString(),
      profile: storage.getProfile(),
      tasks: storage.getTasks(),
      moods: storage.getMoods(),
      screenTime: storage.getScreenTime(),
      habits: storage.getHabits(),
      sleepLogs: storage.getSleepLogs(),
      challenges: storage.getChallenges(),
      badges: storage.getBadges(),
      weeklyGoals: storage.getWeeklyGoals(),
      contacts: storage.getContacts(),
      focusStats: storage.getFocusStats(),
    };
  },

  /**
   * Clear all locally stored data completely (Privacy Shield)
   */
  clearAllData: () => {
    Object.values(STORAGE_KEYS).forEach((k) => localStorage.removeItem(k));
  },

  /**
   * Reset data to fresh starter template
   */
  resetToDefaults: () => {
    storage.setProfile(defaultProfile);
    storage.setTasks(defaultTasks);
    storage.setMoods(defaultMoods);
    storage.setScreenTime(defaultScreenTime);
    storage.setHabits(defaultHabits);
    storage.setSleepLogs(defaultSleepLogs);
    storage.setChallenges(defaultChallenges);
    storage.setBadges(defaultBadges);
    storage.setWeeklyGoals(defaultWeeklyGoals);
    storage.setContacts(defaultContacts);
    storage.setFocusStats(defaultFocusStats);
  },
};
