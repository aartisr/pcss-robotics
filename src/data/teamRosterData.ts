import { TeamMember, CompetitionChallenge, StrategicProposal, FacultyMentor } from '../types';

export const INITIAL_FACULTY_MENTORS: FacultyMentor[] = [
  {
    id: 'mentor-1',
    name: 'Mr. Isa Kilic',
    role: 'Lead Mentor, Systems Integration',
    tagline: 'Mentors autonomous architecture, safety reviews, and build-season decision frameworks.',
    seasonsCount: 12,
    statLabel: 'STUDENT TEAMS COACHED',
    bio: 'Former controls engineer who now helps students convert ambiguous ideas into measurable sprint plans.',
    quote: 'Great teams are not built on heroics. They are built on repeatable learning.',
    expertiseTags: ['Control systems', 'Design reviews', 'Competition strategy'],
    avatarUrl: 'https://images.unsplash.com/photo-1581092160607-ee22621dd758?auto=format&fit=crop&w=400&q=80',
    email: 'ikilic@pcss.org',
    isLead: true
  },
  {
    id: 'mentor-2',
    name: 'Dr. Marcus Vance',
    role: 'Faculty Sponsor & STEM Research Advisor',
    tagline: 'Oversees 501(c)(3) compliance, academic research grants, and lab safety protocols.',
    seasonsCount: 8,
    statLabel: 'SEF REGIONAL FINALISTS',
    bio: 'Physics and Computer Science faculty advisor mentoring students on IEEE technical papers, CubeSat flight tests, and regional Science Fairs.',
    quote: 'Rigorous engineering is empowering our next generation to reach higher altitudes.',
    expertiseTags: ['Grant funding', 'Lab safety', 'Academic research'],
    avatarUrl: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=400&q=80',
    email: 'mvance@pcss.org',
    isLead: false
  }
];

