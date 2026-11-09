import React, { useState, useEffect } from 'react';
import {
  Smartphone,
  Moon,
  Clock,
  Sparkles,
  CheckCircle2,
  Circle,
  Plus,
  Minus,
  ShieldAlert,
  Flame,
  Award,
  Calendar,
  Star,
  Info,
  Timer,
  CloudRain,
  Waves,
  Radio,
  Wind,
  Droplets,
  Bell,
  Volume2,
  VolumeX,
  Play,
  Square
} from 'lucide-react';
import {
  ScreenTimeLog,
  DigitalHabit,
  SleepLog,
  UserProfile
} from '../types';
import { defaultWindDownItems } from '../utils/storage';
import { soundFx } from '../utils/audio';

interface Props {
  profile: UserProfile;
  screenTime: ScreenTimeLog;
  onScreenTimeChange: (screenTime: ScreenTimeLog) => void;
  habits: DigitalHabit[];
  onHabitsChange: (habits: DigitalHabit[]) => void;
  sleepLogs: SleepLog[];
  onSleepLogsChange: (sleepLogs: SleepLog[]) => void;
}

export const DigitalBalanceSleep: React.FC<Props> = ({
  profile,
  screenTime,
  onScreenTimeChange,
  habits,
  onHabitsChange,
  sleepLogs,
  onSleepLogsChange,
}) => {
  const [activeSubTab, setActiveSubTab] = useState<'digital' | 'sleep'>('digital');

  // Sleep Logging State
  const [showLogSleepModal, setShowLogSleepModal] = useState(false);
  const [bedtimeInput, setBedtimeInput] = useState('23:15');
  const [wakeTimeInput, setWakeTimeInput] = useState('07:30');
  const [sleepQuality, setSleepQuality] = useState(4);
  const [sleepNotes, setSleepNotes] = useState('');
  const [windDownCompleted, setWindDownCompleted] = useState<string[]>(['w1', 'w2']);

  // Sound Engine State: Rain, Ocean Waves, Brown Noise, Stream, Forest, Bowl with Sleep Timer
  const [activeSound, setActiveSound] = useState<'off' | 'rain' | 'ocean' | 'brown' | 'stream' | 'forest' | 'bowl'>('off');
  const [sleepTimerMinutes, setSleepTimerMinutes] = useState<number>(0);
  const [sleepTimerSecondsLeft, setSleepTimerSecondsLeft] = useState<number>(0);

  // Sync sleep timer ticker
  useEffect(() => {
    return () => {
      // Don't kill audio on unmount if timer is running, but keep state clean
    };
  }, []);

  const latestSleep = sleepLogs[0];

  const totalRecreational =
    screenTime.hours.socialMedia +
    screenTime.hours.videoStreaming +
    screenTime.hours.gaming;
  const totalScreenTime = totalRecreational + screenTime.hours.studyWork + screenTime.hours.messaging;

  const adjustHour = (category: keyof ScreenTimeLog['hours'], delta: number) => {
    soundFx.playTap();
    const current = screenTime.hours[category];
    const updated = Math.max(0, Math.min(16, Number((current + delta).toFixed(1))));
    const newLog: ScreenTimeLog = {
      ...screenTime,
      hours: {
        ...screenTime.hours,
        [category]: updated,
      },
    };
    onScreenTimeChange(newLog);
  };

  const toggleHabit = (id: string) => {
    const updated = habits.map((h) => {
      if (h.id === id) {
        const next = !h.completed;
        if (next) soundFx.playCelebration();
        return { ...h, completed: next };
      }
      return h;
    });
    onHabitsChange(updated);
  };

  const toggleWindDownItem = (id: string) => {
    soundFx.playTap();
    if (windDownCompleted.includes(id)) {
      setWindDownCompleted(windDownCompleted.filter((item) => item !== id));
    } else {
      setWindDownCompleted([...windDownCompleted, id]);
    }
  };

  // Sound Engine Controls
  const handleSelectSound = (type: 'off' | 'rain' | 'ocean' | 'brown' | 'stream' | 'forest' | 'bowl') => {
    soundFx.playTap();
    setActiveSound(type);
    if (type === 'off') {
      soundFx.stopAmbient();
      setSleepTimerSecondsLeft(0);
      setSleepTimerMinutes(0);
    } else {
      soundFx.startAmbient(type);
      if (sleepTimerMinutes > 0) {
        soundFx.setSleepTimer(sleepTimerMinutes, (sec) => setSleepTimerSecondsLeft(sec));
      }
    }
  };

  const handleSetSleepTimer = (mins: number) => {
    soundFx.playTap();
    setSleepTimerMinutes(mins);
    if (mins === 0) {
      soundFx.clearSleepTimer();
      setSleepTimerSecondsLeft(0);
    } else {
      soundFx.setSleepTimer(mins, (sec) => setSleepTimerSecondsLeft(sec));
    }
  };

  // Save Sleep Entry
  const handleSaveSleep = (e: React.FormEvent) => {
    e.preventDefault();
    soundFx.playCelebration();

    const [bH, bM] = bedtimeInput.split(':').map(Number);
    const [wH, wM] = wakeTimeInput.split(':').map(Number);

    let startMinutes = bH * 60 + bM;
    let endMinutes = wH * 60 + wM;
    if (endMinutes < startMinutes) {
      endMinutes += 24 * 60;
    }
    const diffHours = Number(((endMinutes - startMinutes) / 60).toFixed(2));

    const newLog: SleepLog = {
      id: `sleep-${Date.now()}`,
      date: new Date().toISOString().split('T')[0],
      bedtime: bedtimeInput,
      wakeTime: wakeTimeInput,
      totalHours: diffHours || 8.0,
      quality: sleepQuality,
      notes: sleepNotes.trim(),
      windDownCompleted,
    };

    onSleepLogsChange([newLog, ...sleepLogs]);
    setShowLogSleepModal(false);
    setSleepNotes('');
  };

  const formatTimerClock = (seconds: number) => {
    const m = Math.floor(seconds / 60);
    const s = seconds % 60;
    return `${m}:${s.toString().padStart(2, '0')}`;
  };

  return (
    <div className="space-y-5 pb-8 animate-fadeIn">
      {/* Top Segmented Navigation */}
      <div className="flex rounded-2xl bg-slate-200/70 p-1 backdrop-blur-md">
        <button
          onClick={() => {
            soundFx.playTap();
            setActiveSubTab('digital');
          }}
          className={`flex-1 flex items-center justify-center gap-2 py-2.5 rounded-xl text-xs font-bold transition cursor-pointer ${
            activeSubTab === 'digital'
              ? 'bg-white text-purple-800 shadow-sm'
              : 'text-slate-600 hover:text-slate-900'
          }`}
        >
          <Smartphone className="w-4 h-4" />
          <span>Screen-Time & Habits</span>
        </button>
        <button
          onClick={() => {
            soundFx.playTap();
            setActiveSubTab('sleep');
          }}
          className={`flex-1 flex items-center justify-center gap-2 py-2.5 rounded-xl text-xs font-bold transition cursor-pointer ${
            activeSubTab === 'sleep'
              ? 'bg-white text-purple-800 shadow-sm'
              : 'text-slate-600 hover:text-slate-900'
          }`}
        >
          <Moon className="w-4 h-4" />
          <span>Sleep & Sound Engine</span>
        </button>
      </div>

      {/* DIGITAL BALANCE & SCREEN-TIME VIEW (Ideas #1 & #2 - Selected Features #1 & #2) */}
      {activeSubTab === 'digital' && (
        <div className="space-y-4">
          <div>
            <h2 className="text-xl font-extrabold text-slate-800 flex items-center gap-2">
              <span>Smart Screen-Time Manager</span>
              <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-blue-100 text-blue-700">
                Screen Habit Tracker
              </span>
            </h2>
            <p className="text-xs text-slate-500">
              Conscious manual screen-time logging & daily app-use boundaries
            </p>
          </div>

          {/* Privacy & Transparency Notice */}
          <div className="rounded-2xl bg-blue-50/80 p-3.5 border border-blue-100 flex items-start gap-2.5 text-xs text-blue-900">
            <Info className="w-4 h-4 text-blue-600 shrink-0 mt-0.5" />
            <p className="text-[11px] leading-relaxed">
              <strong>Ethical & Private by Design:</strong> LifeSync does not monitor your device's
              background applications or phone activity. You manually record your daily estimates to
              foster genuine mindful digital self-regulation.
            </p>
          </div>

          {/* Daily Screen Ratio Card */}
          <div className="rounded-3xl bg-white p-5 border border-purple-100 shadow-sm space-y-3">
            <div className="flex items-center justify-between">
              <div>
                <span className="text-xs uppercase font-bold text-slate-400">
                  Total Logged Today
                </span>
                <div className="text-2xl font-extrabold text-slate-800 mt-0.5">
                  {totalScreenTime.toFixed(1)} hrs
                </div>
              </div>
              <div className="text-right">
                <span className="text-xs uppercase font-bold text-slate-400">
                  Mindful Streak
                </span>
                <div className="flex items-center gap-1 text-sm font-bold text-amber-500 justify-end mt-0.5">
                  <Flame className="w-4 h-4 fill-amber-500" />
                  <span>{screenTime.phoneFreeStreak} Days</span>
                </div>
              </div>
            </div>

            {/* Split bar: Study vs Recreational */}
            <div className="space-y-1.5">
              <div className="h-3 rounded-full bg-slate-100 flex overflow-hidden">
                <div
                  className="bg-purple-600 h-full transition-all"
                  style={{
                    width: `${
                      totalScreenTime > 0
                        ? (screenTime.hours.studyWork / totalScreenTime) * 100
                        : 50
                    }%`,
                  }}
                  title="Study Work"
                />
                <div
                  className="bg-amber-400 h-full transition-all"
                  style={{
                    width: `${
                      totalScreenTime > 0
                        ? (totalRecreational / totalScreenTime) * 100
                        : 50
                    }%`,
                  }}
                  title="Recreation / Social"
                />
              </div>

              <div className="flex justify-between text-[11px] font-semibold">
                <span className="text-purple-700 flex items-center gap-1">
                  <span className="w-2 h-2 rounded-full bg-purple-600" />
                  Study & Research: {screenTime.hours.studyWork.toFixed(1)}h
                </span>
                <span className="text-amber-700 flex items-center gap-1">
                  <span className="w-2 h-2 rounded-full bg-amber-400" />
                  Recreational: {totalRecreational.toFixed(1)}h
                </span>
              </div>
            </div>
          </div>

          {/* Manual Category Loggers */}
          <div className="rounded-3xl bg-white p-5 border border-purple-100 shadow-sm space-y-3">
            <h3 className="text-xs font-bold uppercase tracking-wider text-slate-400 mb-1">
              Manual Category Entries (No Background Tracking)
            </h3>

            <div className="space-y-2.5">
              {/* Study Work */}
              <div className="flex items-center justify-between p-3 rounded-2xl bg-purple-50/60 border border-purple-100">
                <div>
                  <h4 className="text-xs font-bold text-slate-800">Study, Reading & Research</h4>
                  <p className="text-[10px] text-slate-500">Lectures, research, problem sets</p>
                </div>
                <div className="flex items-center gap-2">
                  <button
                    onClick={() => adjustHour('studyWork', -0.5)}
                    className="p-1.5 rounded-lg bg-white border border-purple-200 text-purple-700 hover:bg-purple-100 cursor-pointer"
                  >
                    <Minus className="w-3.5 h-3.5" />
                  </button>
                  <span className="w-10 text-center font-bold text-xs text-purple-900">
                    {screenTime.hours.studyWork.toFixed(1)}h
                  </span>
                  <button
                    onClick={() => adjustHour('studyWork', 0.5)}
                    className="p-1.5 rounded-lg bg-white border border-purple-200 text-purple-700 hover:bg-purple-100 cursor-pointer"
                  >
                    <Plus className="w-3.5 h-3.5" />
                  </button>
                </div>
              </div>

              {/* Social Media */}
              <div className="flex items-center justify-between p-3 rounded-2xl bg-amber-50/60 border border-amber-100">
                <div>
                  <h4 className="text-xs font-bold text-slate-800">Social Media Scrolling</h4>
                  <p className="text-[10px] text-slate-500">Instagram, TikTok, Twitter, Reddit</p>
                </div>
                <div className="flex items-center gap-2">
                  <button
                    onClick={() => adjustHour('socialMedia', -0.5)}
                    className="p-1.5 rounded-lg bg-white border border-amber-200 text-amber-700 hover:bg-amber-100 cursor-pointer"
                  >
                    <Minus className="w-3.5 h-3.5" />
                  </button>
                  <span className="w-10 text-center font-bold text-xs text-amber-900">
                    {screenTime.hours.socialMedia.toFixed(1)}h
                  </span>
                  <button
                    onClick={() => adjustHour('socialMedia', 0.5)}
                    className="p-1.5 rounded-lg bg-white border border-amber-200 text-amber-700 hover:bg-amber-100 cursor-pointer"
                  >
                    <Plus className="w-3.5 h-3.5" />
                  </button>
                </div>
              </div>

              {/* Video Streaming */}
              <div className="flex items-center justify-between p-3 rounded-2xl bg-slate-50 border border-slate-100">
                <div>
                  <h4 className="text-xs font-bold text-slate-800">Video & Streaming</h4>
                  <p className="text-[10px] text-slate-500">YouTube, Netflix, Twitch</p>
                </div>
                <div className="flex items-center gap-2">
                  <button
                    onClick={() => adjustHour('videoStreaming', -0.5)}
                    className="p-1.5 rounded-lg bg-white border border-slate-200 text-slate-600 hover:bg-slate-100 cursor-pointer"
                  >
                    <Minus className="w-3.5 h-3.5" />
                  </button>
                  <span className="w-10 text-center font-bold text-xs text-slate-800">
                    {screenTime.hours.videoStreaming.toFixed(1)}h
                  </span>
                  <button
                    onClick={() => adjustHour('videoStreaming', 0.5)}
                    className="p-1.5 rounded-lg bg-white border border-slate-200 text-slate-600 hover:bg-slate-100 cursor-pointer"
                  >
                    <Plus className="w-3.5 h-3.5" />
                  </button>
                </div>
              </div>

              {/* Messaging & Calls */}
              <div className="flex items-center justify-between p-3 rounded-2xl bg-slate-50 border border-slate-100">
                <div>
                  <h4 className="text-xs font-bold text-slate-800">Messaging & Chats</h4>
                  <p className="text-[10px] text-slate-500">WhatsApp, Discord, Texts</p>
                </div>
                <div className="flex items-center gap-2">
                  <button
                    onClick={() => adjustHour('messaging', -0.5)}
                    className="p-1.5 rounded-lg bg-white border border-slate-200 text-slate-600 hover:bg-slate-100 cursor-pointer"
                  >
                    <Minus className="w-3.5 h-3.5" />
                  </button>
                  <span className="w-10 text-center font-bold text-xs text-slate-800">
                    {screenTime.hours.messaging.toFixed(1)}h
                  </span>
                  <button
                    onClick={() => adjustHour('messaging', 0.5)}
                    className="p-1.5 rounded-lg bg-white border border-slate-200 text-slate-600 hover:bg-slate-100 cursor-pointer"
                  >
                    <Plus className="w-3.5 h-3.5" />
                  </button>
                </div>
              </div>
            </div>
          </div>

          {/* DIGITAL BALANCE CHALLENGE (Idea #2 - Selected Feature #2) */}
          <div className="rounded-3xl bg-white p-5 border border-purple-100 shadow-sm space-y-3">
            <div className="flex items-center justify-between">
              <div>
                <h3 className="text-xs font-bold uppercase tracking-wider text-slate-700 flex items-center gap-1.5">
                  <Sparkles className="w-3.5 h-3.5 text-purple-600" />
                  <span>Digital Balance Challenge</span>
                  <span className="text-[9px] font-bold px-1.5 py-0.5 rounded-full bg-purple-100 text-purple-700">
                    Daily Micro-Goals
                  </span>
                </h3>
                <p className="text-[11px] text-slate-400">
                  Optional, pressure-free daily challenges to curb unnecessary phone use
                </p>
              </div>
            </div>

            <div className="space-y-2">
              {habits.map((habit) => (
                <div
                  key={habit.id}
                  onClick={() => toggleHabit(habit.id)}
                  className={`flex items-start gap-3 p-3 rounded-2xl border transition-all cursor-pointer ${
                    habit.completed
                      ? 'bg-purple-50/60 border-purple-200 text-purple-900'
                      : 'bg-white border-slate-100 hover:bg-slate-50 text-slate-700'
                  }`}
                >
                  <button className="mt-0.5 text-purple-600 cursor-pointer">
                    {habit.completed ? (
                      <CheckCircle2 className="w-5 h-5 text-purple-600" />
                    ) : (
                      <Circle className="w-5 h-5 text-slate-300" />
                    )}
                  </button>
                  <div className="flex-1 min-w-0">
                    <h4 className="text-xs font-bold">{habit.title}</h4>
                    <p className="text-[11px] text-slate-500 mt-0.5 leading-snug">
                      {habit.description}
                    </p>
                    <span className="inline-block mt-1 text-[10px] font-semibold text-purple-700 bg-purple-100 px-2 py-0.5 rounded">
                      Target: {habit.target}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* HEALTHY SLEEP AND SOUND ENGINE VIEW (Idea #5 - Selected Feature #5) */}
      {activeSubTab === 'sleep' && (
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <div>
              <h2 className="text-xl font-extrabold text-slate-800 flex items-center gap-2">
                <span>Healthy Sleep and Sound Engine</span>
                <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-indigo-100 text-indigo-700">
                  Audio & Sleep Timer
                </span>
              </h2>
              <p className="text-xs text-slate-500">
                Bedtime routine, soothing sounds & automatic sleep timer
              </p>
            </div>
            <button
              onClick={() => {
                soundFx.playTap();
                setShowLogSleepModal(true);
              }}
              className="flex items-center gap-1.5 px-3.5 py-2 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white font-bold text-xs shadow hover:shadow-md transition active:scale-95 cursor-pointer"
            >
              <Plus className="w-4 h-4" />
              <span>Log Sleep</span>
            </button>
          </div>

          {/* Sound Engine Controller Card (Rain, Ocean Waves, Brown Noise + Sleep Timer) */}
          <div className="rounded-3xl bg-gradient-to-br from-indigo-900 via-purple-900 to-slate-900 p-5 text-white shadow-xl space-y-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <div className="w-10 h-10 rounded-2xl bg-white/15 backdrop-blur-md flex items-center justify-center">
                  <Waves className="w-5 h-5 text-amber-300" />
                </div>
                <div>
                  <h3 className="font-extrabold text-sm">Soothing Sound Engine</h3>
                  <p className="text-[11px] text-indigo-200">
                    {activeSound === 'off' ? 'Sound Engine Silent' : `Playing: ${activeSound}`}
                  </p>
                </div>
              </div>
              {sleepTimerSecondsLeft > 0 && (
                <div className="flex items-center gap-1 text-xs font-mono font-bold bg-amber-400 text-purple-950 px-2.5 py-1 rounded-full shadow-sm animate-pulse">
                  <Timer className="w-3.5 h-3.5" />
                  <span>{formatTimerClock(sleepTimerSecondsLeft)}</span>
                </div>
              )}
            </div>

            {/* Sound Selector Buttons: Rain, Ocean Waves, Brown Noise, Stream, Forest, Bowl, Silent */}
            <div className="grid grid-cols-3 sm:grid-cols-4 gap-2">
              <button
                onClick={() => handleSelectSound('off')}
                className={`py-2 px-1 rounded-xl text-xs font-bold text-center transition cursor-pointer flex flex-col items-center justify-center gap-1 ${
                  activeSound === 'off'
                    ? 'bg-white text-purple-900 shadow-md font-extrabold'
                    : 'bg-white/10 text-indigo-100 hover:bg-white/20'
                }`}
              >
                <VolumeX className="w-4 h-4" />
                <span>Mute / Silent</span>
              </button>
              <button
                onClick={() => handleSelectSound('rain')}
                className={`py-2 px-1 rounded-xl text-xs font-bold text-center flex flex-col items-center gap-1 transition cursor-pointer ${
                  activeSound === 'rain'
                    ? 'bg-white text-purple-900 shadow-md font-extrabold'
                    : 'bg-white/10 text-indigo-100 hover:bg-white/20'
                }`}
              >
                <CloudRain className="w-4 h-4" />
                <span>Gentle Rain</span>
              </button>
              <button
                onClick={() => handleSelectSound('ocean')}
                className={`py-2 px-1 rounded-xl text-xs font-bold text-center flex flex-col items-center gap-1 transition cursor-pointer ${
                  activeSound === 'ocean'
                    ? 'bg-white text-purple-900 shadow-md font-extrabold'
                    : 'bg-white/10 text-indigo-100 hover:bg-white/20'
                }`}
              >
                <Waves className="w-4 h-4" />
                <span>Ocean Waves</span>
              </button>
              <button
                onClick={() => handleSelectSound('brown')}
                className={`py-2 px-1 rounded-xl text-xs font-bold text-center flex flex-col items-center gap-1 transition cursor-pointer ${
                  activeSound === 'brown'
                    ? 'bg-white text-purple-900 shadow-md font-extrabold'
                    : 'bg-white/10 text-indigo-100 hover:bg-white/20'
                }`}
              >
                <Radio className="w-4 h-4" />
                <span>Brown Noise</span>
              </button>
              <button
                onClick={() => handleSelectSound('stream')}
                className={`py-2 px-1 rounded-xl text-xs font-bold text-center flex flex-col items-center gap-1 transition cursor-pointer ${
                  activeSound === 'stream'
                    ? 'bg-white text-purple-900 shadow-md font-extrabold'
                    : 'bg-white/10 text-indigo-100 hover:bg-white/20'
                }`}
              >
                <Droplets className="w-4 h-4" />
                <span>Forest Brook</span>
              </button>
              <button
                onClick={() => handleSelectSound('forest')}
                className={`py-2 px-1 rounded-xl text-xs font-bold text-center flex flex-col items-center gap-1 transition cursor-pointer ${
                  activeSound === 'forest'
                    ? 'bg-white text-purple-900 shadow-md font-extrabold'
                    : 'bg-white/10 text-indigo-100 hover:bg-white/20'
                }`}
              >
                <Wind className="w-4 h-4" />
                <span>Gentle Breeze</span>
              </button>
              <button
                onClick={() => handleSelectSound('bowl')}
                className={`py-2 px-1 rounded-xl text-xs font-bold text-center flex flex-col items-center gap-1 transition cursor-pointer col-span-3 sm:col-span-2 ${
                  activeSound === 'bowl'
                    ? 'bg-white text-purple-900 shadow-md font-extrabold'
                    : 'bg-white/10 text-indigo-100 hover:bg-white/20'
                }`}
              >
                <Bell className="w-4 h-4" />
                <span>528 Hz Singing Bowl</span>
              </button>
            </div>

            {/* Sleep Timer Preset Selector */}
            <div className="pt-2 border-t border-white/10 space-y-2">
              <div className="flex items-center justify-between text-xs text-indigo-200">
                <span className="flex items-center gap-1.5 font-semibold">
                  <Clock className="w-3.5 h-3.5 text-amber-300" />
                  Auto-Off Sleep Timer:
                </span>
                <span className="text-amber-300 font-bold">
                  {sleepTimerMinutes === 0 ? 'No Timer' : `${sleepTimerMinutes} Minutes`}
                </span>
              </div>

              <div className="grid grid-cols-5 gap-1.5">
                {[0, 15, 30, 45, 60].map((mins) => (
                  <button
                    key={mins}
                    onClick={() => handleSetSleepTimer(mins)}
                    className={`py-1.5 rounded-lg text-[11px] font-bold transition cursor-pointer ${
                      sleepTimerMinutes === mins
                        ? 'bg-amber-400 text-purple-950 font-extrabold'
                        : 'bg-white/10 text-indigo-200 hover:bg-white/20'
                    }`}
                  >
                    {mins === 0 ? 'Off' : `${mins}m`}
                  </button>
                ))}
              </div>
            </div>
          </div>

          {/* Sleep Target & Last Night Stats */}
          <div className="rounded-3xl bg-white p-5 border border-indigo-100 shadow-sm space-y-3">
            <div className="flex items-center justify-between">
              <div>
                <h3 className="font-bold text-sm text-slate-800">Last Night's Sleep</h3>
                <p className="text-xs text-slate-400">
                  {latestSleep?.bedtime || '23:15'} → {latestSleep?.wakeTime || '07:30'}
                </p>
              </div>
              <div className="text-right">
                <div className="text-2xl font-extrabold text-indigo-700">
                  {latestSleep?.totalHours || 8.0}h
                </div>
                <div className="text-xs text-slate-400">
                  Target: {profile.dailySleepTargetHours}h
                </div>
              </div>
            </div>

            <div className="flex items-center justify-between p-3 rounded-2xl bg-indigo-50/60 text-xs">
              <span className="text-slate-600 font-semibold">Quality Rating:</span>
              <span className="text-amber-500 font-bold tracking-widest">
                {'★'.repeat(latestSleep?.quality || 4)}
                <span className="text-slate-300">{'★'.repeat(5 - (latestSleep?.quality || 4))}</span>
              </span>
            </div>

            {latestSleep?.notes && (
              <p className="text-xs italic text-slate-600 bg-slate-50 p-2.5 rounded-xl border border-slate-100">
                "{latestSleep.notes}"
              </p>
            )}
          </div>

          {/* Evening Wind-Down Checklist */}
          <div className="rounded-3xl bg-white p-5 border border-indigo-100 shadow-sm space-y-3">
            <div className="flex items-center justify-between">
              <h3 className="text-xs font-bold uppercase tracking-wider text-slate-400">
                Evening Bedtime Routine Checklist
              </h3>
              <span className="text-xs font-semibold text-indigo-600">
                {windDownCompleted.length} / {defaultWindDownItems.length} Done
              </span>
            </div>

            <div className="space-y-2">
              {defaultWindDownItems.map((item) => {
                const isDone = windDownCompleted.includes(item.id);
                return (
                  <div
                    key={item.id}
                    onClick={() => toggleWindDownItem(item.id)}
                    className={`flex items-start gap-3 p-3 rounded-2xl border transition-all cursor-pointer ${
                      isDone
                        ? 'bg-indigo-50/70 border-indigo-200 text-indigo-950'
                        : 'bg-white border-slate-100 hover:bg-slate-50 text-slate-700'
                    }`}
                  >
                    <button className="mt-0.5 text-indigo-600 cursor-pointer">
                      {isDone ? (
                        <CheckCircle2 className="w-5 h-5 text-indigo-600" />
                      ) : (
                        <Circle className="w-5 h-5 text-slate-300" />
                      )}
                    </button>
                    <div className="flex-1 min-w-0">
                      <h4 className="text-xs font-bold">{item.label}</h4>
                      <p className="text-[10px] text-slate-500 mt-0.5">{item.tip}</p>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      )}

      {/* Log Sleep Modal */}
      {showLogSleepModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/50 backdrop-blur-sm animate-fadeIn">
          <div className="w-full max-w-sm rounded-3xl bg-white p-6 shadow-2xl border border-indigo-100">
            <h3 className="text-lg font-bold text-slate-800 mb-1">Log Sleep</h3>
            <p className="text-xs text-slate-500 mb-4">Track sleep duration and recovery quality</p>

            <form onSubmit={handleSaveSleep} className="space-y-3.5">
              <div className="grid grid-cols-2 gap-2">
                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">Bedtime</label>
                  <input
                    type="time"
                    required
                    value={bedtimeInput}
                    onChange={(e) => setBedtimeInput(e.target.value)}
                    className="w-full px-3 py-2 text-xs rounded-xl bg-slate-50 border border-slate-200 focus:bg-white focus:outline-none focus:border-indigo-500"
                  />
                </div>
                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">Wake Time</label>
                  <input
                    type="time"
                    required
                    value={wakeTimeInput}
                    onChange={(e) => setWakeTimeInput(e.target.value)}
                    className="w-full px-3 py-2 text-xs rounded-xl bg-slate-50 border border-slate-200 focus:bg-white focus:outline-none focus:border-indigo-500"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">
                  Sleep Quality (1 - 5 Stars)
                </label>
                <div className="flex gap-2">
                  {[1, 2, 3, 4, 5].map((star) => (
                    <button
                      key={star}
                      type="button"
                      onClick={() => setSleepQuality(star)}
                      className={`flex-1 py-2 rounded-xl text-sm font-bold transition cursor-pointer ${
                        sleepQuality >= star
                          ? 'bg-amber-100 text-amber-700 border border-amber-300'
                          : 'bg-slate-50 text-slate-300 border border-slate-200'
                      }`}
                    >
                      ★
                    </button>
                  ))}
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">
                  Notes (Dreams, room temperature, rested?)
                </label>
                <textarea
                  rows={2}
                  placeholder="e.g. Woke up feeling clear-headed and ready for lectures."
                  value={sleepNotes}
                  onChange={(e) => setSleepNotes(e.target.value)}
                  className="w-full px-3 py-2 text-xs rounded-xl bg-slate-50 border border-slate-200 focus:bg-white focus:outline-none focus:border-indigo-500"
                />
              </div>

              <div className="flex gap-2 pt-2">
                <button
                  type="button"
                  onClick={() => setShowLogSleepModal(false)}
                  className="flex-1 py-2.5 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-700 font-semibold text-xs transition cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="flex-1 py-2.5 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white font-bold text-xs shadow transition cursor-pointer"
                >
                  Save Sleep Log
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
