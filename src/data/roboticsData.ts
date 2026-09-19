import { RobotSpec, SponsorTier, TeamMember } from '../types';

export const TEAM_PROFILE = {
  teamName: 'PCSS II Robotics',
  teamNumber: '23548',
  motto: 'Build boldly. Compete graciously. Lead with STEM.',
  school: 'Pioneer Charter School of Science II',
  location: 'Saugus, Massachusetts',
  region: 'Massachusetts North Shore / Essex County',
  nonprofitStatus: '501(c)(3) Tax-Exempt Public Charity',
  contactEmail: 'robotics@pcss2.org',
  canonicalUrl: 'https://www.pcssiirobotics.org/',
  activeSeason: '2025-2026 FTC: INTO THE DEEP presented by RTX',
  championshipRank: 'State Qualifier Contender & Inspire Award Finalist',
  stats: [
    { label: 'FTC Team Number', value: '#23548', sub: 'FIRST Tech Challenge' },
    { label: 'Active Students', value: '38 Members', sub: 'Grades 6–12' },
    { label: 'STEM Outreach', value: '450+ Youth', sub: 'FLL & VEX Mentored' },
    { label: 'Autonomous Accuracy', value: '98.4%', sub: 'RoadRunner Odometry' },
    { label: '501(c)(3) Charity', value: '100% Tax Deductible', sub: 'Corporate Giving' },
    { label: 'Telemetry Frequency', value: '500 Hz', sub: 'Optical Sensor Bus' }
  ]
};

