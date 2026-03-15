// Pre-computed Enneagram type pair dynamics for all 45 unique pairs.
// Keys use lower-number-first format: '1_2', '1_3', ..., '8_9'.
// Arrow pairs (stress/growth lines) carry particular psychological depth and are noted in quickTake.
// Wing pairs (adjacent types) have natural mutual understanding.
// Same-center triads (gut: 1,8,9 | heart: 2,3,4 | head: 5,6,7) share core emotional concerns.

export const TYPE_INTERACTION_GRID = {
  // ── Type 1 pairs ────────────────────────────────────────────────────────────

  '1_2': {
    emoji: '🤝',
    label: 'Principled Helpers',
    quickTake: "Shared sense of duty; 1 provides structure, 2 provides warmth. Friction when 1 criticizes 2's people-pleasing or 2 resents 1's emotional distance.",
  },

  '1_3': {
    emoji: '🎯',
    label: 'Achievement Alliance',
    quickTake: 'Both image-conscious and driven. Can accomplish incredible things together. Risk: both avoid vulnerability and may compete over whose standards define success.',
  },

  '1_4': {
    emoji: '🔥',
    label: 'Integrity and Depth',
    quickTake: "Arrow pair (1's stress point). 1 is drawn to 4's emotional authenticity; 4 is drawn to 1's principled conviction. Tension arises when 1's criticism stings 4's sensitivity and 4's dramatism frustrates 1's need for order.",
  },

  '1_5': {
    emoji: '🔬',
    label: 'The Precision Pair',
    quickTake: "Both seek objective truth and hold themselves to rigorous standards. Highly productive intellectually. 1's moralism can feel intrusive to 5's autonomy; 5's detachment can feel irresponsible to 1.",
  },

  '1_6': {
    emoji: '⚖️',
    label: 'Duty and Vigilance',
    quickTake: "Shared commitment to responsibility, rules, and doing what's right. Can build a deeply trustworthy partnership. 1's certainty may clash with 6's doubt; 6's anxiety may frustrate 1's need for forward motion.",
  },

  '1_7': {
    emoji: '⚡',
    label: 'Reform and Renewal',
    quickTake: "Arrow pair (1's growth point). 7's spontaneity and joy can liberate 1 from rigid self-criticism; 1's discipline can help 7 follow through. Classic tension between structure and freedom.",
  },

  '1_8': {
    emoji: '🦁',
    label: 'Righteous Force',
    quickTake: 'Both gut-center types with strong convictions and a drive to correct injustice. Powerful allies. Conflict explodes when their definitions of right diverge — neither backs down easily.',
  },

  '1_9': {
    emoji: '🌿',
    label: 'Structure and Peace',
    quickTake: "Wing pair with complementary strengths. 1 brings direction and principle; 9 brings acceptance and calm. 1 may grow frustrated by 9's inertia; 9 may feel judged by 1's standards.",
  },

  // ── Type 2 pairs ────────────────────────────────────────────────────────────

  '2_3': {
    emoji: '✨',
    label: 'Heart-Center Ambition',
    quickTake: "Wing pair. 2 provides relational warmth; 3 provides social drive and competence. Can be a charming and effective team. Both avoid their own emotional needs — the relationship may lack genuine depth.",
  },

  '2_4': {
    emoji: '💜',
    label: 'Empathy and Longing',
    quickTake: "Arrow pair (2's growth point). Both feel things intensely and hunger for meaningful connection. 2 wants to give; 4 wants to be truly seen. Can achieve profound intimacy — or spiral into co-dependency and unmet expectations.",
  },

  '2_5': {
    emoji: '🌊',
    label: 'Warmth Meets Withdrawal',
    quickTake: "Deep complementarity and deep friction. 2 moves toward connection; 5 moves away from intrusion. When it works, 5 feels genuinely received by 2; 2 learns to respect space and autonomy.",
  },

  '2_6': {
    emoji: '🏡',
    label: 'Loyal Caretakers',
    quickTake: "Both deeply relational and committed to those they love. 2 provides warmth and nurturance; 6 provides reliability and protective vigilance. Risk: codependency through mutual need for reassurance.",
  },

  '2_7': {
    emoji: '🎉',
    label: 'Generous Spirits',
    quickTake: "Both positive-outlook types who focus on connection and possibility. Energetically matched. 2's emotional needs may feel heavy to 7; 7's avoidance of depth may feel shallow to 2.",
  },

  '2_8': {
    emoji: '💪',
    label: 'Care and Power',
    quickTake: "Arrow pair (2's stress point). Magnetic and volatile. 8 admires 2's warmth; 2 admires 8's strength. 8 can feel controlled by 2's emotional demands; 2 can feel bulldozed by 8's directness.",
  },

  '2_9': {
    emoji: '🌸',
    label: 'Gentle Nurturers',
    quickTake: "Both prioritize harmony and others' comfort. Deeply kind pair. Risk: neither initiates addressing real problems — conflict avoidance can allow resentments to quietly build.",
  },

  // ── Type 3 pairs ────────────────────────────────────────────────────────────

  '3_4': {
    emoji: '🎭',
    label: 'Image and Identity',
    quickTake: "Wing pair. 3 performs for the world; 4 searches within for authentic self. Can push each other toward greater wholeness. 3 finds 4 self-indulgent; 4 finds 3 superficial — each holds what the other needs.",
  },

  '3_5': {
    emoji: '🧩',
    label: 'Competence Alliance',
    quickTake: "Both highly capable and self-contained. Can build impressively together. 3's image-management irritates 5's aversion to pretense; 5's withdrawal frustrates 3's need for visible partnership.",
  },

  '3_6': {
    emoji: '🔄',
    label: 'Drive and Doubt',
    quickTake: "Arrow pair (3's stress point). 3's confidence can reassure 6; 6's loyalty grounds 3's ambition. When unhealthy, 3 projects false certainty and 6 projects distrust — a cycle of performance masking anxiety.",
  },

  '3_7': {
    emoji: '🚀',
    label: 'Image and Pleasure',
    quickTake: "Both future-oriented, energized, and socially skilled. Exciting pair who can achieve great things. Risk: both avoid painful feelings and vulnerability — the relationship may stay permanently surface-level.",
  },

  '3_8': {
    emoji: '🏆',
    label: 'Power Players',
    quickTake: "Formidable partnership with complementary strengths — 3's strategic finesse meets 8's raw force. Can clash explosively over control and credit. Neither concedes ground easily.",
  },

  '3_9': {
    emoji: '🌅',
    label: 'Motion and Stillness',
    quickTake: "Arrow pair (3's growth point). 9 offers 3 a space to simply be, without performing. 3 can help 9 find direction. The risk: 3 may steamroll 9's agenda; 9 may enable 3's workaholism.",
  },

  // ── Type 4 pairs ────────────────────────────────────────────────────────────

  '4_5': {
    emoji: '🌌',
    label: 'Depth and Mystery',
    quickTake: "Wing pair. Both introspective, unconventional, and drawn to the intense and esoteric. Rich intellectual and emotional resonance. 4's emotional storms can overwhelm 5; 5's detachment can devastate 4.",
  },

  '4_6': {
    emoji: '🌀',
    label: 'Depth and Security',
    quickTake: "Both deeply feeling types who struggle with self-doubt. 4's emotional intensity gives 6 permission to feel; 6's loyalty gives 4 a stable base. Can amplify each other's anxiety when both are stressed.",
  },

  '4_7': {
    emoji: '🎨',
    label: 'Feeling and Flight',
    quickTake: "Complementary tension between diving in and moving on. 4 pulls the relationship deeper; 7 keeps it light and moving. 4 may feel abandoned by 7's deflection; 7 may feel pulled under by 4's intensity.",
  },

  '4_8': {
    emoji: '🌋',
    label: 'Passion and Power',
    quickTake: "Intensely compelling pair. Both are willing to go to extremes and refuse to be controlled. 8 is disarmed by 4's emotional depth; 4 is stirred by 8's protective strength. High highs and potentially devastating lows.",
  },

  '4_9': {
    emoji: '🍂',
    label: 'Longing and Acceptance',
    quickTake: "Arrow pair (4's growth point). 9's unconditional acceptance soothes 4's longing to be understood. 4 can help 9 wake up to their own desires. Risk: 4 may see 9 as emotionally unavailable; 9 may be overwhelmed by 4's needs.",
  },

  // ── Type 5 pairs ────────────────────────────────────────────────────────────

  '5_6': {
    emoji: '🔭',
    label: 'Analysts and Scouts',
    quickTake: "Wing pair. Both head-center types who prepare for threats through knowledge and analysis. Can be a highly effective problem-solving team. 5's detachment may feel cold to 6; 6's anxiety may feel irrational to 5.",
  },

  '5_7': {
    emoji: '💡',
    label: 'Mind and Possibility',
    quickTake: "Arrow pair (5's stress point). Both intellectually driven and fascinated by ideas. 7 pushes 5 into engagement with the world; 5 deepens 7's thinking. 7's social energy can exhaust 5; 5's withdrawal frustrates 7.",
  },

  '5_8': {
    emoji: '🧠',
    label: 'Strategy and Force',
    quickTake: "Arrow pair (5's growth point). 5 provides strategic depth; 8 provides decisive action. Powerful combination. 8 may find 5 too passive or withholding; 5 may find 8 overwhelming and overly blunt.",
  },

  '5_9': {
    emoji: '🏔️',
    label: 'Quiet Depths',
    quickTake: "Both highly independent, non-intrusive, and content with interior life. Can coexist peacefully for a long time. Risk: the relationship may drift into parallel lives, with genuine connection quietly going unbuilt.",
  },

  // ── Type 6 pairs ────────────────────────────────────────────────────────────

  '6_7': {
    emoji: '🎢',
    label: 'Anxiety and Optimism',
    quickTake: "Wing pair. 7's enthusiasm and forward-momentum can calm 6's fear; 6's loyalty and groundedness can anchor 7's scatter. 7 may dismiss 6's worries as irrational; 6 may find 7's avoidance of problems irresponsible.",
  },

  '6_8': {
    emoji: '🛡️',
    label: 'Security and Strength',
    quickTake: "Complementary pair: 8 offers 6 the protection and certainty they crave; 6's loyalty deeply satisfies 8. Risk: 6 may grow dependent on 8's authority; 8 may use 6's fear as leverage.",
  },

  '6_9': {
    emoji: '🌾',
    label: 'Calm in the Storm',
    quickTake: "Arrow pair (6's growth point). 9's equanimity soothes 6's vigilance; 6's loyalty gives 9 a reason to show up. Both can struggle with inertia — together they may avoid facing difficult realities.",
  },

  // ── Type 7 pairs ────────────────────────────────────────────────────────────

  '7_8': {
    emoji: '🔥',
    label: 'Fire and Fuel',
    quickTake: "Wing pair. Both big-energy types who are direct, bold, and hungry for life. Explosive chemistry. Can push each other to extraordinary things — or into shared recklessness and mutual power struggles.",
  },

  '7_9': {
    emoji: '🌈',
    label: 'Ease and Joy',
    quickTake: "Both positive-outlook types who prefer harmony and good feeling. Naturally easy and pleasant together. Risk: neither wants to face difficulty — the relationship may avoid the depth and conflict needed for real growth.",
  },

  // ── Type 8 pairs ────────────────────────────────────────────────────────────

  '8_9': {
    emoji: '⚓',
    label: 'Strength and Stillness',
    quickTake: "Wing pair. 8's force is softened by 9's patience; 9 is activated by 8's energy. Deeply complementary when healthy. 8 may grow frustrated by 9's stubbornness; 9 may feel steamrolled by 8's dominance.",
  },
};
