import React, { useState, useEffect, useRef } from 'react';
import {
  BookOpen,
  Plus,
  Trash2,
  CheckCircle2,
  Circle,
  Play,
  Pause,
  RotateCcw,
  Volume2,
  VolumeX,
  CloudRain,
  Radio,
  Waves,
  Sparkles,
  Calendar,
  AlertCircle,
  Clock,
  Filter,
  Check,
  ShieldAlert,
  Heart,
  Wind,
  Droplets,
  Bell
} from 'lucide-react';
import { StudyTask, TaskPriority, FocusStats } from '../types';
import { soundFx } from '../utils/audio';

interface Props {
  tasks: StudyTask[];
  onTasksChange: (tasks: StudyTask[]) => void;
  focusStats: FocusStats;
  onFocusStatsChange: (stats: FocusStats) => void;
}

export const StudyPlanner: React.FC<Props> = ({
  tasks,
  onTasksChange,
  focusStats,
  onFocusStatsChange,
}) => {
  const [activeTab, setActiveTab] = useState<'planner' | 'pomodoro'>('planner');

  // Task filter & sorting
  const [selectedCourse, setSelectedCourse] = useState<string>('all');
  const [filterStatus, setFilterStatus] = useState<'all' | 'active' | 'completed'>('all');
  const [showAddModal, setShowAddModal] = useState(false);

  // New task form state
  const [newTaskTitle, setNewTaskTitle] = useState('');
  const [newTaskCourse, setNewTaskCourse] = useState('Computer Science');
  const [newTaskDueDate, setNewTaskDueDate] = useState(
    new Date(Date.now() + 86400000).toISOString().split('T')[0]
  );
  const [newTaskPriority, setNewTaskPriority] = useState<TaskPriority>('medium');
  const [newTaskSessions, setNewTaskSessions] = useState(2);

  // Pomodoro Timer State
  const [timerMode, setTimerMode] = useState<'focus' | 'shortBreak' | 'longBreak'>('focus');
  const [timeLeft, setTimeLeft] = useState(25 * 60);
  const [isRunning, setIsRunning] = useState(false);
  const [soundEnabled, setSoundEnabled] = useState(true);
  const [ambientSound, setAmbientSound] = useState<'off' | 'rain' | 'ocean' | 'brown' | 'stream' | 'forest' | 'bowl'>('off');
  const [selectedTaskId, setSelectedTaskId] = useState<string>(tasks[0]?.id || '');

  // Gentle Reality Gate State (Idea #4 - Selected Feature #4)
  const [showRealityGate, setShowRealityGate] = useState(false);
  const [realityGateSeconds, setRealityGateSeconds] = useState(10);

  const timerRef = useRef<NodeJS.Timeout | null>(null);

  // Unique course list
  const courses = Array.from(new Set(tasks.map((t) => t.course)));

  // Mode durations
  const durations = {
    focus: 25 * 60,
    shortBreak: 5 * 60,
    longBreak: 15 * 60,
  };

  // Timer Tick
  useEffect(() => {
    if (isRunning) {
      timerRef.current = setInterval(() => {
        setTimeLeft((prev) => {
          if (prev <= 1) {
            handleTimerComplete();
            return 0;
          }
          return prev - 1;
        });
      }, 1000);
    } else {
      if (timerRef.current) clearInterval(timerRef.current);
    }

    return () => {
      if (timerRef.current) clearInterval(timerRef.current);
    };
  }, [isRunning, timerMode, selectedTaskId]);

  const handleTimerComplete = () => {
    setIsRunning(false);
    if (soundEnabled) {
      soundFx.playCelebration();
    }

    if (timerMode === 'focus') {
      const minutesAdded = 25;
      const updatedStats: FocusStats = {
        ...focusStats,
        todaySessions: focusStats.todaySessions + 1,
        todayMinutes: focusStats.todayMinutes + minutesAdded,
        totalSessions: focusStats.totalSessions + 1,
        totalMinutes: focusStats.totalMinutes + minutesAdded,
        lastFocusDate: new Date().toISOString().split('T')[0],
      };
      onFocusStatsChange(updatedStats);

      // Increment sessions on linked task if selected
      if (selectedTaskId) {
        const updated = tasks.map((t) => {
          if (t.id === selectedTaskId) {
            const newDone = t.completedSessions + 1;
            return {
              ...t,
              completedSessions: newDone,
              completed: newDone >= t.estimatedSessions ? true : t.completed,
            };
          }
          return t;
        });
        onTasksChange(updated);
      }
      setTimerMode('shortBreak');
      setTimeLeft(durations.shortBreak);
    } else {
      setTimerMode('focus');
      setTimeLeft(durations.focus);
    }
  };

  const handleModeChange = (mode: 'focus' | 'shortBreak' | 'longBreak') => {
    soundFx.playTap();
    setIsRunning(false);
    setTimerMode(mode);
    setTimeLeft(durations[mode]);
  };

  // Request to pause or leave focus triggers the Gentle Reality Gate
  const handleToggleTimer = () => {
    soundFx.playTap();
    if (isRunning && timerMode === 'focus') {
      // Intercept with gentle Reality Gate
      setRealityGateSeconds(10);
      setShowRealityGate(true);
    } else {
      setIsRunning((prev) => !prev);
    }
  };

  const resetTimer = () => {
    soundFx.playTap();
    setIsRunning(false);
    setTimeLeft(durations[timerMode]);
  };

  const handleAmbientChange = (type: 'off' | 'rain' | 'ocean' | 'brown' | 'stream' | 'forest' | 'bowl') => {
    soundFx.playTap();
    setAmbientSound(type);
    if (type === 'off') {
      soundFx.stopAmbient();
    } else {
      soundFx.startAmbient(type);
    }
  };

  // Add Task
  const handleAddTask = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newTaskTitle.trim()) return;

    const newTask: StudyTask = {
      id: `task-${Date.now()}`,
      title: newTaskTitle.trim(),
      course: newTaskCourse.trim() || 'General Studies',
      dueDate: newTaskDueDate,
      priority: newTaskPriority,
      estimatedSessions: Number(newTaskSessions) || 1,
      completedSessions: 0,
      completed: false,
      createdAt: new Date().toISOString(),
    };

    onTasksChange([newTask, ...tasks]);
    soundFx.playChime(660);
    setNewTaskTitle('');
    setShowAddModal(false);
  };

  const handleDeleteTask = (id: string) => {
    soundFx.playTap();
    onTasksChange(tasks.filter((t) => t.id !== id));
  };

  const handleToggleTask = (id: string) => {
    const updated = tasks.map((t) => {
      if (t.id === id) {
        const next = !t.completed;
        if (next) soundFx.playCelebration();
        return { ...t, completed: next };
      }
      return t;
    });
    onTasksChange(updated);
  };

  const startTaskInPomodoro = (task: StudyTask) => {
    soundFx.playTap();
    setSelectedTaskId(task.id);
    setActiveTab('pomodoro');
    setTimerMode('focus');
    setTimeLeft(durations.focus);
    setIsRunning(true);
  };

  // Format MM:SS
  const formatTime = (secs: number) => {
    const m = Math.floor(secs / 60);
    const s = secs % 60;
    return `${m.toString().padStart(2, '0')}:${s.toString().padStart(2, '0')}`;
  };

  const totalDuration = durations[timerMode];
  const progressPercent = ((totalDuration - timeLeft) / totalDuration) * 100;
  const strokeDashoffset = 565 - (565 * progressPercent) / 100;

  const filteredTasks = tasks.filter((t) => {
    if (selectedCourse !== 'all' && t.course !== selectedCourse) return false;
    if (filterStatus === 'active' && t.completed) return false;
    if (filterStatus === 'completed' && !t.completed) return false;
    return true;
  });

  const linkedTask = tasks.find((t) => t.id === selectedTaskId);

  return (
    <div className="space-y-5 pb-8 animate-fadeIn">
      {/* Top Segmented Navigation */}
      <div className="flex rounded-2xl bg-slate-200/70 p-1 backdrop-blur-md">
        <button
          onClick={() => {
            soundFx.playTap();
            setActiveTab('planner');
          }}
          className={`flex-1 flex items-center justify-center gap-2 py-2.5 rounded-xl text-xs font-bold transition-all cursor-pointer ${
            activeTab === 'planner'
              ? 'bg-white text-purple-800 shadow-sm'
              : 'text-slate-600 hover:text-slate-900'
          }`}
        >
          <BookOpen className="w-4 h-4" />
          <span>Smart Study Scheduler</span>
        </button>
        <button
          onClick={() => {
            soundFx.playTap();
            setActiveTab('pomodoro');
          }}
          className={`flex-1 flex items-center justify-center gap-2 py-2.5 rounded-xl text-xs font-bold transition-all cursor-pointer ${
            activeTab === 'pomodoro'
              ? 'bg-white text-purple-800 shadow-sm'
              : 'text-slate-600 hover:text-slate-900'
          }`}
        >
          <Clock className="w-4 h-4" />
          <span>Task-Locked Focus Zone</span>
        </button>
      </div>

      {/* SMART STUDY SCHEDULER (Idea #3 - Selected Feature #3) */}
      {activeTab === 'planner' && (
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <div>
              <h2 className="text-xl font-extrabold text-slate-800 flex items-center gap-2">
                <span>Smart Study Scheduler</span>
                <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-purple-100 text-purple-700">
                  Coursework
                </span>
              </h2>
              <p className="text-xs text-slate-500">
                Organize assignments, coursework, deadlines & estimated focus blocks
              </p>
            </div>
            <button
              onClick={() => {
                soundFx.playTap();
                setShowAddModal(true);
              }}
              className="flex items-center gap-1.5 px-3.5 py-2 rounded-xl bg-purple-600 hover:bg-purple-700 text-white font-bold text-xs shadow hover:shadow-md transition active:scale-95 cursor-pointer"
            >
              <Plus className="w-4 h-4" />
              <span>Add Task</span>
            </button>
          </div>

          {/* Filters Bar */}
          <div className="flex flex-wrap items-center gap-2">
            <select
              value={selectedCourse}
              onChange={(e) => setSelectedCourse(e.target.value)}
              className="px-3 py-1.5 text-xs font-semibold rounded-xl bg-white border border-slate-200 text-slate-700 focus:outline-none focus:border-purple-500"
            >
              <option value="all">All Courses</option>
              {courses.map((c) => (
                <option key={c} value={c}>
                  {c}
                </option>
              ))}
            </select>

            <div className="flex rounded-xl bg-white border border-slate-200 p-0.5 text-xs font-medium">
              <button
                onClick={() => setFilterStatus('all')}
                className={`px-2.5 py-1 rounded-lg ${
                  filterStatus === 'all'
                    ? 'bg-purple-100 text-purple-700 font-bold'
                    : 'text-slate-500'
                }`}
              >
                All
              </button>
              <button
                onClick={() => setFilterStatus('active')}
                className={`px-2.5 py-1 rounded-lg ${
                  filterStatus === 'active'
                    ? 'bg-purple-100 text-purple-700 font-bold'
                    : 'text-slate-500'
                }`}
              >
                To-Do
              </button>
              <button
                onClick={() => setFilterStatus('completed')}
                className={`px-2.5 py-1 rounded-lg ${
                  filterStatus === 'completed'
                    ? 'bg-purple-100 text-purple-700 font-bold'
                    : 'text-slate-500'
                }`}
              >
                Done
              </button>
            </div>
          </div>

          {/* Tasks List */}
          <div className="space-y-2.5">
            {filteredTasks.length === 0 ? (
              <div className="py-12 text-center bg-white rounded-3xl border border-dashed border-slate-200 p-6">
                <BookOpen className="w-10 h-10 text-purple-300 mx-auto mb-2" />
                <h4 className="text-sm font-bold text-slate-700">No study tasks found</h4>
                <p className="text-xs text-slate-400 mt-1 max-w-xs mx-auto">
                  Add an upcoming assignment, reading, or exam revision task to stay organized.
                </p>
                <button
                  onClick={() => setShowAddModal(true)}
                  className="mt-4 px-4 py-2 rounded-xl bg-purple-600 text-white font-semibold text-xs shadow"
                >
                  Create Study Task
                </button>
              </div>
            ) : (
              filteredTasks.map((task) => (
                <div
                  key={task.id}
                  className={`p-4 rounded-2xl bg-white border transition-all shadow-sm ${
                    task.completed
                      ? 'border-slate-100 opacity-60 bg-slate-50/50'
                      : 'border-purple-100 hover:border-purple-300'
                  }`}
                >
                  <div className="flex items-start justify-between gap-3">
                    <button
                      onClick={() => handleToggleTask(task.id)}
                      className="mt-0.5 text-slate-400 hover:text-purple-600 transition cursor-pointer"
                    >
                      {task.completed ? (
                        <CheckCircle2 className="w-5 h-5 text-emerald-500" />
                      ) : (
                        <Circle className="w-5 h-5 text-slate-300 hover:text-purple-600" />
                      )}
                    </button>

                    <div className="flex-1 min-w-0">
                      <h4
                        className={`text-sm font-bold ${
                          task.completed ? 'line-through text-slate-400' : 'text-slate-800'
                        }`}
                      >
                        {task.title}
                      </h4>
                      <div className="flex flex-wrap items-center gap-2 mt-2">
                        <span className="text-[11px] font-semibold text-purple-700 bg-purple-50 px-2 py-0.5 rounded-md border border-purple-100">
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
                        <span className="text-[11px] text-slate-400 flex items-center gap-1">
                          <Calendar className="w-3 h-3" />
                          Due: {task.dueDate}
                        </span>
                      </div>

                      {/* Sessions Progress Bar */}
                      <div className="mt-3 flex items-center gap-2">
                        <div className="flex-1 h-1.5 bg-slate-100 rounded-full overflow-hidden">
                          <div
                            className="h-full bg-gradient-to-r from-purple-500 to-indigo-500 rounded-full transition-all"
                            style={{
                              width: `${Math.min(
                                100,
                                (task.completedSessions / (task.estimatedSessions || 1)) * 100
                              )}%`,
                            }}
                          />
                        </div>
                        <span className="text-[10px] font-bold text-purple-700 shrink-0">
                          {task.completedSessions}/{task.estimatedSessions} sessions
                        </span>
                      </div>
                    </div>

                    <div className="flex items-center gap-1.5">
                      {!task.completed && (
                        <button
                          onClick={() => startTaskInPomodoro(task)}
                          className="flex items-center gap-1 px-2.5 py-1.5 rounded-xl bg-purple-50 hover:bg-purple-100 text-purple-700 text-xs font-semibold transition cursor-pointer"
                          title="Focus in Task-Locked Focus Zone"
                        >
                          <Play className="w-3 h-3 fill-purple-700" />
                          <span>Lock Focus</span>
                        </button>
                      )}
                      <button
                        onClick={() => handleDeleteTask(task.id)}
                        className="p-1.5 text-slate-300 hover:text-rose-500 transition cursor-pointer"
                        title="Delete Task"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  </div>
                </div>
              ))
            )}
          </div>
        </div>
      )}

      {/* TASK-LOCKED FOCUS ZONE (Idea #4 - Selected Feature #4) */}
      {activeTab === 'pomodoro' && (
        <div className="space-y-4">
          <div className="text-center">
            <h2 className="text-xl font-extrabold text-slate-800 flex items-center justify-center gap-2">
              <span>Task-Locked Focus Zone</span>
              <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-purple-100 text-purple-700">
                Reality Gate Protected
              </span>
            </h2>
            <p className="text-xs text-slate-500">
              Connected study tasks with in-app <strong>Reality Gate</strong> to deflect phone distraction
            </p>
          </div>

          {/* Mode Switcher */}
          <div className="flex justify-center gap-2">
            <button
              onClick={() => handleModeChange('focus')}
              className={`px-4 py-1.5 rounded-full text-xs font-bold transition cursor-pointer ${
                timerMode === 'focus'
                  ? 'bg-purple-600 text-white shadow'
                  : 'bg-white text-slate-600 border border-slate-200'
              }`}
            >
              25m Study Focus
            </button>
            <button
              onClick={() => handleModeChange('shortBreak')}
              className={`px-4 py-1.5 rounded-full text-xs font-bold transition cursor-pointer ${
                timerMode === 'shortBreak'
                  ? 'bg-indigo-600 text-white shadow'
                  : 'bg-white text-slate-600 border border-slate-200'
              }`}
            >
              5m Short Break
            </button>
            <button
              onClick={() => handleModeChange('longBreak')}
              className={`px-4 py-1.5 rounded-full text-xs font-bold transition cursor-pointer ${
                timerMode === 'longBreak'
                  ? 'bg-blue-600 text-white shadow'
                  : 'bg-white text-slate-600 border border-slate-200'
              }`}
            >
              15m Rest Break
            </button>
          </div>

          {/* Task-Locking Selector */}
          <div className="rounded-2xl bg-white p-3.5 border border-purple-100 flex items-center justify-between gap-3 shadow-sm">
            <div className="flex items-center gap-2 text-xs font-semibold text-slate-600">
              <BookOpen className="w-4 h-4 text-purple-600" />
              <span>Locked to Task:</span>
            </div>
            <select
              value={selectedTaskId}
              onChange={(e) => setSelectedTaskId(e.target.value)}
              className="flex-1 max-w-[210px] text-xs font-semibold px-2.5 py-1.5 rounded-xl bg-purple-50 text-purple-900 border border-purple-200 focus:outline-none"
            >
              <option value="">General Study / Unlinked</option>
              {tasks
                .filter((t) => !t.completed)
                .map((t) => (
                  <option key={t.id} value={t.id}>
                    {t.course}: {t.title}
                  </option>
                ))}
            </select>
          </div>

          {/* Circular Countdown Ring */}
          <div className="relative mx-auto my-4 flex items-center justify-center w-64 h-64">
            <svg className="w-full h-full transform -rotate-90" viewBox="0 0 200 200">
              <circle
                cx="100"
                cy="100"
                r="90"
                stroke="#e2e8f0"
                strokeWidth="10"
                fill="none"
              />
              <circle
                cx="100"
                cy="100"
                r="90"
                stroke={
                  timerMode === 'focus'
                    ? '#7c3aed'
                    : timerMode === 'shortBreak'
                    ? '#6366f1'
                    : '#3b82f6'
                }
                strokeWidth="10"
                strokeDasharray="565"
                strokeDashoffset={strokeDashoffset}
                strokeLinecap="round"
                fill="none"
                className="transition-all duration-1000 ease-linear"
              />
            </svg>

            <div className="absolute inset-0 flex flex-col items-center justify-center text-center">
              <span className="text-4xl font-extrabold tracking-tight text-slate-800 font-mono">
                {formatTime(timeLeft)}
              </span>
              <span className="text-xs uppercase font-bold tracking-wider text-purple-600 mt-1">
                {timerMode === 'focus'
                  ? 'Task-Locked Focus'
                  : timerMode === 'shortBreak'
                  ? 'Stretch & Hydrate'
                  : 'Deep Recharge'}
              </span>
              <span className="text-[11px] text-slate-400 mt-1">
                {isRunning ? 'Locked Focus Active' : 'Ready to Focus'}
              </span>
            </div>
          </div>

          {/* Primary Controls */}
          <div className="flex items-center justify-center gap-4">
            <button
              onClick={resetTimer}
              className="p-3.5 rounded-2xl bg-white border border-slate-200 text-slate-600 hover:text-slate-900 shadow-sm hover:shadow transition active:scale-95 cursor-pointer"
              title="Reset Timer"
            >
              <RotateCcw className="w-5 h-5" />
            </button>

            <button
              onClick={handleToggleTimer}
              className={`flex items-center gap-2 px-8 py-3.5 rounded-2xl font-bold text-sm text-white shadow-lg active:scale-95 transition-all cursor-pointer ${
                isRunning
                  ? 'bg-amber-500 hover:bg-amber-600 shadow-amber-500/20'
                  : 'bg-purple-600 hover:bg-purple-700 shadow-purple-600/30'
              }`}
            >
              {isRunning ? (
                <>
                  <Pause className="w-5 h-5 fill-white" />
                  <span>Pause Focus</span>
                </>
              ) : (
                <>
                  <Play className="w-5 h-5 fill-white" />
                  <span>Start Locked Session</span>
                </>
              )}
            </button>

            <button
              onClick={() => {
                soundFx.playTap();
                setSoundEnabled((prev) => !prev);
              }}
              className={`p-3.5 rounded-2xl border transition active:scale-95 cursor-pointer ${
                soundEnabled
                  ? 'bg-purple-50 border-purple-200 text-purple-700'
                  : 'bg-white border-slate-200 text-slate-400'
              }`}
              title="Toggle Completion Chime"
            >
              {soundEnabled ? <Volume2 className="w-5 h-5" /> : <VolumeX className="w-5 h-5" />}
            </button>
          </div>

          {/* Procedural Ambient Soundscapes (100% Offline via Web Audio) */}
          <div className="rounded-3xl bg-white p-4 border border-purple-100 shadow-sm">
            <div className="flex items-center justify-between mb-3">
              <span className="text-xs font-bold text-slate-700 flex items-center gap-1.5">
                <Radio className="w-3.5 h-3.5 text-purple-600" />
                Focus Ambient Sounds (Offline Web Audio)
              </span>
              <span className="text-[11px] font-semibold text-purple-600 capitalize">
                {ambientSound === 'off' ? 'Muted' : ambientSound}
              </span>
            </div>

            <div className="grid grid-cols-4 gap-2">
              <button
                onClick={() => handleAmbientChange('off')}
                className={`py-2 px-1 text-center rounded-xl text-xs font-bold transition cursor-pointer flex flex-col items-center justify-center gap-1 ${
                  ambientSound === 'off'
                    ? 'bg-purple-600 text-white shadow'
                    : 'bg-slate-50 text-slate-600 hover:bg-slate-100'
                }`}
              >
                <VolumeX className="w-3.5 h-3.5" />
                <span>Silent</span>
              </button>
              <button
                onClick={() => handleAmbientChange('rain')}
                className={`py-2 px-1 text-center rounded-xl text-xs font-bold flex flex-col items-center gap-1 transition cursor-pointer ${
                  ambientSound === 'rain'
                    ? 'bg-purple-600 text-white shadow'
                    : 'bg-slate-50 text-slate-600 hover:bg-slate-100'
                }`}
              >
                <CloudRain className="w-3.5 h-3.5" />
                <span>Soft Rain</span>
              </button>
              <button
                onClick={() => handleAmbientChange('ocean')}
                className={`py-2 px-1 text-center rounded-xl text-xs font-bold flex flex-col items-center gap-1 transition cursor-pointer ${
                  ambientSound === 'ocean'
                    ? 'bg-purple-600 text-white shadow'
                    : 'bg-slate-50 text-slate-600 hover:bg-slate-100'
                }`}
              >
                <Waves className="w-3.5 h-3.5" />
                <span>Ocean</span>
              </button>
              <button
                onClick={() => handleAmbientChange('brown')}
                className={`py-2 px-1 text-center rounded-xl text-xs font-bold flex flex-col items-center gap-1 transition cursor-pointer ${
                  ambientSound === 'brown'
                    ? 'bg-purple-600 text-white shadow'
                    : 'bg-slate-50 text-slate-600 hover:bg-slate-100'
                }`}
              >
                <Radio className="w-3.5 h-3.5" />
                <span>Brown Noise</span>
              </button>
              <button
                onClick={() => handleAmbientChange('stream')}
                className={`py-2 px-1 text-center rounded-xl text-xs font-bold flex flex-col items-center gap-1 transition cursor-pointer ${
                  ambientSound === 'stream'
                    ? 'bg-purple-600 text-white shadow'
                    : 'bg-slate-50 text-slate-600 hover:bg-slate-100'
                }`}
              >
                <Droplets className="w-3.5 h-3.5" />
                <span>Brook</span>
              </button>
              <button
                onClick={() => handleAmbientChange('forest')}
                className={`py-2 px-1 text-center rounded-xl text-xs font-bold flex flex-col items-center gap-1 transition cursor-pointer ${
                  ambientSound === 'forest'
                    ? 'bg-purple-600 text-white shadow'
                    : 'bg-slate-50 text-slate-600 hover:bg-slate-100'
                }`}
              >
                <Wind className="w-3.5 h-3.5" />
                <span>Breeze</span>
              </button>
              <button
                onClick={() => handleAmbientChange('bowl')}
                className={`py-2 px-1 text-center rounded-xl text-xs font-bold flex flex-col items-center gap-1 transition cursor-pointer col-span-2 ${
                  ambientSound === 'bowl'
                    ? 'bg-purple-600 text-white shadow'
                    : 'bg-slate-50 text-slate-600 hover:bg-slate-100'
                }`}
              >
                <Bell className="w-3.5 h-3.5" />
                <span>528 Hz Singing Bowl</span>
              </button>
            </div>
          </div>
        </div>
      )}

      {/* GENTLE REALITY GATE MODAL (Idea #4 / Technical Safety Modification) */}
      {showRealityGate && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/65 backdrop-blur-md animate-fadeIn">
          <div className="w-full max-w-sm rounded-3xl bg-white p-6 shadow-2xl border border-purple-200 text-center space-y-4">
            <div className="w-14 h-14 rounded-2xl bg-amber-100 text-amber-700 flex items-center justify-center mx-auto shadow-inner">
              <ShieldAlert className="w-7 h-7" />
            </div>

            <div>
              <span className="text-[10px] uppercase font-extrabold tracking-widest text-amber-600 bg-amber-50 px-2 py-0.5 rounded-full border border-amber-200">
                Gentle Reality Gate
              </span>
              <h3 className="text-lg font-extrabold text-slate-900 mt-2">
                Mindful Check-in
              </h3>
              <p className="text-xs text-slate-600 mt-1 leading-relaxed">
                You are currently in locked focus for{' '}
                <strong>{linkedTask ? linkedTask.title : 'your study block'}</strong>.
              </p>
            </div>

            {/* Reflection question */}
            <div className="p-3.5 rounded-2xl bg-purple-50 text-xs text-purple-950 border border-purple-100 text-left space-y-1.5">
              <span className="font-bold flex items-center gap-1 text-purple-800">
                <Heart className="w-3.5 h-3.5 text-purple-600" />
                Pause & Ask:
              </span>
              <p className="text-[11px] leading-relaxed">
                "Is checking my phone right now an essential necessity, or an unconscious dopamine
                reflex seeking quick relief from study effort?"
              </p>
            </div>

            {/* Mindful Choices */}
            <div className="space-y-2 pt-1">
              <button
                onClick={() => {
                  soundFx.playChime(660);
                  setShowRealityGate(false);
                  setIsRunning(true);
                }}
                className="w-full py-2.5 rounded-xl bg-purple-600 hover:bg-purple-700 text-white font-bold text-xs shadow-md transition cursor-pointer"
              >
                ✓ Return to Planned Study Focus
              </button>

              <button
                onClick={() => {
                  soundFx.playTap();
                  setShowRealityGate(false);
                  setIsRunning(false);
                  setTimerMode('shortBreak');
                  setTimeLeft(2 * 60); // Conscious 2-minute break
                }}
                className="w-full py-2.5 rounded-xl bg-amber-100 hover:bg-amber-200 text-amber-900 font-bold text-xs transition cursor-pointer"
              >
                Take a Conscious 2-Minute Screen-Free Break
              </button>

              <button
                onClick={() => {
                  soundFx.playTap();
                  setShowRealityGate(false);
                  setIsRunning(false);
                }}
                className="w-full py-2 rounded-xl text-slate-400 hover:text-slate-600 font-semibold text-[11px] transition cursor-pointer"
              >
                Conclude Session Now
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Add Task Modal */}
      {showAddModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/50 backdrop-blur-sm animate-fadeIn">
          <div className="w-full max-w-sm rounded-3xl bg-white p-6 shadow-2xl border border-purple-100">
            <h3 className="text-lg font-bold text-slate-800 mb-1">Add Study Task</h3>
            <p className="text-xs text-slate-500 mb-4">Set deadline and estimated Pomodoro sessions</p>

            <form onSubmit={handleAddTask} className="space-y-3.5">
              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">
                  Task Title *
                </label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Read Chapters 3-4 for Biology"
                  value={newTaskTitle}
                  onChange={(e) => setNewTaskTitle(e.target.value)}
                  className="w-full px-3 py-2 text-xs rounded-xl bg-slate-50 border border-slate-200 focus:bg-white focus:outline-none focus:border-purple-500"
                />
              </div>

              <div className="grid grid-cols-2 gap-2">
                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">Course</label>
                  <input
                    type="text"
                    required
                    placeholder="e.g. Computer Science"
                    value={newTaskCourse}
                    onChange={(e) => setNewTaskCourse(e.target.value)}
                    className="w-full px-3 py-2 text-xs rounded-xl bg-slate-50 border border-slate-200 focus:bg-white focus:outline-none focus:border-purple-500"
                  />
                </div>
                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">Due Date</label>
                  <input
                    type="date"
                    required
                    value={newTaskDueDate}
                    onChange={(e) => setNewTaskDueDate(e.target.value)}
                    className="w-full px-3 py-2 text-xs rounded-xl bg-slate-50 border border-slate-200 focus:bg-white focus:outline-none focus:border-purple-500"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-2">
                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">Priority</label>
                  <select
                    value={newTaskPriority}
                    onChange={(e) => setNewTaskPriority(e.target.value as TaskPriority)}
                    className="w-full px-3 py-2 text-xs rounded-xl bg-slate-50 border border-slate-200 focus:bg-white focus:outline-none focus:border-purple-500"
                  >
                    <option value="low">Low</option>
                    <option value="medium">Medium</option>
                    <option value="high">High</option>
                  </select>
                </div>
                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">
                    Est. Pomodoros (25m)
                  </label>
                  <input
                    type="number"
                    min="1"
                    max="10"
                    value={newTaskSessions}
                    onChange={(e) => setNewTaskSessions(Number(e.target.value))}
                    className="w-full px-3 py-2 text-xs rounded-xl bg-slate-50 border border-slate-200 focus:bg-white focus:outline-none focus:border-purple-500"
                  />
                </div>
              </div>

              <div className="flex gap-2 pt-2">
                <button
                  type="button"
                  onClick={() => setShowAddModal(false)}
                  className="flex-1 py-2.5 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-700 font-semibold text-xs transition cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="flex-1 py-2.5 rounded-xl bg-purple-600 hover:bg-purple-700 text-white font-bold text-xs shadow transition cursor-pointer"
                >
                  Save Task
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
