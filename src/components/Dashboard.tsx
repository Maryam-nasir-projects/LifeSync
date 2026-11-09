import React from 'react';
import {
  Sparkles,
  Timer,
  Moon,
  Smartphone,
  Smile,
  CheckCircle2,
  Circle,
  ArrowRight,
  TrendingUp,
  Wind,
  Shield,
  Heart,
  Calendar,
  Flame,
  Award,
  HelpCircle
} from 'lucide-react';
import {
  UserProfile,
  StudyTask,
  MoodEntry,
  ScreenTimeLog,
  SleepLog,
  FocusStats
} from '../types';
import { PWAInstallButton } from './PWAInstallButton';
import { soundFx } from '../utils/audio';

interface Props {
  profile: UserProfile;
  tasks: StudyTask[];
  moods: MoodEntry[];
  screenTime: ScreenTimeLog;
  sleepLogs: SleepLog[];
  focusStats: FocusStats;
  onNavigate: (tab: string) => void;
  onToggleTask: (taskId: string) => void;
}

export const Dashboard: React.FC<Props> = ({
  profile,
  tasks,
  moods,
  screenTime,
  sleepLogs,
  focusStats,
  onNavigate,
  onToggleTask,
}) => {
  // Latest mood
  const latestMood = moods[moods.length - 1];
  // Latest sleep
  const latestSleep = sleepLogs[sleepLogs.length - 1];

  // Calculate dynamic Well-being Score (0-100)
  const calculateWellbeingScore = () => {
    let score = 50;
    // Sleep factor
    if (latestSleep) {
      if (latestSleep.totalHours >= 7 && latestSleep.totalHours <= 9) score += 15;
      else if (latestSleep.totalHours >= 6) score += 8;
      if (latestSleep.quality >= 4) score += 5;
    }
    // Focus factor
    if (focusStats.todayMinutes >= profile.dailyFocusTargetMinutes) score += 15;
    else if (focusStats.todayMinutes >= 50) score += 10;
    // Screen time balance
    const nonStudyScreen =
      screenTime.hours.socialMedia +
      screenTime.hours.gaming +
      screenTime.hours.videoStreaming;
    if (nonStudyScreen <= profile.dailyMaxScreenHours) score += 10;
    // Mood factor
    if (latestMood) {
      score += (latestMood.score - 3) * 5;
    }
    return Math.min(100, Math.max(30, Math.round(score)));
  };

  const wellbeingScore = calculateWellbeingScore();

  // Top pending tasks for today
  const pendingTasks = tasks.filter((t) => !t.completed).slice(0, 3);
  const completedTodayCount = tasks.filter((t) => t.completed).length;

  const getGreeting = () => {
    const hour = new Date().getHours();
    if (hour < 12) return 'Good Morning';
    if (hour < 17) return 'Good Afternoon';
    return 'Good Evening';
  };

  const getMoodEmoji = (mood?: string) => {
    switch (mood) {
      case 'ecstatic':
        return '🌟';
      case 'happy':
        return '😊';
      case 'calm':
        return '🌿';
      case 'tired':
        return '😴';
      case 'stressed':
        return '⚡';
      case 'anxious':
        return '🌧️';
      default:
        return '✨';
    }
  };

  return (
    <div className="space-y-5 pb-8 animate-fadeIn">
      {/* PWA Install Banner (only renders if not installed) */}
      <PWAInstallButton variant="card" />

      {/* Hero Welcome Card */}
      <div className="relative overflow-hidden rounded-3xl bg-gradient-to-br from-purple-700 via-indigo-700 to-purple-800 p-6 text-white shadow-xl shadow-purple-900/15">
        {/* Decorative ambient elements */}
        <div className="absolute top-0 right-0 -mr-10 -mt-10 w-44 h-44 rounded-full bg-peach-400 bg-amber-400/20 blur-3xl pointer-events-none" />
        <div className="absolute bottom-0 left-1/3 -mb-12 w-36 h-36 rounded-full bg-blue-400/20 blur-2xl pointer-events-none" />

        <div className="relative z-10">
          <div className="flex items-center justify-between mb-3">
            <div className="flex items-center gap-2">
              <span className="px-2.5 py-1 rounded-full bg-white/15 text-[11px] font-semibold tracking-wide backdrop-blur-md flex items-center gap-1.5 text-purple-100">
                <Calendar className="w-3 h-3 text-amber-300" />
                {new Date().toLocaleDateString('en-US', {
                  weekday: 'short',
                  month: 'short',
                  day: 'numeric',
                })}
              </span>
              <span className="px-2.5 py-1 rounded-full bg-white/15 text-[11px] font-semibold text-purple-100 flex items-center gap-1">
                <Flame className="w-3 h-3 text-amber-400 fill-amber-400" />
                {focusStats.streakDays}d Streak
              </span>
            </div>
            <button
              onClick={() => onNavigate('privacy')}
              className="p-1.5 rounded-full bg-white/10 hover:bg-white/20 text-purple-200 transition"
              title="Privacy & Local Storage"
            >
              <Shield className="w-4 h-4" />
            </button>
          </div>

          <h2 className="text-2xl font-extrabold tracking-tight text-white">
            {getGreeting()}, <span className="text-amber-300">{profile.name}</span>!
          </h2>
          <p className="text-xs text-purple-200 mt-1 max-w-sm">
            {profile.university} • {profile.semester}
          </p>

          {/* Well-being Index Bar */}
          <div className="mt-5 rounded-2xl bg-white/10 p-3.5 backdrop-blur-md border border-white/10">
            <div className="flex items-center justify-between text-xs mb-2">
              <span className="font-semibold text-purple-100 flex items-center gap-1.5">
                <Heart className="w-3.5 h-3.5 text-rose-300 fill-rose-300" />
                LifeSync Balance Index
              </span>
              <span className="font-bold text-amber-300 text-sm">
                {wellbeingScore}%{' '}
                <span className="text-[11px] font-medium text-purple-200">
                  {wellbeingScore >= 80
                    ? '• Thriving'
                    : wellbeingScore >= 65
                    ? '• Balanced'
                    : '• Needs Care'}
                </span>
              </span>
            </div>
            <div className="w-full h-2 rounded-full bg-white/20 overflow-hidden">
              <div
                className="h-full rounded-full bg-gradient-to-r from-amber-300 via-rose-300 to-emerald-300 transition-all duration-700"
                style={{ width: `${wellbeingScore}%` }}
              />
            </div>
            <p className="text-[11px] text-purple-200 mt-2 italic flex items-center gap-1">
              <Sparkles className="w-3 h-3 text-amber-300 shrink-0" />
              "Take a 5-minute breather between study sessions to maintain steady cognitive energy."
            </p>
          </div>
        </div>
      </div>

      {/* Interactive Feature Instructions Guide & Walkthrough Callout */}
      <div
        onClick={() => {
          soundFx.playTap();
          onNavigate('walkthrough');
        }}
        className="flex items-center justify-between p-3.5 rounded-2xl bg-gradient-to-r from-purple-500/10 via-indigo-500/10 to-blue-500/10 border border-purple-200/80 dark:border-purple-800/40 hover:border-purple-400 transition-all cursor-pointer shadow-xs group"
      >
        <div className="flex items-center gap-3">
          <div className="w-9 h-9 rounded-xl bg-purple-600 text-white flex items-center justify-center shadow group-hover:scale-105 transition-transform">
            <HelpCircle className="w-5 h-5" />
          </div>
          <div>
            <h4 className="text-xs font-bold text-slate-800 dark:text-white flex items-center gap-1.5">
              <span>App Feature Instructions & Walkthrough</span>
              <span className="text-[9px] font-extrabold px-1.5 py-0.5 rounded-full bg-purple-100 dark:bg-purple-900/60 text-purple-700 dark:text-purple-300">
                Guide
              </span>
            </h4>
            <p className="text-[11px] text-slate-500 dark:text-slate-400">
              New user? Explore how each LifeSync feature works step-by-step
            </p>
          </div>
        </div>
        <div className="text-purple-600 dark:text-purple-400 group-hover:translate-x-1 transition-transform">
          <ArrowRight className="w-4 h-4" />
        </div>
      </div>

      {/* 4 Core Vital Widgets Grid */}
      <div className="grid grid-cols-2 gap-3">
        {/* Focus Zone Widget */}
        <div
          onClick={() => {
            soundFx.playTap();
            onNavigate('study');
          }}
          className="group relative overflow-hidden rounded-2xl bg-white p-4 border border-purple-100 shadow-sm hover:shadow-md hover:border-purple-300 transition-all cursor-pointer"
        >
          <div className="flex items-center justify-between mb-2">
            <div className="w-9 h-9 rounded-xl bg-purple-100 text-purple-600 flex items-center justify-center group-hover:scale-110 transition-transform">
              <Timer className="w-5 h-5" />
            </div>
            <span className="text-[11px] font-semibold text-purple-600 bg-purple-50 px-2 py-0.5 rounded-full">
              Pomodoro
            </span>
          </div>
          <div className="mt-1">
            <span className="text-xl font-bold text-slate-800">
              {focusStats.todayMinutes}
            </span>
            <span className="text-xs text-slate-500 ml-1">/ {profile.dailyFocusTargetMinutes}m</span>
          </div>
          <p className="text-[11px] font-medium text-slate-500 mt-0.5">
            {focusStats.todaySessions} sessions today
          </p>
          <div className="mt-2.5 w-full bg-slate-100 h-1.5 rounded-full overflow-hidden">
            <div
              className="bg-purple-600 h-full rounded-full transition-all"
              style={{
                width: `${Math.min(
                  100,
                  (focusStats.todayMinutes / profile.dailyFocusTargetMinutes) * 100
                )}%`,
              }}
            />
          </div>
        </div>

        {/* Sleep Widget */}
        <div
          onClick={() => {
            soundFx.playTap();
            onNavigate('balance');
          }}
          className="group relative overflow-hidden rounded-2xl bg-white p-4 border border-indigo-100 shadow-sm hover:shadow-md hover:border-indigo-300 transition-all cursor-pointer"
        >
          <div className="flex items-center justify-between mb-2">
            <div className="w-9 h-9 rounded-xl bg-indigo-100 text-indigo-600 flex items-center justify-center group-hover:scale-110 transition-transform">
              <Moon className="w-5 h-5" />
            </div>
            <span className="text-[11px] font-semibold text-indigo-600 bg-indigo-50 px-2 py-0.5 rounded-full">
              Last Night
            </span>
          </div>
          <div className="mt-1">
            <span className="text-xl font-bold text-slate-800">
              {latestSleep ? `${latestSleep.totalHours}h` : '8.0h'}
            </span>
            <span className="text-xs text-amber-500 ml-1 font-semibold">
              {'★'.repeat(latestSleep?.quality || 4)}
            </span>
          </div>
          <p className="text-[11px] font-medium text-slate-500 mt-0.5">
            Goal: {profile.dailySleepTargetHours}h sleep
          </p>
          <div className="mt-2.5 w-full bg-slate-100 h-1.5 rounded-full overflow-hidden">
            <div
              className="bg-indigo-600 h-full rounded-full transition-all"
              style={{
                width: `${Math.min(
                  100,
                  ((latestSleep?.totalHours || 7.5) / profile.dailySleepTargetHours) * 100
                )}%`,
              }}
            />
          </div>
        </div>

        {/* Digital Balance Widget */}
        <div
          onClick={() => {
            soundFx.playTap();
            onNavigate('balance');
          }}
          className="group relative overflow-hidden rounded-2xl bg-white p-4 border border-blue-100 shadow-sm hover:shadow-md hover:border-blue-300 transition-all cursor-pointer"
        >
          <div className="flex items-center justify-between mb-2">
            <div className="w-9 h-9 rounded-xl bg-blue-100 text-blue-600 flex items-center justify-center group-hover:scale-110 transition-transform">
              <Smartphone className="w-5 h-5" />
            </div>
            <span className="text-[11px] font-semibold text-blue-600 bg-blue-50 px-2 py-0.5 rounded-full">
              Screen Log
            </span>
          </div>
          <div className="mt-1">
            <span className="text-xl font-bold text-slate-800">
              {screenTime.hours.studyWork.toFixed(1)}h
            </span>
            <span className="text-xs text-slate-500 ml-1">study work</span>
          </div>
          <p className="text-[11px] font-medium text-slate-500 mt-0.5">
            Social: {screenTime.hours.socialMedia.toFixed(1)}h
          </p>
          <div className="mt-2.5 w-full bg-slate-100 h-1.5 rounded-full overflow-hidden">
            <div
              className="bg-blue-500 h-full rounded-full transition-all"
              style={{
                width: `${Math.min(
                  100,
                  (screenTime.hours.studyWork / (screenTime.hours.studyWork + screenTime.hours.socialMedia + 0.1)) * 100
                )}%`,
              }}
            />
          </div>
        </div>

        {/* Mood & Mind Widget */}
        <div
          onClick={() => {
            soundFx.playTap();
            onNavigate('wellbeing');
          }}
          className="group relative overflow-hidden rounded-2xl bg-white p-4 border border-rose-100 shadow-sm hover:shadow-md hover:border-rose-300 transition-all cursor-pointer"
        >
          <div className="flex items-center justify-between mb-2">
            <div className="w-9 h-9 rounded-xl bg-rose-100 text-rose-600 flex items-center justify-center group-hover:scale-110 transition-transform">
              <Smile className="w-5 h-5" />
            </div>
            <span className="text-lg">
              {getMoodEmoji(latestMood?.mood)}
            </span>
          </div>
          <div className="mt-1">
            <span className="text-lg font-bold text-slate-800 capitalize">
              {latestMood?.mood || 'Calm'}
            </span>
          </div>
          <p className="text-[11px] font-medium text-slate-500 mt-0.5">
            Energy: {latestMood?.energyLevel || 3}/5 • {latestMood?.tags[0] || 'Reflective'}
          </p>
          <div className="mt-2.5 flex items-center gap-1 text-[11px] text-rose-600 font-semibold group-hover:translate-x-1 transition-transform">
            <span>Breathing & Journal</span>
            <ArrowRight className="w-3 h-3" />
          </div>
        </div>
      </div>

      {/* Quick Action Dock */}
      <div className="rounded-2xl bg-white p-4 border border-purple-100 shadow-sm">
        <h3 className="text-xs font-bold uppercase tracking-wider text-slate-400 mb-3">
          Quick Well-being Actions
        </h3>
        <div className="grid grid-cols-4 gap-2">
          <button
            onClick={() => {
              soundFx.playTap();
              onNavigate('study');
            }}
            className="flex flex-col items-center gap-1.5 p-2 rounded-xl bg-purple-50 hover:bg-purple-100 text-purple-700 transition active:scale-95 cursor-pointer text-center"
          >
            <div className="w-8 h-8 rounded-lg bg-purple-600 text-white flex items-center justify-center shadow-sm">
              <Timer className="w-4 h-4" />
            </div>
            <span className="text-[11px] font-bold">Focus Zone</span>
          </button>

          <button
            onClick={() => {
              soundFx.playTap();
              onNavigate('social_comparison');
            }}
            className="flex flex-col items-center gap-1.5 p-2 rounded-xl bg-blue-50 hover:bg-blue-100 text-blue-700 transition active:scale-95 cursor-pointer text-center"
          >
            <div className="w-8 h-8 rounded-lg bg-blue-600 text-white flex items-center justify-center shadow-sm">
              <Sparkles className="w-4 h-4" />
            </div>
            <span className="text-[11px] font-bold">Reality Lens</span>
          </button>

          <button
            onClick={() => {
              soundFx.playTap();
              onNavigate('wellbeing');
            }}
            className="flex flex-col items-center gap-1.5 p-2 rounded-xl bg-rose-50 hover:bg-rose-100 text-rose-700 transition active:scale-95 cursor-pointer text-center"
          >
            <div className="w-8 h-8 rounded-lg bg-rose-500 text-white flex items-center justify-center shadow-sm">
              <Wind className="w-4 h-4" />
            </div>
            <span className="text-[11px] font-bold">Breathe</span>
          </button>

          <button
            onClick={() => {
              soundFx.playTap();
              onNavigate('rewards');
            }}
            className="flex flex-col items-center gap-1.5 p-2 rounded-xl bg-amber-50 hover:bg-amber-100 text-amber-800 transition active:scale-95 cursor-pointer text-center"
          >
            <div className="w-8 h-8 rounded-lg bg-amber-500 text-white flex items-center justify-center shadow-sm">
              <Award className="w-4 h-4" />
            </div>
            <span className="text-[11px] font-bold">Rewards</span>
          </button>
        </div>
      </div>

      {/* Today's Priority Study Tasks */}
      <div className="rounded-3xl bg-white p-5 border border-purple-100 shadow-sm">
        <div className="flex items-center justify-between mb-4">
          <div>
            <h3 className="font-bold text-slate-800 text-base flex items-center gap-2">
              <span>Today's Study Priorities</span>
              <span className="text-xs font-semibold px-2 py-0.5 rounded-full bg-purple-100 text-purple-700">
                {completedTodayCount}/{tasks.length} Done
              </span>
            </h3>
            <p className="text-xs text-slate-500 mt-0.5">Stay on pace for upcoming deadlines</p>
          </div>
          <button
            onClick={() => {
              soundFx.playTap();
              onNavigate('study');
            }}
            className="text-xs font-bold text-purple-600 hover:text-purple-700 flex items-center gap-1 cursor-pointer"
          >
            <span>View All</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </button>
        </div>

        <div className="space-y-2.5">
          {pendingTasks.length === 0 ? (
            <div className="py-6 text-center text-slate-500 bg-purple-50/50 rounded-2xl border border-dashed border-purple-200">
              <CheckCircle2 className="w-8 h-8 text-emerald-500 mx-auto mb-1.5" />
              <p className="text-sm font-semibold text-slate-700">All caught up for today!</p>
              <p className="text-xs text-slate-500 mt-0.5">Time to rest, stretch, or log an offline activity.</p>
            </div>
          ) : (
            pendingTasks.map((task) => (
              <div
                key={task.id}
                className="flex items-start justify-between gap-3 p-3 rounded-2xl bg-slate-50/80 hover:bg-purple-50/40 border border-slate-100 hover:border-purple-200 transition-all"
              >
                <button
                  onClick={() => {
                    soundFx.playCelebration();
                    onToggleTask(task.id);
                  }}
                  className="mt-0.5 text-slate-400 hover:text-purple-600 transition cursor-pointer"
                >
                  <Circle className="w-5 h-5 text-slate-300 hover:text-purple-600" />
                </button>
                <div className="flex-1 min-w-0">
                  <h4 className="text-sm font-semibold text-slate-800 truncate">
                    {task.title}
                  </h4>
                  <div className="flex items-center gap-2 mt-1">
                    <span className="text-[11px] font-medium text-purple-700 bg-purple-100/70 px-2 py-0.5 rounded-md">
                      {task.course}
                    </span>
                    <span
                      className={`text-[10px] font-bold uppercase px-1.5 py-0.5 rounded ${
                        task.priority === 'high'
                          ? 'bg-rose-100 text-rose-700'
                          : task.priority === 'medium'
                          ? 'bg-amber-100 text-amber-700'
                          : 'bg-emerald-100 text-emerald-700'
                      }`}
                    >
                      {task.priority}
                    </span>
                    <span className="text-[11px] text-slate-400">
                      {task.completedSessions}/{task.estimatedSessions} sessions
                    </span>
                  </div>
                </div>
                <button
                  onClick={() => {
                    soundFx.playTap();
                    onNavigate('study');
                  }}
                  className="self-center p-2 rounded-xl bg-purple-100 text-purple-700 hover:bg-purple-200 transition cursor-pointer"
                  title="Focus on this task"
                >
                  <Timer className="w-4 h-4" />
                </button>
              </div>
            ))
          )}
        </div>
      </div>
    </div>
  );
};
