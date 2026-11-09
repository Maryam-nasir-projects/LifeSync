import React, { useState } from 'react';
import {
  X,
  ChevronRight,
  ChevronLeft,
  Sparkles,
  BookOpen,
  Timer,
  Smartphone,
  Moon,
  Smile,
  Shield,
  Eye,
  Compass,
  LifeBuoy,
  CheckCircle2,
  HelpCircle,
  Volume2
} from 'lucide-react';
import { soundFx } from '../utils/audio';

interface Props {
  onClose: () => void;
  onNavigateToTab: (tab: string) => void;
}

interface WalkthroughStep {
  id: string;
  tabTarget: string;
  title: string;
  subtitle: string;
  icon: React.ElementType;
  badge: string;
  badgeColor: string;
  instructions: string[];
  proTip: string;
}

const walkthroughSteps: WalkthroughStep[] = [
  {
    id: 'step-dashboard',
    tabTarget: 'home',
    title: 'Dashboard & LifeSync Balance Index',
    subtitle: 'Your daily university wellness command center',
    icon: Sparkles,
    badge: 'Overview',
    badgeColor: 'bg-purple-100 text-purple-700',
    instructions: [
      'The LifeSync Balance Index (0–100%) dynamically reflects your sleep, study sessions, screen-time balance, and mood.',
      'Check your daily focus streak and quick vitals at a single glance.',
      'Tap any vital card (Study, Sleep, Screen, or Mood) to jump straight into its detailed section.',
    ],
    proTip: 'Aim for a Balance Index above 75% for steady academic stamina without burnout.',
  },
  {
    id: 'step-study',
    tabTarget: 'study',
    title: 'Smart Study Scheduler',
    subtitle: 'Organize coursework, assignments & deadlines',
    icon: BookOpen,
    badge: 'Academics',
    badgeColor: 'bg-indigo-100 text-indigo-700',
    instructions: [
      'Tap "+ Add Task" to enter an assignment title, course (e.g. Computer Science, Math), due date, and priority.',
      'Estimate how many 25-minute Pomodoro sessions the task requires (e.g. 2 sessions = 50 minutes).',
      'Filter tasks by course or completion status, and tap "Lock Focus" to link a task directly to the timer.',
    ],
    proTip: 'Break large essays or exam revisions into small 2–3 session milestones.',
  },
  {
    id: 'step-focus',
    tabTarget: 'study',
    title: 'Task-Locked Focus Zone & Reality Gate',
    subtitle: '25-minute Pomodoro intervals with distraction defense',
    icon: Timer,
    badge: 'Focus',
    badgeColor: 'bg-purple-100 text-purple-700',
    instructions: [
      'Select which assignment you are studying for from the "Locked to Task" dropdown.',
      'Tap "Start Locked Session" to begin your 25-minute deep focus interval.',
      'If you feel tempted to pause or check your phone, our gentle in-app Reality Gate appears, giving you a mindful 10-second breath check to stay on track or take a conscious 2-minute screen-free break.',
    ],
    proTip: 'Toggle peaceful focus sounds (Rain, Library, Stream) right underneath the timer.',
  },
  {
    id: 'step-digital',
    tabTarget: 'balance',
    title: 'Smart Screen-Time & Habit Goals',
    subtitle: 'Conscious manual screen logging with zero spyware',
    icon: Smartphone,
    badge: 'Digital Habits',
    badgeColor: 'bg-blue-100 text-blue-700',
    instructions: [
      'LifeSync respects your privacy: you consciously log your daily hours using the + / - buttons for Study, Social Media, Video, and Gaming.',
      'The visual split bar shows your Productive Study vs. Recreational Screen ratio.',
      'Complete optional daily habit challenges such as "No Phone in Bed 30m Before Sleep" and "20-20-20 Eye Breaks".',
    ],
    proTip: 'Keeping non-study screen time under 2.5 hours significantly improves deep sleep.',
  },
  {
    id: 'step-sleep',
    tabTarget: 'balance',
    title: 'Sleep Routine & Peaceful Sound Engine',
    subtitle: 'Circadian rhythm support with auto-off sleep timer',
    icon: Moon,
    badge: 'Sleep',
    badgeColor: 'bg-indigo-100 text-indigo-700',
    instructions: [
      'Set your bedtime and wake-up targets, and tap "Log Sleep" each morning to record hours and 1–5 star quality.',
      'Follow the 4-step evening wind-down checklist: dim dorm lights, phone off bed, neck stretch, read physical pages.',
      'Use the Sound Engine to play peaceful Rain, Ocean Waves, or warm Brown Noise, and set the Sleep Timer (15m, 30m, 45m, 60m) to fade out automatically when you fall asleep.',
    ],
    proTip: 'Brown noise has a deep, warm frequency curve that naturally blocks noisy roommate or campus sounds.',
  },
  {
    id: 'step-mood',
    tabTarget: 'wellbeing',
    title: 'Mood Hub & Guided Breathing',
    subtitle: 'Confidential mood tracking & science-backed breath pacing',
    icon: Smile,
    badge: 'Mind & Mood',
    badgeColor: 'bg-rose-100 text-rose-700',
    instructions: [
      'Select your current emotional state (Ecstatic, Happy, Calm, Tired, Stressed, Anxious) and rate your energy 1–5.',
      'Add student context tags (e.g. #ExamPrep, #GoodSleep, #CampusWalk) and save confidential reflection notes.',
      'Switch to "Guided Breathing" for animated breath pacing: Box Breathing (4-4-4-4), 4-7-8 Relaxation, or Resonant Coherence (5-5) with calming sound chimes.',
    ],
    proTip: 'Just 2 minutes of Box Breathing before walking into an exam resets your sympathetic nervous system.',
  },
  {
    id: 'step-reality',
    tabTarget: 'social_comparison',
    title: 'Reality Lens (Social Media Awareness)',
    subtitle: 'Overcome upward comparison & survivorship bias',
    icon: Eye,
    badge: 'Awareness',
    badgeColor: 'bg-blue-100 text-blue-700',
    instructions: [
      'Read "Feed Post vs. Behind-The-Scenes" cards demonstrating the hidden realities behind staged student photos.',
      'Learn how survivorship bias on LinkedIn makes peers look effortlessly successful by concealing dozens of rejections.',
      'Test your digital media literacy with the interactive Reality Check Mini-Quiz.',
    ],
    proTip: 'Curating your social feed by muting accounts that trigger inadequacy is an act of proactive self-care.',
  },
  {
    id: 'step-rewards',
    tabTarget: 'rewards',
    title: 'Weekly Compass & Offline Rewards',
    subtitle: 'Campus disconnect challenges & achievement badges',
    icon: Compass,
    badge: 'Balance',
    badgeColor: 'bg-amber-100 text-amber-800',
    instructions: [
      'Track active weekly goals across academics, sleep, wellness, and digital habits.',
      'Complete real-world offline campus challenges: 30-minute phone-free walks, reading physical book pages, and in-person coffee chats.',
      'Earn Well-being XP to level up your Mindful Scholar rank and unlock non-competitive achievement badges.',
    ],
    proTip: 'Writing your end-of-week reflection on Sundays helps mentally transition into the new academic week.',
  },
  {
    id: 'step-safety',
    tabTarget: 'safety',
    title: 'KindComment, Cyber Safety & Data Shield',
    subtitle: 'Safe online habits, verified support & client-side privacy',
    icon: Shield,
    badge: 'Protection',
    badgeColor: 'bg-emerald-100 text-emerald-800',
    instructions: [
      'Use the rule-based KindComment Assistant to test drafted group messages and receive respectful tone suggestions.',
      'Audit your cyber security posture: 2FA on campus portals, eduroam Wi-Fi, and avoiding bogus research assistant scams.',
      'Access 24/7 verified crisis support (988 Lifeline, Crisis Text Line 741741) or add close roommates to your trusted directory.',
      'Your data stays 100% on your device: export backups as JSON or clear all local data anytime under Privacy Shield.',
    ],
    proTip: 'Never share your student portal credentials in Discord or WhatsApp study groups.',
  },
];

