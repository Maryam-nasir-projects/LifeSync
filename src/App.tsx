import React, { useState, useEffect } from 'react';
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
  FocusStats
} from './types';
import { storage } from './utils/storage';
import { soundFx } from './utils/audio';

import { SplashScreen } from './components/SplashScreen';
import { PWAInstallButton } from './components/PWAInstallButton';
import { OfflineIndicator } from './components/OfflineIndicator';
import { Dashboard } from './components/Dashboard';
import { StudyPlanner } from './components/StudyPlanner';
import { MoodStress } from './components/MoodStress';
import { DigitalBalanceSleep } from './components/DigitalBalanceSleep';
import { CompassRewards } from './components/CompassRewards';
import { SafetySupportPrivacy } from './components/SafetySupportPrivacy';
import { SocialComparisonTool } from './components/SocialComparisonTool';
import { AppWalkthroughModal } from './components/AppWalkthroughModal';

import {
  Home as HomeIcon,
  BookOpen as BookOpenIcon,
  Smile as SmileIcon,
  Moon as MoonIcon,
  Sun as SunIcon,
  Compass as CompassIcon,
  Shield as ShieldIcon,
  User as UserIcon,
  X as XIcon,
  Eye as EyeIcon,
  HelpCircle as HelpCircleIcon
} from 'lucide-react';

