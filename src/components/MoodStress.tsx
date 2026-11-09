import React, { useState, useEffect, useRef } from 'react';
import {
  Smile,
  Wind,
  Plus,
  Calendar,
  Sparkles,
  Play,
  Pause,
  RotateCcw,
  Volume2,
  VolumeX,
  Tag,
  CheckCircle2,
  Heart,
  ChevronRight
} from 'lucide-react';
import { MoodEntry, MoodType } from '../types';
import { soundFx } from '../utils/audio';

interface Props {
  moods: MoodEntry[];
  onMoodsChange: (moods: MoodEntry[]) => void;
}

const moodOptions: { type: MoodType; emoji: string; label: string; color: string }[] = [
  { type: 'ecstatic', emoji: '🌟', label: 'Ecstatic', color: 'bg-amber-100 text-amber-800 border-amber-300' },
  { type: 'happy', emoji: '😊', label: 'Happy', color: 'bg-emerald-100 text-emerald-800 border-emerald-300' },
  { type: 'calm', emoji: '🌿', label: 'Calm', color: 'bg-teal-100 text-teal-800 border-teal-300' },
  { type: 'tired', emoji: '😴', label: 'Tired', color: 'bg-indigo-100 text-indigo-800 border-indigo-300' },
  { type: 'stressed', emoji: '⚡', label: 'Stressed', color: 'bg-purple-100 text-purple-800 border-purple-300' },
  { type: 'anxious', emoji: '🌧️', label: 'Anxious', color: 'bg-blue-100 text-blue-800 border-blue-300' },
];

const studentTags = [
  'Exam Prep',
  'Assignment Done',
  'Good Sleep',
  'Late Study',
  'Campus Walk',
  'Group Project',
  'Coffee',
  'Gym/Workout',
  'Homesick',
  'Social Time',
  'Quiet Library',
  'Lecture Day',
];

interface BreathingPattern {
  name: string;
  description: string;
  phases: { name: string; seconds: number; instruction: string; scale: number }[];
}

const breathingPatterns: Record<string, BreathingPattern> = {
  box: {
    name: 'Box Breathing (4-4-4-4)',
    description: 'Used by high performers to calm the nervous system before exams.',
    phases: [
      { name: 'Inhale', seconds: 4, instruction: 'Breathe in slowly through your nose...', scale: 1.3 },
      { name: 'Hold', seconds: 4, instruction: 'Hold breath gently, keep shoulders relaxed...', scale: 1.3 },
      { name: 'Exhale', seconds: 4, instruction: 'Exhale smoothly through your mouth...', scale: 0.8 },
      { name: 'Hold', seconds: 4, instruction: 'Rest in empty stillness...', scale: 0.8 },
    ],
  },
  relax: {
    name: '4-7-8 Deep Relaxation',
    description: 'Vagus nerve stimulation for acute stress and bedtime transition.',
    phases: [
      { name: 'Inhale', seconds: 4, instruction: 'Inhale quietly through your nose...', scale: 1.35 },
      { name: 'Hold', seconds: 7, instruction: 'Hold breath softly without straining...', scale: 1.35 },
      { name: 'Exhale', seconds: 8, instruction: 'Exhale completely with a gentle whoosh...', scale: 0.75 },
    ],
  },
  coherent: {
    name: 'Resonant Coherence (5-5)',
    description: 'Synchronizes heart rate variability and mental clarity.',
    phases: [
      { name: 'Inhale', seconds: 5, instruction: 'Slow expansive breath into your abdomen...', scale: 1.25 },
      { name: 'Exhale', seconds: 5, instruction: 'Gentle releasing breath outward...', scale: 0.85 },
    ],
  },
};