export const ROBOTS_DATA: RobotSpec[] = [
  {
    id: 'kraken-v2',
    name: 'Kraken V2',
    season: '2025–2026 Season',
    game: 'INTO THE DEEP℠',
    status: 'Active Competition',
    weight: '36.8 lbs (Under 42 lb Limit)',
    dimensions: '17.8" × 17.6" × 14.2" (18" Cube Compliant)',
    drivetrain: '4× REV HD Hex Mecanum Drivetrain with Pinpoint Odometry',
    motors: '8× REV UltraPlanetary Motors (19.2:1 & 3.7:1 Dual-Stage Planetary)',
    sensors: [
      'REV 2m Distance Sensor',
      'SparkFun OTOS Pinpoint Optical Odometry (0.01" Precision)',
      'HuskyLens 2.0 AI Computer Vision (AprilTag & Specimen Hue Filter)',
      'REV Color Sensor V3 (Sub-millisecond Sample Sorting)'
    ],
    autonomousHighlight: 'Pre-loaded Specimen Hook + 4-Sample Submersible Cascade (112 pts Autonomous)',
    cycleTime: '3.2s TeleOp Submersible-to-Chamber Cycle',
    description: 'Custom CNC aluminum and carbon-fiber hybrid chassis purpose-built for the INTO THE DEEP challenge. Features a high-speed multi-stage continuous cascading linear slide, custom compliant roller intake with optical color discrimination, and high-frequency Kalman filter odometry.',
    subsystems: [
      {
        name: 'Continuous Cascading Elevator',
        description: 'Multi-stage linear slide actuated by dual high-torque REV UltraPlanetary motors with Kevlar-reinforced dyneema rigging.',
        specs: '42" Maximum Extension in 0.65s with closed-loop PIDF positional control and magnetic limit stops.'
      },
      {
        name: 'Compliant Active Sample Intake',
        description: '3D-printed TPU variable-durometer intake stars paired with a 2-stage four-bar linkage for low-profile horizontal reach into the submersible.',
        specs: '180° wrist pitch, active passive anti-jam backdrive, and REV Color Sensor V3 sorting logic.'
      },
      {
        name: 'Pinpoint Odometry & Computer Vision',
        description: 'SparkFun optical tracking odometry sensor delivering real-time X/Y/Theta ground kinematics coupled with HuskyLens vision for AprilTag alignment.',
        specs: '500 Hz telemetry loop rate, 0.05° heading accuracy, and RoadRunner v1.0.2 motion profiling.'
      }
    ]
  },
  {
    id: 'aerostrike',
    name: 'AeroStrike',
    season: '2024–2025 Season',
    game: 'CENTERSTAGE℠ presented by RTX',
    status: 'Historical Flagship',
    weight: '34.2 lbs',
    dimensions: '17.5" × 17.5" × 14.0"',
    drivetrain: '4× GoBILDA Strafer Chassis with Mechanum Wheels',
    motors: '4× YellowJacket 312 RPM Planetary + 4× Core Hex Actuators',
    sensors: [
      'HuskyLens Dual AprilTag Vision Processor',
      'REV Touch Sensors for zero-referencing',
      'Dual Dead-Wheel Optical Encoders'
    ],
    autonomousHighlight: '2+4 Pixel Yellow/Purple Backdrop Placement with 30-point Endgame Drone Launch',
    cycleTime: '4.1s Cycle Time',
    description: 'Precision engineering platform optimized for pixel indexing, backdrop elevation climbing, and spring-loaded pressurized drone deployment.',
    subsystems: [
      {
        name: 'Dual-Pixel Bucket & Outtake',
        description: 'Bi-directional pixel drop mechanism with servo-driven independently triggered trapdoors.',
        specs: 'Drop height adjustable from 10" to 32" with auto-leveling gimbal servo.'
      },
      {
        name: 'Pressurized Endgame Drone Launcher',
        description: 'Precision high-angle spring catapult engineered to clear field barriers into landing Zone 1.',
        specs: 'Consistent 30-point landing zone accuracy with safety interlock trigger.'
      }
    ]
  },
  {
    id: 'vortex',
    name: 'Vortex',
    season: '2023–2024 Season',
    game: 'POWERPLAY℠ presented by Raytheon',
    status: 'Heritage Platform',
    weight: '32.5 lbs',
    dimensions: '16.9" × 16.9" × 13.8"',
    drivetrain: 'Direct-Drive 4-Wheel Mecanum Configuration',
    motors: '4× REV HD Hex 40:1 Drive Motors + High-Speed Arm Winch',
    sensors: [
      'AprilTag Signal Sleeve Vision Reader',
      'Laser Distance Sensor for Pole Alignment'
    ],
    autonomousHighlight: 'High Junction Cone Placement with automated signal beacon navigation',
    cycleTime: '4.8s Stacking Cycle',
    description: 'The foundation of PCSS II Robotics competitive lineage. Pioneer of the teams closed-loop sensor feedback loops and modular mechanical servicing.',
    subsystems: [
      {
        name: '33" Telescopic High-Junction Lift',
        description: 'Triple-stage stringed aluminum extrusion mast providing rock-solid stability at full height.',
        specs: 'High-speed cone drop with zero wobble at 33 inches.'
      }
    ]
  }
];

