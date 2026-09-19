import React, { useState, useEffect } from 'react';
import { TeamMember, CompetitionChallenge, StrategicProposal, FacultyMentor } from '../types';
import { 
  INITIAL_TEAM_ROSTER, 
  INITIAL_COMPETITIONS, 
  INITIAL_PROPOSALS,
  INITIAL_FACULTY_MENTORS
} from '../data/teamRosterData';
import { 
  Users, 
  UserPlus, 
  Search, 
  Award, 
  Sparkles, 
  Calendar, 
  Shirt, 
  Database, 
  Download, 
  CheckCircle2, 
  Filter, 
  Lightbulb, 
  ThumbsUp, 
  Plus, 
  Edit3, 
  Trash2, 
  X, 
  ExternalLink,
  Info,
  ChevronRight,
  ShieldCheck,
  Zap,
  GraduationCap,
  Mail,
  BookOpen,
  Briefcase,
  Quote
} from 'lucide-react';

const STORAGE_KEYS = {
  ROSTER: 'pcss_team_roster_v1',
  COMPETITIONS: 'pcss_competitions_v1',
  PROPOSALS: 'pcss_proposals_v1',
  MENTORS: 'pcss_faculty_mentors_v1'
};

export const TeamSection: React.FC = () => {
  // Tab navigation
  const [activeTab, setActiveTab] = useState<'mentors' | 'roster' | 'competitions' | 'proposals' | 'database'>('mentors');

  // Core reactive data with localStorage sync
  const [mentors, setMentors] = useState<FacultyMentor[]>(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEYS.MENTORS);
      return saved ? JSON.parse(saved) : INITIAL_FACULTY_MENTORS;
    } catch {
      return INITIAL_FACULTY_MENTORS;
    }
  });

  const [members, setMembers] = useState<TeamMember[]>(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEYS.ROSTER);
      if (saved) {
        const parsed: TeamMember[] = JSON.parse(saved);
        // Ensure Aarti Sri Ravikumar has accurate external links
        return parsed.map(m => {
          if (m.name.toLowerCase().includes('aarti') || m.id === 'student-1') {
            return {
              ...m,
              name: 'Aarti Sri Ravikumar',
              profileUrl: m.profileUrl || 'https://ai-aarti.com',
              specialtyUrl: m.specialtyUrl?.replace('pubications.', 'publications.') || 'https://publications.ai-aarti.com'
            };
          }
          return m;
        });
      }
      return INITIAL_TEAM_ROSTER;
    } catch {
      return INITIAL_TEAM_ROSTER;
    }
  });

  const [competitions, setCompetitions] = useState<CompetitionChallenge[]>(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEYS.COMPETITIONS);
      return saved ? JSON.parse(saved) : INITIAL_COMPETITIONS;
    } catch {
      return INITIAL_COMPETITIONS;
    }
  });

  const [proposals, setProposals] = useState<StrategicProposal[]>(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEYS.PROPOSALS);
      return saved ? JSON.parse(saved) : INITIAL_PROPOSALS;
    } catch {
      return INITIAL_PROPOSALS;
    }
  });

  // Save to localStorage
  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEYS.MENTORS, JSON.stringify(mentors));
    } catch (e) {
      console.warn('Local storage error', e);
    }
  }, [mentors]);

  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEYS.ROSTER, JSON.stringify(members));
    } catch (e) {
      console.warn('Local storage error', e);
    }
  }, [members]);

  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEYS.COMPETITIONS, JSON.stringify(competitions));
    } catch (e) {
      console.warn('Local storage error', e);
    }
  }, [competitions]);

  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEYS.PROPOSALS, JSON.stringify(proposals));
    } catch (e) {
      console.warn('Local storage error', e);
    }
  }, [proposals]);

  // Roster filters
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedGrade, setSelectedGrade] = useState<string>('All');
  const [selectedDivision, setSelectedDivision] = useState<string>('All');

  // Modals state
  const [isAddMentorOpen, setIsAddMentorOpen] = useState(false);
  const [editingMentor, setEditingMentor] = useState<FacultyMentor | null>(null);
  const [isAddStudentOpen, setIsAddStudentOpen] = useState(false);
  const [editingStudent, setEditingStudent] = useState<TeamMember | null>(null);
  const [isAddCompOpen, setIsAddCompOpen] = useState(false);
  const [editingComp, setEditingComp] = useState<CompetitionChallenge | null>(null);
  const [isAddPropOpen, setIsAddPropOpen] = useState(false);
  const [editingProp, setEditingProp] = useState<StrategicProposal | null>(null);

  // Mentor Form State
  const [mentorForm, setMentorForm] = useState<Partial<FacultyMentor>>({
    name: '',
    role: '',
    tagline: '',
    seasonsCount: 12,
    statLabel: 'STUDENT TEAMS COACHED',
    bio: '',
    quote: '',
    expertiseTags: [],
    avatarUrl: '',
    email: '',
    isLead: false
  });
  const [mentorTagsInput, setMentorTagsInput] = useState('');

  // Student Form State
  const [studentForm, setStudentForm] = useState<Partial<TeamMember>>({
    name: '',
    grade: 'Grade 9',
    division: 'Software & Autonomous',
    role: '',
    specialty: '',
    profileUrl: '',
    specialtyUrl: '',
    competition: '',
    competitionDeadline: '',
    tshirtSize: 'M',
    tshirtColor: 'Pink',
    notes: ''
  });

  // Competition Form State
  const [compForm, setCompForm] = useState<Partial<CompetitionChallenge>>({
    name: '',
    category: 'FIRST & VEX',
    deadline: '',
    assignedStudents: [],
    status: 'Active R&D',
    description: '',
    venue: ''
  });
  const [compStudentInput, setCompStudentInput] = useState('');

  // Proposal Form State
  const [propForm, setPropForm] = useState<Partial<StrategicProposal>>({
    title: '',
    author: '',
    authorGrade: 'Grade 9',
    category: 'Training & Curriculum',
    proposal: '',
    tags: []
  });
  const [propTagsInput, setPropTagsInput] = useState('');

  // Mentor CRUD handlers
  const handleOpenAddMentor = () => {
    setEditingMentor(null);
    setMentorForm({
      name: '',
      role: 'Faculty Mentor',
      tagline: '',
      seasonsCount: 5,
      statLabel: 'STUDENT TEAMS COACHED',
      bio: '',
      quote: '',
      expertiseTags: [],
      avatarUrl: '',
      email: '',
      isLead: false
    });
    setMentorTagsInput('Systems, Mentorship, Engineering');
    setIsAddMentorOpen(true);
  };

  const handleOpenEditMentor = (mentor: FacultyMentor) => {
    setEditingMentor(mentor);
    setMentorForm({ ...mentor });
    setMentorTagsInput(mentor.expertiseTags.join(', '));
    setIsAddMentorOpen(true);
  };

  const handleDeleteMentor = (id: string, name: string) => {
    if (confirm(`Are you sure you want to remove ${name} from the Faculty & Mentors roster?`)) {
      setMentors(prev => prev.filter(m => m.id !== id));
    }
  };

  const handleSaveMentor = (e: React.FormEvent) => {
    e.preventDefault();
    if (!mentorForm.name?.trim()) return;

    const tags = mentorTagsInput.split(',').map(t => t.trim()).filter(Boolean);

    if (editingMentor) {
      setMentors(prev => prev.map(m => m.id === editingMentor.id ? {
        ...m,
        ...mentorForm,
        name: mentorForm.name!.trim(),
        role: mentorForm.role?.trim() || 'Mentor / Faculty Sponsor',
        tagline: mentorForm.tagline?.trim() || 'Mentors robotics student engineering.',
        seasonsCount: Number(mentorForm.seasonsCount) || 1,
        statLabel: mentorForm.statLabel?.trim() || 'STUDENT TEAMS COACHED',
        bio: mentorForm.bio?.trim() || '',
        quote: mentorForm.quote?.trim() || '',
        expertiseTags: tags.length > 0 ? tags : ['Engineering', 'Mentorship'],
        avatarUrl: mentorForm.avatarUrl?.trim() || 'https://images.unsplash.com/photo-1581092160607-ee22621dd758?auto=format&fit=crop&w=400&q=80',
        email: mentorForm.email?.trim() || '',
        isLead: !!mentorForm.isLead
      } as FacultyMentor : m));
    } else {
      const newMentor: FacultyMentor = {
        id: `mentor-${Date.now()}`,
        name: mentorForm.name!.trim(),
        role: mentorForm.role?.trim() || 'Mentor / Faculty Sponsor',
        tagline: mentorForm.tagline?.trim() || 'Mentors robotics student engineering.',
        seasonsCount: Number(mentorForm.seasonsCount) || 1,
        statLabel: mentorForm.statLabel?.trim() || 'STUDENT TEAMS COACHED',
        bio: mentorForm.bio?.trim() || 'Dedicated STEM educator and robotics coach.',
        quote: mentorForm.quote?.trim() || 'Great teams are not built on heroics. They are built on repeatable learning.',
        expertiseTags: tags.length > 0 ? tags : ['Engineering', 'Mentorship'],
        avatarUrl: mentorForm.avatarUrl?.trim() || 'https://images.unsplash.com/photo-1581092160607-ee22621dd758?auto=format&fit=crop&w=400&q=80',
        email: mentorForm.email?.trim() || '',
        isLead: !!mentorForm.isLead
      };
      setMentors(prev => [newMentor, ...prev]);
    }

    setIsAddMentorOpen(false);
    setEditingMentor(null);
  };

  // Handle student save
  const handleSaveStudent = (e: React.FormEvent) => {
    e.preventDefault();
    if (!studentForm.name?.trim()) return;

    if (editingStudent) {
      setMembers(prev => prev.map(m => m.id === editingStudent.id ? {
        ...m,
        ...studentForm,
        name: studentForm.name!.trim(),
        role: studentForm.role?.trim() || 'Robotics Member',
        specialty: studentForm.specialty?.trim() || 'General Engineering',
        profileUrl: studentForm.profileUrl?.trim() || undefined,
        specialtyUrl: studentForm.specialtyUrl?.trim() || undefined
      } as TeamMember : m));
    } else {
      const newMember: TeamMember = {
        id: `student-${Date.now()}`,
        name: studentForm.name!.trim(),
        grade: studentForm.grade || 'Grade 9',
        division: (studentForm.division as any) || 'Software & Autonomous',
        role: studentForm.role?.trim() || 'Robotics Member',
        specialty: studentForm.specialty?.trim() || 'General Engineering',
        profileUrl: studentForm.profileUrl?.trim() || undefined,
        specialtyUrl: studentForm.specialtyUrl?.trim() || undefined,
        competition: studentForm.competition?.trim() || undefined,
        competitionDeadline: studentForm.competitionDeadline?.trim() || undefined,
        tshirtSize: (studentForm.tshirtSize as any) || undefined,
        tshirtColor: studentForm.tshirtColor?.trim() || undefined,
        notes: studentForm.notes?.trim() || undefined
      };
      setMembers(prev => [newMember, ...prev]);
    }

    setIsAddStudentOpen(false);
    setEditingStudent(null);
  };

  const handleOpenEdit = (student: TeamMember) => {
    setEditingStudent(student);
    setStudentForm({ ...student });
    setIsAddStudentOpen(true);
  };

  const handleDeleteStudent = (id: string, name: string) => {
    if (confirm(`Remove ${name} from the active roster?`)) {
      setMembers(prev => prev.filter(m => m.id !== id));
    }
  };

  // Competition CRUD handlers
  const handleOpenAddCompetition = () => {
    setEditingComp(null);
    setCompForm({
      name: '',
      category: 'FIRST & VEX',
      deadline: '',
      status: 'Active R&D',
      description: '',
      venue: ''
    });
    setCompStudentInput('');
    setIsAddCompOpen(true);
  };

  const handleOpenEditCompetition = (comp: CompetitionChallenge) => {
    setEditingComp(comp);
    setCompForm({ ...comp });
    setCompStudentInput(comp.assignedStudents?.join(', ') || '');
    setIsAddCompOpen(true);
  };

  const handleDeleteCompetition = (id: string, name: string) => {
    if (confirm(`Are you sure you want to delete the competition "${name}"?`)) {
      setCompetitions(prev => prev.filter(c => c.id !== id));
    }
  };

  // Handle Competition Save (Create & Update)
  const handleSaveCompetition = (e: React.FormEvent) => {
    e.preventDefault();
    if (!compForm.name?.trim()) return;

    const assigned = compStudentInput.split(',').map(s => s.trim()).filter(Boolean);

    if (editingComp) {
      setCompetitions(prev => prev.map(c => c.id === editingComp.id ? {
        ...c,
        ...compForm,
        name: compForm.name!.trim(),
        category: (compForm.category as any) || 'FIRST & VEX',
        deadline: compForm.deadline?.trim() || undefined,
        assignedStudents: assigned,
        status: (compForm.status as any) || 'Active R&D',
        description: compForm.description?.trim() || 'Robotics competition event.',
        venue: compForm.venue?.trim() || undefined
      } as CompetitionChallenge : c));
    } else {
      const newComp: CompetitionChallenge = {
        id: `comp-${Date.now()}`,
        name: compForm.name!.trim(),
        category: (compForm.category as any) || 'FIRST & VEX',
        deadline: compForm.deadline?.trim() || undefined,
        assignedStudents: assigned,
        status: (compForm.status as any) || 'Active R&D',
        description: compForm.description?.trim() || 'Robotics competition event.',
        venue: compForm.venue?.trim() || undefined
      };
      setCompetitions(prev => [newComp, ...prev]);
    }

    setIsAddCompOpen(false);
    setEditingComp(null);
    setCompForm({
      name: '',
      category: 'FIRST & VEX',
      deadline: '',
      status: 'Active R&D',
      description: '',
      venue: ''
    });
    setCompStudentInput('');
  };

  // Proposal CRUD handlers
  const handleOpenAddProposal = () => {
    setEditingProp(null);
    setPropForm({
      title: '',
      author: '',
      authorGrade: 'Grade 9',
      category: 'Training & Curriculum',
      proposal: '',
      status: 'Student Proposal'
    });
    setPropTagsInput('');
    setIsAddPropOpen(true);
  };

  const handleOpenEditProposal = (prop: StrategicProposal) => {
    setEditingProp(prop);
    setPropForm({ ...prop });
    setPropTagsInput(prop.tags?.join(', ') || '');
    setIsAddPropOpen(true);
  };

  const handleDeleteProposal = (id: string, title: string) => {
    if (confirm(`Are you sure you want to delete the strategic proposal "${title}"?`)) {
      setProposals(prev => prev.filter(p => p.id !== id));
    }
  };

  // Handle Proposal Save (Create & Update)
  const handleSaveProposal = (e: React.FormEvent) => {
    e.preventDefault();
    if (!propForm.title?.trim() || !propForm.proposal?.trim()) return;

    const tags = propTagsInput.split(',').map(t => t.trim()).filter(Boolean);

    if (editingProp) {
      setProposals(prev => prev.map(p => p.id === editingProp.id ? {
        ...p,
        ...propForm,
        title: propForm.title!.trim(),
        author: propForm.author?.trim() || 'Student Member',
        authorGrade: propForm.authorGrade || 'Grade 9',
        category: (propForm.category as any) || 'Training & Curriculum',
        proposal: propForm.proposal!.trim(),
        status: (propForm.status as any) || p.status || 'Student Proposal',
        tags: tags.length > 0 ? tags : p.tags
      } as StrategicProposal : p));
    } else {
      const newProp: StrategicProposal = {
        id: `prop-${Date.now()}`,
        title: propForm.title!.trim(),
        author: propForm.author?.trim() || 'Anonymous Student',
        authorGrade: propForm.authorGrade || 'Grade 9',
        category: (propForm.category as any) || 'Training & Curriculum',
        proposal: propForm.proposal!.trim(),
        votes: 1,
        status: (propForm.status as any) || 'Student Proposal',
        date: new Date().toISOString().split('T')[0],
        tags: tags.length > 0 ? tags : ['Student Idea', 'Proposal']
      };
      setProposals(prev => [newProp, ...prev]);
    }

    setIsAddPropOpen(false);
    setEditingProp(null);
    setPropForm({
      title: '',
      author: '',
      authorGrade: 'Grade 9',
      category: 'Training & Curriculum',
      proposal: ''
    });
    setPropTagsInput('');
  };

  // Upvote proposal
  const handleUpvote = (id: string) => {
    setProposals(prev => prev.map(p => p.id === id ? { ...p, votes: p.votes + 1 } : p));
  };

  // Export Roster as CSV
  const handleExportCsv = () => {
    const headers = ['Grade', 'Name', 'Division', 'Role', 'Competition', 'Deadline', 'T-Shirt Size', 'T-Shirt Color', 'Specialty', 'Notes'];
    const rows = members.map(m => [
      m.grade,
      `"${m.name}"`,
      `"${m.division}"`,
      `"${m.role}"`,
      `"${m.competition || ''}"`,
      `"${m.competitionDeadline || ''}"`,
      `"${m.tshirtSize || ''}"`,
      `"${m.tshirtColor || ''}"`,
      `"${m.specialty || ''}"`,
      `"${m.notes || ''}"`
    ]);

    const csvContent = 'data:text/csv;charset=utf-8,' + [headers.join(','), ...rows.map(e => e.join(','))].join('\n');
    const encodedUri = encodeURI(csvContent);
    const link = document.createElement('a');
    link.setAttribute('href', encodedUri);
    link.setAttribute('download', `PCSS_Robotics_Team_Roster_${new Date().toISOString().split('T')[0]}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  // Filtered members
  const filteredMembers = members.filter(member => {
    const matchesSearch = member.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      member.specialty.toLowerCase().includes(searchQuery.toLowerCase()) ||
      (member.competition && member.competition.toLowerCase().includes(searchQuery.toLowerCase())) ||
      member.role.toLowerCase().includes(searchQuery.toLowerCase());
    
    const matchesGrade = selectedGrade === 'All' || member.grade.toLowerCase().includes(selectedGrade.toLowerCase());
    const matchesDivision = selectedDivision === 'All' || member.division === selectedDivision;

    return matchesSearch && matchesGrade && matchesDivision;
  });

  // T-Shirt breakdown stats
  const tshirtStats = members.reduce((acc, m) => {
    if (m.tshirtSize) {
      acc[m.tshirtSize] = (acc[m.tshirtSize] || 0) + 1;
    }
    return acc;
  }, {} as Record<string, number>);

  const pinkCount = members.filter(m => m.tshirtColor && m.tshirtColor.toLowerCase().includes('pink')).length;

  return (
    <section className="py-10 sm:py-16 space-y-8 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
      {/* Header & Mission Banner */}
      <div className="flex flex-col lg:flex-row lg:items-end justify-between gap-6 pb-6 border-b border-white/10">
        <div className="space-y-3">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full text-xs font-semibold bg-cyan-950/80 text-cyan-300 border border-cyan-500/30 font-mono">
            <Users className="w-3.5 h-3.5 text-cyan-400" />
            <span>PCSS II APPLIED CYBERNETICS // TEAM HEADQUARTERS</span>
          </div>
          <h1 className="text-3xl sm:text-4xl font-extrabold text-white tracking-tight">
            Student Roster, Competitions & Proposals
          </h1>
          <p className="text-sm text-slate-400 max-w-3xl leading-relaxed">
            Collaborative team portal for Pioneer Charter School of Science II (FTC #23548). All members can track squad rosters, register competition deadlines, propose new club initiatives, and coordinate team gear.
          </p>
        </div>

        {/* Global Action Bar */}
        <div className="flex flex-wrap items-center gap-2.5">
          <button
            onClick={handleOpenAddMentor}
            className="flex items-center gap-2 px-3.5 py-2 rounded-xl bg-blue-600 hover:bg-blue-500 text-white text-xs font-bold shadow-lg shadow-blue-950/40 transition"
          >
            <GraduationCap className="w-4 h-4" />
            <span>+ Add Mentor</span>
          </button>

          <button
            onClick={() => {
              setEditingStudent(null);
              setStudentForm({
                name: '',
                grade: 'Grade 9',
                division: 'Software & Autonomous',
                role: '',
                specialty: '',
                competition: '',
                tshirtSize: 'M',
                tshirtColor: 'Pink'
              });
              setIsAddStudentOpen(true);
            }}
            className="flex items-center gap-2 px-3.5 py-2 rounded-xl bg-cyan-600 hover:bg-cyan-500 text-white text-xs font-bold shadow-lg shadow-cyan-950/40 transition"
          >
            <UserPlus className="w-4 h-4" />
            <span>+ Add Student</span>
          </button>

          <button
            onClick={handleOpenAddCompetition}
            className="flex items-center gap-2 px-3.5 py-2 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white text-xs font-bold shadow-lg shadow-emerald-950/40 transition"
          >
            <Award className="w-4 h-4" />
            <span>+ Add Competition</span>
          </button>

          <button
            onClick={handleOpenAddProposal}
            className="flex items-center gap-2 px-3.5 py-2 rounded-xl bg-purple-600 hover:bg-purple-500 text-white text-xs font-bold shadow-lg shadow-purple-950/40 transition"
          >
            <Lightbulb className="w-4 h-4" />
            <span>+ Propose Idea</span>
          </button>

          <button
            onClick={handleExportCsv}
            className="flex items-center gap-2 px-3 py-2 rounded-xl bg-slate-900 hover:bg-slate-800 text-slate-300 hover:text-white border border-white/10 text-xs font-medium transition"
            title="Export full roster as CSV spreadsheet"
          >
            <Download className="w-3.5 h-3.5 text-cyan-400" />
            <span className="hidden sm:inline">Export CSV</span>
          </button>
        </div>
      </div>

      {/* Top Level Navigation Tabs */}
      <div className="flex flex-wrap items-center gap-2 p-1.5 rounded-2xl bg-slate-900/90 border border-white/10 backdrop-blur-xl">
        <button
          onClick={() => setActiveTab('mentors')}
          className={`flex items-center gap-2 px-4 py-2.5 rounded-xl text-xs sm:text-sm font-semibold transition ${
            activeTab === 'mentors'
              ? 'bg-blue-600/30 text-blue-300 border border-blue-500/50 shadow-sm'
              : 'text-slate-400 hover:text-white hover:bg-white/[0.04]'
          }`}
        >
          <GraduationCap className="w-4 h-4 text-blue-400" />
          <span>Mentors & Teachers ({mentors.length})</span>
        </button>

        <button
          onClick={() => setActiveTab('roster')}
          className={`flex items-center gap-2 px-4 py-2.5 rounded-xl text-xs sm:text-sm font-semibold transition ${
            activeTab === 'roster'
              ? 'bg-cyan-500/20 text-cyan-300 border border-cyan-500/40 shadow-sm'
              : 'text-slate-400 hover:text-white hover:bg-white/[0.04]'
          }`}
        >
          <Users className="w-4 h-4" />
          <span>Team Roster & Gear ({members.length})</span>
        </button>

        <button
          onClick={() => setActiveTab('competitions')}
          className={`flex items-center gap-2 px-4 py-2.5 rounded-xl text-xs sm:text-sm font-semibold transition ${
            activeTab === 'competitions'
              ? 'bg-emerald-500/20 text-emerald-300 border border-emerald-500/40 shadow-sm'
              : 'text-slate-400 hover:text-white hover:bg-white/[0.04]'
          }`}
        >
          <Award className="w-4 h-4" />
          <span>Competitions & Challenges ({competitions.length})</span>
        </button>

        <button
          onClick={() => setActiveTab('proposals')}
          className={`flex items-center gap-2 px-4 py-2.5 rounded-xl text-xs sm:text-sm font-semibold transition ${
            activeTab === 'proposals'
              ? 'bg-purple-500/20 text-purple-300 border border-purple-500/40 shadow-sm'
              : 'text-slate-400 hover:text-white hover:bg-white/[0.04]'
          }`}
        >
          <Lightbulb className="w-4 h-4" />
          <span>Strategic Proposals ({proposals.length})</span>
        </button>

        <button
          onClick={() => setActiveTab('database')}
          className={`flex items-center gap-2 px-4 py-2.5 rounded-xl text-xs sm:text-sm font-semibold transition ml-auto ${
            activeTab === 'database'
              ? 'bg-amber-500/20 text-amber-300 border border-amber-500/40 shadow-sm'
              : 'text-slate-400 hover:text-white hover:bg-white/[0.04]'
          }`}
        >
          <Database className="w-4 h-4 text-amber-400" />
          <span>Free Database Guide</span>
        </button>
      </div>

      {/* TAB 0: MENTORS & TEACHERS */}
      {activeTab === 'mentors' && (
        <div className="space-y-8 animate-in fade-in duration-200">
          {/* Section Header matching screenshot visual language */}
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-2 border-b border-white/5">
            <div className="space-y-2">
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full text-xs font-bold tracking-wider uppercase bg-blue-500/10 text-blue-400 border border-blue-500/30 font-mono">
                <GraduationCap className="w-3.5 h-3.5 text-blue-400" />
                <span>MENTORS & TEACHERS</span>
              </div>
              <h2 className="text-2xl sm:text-3xl font-extrabold text-white tracking-tight">
                Guides who raise the ceiling
              </h2>
              <p className="text-xs sm:text-sm text-slate-400 max-w-3xl leading-relaxed">
                Mentors coach decision quality, review design tradeoffs, and model professional engineering standards.
              </p>
            </div>

            <button
              onClick={handleOpenAddMentor}
              className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl bg-blue-600 hover:bg-blue-500 text-white text-xs font-bold shadow-lg shadow-blue-950/40 transition shrink-0"
            >
              <Plus className="w-4 h-4" />
              <span>+ Add Mentor / Faculty</span>
            </button>
          </div>

          {/* Mentors Grid Cards */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {mentors.map((mentor) => (
              <div
                key={mentor.id}
                className="p-6 sm:p-7 rounded-3xl bg-slate-900/80 border border-white/10 hover:border-blue-500/40 transition flex flex-col justify-between space-y-5 backdrop-blur-xl shadow-xl shadow-slate-950/40 group"
              >
                <div className="space-y-4">
                  {/* Top Header: Avatar + Title/Role + Edit/Delete */}
                  <div className="flex items-start justify-between gap-4">
                    <div className="flex items-start gap-3.5">
                      <div className="w-14 h-14 rounded-2xl overflow-hidden shrink-0 border-2 border-blue-500/30 bg-slate-950 shadow-md">
                        {mentor.avatarUrl ? (
                          <img
                            src={mentor.avatarUrl}
                            alt={mentor.name}
                            className="w-full h-full object-cover"
                          />
                        ) : (
                          <div className="w-full h-full flex items-center justify-center font-bold text-lg text-blue-400 font-mono bg-blue-950/40">
                            {mentor.name.slice(0, 2).toUpperCase()}
                          </div>
                        )}
                      </div>

                      <div>
                        <div className="flex items-center gap-2">
                          <h3 className="text-lg sm:text-xl font-extrabold text-white">
                            {mentor.name}
                          </h3>
                          {mentor.isLead && (
                            <span className="px-2 py-0.5 rounded text-[10px] font-mono font-bold bg-blue-950 text-blue-300 border border-blue-500/30">
                              Lead
                            </span>
                          )}
                        </div>
                        <div className="text-xs sm:text-sm font-bold text-blue-400 mt-0.5">
                          {mentor.role}
                        </div>
                      </div>
                    </div>

                    {/* Actions */}
                    <div className="flex items-center gap-1 shrink-0">
                      <button
                        onClick={() => handleOpenEditMentor(mentor)}
                        className="p-2 rounded-xl bg-white/[0.04] hover:bg-blue-500/20 text-slate-400 hover:text-blue-300 border border-white/5 transition"
                        title="Edit mentor profile"
                      >
                        <Edit3 className="w-3.5 h-3.5" />
                      </button>
                      <button
                        onClick={() => handleDeleteMentor(mentor.id, mentor.name)}
                        className="p-2 rounded-xl bg-white/[0.04] hover:bg-red-500/20 text-slate-400 hover:text-red-400 border border-white/5 transition"
                        title="Delete mentor"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  </div>

                  {/* Tagline */}
                  <p className="text-xs sm:text-sm text-slate-300 leading-relaxed font-normal">
                    {mentor.tagline}
                  </p>

                  {/* Highlight Stat (e.g. 12 seasons STUDENT TEAMS COACHED) */}
                  <div className="flex items-baseline gap-2 py-1">
                    <span className="text-2xl font-black text-white font-mono">
                      {mentor.seasonsCount} seasons
                    </span>
                    <span className="text-[11px] font-mono font-bold tracking-wider uppercase text-slate-400">
                      {mentor.statLabel || 'STUDENT TEAMS COACHED'}
                    </span>
                  </div>

                  {/* Bio */}
                  <p className="text-xs text-slate-400 leading-relaxed">
                    {mentor.bio}
                  </p>

                  {/* Guiding Quote with Border Accent */}
                  {mentor.quote && (
                    <div className="pl-3.5 border-l-2 border-blue-400/80 py-1 bg-blue-950/20 rounded-r-xl pr-3">
                      <p className="text-xs italic text-slate-300 font-medium">
                        &ldquo;{mentor.quote}&rdquo;
                      </p>
                    </div>
                  )}
                </div>

                {/* Skill Pills & Footer */}
                <div className="pt-3 border-t border-white/[0.08] flex flex-wrap items-center justify-between gap-3">
                  <div className="flex flex-wrap gap-1.5">
                    {mentor.expertiseTags.map((tag, i) => (
                      <span
                        key={i}
                        className="px-3 py-1 rounded-full text-[11px] font-medium bg-blue-950/70 text-blue-300 border border-blue-500/30"
                      >
                        {tag}
                      </span>
                    ))}
                  </div>

                  {mentor.email && (
                    <a
                      href={`mailto:${mentor.email}`}
                      className="text-[11px] font-mono text-slate-400 hover:text-cyan-300 transition flex items-center gap-1.5"
                    >
                      <Mail className="w-3.5 h-3.5 text-blue-400" />
                      <span>{mentor.email}</span>
                    </a>
                  )}
                </div>
              </div>
            ))}
          </div>

          {/* Quick Notice to add and maintain */}
          <div className="p-4 rounded-2xl bg-blue-950/30 border border-blue-500/20 flex items-center justify-between text-xs text-blue-200">
            <div className="flex items-center gap-2.5">
              <Sparkles className="w-4 h-4 text-blue-400 shrink-0" />
              <span>
                Faculty profiles and coaching records are synchronized with local persistence. You can add new mentors, update bios, and maintain expertise tags anytime.
              </span>
            </div>
            <button
              onClick={handleOpenAddMentor}
              className="px-3 py-1 rounded-lg bg-blue-600 hover:bg-blue-500 text-white font-bold transition text-xs shrink-0"
            >
              Add Mentor
            </button>
          </div>
        </div>
      )}

      {/* TAB 1: TEAM ROSTER & GEAR TRACKER */}
      {activeTab === 'roster' && (
        <div className="space-y-6">
          {/* T-Shirt & Quick Stats Bar */}
          <div className="grid grid-cols-2 sm:grid-cols-4 lg:grid-cols-6 gap-3">
            <div className="p-3.5 rounded-2xl bg-slate-900/70 border border-white/10 space-y-1">
              <div className="text-[11px] font-mono text-slate-400">Total Members</div>
              <div className="text-xl font-bold text-white flex items-center gap-2">
                <span>{members.length}</span>
                <span className="text-[11px] font-normal text-cyan-400">Grades 9–12</span>
              </div>
            </div>

            <div className="p-3.5 rounded-2xl bg-slate-900/70 border border-white/10 space-y-1">
              <div className="text-[11px] font-mono text-slate-400 flex items-center gap-1.5">
                <Shirt className="w-3.5 h-3.5 text-pink-400" />
                <span>Pink Gear Orders</span>
              </div>
              <div className="text-xl font-bold text-pink-400 flex items-center gap-2">
                <span>{pinkCount}</span>
                <span className="text-[10px] font-mono text-slate-400">Requests</span>
              </div>
            </div>

            <div className="p-3.5 rounded-2xl bg-slate-900/70 border border-white/10 space-y-1">
              <div className="text-[11px] font-mono text-slate-400">Size S Orders</div>
              <div className="text-xl font-bold text-cyan-300">{tshirtStats['S'] || 0}</div>
            </div>

            <div className="p-3.5 rounded-2xl bg-slate-900/70 border border-white/10 space-y-1">
              <div className="text-[11px] font-mono text-slate-400">Size M Orders</div>
              <div className="text-xl font-bold text-cyan-300">{tshirtStats['M'] || 0}</div>
            </div>

            <div className="p-3.5 rounded-2xl bg-slate-900/70 border border-white/10 space-y-1">
              <div className="text-[11px] font-mono text-slate-400">Size L Orders</div>
              <div className="text-xl font-bold text-cyan-300">{tshirtStats['L'] || 0}</div>
            </div>

            <div className="p-3.5 rounded-2xl bg-slate-900/70 border border-white/10 space-y-1">
              <div className="text-[11px] font-mono text-slate-400">Pending Sizes</div>
              <div className="text-xl font-bold text-amber-400">
                {members.filter(m => !m.tshirtSize && m.grade !== 'Faculty Advisor').length}
              </div>
            </div>
          </div>

          {/* Search and Filters */}
          <div className="flex flex-col md:flex-row gap-3 items-center justify-between p-3.5 rounded-2xl bg-slate-900/60 border border-white/10">
            {/* Search Input */}
            <div className="relative w-full md:w-80">
              <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Search students, specialty, competition..."
                className="w-full pl-9 pr-4 py-2 bg-slate-950 rounded-xl border border-white/10 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-cyan-500 transition"
              />
              {searchQuery && (
                <button 
                  onClick={() => setSearchQuery('')}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-500 hover:text-white text-xs"
                >
                  <X className="w-3.5 h-3.5" />
                </button>
              )}
            </div>

            {/* Filter Pills */}
            <div className="flex flex-wrap items-center gap-2 w-full md:w-auto">
              {/* Grade Filter */}
              <div className="flex items-center gap-1 bg-slate-950 p-1 rounded-xl border border-white/10 text-xs">
                <span className="text-[10px] font-mono text-slate-500 px-2 uppercase">Grade:</span>
                {['All', 'Grade 9', 'Grade 10', 'Grade 11', 'Grade 12'].map(grade => (
                  <button
                    key={grade}
                    onClick={() => setSelectedGrade(grade)}
                    className={`px-2 py-1 rounded-lg text-xs transition ${
                      selectedGrade === grade
                        ? 'bg-cyan-600 text-white font-semibold'
                        : 'text-slate-400 hover:text-white'
                    }`}
                  >
                    {grade === 'All' ? 'All' : grade.replace('Grade ', 'G')}
                  </button>
                ))}
              </div>

              {/* Division Select */}
              <select
                value={selectedDivision}
                onChange={(e) => setSelectedDivision(e.target.value)}
                className="px-3 py-1.5 rounded-xl bg-slate-950 border border-white/10 text-xs text-slate-300 focus:outline-none focus:border-cyan-500"
              >
                <option value="All">All Divisions</option>
                <option value="Software & Autonomous">Software & Autonomous</option>
                <option value="Hardware & CAD">Hardware & CAD</option>
                <option value="Electrical & Systems">Electrical & Systems</option>
                <option value="Business & Outreach">Business & Outreach</option>
                <option value="Mentorship">Mentorship</option>
              </select>
            </div>
          </div>

          {/* Student Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {filteredMembers.map((student) => (
              <div
                key={student.id}
                className="p-5 rounded-2xl bg-slate-900/60 border border-white/10 hover:border-cyan-500/40 hover:bg-slate-900/90 transition flex flex-col justify-between space-y-4 group relative"
              >
                <div className="space-y-3">
                  <div className="flex items-start justify-between gap-2">
                    <div>
                      <div className="flex items-center gap-2">
                        {student.profileUrl || student.name.toLowerCase().includes('aarti') ? (
                          <a
                            href={student.profileUrl || 'https://ai-aarti.com'}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="font-bold text-base text-white hover:text-cyan-300 transition group/link inline-flex items-center gap-1.5 underline decoration-cyan-500/30 hover:decoration-cyan-400 underline-offset-4"
                            title="Visit Aarti Sri Ravikumar's Portfolio (https://ai-aarti.com)"
                          >
                            <span>{student.name}</span>
                            <ExternalLink className="w-3.5 h-3.5 text-cyan-400 opacity-80 group-hover/link:opacity-100 group-hover/link:translate-x-0.5 group-hover/link:-translate-y-0.5 transition shrink-0" />
                          </a>
                        ) : (
                          <h3 className="font-bold text-base text-white group-hover:text-cyan-300 transition">
                            {student.name}
                          </h3>
                        )}
                        <span className="px-2 py-0.5 rounded text-[10px] font-mono font-bold bg-cyan-950 text-cyan-300 border border-cyan-800/40">
                          {student.grade}
                        </span>
                      </div>
                      <div className="text-xs text-slate-400 font-medium mt-0.5">
                        {student.role}
                      </div>
                    </div>

                    {/* Card Actions */}
                    <div className="flex items-center gap-1 opacity-80 group-hover:opacity-100 transition">
                      <button
                        onClick={() => handleOpenEdit(student)}
                        className="p-1.5 rounded-lg bg-white/[0.05] hover:bg-cyan-950 hover:text-cyan-300 text-slate-400 transition"
                        title="Edit student details & t-shirt"
                      >
                        <Edit3 className="w-3.5 h-3.5" />
                      </button>
                      <button
                        onClick={() => handleDeleteStudent(student.id, student.name)}
                        className="p-1.5 rounded-lg bg-white/[0.05] hover:bg-rose-950 hover:text-rose-400 text-slate-400 transition"
                        title="Delete member"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  </div>

                  {/* Division Badge */}
                  <div>
                    <span className="text-[10px] font-mono uppercase tracking-wider px-2 py-0.5 rounded bg-slate-950 text-slate-300 border border-white/10">
                      {student.division}
                    </span>
                  </div>

                  {/* Specialty / Role */}
                  <div className="text-xs text-slate-300 leading-relaxed border-t border-white/[0.06] pt-2 space-y-2">
                    <p>
                      <strong className="text-cyan-400 font-mono">Specialty: </strong>
                      <span>{student.specialty}</span>
                    </p>

                    {/* Dedicated External Research & Portfolio Quick-Links */}
                    {(student.profileUrl || student.specialtyUrl || student.name.toLowerCase().includes('aarti')) && (
                      <div className="flex flex-wrap gap-1.5 pt-1">
                        <a
                          href={student.profileUrl || 'https://ai-aarti.com'}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="inline-flex items-center gap-1 px-2.5 py-1 rounded-lg bg-cyan-950/80 hover:bg-cyan-900 text-cyan-300 border border-cyan-500/30 text-[11px] font-mono transition"
                          title="Visit personal portfolio"
                        >
                          <span>Portfolio</span>
                          <ExternalLink className="w-2.5 h-2.5 text-cyan-400" />
                        </a>
                        <a
                          href={student.specialtyUrl?.replace('pubications.', 'publications.') || 'https://publications.ai-aarti.com'}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="inline-flex items-center gap-1 px-2.5 py-1 rounded-lg bg-purple-950/80 hover:bg-purple-900 text-purple-300 border border-purple-500/30 text-[11px] font-mono transition"
                          title="View published technical papers & research"
                        >
                          <span>Publications</span>
                          <ExternalLink className="w-2.5 h-2.5 text-purple-400" />
                        </a>
                      </div>
                    )}
                  </div>

                  {/* Competition Assignment & Due Date */}
                  {student.competition && (
                    <div className="p-2 rounded-xl bg-cyan-950/40 border border-cyan-500/20 flex items-center justify-between text-xs font-mono text-cyan-300">
                      <span className="truncate flex items-center gap-1.5">
                        <Award className="w-3.5 h-3.5 text-cyan-400 shrink-0" />
                        <span className="truncate">{student.competition}</span>
                      </span>
                      {student.competitionDeadline && (
                        <span className="text-[10px] text-amber-300 shrink-0 font-bold ml-2">
                          {student.competitionDeadline}
                        </span>
                      )}
                    </div>
                  )}

                  {/* Notes / Special remarks */}
                  {student.notes && (
                    <div className="text-[11px] text-slate-400 italic bg-slate-950/50 p-2 rounded-xl border border-white/5">
                      &quot;{student.notes}&quot;
                    </div>
                  )}
                </div>

                {/* Card Footer: Gear Status */}
                <div className="pt-3 border-t border-white/[0.08] flex items-center justify-between text-xs font-mono">
                  <div className="flex items-center gap-2">
                    <Shirt className="w-3.5 h-3.5 text-slate-400" />
                    {student.tshirtSize ? (
                      <span className="text-slate-200">
                        Size: <strong className="text-cyan-300">{student.tshirtSize}</strong>
                      </span>
                    ) : (
                      <span className="text-amber-400/80 text-[11px]">Size Pending</span>
                    )}
                  </div>

                  {student.tshirtColor ? (
                    <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-pink-950/80 text-pink-300 border border-pink-500/30">
                      {student.tshirtColor}
                    </span>
                  ) : (
                    <span className="text-[10px] text-slate-500">Default Color</span>
                  )}
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* TAB 2: COMPETITIONS & CHALLENGES */}
      {activeTab === 'competitions' && (
        <div className="space-y-6 animate-in fade-in duration-200">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-2 border-b border-white/5">
            <div>
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full text-xs font-bold tracking-wider uppercase bg-emerald-500/10 text-emerald-400 border border-emerald-500/30 font-mono mb-2">
                <Award className="w-3.5 h-3.5 text-emerald-400" />
                <span>SEASON TOURNAMENTS & HACKATHONS</span>
              </div>
              <h3 className="text-xl sm:text-2xl font-extrabold text-white tracking-tight">Season Tournaments & Engineering Challenges</h3>
              <p className="text-xs sm:text-sm text-slate-400">All registered competitions, aerospace challenges, and target milestone deadlines for 2026</p>
            </div>
            <button
              onClick={handleOpenAddCompetition}
              className="flex items-center gap-2 px-4 py-2.5 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white text-xs font-bold transition shadow-lg shadow-emerald-950/40 shrink-0"
            >
              <Plus className="w-4 h-4" />
              <span>+ Propose / Add Competition</span>
            </button>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
            {competitions.map((comp) => (
              <div
                key={comp.id}
                className="p-5 sm:p-6 rounded-3xl bg-slate-900/80 border border-white/10 hover:border-emerald-500/40 transition space-y-4 flex flex-col justify-between shadow-xl shadow-slate-950/40 group backdrop-blur-xl"
              >
                <div className="space-y-3">
                  <div className="flex items-start justify-between gap-3">
                    <div className="space-y-1.5 flex-1 min-w-0">
                      <div className="flex flex-wrap items-center gap-2">
                        <span className="text-[10px] font-mono font-bold uppercase tracking-wider px-2.5 py-0.5 rounded-md bg-slate-950 text-emerald-300 border border-emerald-500/30">
                          {comp.category}
                        </span>
                        <span className={`text-[10px] font-mono px-2.5 py-0.5 rounded-md font-bold ${
                          comp.status === 'Active R&D'
                            ? 'bg-cyan-950 text-cyan-300 border border-cyan-500/30'
                            : comp.status === 'Registration Open'
                            ? 'bg-amber-950 text-amber-300 border border-amber-500/30'
                            : comp.status === 'Submitted'
                            ? 'bg-emerald-950 text-emerald-300 border border-emerald-500/30'
                            : 'bg-slate-950 text-slate-400 border border-white/10'
                        }`}>
                          {comp.status}
                        </span>
                      </div>
                      <h4 className="text-base sm:text-lg font-extrabold text-white group-hover:text-emerald-300 transition truncate">
                        {comp.name}
                      </h4>
                    </div>

                    {/* Actions: Edit & Delete */}
                    <div className="flex items-center gap-1.5 shrink-0 opacity-90 group-hover:opacity-100 transition">
                      <button
                        onClick={() => handleOpenEditCompetition(comp)}
                        className="p-2 rounded-xl bg-white/[0.04] hover:bg-emerald-500/20 text-slate-400 hover:text-emerald-300 border border-white/5 transition"
                        title="Edit competition"
                      >
                        <Edit3 className="w-3.5 h-3.5" />
                      </button>
                      <button
                        onClick={() => handleDeleteCompetition(comp.id, comp.name)}
                        className="p-2 rounded-xl bg-white/[0.04] hover:bg-rose-500/20 text-slate-400 hover:text-rose-400 border border-white/5 transition"
                        title="Delete competition"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  </div>

                  {comp.deadline && (
                    <div className="flex items-center gap-2 text-xs font-mono font-bold text-amber-400 bg-amber-950/30 px-3 py-1.5 rounded-xl border border-amber-500/20 w-fit">
                      <Calendar className="w-3.5 h-3.5 text-amber-400 shrink-0" />
                      <span>Deadline: {comp.deadline}</span>
                    </div>
                  )}

                  <p className="text-xs sm:text-sm text-slate-300 leading-relaxed font-normal">
                    {comp.description}
                  </p>

                  {comp.venue && (
                    <div className="text-xs text-slate-400 flex items-center gap-1.5 font-mono pt-1">
                      <Award className="w-3.5 h-3.5 text-emerald-400 shrink-0" />
                      <span>{comp.venue}</span>
                    </div>
                  )}
                </div>

                {/* Assigned Squad Members */}
                <div className="pt-3.5 border-t border-white/[0.08] flex items-center justify-between text-xs">
                  <div className="flex items-center gap-2">
                    <span className="text-[11px] font-mono text-slate-400">Assigned:</span>
                    <div className="flex flex-wrap gap-1.5">
                      {comp.assignedStudents && comp.assignedStudents.length > 0 ? (
                        comp.assignedStudents.map((studentName, idx) => (
                          <span
                            key={idx}
                            className="px-2.5 py-0.5 rounded-md text-[11px] bg-slate-950 text-cyan-300 border border-cyan-500/30 font-medium"
                          >
                            {studentName}
                          </span>
                        ))
                      ) : (
                        <span className="text-[11px] text-slate-500 italic">Open for volunteers</span>
                      )}
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* TAB 3: STRATEGIC PROPOSALS & STUDENT IDEAS */}
      {activeTab === 'proposals' && (
        <div className="space-y-6 animate-in fade-in duration-200">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-2 border-b border-white/5">
            <div>
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full text-xs font-bold tracking-wider uppercase bg-purple-500/10 text-purple-400 border border-purple-500/30 font-mono mb-2">
                <Lightbulb className="w-3.5 h-3.5 text-purple-400" />
                <span>STUDENT STRATEGIC INITIATIVES</span>
              </div>
              <h3 className="text-xl sm:text-2xl font-extrabold text-white tracking-tight">Student Strategic Proposals & Initiatives</h3>
              <p className="text-xs sm:text-sm text-slate-400">
                Ideas submitted by team members (featuring proposals on tutoring, curriculum, and inclusive recruitment). Upvote, edit, or submit new initiatives!
              </p>
            </div>
            <button
              onClick={handleOpenAddProposal}
              className="flex items-center gap-2 px-4 py-2.5 rounded-xl bg-purple-600 hover:bg-purple-500 text-white text-xs font-bold transition shadow-lg shadow-purple-950/40 shrink-0"
            >
              <Plus className="w-4 h-4" />
              <span>+ Propose New Initiative</span>
            </button>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
            {proposals.map((prop) => (
              <div
                key={prop.id}
                className="p-5 sm:p-6 rounded-3xl bg-slate-900/80 border border-white/10 hover:border-purple-500/40 transition space-y-4 flex flex-col justify-between shadow-xl shadow-slate-950/40 group backdrop-blur-xl"
              >
                <div className="space-y-3">
                  <div className="flex items-start justify-between gap-3">
                    <div className="space-y-1.5 flex-1 min-w-0">
                      <div className="flex flex-wrap items-center gap-2">
                        <span className="text-[10px] font-mono font-bold uppercase tracking-wider px-2.5 py-0.5 rounded-md bg-slate-950 text-purple-300 border border-purple-500/30">
                          {prop.category}
                        </span>
                        <span className={`text-[10px] font-mono px-2.5 py-0.5 rounded-md font-bold ${
                          prop.status === 'Approved by Leads'
                            ? 'bg-emerald-950 text-emerald-300 border border-emerald-500/30'
                            : prop.status === 'In Action'
                            ? 'bg-cyan-950 text-cyan-300 border border-cyan-500/30'
                            : 'bg-slate-950 text-amber-300 border border-amber-500/30'
                        }`}>
                          {prop.status}
                        </span>
                      </div>
                      <h4 className="text-base sm:text-lg font-extrabold text-white group-hover:text-purple-300 transition">
                        {prop.title}
                      </h4>
                    </div>

                    {/* Actions: Edit, Delete, Upvote */}
                    <div className="flex items-center gap-1.5 shrink-0">
                      <button
                        onClick={() => handleOpenEditProposal(prop)}
                        className="p-2 rounded-xl bg-white/[0.04] hover:bg-purple-500/20 text-slate-400 hover:text-purple-300 border border-white/5 transition"
                        title="Edit strategic proposal"
                      >
                        <Edit3 className="w-3.5 h-3.5" />
                      </button>
                      <button
                        onClick={() => handleDeleteProposal(prop.id, prop.title)}
                        className="p-2 rounded-xl bg-white/[0.04] hover:bg-rose-500/20 text-slate-400 hover:text-rose-400 border border-white/5 transition"
                        title="Delete proposal"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>
                      <button
                        onClick={() => handleUpvote(prop.id)}
                        className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-purple-950/80 hover:bg-purple-900 text-purple-300 border border-purple-500/40 text-xs font-bold transition group/vote"
                        title="Support this student proposal"
                      >
                        <ThumbsUp className="w-3.5 h-3.5 group-hover/vote:scale-110 transition-transform text-purple-400" />
                        <span>{prop.votes}</span>
                      </button>
                    </div>
                  </div>

                  <p className="text-xs sm:text-sm text-slate-300 leading-relaxed bg-slate-950/50 p-3.5 rounded-2xl border border-white/5 font-normal">
                    &quot;{prop.proposal}&quot;
                  </p>

                  {/* Tags */}
                  <div className="flex flex-wrap gap-1.5 pt-1">
                    {prop.tags.map((tag, i) => (
                      <span
                        key={i}
                        className="px-2.5 py-0.5 rounded-md text-[10px] font-mono bg-white/[0.04] text-slate-400 border border-white/5"
                      >
                        #{tag}
                      </span>
                    ))}
                  </div>
                </div>

                {/* Footer Author & Date */}
                <div className="pt-3.5 border-t border-white/[0.08] flex items-center justify-between text-xs text-slate-400 font-mono">
                  <div className="flex items-center gap-1.5">
                    <span className="text-slate-500">Proposed by:</span>
                    <strong className="text-white">{prop.author}</strong>
                    {prop.authorGrade && (
                      <span className="text-[10px] text-cyan-400 font-bold">({prop.authorGrade})</span>
                    )}
                  </div>
                  <span>{prop.date}</span>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* TAB 4: FREE CLOUD DATABASE ARCHITECTURE GUIDE */}
      {activeTab === 'database' && (
        <div className="space-y-8 p-6 sm:p-8 rounded-3xl bg-slate-900/80 border border-white/10 backdrop-blur-2xl">
          <div className="space-y-3">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full text-xs font-semibold bg-amber-950/80 text-amber-300 border border-amber-500/30 font-mono">
              <Database className="w-3.5 h-3.5 text-amber-400" />
              <span>FREE DATABASE ARCHITECTURE RECOMMENDATION</span>
            </div>
            <h2 className="text-2xl sm:text-3xl font-extrabold text-white">
              Recommended Free Databases for PCSS II Robotics
            </h2>
            <p className="text-sm text-slate-300 max-w-3xl leading-relaxed">
              To allow all students and mentors to add, edit, and vote in real time from any phone or computer without paying a dime, here are the top 3 free cloud persistence solutions tailored for school robotics teams.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {/* Recommendation 1: Firebase Firestore */}
            <div className="p-6 rounded-2xl bg-slate-950 border border-amber-500/40 space-y-4 relative flex flex-col justify-between shadow-xl shadow-amber-950/20">
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <span className="px-2.5 py-1 rounded-md text-[10px] font-mono font-bold bg-amber-950 text-amber-300 border border-amber-500/30">
                    TOP RECOMMENDATION #1
                  </span>
                  <span className="text-xs font-bold text-emerald-400">100% Free Forever</span>
                </div>
                <h3 className="text-lg font-bold text-white">Google Cloud Firebase (Firestore)</h3>
                <p className="text-xs text-slate-400 leading-relaxed">
                  Google&apos;s generous Spark Tier provides real-time multi-device sync, meaning when a student updates their T-shirt size or proposes an event, everyone&apos;s screen updates instantly with zero page reload.
                </p>

                <div className="space-y-2 pt-2 border-t border-white/10 text-xs font-mono">
                  <div className="flex justify-between text-slate-300">
                    <span>Free Storage:</span>
                    <strong className="text-white">1 GB (Plenty for ~5,000 students)</strong>
                  </div>
                  <div className="flex justify-between text-slate-300">
                    <span>Daily Free Reads:</span>
                    <strong className="text-emerald-400">50,000 reads / day</strong>
                  </div>
                  <div className="flex justify-between text-slate-300">
                    <span>Daily Free Writes:</span>
                    <strong className="text-emerald-400">20,000 writes / day</strong>
                  </div>
                  <div className="flex justify-between text-slate-300">
                    <span>Credit Card Req:</span>
                    <strong className="text-emerald-400">NO Credit Card Required</strong>
                  </div>
                  <div className="flex justify-between text-slate-300">
                    <span>School Login:</span>
                    <strong className="text-cyan-300">Direct Google/PCSS Auth</strong>
                  </div>
                </div>
              </div>

              <div className="p-3 rounded-xl bg-amber-950/30 border border-amber-500/20 text-[11px] text-amber-200">
                <strong>How to enable:</strong> Just tell the assistant: <em>&quot;Set up Firebase for team roster storage&quot;</em> and it will immediately configure persistent cloud Firestore tables!
              </div>
            </div>

            {/* Recommendation 2: Supabase */}
            <div className="p-6 rounded-2xl bg-slate-950 border border-white/10 space-y-4 flex flex-col justify-between">
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <span className="px-2.5 py-1 rounded-md text-[10px] font-mono font-bold bg-slate-900 text-slate-300 border border-white/10">
                    OPTION #2
                  </span>
                  <span className="text-xs font-bold text-emerald-400">Free Tier</span>
                </div>
                <h3 className="text-lg font-bold text-white">Supabase (PostgreSQL)</h3>
                <p className="text-xs text-slate-400 leading-relaxed">
                  An open-source PostgreSQL database with instant RESTful APIs and table views that look like an online spreadsheet.
                </p>

                <div className="space-y-2 pt-2 border-t border-white/10 text-xs font-mono">
                  <div className="flex justify-between text-slate-300">
                    <span>Free Storage:</span>
                    <strong className="text-white">500 MB relational database</strong>
                  </div>
                  <div className="flex justify-between text-slate-300">
                    <span>Row Level Security:</span>
                    <strong className="text-emerald-400">Included</strong>
                  </div>
                  <div className="flex justify-between text-slate-300">
                    <span>Best For:</span>
                    <strong className="text-white">Relational SQL queries</strong>
                  </div>
                </div>
              </div>

              <div className="p-3 rounded-xl bg-white/[0.04] border border-white/10 text-[11px] text-slate-400">
                Ideal if the student software team wants to practice SQL queries and relational table joins.
              </div>
            </div>

            {/* Recommendation 3: Google Sheets API / AppSheet */}
            <div className="p-6 rounded-2xl bg-slate-950 border border-white/10 space-y-4 flex flex-col justify-between">
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <span className="px-2.5 py-1 rounded-md text-[10px] font-mono font-bold bg-slate-900 text-slate-300 border border-white/10">
                    OPTION #3
                  </span>
                  <span className="text-xs font-bold text-emerald-400">Google Drive Native</span>
                </div>
                <h3 className="text-lg font-bold text-white">Google Sheets as Database</h3>
                <p className="text-xs text-slate-400 leading-relaxed">
                  Use the Google Sheets spreadsheet directly via Google Apps Script or Sheety API. Teachers and advisors can view and edit rows directly in Google Drive.
                </p>

                <div className="space-y-2 pt-2 border-t border-white/10 text-xs font-mono">
                  <div className="flex justify-between text-slate-300">
                    <span>Accessibility:</span>
                    <strong className="text-white">Native Google Sheets UI</strong>
                  </div>
                  <div className="flex justify-between text-slate-300">
                    <span>Advisor Access:</span>
                    <strong className="text-cyan-300">Zero tech barrier</strong>
                  </div>
                  <div className="flex justify-between text-slate-300">
                    <span>Cost:</span>
                    <strong className="text-emerald-400">$0 via Google Workspace</strong>
                  </div>
                </div>
              </div>

              <div className="p-3 rounded-xl bg-white/[0.04] border border-white/10 text-[11px] text-slate-400">
                Perfect if club advisors prefer seeing real-time updates directly in their standard Google Drive spreadsheet.
              </div>
            </div>
          </div>

          {/* Current Local Persistence Status Banner */}
          <div className="p-4 rounded-2xl bg-cyan-950/40 border border-cyan-500/30 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
            <div className="flex items-center gap-3">
              <ShieldCheck className="w-5 h-5 text-cyan-400 shrink-0" />
              <div>
                <div className="font-bold text-xs text-white">
                  Local Browser Persistence Is Active Right Now
                </div>
                <div className="text-[11px] text-slate-400">
                  Any students you add, t-shirts you edit, or proposals you submit are automatically saved to your browser&apos;s local storage.
                </div>
              </div>
            </div>

            <div className="flex items-center gap-2 shrink-0">
              <button
                onClick={handleExportCsv}
                className="px-3 py-1.5 rounded-xl bg-cyan-600 hover:bg-cyan-500 text-white text-xs font-bold transition flex items-center gap-1.5"
              >
                <Download className="w-3.5 h-3.5" />
                <span>Export CSV Backup</span>
              </button>
            </div>
          </div>
        </div>
      )}

      {/* MODAL: ADD / EDIT STUDENT */}
      {isAddStudentOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-md animate-in fade-in duration-150">
          <div className="w-full max-w-lg rounded-3xl bg-slate-900 border border-white/10 shadow-2xl p-6 space-y-5 max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between pb-3 border-b border-white/10">
              <div className="flex items-center gap-2">
                <UserPlus className="w-4 h-4 text-cyan-400" />
                <h3 className="font-bold text-white text-base">
                  {editingStudent ? 'Edit Student Details' : 'Add New Student Member'}
                </h3>
              </div>
              <button 
                onClick={() => setIsAddStudentOpen(false)}
                className="p-1 rounded-lg text-slate-400 hover:text-white"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <form onSubmit={handleSaveStudent} className="space-y-4 text-xs">
              <div>
                <label className="block text-slate-300 font-medium mb-1">Full Student Name *</label>
                <input
                  type="text"
                  required
                  value={studentForm.name || ''}
                  onChange={(e) => setStudentForm({ ...studentForm, name: e.target.value })}
                  placeholder="e.g. Aarti Ravikumar"
                  className="w-full px-3 py-2 rounded-xl bg-slate-950 border border-white/10 text-white focus:outline-none focus:border-cyan-500"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-slate-300 font-medium mb-1">Grade Level</label>
                  <select
                    value={studentForm.grade || 'Grade 9'}
                    onChange={(e) => setStudentForm({ ...studentForm, grade: e.target.value })}
                    className="w-full px-3 py-2 rounded-xl bg-slate-950 border border-white/10 text-white focus:outline-none focus:border-cyan-500"
                  >
                    <option value="Grade 9">Grade 9</option>
                    <option value="Grade 10">Grade 10</option>
                    <option value="Grade 11">Grade 11</option>
                    <option value="Grade 12">Grade 12</option>
                    <option value="Faculty Advisor">Faculty Advisor</option>
                  </select>
                </div>

                <div>
                  <label className="block text-slate-300 font-medium mb-1">Division</label>
                  <select
                    value={studentForm.division || 'Software & Autonomous'}
                    onChange={(e) => setStudentForm({ ...studentForm, division: e.target.value as any })}
                    className="w-full px-3 py-2 rounded-xl bg-slate-950 border border-white/10 text-white focus:outline-none focus:border-cyan-500"
                  >
                    <option value="Software & Autonomous">Software & Autonomous</option>
                    <option value="Hardware & CAD">Hardware & CAD</option>
                    <option value="Electrical & Systems">Electrical & Systems</option>
                    <option value="Business & Outreach">Business & Outreach</option>
                    <option value="Mentorship">Mentorship</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="block text-slate-300 font-medium mb-1">Squad Role / Title</label>
                <input
                  type="text"
                  value={studentForm.role || ''}
                  onChange={(e) => setStudentForm({ ...studentForm, role: e.target.value })}
                  placeholder="e.g. Lead Systems Architect"
                  className="w-full px-3 py-2 rounded-xl bg-slate-950 border border-white/10 text-white focus:outline-none focus:border-cyan-500"
                />
              </div>

              <div>
                <label className="block text-slate-300 font-medium mb-1">Specialty & Skills</label>
                <input
                  type="text"
                  value={studentForm.specialty || ''}
                  onChange={(e) => setStudentForm({ ...studentForm, specialty: e.target.value })}
                  placeholder="e.g. CubeSat flight telemetry, Onshape CAD, RoadRunner splines"
                  className="w-full px-3 py-2 rounded-xl bg-slate-950 border border-white/10 text-white focus:outline-none focus:border-cyan-500"
                />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block text-slate-300 font-medium mb-1 flex items-center gap-1">
                    <span>Personal Portfolio URL</span>
                    <ExternalLink className="w-3 h-3 text-cyan-400" />
                  </label>
                  <input
                    type="url"
                    value={studentForm.profileUrl || ''}
                    onChange={(e) => setStudentForm({ ...studentForm, profileUrl: e.target.value })}
                    placeholder="https://ai-aarti.com"
                    className="w-full px-3 py-2 rounded-xl bg-slate-950 border border-white/10 text-white focus:outline-none focus:border-cyan-500 text-xs"
                  />
                </div>

                <div>
                  <label className="block text-slate-300 font-medium mb-1 flex items-center gap-1">
                    <span>Specialty / Publications URL</span>
                    <ExternalLink className="w-3 h-3 text-cyan-400" />
                  </label>
                  <input
                    type="url"
                    value={studentForm.specialtyUrl || ''}
                    onChange={(e) => setStudentForm({ ...studentForm, specialtyUrl: e.target.value })}
                    placeholder="https://publications.ai-aarti.com"
                    className="w-full px-3 py-2 rounded-xl bg-slate-950 border border-white/10 text-white focus:outline-none focus:border-cyan-500 text-xs"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-slate-300 font-medium mb-1">Competition Assigned</label>
                  <input
                    type="text"
                    value={studentForm.competition || ''}
                    onChange={(e) => setStudentForm({ ...studentForm, competition: e.target.value })}
                    placeholder="e.g. Cubesat Challenge"
                    className="w-full px-3 py-2 rounded-xl bg-slate-950 border border-white/10 text-white focus:outline-none focus:border-cyan-500"
                  />
                </div>

                <div>
                  <label className="block text-slate-300 font-medium mb-1">Due Date / Deadline</label>
                  <input
                    type="text"
                    value={studentForm.competitionDeadline || ''}
                    onChange={(e) => setStudentForm({ ...studentForm, competitionDeadline: e.target.value })}
                    placeholder="e.g. 10/19 Due Date"
                    className="w-full px-3 py-2 rounded-xl bg-slate-950 border border-white/10 text-white focus:outline-none focus:border-cyan-500"
                  />
                </div>
              </div>

              {/* T-Shirt & Color */}
              <div className="p-3.5 rounded-2xl bg-slate-950 border border-white/10 space-y-3">
                <div className="font-semibold text-slate-200 flex items-center gap-1.5">
                  <Shirt className="w-3.5 h-3.5 text-pink-400" />
                  <span>Team Apparel Gear Order</span>
                </div>

                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="block text-slate-400 text-[11px] mb-1">T-Shirt Size</label>
                    <select
                      value={studentForm.tshirtSize || 'M'}
                      onChange={(e) => setStudentForm({ ...studentForm, tshirtSize: e.target.value as any })}
                      className="w-full px-3 py-1.5 rounded-xl bg-slate-900 border border-white/10 text-white focus:outline-none focus:border-cyan-500 text-xs"
                    >
                      <option value="">Select Size...</option>
                      <option value="XS">XS</option>
                      <option value="S">S</option>
                      <option value="M">M</option>
                      <option value="L">L</option>
                      <option value="XL">XL</option>
                      <option value="XXL">XXL</option>
                    </select>
                  </div>

                  <div>
                    <label className="block text-slate-400 text-[11px] mb-1">Pick a Color</label>
                    <input
                      type="text"
                      value={studentForm.tshirtColor || 'Pink'}
                      onChange={(e) => setStudentForm({ ...studentForm, tshirtColor: e.target.value })}
                      placeholder="e.g. Pink"
                      className="w-full px-3 py-1.5 rounded-xl bg-slate-900 border border-white/10 text-white focus:outline-none focus:border-cyan-500 text-xs"
                    />
                  </div>
                </div>
              </div>

              <div>
                <label className="block text-slate-300 font-medium mb-1">Notes / Links</label>
                <textarea
                  rows={2}
                  value={studentForm.notes || ''}
                  onChange={(e) => setStudentForm({ ...studentForm, notes: e.target.value })}
                  placeholder="Additional remarks, contact notes, project links..."
                  className="w-full px-3 py-2 rounded-xl bg-slate-950 border border-white/10 text-white focus:outline-none focus:border-cyan-500"
                />
              </div>

              <div className="pt-2 flex justify-end gap-2">
                <button
                  type="button"
                  onClick={() => setIsAddStudentOpen(false)}
                  className="px-4 py-2 rounded-xl bg-white/[0.05] hover:bg-white/[0.1] text-slate-300 transition"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 rounded-xl bg-cyan-600 hover:bg-cyan-500 text-white font-bold transition shadow-md shadow-cyan-950/50"
                >
                  {editingStudent ? 'Save Changes' : 'Add to Roster'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* MODAL: ADD / EDIT COMPETITION */}
      {isAddCompOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-md animate-in fade-in duration-150">
          <div className="w-full max-w-lg rounded-3xl bg-slate-900 border border-white/10 shadow-2xl p-6 sm:p-7 space-y-5 max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between pb-3 border-b border-white/10">
              <div className="flex items-center gap-2">
                <Award className="w-5 h-5 text-emerald-400" />
                <h3 className="font-bold text-white text-base sm:text-lg">
                  {editingComp ? 'Edit Competition / Challenge' : 'Propose / Add Competition'}
                </h3>
              </div>
              <button 
                onClick={() => {
                  setIsAddCompOpen(false);
                  setEditingComp(null);
                }}
                className="p-1.5 rounded-lg text-slate-400 hover:text-white hover:bg-white/10 transition"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <form onSubmit={handleSaveCompetition} className="space-y-4 text-xs">
              <div>
                <label className="block text-slate-300 font-medium mb-1">Competition / Event Name *</label>
                <input
                  type="text"
                  required
                  value={compForm.name || ''}
                  onChange={(e) => setCompForm({ ...compForm, name: e.target.value })}
                  placeholder="e.g. Battlecry @ WPI or FTC State Qualifier"
                  className="w-full px-3.5 py-2.5 rounded-xl bg-slate-950 border border-white/10 text-white placeholder-slate-500 focus:outline-none focus:border-emerald-500"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-slate-300 font-medium mb-1">Category</label>
                  <select
                    value={compForm.category || 'FIRST & VEX'}
                    onChange={(e) => setCompForm({ ...compForm, category: e.target.value as any })}
                    className="w-full px-3 py-2.5 rounded-xl bg-slate-950 border border-white/10 text-white focus:outline-none focus:border-emerald-500"
                  >
                    <option value="FIRST & VEX">FIRST & VEX</option>
                    <option value="Satellite & Aerospace">Satellite & Aerospace</option>
                    <option value="Aerial & Drones">Aerial & Drones</option>
                    <option value="Digital & Media">Digital & Media</option>
                    <option value="Hackathon & Coding">Hackathon & Coding</option>
                  </select>
                </div>

                <div>
                  <label className="block text-slate-300 font-medium mb-1">Status</label>
                  <select
                    value={compForm.status || 'Active R&D'}
                    onChange={(e) => setCompForm({ ...compForm, status: e.target.value as any })}
                    className="w-full px-3 py-2.5 rounded-xl bg-slate-950 border border-white/10 text-white focus:outline-none focus:border-emerald-500"
                  >
                    <option value="Active R&D">Active R&D</option>
                    <option value="Registration Open">Registration Open</option>
                    <option value="In Planning">In Planning</option>
                    <option value="Submitted">Submitted</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="block text-slate-300 font-medium mb-1">Deadline / Target Date</label>
                <input
                  type="text"
                  value={compForm.deadline || ''}
                  onChange={(e) => setCompForm({ ...compForm, deadline: e.target.value })}
                  placeholder="e.g. October 19, 2026 or Spring 2026"
                  className="w-full px-3.5 py-2.5 rounded-xl bg-slate-950 border border-white/10 text-white placeholder-slate-500 focus:outline-none focus:border-emerald-500"
                />
              </div>

              <div>
                <label className="block text-slate-300 font-medium mb-1">Venue / Location</label>
                <input
                  type="text"
                  value={compForm.venue || ''}
                  onChange={(e) => setCompForm({ ...compForm, venue: e.target.value })}
                  placeholder="e.g. Worcester Polytechnic Institute (WPI)"
                  className="w-full px-3.5 py-2.5 rounded-xl bg-slate-950 border border-white/10 text-white placeholder-slate-500 focus:outline-none focus:border-emerald-500"
                />
              </div>

              <div>
                <label className="block text-slate-300 font-medium mb-1">Assigned Squad Members (Comma-separated)</label>
                <input
                  type="text"
                  value={compStudentInput}
                  onChange={(e) => setCompStudentInput(e.target.value)}
                  placeholder="e.g. Aarti Ravikumar, Kevin Romero, Manal Mahfudh"
                  className="w-full px-3.5 py-2.5 rounded-xl bg-slate-950 border border-white/10 text-white placeholder-slate-500 focus:outline-none focus:border-emerald-500"
                />
              </div>

              <div>
                <label className="block text-slate-300 font-medium mb-1">Description & Goals</label>
                <textarea
                  rows={3}
                  value={compForm.description || ''}
                  onChange={(e) => setCompForm({ ...compForm, description: e.target.value })}
                  placeholder="Describe the competition format, robot requirements, or objectives..."
                  className="w-full px-3.5 py-2.5 rounded-xl bg-slate-950 border border-white/10 text-white placeholder-slate-500 focus:outline-none focus:border-emerald-500"
                />
              </div>

              <div className="pt-3 flex justify-end gap-2 border-t border-white/10">
                <button
                  type="button"
                  onClick={() => {
                    setIsAddCompOpen(false);
                    setEditingComp(null);
                  }}
                  className="px-4 py-2.5 rounded-xl bg-white/[0.05] hover:bg-white/[0.1] text-slate-300 transition font-medium"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-5 py-2.5 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white font-bold transition shadow-md shadow-emerald-950/50"
                >
                  {editingComp ? 'Save Changes' : 'Add Competition'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* MODAL: ADD / EDIT PROPOSAL */}
      {isAddPropOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-md animate-in fade-in duration-150">
          <div className="w-full max-w-lg rounded-3xl bg-slate-900 border border-white/10 shadow-2xl p-6 sm:p-7 space-y-5 max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between pb-3 border-b border-white/10">
              <div className="flex items-center gap-2">
                <Lightbulb className="w-5 h-5 text-purple-400" />
                <h3 className="font-bold text-white text-base sm:text-lg">
                  {editingProp ? 'Edit Strategic Proposal' : 'Submit Strategic Club Proposal'}
                </h3>
              </div>
              <button 
                onClick={() => {
                  setIsAddPropOpen(false);
                  setEditingProp(null);
                }}
                className="p-1.5 rounded-lg text-slate-400 hover:text-white hover:bg-white/10 transition"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <form onSubmit={handleSaveProposal} className="space-y-4 text-xs">
              <div>
                <label className="block text-slate-300 font-medium mb-1">Proposal Title *</label>
                <input
                  type="text"
                  required
                  value={propForm.title || ''}
                  onChange={(e) => setPropForm({ ...propForm, title: e.target.value })}
                  placeholder="e.g. Peer Mentorship & Sprint Tutoring Program"
                  className="w-full px-3.5 py-2.5 rounded-xl bg-slate-950 border border-white/10 text-white placeholder-slate-500 focus:outline-none focus:border-purple-500"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-slate-300 font-medium mb-1">Your Name</label>
                  <input
                    type="text"
                    value={propForm.author || ''}
                    onChange={(e) => setPropForm({ ...propForm, author: e.target.value })}
                    placeholder="e.g. Manal Mahfudh"
                    className="w-full px-3.5 py-2.5 rounded-xl bg-slate-950 border border-white/10 text-white placeholder-slate-500 focus:outline-none focus:border-purple-500"
                  />
                </div>

                <div>
                  <label className="block text-slate-300 font-medium mb-1">Grade</label>
                  <select
                    value={propForm.authorGrade || 'Grade 9'}
                    onChange={(e) => setPropForm({ ...propForm, authorGrade: e.target.value })}
                    className="w-full px-3 py-2.5 rounded-xl bg-slate-950 border border-white/10 text-white focus:outline-none focus:border-purple-500"
                  >
                    <option value="Grade 9">Grade 9</option>
                    <option value="Grade 10">Grade 10</option>
                    <option value="Grade 11">Grade 11</option>
                    <option value="Grade 12">Grade 12</option>
                    <option value="Faculty / Mentor">Faculty / Mentor</option>
                  </select>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-slate-300 font-medium mb-1">Category</label>
                  <select
                    value={propForm.category || 'Training & Curriculum'}
                    onChange={(e) => setPropForm({ ...propForm, category: e.target.value as any })}
                    className="w-full px-3 py-2.5 rounded-xl bg-slate-950 border border-white/10 text-white focus:outline-none focus:border-purple-500"
                  >
                    <option value="Training & Curriculum">Training & Curriculum</option>
                    <option value="Fundraising & Tutoring">Fundraising & Tutoring</option>
                    <option value="Competitions & Fairs">Competitions & Fairs</option>
                    <option value="Culture & Diversity">Culture & Diversity</option>
                    <option value="Hackathons & Events">Hackathons & Events</option>
                  </select>
                </div>

                <div>
                  <label className="block text-slate-300 font-medium mb-1">Status</label>
                  <select
                    value={propForm.status || 'Student Proposal'}
                    onChange={(e) => setPropForm({ ...propForm, status: e.target.value as any })}
                    className="w-full px-3 py-2.5 rounded-xl bg-slate-950 border border-white/10 text-white focus:outline-none focus:border-purple-500"
                  >
                    <option value="Student Proposal">Student Proposal</option>
                    <option value="Under Review">Under Review</option>
                    <option value="Approved by Leads">Approved by Leads</option>
                    <option value="In Action">In Action</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="block text-slate-300 font-medium mb-1">Detailed Proposal & Rationale *</label>
                <textarea
                  rows={4}
                  required
                  value={propForm.proposal || ''}
                  onChange={(e) => setPropForm({ ...propForm, proposal: e.target.value })}
                  placeholder="Explain your proposal, why it helps the team, and how students can get involved..."
                  className="w-full px-3.5 py-2.5 rounded-xl bg-slate-950 border border-white/10 text-white placeholder-slate-500 focus:outline-none focus:border-purple-500"
                />
              </div>

              <div>
                <label className="block text-slate-300 font-medium mb-1">Tags (Comma-separated)</label>
                <input
                  type="text"
                  value={propTagsInput}
                  onChange={(e) => setPropTagsInput(e.target.value)}
                  placeholder="e.g. Tutoring, Fundraiser, Academics"
                  className="w-full px-3.5 py-2.5 rounded-xl bg-slate-950 border border-white/10 text-white placeholder-slate-500 focus:outline-none focus:border-purple-500"
                />
              </div>

              <div className="pt-3 flex justify-end gap-2 border-t border-white/10">
                <button
                  type="button"
                  onClick={() => {
                    setIsAddPropOpen(false);
                    setEditingProp(null);
                  }}
                  className="px-4 py-2.5 rounded-xl bg-white/[0.05] hover:bg-white/[0.1] text-slate-300 transition font-medium"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-5 py-2.5 rounded-xl bg-purple-600 hover:bg-purple-500 text-white font-bold transition shadow-md shadow-purple-950/50"
                >
                  {editingProp ? 'Save Changes' : 'Submit Proposal'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* MODAL: ADD / EDIT FACULTY MENTOR */}
      {isAddMentorOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-md animate-in fade-in duration-150">
          <div className="w-full max-w-xl rounded-3xl bg-slate-900 border border-white/10 shadow-2xl p-6 sm:p-7 space-y-5 max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between pb-3 border-b border-white/10">
              <div className="flex items-center gap-2">
                <GraduationCap className="w-4 h-4 text-blue-400" />
                <h3 className="font-bold text-white text-base">
                  {editingMentor ? 'Edit Mentor Profile' : 'Add New Faculty Mentor / Sponsor'}
                </h3>
              </div>
              <button 
                onClick={() => setIsAddMentorOpen(false)}
                className="p-1 rounded-lg text-slate-400 hover:text-white"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <form onSubmit={handleSaveMentor} className="space-y-4 text-xs">
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                <div className="sm:col-span-2">
                  <label className="block text-slate-300 font-medium mb-1">Full Name & Honorific *</label>
                  <input
                    type="text"
                    required
                    value={mentorForm.name || ''}
                    onChange={(e) => setMentorForm({ ...mentorForm, name: e.target.value })}
                    placeholder="e.g. Mr. Isa Kilic or Dr. Marcus Vance"
                    className="w-full px-3 py-2 rounded-xl bg-slate-950 border border-white/10 text-white focus:outline-none focus:border-blue-500"
                  />
                </div>

                <div className="flex items-center sm:pt-6">
                  <label className="flex items-center gap-2 cursor-pointer select-none">
                    <input
                      type="checkbox"
                      checked={!!mentorForm.isLead}
                      onChange={(e) => setMentorForm({ ...mentorForm, isLead: e.target.checked })}
                      className="w-4 h-4 rounded border-white/20 bg-slate-950 text-blue-600 focus:ring-0"
                    />
                    <span className="text-slate-300 font-medium">Lead Mentor</span>
                  </label>
                </div>
              </div>

              <div>
                <label className="block text-slate-300 font-medium mb-1">Role / Technical Title *</label>
                <input
                  type="text"
                  required
                  value={mentorForm.role || ''}
                  onChange={(e) => setMentorForm({ ...mentorForm, role: e.target.value })}
                  placeholder="e.g. Lead Mentor, Systems Integration"
                  className="w-full px-3 py-2 rounded-xl bg-slate-950 border border-white/10 text-white focus:outline-none focus:border-blue-500"
                />
              </div>

              <div>
                <label className="block text-slate-300 font-medium mb-1">Tagline / Key Responsibility</label>
                <input
                  type="text"
                  value={mentorForm.tagline || ''}
                  onChange={(e) => setMentorForm({ ...mentorForm, tagline: e.target.value })}
                  placeholder="e.g. Mentors autonomous architecture, safety reviews, and build-season decision frameworks."
                  className="w-full px-3 py-2 rounded-xl bg-slate-950 border border-white/10 text-white focus:outline-none focus:border-blue-500"
                />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block text-slate-300 font-medium mb-1">Seasons Coached (Number)</label>
                  <input
                    type="number"
                    min="1"
                    max="50"
                    value={mentorForm.seasonsCount || 1}
                    onChange={(e) => setMentorForm({ ...mentorForm, seasonsCount: Number(e.target.value) })}
                    className="w-full px-3 py-2 rounded-xl bg-slate-950 border border-white/10 text-white focus:outline-none focus:border-blue-500"
                  />
                </div>

                <div>
                  <label className="block text-slate-300 font-medium mb-1">Stat Label</label>
                  <input
                    type="text"
                    value={mentorForm.statLabel || ''}
                    onChange={(e) => setMentorForm({ ...mentorForm, statLabel: e.target.value })}
                    placeholder="e.g. STUDENT TEAMS COACHED"
                    className="w-full px-3 py-2 rounded-xl bg-slate-950 border border-white/10 text-white focus:outline-none focus:border-blue-500"
                  />
                </div>
              </div>

              <div>
                <label className="block text-slate-300 font-medium mb-1">Professional Bio & Experience</label>
                <textarea
                  rows={2}
                  value={mentorForm.bio || ''}
                  onChange={(e) => setMentorForm({ ...mentorForm, bio: e.target.value })}
                  placeholder="e.g. Former controls engineer who now helps students convert ambiguous ideas into measurable sprint plans."
                  className="w-full px-3 py-2 rounded-xl bg-slate-950 border border-white/10 text-white focus:outline-none focus:border-blue-500"
                />
              </div>

              <div>
                <label className="block text-slate-300 font-medium mb-1">Guiding Quote / Philosophy</label>
                <input
                  type="text"
                  value={mentorForm.quote || ''}
                  onChange={(e) => setMentorForm({ ...mentorForm, quote: e.target.value })}
                  placeholder="e.g. Great teams are not built on heroics. They are built on repeatable learning."
                  className="w-full px-3 py-2 rounded-xl bg-slate-950 border border-white/10 text-white focus:outline-none focus:border-blue-500"
                />
              </div>

              <div>
                <label className="block text-slate-300 font-medium mb-1">Expertise Tags (Comma-separated)</label>
                <input
                  type="text"
                  value={mentorTagsInput}
                  onChange={(e) => setMentorTagsInput(e.target.value)}
                  placeholder="e.g. Control systems, Design reviews, Competition strategy"
                  className="w-full px-3 py-2 rounded-xl bg-slate-950 border border-white/10 text-white focus:outline-none focus:border-blue-500"
                />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block text-slate-300 font-medium mb-1">Avatar / Photo URL</label>
                  <input
                    type="url"
                    value={mentorForm.avatarUrl || ''}
                    onChange={(e) => setMentorForm({ ...mentorForm, avatarUrl: e.target.value })}
                    placeholder="https://..."
                    className="w-full px-3 py-2 rounded-xl bg-slate-950 border border-white/10 text-white focus:outline-none focus:border-blue-500"
                  />
                </div>

                <div>
                  <label className="block text-slate-300 font-medium mb-1">Email Address</label>
                  <input
                    type="email"
                    value={mentorForm.email || ''}
                    onChange={(e) => setMentorForm({ ...mentorForm, email: e.target.value })}
                    placeholder="ikilic@pcss.org"
                    className="w-full px-3 py-2 rounded-xl bg-slate-950 border border-white/10 text-white focus:outline-none focus:border-blue-500"
                  />
                </div>
              </div>

              <div className="pt-2 flex justify-end gap-2">
                <button
                  type="button"
                  onClick={() => setIsAddMentorOpen(false)}
                  className="px-4 py-2 rounded-xl bg-white/[0.05] hover:bg-white/[0.1] text-slate-300 transition"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 rounded-xl bg-blue-600 hover:bg-blue-500 text-white font-bold transition shadow-md shadow-blue-950/50"
                >
                  {editingMentor ? 'Save Changes' : 'Add Mentor'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </section>
  );
};
