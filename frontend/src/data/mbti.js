// MBTI_BANK: 10 questions per dimension (40 total).
// All questions per dimension share the same pole unless direction: -1 is specified.
// High agreement (+3) favors the pole letter; low agreement (-3) favors the opposite.
// direction: -1 means agreement favors the OPPOSITE of the stated pole.
export const MBTI_BANK = [
  // --- EI: pole 'E' (agree = Extrovert) ---
  { text: 'I feel naturally energized after spending time in social settings or groups.', dim: 'EI', pole: 'E' },
  { text: 'I prefer to talk through my ideas out loud before I fully form them internally.', dim: 'EI', pole: 'E' },
  { text: 'I tend to have a wide circle of friends and enjoy getting to know many different people.', dim: 'EI', pole: 'E' },
  { text: 'I am comfortable being the center of attention and generally don\'t mind it.', dim: 'EI', pole: 'E' },
  { text: 'I process my experiences most effectively by discussing them with others.', dim: 'EI', pole: 'E' },
  { text: 'When I have a completely free afternoon, my first impulse is to seek out company rather than enjoy the solitude.', dim: 'EI', pole: 'E' },
  { text: 'After a full day of social interaction, I feel energized rather than depleted.', dim: 'EI', pole: 'E' },
  { text: 'I figure out what I think and feel primarily through talking and interacting, not by reflecting alone.', dim: 'EI', pole: 'E' },
  { text: 'I need a significant amount of solitary time to feel like myself.', dim: 'EI', pole: 'I', direction: -1 },
  { text: 'Being around people for extended periods is draining, even when I enjoy their company.', dim: 'EI', pole: 'I', direction: -1 },

  // --- SN: pole 'S' (agree = Sensor) ---
  // Includes both Si-flavored (proven methods, concrete facts) and Se-flavored (sensory engagement, hands-on) items
  { text: 'I focus best on concrete facts and what is actually happening in the present moment.', dim: 'SN', pole: 'S' },
  { text: 'I trust what I can directly observe and verify over theories about what might be possible.', dim: 'SN', pole: 'S' },
  { text: 'I prefer clear, step-by-step instructions over high-level conceptual frameworks.', dim: 'SN', pole: 'S' },
  { text: 'I tend to describe things in concrete, specific, literal terms rather than through metaphor or analogy.', dim: 'SN', pole: 'S' },
  { text: 'I am more interested in what is real and practical than in speculation or hypotheticals.', dim: 'SN', pole: 'S' },
  { text: 'I\'m highly attuned to my physical surroundings — I notice sights, sounds, and textures that others seem to miss.', dim: 'SN', pole: 'S' },
  { text: 'I learn best by doing things hands-on rather than by reading or theorizing about them.', dim: 'SN', pole: 'S' },
  { text: 'I would rather refine and perfect an existing approach than experiment with an untested one.', dim: 'SN', pole: 'S' },
  { text: 'I naturally notice underlying patterns and connections that aren\'t immediately visible on the surface.', dim: 'SN', pole: 'N', direction: -1 },
  { text: 'I spend more time thinking about future possibilities than reflecting on what has actually happened.', dim: 'SN', pole: 'N', direction: -1 },

  // --- TF: pole 'T' (agree = Thinker) ---
  // Includes both Te-flavored (objective criteria, efficiency, direct feedback) and Ti-flavored (internal logic, frameworks, categorizing) items
  { text: 'I make decisions primarily based on logic and objective analysis rather than how people will feel.', dim: 'TF', pole: 'T' },
  { text: 'I believe accuracy and honesty matter more than softening the truth to spare feelings.', dim: 'TF', pole: 'T' },
  { text: 'I am most energized by analytical or technical problem-solving.', dim: 'TF', pole: 'T' },
  { text: 'I tend to notice logical inconsistencies before I notice interpersonal tension.', dim: 'TF', pole: 'T' },
  { text: 'I enjoy breaking things down into their component parts to understand how they work.', dim: 'TF', pole: 'T' },
  { text: 'When someone shares a problem, my first instinct is to offer logical analysis rather than emotional support.', dim: 'TF', pole: 'T' },
  { text: 'I find it relatively easy to give honest critical feedback, even knowing the person worked hard on what I\'m critiquing.', dim: 'TF', pole: 'T' },
  { text: 'If a decision is logically correct, I\'m comfortable with it even if it causes some people discomfort.', dim: 'TF', pole: 'T' },
  { text: 'Maintaining harmony in my relationships often matters more to me than being right.', dim: 'TF', pole: 'F', direction: -1 },
  { text: 'I find it genuinely difficult to critique someone\'s work when I know they put their heart into it.', dim: 'TF', pole: 'F', direction: -1 },

  // --- JP: pole 'J' (agree = Judger) ---
  { text: 'I prefer to have plans settled in advance and feel uncomfortable when things are unresolved.', dim: 'JP', pole: 'J' },
  { text: 'I feel most comfortable and productive with structure, schedules, and clear expectations.', dim: 'JP', pole: 'J' },
  { text: 'I prefer to complete one project fully before starting another.', dim: 'JP', pole: 'J' },
  { text: 'I prefer to have a decision made — even an imperfect one — rather than leave it open while I gather more information.', dim: 'JP', pole: 'J' },
  { text: 'I feel relief when a decision gets finalized and the uncertainty is behind me.', dim: 'JP', pole: 'J' },
  { text: 'When working on a project, I feel most satisfied making steady, linear progress toward a clearly defined finish line.', dim: 'JP', pole: 'J' },
  { text: 'I tend to finish tasks well before deadlines rather than doing my best work at the last minute.', dim: 'JP', pole: 'J' },
  { text: 'I feel most comfortable when I know the plan for the day or week in advance and can rely on it not changing.', dim: 'JP', pole: 'J' },
  { text: 'Strict schedules and rigid plans feel constraining — I prefer adapting as I go.', dim: 'JP', pole: 'P', direction: -1 },
  { text: 'I do my best work in spontaneous bursts rather than through planned, structured effort.', dim: 'JP', pole: 'P', direction: -1 },
];

