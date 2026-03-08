export const SOP_STEPS = [
  {
    title: 'Step 1 — Energy Direction',
    q: 'Does this person recharge by engaging the outer world (people, activity) or through reflection and solitude?',
    opts: ['Extraversion (E)', 'Introversion (I)'],
    pitfall: 'Confusing social comfort with extraversion. Introverts can be socially skilled — the key is where they get energy, not how they behave publicly.',
  },
  {
    title: 'Step 2 — Information Gathering',
    q: 'Does this person naturally attend to concrete sensory details and present realities, or to patterns, abstractions, and future possibilities?',
    opts: ['Sensing (S)', 'Intuition (N)'],
    pitfall: 'Mistaking intelligence for N or practicality for S. Both types can be highly intelligent and practical — it\'s about what they naturally attend to first.',
  },
  {
    title: 'Step 3 — Decision Making',
    q: 'Does this person primarily decide through impersonal logic and objective analysis, or through personal values and impact on people?',
    opts: ['Thinking (T)', 'Feeling (F)'],
    pitfall: 'Assuming T types don\'t have feelings or F types aren\'t logical. Both think and feel — the distinction is which lens they apply first when making decisions.',
  },
  {
    title: 'Step 4 — Lifestyle Orientation',
    q: 'Does this person prefer a structured, decided approach to life with clear plans and closure, or a flexible, adaptive approach that keeps options open?',
    opts: ['Judging (J)', 'Perceiving (P)'],
    pitfall: 'Judging doesn\'t mean judgmental, and Perceiving doesn\'t mean perceptive. J prefers closure; P prefers keeping options open — regardless of how organized they appear.',
  },
];

export const QUADRANTS = {
  NF: { label: 'NF — Idealists', types: ['INFP', 'INFJ', 'ENFP', 'ENFJ'], desc: 'Driven by meaning, identity, and human potential. NF types seek authentic connection and purpose.' },
  NT: { label: 'NT — Rationals', types: ['INTP', 'INTJ', 'ENTP', 'ENTJ'], desc: 'Driven by competence, understanding, and systemic thinking. NT types seek mastery and innovation.' },
  SF: { label: 'SF — Guardians', types: ['ISFP', 'ISFJ', 'ESFP', 'ESFJ'], desc: 'Driven by duty, service, and concrete relationships. SF types seek to support and nurture those around them.' },
  ST: { label: 'ST — Artisans', types: ['ISTP', 'ISTJ', 'ESTP', 'ESTJ'], desc: 'Driven by efficiency, results, and practical reality. ST types seek to organize and solve tangible problems.' },
};
