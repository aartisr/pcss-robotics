export type NavSection = 
  | 'home'
  | 'research'
  | 'robots'
  | 'simulator'
  | 'sponsors'
  | 'outreach'
  | 'arcade'
  | 'team';

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
