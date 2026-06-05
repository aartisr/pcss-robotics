export const GAME_CATALOG = [
  {
    id: 'arena-knockout',
    title: 'Robot Arena Knockout',
    tagline: 'A precision brawler on a collapsing magnetic ring.',
    summary: 'Two drivers fight for traction, angle, and timing as the arena contracts and every boost can decide the round.',
    players: '2 players',
    intensity: 'Fast elimination rounds',
    objective: 'Push the other robot outside the arena edge.',
    party: {
      stations: ['Red Driver Station', 'Blue Driver Station'],
      quickTip: 'Perfect for winner-stays ladders and short elimination heats.'
    }
  },
  {
    id: 'robot-soccer',
    title: 'Robot Soccer 2v2',
    tagline: 'A turbo field game built for chaotic teamwork.',
    summary: 'Two captains command a 2v2 match with autonomous wingmates, so teamwork and clean plays stay readable on a shared screen.',
    players: '2 players + AI wingmates',
    intensity: '90-second matches',
    objective: 'Score more goals than the opposing alliance.',
    party: {
      stations: ['Alliance A Captain', 'Alliance B Captain'],
      quickTip: 'Best for high-turnover captain rotations while AI wingmates keep the field full.'
    }
  },
  {
    id: 'bot-build-battle',
    title: 'Bot Build Battle',
    tagline: 'A relay race between scavenging and smart assembly.',
    summary: 'Compete to gather parts, complete build recipes, and deliver better robots faster than your rival engineer.',
    players: '2 players',
    intensity: 'Tactical resource race',
    objective: 'Finish the most build recipes before time expires.',
    party: {
      stations: ['Assembler Bay Alpha', 'Assembler Bay Beta'],
      quickTip: 'Great for relay-style queues where the next builder steps in immediately.'
    }
  }
];

export const DEFAULT_GAME_ID = GAME_CATALOG[0].id;
