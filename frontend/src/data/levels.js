// Enneagram Levels of Development — based on Riso & Hudson's framework.
// Each type has three health tiers: healthy (Levels 1–3), average (Levels 4–6), unhealthy (Levels 7–9).

export const LEVELS = {
  1: {
    healthy: {
      range: 'Levels 1–3',
      title: 'The Wise Realist',
      description: 'Accepts imperfection. Discerning without being judgmental. Ethical and principled while remaining flexible. Teaches by example.',
      behaviors: [
        "Tolerant of others' approaches",
        'Self-disciplined without rigidity',
        'Uses anger as fuel for constructive change',
      ],
    },
    average: {
      range: 'Levels 4–6',
      title: 'The Striving Perfectionist',
      description: 'Increasingly critical of self and others. Orderly but inflexible. Inner critic projects outward. Resentment from suppressed anger.',
      behaviors: [
        'Corrects others frequently',
        'Black-and-white thinking increases',
        'Procrastinates from fear of imperfection',
      ],
    },
    unhealthy: {
      range: 'Levels 7–9',
      title: 'The Punishing Judge',
      description: 'Obsessive, self-righteous, punitive. Cruel to self and others. Compulsive behaviors as outlet for anger.',
      behaviors: [
        'Rigid and inflexible to the point of dysfunction',
        'Condemning and punishing',
        'Hypocritical — violates own standards while judging others harshly',
      ],
    },
  },

  2: {
    healthy: {
      range: 'Levels 1–3',
      title: 'The Genuinely Caring Servant',
      description: 'Truly selfless. Empathetic and emotionally perceptive. Gives freely without expectation. Warm and supportive without losing self.',
      behaviors: [
        'Gives without expectation of return',
        "Genuinely present with others' needs",
        'Maintains clear sense of own needs too',
      ],
    },
    average: {
      range: 'Levels 4–6',
      title: 'The Possessive Helper',
      description: 'Increasingly aware of own giving. Expectations form. Flattery and people-pleasing. Becoming intrusive and over-helpful.',
      behaviors: [
        'Gives to get appreciation',
        "Intrudes in others' lives uninvited",
        'Becomes martyred when not recognized',
      ],
    },
    unhealthy: {
      range: 'Levels 7–9',
      title: 'The Manipulative Victim',
      description: 'Entitled and demanding. Manipulates through guilt and illness. Victimhood as leverage.',
      behaviors: [
        'Uses emotional manipulation to control',
        'Plays victim to extract care',
        'Hostile and resentful when needs go unmet',
      ],
    },
  },

  3: {
    healthy: {
      range: 'Levels 1–3',
      title: 'The Authentic Role Model',
      description: 'Genuinely accomplished. Motivates and inspires others authentically. Honest about failures and limitations.',
      behaviors: [
        'Admits mistakes openly',
        'Uses success to lift others',
        'Values being over appearing',
      ],
    },
    average: {
      range: 'Levels 4–6',
      title: 'The Competitive Performer',
      description: 'Increasingly image-conscious. Compares self to others. Begins cutting corners for appearances.',
      behaviors: [
        'Exaggerates accomplishments',
        'Avoids failure at all costs',
        'Becomes disconnected from genuine feelings',
      ],
    },
    unhealthy: {
      range: 'Levels 7–9',
      title: 'The Vindictive Deceiver',
      description: 'Deceptive and duplicitous. Pathological jealousy. Sabotages others.',
      behaviors: [
        'Lies to maintain image',
        'Sabotages competitors',
        'Narcissistic rage when image threatened',
      ],
    },
  },

  4: {
    healthy: {
      range: 'Levels 1–3',
      title: 'The Inspired Creator',
      description: 'Transforms suffering into beauty. Emotionally honest and articulate. Creates works of deep meaning.',
      behaviors: [
        'Channels emotional depth into creative output',
        'Finds beauty even in difficult experiences',
        'Self-revealing without being self-indulgent',
      ],
    },
    average: {
      range: 'Levels 4–6',
      title: 'The Melancholic Romantic',
      description: 'Increasingly withdrawn into fantasy. Envious of others. Self-pity and feeling misunderstood.',
      behaviors: [
        'Alternates between longing and withdrawal',
        "Envious of others' happiness",
        'Compares self unfavorably and feels inferior',
      ],
    },
    unhealthy: {
      range: 'Levels 7–9',
      title: 'The Self-Destructive Depressive',
      description: 'Chronic emotional paralysis. Self-sabotage. Despair and self-loathing.',
      behaviors: [
        'Torments self with self-contempt',
        'Abandons relationships and projects',
        'May engage in self-harmful behaviors',
      ],
    },
  },

  5: {
    healthy: {
      range: 'Levels 1–3',
      title: 'The Visionary Pioneer',
      description: 'Synthesizes knowledge into profound insights. Shares generously. Engaged and energized by the world.',
      behaviors: [
        'Shares knowledge freely',
        'Engages with others without depleting',
        'Creates breakthrough insights',
      ],
    },
    average: {
      range: 'Levels 4–6',
      title: 'The Reclusive Expert',
      description: 'Increasingly isolated. Hoards knowledge. Detaches from emotions.',
      behaviors: [
        'Shares minimally, keeps most to self',
        'Dismisses others as unqualified',
        'Emotionally detached and cerebral',
      ],
    },
    unhealthy: {
      range: 'Levels 7–9',
      title: 'The Isolated Nihilist',
      description: 'Completely withdrawn. Paranoid. Nihilistic worldview.',
      behaviors: [
        'Sees all as threatening or worthless',
        'Complete social isolation',
        'Erratic and potentially dangerous thinking',
      ],
    },
  },

  6: {
    healthy: {
      range: 'Levels 1–3',
      title: 'The Courageous Ally',
      description: 'Reliable under pressure. Faces fears directly. Creates genuine security for self and others.',
      behaviors: [
        'Acts courageously despite fear',
        'Loyal without being dependent',
        'Builds genuine community and trust',
      ],
    },
    average: {
      range: 'Levels 4–6',
      title: 'The Anxious Doubter',
      description: 'Increasingly suspicious of motives. Tests loyalty. Reactive to perceived threats.',
      behaviors: [
        'Seeks constant reassurance',
        "Tests others' loyalty",
        'Alternates between compliance and defiance',
      ],
    },
    unhealthy: {
      range: 'Levels 7–9',
      title: 'The Paranoid Masochist',
      description: 'Overtaken by anxiety. Self-defeating behavior. Paranoid accusation.',
      behaviors: [
        'Accuses supporters of betrayal',
        'Self-sabotages under pressure',
        'Panic and irrational decision-making',
      ],
    },
  },

  7: {
    healthy: {
      range: 'Levels 1–3',
      title: 'The Joyful Contributor',
      description: 'Gratitude for the present. Channels excitement into meaningful contributions. Tolerates discomfort with equanimity.',
      behaviors: [
        'Finds joy and gratitude in the present',
        'Commits deeply to meaningful projects',
        'Allows difficult emotions without escaping',
      ],
    },
    average: {
      range: 'Levels 4–6',
      title: 'The Scattered Pleasure Seeker',
      description: 'Increasingly restless. Impulsive. Uses constant stimulation to avoid discomfort.',
      behaviors: [
        'Jumps between projects and interests',
        'Avoids negative emotions through distraction',
        'Over-schedules to avoid stillness',
      ],
    },
    unhealthy: {
      range: 'Levels 7–9',
      title: 'The Reckless Escapist',
      description: 'Addictive behavior. Panicked when options close. Reckless in pursuit of escape.',
      behaviors: [
        'Addictive or compulsive behavior patterns',
        'Panicked and claustrophobic when constrained',
        'Destructive impulsivity',
      ],
    },
  },

  8: {
    healthy: {
      range: 'Levels 1–3',
      title: 'The Magnanimous Leader',
      description: 'Uses power to empower others. Vulnerable and emotionally open. Inspires loyalty through genuine care.',
      behaviors: [
        'Protects and empowers the vulnerable',
        'Openly expresses tenderness and care',
        'Uses strength for justice, not domination',
      ],
    },
    average: {
      range: 'Levels 4–6',
      title: 'The Dominating Pragmatist',
      description: 'Increasingly controlling. Intimidates to maintain control. Dismisses weakness.',
      behaviors: [
        'Dominates conversations and decisions',
        'Challenges others to test strength',
        'Dismisses sensitivity as weakness',
      ],
    },
    unhealthy: {
      range: 'Levels 7–9',
      title: 'The Ruthless Destroyer',
      description: 'Cruel and vindictive. Destroys out of rage. Megalomania.',
      behaviors: [
        'Lashes out destructively',
        'Megalomania and cruel domination',
        'Destroys rather than loses',
      ],
    },
  },

  9: {
    healthy: {
      range: 'Levels 1–3',
      title: 'The Peaceful Presence',
      description: 'Genuinely at peace. Mediates with wisdom. Fully engaged with life.',
      behaviors: [
        'Brings genuine calm to conflict',
        'Engages life with presence and vitality',
        'Assertive about own needs and perspectives',
      ],
    },
    average: {
      range: 'Levels 4–6',
      title: 'The Complacent Drifter',
      description: "Increasingly absent from own life. Prioritizes others' agendas. Complacent and disengaged.",
      behaviors: [
        'Goes along to avoid conflict',
        'Neglects own priorities and dreams',
        'Numbs through routines and distractions',
      ],
    },
    unhealthy: {
      range: 'Levels 7–9',
      title: 'The Dissociated Zombie',
      description: 'Complete self-neglect. Dissociated from reality. Obstinate passivity.',
      behaviors: [
        'Completely disengaged from own life',
        'Obstinate refusal to engage',
        'Dissociative numbness and denial',
      ],
    },
  },
};
