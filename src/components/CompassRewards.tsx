import React, { useState } from 'react';
import {
  Compass,
  Award,
  CheckCircle2,
  Circle,
  Plus,
  Flame,
  Sparkles,
  BookOpen,
  Moon,
  Smartphone,
  Wind,
  Target,
  Trophy,
  Coffee,
  Footprints,
  PenTool,
  Dumbbell
} from 'lucide-react';
import {
  WeeklyGoal,
  OfflineChallenge,
  AchievementBadge
} from '../types';
import { soundFx } from '../utils/audio';

interface Props {
  weeklyGoals: WeeklyGoal[];
  onWeeklyGoalsChange: (goals: WeeklyGoal[]) => void;
  challenges: OfflineChallenge[];
  onChallengesChange: (challenges: OfflineChallenge[]) => void;
  badges: AchievementBadge[];
  onBadgesChange: (badges: AchievementBadge[]) => void;
}

export const CompassRewards: React.FC<Props> = ({
  weeklyGoals,
  onWeeklyGoalsChange,
  challenges,
  onChallengesChange,
  badges,
  onBadgesChange,
}) => {
  const [activeSubTab, setActiveSubTab] = useState<'compass' | 'rewards'>('compass');
  const [showAddGoalModal, setShowAddGoalModal] = useState(false);

  // New Goal form
  const [goalTitle, setGoalTitle] = useState('');
  const [goalCategory, setGoalCategory] = useState<WeeklyGoal['category']>('academic');
  const [goalTarget, setGoalTarget] = useState(10);
  const [goalUnit, setGoalUnit] = useState('hours');

  // Weekly reflection state
  const [reflectionText, setReflectionText] = useState('');
  const [reflectionSaved, setReflectionSaved] = useState(false);

  // Calculate total XP from completed challenges
  const totalXP = challenges
    .filter((c) => c.completed)
    .reduce((sum, c) => sum + c.xp, 150); // 150 base XP
  const currentLevel = Math.floor(totalXP / 100) + 1;
  const levelProgress = totalXP % 100;

  // Toggle challenge completion
  const handleToggleChallenge = (id: string) => {
    const updated = challenges.map((ch) => {
      if (ch.id === id) {
        const next = !ch.completed;
        if (next) soundFx.playCelebration();
        else soundFx.playTap();
        return {
          ...ch,
          completed: next,
          completedAt: next ? new Date().toISOString() : undefined,
        };
      }
      return ch;
    });
    onChallengesChange(updated);
  };

  // Add Weekly Goal
  const handleAddGoal = (e: React.FormEvent) => {
    e.preventDefault();
    if (!goalTitle.trim()) return;
    soundFx.playCelebration();

    const newGoal: WeeklyGoal = {
      id: `wg-${Date.now()}`,
      title: goalTitle.trim(),
      category: goalCategory,
      targetValue: Number(goalTarget) || 1,
      currentValue: 0,
      unit: goalUnit.trim() || 'times',
      completed: false,
    };

    onWeeklyGoalsChange([...weeklyGoals, newGoal]);
    setGoalTitle('');
    setShowAddGoalModal(false);
  };

  // Increment goal
  const handleIncrementGoal = (id: string) => {
    soundFx.playTap();
    const updated = weeklyGoals.map((g) => {
      if (g.id === id) {
        const nextVal = g.currentValue + 1;
        const isDone = nextVal >= g.targetValue;
        if (isDone && !g.completed) soundFx.playCelebration();
        return {
          ...g,
          currentValue: nextVal,
          completed: isDone,
        };
      }
      return g;
    });
    onWeeklyGoalsChange(updated);
  };

  const getChallengeIcon = (cat: OfflineChallenge['category']) => {
    switch (cat) {
      case 'nature':
        return <Footprints className="w-4 h-4 text-emerald-600" />;
      case 'social':
        return <Coffee className="w-4 h-4 text-amber-600" />;
      case 'creativity':
        return <PenTool className="w-4 h-4 text-purple-600" />;
      case 'physical':
        return <Dumbbell className="w-4 h-4 text-blue-600" />;
      default:
        return <BookOpen className="w-4 h-4 text-indigo-600" />;
    }
  };

  return (
    <div className="space-y-5 pb-8 animate-fadeIn">
      {/* Segmented Switcher */}
      <div className="flex rounded-2xl bg-slate-200/70 p-1 backdrop-blur-md">
        <button
          onClick={() => {
            soundFx.playTap();
            setActiveSubTab('compass');
          }}
          className={`flex-1 flex items-center justify-center gap-2 py-2.5 rounded-xl text-xs font-bold transition cursor-pointer ${
            activeSubTab === 'compass'
              ? 'bg-white text-purple-800 shadow-sm'
              : 'text-slate-600 hover:text-slate-900'
          }`}
        >
          <Compass className="w-4 h-4" />
          <span>Weekly Compass</span>
        </button>
        <button
          onClick={() => {
            soundFx.playTap();
            setActiveSubTab('rewards');
          }}
          className={`flex-1 flex items-center justify-center gap-2 py-2.5 rounded-xl text-xs font-bold transition cursor-pointer ${
            activeSubTab === 'rewards'
              ? 'bg-white text-purple-800 shadow-sm'
              : 'text-slate-600 hover:text-slate-900'
          }`}
        >
          <Award className="w-4 h-4" />
          <span>Offline Rewards & Badges</span>
        </button>
      </div>

      {/* WEEKLY COMPASS VIEW */}
      {activeSubTab === 'compass' && (
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <div>
              <h2 className="text-xl font-extrabold text-slate-800">Weekly Compass</h2>
              <p className="text-xs text-slate-500">
                Weekly progress compass & holistic university balance
              </p>
            </div>
            <button
              onClick={() => {
                soundFx.playTap();
                setShowAddGoalModal(true);
              }}
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-purple-600 hover:bg-purple-700 text-white font-bold text-xs shadow hover:shadow-md transition active:scale-95 cursor-pointer"
            >
              <Plus className="w-3.5 h-3.5" />
              <span>Add Goal</span>
            </button>
          </div>

          {/* Weekly Summary Highlights */}
          <div className="grid grid-cols-2 gap-3">
            <div className="p-3.5 rounded-2xl bg-white border border-purple-100 shadow-sm">
              <div className="flex items-center gap-2 text-xs font-semibold text-purple-700 mb-1">
                <BookOpen className="w-3.5 h-3.5" />
                <span>Study Pace</span>
              </div>
              <div className="text-lg font-bold text-slate-800">11 Focus Blocks</div>
              <p className="text-[11px] text-slate-400">Target: 16 sessions/week</p>
            </div>

            <div className="p-3.5 rounded-2xl bg-white border border-indigo-100 shadow-sm">
              <div className="flex items-center gap-2 text-xs font-semibold text-indigo-700 mb-1">
                <Moon className="w-3.5 h-3.5" />
                <span>Sleep Average</span>
              </div>
              <div className="text-lg font-bold text-slate-800">7.6 hrs/night</div>
              <p className="text-[11px] text-emerald-600 font-medium">Optimal recovery zone</p>
            </div>

            <div className="p-3.5 rounded-2xl bg-white border border-rose-100 shadow-sm">
              <div className="flex items-center gap-2 text-xs font-semibold text-rose-700 mb-1">
                <Sparkles className="w-3.5 h-3.5" />
                <span>Mood Balance</span>
              </div>
              <div className="text-lg font-bold text-slate-800">82% Positive</div>
              <p className="text-[11px] text-slate-400">5 logged reflections</p>
            </div>

            <div className="p-3.5 rounded-2xl bg-white border border-blue-100 shadow-sm">
              <div className="flex items-center gap-2 text-xs font-semibold text-blue-700 mb-1">
                <Smartphone className="w-3.5 h-3.5" />
                <span>Digital Habits</span>
              </div>
              <div className="text-lg font-bold text-slate-800">4 of 5 Days</div>
              <p className="text-[11px] text-slate-400">Met screen goals</p>
            </div>
          </div>

          {/* Weekly Goals List */}
          <div className="rounded-3xl bg-white p-5 border border-purple-100 shadow-sm space-y-3">
            <h3 className="text-xs font-bold uppercase tracking-wider text-slate-400">
              Active Weekly Goals
            </h3>

            <div className="space-y-3">
              {weeklyGoals.map((goal) => {
                const percent = Math.min(100, Math.round((goal.currentValue / goal.targetValue) * 100));
                return (
                  <div
                    key={goal.id}
                    className="p-3 rounded-2xl bg-slate-50/70 border border-slate-100 hover:border-purple-200 transition"
                  >
                    <div className="flex items-center justify-between mb-1.5">
                      <div className="flex items-center gap-2">
                        <Target className="w-4 h-4 text-purple-600" />
                        <h4 className="text-xs font-bold text-slate-800">{goal.title}</h4>
                      </div>
                      <span className="text-xs font-extrabold text-purple-700">
                        {goal.currentValue} / {goal.targetValue} {goal.unit}
                      </span>
                    </div>

                    <div className="w-full h-2 rounded-full bg-slate-200 overflow-hidden mb-2">
                      <div
                        className="h-full bg-gradient-to-r from-purple-500 to-indigo-500 rounded-full transition-all duration-500"
                        style={{ width: `${percent}%` }}
                      />
                    </div>

                    <div className="flex items-center justify-between">
                      <span className="text-[10px] font-semibold text-slate-400">
                        {percent}% completed
                      </span>
                      <button
                        onClick={() => handleIncrementGoal(goal.id)}
                        className="px-2.5 py-1 rounded-lg bg-purple-100 text-purple-700 font-bold text-[11px] hover:bg-purple-200 transition cursor-pointer"
                      >
                        + Record Progress
                      </button>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          {/* End-of-Week Reflection Prompt */}
          <div className="rounded-3xl bg-gradient-to-br from-purple-50 to-indigo-50 p-5 border border-purple-100 shadow-sm space-y-3">
            <div className="flex items-center gap-2 text-purple-800 font-bold text-xs uppercase tracking-wider">
              <Compass className="w-4 h-4" />
              <span>Weekly Student Reflection</span>
            </div>
            <p className="text-xs text-slate-600 leading-relaxed">
              Take 2 minutes to acknowledge what energized you this week and what you want to
              adjust for next week.
            </p>
            <textarea
              rows={2}
              placeholder="e.g. Setting a 90m limit on social media gave me much clearer sleep. Need to start chemistry revision earlier."
              value={reflectionText}
              onChange={(e) => setReflectionText(e.target.value)}
              className="w-full px-3 py-2 text-xs rounded-xl bg-white border border-purple-200 focus:outline-none focus:border-purple-500"
            />
            <button
              onClick={() => {
                soundFx.playCelebration();
                setReflectionSaved(true);
                setTimeout(() => setReflectionSaved(false), 3000);
              }}
              className="px-4 py-2 rounded-xl bg-purple-600 hover:bg-purple-700 text-white font-bold text-xs transition cursor-pointer"
            >
              Save Weekly Reflection
            </button>
            {reflectionSaved && (
              <span className="text-xs font-semibold text-emerald-600 ml-2">
                ✓ Reflection saved!
              </span>
            )}
          </div>
        </div>
      )}

      {/* OFFLINE REWARDS & BADGES VIEW */}
      {activeSubTab === 'rewards' && (
        <div className="space-y-4">
          <div>
            <h2 className="text-xl font-extrabold text-slate-800">Offline Rewards</h2>
            <p className="text-xs text-slate-500">
              Real-world disconnect challenges & well-being achievements
            </p>
          </div>

          {/* Level & XP Progression Banner */}
          <div className="rounded-3xl bg-gradient-to-br from-amber-500 via-peach-500 to-purple-600 p-5 text-white shadow-lg space-y-3">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2.5">
                <div className="w-11 h-11 rounded-2xl bg-white/20 backdrop-blur-md flex items-center justify-center font-extrabold text-xl shadow-inner">
                  🏆
                </div>
                <div>
                  <h3 className="font-extrabold text-base">Level {currentLevel} Mindful Scholar</h3>
                  <p className="text-xs text-amber-100">
                    {totalXP} Total Well-being XP Earned
                  </p>
                </div>
              </div>
              <span className="px-3 py-1 rounded-full bg-white/20 text-xs font-extrabold backdrop-blur-md">
                {levelProgress}/100 XP
              </span>
            </div>

            <div className="w-full h-2 rounded-full bg-black/20 overflow-hidden">
              <div
                className="h-full bg-white rounded-full transition-all duration-700"
                style={{ width: `${levelProgress}%` }}
              />
            </div>
            <p className="text-[11px] text-amber-100 italic">
              "Real world life happens away from the glowing screen."
            </p>
          </div>

          {/* Offline Activity Challenges */}
          <div className="rounded-3xl bg-white p-5 border border-purple-100 shadow-sm space-y-3">
            <h3 className="text-xs font-bold uppercase tracking-wider text-slate-400">
              Campus Offline Challenges
            </h3>

            <div className="space-y-2.5">
              {challenges.map((ch) => (
                <div
                  key={ch.id}
                  onClick={() => handleToggleChallenge(ch.id)}
                  className={`flex items-start gap-3 p-3.5 rounded-2xl border transition-all cursor-pointer ${
                    ch.completed
                      ? 'bg-amber-50/70 border-amber-200 text-slate-700'
                      : 'bg-white border-slate-100 hover:border-amber-200 hover:bg-slate-50'
                  }`}
                >
                  <button className="mt-0.5 text-amber-600 cursor-pointer">
                    {ch.completed ? (
                      <CheckCircle2 className="w-5 h-5 text-amber-500 fill-amber-100" />
                    ) : (
                      <Circle className="w-5 h-5 text-slate-300" />
                    )}
                  </button>

                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-1.5">
                      {getChallengeIcon(ch.category)}
                      <h4
                        className={`text-xs font-bold ${
                          ch.completed ? 'line-through text-slate-500' : 'text-slate-800'
                        }`}
                      >
                        {ch.title}
                      </h4>
                    </div>
                    <p className="text-[11px] text-slate-500 mt-1 leading-snug">
                      {ch.description}
                    </p>
                    <div className="flex items-center gap-2 mt-2">
                      <span className="text-[10px] font-bold px-2 py-0.5 rounded-md bg-amber-100 text-amber-800">
                        +{ch.xp} XP
                      </span>
                      <span className="text-[10px] text-slate-400 font-medium">
                        ⏱ {ch.durationMinutes} minutes offline
                      </span>
                      {ch.completed && (
                        <span className="text-[10px] text-emerald-600 font-bold ml-auto">
                          ✓ Completed
                        </span>
                      )}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Achievement Badges Showcase */}
          <div className="rounded-3xl bg-white p-5 border border-purple-100 shadow-sm space-y-3">
            <h3 className="text-xs font-bold uppercase tracking-wider text-slate-400">
              LifeSync Achievement Badges
            </h3>

            <div className="grid grid-cols-2 gap-3">
              {badges.map((badge) => (
                <div
                  key={badge.id}
                  className={`p-3.5 rounded-2xl border transition-all ${
                    badge.unlocked
                      ? 'bg-gradient-to-br from-purple-50 to-indigo-50 border-purple-200 shadow-sm'
                      : 'bg-slate-50/80 border-slate-100 opacity-60'
                  }`}
                >
                  <div className="flex items-center justify-between mb-1.5">
                    <span className="text-2xl">
                      {badge.unlocked ? '🏅' : '🔒'}
                    </span>
                    <span
                      className={`text-[10px] font-bold px-1.5 py-0.5 rounded ${
                        badge.unlocked
                          ? 'bg-emerald-100 text-emerald-700'
                          : 'bg-slate-200 text-slate-600'
                      }`}
                    >
                      {badge.unlocked ? 'Unlocked' : `${badge.progress}%`}
                    </span>
                  </div>

                  <h4 className="text-xs font-bold text-slate-800">{badge.title}</h4>
                  <p className="text-[10px] text-slate-500 mt-0.5 line-clamp-2">
                    {badge.description}
                  </p>

                  {!badge.unlocked && (
                    <div className="mt-2 w-full h-1 bg-slate-200 rounded-full overflow-hidden">
                      <div
                        className="h-full bg-purple-600 rounded-full"
                        style={{ width: `${badge.progress}%` }}
                      />
                    </div>
                  )}
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* Add Custom Goal Modal */}
      {showAddGoalModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/50 backdrop-blur-sm animate-fadeIn">
          <div className="w-full max-w-sm rounded-3xl bg-white p-6 shadow-2xl border border-purple-100">
            <h3 className="text-lg font-bold text-slate-800 mb-1">Add Weekly Goal</h3>
            <p className="text-xs text-slate-500 mb-4">Set a target for this week</p>

            <form onSubmit={handleAddGoal} className="space-y-3.5">
              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">
                  Goal Title *
                </label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Read 5 scientific papers"
                  value={goalTitle}
                  onChange={(e) => setGoalTitle(e.target.value)}
                  className="w-full px-3 py-2 text-xs rounded-xl bg-slate-50 border border-slate-200 focus:bg-white focus:outline-none focus:border-purple-500"
                />
              </div>

              <div className="grid grid-cols-2 gap-2">
                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">Category</label>
                  <select
                    value={goalCategory}
                    onChange={(e) => setGoalCategory(e.target.value as WeeklyGoal['category'])}
                    className="w-full px-3 py-2 text-xs rounded-xl bg-slate-50 border border-slate-200 focus:bg-white focus:outline-none focus:border-purple-500"
                  >
                    <option value="academic">Academic</option>
                    <option value="wellness">Wellness</option>
                    <option value="sleep">Sleep</option>
                    <option value="digital">Digital</option>
                  </select>
                </div>
                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">Target</label>
                  <input
                    type="number"
                    min="1"
                    value={goalTarget}
                    onChange={(e) => setGoalTarget(Number(e.target.value))}
                    className="w-full px-3 py-2 text-xs rounded-xl bg-slate-50 border border-slate-200 focus:bg-white focus:outline-none focus:border-purple-500"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">Unit</label>
                <input
                  type="text"
                  placeholder="e.g. hours, sessions, days, papers"
                  value={goalUnit}
                  onChange={(e) => setGoalUnit(e.target.value)}
                  className="w-full px-3 py-2 text-xs rounded-xl bg-slate-50 border border-slate-200 focus:bg-white focus:outline-none focus:border-purple-500"
                />
              </div>

              <div className="flex gap-2 pt-2">
                <button
                  type="button"
                  onClick={() => setShowAddGoalModal(false)}
                  className="flex-1 py-2.5 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-700 font-semibold text-xs transition cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="flex-1 py-2.5 rounded-xl bg-purple-600 hover:bg-purple-700 text-white font-bold text-xs shadow transition cursor-pointer"
                >
                  Save Goal
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
