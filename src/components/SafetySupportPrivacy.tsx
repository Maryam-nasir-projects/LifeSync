import React, { useState } from 'react';
import {
  ShieldCheck,
  LifeBuoy,
  BookOpen,
  Lock,
  Phone,
  MessageSquare,
  AlertTriangle,
  Download,
  Trash2,
  RotateCcw,
  Plus,
  ExternalLink,
  ChevronRight,
  CheckCircle2,
  Circle,
  HelpCircle,
  HeartHandshake,
  Sparkles,
  MessageCircle,
  ShieldAlert,
  Send,
  Flag,
  UserX,
  Info
} from 'lucide-react';
import {
  TrustedContact,
  CyberSafetyTip
} from '../types';
import { defaultCyberSafetyTips, storage } from '../utils/storage';
import { soundFx } from '../utils/audio';

interface Props {
  contacts: TrustedContact[];
  onContactsChange: (contacts: TrustedContact[]) => void;
  onDataReset: () => void;
}

const sampleDrafts = [
  'This group project is a disaster, you guys are completely useless and lazy.',
  'Why did you ignore my Discord message for 3 hours??? Are you even working on this?!',
  'I don’t agree with your stance on the assignment, but here is my perspective.',
  'My student ID is 249012 and here is my password to submit for me.',
];

