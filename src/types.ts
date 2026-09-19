export type NavSection = 
  | 'home'
  | 'research'
  | 'robots'
  | 'simulator'
  | 'sponsors'
  | 'outreach'
  | 'arcade'
  | 'team';

export interface ResearchPaper {
  id: string;
  reportId: string;
  doi: string;
  title: string;
  authors: string[];
  affiliation: string;
  venue: string;
  date: string;
  category: 'Kinematics & Controls' | 'Mechanical Dynamics' | 'Computer Vision' | 'STEM Pedagogy';
  abstract: string;
  keywords: string[];
  bibtex: string;
  ieeeCitation: string;
  keyTheorems: {
    title: string;
    type: 'Definition' | 'Theorem' | 'Lemma' | 'Empirical Finding';
    content: string;
    latexFormula?: string;
  }[];
  empiricalData: {
    metric: string;
    baseline: string;
    proposedMethod: string;
    delta: string;
    significance: string;
  }[];
  conclusions: string;
}

export interface LabInstrument {
  id: string;
  name: string;
  model: string;
  category: 'Fabrication & CNC' | 'Additive Manufacturing' | 'Signal Analysis & Electronics' | 'Metrology & Odometry';
  specifications: string;
  role: string;
  precision: string;
}

export interface RobotSpec {
  id: string;
  name: string;
  season: string;
  game: string;
  status: 'Active Competition' | 'Historical Flagship' | 'Heritage Platform';
  weight: string;
  dimensions: string;
  drivetrain: string;
  motors: string;
  sensors: string[];
  autonomousHighlight: string;
  cycleTime: string;
  cadLink?: string;
  description: string;
  subsystems: {
    name: string;
    description: string;
    specs: string;
  }[];
}

export interface SponsorTier {
  id: string;
  name: string;
  minAmount: number;
  badge: string;
  color: string;
  perks: string[];
  estimatedImpressions: string;
  taxDeductiblePercent: number;
}

export interface TelemetryState {
  x: number;
  y: number;
  heading: number;
  velocity: number;
  batteryVoltage: number;
  specimenCount: number;
  status: string;
}

export interface TeamMember {
  id: string;
  name: string;
  role: string;
  division: 'Hardware & CAD' | 'Software & Autonomous' | 'Electrical & Systems' | 'Business & Outreach' | 'Mentorship';
  grade: string;
  specialty: string;
  profileUrl?: string;
  specialtyUrl?: string;
  competition?: string;
  competitionDeadline?: string;
  tshirtSize?: 'XS' | 'S' | 'M' | 'L' | 'XL' | 'XXL' | '';
  tshirtColor?: string;
  notes?: string;
}

export interface CompetitionChallenge {
  id: string;
  name: string;
  category: 'Aerial & Drones' | 'Satellite & Aerospace' | 'FIRST & VEX' | 'Digital & Media' | 'Hackathon & Coding';
  deadline?: string;
  assignedStudents: string[];
  status: 'In Planning' | 'Active R&D' | 'Registration Open' | 'Submitted';
  description: string;
  link?: string;
  venue?: string;
}

export interface FacultyMentor {
  id: string;
  name: string;
  role: string;
  tagline: string;
  seasonsCount: number;
  statLabel?: string;
  bio: string;
  quote?: string;
  expertiseTags: string[];
  avatarUrl?: string;
  email?: string;
  isLead?: boolean;
}

export interface StrategicProposal {
  id: string;
  title: string;
  author: string;
  authorGrade?: string;
  category: 'Training & Curriculum' | 'Fundraising & Tutoring' | 'Competitions & Fairs' | 'Culture & Diversity' | 'Hackathons & Events';
  proposal: string;
  votes: number;
  status: 'Student Proposal' | 'Under Review' | 'Approved by Leads' | 'In Action';
  date: string;
  tags: string[];
}

export type TargetType = 'repo' | 'website' | 'overall' | 'github';
export type PriorityLevel = 'P0 - Critical' | 'P1 - High' | 'P2 - Medium' | 'P3 - Low / Polish' | 'P0' | 'P1' | 'P2' | 'P3';

export interface RubricCategory {
  id: string;
  name: string;
  target: TargetType;
  weight: number;
  score: number;
  grade?: string;
  summary?: string;
  description?: string;
  badge?: string;
  strengths: string[];
  weaknesses: string[];
  evidence: string;
}

export interface Recommendation {
  id: string;
  priority: PriorityLevel;
  target: TargetType;
  title: string;
  impact: string;
  effort: string;
  currentIssue?: string;
  recommendedFix?: string;
  description?: string;
  filePath?: string;
  codeSnippet?: string;
  codeSolution?: string;
}

export interface MetricCard {
  label: string;
  value: string | number;
  sublabel?: string;
  subtext?: string;
  change?: string;
  status: 'positive' | 'negative' | 'warning' | 'neutral' | 'optimal' | 'critical';
}

export interface ToastMessage {
  id: string;
  type: 'success' | 'info' | 'cyan' | 'purple';
  title: string;
  message?: string;
}