export const MBTI_TYPES = {
  INTJ: { name: 'The Architect', stack: ['Ni', 'Te', 'Fi', 'Se'], desc: 'Strategic, independent, and determined. INTJs are driven by their vision of the future and have a natural talent for turning insights into long-range plans. They are blunt, knowledgeable, and competent — private individuals who apply logic and reason to their drive for self-improvement.', ennCorr: '1, 5, 3' },
  INTP: { name: 'The Logician', stack: ['Ti', 'Ne', 'Si', 'Fe'], desc: 'Analytical, objective, and inventive. INTPs love theoretical and abstract thinking, prizing intelligence and knowledge above all else. Quiet and contained, with a flexible and adaptive way of thinking, they are endlessly creative in finding logical solutions to complex problems.', ennCorr: '5, 4, 9' },
  ENTJ: { name: 'The Commander', stack: ['Te', 'Ni', 'Se', 'Fi'], desc: 'Bold, decisive, and strategic. ENTJs naturally assume leadership, bringing order and vision to every group they join. Charismatic and confident, they project authority and are excellent long-range planners — though they can struggle to slow down for those with different pacing.', ennCorr: '3, 8, 1' },
  ENTP: { name: 'The Debater', stack: ['Ne', 'Ti', 'Fe', 'Si'], desc: 'Quick-witted, bold, and intellectually restless. ENTPs love challenging assumptions and exploring every angle of a problem. They are excellent at generating ideas, debating positions for sport, and seeing connections others miss — though follow-through can lag behind the ideation.', ennCorr: '7, 3, 5' },
  INFJ: { name: 'The Advocate', stack: ['Ni', 'Fe', 'Ti', 'Se'], desc: 'Insightful, principled, and deeply committed to their vision. INFJs have an almost uncanny ability to understand people and see where things are heading. They lead with quiet conviction, holding strong views that are carefully reasoned and guided by an unwavering moral compass.', ennCorr: '1, 4, 2' },
  INFP: { name: 'The Mediator', stack: ['Fi', 'Ne', 'Si', 'Te'], desc: 'Poetic, idealistic, and guided by deep personal values. INFPs always look for the good in people and see life through a lens of meaning and possibility. Deeply private and emotionally aware, they live in a world of imagination and values — often feeling misunderstood by a more pragmatic world.', ennCorr: '4, 9, 5' },
  ENFJ: { name: 'The Protagonist', stack: ['Fe', 'Ni', 'Se', 'Ti'], desc: 'Charismatic, empathetic, and inspiring. ENFJs naturally gravitate toward leadership, guiding and mentoring others toward a shared vision with warmth and conviction. They are deeply attuned to people\'s emotions and needs, often acting as the social glue that holds groups together.', ennCorr: '2, 3, 1' },
  ENFP: { name: 'The Campaigner', stack: ['Ne', 'Fi', 'Te', 'Si'], desc: 'Enthusiastic, creative, and deeply human. ENFPs bring infectious energy and a genuine curiosity about people and ideas. They are free-spirited explorers who see life as full of potential — connecting dots across domains and inspiring others with their passion and warmth.', ennCorr: '7, 4, 2' },
  ISTJ: { name: 'The Logistician', stack: ['Si', 'Te', 'Fi', 'Ne'], desc: 'Practical, dependable, and extraordinarily thorough. ISTJs take their responsibilities seriously and honor their commitments without fail. They are methodical, detail-oriented, and excellent at maintaining systems — forming the stable backbone of families, organizations, and institutions.', ennCorr: '1, 6, 5' },
  ISFJ: { name: 'The Defender', stack: ['Si', 'Fe', 'Ti', 'Ne'], desc: 'Dedicated, warm, and remarkably attentive. ISFJs are quietly devoted to the people they care about, finding deep satisfaction in supporting and protecting others. They notice what others miss, remember what matters, and act with selfless reliability that rarely seeks the spotlight.', ennCorr: '2, 6, 1' },
  ESTJ: { name: 'The Executive', stack: ['Te', 'Si', 'Ne', 'Fi'], desc: 'Organized, principled, and decisive. ESTJs take pride in maintaining order and bringing people together around shared standards. They are natural administrators who value tradition and clear hierarchies, enforcing structure with a consistency that others can rely on.', ennCorr: '1, 3, 8' },
  ESFJ: { name: 'The Consul', stack: ['Fe', 'Si', 'Ne', 'Ti'], desc: 'Caring, sociable, and extraordinarily loyal. ESFJs are the social architects of their communities — warm, dependable, and acutely aware of others\' needs. They work hard to maintain harmony and are happiest when they can contribute to the well-being of those around them.', ennCorr: '2, 6, 3' },
  ISTP: { name: 'The Virtuoso', stack: ['Ti', 'Se', 'Ni', 'Fe'], desc: 'Bold, practical, and masterfully observant. ISTPs are natural tinkerers and problem-solvers with a deep understanding of how physical systems work. They are calm in a crisis, action-oriented, and comfortable diving into the unknown — preferring to learn by doing.', ennCorr: '5, 9, 6' },
  ISFP: { name: 'The Adventurer', stack: ['Fi', 'Se', 'Ni', 'Te'], desc: 'Gentle, perceptive, and guided by deep personal values. ISFPs are quiet rebels who live fully in the present, expressing their rich inner world through sensory experience and aesthetic choices. They are sensitive and open-minded, deeply caring about authenticity in all they do.', ennCorr: '4, 9, 2' },
  ESTP: { name: 'The Entrepreneur', stack: ['Se', 'Ti', 'Fe', 'Ni'], desc: 'Energetic, perceptive, and boldly pragmatic. ESTPs thrive on action and immediate experience. They are excellent at reading situations and people in real time, moving quickly and confidently. They prefer learning through doing and can seem blunt, but their energy is infectious.', ennCorr: '7, 8, 3' },
  ESFP: { name: 'The Entertainer', stack: ['Se', 'Fi', 'Te', 'Ni'], desc: 'Spontaneous, vibrant, and wholeheartedly present. ESFPs love life and bring others along for the ride. They are perceptive, generous, and quick to express affection. Bold and warm, they live in the moment and create joy wherever they go — though long-term planning can take a back seat.', ennCorr: '7, 2, 9' },
};

