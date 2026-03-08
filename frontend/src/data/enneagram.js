export const ENN_TYPES = {
  1: { name: 'The Reformer', fear: 'Being corrupt or defective', desire: 'To be good and have integrity', desc: 'Principled, purposeful, self-controlled, and perfectionistic. Ones are conscientious and ethical, with a strong sense of right and wrong. They are advocates for change, always striving to improve things but afraid of making a mistake. They are well-organized, orderly, and fastidious, and try to maintain high standards.' },
  2: { name: 'The Helper', fear: 'Being unwanted or unworthy of love', desire: 'To feel loved and needed', desc: 'Generous, demonstrative, people-pleasing, and possessive. Twos are empathetic, sincere, and warm-hearted. They are friendly, generous, and self-sacrificing, but can also be sentimental, flattering, and people-pleasing. They are motivated by a need to be loved and needed, and to avoid acknowledging their own needs.' },
  3: { name: 'The Achiever', fear: 'Being worthless or without value', desire: 'To feel valuable and worthwhile', desc: 'Adaptable, excelling, driven, and image-conscious. Threes are self-assured, attractive, and charming. Ambitious, competent, and energetic, they can also be status-conscious and highly driven for personal advancement. They are diplomatic and poised, but can also be overly concerned with their image.' },
  4: { name: 'The Individualist', fear: 'Having no identity or personal significance', desire: 'To find themselves and their significance', desc: 'Expressive, dramatic, self-absorbed, and temperamental. Fours are self-aware, sensitive, and reserved. They are emotionally honest, creative, and personal, but can also be moody and self-conscious. They withhold themselves from others due to feeling vulnerable and defective, and can often feel that they are missing something.' },
  5: { name: 'The Investigator', fear: 'Being useless or incapable', desire: 'To be capable and competent', desc: 'Perceptive, innovative, secretive, and isolated. Fives are alert, insightful, and curious. They are able to concentrate and focus on developing complex ideas and skills. Independent and innovative, they can become preoccupied with their thoughts and imaginary constructs. They become detached, yet high-strung and intense.' },
  6: { name: 'The Loyalist', fear: 'Being without support or guidance', desire: 'To have security and support', desc: 'Engaging, responsible, anxious, and suspicious. Sixes are reliable, hard-working, responsible, and trustworthy. Excellent troubleshooters, they foresee problems and foster cooperation, but can also become defensive, evasive, and anxious. They are cautious and indecisive, but will also be reactive, defiant, and rebellious.' },
  7: { name: 'The Enthusiast', fear: 'Being deprived or in pain', desire: 'To be satisfied and content', desc: 'Spontaneous, versatile, acquisitive, and scattered. Sevens are extroverted, optimistic, versatile, and spontaneous. Playful, high-spirited, and practical, they can also misapply their many talents, becoming over-extended, scattered, and undisciplined. They constantly seek new and exciting experiences, but can become distracted and exhausted.' },
  8: { name: 'The Challenger', fear: 'Being controlled or harmed by others', desire: 'To protect themselves and be in control', desc: 'Self-confident, decisive, willful, and confrontational. Eights feel they must control their environment, especially people, sometimes becoming confrontational and intimidating. Eights are the true powerhouses of the Enneagram—they feel they must fight for what they want, and that includes their relationships and their place in the world.' },
  9: { name: 'The Peacemaker', fear: 'Loss and separation, of fragmentation', desire: 'To have inner stability and peace of mind', desc: 'Receptive, reassuring, agreeable, and complacent. Nines are accepting, trusting, and stable. They are usually creative, optimistic, and supportive, but can also be too willing to go along with others to keep the peace. They want everything to go smoothly and be without conflict, but they can also tend to be complacent and minimize anything upsetting.' },
};