export const INITIAL_TEAM_ROSTER: TeamMember[] = [
  {
    id: 'student-1',
    name: 'Aarti Sri Ravikumar',
    role: 'Lead Systems Architect & Flight Lead',
    division: 'Software & Autonomous',
    grade: 'Grade 9',
    specialty: 'CubeSat Flight Software, Telemetry Pipelines & Java FTC SDK',
    profileUrl: 'https://ai-aarti.com',
    specialtyUrl: 'https://publications.ai-aarti.com',
    competition: 'Cubesat Challenge',
    competitionDeadline: '10/19 Due Date',
    tshirtSize: 'M',
    tshirtColor: 'Pink',
    notes: 'Submitted CubeSat software proposal; targeting 10/19 submission.'
  },
  {
    id: 'student-2',
    name: 'Eyad Abdelrahman',
    role: 'Hardware Fabricator & Field Prep Lead',
    division: 'Hardware & CAD',
    grade: 'Grade 9',
    specialty: 'Chassis Machining, Rapid Prototyping & Field Logistics',
    competition: 'Field Trip & Qualifier Prep',
    competitionDeadline: 'Upcoming Field Event',
    tshirtSize: 'M',
    notes: 'Coordinating event logistics and pit transport equipment.'
  },
  {
    id: 'student-3',
    name: 'Emily Portillo',
    role: 'Hackathon & Autonomous Developer',
    division: 'Software & Autonomous',
    grade: 'Grade 9',
    specialty: 'Algorithm Design, React Telemetry UIs & WIN Hackathon Dev',
    competition: 'WIN Student Hackathon',
    competitionDeadline: 'Contact WIN',
    notes: 'Point of contact for WIN Hackathon registration.'
  },
  {
    id: 'student-4',
    name: 'Avni Pisharody',
    role: 'Mechanical CAD Designer',
    division: 'Hardware & CAD',
    grade: 'Grade 9',
    specialty: 'Onshape 3D Modeling, 3D Print Tolerancing & Linkages',
    competition: 'FTC #23548 Chassis Iteration',
    tshirtSize: 'M',
    tshirtColor: 'Pink'
  },
  {
    id: 'student-5',
    name: 'Anthony Corpuz',
    role: 'Electrical & Power Systems Specialist',
    division: 'Electrical & Systems',
    grade: 'Grade 10',
    specialty: 'REV Hub Power Distribution, Fuse Protection & Wiring Harnesses',
    competition: 'Kraken V2 Electrical Certification',
    tshirtSize: 'M',
    tshirtColor: 'Pink'
  },
  {
    id: 'student-6',
    name: 'Toyesh Vyas',
    role: 'Drivetrain & Precision Machining Lead',
    division: 'Hardware & CAD',
    grade: 'Grade 10',
    specialty: 'Mecanum Gearbox Tolerances, CNC Routing & Carbon Plates',
    competition: 'Battle of Lexington',
    tshirtSize: 'L',
    tshirtColor: 'Pink'
  },
  {
    id: 'student-7',
    name: 'Raaina Syed',
    role: 'Creative Media & Communications Lead',
    division: 'Business & Outreach',
    grade: 'Grade 10',
    specialty: 'Digital Animation Award, Brand Design & Video Documentation',
    competition: 'Digital Animation on Technology Award',
    notes: 'Directing the team digital animation submission.'
  },
  {
    id: 'student-8',
    name: 'Raimeet Saini',
    role: 'Autonomous Pathing & Sensor Specialist',
    division: 'Software & Autonomous',
    grade: 'Grade 10',
    specialty: 'SparkFun OTOS Odometry, EKF Sensor Fusion & Auto Splines',
    competition: 'FTC #23548 Autonomous Lab',
    tshirtSize: 'M',
    tshirtColor: 'Pink'
  },
  {
    id: 'student-9',
    name: 'Reem Ferahi',
    role: 'Outreach Coordinator & Sponsor Relations',
    division: 'Business & Outreach',
    grade: 'Grade 10',
    specialty: 'Corporate Sponsorship Portfolios & Saugus Middle School Camps',
    competition: 'Circuit 2026 Feeder Clinics'
  },
  {
    id: 'student-10',
    name: 'Mirsab Masud',
    role: 'Intake Subsystem Designer',
    division: 'Hardware & CAD',
    grade: 'Grade 10',
    specialty: 'Compliant Roller Intakes, Torque Geartrains & 3D Prototyping',
    competition: 'Into The Deep Cascade R&D'
  },
  {
    id: 'student-11',
    name: 'Jeffrey Pop',
    role: 'Embedded Firmware & Hub Specialist',
    division: 'Electrical & Systems',
    grade: 'Grade 11',
    specialty: 'I2C Sensor Bus Debugging, Battery Voltage Monitors & Cabling',
    competition: 'JROTC Drone Challenge'
  },
  {
    id: 'student-12',
    name: 'Manal Mahfudh',
    role: 'Director of Strategy, Culture & Competitions',
    division: 'Business & Outreach',
    grade: 'Grade 11',
    specialty: 'Strategic Proposals, Cross-Discipline Recruitment & Curriculum',
    competition: 'Battlecry @ WPI & SEF Fairs',
    notes: 'Authored 6 comprehensive club proposals on tutoring, curriculum, and inclusive recruitment.'
  },
  {
    id: 'student-13',
    name: 'Mohammed Mendouk',
    role: 'Computer Vision & Target Tracking Lead',
    division: 'Software & Autonomous',
    grade: 'Grade 11',
    specialty: 'OpenCV AprilTag Detection, Kalman Filters & Neural Classifiers',
    competition: 'FTC State Championship'
  },
  {
    id: 'student-14',
    name: 'Yousef Ghonime',
    role: 'Structural Dynamics & Stress Analysis Lead',
    division: 'Hardware & CAD',
    grade: 'Grade 11',
    specialty: 'FEA Stress Modeling, Cascade Cable Rigging & Weight Optimization',
    competition: 'Kraken V2 Upgrades'
  },
  {
    id: 'student-15',
    name: 'Elias Belkheira',
    role: 'Signal Integrity & High-Speed Bus Engineer',
    division: 'Electrical & Systems',
    grade: 'Grade 11',
    specialty: 'Nanosecond Signal Oscilloscopes & Odometry Calibration',
    competition: 'JROTC Drone Challenge'
  },
  {
    id: 'student-16',
    name: 'Kevin Romero',
    role: 'Chief Mechanical Fabricator',
    division: 'Hardware & CAD',
    grade: 'Grade 12',
    specialty: 'Manual & CNC Mill Operations, Billet Aluminum Machining',
    competition: 'Battlecry @ WPI'
  },
  {
    id: 'student-17',
    name: 'Kevin Le',
    role: 'Autonomous Controls & Trajectory Engineer',
    division: 'Software & Autonomous',
    grade: 'Grade 12',
    specialty: 'Hermite Spline Trajectories, Feedforward Velocity Tuning & Java SDK',
    competition: 'FTC #23548 Qualifiers'
  },
  {
    id: 'student-18',
    name: 'Zoe Hannon',
    role: 'Grants, Finance & 501(c)(3) Compliance Officer',
    division: 'Business & Outreach',
    grade: 'Grade 12',
    specialty: 'Non-Profit Tax Filings, Corporate Match Portfolios & Financial Audits',
    competition: 'Corporate Sponsor Pitch',
    tshirtSize: 'S'
  },
  {
    id: 'student-19',
    name: 'Parth Shetty',
    role: 'Power Management & Telemetry Sensor Lead',
    division: 'Electrical & Systems',
    grade: 'Grade 11',
    specialty: 'Battery Impedance Testing, CAN Bus Telemetry & Diagnostics',
    competition: 'VEX Robotics Regional'
  },
  {
    id: 'mentor-1',
    name: 'Dr. Marcus Vance',
    role: 'Lead Mentor & Robotics Advisor',
    division: 'Mentorship',
    grade: 'Faculty Advisor',
    specialty: 'Aerospace Engineering, Control Systems Theory & FIRST Safety Advisor',
    competition: 'All Season Events',
    tshirtSize: 'XL'
  }
];