export const SPONSOR_TIERS: SponsorTier[] = [
  {
    id: 'title',
    name: 'Diamond Title Sponsor',
    minAmount: 10000,
    badge: 'Title Partner',
    color: 'from-cyan-500 to-blue-600',
    perks: [
      'Exclusive "Powered by [Your Company]" naming on team robots and banners',
      'Largest prominent logo on robot chassis, team competition shirts & pits',
      'VIP front-row access and team pit tour at Circuit 2026 and Massachusetts State Qualifiers',
      'Featured video showcase during team STEM symposiums and outreach workshops',
      'Direct pipeline to student STEM talent for summer internships and mentorship',
      'Official 501(c)(3) tax exemption receipt and customized plaque of appreciation'
    ],
    estimatedImpressions: '50,000+ Regional & Global STEM Impressions',
    taxDeductiblePercent: 100
  },
  {
    id: 'platinum',
    name: 'Platinum Partner',
    minAmount: 5000,
    badge: 'Platinum',
    color: 'from-purple-500 to-indigo-600',
    perks: [
      'Prime logo placement on competition robot chassis and official pit banner',
      'Prominent corporate logo on student team travel apparel and marketing materials',
      'Social media spotlight feature across LinkedIn, Instagram, and YouTube',
      'Dedicated sponsor booth / display table at Circuit 2026 Flagship Showcase',
      'Official 501(c)(3) tax deduction documentation and IRS W-9'
    ],
    estimatedImpressions: '25,000+ Tournament & Digital Impressions',
    taxDeductiblePercent: 100
  },
  {
    id: 'gold',
    name: 'Gold Sponsor',
    minAmount: 2500,
    badge: 'Gold',
    color: 'from-amber-400 to-orange-500',
    perks: [
      'Large logo placement on competition robot and team pit banner',
      'Logo on team jerseys worn at all regional qualifiers and outreach events',
      'Website logo with backlink on our official domain (pcssiirobotics.org)',
      'Official 501(c)(3) tax receipt and thank-you letter from student engineers'
    ],
    estimatedImpressions: '12,000+ Event Impressions',
    taxDeductiblePercent: 100
  },
  {
    id: 'silver',
    name: 'Silver Supporter',
    minAmount: 1000,
    badge: 'Silver',
    color: 'from-slate-300 to-slate-400',
    perks: [
      'Medium logo on pit banner and official team website',
      'Corporate name listed on student team jerseys',
      'Quarterly engineering updates and competition results newsletter',
      'Official 501(c)(3) tax deductible donation receipt'
    ],
    estimatedImpressions: '5,000+ Impressions',
    taxDeductiblePercent: 100
  },
  {
    id: 'bronze',
    name: 'Bronze Friend of STEM',
    minAmount: 500,
    badge: 'Bronze',
    color: 'from-amber-700 to-yellow-800',
    perks: [
      'Name or small logo on website sponsor page',
      'Team sticker pack and signed competition postcard',
      'Full 501(c)(3) tax receipt'
    ],
    estimatedImpressions: '2,500+ Impressions',
    taxDeductiblePercent: 100
  }
];

export const TEAM_MEMBERS: TeamMember[] = [
  {
    id: 'lead-1',
    name: 'Aarti Sri Ravikumar',
    role: 'Team Captain & Lead Systems Architect',
    division: 'Software & Autonomous',
    grade: 'Grade 9',
    specialty: 'CubeSat Flight Software, Telemetry Pipelines & Java FTC SDK',
    profileUrl: 'https://ai-aarti.com',
    specialtyUrl: 'https://publications.ai-aarti.com',
    competition: 'Cubesat Challenge',
    tshirtSize: 'M',
    tshirtColor: 'Pink'
  },
  {
    id: 'lead-2',
    name: 'Manal Mahfudh',
    role: 'Director of Strategy, Culture & Competitions',
    division: 'Business & Outreach',
    grade: 'Grade 11',
    specialty: 'Strategic Proposals, Cross-Discipline Recruitment & Curriculum',
    competition: 'Battlecry @ WPI'
  },
  {
    id: 'lead-3',
    name: 'Toyesh Vyas',
    role: 'Lead Mechanical Fabricator & CAD Specialist',
    division: 'Hardware & CAD',
    grade: 'Grade 10',
    specialty: 'Mecanum Gearbox Tolerances, CNC Routing & Carbon Plates',
    competition: 'Battle of Lexington',
    tshirtSize: 'L',
    tshirtColor: 'Pink'
  },
  {
    id: 'lead-4',
    name: 'Anthony Corpuz',
    role: 'Electrical & Power Systems Lead',
    division: 'Electrical & Systems',
    grade: 'Grade 10',
    specialty: 'REV Hub Power Distribution, Fuse Protection & Wiring Harnesses',
    competition: 'Kraken V2 Electrical Certification',
    tshirtSize: 'M',
    tshirtColor: 'Pink'
  },
  {
    id: 'lead-5',
    name: 'Dr. Marcus Vance',
    role: 'Lead Mentor & Robotics Advisor',
    division: 'Mentorship',
    grade: 'Faculty Advisor',
    specialty: 'Aerospace Engineering, Control Systems Theory & FIRST Safety Advisor'
  }
];
