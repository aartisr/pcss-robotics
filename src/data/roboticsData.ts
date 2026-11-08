export interface EngineeringTopic {
  id: string;
  title: string;
  question: string;
  summary: string;
  steps: string[];
}

export const ENGINEERING_TOPICS: EngineeringTopic[] = [
  {
    id: 'drive',
    title: 'How a robot moves',
    question: 'What makes a drive system easy to control?',
    summary: 'Wheel choice, weight distribution, and motor control all affect how a robot crosses a field. A good design begins with the motion the game requires.',
    steps: ['Sketch the paths the robot needs to take.', 'Build a simple drive prototype.', 'Test turning, stopping, and repeatability.']
  },
  {
    id: 'mechanisms',
    title: 'How a robot handles objects',
    question: 'Can one mechanism do the job reliably?',
    summary: 'Intakes, lifts, and arms make game tasks possible. Their design balances reach, speed, strength, and the space available on the robot.',
    steps: ['Define the object and its destination.', 'Prototype contact points and motion.', 'Test jams and recovery before adding complexity.']
  },
  {
    id: 'sensing',
    title: 'How a robot knows where it is',
    question: 'What can the robot actually measure?',
    summary: 'Encoders, cameras, and other sensors give control code information about motion and surroundings. Each reading has uncertainty.',
    steps: ['Choose a measurement relevant to the task.', 'Calibrate the sensor.', 'Compare the reading with what happens on the field.']
  }
];