export default function App() {
  const [showSplash, setShowSplash] = useState(true);
  const [activeTab, setActiveTab] = useState<'home' | 'study' | 'wellbeing' | 'balance' | 'rewards' | 'safety' | 'social_comparison'>('home');
  const [showProfileModal, setShowProfileModal] = useState(false);
  const [showWalkthroughModal, setShowWalkthroughModal] = useState<boolean>(() => {
    try {
      return localStorage.getItem('lifesync_walkthrough_seen') === null;
    } catch {
      return false;
    }
  });

  // Dark Mode State
  const [darkMode, setDarkMode] = useState<boolean>(() => {
    try {
      return localStorage.getItem('lifesync_dark_mode') === 'true';
    } catch {
      return false;
    }
  });

  // Apply dark mode class to html document
  useEffect(() => {
    if (darkMode) {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
    try {
      localStorage.setItem('lifesync_dark_mode', String(darkMode));
    } catch {
      // Ignore
    }
  }, [darkMode]);

  const toggleDarkMode = () => {
    soundFx.playTap();
    setDarkMode((prev) => !prev);
  };

  // App State initialized from LocalStorage
  const [profile, setProfile] = useState<UserProfile>(() => storage.getProfile());
  const [tasks, setTasks] = useState<StudyTask[]>(() => storage.getTasks());
  const [moods, setMoods] = useState<MoodEntry[]>(() => storage.getMoods());
  const [screenTime, setScreenTime] = useState<ScreenTimeLog>(() => storage.getScreenTime());
  const [habits, setHabits] = useState<DigitalHabit[]>(() => storage.getHabits());
  const [sleepLogs, setSleepLogs] = useState<SleepLog[]>(() => storage.getSleepLogs());
  const [challenges, setChallenges] = useState<OfflineChallenge[]>(() => storage.getChallenges());
  const [badges, setBadges] = useState<AchievementBadge[]>(() => storage.getBadges());
  const [weeklyGoals, setWeeklyGoals] = useState<WeeklyGoal[]>(() => storage.getWeeklyGoals());
  const [contacts, setContacts] = useState<TrustedContact[]>(() => storage.getContacts());
  const [focusStats, setFocusStats] = useState<FocusStats>(() => storage.getFocusStats());

  // Form state for profile modal
  const [editName, setEditName] = useState(profile.name);
  const [editUni, setEditUni] = useState(profile.university);
  const [editSemester, setEditSemester] = useState(profile.semester);
  const [editFocusTarget, setEditFocusTarget] = useState(profile.dailyFocusTargetMinutes);
  const [editSleepTarget, setEditSleepTarget] = useState(profile.dailySleepTargetHours);

  // Sync state changes to storage
  const handleProfileChange = (p: UserProfile) => {
    setProfile(p);
    storage.setProfile(p);
  };

  const handleTasksChange = (newTasks: StudyTask[]) => {
    setTasks(newTasks);
    storage.setTasks(newTasks);
  };

  const handleMoodsChange = (newMoods: MoodEntry[]) => {
    setMoods(newMoods);
    storage.setMoods(newMoods);
  };

  const handleScreenTimeChange = (newST: ScreenTimeLog) => {
    setScreenTime(newST);
    storage.setScreenTime(newST);
  };

  const handleHabitsChange = (newHabits: DigitalHabit[]) => {
    setHabits(newHabits);
    storage.setHabits(newHabits);
  };

  const handleSleepLogsChange = (newSleep: SleepLog[]) => {
    setSleepLogs(newSleep);
    storage.setSleepLogs(newSleep);
  };

  const handleChallengesChange = (newChallenges: OfflineChallenge[]) => {
    setChallenges(newChallenges);
    storage.setChallenges(newChallenges);
  };

  const handleBadgesChange = (newBadges: AchievementBadge[]) => {
    setBadges(newBadges);
    storage.setBadges(newBadges);
  };

  const handleWeeklyGoalsChange = (newGoals: WeeklyGoal[]) => {
    setWeeklyGoals(newGoals);
    storage.setWeeklyGoals(newGoals);
  };

  const handleContactsChange = (newContacts: TrustedContact[]) => {
    setContacts(newContacts);
    storage.setContacts(newContacts);
  };

  const handleFocusStatsChange = (newStats: FocusStats) => {
    setFocusStats(newStats);
    storage.setFocusStats(newStats);
  };

  const handleToggleTask = (taskId: string) => {
    const updated = tasks.map((t) => (t.id === taskId ? { ...t, completed: !t.completed } : t));
    handleTasksChange(updated);
  };

  const handleDataReset = () => {
    setProfile(storage.getProfile());
    setTasks(storage.getTasks());
    setMoods(storage.getMoods());
    setScreenTime(storage.getScreenTime());
    setHabits(storage.getHabits());
    setSleepLogs(storage.getSleepLogs());
    setChallenges(storage.getChallenges());
    setBadges(storage.getBadges());
    setWeeklyGoals(storage.getWeeklyGoals());
    setContacts(storage.getContacts());
    setFocusStats(storage.getFocusStats());
  };

  const handleSaveProfile = (e: React.FormEvent) => {
    e.preventDefault();
    soundFx.playCelebration();
    const updated: UserProfile = {
      ...profile,
      name: editName.trim() || 'Alex',
      university: editUni.trim() || 'University Campus',
      semester: editSemester.trim() || 'Spring Semester',
      dailyFocusTargetMinutes: Number(editFocusTarget) || 100,
      dailySleepTargetHours: Number(editSleepTarget) || 8,
    };
    handleProfileChange(updated);
    setShowProfileModal(false);
  };

  // Bottom Navigation Items
  const navItems = [
    { id: 'home', label: 'Home', icon: HomeIcon },
    { id: 'study', label: 'Study & Focus', icon: BookOpenIcon },
    { id: 'wellbeing', label: 'Well-being', icon: SmileIcon },
    { id: 'balance', label: 'Sleep & Screen', icon: MoonIcon },
    { id: 'social_comparison', label: 'Reality Lens', icon: EyeIcon },
    { id: 'rewards', label: 'Compass', icon: CompassIcon },
    { id: 'safety', label: 'Safety & Shield', icon: ShieldIcon },
  ];

  return (
    <div className={`min-h-screen flex justify-center selection:bg-purple-200 ${darkMode ? 'bg-black' : 'bg-slate-900'}`}>
      {/* Mobile Shell Wrapper */}
      <div className={`w-full max-w-md min-h-screen flex flex-col relative shadow-2xl overflow-x-hidden transition-colors duration-300 ${
        darkMode ? 'bg-[#0f172a] text-slate-100' : 'bg-[#f8f7ff] text-slate-800'
      }`}>
        {/* Splash Screen */}
        {showSplash && <SplashScreen onComplete={() => setShowSplash(false)} />}

        {/* Top Header Bar */}
        <header className={`sticky top-0 z-30 backdrop-blur-md border-b px-4 py-2.5 flex items-center justify-between shadow-xs transition-colors duration-200 ${
          darkMode ? 'bg-[#0f172a]/90 border-slate-800 text-white' : 'bg-white/90 border-purple-100/80 text-slate-900'
        }`}>
          <div
            onClick={() => {
              soundFx.playTap();
              setActiveTab('home');
            }}
            className="flex items-center gap-2 cursor-pointer group"
          >
            <div className="w-9 h-9 rounded-xl bg-gradient-to-tr from-purple-600 via-indigo-600 to-blue-500 p-0.5 shadow-sm group-hover:scale-105 transition-transform flex items-center justify-center">
              <img
                src="/pwa-192x192.png"
                alt="Logo"
                className="w-full h-full rounded-[10px] object-cover"
                onError={(e) => {
                  (e.target as HTMLElement).style.display = 'none';
                }}
              />
            </div>
            <div>
              <div className="flex items-center gap-1 leading-none">
                <span className={`font-extrabold text-base tracking-tight ${darkMode ? 'text-white' : 'text-slate-900'}`}>Life</span>
                <span className="font-extrabold text-base tracking-tight text-purple-500">Sync</span>
              </div>
              <p className={`text-[10px] font-semibold mt-0.5 ${darkMode ? 'text-slate-400' : 'text-slate-400'}`}>
                Student Well-being
              </p>
            </div>
          </div>

          <div className="flex items-center gap-1.5">
            {/* Feature Walkthrough / Instructions Guide Button */}
            <button
              onClick={() => {
                soundFx.playTap();
                setShowWalkthroughModal(true);
              }}
              className={`p-2 rounded-xl transition-all duration-200 cursor-pointer active:scale-95 flex items-center gap-1 ${
                darkMode
                  ? 'bg-purple-900/40 text-purple-300 hover:bg-purple-900/60 ring-1 ring-purple-500/40'
                  : 'bg-purple-50 text-purple-700 hover:bg-purple-100 ring-1 ring-purple-200'
              }`}
              title="Feature Instructions & Student Walkthrough Guide"
              aria-label="Feature Guide"
            >
              <HelpCircleIcon className="w-4 h-4 text-purple-600 dark:text-purple-300" />
              <span className="text-[11px] font-bold hidden sm:inline">Guide</span>
            </button>

            {/* Dark Mode Toggle Button */}
            <button
              onClick={toggleDarkMode}
              className={`p-2 rounded-xl transition-all duration-200 cursor-pointer active:scale-95 ${
                darkMode
                  ? 'bg-amber-500/20 text-amber-300 hover:bg-amber-500/30 ring-1 ring-amber-400/40'
                  : 'bg-purple-50 text-purple-700 hover:bg-purple-100 ring-1 ring-purple-200'
              }`}
              title={darkMode ? 'Switch to Light Mode' : 'Switch to Dark Mode'}
              aria-label="Toggle Dark Mode"
            >
              {darkMode ? (
                <SunIcon className="w-4 h-4 text-amber-300 animate-[spin_8s_linear_infinite]" />
              ) : (
                <MoonIcon className="w-4 h-4 text-purple-700" />
              )}
            </button>

            <PWAInstallButton variant="header" />

            <button
              onClick={() => {
                soundFx.playTap();
                setEditName(profile.name);
                setEditUni(profile.university);
                setEditSemester(profile.semester);
                setEditFocusTarget(profile.dailyFocusTargetMinutes);
                setEditSleepTarget(profile.dailySleepTargetHours);
                setShowProfileModal(true);
              }}
              className={`p-2 rounded-xl transition active:scale-95 cursor-pointer ${
                darkMode ? 'bg-slate-800 hover:bg-slate-700 text-slate-300' : 'bg-slate-100 hover:bg-purple-100 text-slate-600'
              }`}
              title="Student Profile Settings"
            >
              <UserIcon className="w-4 h-4" />
            </button>
          </div>
        </header>

        {/* Main Content Area */}
        <main className="flex-1 px-4 pt-4 pb-24 overflow-y-auto">
          {activeTab === 'home' && (
            <Dashboard
              profile={profile}
              tasks={tasks}
              moods={moods}
              screenTime={screenTime}
              sleepLogs={sleepLogs}
              focusStats={focusStats}
              onNavigate={(tab) => {
                soundFx.playTap();
                if (tab === 'privacy') setActiveTab('safety');
                else if (tab === 'social_comparison') setActiveTab('social_comparison');
                else if (tab === 'walkthrough') setShowWalkthroughModal(true);
                else setActiveTab(tab as typeof activeTab);
              }}
              onToggleTask={handleToggleTask}
            />
          )}

          {activeTab === 'study' && (
            <StudyPlanner
              tasks={tasks}
              onTasksChange={handleTasksChange}
              focusStats={focusStats}
              onFocusStatsChange={handleFocusStatsChange}
            />
          )}

          {activeTab === 'wellbeing' && (
            <MoodStress moods={moods} onMoodsChange={handleMoodsChange} />
          )}

          {activeTab === 'balance' && (
            <DigitalBalanceSleep
              profile={profile}
              screenTime={screenTime}
              onScreenTimeChange={handleScreenTimeChange}
              habits={habits}
              onHabitsChange={handleHabitsChange}
              sleepLogs={sleepLogs}
              onSleepLogsChange={handleSleepLogsChange}
            />
          )}

          {activeTab === 'social_comparison' && (
            <SocialComparisonTool />
          )}

          {activeTab === 'rewards' && (
            <CompassRewards
              weeklyGoals={weeklyGoals}
              onWeeklyGoalsChange={handleWeeklyGoalsChange}
              challenges={challenges}
              onChallengesChange={handleChallengesChange}
              badges={badges}
              onBadgesChange={handleBadgesChange}
            />
          )}

          {activeTab === 'safety' && (
            <SafetySupportPrivacy
              contacts={contacts}
              onContactsChange={handleContactsChange}
              onDataReset={handleDataReset}
            />
          )}
        </main>

        {/* Offline Connectivity Status Pill */}
        <OfflineIndicator />

        {/* Bottom Mobile Navigation Bar */}
        <nav
          className={`fixed bottom-0 z-30 w-full max-w-md backdrop-blur-md border-t px-1 py-1.5 flex items-center justify-between shadow-lg transition-colors duration-200 ${
            darkMode ? 'bg-[#0f172a]/95 border-slate-800' : 'bg-white/95 border-purple-100/90'
          }`}
          style={{ paddingBottom: 'calc(0.4rem + var(--safe-bottom))' }}
        >
          {navItems.map((item) => {
            const Icon = item.icon;
            const isActive = activeTab === item.id;
            return (
              <button
                key={item.id}
                onClick={() => {
                  soundFx.playTap();
                  setActiveTab(item.id as typeof activeTab);
                }}
                className={`flex-1 flex flex-col items-center py-1 px-0.5 rounded-xl transition-all duration-150 cursor-pointer ${
                  isActive
                    ? 'text-purple-500 scale-105 font-bold'
                    : darkMode
                    ? 'text-slate-400 hover:text-slate-200 font-medium'
                    : 'text-slate-400 hover:text-slate-600 font-medium'
                }`}
              >
                <div
                  className={`p-1 rounded-xl transition-all ${
                    isActive ? (darkMode ? 'bg-purple-900/60 text-purple-300' : 'bg-purple-100 text-purple-700') : ''
                  }`}
                >
                  <Icon className="w-5 h-5" />
                </div>
                <span className="text-[9px] tracking-tight mt-0.5 truncate max-w-[50px]">
                  {item.label}
                </span>
              </button>
            );
          })}
        </nav>

        {/* Profile & Settings Modal */}
        {showProfileModal && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm animate-fadeIn">
            <div className={`w-full max-w-sm rounded-3xl p-6 shadow-2xl border ${
              darkMode ? 'bg-slate-900 border-slate-800 text-white' : 'bg-white border-purple-100 text-slate-800'
            }`}>
              <div className="flex items-center justify-between mb-4">
                <div className="flex items-center gap-2">
                  <div className={`w-10 h-10 rounded-xl flex items-center justify-center font-bold ${
                    darkMode ? 'bg-purple-900/60 text-purple-300' : 'bg-purple-100 text-purple-700'
                  }`}>
                    <UserIcon className="w-5 h-5" />
                  </div>
                  <div>
                    <h3 className="font-extrabold text-base">Student Profile</h3>
                    <p className={`text-[11px] ${darkMode ? 'text-slate-400' : 'text-slate-400'}`}>
                      Personalize your LifeSync settings
                    </p>
                  </div>
                </div>
                <button
                  onClick={() => setShowProfileModal(false)}
                  className={`p-1 rounded-full cursor-pointer ${
                    darkMode ? 'text-slate-400 hover:text-white hover:bg-slate-800' : 'text-slate-400 hover:text-slate-600 hover:bg-slate-100'
                  }`}
                >
                  <XIcon className="w-5 h-5" />
                </button>
              </div>

              <form onSubmit={handleSaveProfile} className="space-y-3.5">
                <div>
                  <label className={`block text-xs font-bold mb-1 ${darkMode ? 'text-slate-300' : 'text-slate-700'}`}>
                    Your Preferred Name
                  </label>
                  <input
                    type="text"
                    required
                    value={editName}
                    onChange={(e) => setEditName(e.target.value)}
                    className="w-full px-3 py-2 text-xs rounded-xl bg-slate-50 border border-slate-200 focus:outline-none focus:border-purple-500"
                  />
                </div>

                <div>
                  <label className={`block text-xs font-bold mb-1 ${darkMode ? 'text-slate-300' : 'text-slate-700'}`}>
                    University / College
                  </label>
                  <input
                    type="text"
                    value={editUni}
                    onChange={(e) => setEditUni(e.target.value)}
                    className="w-full px-3 py-2 text-xs rounded-xl bg-slate-50 border border-slate-200 focus:outline-none focus:border-purple-500"
                  />
                </div>

                <div>
                  <label className={`block text-xs font-bold mb-1 ${darkMode ? 'text-slate-300' : 'text-slate-700'}`}>
                    Academic Year / Semester
                  </label>
                  <input
                    type="text"
                    value={editSemester}
                    onChange={(e) => setEditSemester(e.target.value)}
                    className="w-full px-3 py-2 text-xs rounded-xl bg-slate-50 border border-slate-200 focus:outline-none focus:border-purple-500"
                  />
                </div>

                <div className="grid grid-cols-2 gap-2">
                  <div>
                    <label className={`block text-xs font-bold mb-1 ${darkMode ? 'text-slate-300' : 'text-slate-700'}`}>
                      Focus Goal (Mins)
                    </label>
                    <input
                      type="number"
                      min="25"
                      step="25"
                      value={editFocusTarget}
                      onChange={(e) => setEditFocusTarget(Number(e.target.value))}
                      className="w-full px-3 py-2 text-xs rounded-xl bg-slate-50 border border-slate-200 focus:outline-none focus:border-purple-500"
                    />
                  </div>
                  <div>
                    <label className={`block text-xs font-bold mb-1 ${darkMode ? 'text-slate-300' : 'text-slate-700'}`}>
                      Sleep Goal (Hours)
                    </label>
                    <input
                      type="number"
                      min="5"
                      max="12"
                      step="0.5"
                      value={editSleepTarget}
                      onChange={(e) => setEditSleepTarget(Number(e.target.value))}
                      className="w-full px-3 py-2 text-xs rounded-xl bg-slate-50 border border-slate-200 focus:outline-none focus:border-purple-500"
                    />
                  </div>
                </div>

                <div className="pt-2 flex gap-2">
                  <button
                    type="button"
                    onClick={() => setShowProfileModal(false)}
                    className={`flex-1 py-2.5 rounded-xl font-semibold text-xs transition cursor-pointer ${
                      darkMode ? 'bg-slate-800 hover:bg-slate-700 text-slate-300' : 'bg-slate-100 hover:bg-slate-200 text-slate-700'
                    }`}
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    className="flex-1 py-2.5 rounded-xl bg-purple-600 hover:bg-purple-700 text-white font-bold text-xs shadow transition cursor-pointer"
                  >
                    Save Changes
                  </button>
                </div>
              </form>
            </div>
          </div>
        )}

        {/* Interactive Feature Instructions Walkthrough Modal */}
        {showWalkthroughModal && (
          <AppWalkthroughModal
            onClose={() => {
              try {
                localStorage.setItem('lifesync_walkthrough_seen', 'true');
              } catch {
                // Ignore
              }
              setShowWalkthroughModal(false);
            }}
            onNavigateToTab={(tab) => {
              if (tab === 'privacy') setActiveTab('safety');
              else if (tab === 'social_comparison') setActiveTab('social_comparison');
              else setActiveTab(tab as typeof activeTab);
            }}
          />
        )}
      </div>
    </div>
  );
}