export const AppWalkthroughModal: React.FC<Props> = ({ onClose, onNavigateToTab }) => {
  const [currentStepIndex, setCurrentStepIndex] = useState(0);

  const step = walkthroughSteps[currentStepIndex];
  const StepIcon = step.icon;
  const isFirst = currentStepIndex === 0;
  const isLast = currentStepIndex === walkthroughSteps.length - 1;

  const handleNext = () => {
    soundFx.playTap();
    if (isLast) {
      soundFx.playCelebration();
      onClose();
    } else {
      setCurrentStepIndex((prev) => prev + 1);
    }
  };

  const handlePrev = () => {
    soundFx.playTap();
    if (!isFirst) {
      setCurrentStepIndex((prev) => prev - 1);
    }
  };

  const handleJumpToSection = () => {
    soundFx.playTap();
    onNavigateToTab(step.tabTarget);
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/70 backdrop-blur-md animate-fadeIn">
      <div className="w-full max-w-sm rounded-3xl bg-white dark:bg-slate-900 border border-purple-100 dark:border-slate-800 shadow-2xl p-6 flex flex-col justify-between max-h-[90vh] overflow-y-auto">
        {/* Header Bar */}
        <div>
          <div className="flex items-center justify-between pb-3 border-b border-slate-100 dark:border-slate-800">
            <div className="flex items-center gap-1.5">
              <span className="p-1 rounded-lg bg-purple-100 dark:bg-purple-900/50 text-purple-700 dark:text-purple-300">
                <HelpCircle className="w-4 h-4" />
              </span>
              <span className="text-xs font-bold text-slate-700 dark:text-slate-300">
                Student App Walkthrough
              </span>
            </div>
            <div className="flex items-center gap-2">
              <span className="text-[11px] font-bold text-slate-400">
                {currentStepIndex + 1} of {walkthroughSteps.length}
              </span>
              <button
                onClick={onClose}
                className="p-1 rounded-full text-slate-400 hover:text-slate-600 dark:hover:text-white hover:bg-slate-100 dark:hover:bg-slate-800 cursor-pointer"
                title="Close Guide"
              >
                <X className="w-4 h-4" />
              </button>
            </div>
          </div>

          {/* Step Category Badge */}
          <div className="mt-4 flex items-center justify-between">
            <span
              className={`text-[10px] uppercase font-extrabold px-2 py-0.5 rounded-full ${step.badgeColor}`}
            >
              {step.badge}
            </span>
            <div className="flex gap-1">
              {walkthroughSteps.map((_, idx) => (
                <button
                  key={idx}
                  onClick={() => setCurrentStepIndex(idx)}
                  className={`h-1.5 rounded-full transition-all cursor-pointer ${
                    idx === currentStepIndex
                      ? 'w-5 bg-purple-600'
                      : 'w-1.5 bg-slate-200 dark:bg-slate-700 hover:bg-purple-300'
                  }`}
                  title={`Go to step ${idx + 1}`}
                />
              ))}
            </div>
          </div>

          {/* Hero Step Title */}
          <div className="mt-3 flex items-start gap-3">
            <div className="w-11 h-11 rounded-2xl bg-purple-100 dark:bg-purple-900/60 text-purple-700 dark:text-purple-300 flex items-center justify-center shrink-0 shadow-xs">
              <StepIcon className="w-6 h-6" />
            </div>
            <div>
              <h3 className="font-extrabold text-base text-slate-800 dark:text-white leading-tight">
                {step.title}
              </h3>
              <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
                {step.subtitle}
              </p>
            </div>
          </div>

          {/* Instructions List */}
          <div className="mt-4 space-y-2.5 bg-slate-50 dark:bg-slate-800/60 p-3.5 rounded-2xl border border-slate-100 dark:border-slate-800">
            <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400 block">
              How To Use This Feature:
            </span>
            {step.instructions.map((inst, i) => (
              <div key={i} className="flex items-start gap-2 text-xs text-slate-700 dark:text-slate-200 leading-snug">
                <CheckCircle2 className="w-4 h-4 text-purple-600 dark:text-purple-400 shrink-0 mt-0.5" />
                <span>{inst}</span>
              </div>
            ))}
          </div>

          {/* Pro Tip Box */}
          <div className="mt-3 p-3 rounded-2xl bg-amber-50 dark:bg-amber-950/30 border border-amber-200/70 dark:border-amber-900/50 text-[11px] text-amber-950 dark:text-amber-200 leading-relaxed flex items-start gap-2">
            <Sparkles className="w-3.5 h-3.5 text-amber-600 shrink-0 mt-0.5" />
            <p>
              <strong>Student Tip:</strong> {step.proTip}
            </p>
          </div>
        </div>

        {/* Action Controls */}
        <div className="mt-5 pt-3 border-t border-slate-100 dark:border-slate-800 space-y-2">
          <div className="flex gap-2">
            {!isFirst && (
              <button
                onClick={handlePrev}
                className="flex items-center justify-center gap-1 px-3 py-2.5 rounded-xl bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-300 font-bold text-xs transition cursor-pointer"
              >
                <ChevronLeft className="w-4 h-4" />
                <span>Back</span>
              </button>
            )}

            <button
              onClick={handleNext}
              className="flex-1 flex items-center justify-center gap-1.5 py-2.5 rounded-xl bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-700 hover:to-indigo-700 text-white font-bold text-xs shadow-md transition active:scale-95 cursor-pointer"
            >
              <span>{isLast ? 'Complete Tour & Start Using LifeSync' : 'Next Feature'}</span>
              {!isLast && <ChevronRight className="w-4 h-4" />}
            </button>
          </div>

          <div className="flex items-center justify-between text-[11px] pt-1">
            <button
              onClick={handleJumpToSection}
              className="text-purple-600 dark:text-purple-400 font-bold hover:underline cursor-pointer flex items-center gap-1"
            >
              <span>Open this feature now →</span>
            </button>
            <button
              onClick={onClose}
              className="text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 cursor-pointer"
            >
              Skip Walkthrough
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
