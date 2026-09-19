import React, { useState } from 'react';
import { 
  Sparkles, 
  X, 
  CheckCircle2, 
  Send, 
  Cpu, 
  Wrench, 
  Code2, 
  Zap, 
  Award,
  GraduationCap,
  Users
} from 'lucide-react';

interface StudentJoinModalProps {
  isOpen: boolean;
  onClose: () => void;
  onShowToast?: (title: string, message?: string, type?: 'success' | 'info' | 'cyan' | 'purple') => void;
}

export const StudentJoinModal: React.FC<StudentJoinModalProps> = ({ isOpen, onClose, onShowToast }) => {
  const [submitted, setSubmitted] = useState(false);
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    grade: 'Grade 9 (Freshman)',
    division: 'Hardware & CAD',
    experience: 'Beginner / Eager to Learn',
    statement: ''
  });

  if (!isOpen) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitted(true);
    onShowToast?.(
      'Application Submitted!',
      `Welcome to PCSS II Robotics, ${formData.name}! Check your inbox for Makerlab orientation times.`,
      'cyan'
    );
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/85 backdrop-blur-md">
      <div className="rounded-3xl border border-cyan-500/40 bg-gradient-to-b from-slate-900 to-slate-950 max-w-lg w-full max-h-[90vh] flex flex-col shadow-2xl shadow-cyan-950/60 overflow-hidden text-xs">
        {/* Modal Header */}
        <div className="p-5 border-b border-slate-800/80 bg-slate-950/80 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-2xl bg-gradient-to-tr from-cyan-500 via-blue-600 to-indigo-600 flex items-center justify-center text-white shadow-lg shadow-cyan-900/40">
              <GraduationCap className="w-5 h-5" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h3 className="font-extrabold text-white text-base">
                  Join PCSS II Robotics
                </h3>
                <span className="px-2 py-0.5 rounded-full text-[10px] font-mono font-bold bg-cyan-950 text-cyan-300 border border-cyan-700/50">
                  Grades 6–12
                </span>
              </div>
              <p className="text-[11px] text-slate-400">
                Pioneer Charter School of Science II &bull; Saugus, MA
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

        {/* Modal Body */}
        <div className="flex-1 p-6 overflow-y-auto space-y-4">
          {submitted ? (
            <div className="py-8 text-center space-y-4">
              <div className="w-16 h-16 rounded-full bg-emerald-950/80 border border-emerald-500/50 text-emerald-400 flex items-center justify-center mx-auto shadow-lg shadow-emerald-950/40">
                <CheckCircle2 className="w-8 h-8" />
              </div>
              <div className="space-y-1">
                <h4 className="text-lg font-bold text-white">Application Received!</h4>
                <p className="text-xs text-slate-300 max-w-sm mx-auto leading-relaxed">
                  Welcome aboard, <strong className="text-cyan-300">{formData.name}</strong>. Our student leads for the <strong className="text-white">{formData.division}</strong> division and faculty advisor will review your entry and invite you to our next skunkworks workshop in the PCSS II Makerlab.
                </p>
              </div>

              <div className="p-4 rounded-xl bg-slate-900/80 border border-slate-800 text-left space-y-2 font-mono text-[11px]">
                <div className="text-cyan-400 font-bold uppercase tracking-wider text-[10px]">Next Steps:</div>
                <div className="text-slate-300">&bull; Makerlab Orientation: Tuesday & Thursday @ 3:30 PM</div>
                <div className="text-slate-300">&bull; Bring: Curiosity & desire to build real machines (No prior CAD or coding required!)</div>
              </div>

              <button
                onClick={onClose}
                className="px-6 py-2.5 rounded-xl bg-cyan-600 hover:bg-cyan-500 text-white font-bold transition text-xs shadow-lg shadow-cyan-900/40"
              >
                Close & Explore Robotics Lab
              </button>
            </div>
          ) : (
            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="p-3 rounded-xl bg-cyan-950/30 border border-cyan-800/40 flex items-start gap-2.5 text-slate-300">
                <Sparkles className="w-4 h-4 text-cyan-400 shrink-0 mt-0.5" />
                <p className="leading-relaxed">
                  <strong>Zero Experience Required!</strong> Whether you want to 3D print cascading linear slides, train computer vision models, or produce team documentaries, we train all students from day one.
                </p>
              </div>

              <div className="space-y-1.5">
                <label className="text-slate-300 font-semibold block text-xs">
                  Full Student Name
                </label>
                <input
                  type="text"
                  required
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  placeholder="e.g., Alex Chen"
                  className="w-full px-3.5 py-2.5 rounded-xl bg-slate-900 border border-slate-800 text-white text-xs focus:outline-none focus:border-cyan-400 transition"
                />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div className="space-y-1.5">
                  <label className="text-slate-300 font-semibold block text-xs">
                    School Email / Parent Email
                  </label>
                  <input
                    type="email"
                    required
                    value={formData.email}
                    onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                    placeholder="student@pcss2.org"
                    className="w-full px-3.5 py-2.5 rounded-xl bg-slate-900 border border-slate-800 text-white text-xs focus:outline-none focus:border-cyan-400 transition"
                  />
                </div>

                <div className="space-y-1.5">
                  <label className="text-slate-300 font-semibold block text-xs">
                    Current Grade
                  </label>
                  <select
                    value={formData.grade}
                    onChange={(e) => setFormData({ ...formData, grade: e.target.value })}
                    className="w-full px-3.5 py-2.5 rounded-xl bg-slate-900 border border-slate-800 text-white text-xs focus:outline-none focus:border-cyan-400 transition"
                  >
                    <option>Grade 6 (Middle School)</option>
                    <option>Grade 7 (Middle School)</option>
                    <option>Grade 8 (Middle School)</option>
                    <option>Grade 9 (Freshman)</option>
                    <option>Grade 10 (Sophomore)</option>
                    <option>Grade 11 (Junior)</option>
                    <option>Grade 12 (Senior)</option>
                  </select>
                </div>
              </div>

              <div className="space-y-1.5">
                <label className="text-slate-300 font-semibold block text-xs">
                  Primary Division Interest
                </label>
                <div className="grid grid-cols-2 gap-2">
                  {[
                    { id: 'Hardware & CAD', label: 'Hardware & CAD', desc: 'Onshape 3D, CNC, Slides' },
                    { id: 'Software & Autonomous', label: 'Autonomous & AI', desc: 'Java, RoadRunner, Vision' },
                    { id: 'Electrical & Systems', label: 'Electrical & Wiring', desc: 'Power hubs, 12V buses' },
                    { id: 'Business & Outreach', label: 'Outreach & Sponsors', desc: 'Events, Media, Grants' }
                  ].map((div) => (
                    <button
                      type="button"
                      key={div.id}
                      onClick={() => setFormData({ ...formData, division: div.id })}
                      className={`p-2.5 rounded-xl border text-left transition ${
                        formData.division === div.id
                          ? 'bg-cyan-950/80 border-cyan-400 text-white shadow-sm'
                          : 'bg-slate-900/60 border-slate-800 text-slate-400 hover:border-slate-700 hover:text-slate-200'
                      }`}
                    >
                      <div className="font-bold text-xs">{div.label}</div>
                      <div className="text-[10px] text-slate-500 mt-0.5">{div.desc}</div>
                    </button>
                  ))}
                </div>
              </div>

              <div className="space-y-1.5">
                <label className="text-slate-300 font-semibold block text-xs">
                  What excites you most about robotics? (Optional)
                </label>
                <textarea
                  rows={2}
                  value={formData.statement}
                  onChange={(e) => setFormData({ ...formData, statement: e.target.value })}
                  placeholder="I love building mechanisms, coding games, or want to explore aerospace..."
                  className="w-full px-3.5 py-2.5 rounded-xl bg-slate-900 border border-slate-800 text-white text-xs focus:outline-none focus:border-cyan-400 transition"
                />
              </div>

              <button
                type="submit"
                className="w-full py-3 rounded-xl bg-gradient-to-r from-cyan-600 via-blue-600 to-indigo-600 hover:from-cyan-500 hover:to-indigo-500 text-white font-bold text-xs transition shadow-lg shadow-cyan-900/40 flex items-center justify-center gap-2"
              >
                <Send className="w-4 h-4" />
                <span>Submit Student Application</span>
              </button>
            </form>
          )}
        </div>
      </div>
    </div>
  );
};