export const MoodStress: React.FC<Props> = ({ moods, onMoodsChange }) => {
  const [activeSubTab, setActiveSubTab] = useState<'journal' | 'breathing'>('journal');

  // Mood form state
  const [selectedMood, setSelectedMood] = useState<MoodType>('calm');
  const [energyLevel, setEnergyLevel] = useState(3);
  const [selectedTags, setSelectedTags] = useState<string[]>(['Good Sleep']);
  const [journalNote, setJournalNote] = useState('');
  const [showSavedToast, setShowSavedToast] = useState(false);

  // Breathing state
  const [selectedPatternKey, setSelectedPatternKey] = useState<string>('box');
  const [isBreathingRunning, setIsBreathingRunning] = useState(false);
  const [currentPhaseIndex, setCurrentPhaseIndex] = useState(0);
  const [phaseSecondsLeft, setPhaseSecondsLeft] = useState(4);
  const [completedCycles, setCompletedCycles] = useState(0);
  const [chimeEnabled, setChimeEnabled] = useState(true);

  const pattern = breathingPatterns[selectedPatternKey];
  const currentPhase = pattern.phases[currentPhaseIndex];

  // Breathing loop
  useEffect(() => {
    let interval: NodeJS.Timeout | null = null;
    if (isBreathingRunning) {
      interval = setInterval(() => {
        setPhaseSecondsLeft((prev) => {
          if (prev <= 1) {
            // Move to next phase
            const nextIndex = (currentPhaseIndex + 1) % pattern.phases.length;
            if (nextIndex === 0) {
              setCompletedCycles((c) => c + 1);
            }
            setCurrentPhaseIndex(nextIndex);
            const nextDuration = pattern.phases[nextIndex].seconds;

            if (chimeEnabled) {
              soundFx.playChime(nextIndex === 0 ? 587 : 440);
            }
            if (typeof navigator !== 'undefined' && navigator.vibrate) {
              navigator.vibrate(30);
            }

            return nextDuration;
          }
          return prev - 1;
        });
      }, 1000);
    } else {
      if (interval) clearInterval(interval);
    }

    return () => {
      if (interval) clearInterval(interval);
    };
  }, [isBreathingRunning, currentPhaseIndex, pattern, chimeEnabled]);

  const startBreathing = () => {
    soundFx.playTap();
    setIsBreathingRunning(true);
    setCurrentPhaseIndex(0);
    setPhaseSecondsLeft(pattern.phases[0].seconds);
  };

  const pauseBreathing = () => {
    soundFx.playTap();
    setIsBreathingRunning(false);
  };

  const resetBreathing = () => {
    soundFx.playTap();
    setIsBreathingRunning(false);
    setCurrentPhaseIndex(0);
    setPhaseSecondsLeft(pattern.phases[0].seconds);
    setCompletedCycles(0);
  };

  const handlePatternChange = (key: string) => {
    soundFx.playTap();
    setSelectedPatternKey(key);
    setIsBreathingRunning(false);
    setCurrentPhaseIndex(0);
    setPhaseSecondsLeft(breathingPatterns[key].phases[0].seconds);
  };

  // Tag toggle
  const toggleTag = (tag: string) => {
    soundFx.playTap();
    if (selectedTags.includes(tag)) {
      setSelectedTags(selectedTags.filter((t) => t !== tag));
    } else {
      setSelectedTags([...selectedTags, tag]);
    }
  };

  // Submit Mood Entry
  const handleSaveMood = (e: React.FormEvent) => {
    e.preventDefault();
    soundFx.playCelebration();

    const scoreMap: Record<MoodType, number> = {
      ecstatic: 5,
      happy: 5,
      calm: 4,
      tired: 3,
      stressed: 2,
      anxious: 1,
    };

    const newEntry: MoodEntry = {
      id: `mood-${Date.now()}`,
      timestamp: new Date().toISOString(),
      mood: selectedMood,
      score: scoreMap[selectedMood],
      energyLevel,
      tags: selectedTags,
      note: journalNote.trim(),
    };

    onMoodsChange([newEntry, ...moods]);
    setJournalNote('');
    setShowSavedToast(true);
    setTimeout(() => setShowSavedToast(false), 3000);
  };

  return (
    <div className="space-y-5 pb-8 animate-fadeIn">
      {/* Segmented Switcher */}
      <div className="flex rounded-2xl bg-slate-200/70 p-1 backdrop-blur-md">
        <button
          onClick={() => {
            soundFx.playTap();
            setActiveSubTab('journal');
          }}
          className={`flex-1 flex items-center justify-center gap-2 py-2.5 rounded-xl text-xs font-bold transition cursor-pointer ${
            activeSubTab === 'journal'
              ? 'bg-white text-purple-800 shadow-sm'
              : 'text-slate-600 hover:text-slate-900'
          }`}
        >
          <Smile className="w-4 h-4" />
          <span>Mood Journal</span>
        </button>
        <button
          onClick={() => {
            soundFx.playTap();
            setActiveSubTab('breathing');
          }}
          className={`flex-1 flex items-center justify-center gap-2 py-2.5 rounded-xl text-xs font-bold transition cursor-pointer ${
            activeSubTab === 'breathing'
              ? 'bg-white text-purple-800 shadow-sm'
              : 'text-slate-600 hover:text-slate-900'
          }`}
        >
          <Wind className="w-4 h-4" />
          <span>Guided Breathing</span>
        </button>
      </div>

      {/* MOOD JOURNAL VIEW */}
      {activeSubTab === 'journal' && (
        <div className="space-y-4">
          <div>
            <h2 className="text-xl font-extrabold text-slate-800">Mood & Reflection</h2>
            <p className="text-xs text-slate-500">
              Private check-in to track emotional energy and academic balance
            </p>
          </div>

          {/* New Mood Check-in Card */}
          <form
            onSubmit={handleSaveMood}
            className="rounded-3xl bg-white p-5 border border-purple-100 shadow-sm space-y-4"
          >
            <div>
              <label className="block text-xs font-bold text-slate-700 mb-2">
                How are you feeling right now?
              </label>
              <div className="grid grid-cols-3 gap-2">
                {moodOptions.map((opt) => (
                  <button
                    key={opt.type}
                    type="button"
                    onClick={() => {
                      soundFx.playTap();
                      setSelectedMood(opt.type);
                    }}
                    className={`flex items-center gap-2 p-2.5 rounded-xl border text-xs font-bold transition-all cursor-pointer ${
                      selectedMood === opt.type
                        ? `${opt.color} shadow-sm ring-2 ring-purple-400`
                        : 'bg-slate-50 border-slate-200 text-slate-600 hover:bg-slate-100'
                    }`}
                  >
                    <span className="text-xl">{opt.emoji}</span>
                    <span className="capitalize">{opt.label}</span>
                  </button>
                ))}
              </div>
            </div>

            {/* Energy Level Slider */}
            <div>
              <div className="flex justify-between items-center text-xs font-bold text-slate-700 mb-1">
                <span>Energy Level:</span>
                <span className="text-purple-600">{energyLevel} / 5</span>
              </div>
              <input
                type="range"
                min="1"
                max="5"
                value={energyLevel}
                onChange={(e) => setEnergyLevel(Number(e.target.value))}
                className="w-full accent-purple-600 cursor-pointer"
              />
              <div className="flex justify-between text-[10px] text-slate-400 font-semibold px-0.5">
                <span>Drained</span>
                <span>Moderate</span>
                <span>High Energy</span>
              </div>
            </div>

            {/* Context Tags */}
            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1.5 flex items-center gap-1">
                <Tag className="w-3.5 h-3.5 text-purple-500" />
                <span>What's impacting your mood? (Tags)</span>
              </label>
              <div className="flex flex-wrap gap-1.5">
                {studentTags.map((t) => {
                  const isSelected = selectedTags.includes(t);
                  return (
                    <button
                      key={t}
                      type="button"
                      onClick={() => toggleTag(t)}
                      className={`text-xs px-2.5 py-1 rounded-lg font-semibold transition cursor-pointer ${
                        isSelected
                          ? 'bg-purple-600 text-white'
                          : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
                      }`}
                    >
                      {t}
                    </button>
                  );
                })}
              </div>
            </div>

            {/* Private Notes */}
            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1">
                Private Journal Note (Optional)
              </label>
              <textarea
                rows={2}
                placeholder="What went well today? What's on your mind? (Stored only on your device)"
                value={journalNote}
                onChange={(e) => setJournalNote(e.target.value)}
                className="w-full px-3 py-2 text-xs rounded-xl bg-slate-50 border border-slate-200 focus:bg-white focus:outline-none focus:border-purple-500"
              />
            </div>

            <button
              type="submit"
              className="w-full py-2.5 rounded-xl bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-700 hover:to-indigo-700 text-white font-bold text-xs shadow-md active:scale-95 transition cursor-pointer"
            >
              Save Mood Check-in
            </button>
          </form>

          {showSavedToast && (
            <div className="flex items-center gap-2 p-3 rounded-2xl bg-emerald-50 text-emerald-800 border border-emerald-200 text-xs font-semibold animate-fadeIn">
              <CheckCircle2 className="w-4 h-4 text-emerald-600" />
              <span>Mood saved to your local private journal!</span>
            </div>
          )}

          {/* Recent Mood History */}
          <div className="space-y-2.5">
            <h3 className="text-xs font-bold uppercase tracking-wider text-slate-400">
              Recent Mood Log Entries
            </h3>
            {moods.map((entry) => (
              <div
                key={entry.id}
                className="p-4 rounded-2xl bg-white border border-slate-100 shadow-sm"
              >
                <div className="flex items-start justify-between gap-2">
                  <div className="flex items-center gap-2.5">
                    <span className="text-2xl">
                      {moodOptions.find((m) => m.type === entry.mood)?.emoji || '✨'}
                    </span>
                    <div>
                      <h4 className="text-xs font-bold text-slate-800 capitalize">
                        {entry.mood} • Energy {entry.energyLevel}/5
                      </h4>
                      <p className="text-[10px] text-slate-400 flex items-center gap-1 mt-0.5">
                        <Calendar className="w-3 h-3" />
                        {new Date(entry.timestamp).toLocaleDateString('en-US', {
                          month: 'short',
                          day: 'numeric',
                          hour: '2-digit',
                          minute: '2-digit',
                        })}
                      </p>
                    </div>
                  </div>
                  <span className="text-[11px] font-bold px-2 py-0.5 rounded-full bg-purple-50 text-purple-700">
                    {entry.score}/5 Score
                  </span>
                </div>

                {entry.note && (
                  <p className="mt-2.5 text-xs text-slate-600 bg-slate-50 p-2.5 rounded-xl italic">
                    "{entry.note}"
                  </p>
                )}

                {entry.tags.length > 0 && (
                  <div className="flex flex-wrap gap-1 mt-2.5">
                    {entry.tags.map((tag) => (
                      <span
                        key={tag}
                        className="text-[10px] font-semibold text-slate-500 bg-slate-100 px-2 py-0.5 rounded-md"
                      >
                        #{tag}
                      </span>
                    ))}
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>
      )}

      {/* GUIDED BREATHING VIEW */}
      {activeSubTab === 'breathing' && (
        <div className="space-y-4">
          <div className="text-center">
            <h2 className="text-xl font-extrabold text-slate-800">Guided Breathing</h2>
            <p className="text-xs text-slate-500">
              Synchronize your breath to reduce cortisol and increase focus
            </p>
          </div>

          {/* Pattern Selection Cards */}
          <div className="grid grid-cols-3 gap-2">
            {Object.entries(breathingPatterns).map(([k, p]) => (
              <button
                key={k}
                onClick={() => handlePatternChange(k)}
                className={`p-2.5 rounded-2xl border text-left transition cursor-pointer ${
                  selectedPatternKey === k
                    ? 'bg-purple-50 border-purple-300 ring-2 ring-purple-400/50'
                    : 'bg-white border-slate-100 hover:bg-slate-50'
                }`}
              >
                <h4 className="text-xs font-bold text-slate-800 truncate">{p.name.split(' ')[0]}</h4>
                <p className="text-[10px] text-slate-400 mt-0.5 line-clamp-2">{p.description}</p>
              </button>
            ))}
          </div>

          {/* Interactive Breathing Sphere */}
          <div className="relative overflow-hidden rounded-3xl bg-gradient-to-b from-purple-900 via-indigo-900 to-slate-900 p-8 text-white text-center shadow-xl">
            {/* Ambient stars/glow */}
            <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,rgba(168,85,247,0.15),transparent_70%)] pointer-events-none" />

            {/* Instruction prompt */}
            <div className="relative z-10 mb-4 min-h-[48px]">
              <span className="text-xs uppercase font-extrabold tracking-widest text-purple-300">
                {currentPhase.name}
              </span>
              <p className="text-sm font-semibold text-purple-100 mt-1">
                {currentPhase.instruction}
              </p>
            </div>

            {/* Pulsing Breathing Circle */}
            <div className="relative my-6 flex items-center justify-center w-52 h-52 mx-auto">
              {/* Outer halo */}
              <div
                className="absolute inset-0 rounded-full bg-purple-500/20 blur-xl transition-transform duration-1000 ease-in-out"
                style={{
                  transform: `scale(${currentPhase.scale * 1.2})`,
                }}
              />

              {/* Middle animated ring */}
              <div
                className="absolute w-44 h-44 rounded-full border-2 border-dashed border-purple-300/40 transition-transform duration-1000 ease-in-out"
                style={{
                  transform: `scale(${currentPhase.scale})`,
                }}
              />

              {/* Central Glowing Orb */}
              <div
                className="relative w-36 h-36 rounded-full bg-gradient-to-tr from-purple-500 via-indigo-400 to-amber-200 flex flex-col items-center justify-center shadow-2xl transition-transform duration-1000 ease-in-out"
                style={{
                  transform: `scale(${currentPhase.scale})`,
                }}
              >
                <span className="text-3xl font-extrabold text-white font-mono drop-shadow">
                  {phaseSecondsLeft}s
                </span>
                <span className="text-[11px] font-bold text-purple-950 uppercase tracking-wide">
                  {currentPhase.name}
                </span>
              </div>
            </div>

            {/* Cycle stats */}
            <div className="relative z-10 flex items-center justify-center gap-4 text-xs text-purple-200 mt-2">
              <span>Completed Cycles: <strong>{completedCycles}</strong></span>
              <span>•</span>
              <button
                onClick={() => setChimeEnabled((p) => !p)}
                className="flex items-center gap-1 hover:text-white transition cursor-pointer"
              >
                {chimeEnabled ? <Volume2 className="w-3.5 h-3.5" /> : <VolumeX className="w-3.5 h-3.5" />}
                <span>{chimeEnabled ? 'Chime On' : 'Chime Off'}</span>
              </button>
            </div>

            {/* Breathing Controls */}
            <div className="relative z-10 mt-6 flex items-center justify-center gap-3">
              <button
                onClick={resetBreathing}
                className="p-3 rounded-2xl bg-white/10 hover:bg-white/20 text-white transition active:scale-95 cursor-pointer"
                title="Reset Session"
              >
                <RotateCcw className="w-4 h-4" />
              </button>

              <button
                onClick={isBreathingRunning ? pauseBreathing : startBreathing}
                className="flex items-center gap-2 px-6 py-3 rounded-2xl bg-gradient-to-r from-purple-500 to-indigo-500 hover:from-purple-600 hover:to-indigo-600 text-white font-bold text-xs shadow-lg active:scale-95 transition cursor-pointer"
              >
                {isBreathingRunning ? (
                  <>
                    <Pause className="w-4 h-4 fill-white" />
                    <span>Pause Exercise</span>
                  </>
                ) : (
                  <>
                    <Play className="w-4 h-4 fill-white" />
                    <span>Begin Breathing</span>
                  </>
                )}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
