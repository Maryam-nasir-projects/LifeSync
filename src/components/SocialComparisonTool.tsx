import React, { useState } from 'react';
import {
  Sparkles,
  Eye,
  CheckCircle2,
  HelpCircle,
  RotateCcw,
  Layers,
  Heart,
  TrendingDown,
  Info
} from 'lucide-react';
import { SocialComparisonCard } from '../types';
import { soundFx } from '../utils/audio';

const comparisonCards: SocialComparisonCard[] = [
  {
    id: 'sc-1',
    theme: 'Academic Perfection',
    socialMediaPost: '📸 Photo of color-coded notes, iced latte, and caption: "Finished 5 chapters before 8 AM! #GrindNeverStops #DeanList"',
    curatedPerception: 'They are effortlessly productive, never struggle, and have limitless motivation every single morning.',
    hiddenReality: 'Behind the shot: Took 15 minutes staging lighting. Slept poorly, drank 3 energy drinks, and struggled through chapter 2 just like everyone else. Most days they hit snooze 4 times.',
    reflectionPrompt: 'Whose highlight reel are you comparing your raw, behind-the-scenes reality to today?',
  },
  {
    id: 'sc-2',
    theme: 'Social & Campus Life',
    socialMediaPost: '🎉 Group selfie at rooftop dinner: "Unforgettable night with the best crew! #Blessed #SquadGoals"',
    curatedPerception: 'Everyone has a tight-knit, glamorous friend group and active weekend plans except me.',
    hiddenReality: 'Half the group felt awkward, two people left 20 minutes later due to social anxiety, and several were dreading the expensive split bill. Photos capture 1/1000th of a second, not the emotional climate.',
    reflectionPrompt: 'Are you seeking genuine connection with 1 or 2 friends, or performing for digital validation?',
  },
  {
    id: 'sc-3',
    theme: 'Internships & Careers',
    socialMediaPost: '💼 LinkedIn announcement: "Humbled and thrilled to announce I have accepted an offer at [Top Tech/Finance Firm]!"',
    curatedPerception: 'My peers are already securing dream jobs while my resume is falling hopelessly behind.',
    hiddenReality: 'Survivorship bias: People only post their 1 accepted offer, never their 73 rejected applications or ghosted interviews. Careers are marathons with individual timelines, not linear sprint races.',
    reflectionPrompt: 'What unique skills and resilience are you developing that cannot be captured in a bullet point?',
  },
  {
    id: 'sc-4',
    theme: 'Physical Appearance & Lifestyle',
    socialMediaPost: '✨ Mirror photo in athletic wear: "Consistent gym routine paying off! Healthy mind, healthy body."',
    curatedPerception: 'Everyone else has perfect skin, ideal fitness, and boundless self-discipline.',
    hiddenReality: 'Flattering angle, flexed posture, artificial ring-light warmth, and subtle skin filters. Most influencers have bloating, body doubts, and bad skin days just like any student.',
    reflectionPrompt: 'Is this feed inspiring healthy habits, or generating subtle self-rejection? You have permission to unfollow or mute.',
  },
];

interface QuizQuestion {
  id: number;
  question: string;
  options: string[];
  correctIndex: number;
  explanation: string;
}

const quizQuestions: QuizQuestion[] = [
  {
    id: 1,
    question: 'Why does scrolling through classmates’ LinkedIn success posts trigger intense anxiety?',
    options: [
      'Because they are objectively smarter and working harder than you.',
      'Because of "Survivorship Bias": feeds display accepted offers while concealing dozens of silent rejections.',
      'Because you missed the application deadlines.',
      'Because social media reflects total student performance accurately.',
    ],
    correctIndex: 1,
    explanation: 'Correct! Algorithmic feeds highlight extraordinary successes, making exceptional outcomes seem like the bare minimum average.',
  },
  {
    id: 2,
    question: 'What is the psychological effect known as "Upward Social Comparison"?',
    options: [
      'Comparing your worst, vulnerable moments with another person’s polished, edited highlight reel.',
      'Believing your grades will improve automatically.',
      'Preferring physical books over screens.',
      'Studying in high-floor library rooms.',
    ],
    correctIndex: 0,
    explanation: 'Exactly. Upward comparison causes lower self-esteem because we evaluate our unedited life against someone else’s curated front stage.',
  },
  {
    id: 3,
    question: 'What is the most effective digital hygiene step when an account repeatedly triggers self-doubt?',
    options: [
      'Post a better photo immediately to compete.',
      'Keep scrolling until you get used to the feeling.',
      'Mute or unfollow the account; curate your digital feed like your living space.',
      'Delete your university email account.',
    ],
    correctIndex: 2,
    explanation: 'Spot on! Curating your feed to protect mental bandwidth is proactive well-being, not avoidance.',
  },
];