export const ENN_QUESTIONS = [
  { type: 1, text: 'I hold myself to very high standards and feel frustrated when things aren\'t done correctly.', pole: 1 },
  { type: 1, text: 'I often notice errors or inefficiencies that others seem to overlook.', pole: 1 },
  { type: 1, text: 'I have a strong inner critic that constantly evaluates my actions and decisions.', pole: 1 },
  { type: 2, text: 'I naturally tune into what other people need, often before they ask.', pole: 1 },
  { type: 2, text: 'I feel most fulfilled when I know I\'ve made a real difference in someone\'s life.', pole: 1 },
  { type: 2, text: 'I sometimes struggle to identify my own needs because I\'m so focused on others.', pole: 1 },
  { type: 3, text: 'I am highly motivated by goals and feel restless when I\'m not making progress.', pole: 1 },
  { type: 3, text: 'I naturally adapt my presentation to fit different social situations.', pole: 1 },
  { type: 3, text: 'Being seen as successful and competent matters deeply to me.', pole: 1 },
  { type: 4, text: 'I often feel fundamentally different from the people around me.', pole: 1 },
  { type: 4, text: 'I\'m drawn to deep emotional experiences, even painful ones, because they feel authentic.', pole: 1 },
  { type: 4, text: 'I have a rich inner world and spend a lot of time reflecting on my feelings and identity.', pole: 1 },
  { type: 5, text: 'I need significant time alone to recharge and process my thoughts.', pole: 1 },
  { type: 5, text: 'I tend to observe and analyze situations thoroughly before participating.', pole: 1 },
  { type: 5, text: 'I often feel drained by social demands and prefer to minimize obligations.', pole: 1 },
  { type: 6, text: 'I frequently anticipate what could go wrong and plan for worst-case scenarios.', pole: 1 },
  { type: 6, text: 'Trust is extremely important to me and I test whether people are reliable.', pole: 1 },
  { type: 6, text: 'I often seek reassurance or second opinions before making major decisions.', pole: 1 },
  { type: 7, text: 'I love exploring new ideas, plans, and possibilities — the more the better.', pole: 1 },
  { type: 7, text: 'I tend to reframe negatives into positives and avoid dwelling on painful feelings.', pole: 1 },
  { type: 7, text: 'I feel anxious or trapped when my options are limited or routines become monotonous.', pole: 1 },
  { type: 8, text: 'I instinctively take charge in situations and dislike feeling controlled by others.', pole: 1 },
  { type: 8, text: 'I value directness and honesty, even when it makes people uncomfortable.', pole: 1 },
  { type: 8, text: 'I have a strong protective instinct toward people I consider vulnerable.', pole: 1 },
  { type: 9, text: 'I tend to go along with others\' preferences to maintain harmony.', pole: 1 },
  { type: 9, text: 'I often struggle with inertia — starting things is harder than maintaining them.', pole: 1 },
  { type: 9, text: 'I find it difficult to identify what I truly want, separate from others\' expectations.', pole: 1 },
];

export const INSTINCT_QS = [
  { text: 'Physical comfort, health, and financial security are constant concerns for me.', inst: 'sp' },
  { text: 'I carefully manage my resources and energy to ensure personal well-being.', inst: 'sp' },
  { text: 'I prefer one-on-one intensity over group dynamics.', inst: 'sx' },
  { text: 'I\'m drawn to experiences that feel electric, transformative, or deeply intimate.', inst: 'sx' },
  { text: 'I\'m highly aware of social dynamics, group roles, and where I stand with others.', inst: 'so' },
  { text: 'Being part of a community or group and contributing to something larger matters deeply to me.', inst: 'so' },
];

