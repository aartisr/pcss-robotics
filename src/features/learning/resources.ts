/** Learning resources linked from the site and relevant events. */
export const learningResources = {
  pat: {
    id: 'pat',
    name: 'PAT',
    url: 'https://pat.pcssiirobotics.org/',
    title: 'Learn to make a video game',
    description: 'A game makes code visible: press a key, change what happens, and test the result. Use PAT to start learning game programming, then build on one small idea at a time.'
  }
} as const;

export type LearningResourceId = keyof typeof learningResources;