export const SocialComparisonTool: React.FC = () => {
  const [activeCardIndex, setActiveCardIndex] = useState(0);
  const [revealedReality, setRevealedReality] = useState(false);

  // Quiz state
  const [currentQuizIndex, setCurrentQuizIndex] = useState(0);
  const [selectedOption, setSelectedOption] = useState<number | null>(null);
  const [quizScore, setQuizScore] = useState(0);
  const [quizFinished, setQuizFinished] = useState(false);

  const card = comparisonCards[activeCardIndex];
  const q = quizQuestions[currentQuizIndex];

  const handleNextCard = () => {
    soundFx.playTap();
    setRevealedReality(false);
    setActiveCardIndex((prev) => (prev + 1) % comparisonCards.length);
  };

  const handleSelectOption = (idx: number) => {
    soundFx.playTap();
    setSelectedOption(idx);
    if (idx === q.correctIndex) {
      soundFx.playChime(660);
      setQuizScore((s) => s + 1);
    } else {
      soundFx.playChime(330);
    }
  };

  const handleNextQuestion = () => {
    soundFx.playTap();
    setSelectedOption(null);
    if (currentQuizIndex + 1 < quizQuestions.length) {
      setCurrentQuizIndex((i) => i + 1);
    } else {
      setQuizFinished(true);
      soundFx.playCelebration();
    }
  };

  const handleResetQuiz = () => {
    soundFx.playTap();
    setCurrentQuizIndex(0);
    setSelectedOption(null);
    setQuizScore(0);
    setQuizFinished(false);
  };

  return (
    <div className="space-y-4 animate-fadeIn">
      <div>
        <h3 className="text-lg font-extrabold text-slate-800 dark:text-white flex items-center gap-2">
          <span>Reality Lens</span>
          <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-purple-100 dark:bg-purple-900/50 text-purple-700 dark:text-purple-300">
            Social Media Awareness
          </span>
        </h3>
        <p className="text-xs text-slate-500 dark:text-slate-400">
          Recognize curated highlight reels and overcome comparison pressure
        </p>
      </div>

      {/* Reflection Card (Post vs Behind-The-Scenes) */}
      <div className="rounded-3xl bg-white p-5 border border-purple-100 shadow-sm space-y-4">
        <div className="flex items-center justify-between">
          <span className="text-xs font-bold text-purple-700 bg-purple-50 px-2.5 py-1 rounded-lg">
            Theme: {card.theme}
          </span>
          <span className="text-xs text-slate-400 font-semibold">
            {activeCardIndex + 1} of {comparisonCards.length}
          </span>
        </div>

        {/* Social Media Post Simulation */}
        <div className="rounded-2xl bg-slate-50 p-4 border border-slate-200/70 space-y-2">
          <div className="flex items-center gap-2 text-xs font-bold text-slate-700">
            <span className="w-6 h-6 rounded-full bg-gradient-to-r from-pink-500 to-amber-500 flex items-center justify-center text-white text-[10px]">
              ★
            </span>
            <span>Feed Post Simulation</span>
          </div>
          <p className="text-xs text-slate-700 italic bg-white p-3 rounded-xl border border-slate-100">
            {card.socialMediaPost}
          </p>
          <div className="text-[11px] text-rose-700 font-semibold flex items-start gap-1.5 pt-1">
            <TrendingDown className="w-4 h-4 shrink-0 text-rose-500" />
            <span>
              <strong>The Illusion:</strong> {card.curatedPerception}
            </span>
          </div>
        </div>

        {/* Flip to Reveal Hidden Reality */}
        {revealedReality ? (
          <div className="rounded-2xl bg-emerald-50/80 p-4 border border-emerald-200 text-xs text-slate-700 space-y-2.5 animate-fadeIn">
            <div className="flex items-center gap-1.5 font-bold text-emerald-800">
              <Eye className="w-4 h-4 text-emerald-600" />
              <span>The Full Human Reality</span>
            </div>
            <p className="text-xs text-slate-700 leading-relaxed">{card.hiddenReality}</p>
            <div className="pt-2 border-t border-emerald-200/60 text-[11px] font-semibold text-emerald-900 italic">
              💡 {card.reflectionPrompt}
            </div>
          </div>
        ) : (
          <button
            onClick={() => {
              soundFx.playTap();
              setRevealedReality(true);
            }}
            className="w-full py-3 rounded-2xl bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-700 hover:to-indigo-700 text-white font-bold text-xs shadow-md transition active:scale-95 cursor-pointer flex items-center justify-center gap-2"
          >
            <Eye className="w-4 h-4" />
            <span>Tap to Reveal Behind-the-Scenes Reality</span>
          </button>
        )}

        <div className="flex justify-end pt-1">
          <button
            onClick={handleNextCard}
            className="px-4 py-2 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-bold transition cursor-pointer"
          >
            Next Reflection Card →
          </button>
        </div>
      </div>

      {/* Reality Check Quiz Card */}
      <div className="rounded-3xl bg-white p-5 border border-purple-100 shadow-sm space-y-3">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <HelpCircle className="w-4 h-4 text-purple-600" />
            <h4 className="text-xs font-bold uppercase tracking-wider text-slate-700">
              Reality Check Mini-Quiz
            </h4>
          </div>
          <span className="text-xs font-bold text-purple-700">
            Score: {quizScore} / {quizQuestions.length}
          </span>
        </div>

        {!quizFinished ? (
          <div className="space-y-3 pt-1">
            <p className="text-xs font-bold text-slate-800 leading-relaxed">
              Question {currentQuizIndex + 1}: {q.question}
            </p>

            <div className="space-y-2">
              {q.options.map((opt, idx) => {
                const isSelected = selectedOption === idx;
                const isCorrect = idx === q.correctIndex;
                let btnStyle = 'bg-slate-50 border-slate-200 text-slate-700 hover:bg-slate-100';

                if (selectedOption !== null) {
                  if (isCorrect) {
                    btnStyle = 'bg-emerald-100 border-emerald-300 text-emerald-800 font-bold';
                  } else if (isSelected) {
                    btnStyle = 'bg-rose-100 border-rose-300 text-rose-800 font-bold';
                  }
                }

                return (
                  <button
                    key={idx}
                    disabled={selectedOption !== null}
                    onClick={() => handleSelectOption(idx)}
                    className={`w-full p-2.5 rounded-xl border text-left text-xs transition cursor-pointer ${btnStyle}`}
                  >
                    {opt}
                  </button>
                );
              })}
            </div>

            {selectedOption !== null && (
              <div className="p-3 rounded-2xl bg-purple-50 text-xs text-purple-900 border border-purple-200 animate-fadeIn space-y-2">
                <p className="font-medium">{q.explanation}</p>
                <button
                  onClick={handleNextQuestion}
                  className="px-3.5 py-1.5 rounded-xl bg-purple-600 text-white font-bold text-xs shadow hover:bg-purple-700 transition cursor-pointer"
                >
                  Continue →
                </button>
              </div>
            )}
          </div>
        ) : (
          <div className="text-center py-4 space-y-3">
            <CheckCircle2 className="w-10 h-10 text-emerald-500 mx-auto" />
            <h4 className="text-sm font-bold text-slate-800">Quiz Completed!</h4>
            <p className="text-xs text-slate-600 max-w-xs mx-auto">
              You scored {quizScore} out of {quizQuestions.length}. You understand that digital media
              is a curated lens, not a measure of your worth.
            </p>
            <button
              onClick={handleResetQuiz}
              className="px-4 py-2 rounded-xl bg-purple-600 text-white text-xs font-bold transition hover:bg-purple-700"
            >
              Retake Quiz
            </button>
          </div>
        )}
      </div>
    </div>
  );
};