export const INITIAL_COMPETITIONS: CompetitionChallenge[] = [
  {
    id: 'comp-1',
    name: 'CubeSat Aerospace Challenge',
    category: 'Satellite & Aerospace',
    deadline: 'October 19, 2026',
    assignedStudents: ['Aarti Sri Ravikumar'],
    status: 'Active R&D',
    description: 'Design and prototype a high-altitude CubeSat payload with orbital telemetry logging, solar array simulator, and atmospheric pressure sensing.',
    venue: 'NASA / Aerospace Educational Consortium'
  },
  {
    id: 'comp-2',
    name: 'FTC #23548 // INTO THE DEEP',
    category: 'FIRST & VEX',
    deadline: 'January 24, 2026',
    assignedStudents: ['Raimeet Saini', 'Kevin Le', 'Mohammed Mendouk', 'Toyesh Vyas', 'Anthony Corpuz'],
    status: 'Active R&D',
    description: 'Flagship FIRST Tech Challenge season competing with Kraken V2 featuring 500Hz EKF odometry, 42-inch cascade lift, and high-speed autonomous scoring.',
    venue: 'Massachusetts FTC Qualifying Tournaments'
  },
  {
    id: 'comp-3',
    name: 'Battlecry @ WPI',
    category: 'FIRST & VEX',
    deadline: 'May 16, 2026',
    assignedStudents: ['Kevin Romero', 'Manal Mahfudh', 'Yousef Ghonime'],
    status: 'Registration Open',
    description: 'Premier off-season high-intensity robotics battle invitational hosted at Worcester Polytechnic Institute with top East Coast contenders.',
    venue: 'Worcester Polytechnic Institute (WPI), Worcester, MA'
  },
  {
    id: 'comp-4',
    name: 'Digital Animation on Technology Award',
    category: 'Digital & Media',
    deadline: 'December 12, 2026',
    assignedStudents: ['Raaina Syed', 'Manal Mahfudh'],
    status: 'Active R&D',
    description: 'Merging humanities, storytelling, and 3D digital animation to convey the societal impact of youth robotics and aerospace technologies.',
    venue: 'FIRST Global Animation Submission'
  },
  {
    id: 'comp-5',
    name: 'JROTC Drone Obstacle Challenge',
    category: 'Aerial & Drones',
    deadline: 'November 20, 2026',
    assignedStudents: ['Jeffrey Pop', 'Elias Belkheira'],
    status: 'Active R&D',
    description: 'Autonomous flight programming and FPV precision piloting through tight indoor 3D aerial obstacle courses and payload drops.',
    venue: 'Regional Aerospace Flight Pavilion'
  },
  {
    id: 'comp-6',
    name: 'WIN Student Hackathon',
    category: 'Hackathon & Coding',
    deadline: 'November 8, 2026',
    assignedStudents: ['Emily Portillo'],
    status: 'Registration Open',
    description: 'Rapid 24-hour collaborative software sprint focused on STEM equity, computer vision tools, and community mobile platforms.',
    venue: 'Women In Networks (WIN) Hub'
  },
  {
    id: 'comp-7',
    name: 'Battle of Lexington Off-Season Challenge',
    category: 'FIRST & VEX',
    deadline: 'October 28, 2026',
    assignedStudents: ['Toyesh Vyas', 'Eyad Abdelrahman'],
    status: 'Active R&D',
    description: 'Regional Massachusetts off-season showdown testing updated Kraken V2 intake tolerances against top Boston-area teams.',
    venue: 'Lexington, MA'
  },
  {
    id: 'comp-8',
    name: 'VEX Robotics Regional Tournament',
    category: 'FIRST & VEX',
    deadline: 'December 5, 2026',
    assignedStudents: ['Parth Shetty'],
    status: 'In Planning',
    description: 'Fast-paced VEX competition squad exploring dual-format robotic kinematics and low-latency drive control.',
    venue: 'Boston Metro VEX Arena'
  }
];

