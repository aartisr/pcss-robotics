import React, { useState } from 'react';
import { 
  Bot, 
  Send, 
  X, 
  Sparkles, 
  Cpu, 
  ShieldCheck, 
  Wrench, 
  Activity 
} from 'lucide-react';

interface AiAssistantModalProps {
  isOpen: boolean;
  onClose: () => void;
}

interface Message {
  role: 'user' | 'assistant';
  text: string;
}

export const AiAssistantModal: React.FC<AiAssistantModalProps> = ({ isOpen, onClose }) => {
  const [messages, setMessages] = useState<Message[]>([
    {
      role: 'assistant',
      text: 'Greetings! I am RoboBot AI, technical systems advisor for PCSS II Robotics (FTC #23548). Ask me about Kraken V2 mechanics, RoadRunner autonomous trajectories, 501(c)(3) sponsorship benefits, or FIRST Tech Challenge rules!'
    }
  ]);
  const [input, setInput] = useState('');

  const quickQuestions = [
    'What are Kraken V2\'s motor & slide specs?',
    'How do corporate 501(c)(3) sponsorships work?',
    'Explain your 500Hz optical odometry setup',
    'How do Saugus students join the team?'
  ];

  const handleSend = (userText: string) => {
    if (!userText.trim()) return;

    const newMsgs: Message[] = [...messages, { role: 'user', text: userText }];
    setMessages(newMsgs);
    setInput('');

    // Instant intelligent rule & telemetry answer generator
    setTimeout(() => {
      let reply = '';
      const lower = userText.toLowerCase();

      if (lower.includes('kraken') || lower.includes('motor') || lower.includes('spec') || lower.includes('slide')) {
        reply = 'Kraken V2 is powered by 8 REV UltraPlanetary planetary gearmotors: 4 for the strafer mecanum chassis, 2 dual-motor actuators for the continuous Kevlar-rigged cascading elevator (achieving 42" reach in 0.65s), and 2 for the compliant intake wrist. It weighs 36.8 lbs, fully within the 42 lb FTC limit.';
      } else if (lower.includes('sponsor') || lower.includes('501') || lower.includes('tax') || lower.includes('donate')) {
        reply = 'PCSS II Robotics is a registered 501(c)(3) non-profit public charity under Pioneer Charter School of Science II in Saugus, MA. All corporate and individual contributions are 100% tax-deductible under IRS codes. Corporate sponsors receive prominent logo decals on the competition robot, pit banners at regional tournaments, and direct invitations to Circuit 2026.';
      } else if (lower.includes('odometry') || lower.includes('roadrunner') || lower.includes('auto') || lower.includes('vision')) {
        reply = 'Our autonomous software stack utilizes SparkFun OTOS optical tracking odometry running on a dedicated 500Hz bus, combined with HuskyLens 2.0 AI cameras for real-time AprilTag alignment and specimen color sorting. RoadRunner v1.0.2 executes quintic Hermite splines with closed-loop PIDF feedback, yielding a 98.4% trajectory accuracy.';
      } else if (lower.includes('join') || lower.includes('student') || lower.includes('school')) {
        reply = 'Students in grades 6–12 at Pioneer Charter School of Science II can apply for our Hardware/CAD, Software/Autonomous, Electrical, or Business/Outreach divisions! We also run free feeder workshops and mentor local elementary and middle school FLL teams across Saugus and Essex County.';
      } else {
        reply = `Thanks for asking about "${userText}". Our student engineering team focuses on competitive mechanical precision, open-source STEM curriculum, and inspiring North Shore youth. Feel free to contact our mentors directly at robotics@pcss2.org!`;
      }

      setMessages([...newMsgs, { role: 'assistant', text: reply }]);
    }, 400);
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-md">
      <div className="rounded-2xl border border-cyan-800/60 bg-slate-900 max-w-xl w-full h-[540px] flex flex-col shadow-2xl shadow-cyan-950/50 overflow-hidden">
        {/* Modal Header */}
        <div className="p-4 border-b border-slate-800 bg-slate-950/90 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 rounded-lg bg-cyan-950 border border-cyan-800 flex items-center justify-center">
              <Bot className="w-4 h-4 text-cyan-400" />
            </div>
            <div>
              <h3 className="font-bold text-white text-sm flex items-center gap-2">
                RoboBot AI Strategy Engine
                <span className="text-[10px] font-mono px-1.5 py-0.5 rounded bg-cyan-950 text-cyan-300 border border-cyan-800/40">
                  FTC #23548
                </span>
              </h3>
              <p className="text-[11px] text-slate-400">
                Autonomous Kinematics & 501(c)(3) Knowledge Base
              </p>
            </div>
          </div>

          <button
            onClick={onClose}
            className="p-1.5 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800 transition"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Message Log */}
        <div className="flex-1 p-4 overflow-y-auto space-y-3 text-xs">
          {messages.map((m, idx) => (
            <div
              key={idx}
              className={`flex ${m.role === 'user' ? 'justify-end' : 'justify-start'}`}
            >
              <div
                className={`max-w-[85%] p-3 rounded-2xl leading-relaxed ${
                  m.role === 'user'
                    ? 'bg-cyan-600 text-white rounded-br-none'
                    : 'bg-slate-950 text-slate-200 border border-slate-800 rounded-bl-none font-sans'
                }`}
              >
                {m.text}
              </div>
            </div>
          ))}
        </div>

        {/* Quick Question Prompts */}
        <div className="px-4 py-2 bg-slate-950/40 border-t border-slate-800/80 flex gap-1.5 overflow-x-auto text-[11px]">
          {quickQuestions.map((q, i) => (
            <button
              key={i}
              onClick={() => handleSend(q)}
              className="px-2.5 py-1 rounded-full bg-slate-800 hover:bg-slate-700 text-slate-300 whitespace-nowrap transition shrink-0"
            >
              {q}
            </button>
          ))}
        </div>

        {/* Input Bar */}
        <div className="p-3 border-t border-slate-800 bg-slate-950 flex gap-2">
          <input
            type="text"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyDown={(e) => e.key === 'Enter' && handleSend(input)}
            placeholder="Ask about Kraken V2, RoadRunner splines, or tax deductions..."
            className="flex-1 px-3 py-2 rounded-xl bg-slate-900 border border-slate-800 text-xs text-white focus:outline-none focus:border-cyan-500"
          />
          <button
            onClick={() => handleSend(input)}
            className="px-4 py-2 rounded-xl bg-cyan-600 hover:bg-cyan-500 text-white font-bold text-xs transition flex items-center gap-1"
          >
            <Send className="w-3.5 h-3.5" />
            <span>Ask</span>
          </button>
        </div>
      </div>
    </div>
  );
};