export const WING_DESC = {
  '1w9': 'The Idealist — principled with a calm, withdrawn quality. More detached and philosophical than the 1w2, with perfectionism expressed quietly through reflection and high personal standards.',
  '1w2': 'The Advocate — principled with warmth and interpersonal engagement. More outwardly focused and crusading, combining ethical conviction with a genuine desire to help others improve.',
  '2w1': 'The Servant — helpful with moral conviction and self-discipline. More principled and self-critical than the 2w3, motivated by genuine duty to serve rather than recognition.',
  '2w3': 'The Host — helpful with charm and social drive. More image-conscious and outwardly successful, combining warmth with ambition and social finesse.',
  '3w2': 'The Charmer — achieving with interpersonal warmth and relatability. More people-oriented and relationship-focused, using charm and likability as tools for success.',
  '3w4': 'The Professional — achieving with depth and self-awareness. More introspective and image-conscious in a refined way, combining ambition with artistic sensitivity.',
  '4w3': 'The Aristocrat — individualistic with drive and polish. More ambitious and image-aware, channeling emotional depth into creative output with a desire for recognition.',
  '4w5': 'The Bohemian — individualistic with intellectual depth and withdrawal. More cerebral and reclusive, combining emotional intensity with a desire for knowledge.',
  '5w4': 'The Iconoclast — investigative with creative intensity and individuality. More emotionally expressive, combining analytical depth with artistic or unconventional sensibility.',
  '5w6': 'The Problem Solver — investigative with loyalty and practicality. More anxious and collaborative, combining intellectual rigor with a need for reliable frameworks and community.',
  '6w5': 'The Defender — loyal with analytical detachment and independence. More introverted and intellectual, combining vigilance with careful independent analysis.',
  '6w7': 'The Buddy — loyal with enthusiasm and optimism. More outgoing and playful, combining trustworthiness with a lighter, more sociable energy.',
  '7w6': 'The Entertainer — enthusiastic with loyal responsibility. More committed and relationship-oriented, tempering spontaneity with a sense of duty to others.',
  '7w8': 'The Realist — enthusiastic with power and assertive drive. More forceful and worldly, combining optimism with an entrepreneurial, no-nonsense energy.',
  '8w7': 'The Maverick — powerful with adventurous energy and appetite for life. More outgoing and pleasure-seeking, combining confrontational strength with expansive enthusiasm.',
  '8w9': 'The Bear — powerful with calm and diplomatic steadiness. More introverted and patient, combining strength with a more accommodating and measured presence.',
  '9w8': 'The Referee — peaceful with quiet assertiveness. More direct and self-assured, combining a desire for harmony with an underlying willingness to push back when needed.',
  '9w1': 'The Dreamer — peaceful with idealism and quiet purpose. More principled and self-critical, combining receptiveness with a striving for personal and moral improvement.',
};

export const ENN_ARROWS = {
  1: { growth: 7, stress: 4 }, 2: { growth: 4, stress: 8 }, 3: { growth: 6, stress: 9 },
  4: { growth: 1, stress: 2 }, 5: { growth: 8, stress: 7 }, 6: { growth: 9, stress: 3 },
  7: { growth: 5, stress: 1 }, 8: { growth: 2, stress: 5 }, 9: { growth: 3, stress: 6 },
};

export const ENN_CENTER = { 1: 'gut', 2: 'heart', 3: 'heart', 4: 'heart', 5: 'head', 6: 'head', 7: 'head', 8: 'gut', 9: 'gut' };
export const ENN_HARMONIC = { 1: 'competency', 2: 'positive', 3: 'competency', 4: 'reactive', 5: 'competency', 6: 'reactive', 7: 'positive', 8: 'reactive', 9: 'positive' };

export const INSTINCT_COMPAT = {
  'sp-sp': { bond: 'Shared focus on security and comfort creates a grounded, stable foundation.', tension: 'Can become too insular — both may resist pushing each other into growth or new experiences.' },
  'sp-sx': { bond: 'SP grounds SX\'s intensity; SX pulls SP into deeper connection and aliveness.', tension: 'SP may find SX\'s all-or-nothing energy exhausting; SX may feel SP is too cautious or withholding.' },
  'sp-so': { bond: 'SP handles personal stability while SO navigates the social world — a natural complementary pairing.', tension: 'SP may find SO\'s social focus draining; SO may feel SP is too self-focused or withdrawn from the group.' },
  'sx-sx': { bond: 'Electric mutual intensity — both crave deep, transformative, one-on-one connection.', tension: 'Can become an isolated bubble, or compete for the role of \'most compelling\' — escalation is a risk.' },
  'sx-so': { bond: 'SX brings passionate depth; SO brings breadth and social awareness — a vivid complementary pair.', tension: 'SX may feel SO is too diffuse or shallow; SO may feel SX\'s intensity is overwhelming or demanding.' },
  'so-so': { bond: 'Shared investment in community and social contribution creates a natural sense of partnership and purpose.', tension: 'Can compete for social influence or recognition; may neglect the intimacy and depth of the relationship itself.' },
};