// MBTI_DISAMBIG: targeted clarifying questions for each dimension.
// Used only when the main 40-question bank is exhausted without a confident result.
// Questions have the same shape as MBTI_BANK (dim + pole) and are scored identically.
// direction: 1 (default) = positive answer favors the positive pole (E/S/T/J)
// direction: -1 = positive answer favors the negative pole (I/N/F/P)
export const MBTI_DISAMBIG = {
  EI: [
    { text: 'When I\'m excited about an idea, my first impulse is to tell someone about it rather than think it through alone.', dim: 'EI', pole: 'E' },
    { text: 'I recharge most effectively through quiet solitude, even after a great social experience.', dim: 'EI', pole: 'I', direction: -1 },
    { text: 'In a new group, I naturally initiate conversations rather than waiting to be approached.', dim: 'EI', pole: 'E' },
    { text: 'I often feel like I need to retreat and be alone after interactions that others found perfectly comfortable.', dim: 'EI', pole: 'I', direction: -1 },
    { text: 'When something is bothering me, talking about it with someone helps more than reflecting on it privately.', dim: 'EI', pole: 'E' },
  ],
  SN: [
    { text: 'I\'m more interested in the underlying meaning behind facts than in the facts themselves.', dim: 'SN', pole: 'N', direction: -1 },
    { text: 'I rely on gut impressions and pattern recognition more than on what I can directly verify.', dim: 'SN', pole: 'N', direction: -1 },
    { text: 'I would rather work with tangible, real-world problems than with abstract theories.', dim: 'SN', pole: 'S' },
    { text: 'When someone explains something to me, I understand it better through specific examples than through general principles.', dim: 'SN', pole: 'S' },
    { text: 'I think more naturally in metaphors and analogies than in literal, specific terms.', dim: 'SN', pole: 'N', direction: -1 },
  ],
  TF: [
    { text: 'I prioritize being fair and consistent over being kind and considerate when the two conflict.', dim: 'TF', pole: 'T' },
    { text: 'I care more about whether an idea is internally consistent than about whether it makes people feel good.', dim: 'TF', pole: 'T' },
    { text: 'I naturally attune to how people are feeling in a room, even before anyone says anything.', dim: 'TF', pole: 'F', direction: -1 },
    { text: 'When making a tough decision, I weigh the impact on people\'s feelings as heavily as the logical merits.', dim: 'TF', pole: 'F', direction: -1 },
    { text: 'I find emotional reasoning less persuasive than evidence-based argument.', dim: 'TF', pole: 'T' },
  ],
  JP: [
    { text: 'I\'m at my best when I can respond to what\'s happening in the moment rather than follow a preset plan.', dim: 'JP', pole: 'P', direction: -1 },
    { text: 'An unexpected change of plans feels like an opportunity more than a disruption.', dim: 'JP', pole: 'P', direction: -1 },
    { text: 'I feel unsettled when a project has no clear deadline or defined endpoint.', dim: 'JP', pole: 'J' },
    { text: 'I naturally create structure — lists, schedules, systems — even when no one asks me to.', dim: 'JP', pole: 'J' },
    { text: 'I prefer to leave room in my schedule for whatever comes up rather than plan every block.', dim: 'JP', pole: 'P', direction: -1 },
  ],
};

// Keirsey Temperament groups: NT (Rationals), NF (Idealists), SJ (Guardians), SP (Artisans)
export const MBTI_TEMPERAMENT = {
  INTJ: 'NT', INTP: 'NT', ENTJ: 'NT', ENTP: 'NT',
  INFJ: 'NF', INFP: 'NF', ENFJ: 'NF', ENFP: 'NF',
  ISTJ: 'SJ', ISFJ: 'SJ', ESTJ: 'SJ', ESFJ: 'SJ',
  ISTP: 'SP', ISFP: 'SP', ESTP: 'SP', ESFP: 'SP',
};