export const SafetySupportPrivacy: React.FC<Props> = ({
  contacts,
  onContactsChange,
  onDataReset,
}) => {
  const [activeSubTab, setActiveSubTab] = useState<'support' | 'safety' | 'kindcomment' | 'privacy'>('support');

  // Contact add modal
  const [showAddContactModal, setShowAddContactModal] = useState(false);
  const [newContactName, setNewContactName] = useState('');
  const [newContactRole, setNewContactRole] = useState('');
  const [newContactPhone, setNewContactPhone] = useState('');
  const [newContactEmail, setNewContactEmail] = useState('');

  // Clear data confirm modal
  const [showClearModal, setShowClearModal] = useState(false);
  const [exportNotice, setExportNotice] = useState(false);

  // Cyber quiz checklist state
  const [cyberAuditState, setCyberAuditState] = useState<Record<string, boolean>>({
    'audit-1': true,
    'audit-2': true,
    'audit-3': false,
    'audit-4': true,
    'audit-5': false,
  });

  // KindComment Assistant state
  const [commentInput, setCommentInput] = useState('');
  const [analyzed, setAnalyzed] = useState(false);

  const toggleAuditItem = (id: string) => {
    soundFx.playTap();
    setCyberAuditState((prev) => ({
      ...prev,
      [id]: !prev[id],
    }));
  };

  // Rule-based KindComment Analyzer (Explicitly rule-based for academic integrity)
  const analyzeComment = (text: string) => {
    const lower = text.toLowerCase();
    const flags: string[] = [];
    const suggestions: string[] = [];
    let tone: 'respectful' | 'harsh' | 'passive_aggressive' | 'oversharing' = 'respectful';

    if (/\b(useless|stupid|idiot|worst|hate|lazy|pathetic|clown)\b/.test(lower)) {
      flags.push('Contains personal attack or degrading words');
      tone = 'harsh';
      suggestions.push(
        'Focus on the specific task obstacle rather than describing the person’s character: e.g. "I’m worried about our deadline tomorrow. Which sections are currently remaining?"'
      );
    }

    if (/\?{2,}|\!{2,}/.test(text) || /[A-Z]{5,}/.test(text)) {
      flags.push('Aggressive punctuation or shouting capital letters');
      if (tone === 'respectful') tone = 'passive_aggressive';
      suggestions.push(
        'Remove excessive exclamation marks or all-caps to prevent defensiveness from your teammate: e.g. "Checking in when you might have a moment to coordinate today."'
      );
    }

    if (/\b(password|passcode|student id|credit card|ssn|pin)\b/.test(lower)) {
      flags.push('Potential sensitive credential or personal ID leak');
      tone = 'oversharing';
      suggestions.push(
        'Never share passwords, student portal credentials, or payment details over group chats. Submit coursework through official campus portals only.'
      );
    }

    if (flags.length === 0 && text.trim().length > 0) {
      suggestions.push('Your drafted message is constructive, polite, and respectful!');
    }

    return { flags, tone, suggestions };
  };

  const currentAnalysis = analyzeComment(commentInput);

  // Add Contact
  const handleAddContact = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newContactName.trim() || !newContactPhone.trim()) return;
    soundFx.playCelebration();

    const newContact: TrustedContact = {
      id: `cnt-${Date.now()}`,
      name: newContactName.trim(),
      role: newContactRole.trim() || 'Trusted Peer',
      phone: newContactPhone.trim(),
      email: newContactEmail.trim(),
      isCrisisService: false,
    };

    onContactsChange([...contacts, newContact]);
    setNewContactName('');
    setNewContactRole('');
    setNewContactPhone('');
    setNewContactEmail('');
    setShowAddContactModal(false);
  };

  // Export JSON file
  const handleExportData = () => {
    soundFx.playCelebration();
    const data = storage.exportAllData();
    const jsonStr = JSON.stringify(data, null, 2);
    const blob = new Blob([jsonStr], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `lifesync-wellbeing-backup-${new Date().toISOString().split('T')[0]}.json`;
    a.click();
    URL.revokeObjectURL(url);
    setExportNotice(true);
    setTimeout(() => setExportNotice(false), 3500);
  };

  // Clear all data
  const handleClearData = () => {
    storage.clearAllData();
    setShowClearModal(false);
    onDataReset();
  };

  return (
    <div className="space-y-5 pb-8 animate-fadeIn">
      {/* 4-way Sub Tab Navigation */}
      <div className="grid grid-cols-4 rounded-2xl bg-slate-200/70 p-1 backdrop-blur-md text-[11px] font-bold">
        <button
          onClick={() => {
            soundFx.playTap();
            setActiveSubTab('support');
          }}
          className={`py-2 px-1 text-center rounded-xl transition cursor-pointer truncate ${
            activeSubTab === 'support'
              ? 'bg-white text-purple-800 shadow-sm'
              : 'text-slate-600 hover:text-slate-900'
          }`}
        >
          Support Gateway
        </button>
        <button
          onClick={() => {
            soundFx.playTap();
            setActiveSubTab('safety');
          }}
          className={`py-2 px-1 text-center rounded-xl transition cursor-pointer truncate ${
            activeSubTab === 'safety'
              ? 'bg-white text-purple-800 shadow-sm'
              : 'text-slate-600 hover:text-slate-900'
          }`}
        >
          Cyber Safety
        </button>
        <button
          onClick={() => {
            soundFx.playTap();
            setActiveSubTab('kindcomment');
          }}
          className={`py-2 px-1 text-center rounded-xl transition cursor-pointer truncate ${
            activeSubTab === 'kindcomment'
              ? 'bg-white text-purple-800 shadow-sm'
              : 'text-slate-600 hover:text-slate-900'
          }`}
        >
          KindComment
        </button>
        <button
          onClick={() => {
            soundFx.playTap();
            setActiveSubTab('privacy');
          }}
          className={`py-2 px-1 text-center rounded-xl transition cursor-pointer truncate ${
            activeSubTab === 'privacy'
              ? 'bg-white text-purple-800 shadow-sm'
              : 'text-slate-600 hover:text-slate-900'
          }`}
        >
          Data Shield
        </button>
      </div>

      {/* SUPPORT GATEWAY VIEW (Idea #13 - Selected Feature #12) */}
      {activeSubTab === 'support' && (
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <div>
              <h2 className="text-xl font-extrabold text-slate-800 flex items-center gap-2">
                <span>Personal Support Gateway</span>
                <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-rose-100 text-rose-700">
                  Trusted Contacts
                </span>
              </h2>
              <p className="text-xs text-slate-500">
                Direct connection to trusted peers, campus counselors & verified support
              </p>
            </div>
            <button
              onClick={() => {
                soundFx.playTap();
                setShowAddContactModal(true);
              }}
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-purple-600 hover:bg-purple-700 text-white font-bold text-xs shadow transition cursor-pointer"
            >
              <Plus className="w-3.5 h-3.5" />
              <span>Add Peer</span>
            </button>
          </div>

          {/* Ethics & Safety Note on Anonymous Chatrooms */}
          <div className="rounded-2xl bg-purple-50/70 p-3 border border-purple-100 flex items-start gap-2 text-xs text-purple-900">
            <ShieldCheck className="w-4 h-4 text-purple-600 shrink-0 mt-0.5" />
            <p className="text-[11px] leading-relaxed">
              <strong>Responsible Student Design:</strong> Unlike risky unmoderated anonymous
              chatrooms, LifeSync’s Support Gateway links you directly to your real trusted contacts
              and vetted university counseling professionals.
            </p>
          </div>

          {/* Immediate Crisis Support Banner */}
          <div className="rounded-3xl bg-gradient-to-br from-rose-600 via-rose-700 to-purple-800 p-5 text-white shadow-xl space-y-3">
            <div className="flex items-center gap-2">
              <span className="p-1.5 rounded-lg bg-white/20">
                <LifeBuoy className="w-5 h-5 text-white animate-spin" style={{ animationDuration: '6s' }} />
              </span>
              <div>
                <h3 className="font-extrabold text-sm tracking-wide">
                  24/7 Immediate Confidential Help
                </h3>
                <p className="text-[11px] text-rose-100">
                  Free, private support anytime. You are never alone.
                </p>
              </div>
            </div>

            <div className="grid grid-cols-2 gap-2 pt-1">
              <a
                href="tel:988"
                className="flex items-center justify-center gap-2 py-3 rounded-2xl bg-white text-rose-700 font-extrabold text-xs shadow hover:bg-rose-50 transition active:scale-95"
              >
                <Phone className="w-4 h-4 fill-rose-700" />
                <span>Call 988 Lifeline</span>
              </a>
              <a
                href="sms:741741?body=HOME"
                className="flex items-center justify-center gap-2 py-3 rounded-2xl bg-white/15 backdrop-blur-md text-white font-extrabold text-xs border border-white/25 hover:bg-white/25 transition active:scale-95"
              >
                <MessageSquare className="w-4 h-4" />
                <span>Text HOME to 741741</span>
              </a>
            </div>
          </div>

          {/* 5-4-3-2-1 Grounding Box */}
          <div className="rounded-3xl bg-white p-5 border border-purple-100 shadow-sm space-y-2.5">
            <h3 className="text-xs font-bold uppercase tracking-wider text-purple-700 flex items-center gap-1.5">
              <HeartHandshake className="w-4 h-4" />
              <span>Sensory Grounding (Anxiety & Panic Relief)</span>
            </h3>
            <p className="text-xs text-slate-500 leading-relaxed">
              If feeling sudden panic, sensory overload, or racing thoughts:
            </p>
            <div className="grid grid-cols-5 gap-1.5 text-center text-[10px] font-bold">
              <div className="p-2 rounded-xl bg-purple-50 text-purple-800 border border-purple-100">
                <span className="block text-sm font-extrabold text-purple-600">5</span>
                See around
              </div>
              <div className="p-2 rounded-xl bg-indigo-50 text-indigo-800 border border-indigo-100">
                <span className="block text-sm font-extrabold text-indigo-600">4</span>
                Touch / feel
              </div>
              <div className="p-2 rounded-xl bg-blue-50 text-blue-800 border border-blue-100">
                <span className="block text-sm font-extrabold text-blue-600">3</span>
                Hear sounds
              </div>
              <div className="p-2 rounded-xl bg-teal-50 text-teal-800 border border-teal-100">
                <span className="block text-sm font-extrabold text-teal-600">2</span>
                Smell / breath
              </div>
              <div className="p-2 rounded-xl bg-amber-50 text-amber-800 border border-amber-100">
                <span className="block text-sm font-extrabold text-amber-600">1</span>
                Kind thought
              </div>
            </div>
          </div>

          {/* Trusted Directory */}
          <div className="space-y-2.5">
            <h3 className="text-xs font-bold uppercase tracking-wider text-slate-400">
              Campus & Personal Contacts
            </h3>

            {contacts.map((contact) => (
              <div
                key={contact.id}
                className="p-4 rounded-2xl bg-white border border-slate-100 shadow-sm flex items-start justify-between gap-3"
              >
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2">
                    <h4 className="text-xs font-bold text-slate-800 truncate">{contact.name}</h4>
                    {contact.isCrisisService && (
                      <span className="text-[9px] font-bold px-1.5 py-0.5 rounded bg-rose-100 text-rose-700">
                        24/7 Verified
                      </span>
                    )}
                  </div>
                  <p className="text-[11px] text-purple-700 font-medium mt-0.5">{contact.role}</p>
                  {contact.notes && (
                    <p className="text-[10px] text-slate-400 mt-1 leading-snug">{contact.notes}</p>
                  )}
                  {contact.hours && (
                    <p className="text-[10px] text-slate-500 font-semibold mt-0.5">
                      🕒 {contact.hours}
                    </p>
                  )}
                </div>

                <div className="flex items-center gap-1.5 shrink-0 self-center">
                  <a
                    href={`tel:${contact.phone}`}
                    className="p-2.5 rounded-xl bg-purple-50 text-purple-700 hover:bg-purple-100 transition cursor-pointer"
                    title={`Call ${contact.name}`}
                  >
                    <Phone className="w-4 h-4" />
                  </a>
                  {contact.email && (
                    <a
                      href={`mailto:${contact.email}`}
                      className="p-2.5 rounded-xl bg-slate-50 text-slate-600 hover:bg-slate-100 transition cursor-pointer"
                      title={`Email ${contact.name}`}
                    >
                      <MessageSquare className="w-4 h-4" />
                    </a>
                  )}
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* KINDCOMMENT ASSISTANT VIEW (Idea #7 - Selected Feature #7) */}
      {activeSubTab === 'kindcomment' && (
        <div className="space-y-4">
          <div>
            <h2 className="text-xl font-extrabold text-slate-800 flex items-center gap-2">
              <span>KindComment Assistant</span>
              <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-purple-100 text-purple-700">
                Tone & Respect
              </span>
            </h2>
            <p className="text-xs text-slate-500">
              Rule-based assistant for respectful wording, safe responses & cyberbullying defense
            </p>
          </div>

          {/* Interactive Draft Analyzer */}
          <div className="rounded-3xl bg-white p-5 border border-purple-100 shadow-sm space-y-3">
            <div className="flex items-center justify-between">
              <label className="text-xs font-bold text-slate-700">
                Draft a Message or Group Chat Reply
              </label>
              <span className="text-[10px] text-slate-400">Rule-based demonstration</span>
            </div>

            <textarea
              rows={3}
              placeholder="Type a drafted message to test its tone before sending, or pick a sample below..."
              value={commentInput}
              onChange={(e) => setCommentInput(e.target.value)}
              className="w-full px-3 py-2 text-xs rounded-xl bg-slate-50 border border-slate-200 focus:bg-white focus:outline-none focus:border-purple-500"
            />

            {/* Quick Sample Draft Buttons */}
            <div className="space-y-1">
              <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400">
                Try a Sample Scenario:
              </span>
              <div className="flex flex-wrap gap-1">
                {sampleDrafts.map((draft, i) => (
                  <button
                    key={i}
                    onClick={() => {
                      soundFx.playTap();
                      setCommentInput(draft);
                    }}
                    className="text-[10px] font-medium px-2 py-1 rounded-lg bg-slate-100 hover:bg-purple-100 hover:text-purple-700 text-slate-600 transition truncate max-w-[200px]"
                  >
                    "{draft.slice(0, 28)}..."
                  </button>
                ))}
              </div>
            </div>

            {/* Live Tone Analysis Output */}
            {commentInput.trim().length > 0 && (
              <div className="pt-2 border-t border-slate-100 space-y-2">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-bold text-slate-700">Tone Assessment:</span>
                  <span
                    className={`text-[10px] font-bold px-2 py-0.5 rounded-full uppercase ${
                      currentAnalysis.tone === 'respectful'
                        ? 'bg-emerald-100 text-emerald-800'
                        : currentAnalysis.tone === 'oversharing'
                        ? 'bg-rose-100 text-rose-800'
                        : 'bg-amber-100 text-amber-800'
                    }`}
                  >
                    {currentAnalysis.tone.replace('_', ' ')}
                  </span>
                </div>

                {currentAnalysis.flags.length > 0 && (
                  <div className="p-3 rounded-2xl bg-amber-50 text-xs text-amber-900 border border-amber-200 space-y-1">
                    <span className="font-bold flex items-center gap-1.5 text-amber-800">
                      <AlertTriangle className="w-3.5 h-3.5" />
                      Detected Phrasing Flags:
                    </span>
                    {currentAnalysis.flags.map((flag, idx) => (
                      <p key={idx} className="text-[11px] ml-4 list-disc">
                        • {flag}
                      </p>
                    ))}
                  </div>
                )}

                <div className="p-3 rounded-2xl bg-purple-50 text-xs text-purple-900 border border-purple-200 space-y-1.5">
                  <span className="font-bold flex items-center gap-1.5 text-purple-800">
                    <Sparkles className="w-3.5 h-3.5" />
                    Constructive Guidance:
                  </span>
                  {currentAnalysis.suggestions.map((sug, idx) => (
                    <p key={idx} className="text-[11px] leading-relaxed">
                      {sug}
                    </p>
                  ))}
                </div>
              </div>
            )}
          </div>

          {/* Safe Responses, Blocking & Reporting Guide */}
          <div className="rounded-3xl bg-white p-5 border border-purple-100 shadow-sm space-y-3">
            <h3 className="text-xs font-bold uppercase tracking-wider text-slate-400">
              When You Receive Harmful or Toxic Messages
            </h3>

            <div className="space-y-2.5">
              <div className="flex items-start gap-3 p-3 rounded-2xl bg-slate-50 border border-slate-100">
                <div className="w-8 h-8 rounded-xl bg-purple-100 text-purple-700 flex items-center justify-center shrink-0">
                  <MessageCircle className="w-4 h-4" />
                </div>
                <div>
                  <h4 className="text-xs font-bold text-slate-800">1. Pause Before Reacting</h4>
                  <p className="text-[11px] text-slate-500 mt-0.5 leading-relaxed">
                    Trolls and heated messages seek emotional escalation. Do not reply immediately;
                    take 3 deep breaths or step away for 10 minutes.
                  </p>
                </div>
              </div>

              <div className="flex items-start gap-3 p-3 rounded-2xl bg-slate-50 border border-slate-100">
                <div className="w-8 h-8 rounded-xl bg-indigo-100 text-indigo-700 flex items-center justify-center shrink-0">
                  <Flag className="w-4 h-4" />
                </div>
                <div>
                  <h4 className="text-xs font-bold text-slate-800">2. Screenshot Evidence First</h4>
                  <p className="text-[11px] text-slate-500 mt-0.5 leading-relaxed">
                    Always capture full-screen screenshots showing timestamps, usernames, and thread
                    context before blocking or reporting.
                  </p>
                </div>
              </div>

              <div className="flex items-start gap-3 p-3 rounded-2xl bg-slate-50 border border-slate-100">
                <div className="w-8 h-8 rounded-xl bg-rose-100 text-rose-700 flex items-center justify-center shrink-0">
                  <UserX className="w-4 h-4" />
                </div>
                <div>
                  <h4 className="text-xs font-bold text-slate-800">3. Block & Report Without Guilt</h4>
                  <p className="text-[11px] text-slate-500 mt-0.5 leading-relaxed">
                    Block the sender on WhatsApp, Discord, or Instagram. If harassment involves a
                    classmate, forward screenshots to your Campus Student Conduct or Title IX
                    office.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* CYBER SAFETY VIEW */}
      {activeSubTab === 'safety' && (
        <div className="space-y-4">
          <div>
            <h2 className="text-xl font-extrabold text-slate-800">Student Cyber Safety</h2>
            <p className="text-xs text-slate-500">
              Defend against university phishing, credential stuffing & scam risks
            </p>
          </div>

          {/* Interactive Student Cyber Audit */}
          <div className="rounded-3xl bg-white p-5 border border-purple-100 shadow-sm space-y-3">
            <div className="flex items-center justify-between">
              <h3 className="text-xs font-bold uppercase tracking-wider text-slate-400">
                Personal Cyber Posture Audit
              </h3>
              <span className="text-xs font-bold text-emerald-600">
                {Object.values(cyberAuditState).filter(Boolean).length} of{' '}
                {Object.keys(cyberAuditState).length} Checked
              </span>
            </div>

            <div className="space-y-2">
              {[
                {
                  id: 'audit-1',
                  label: 'MFA / 2FA is active on student portal & institutional email',
                },
                {
                  id: 'audit-2',
                  label: 'Campus Wi-Fi set to 802.1X authenticated (eduroam) instead of open guest network',
                },
                {
                  id: 'audit-3',
                  label: 'Distinct passphrase used for university portal (not reused on social media)',
                },
                {
                  id: 'audit-4',
                  label: 'Do not post syllabus schedules, dorm room keys or room numbers on Instagram/TikTok',
                },
                {
                  id: 'audit-5',
                  label: 'Know how to report bogus $400/week virtual assistant scam emails to IT Helpdesk',
                },
              ].map((item) => {
                const checked = cyberAuditState[item.id] || false;
                return (
                  <div
                    key={item.id}
                    onClick={() => toggleAuditItem(item.id)}
                    className={`flex items-start gap-2.5 p-3 rounded-2xl border transition-all cursor-pointer ${
                      checked
                        ? 'bg-purple-50/60 border-purple-200 text-purple-950'
                        : 'bg-white border-slate-100 text-slate-600 hover:bg-slate-50'
                    }`}
                  >
                    <button className="mt-0.5 text-purple-600 cursor-pointer">
                      {checked ? (
                        <CheckCircle2 className="w-4 h-4 text-purple-600" />
                      ) : (
                        <Circle className="w-4 h-4 text-slate-300" />
                      )}
                    </button>
                    <span className="text-xs font-semibold leading-snug">{item.label}</span>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Educational Safety Guides */}
          <div className="space-y-3">
            <h3 className="text-xs font-bold uppercase tracking-wider text-slate-400">
              Educational Online Safety Cards
            </h3>

            {defaultCyberSafetyTips.map((tip) => (
              <div
                key={tip.id}
                className="p-4 rounded-2xl bg-white border border-slate-100 shadow-sm space-y-2"
              >
                <div className="flex items-center justify-between">
                  <h4 className="text-xs font-bold text-slate-800 flex items-center gap-1.5">
                    <Lock className="w-3.5 h-3.5 text-purple-600" />
                    <span>{tip.title}</span>
                  </h4>
                  <span
                    className={`text-[9px] uppercase font-extrabold px-1.5 py-0.5 rounded ${
                      tip.severity === 'high'
                        ? 'bg-rose-100 text-rose-700'
                        : 'bg-amber-100 text-amber-700'
                    }`}
                  >
                    {tip.severity} Alert
                  </span>
                </div>

                <p className="text-xs text-slate-600 leading-relaxed">{tip.summary}</p>

                <div className="pt-2 border-t border-slate-100 space-y-1.5">
                  <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400 block">
                    Defensive Actions:
                  </span>
                  {tip.actionChecklist.map((act, idx) => (
                    <div key={idx} className="flex items-start gap-2 text-[11px] text-slate-600">
                      <span className="w-1.5 h-1.5 rounded-full bg-purple-500 shrink-0 mt-1.5" />
                      <span>{act}</span>
                    </div>
                  ))}
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* PRIVACY PROTECTION AND LOCAL DATA SHIELD (Idea #8 - Selected Feature #8) */}
      {activeSubTab === 'privacy' && (
        <div className="space-y-4">
          <div>
            <h2 className="text-xl font-extrabold text-slate-800 flex items-center gap-2">
              <span>Privacy Protection & Local Data Shield</span>
              <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-emerald-100 text-emerald-800">
                100% Client-Side
              </span>
            </h2>
            <p className="text-xs text-slate-500">
              Local-first student privacy & transparent browser storage limitations
            </p>
          </div>

          {/* Privacy Guarantee Card */}
          <div className="rounded-3xl bg-gradient-to-br from-emerald-700 via-teal-700 to-indigo-800 p-5 text-white shadow-xl space-y-3">
            <div className="flex items-center gap-2.5">
              <div className="w-10 h-10 rounded-2xl bg-white/20 backdrop-blur-md flex items-center justify-center">
                <ShieldCheck className="w-6 h-6 text-white" />
              </div>
              <div>
                <h3 className="font-extrabold text-base">Local Device Data Shield</h3>
                <p className="text-xs text-emerald-100">
                  Zero cloud servers • Kept inside your personal browser sandbox
                </p>
              </div>
            </div>

            <p className="text-xs text-emerald-50 leading-relaxed bg-white/10 p-3 rounded-2xl backdrop-blur-sm border border-white/15">
              Every study assignment, private mood journal entry, sleep record, and screen time log is
              stored locally on this device. LifeSync never transmits your information to external ad
              brokers or marketing databases.
            </p>
          </div>

          {/* Ethical Disclaimer on Local Storage Limitations */}
          <div className="rounded-2xl bg-slate-50 p-4 border border-slate-200 text-xs text-slate-700 space-y-2">
            <div className="flex items-center gap-1.5 font-bold text-slate-800">
              <Info className="w-4 h-4 text-blue-600" />
              <span>Ethical Disclosure: Local Storage Boundaries</span>
            </div>
            <p className="text-[11px] text-slate-600 leading-relaxed">
              In accordance with ethical design principles, note that browser local storage is tied to
              this specific device and browser profile. If you clear your browser history or cache,
              local data may be erased. We provide an <strong>Export My Data</strong> button below so
              you can save backups whenever you wish.
            </p>
          </div>

          {/* Data Management Actions */}
          <div className="rounded-3xl bg-white p-5 border border-purple-100 shadow-sm space-y-3">
            <h3 className="text-xs font-bold uppercase tracking-wider text-slate-400">
              Data Governance & Controls
            </h3>

            {/* Export */}
            <div className="flex items-center justify-between p-3 rounded-2xl bg-slate-50 border border-slate-100">
              <div>
                <h4 className="text-xs font-bold text-slate-800">Export My Data (JSON)</h4>
                <p className="text-[10px] text-slate-500">Download complete backup file for safekeeping</p>
              </div>
              <button
                onClick={handleExportData}
                className="flex items-center gap-1.5 px-3 py-2 rounded-xl bg-purple-600 hover:bg-purple-700 text-white font-bold text-xs shadow transition active:scale-95 cursor-pointer"
              >
                <Download className="w-3.5 h-3.5" />
                <span>Export</span>
              </button>
            </div>

            {exportNotice && (
              <div className="p-2.5 rounded-xl bg-emerald-50 text-emerald-800 border border-emerald-200 text-xs font-semibold animate-fadeIn">
                ✓ Backup JSON file downloaded successfully!
              </div>
            )}

            {/* Reset to starter defaults */}
            <div className="flex items-center justify-between p-3 rounded-2xl bg-slate-50 border border-slate-100">
              <div>
                <h4 className="text-xs font-bold text-slate-800">Reset to Sample Template</h4>
                <p className="text-[10px] text-slate-500">Restore default student demonstration data</p>
              </div>
              <button
                onClick={() => {
                  soundFx.playTap();
                  storage.resetToDefaults();
                  onDataReset();
                }}
                className="flex items-center gap-1.5 px-3 py-2 rounded-xl bg-slate-200 hover:bg-slate-300 text-slate-700 font-bold text-xs transition active:scale-95 cursor-pointer"
              >
                <RotateCcw className="w-3.5 h-3.5" />
                <span>Reset</span>
              </button>
            </div>

            {/* Wipe / Clear Locally Stored Data */}
            <div className="flex items-center justify-between p-3 rounded-2xl bg-rose-50/60 border border-rose-100">
              <div>
                <h4 className="text-xs font-bold text-rose-800">Clear Locally Stored Data</h4>
                <p className="text-[10px] text-rose-600">Permanently erase all personal entries</p>
              </div>
              <button
                onClick={() => {
                  soundFx.playTap();
                  setShowClearModal(true);
                }}
                className="flex items-center gap-1.5 px-3 py-2 rounded-xl bg-rose-600 hover:bg-rose-700 text-white font-bold text-xs shadow transition active:scale-95 cursor-pointer"
              >
                <Trash2 className="w-3.5 h-3.5" />
                <span>Clear</span>
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Add Peer Contact Modal */}
      {showAddContactModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/50 backdrop-blur-sm animate-fadeIn">
          <div className="w-full max-w-sm rounded-3xl bg-white p-6 shadow-2xl border border-purple-100">
            <h3 className="text-lg font-bold text-slate-800 mb-1">Add Trusted Contact</h3>
            <p className="text-xs text-slate-500 mb-4">Add a classmate, roommate, or family member</p>

            <form onSubmit={handleAddContact} className="space-y-3.5">
              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">Name *</label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Jordan Lee"
                  value={newContactName}
                  onChange={(e) => setNewContactName(e.target.value)}
                  className="w-full px-3 py-2 text-xs rounded-xl bg-slate-50 border border-slate-200 focus:bg-white focus:outline-none focus:border-purple-500"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">Relation / Role</label>
                <input
                  type="text"
                  placeholder="e.g. Roommate, Study Partner, Brother"
                  value={newContactRole}
                  onChange={(e) => setNewContactRole(e.target.value)}
                  className="w-full px-3 py-2 text-xs rounded-xl bg-slate-50 border border-slate-200 focus:bg-white focus:outline-none focus:border-purple-500"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">Phone Number *</label>
                <input
                  type="tel"
                  required
                  placeholder="e.g. (555) 123-4567"
                  value={newContactPhone}
                  onChange={(e) => setNewContactPhone(e.target.value)}
                  className="w-full px-3 py-2 text-xs rounded-xl bg-slate-50 border border-slate-200 focus:bg-white focus:outline-none focus:border-purple-500"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">Email (Optional)</label>
                <input
                  type="email"
                  placeholder="e.g. jordan@campus.edu"
                  value={newContactEmail}
                  onChange={(e) => setNewContactEmail(e.target.value)}
                  className="w-full px-3 py-2 text-xs rounded-xl bg-slate-50 border border-slate-200 focus:bg-white focus:outline-none focus:border-purple-500"
                />
              </div>

              <div className="flex gap-2 pt-2">
                <button
                  type="button"
                  onClick={() => setShowAddContactModal(false)}
                  className="flex-1 py-2.5 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-700 font-semibold text-xs transition cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="flex-1 py-2.5 rounded-xl bg-purple-600 hover:bg-purple-700 text-white font-bold text-xs shadow transition cursor-pointer"
                >
                  Save Contact
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Clear Data Confirmation Modal */}
      {showClearModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm animate-fadeIn">
          <div className="w-full max-w-sm rounded-3xl bg-white p-6 shadow-2xl border border-rose-200">
            <div className="w-12 h-12 rounded-2xl bg-rose-100 text-rose-600 flex items-center justify-center mb-3">
              <AlertTriangle className="w-6 h-6" />
            </div>
            <h3 className="text-lg font-bold text-slate-800">Clear All Local Data?</h3>
            <p className="text-xs text-slate-500 mt-1 mb-4 leading-relaxed">
              This will permanently delete all study tasks, mood journals, sleep entries, and badge
              progress from this device's local storage. This action cannot be undone.
            </p>

            <div className="flex gap-2">
              <button
                onClick={() => setShowClearModal(false)}
                className="flex-1 py-2.5 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-700 font-semibold text-xs transition cursor-pointer"
              >
                Keep My Data
              </button>
              <button
                onClick={handleClearData}
                className="flex-1 py-2.5 rounded-xl bg-rose-600 hover:bg-rose-700 text-white font-bold text-xs shadow transition cursor-pointer"
              >
                Yes, Clear Data
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