export const INITIAL_PROPOSALS: StrategicProposal[] = [
  {
    id: 'prop-1',
    title: 'Training & Skills Curriculum Inspired by Peer Programs',
    author: 'Manal Mahfudh',
    authorGrade: 'Grade 11',
    category: 'Training & Curriculum',
    proposal: 'Establish structured training workshops and class modules for VEX Robotics and FTC rookie skill-building, modeled after benchmark schools (e.g. Revere High) that provide dedicated team skill tracks.',
    votes: 24,
    status: 'Approved by Leads',
    date: '2026-09-18',
    tags: ['Curriculum', 'Rookie Training', 'VEX', 'FTC']
  },
  {
    id: 'prop-2',
    title: 'Finals-Season Sprint Tutoring & STEM Public Education',
    author: 'Manal Mahfudh',
    authorGrade: 'Grade 11',
    category: 'Fundraising & Tutoring',
    proposal: 'Leverage our strong STEM proficiency to organize high-yield peer tutoring clinics during midterm and finals weeks. Serves as community academic support while generating fundraising for robot machining.',
    votes: 31,
    status: 'Approved by Leads',
    date: '2026-09-18',
    tags: ['Tutoring', 'Fundraiser', 'Academics', 'Community']
  },
  {
    id: 'prop-3',
    title: 'Science & Engineering Fair (SEF) Coaching Workshops',
    author: 'Manal Mahfudh',
    authorGrade: 'Grade 11',
    category: 'Competitions & Fairs',
    proposal: 'Host dedicated coaching sessions for students entering engineering, biology, and scientific inquiry projects into Network, Regional, and Massachusetts State SEF fairs where PCSS students already excel.',
    votes: 19,
    status: 'Under Review',
    date: '2026-09-18',
    tags: ['SEF', 'Science Fair', 'Research', 'Mentorship']
  },
  {
    id: 'prop-4',
    title: 'Interdisciplinary Recruitment for Humanities, Arts & Finance',
    author: 'Manal Mahfudh',
    authorGrade: 'Grade 11',
    category: 'Culture & Diversity',
    proposal: 'Actively expand robotics club messaging across the student body. Welcome future digital artists for animation/CAD, pre-law students for game rules/ethics, finance students for budgeting, and writers for grants.',
    votes: 38,
    status: 'In Action',
    date: '2026-09-18',
    tags: ['Recruitment', 'Arts & Design', 'Inclusion', 'Diversity']
  },
  {
    id: 'prop-5',
    title: 'Hackathon Format Redesign: Accessible 2–6h Sprints',
    author: 'Manal Mahfudh',
    authorGrade: 'Grade 11',
    category: 'Hackathons & Events',
    proposal: 'Restructure school hackathons from intimidating multi-day events into focused, exciting 2-6 hour after-school sessions. Emphasize that events are NOT straight CS, welcoming all skill levels with free food and takeaways.',
    votes: 27,
    status: 'Under Review',
    date: '2026-09-18',
    tags: ['Hackathons', 'Event Design', 'Accessibility']
  },
  {
    id: 'prop-6',
    title: 'Cross-Club Collaboration & Synergistic Fundraising',
    author: 'Manal Mahfudh',
    authorGrade: 'Grade 11',
    category: 'Fundraising & Tutoring',
    proposal: 'Tie fundraising events directly into robotics/STEM demonstrations, and consult with high-earning student clubs for best practices on bake sales, maker fairs, and collaborative school events.',
    votes: 22,
    status: 'Student Proposal',
    date: '2026-09-18',
    tags: ['Fundraising', 'Collaboration', 'Bake Sales']
  }
];
