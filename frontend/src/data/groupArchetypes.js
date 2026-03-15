export const GROUP_ARCHETYPES = [
  {
    id: 'war_council',
    name: 'The War Council',
    description: 'A gut-heavy, assertive group that moves fast and decides boldly. Action is the default response to any problem. The group radiates confidence and can accomplish a great deal — but nuance and dissenting voices may get steamrolled.',
    strengths: [
      'Decisive and action-oriented',
      'Strong shared instinct for leadership',
      'High collective confidence and follow-through',
      'Excellent at executing under pressure'
    ],
    challenges: [
      'May bulldoze quieter perspectives',
      'Conflict can become personal quickly',
      'Risk of shared blind spot around vulnerability and feelings',
      'Can mistake speed for wisdom'
    ],
    advice: 'Deliberately slow down before major decisions and actively invite the quietest voice in the room. Create a structured space for dissent so nuance is not lost to momentum.',
    matchFn: (c, h) => c.gut > 0.5 && h.assertive > 0.5
  },
  {
    id: 'dream_team',
    name: 'The Dream Team',
    description: 'A heart-centered group rich in empathy, vision, and interpersonal attunement. The relational fabric is warm and the shared imagination is expansive. Hard truths, however, can feel like betrayals and may be avoided.',
    strengths: [
      'Deep empathy and emotional intelligence',
      'Strong shared vision and creative potential',
      'Naturally supportive and affirming culture',
      'Excellent at inspiring and motivating others'
    ],
    challenges: [
      'May avoid delivering difficult feedback',
      'Conflict can feel deeply personal',
      'Risk of groupthink driven by harmony-seeking',
      'Practical execution can lag behind ideals'
    ],
    advice: 'Build in a regular "reality check" ritual where hard data and uncomfortable truths are welcomed. Pair ideation sessions with concrete accountability steps.',
    matchFn: (c, h) => c.heart > 0.5 && h.compliant < 0.4 && h.withdrawn < 0.4
  },
  {
    id: 'think_tank',
    name: 'The Think Tank',
    description: 'A head-heavy group that excels at analysis, strategy, and systems thinking. The intellectual energy is high and ideas are rigorously examined. However, the group may over-deliberate and struggle to move from insight to action.',
    strengths: [
      'Deep analytical and strategic capacity',
      'Comfort with complexity and ambiguity',
      'Excellent at research, planning, and problem-solving',
      'High tolerance for nuance and uncertainty'
    ],
    challenges: [
      'Analysis paralysis is a real risk',
      'Emotional and relational needs may go unaddressed',
      'Decisions can be delayed by endless qualification',
      'May intellectualize rather than act on gut instincts'
    ],
    advice: 'Set clear decision deadlines and honor them. Assign a rotating "action champion" whose job is to translate insight into concrete next steps.',
    matchFn: (c) => c.head > 0.5
  },
  {
    id: 'round_table',
    name: 'The Round Table',
    description: 'A well-balanced group with representation from all three Enneagram centers — gut, heart, and head. The group has access to a full range of human intelligence: instinct, empathy, and analysis. The challenge is finding a unified voice across these different orientations.',
    strengths: [
      'Diverse perspectives and natural checks and balances',
      'Access to gut instinct, emotional attunement, and strategic thinking',
      'Less likely to have catastrophic blind spots',
      'Can adapt well to a wide range of challenges'
    ],
    challenges: [
      'May struggle to agree on priorities or approach',
      'Different processing styles can cause friction',
      'Requires more deliberate communication across center differences',
      'Can feel slow or indecisive due to competing orientations'
    ],
    advice: 'Explicitly name which mode — gut decision, heart check, or head analysis — is most needed at each stage of a process. Rotate facilitation to honor different styles.',
    matchFn: (c) => c.gut >= 0.25 && c.heart >= 0.25 && c.head >= 0.25 && Math.max(c.gut, c.heart, c.head) < 0.5
  },
  {
    id: 'fortress',
    name: 'The Fortress',
    description: 'A group dominated by self-preservation instinct. Security, comfort, resources, and routines are the shared currency. The group is stable and reliable, but can be resistant to change and may prioritize safety over growth.',
    strengths: [
      'Highly reliable and consistent',
      'Strong focus on practical needs and resource management',
      'Creates stable, low-drama environments',
      'Excellent at long-term planning and maintenance'
    ],
    challenges: [
      'May resist change even when it is necessary',
      'Can become overly risk-averse or insular',
      'Social and relational dimensions may be underprioritized',
      'Shared SP blind spot around letting go and taking leaps'
    ],
    advice: 'Schedule regular "risk reviews" to evaluate whether caution is serving growth or stalling it. Invite outside perspectives to challenge the status quo.',
    matchFn: (c, h, i) => i.SP > 0.5
  },
  {
    id: 'crucible',
    name: 'The Crucible',
    description: 'A group dominated by sexual/intensity instinct. Everything is felt deeply and pursued intensely. The group creates powerful connections and transformative experiences — but can also exhaust itself and others through the relentless drive for depth.',
    strengths: [
      'Intense focus and passionate engagement',
      'Creates deep bonds and profound experiences',
      'Highly motivated and energizing',
      'Excellent at breakthrough moments and transformations'
    ],
    challenges: [
      'Can exhaust members through sustained intensity',
      'May neglect practical day-to-day needs',
      'Risk of interpersonal volatility and drama',
      'Shared SX blind spot around the mundane and sustainable'
    ],
    advice: 'Build in deliberate recovery and decompression rituals. Celebrate the quiet wins alongside the peak experiences to sustain long-term energy.',
    matchFn: (c, h, i) => i.SX > 0.5
  },
  {
    id: 'assembly',
    name: 'The Assembly',
    description: 'A group dominated by social instinct. Community, belonging, and collective wellbeing are the organizing principles. The group is excellent at building culture and networks — but may struggle with individual accountability and direct confrontation.',
    strengths: [
      'Strong sense of community and shared purpose',
      'Excellent at building networks and culture',
      'Naturally inclusive and group-aware',
      'High skill in navigating social dynamics'
    ],
    challenges: [
      'May avoid holding individuals accountable',
      'Personal needs can be subordinated to group harmony',
      'Direct confrontation and one-on-one depth may be avoided',
      'Shared SO blind spot around individual self-expression'
    ],
    advice: 'Create mechanisms for individual accountability that feel connected to collective values. Practice direct one-on-one communication alongside group-level work.',
    matchFn: (c, h, i) => i.SO > 0.5
  },
  {
    id: 'council_of_elders',
    name: 'The Council of Elders',
    description: 'A group where withdrawn types predominate. Reflection, independence, and a measured pace define the culture. There is great depth here, but the group may struggle to project its ideas outward or take decisive action.',
    strengths: [
      'Deep reflective capacity and wisdom',
      'Comfortable with solitude and independent work',
      'Excellent at thoughtful, considered perspectives',
      'Creates space for depth over speed'
    ],
    challenges: [
      'May withdraw from conflict rather than engage it',
      'Outward communication and visibility can suffer',
      'Shared withdrawn blind spot around direct assertion',
      'Can feel slow or detached to more action-oriented partners'
    ],
    advice: 'Practice bringing ideas and perspectives outward more quickly, before they are fully polished. Assign explicit spokespersons to represent the group externally.',
    matchFn: (c, h) => h.withdrawn > 0.6
  },
  {
    id: 'engine_room',
    name: 'The Engine Room',
    description: 'A group where assertive types dominate. High energy, bold moves, and forward momentum define the culture. The group gets things done — but may burn through goodwill and miss the signals that course correction is needed.',
    strengths: [
      'High-energy and driven to achieve',
      'Comfortable taking initiative and ownership',
      'Excellent at breaking through obstacles',
      'Creates a culture of accountability and results'
    ],
    challenges: [
      'May override others\' needs and boundaries',
      'Feedback loops can be weak — the group keeps moving',
      'Shared assertive blind spot around rest and repair',
      'Can mistake aggression for leadership'
    ],
    advice: 'Build in structured listening and feedback loops. Reward the act of pausing and recalibrating as much as the act of pushing forward.',
    matchFn: (c, h) => h.assertive > 0.6
  },
  {
    id: 'community_garden',
    name: 'The Community Garden',
    description: 'A group where compliant types predominate — those who respond to an inner or outer standard (types 1, 2, 6). The group is conscientious, loyal, and deeply committed to doing the right thing. But self-assertion and boundary-setting can be underdeveloped.',
    strengths: [
      'Strong shared values and ethical commitment',
      'Highly reliable, loyal, and conscientious',
      'Excellent at process, care, and stewardship',
      'Creates environments of trust and safety'
    ],
    challenges: [
      'May defer to authority or standards over personal judgment',
      'Self-assertion and boundary-setting can be weak',
      'Shared compliant blind spot around personal needs and desires',
      'Resentment can build when self-sacrifice is unreciprocated'
    ],
    advice: 'Practice naming personal wants and needs explicitly. Create space for healthy disagreement with rules and norms as a sign of mature, not disloyal, engagement.',
    matchFn: (c, h) => h.compliant > 0.6
  },
  {
    id: 'gut_and_heart',
    name: 'The Gut and Heart',
    description: 'A group with strong gut and heart presence but minimal head energy. The group is instinctively reactive and emotionally engaged, with high relational intensity. Strategic planning and analytical detachment are the missing ingredients.',
    strengths: [
      'Strong instinctive and emotional intelligence',
      'Excellent relational depth and loyalty',
      'Action is backed by genuine feeling',
      'Creates passionate, committed cultures'
    ],
    challenges: [
      'May lack strategic planning and analytical rigor',
      'Decisions can be reactive rather than reasoned',
      'Shared blind spot around detachment and objectivity',
      'Head-type perspectives may feel cold or unwelcome'
    ],
    advice: 'Deliberately bring in analytical tools and external data before major decisions. Seek out advisors or team members who lead with strategic thinking.',
    matchFn: (c) => c.gut >= 0.35 && c.heart >= 0.35 && c.head < 0.2
  },
  {
    id: 'head_and_heart',
    name: 'The Head and Heart',
    description: 'A group with strong head and heart presence but minimal gut energy. The group is thoughtful and empathetic, with rich inner lives and nuanced communication. But decisive action, especially under pressure, can be a struggle.',
    strengths: [
      'Deep intellectual and emotional intelligence',
      'Excellent at understanding complexity in people and systems',
      'Nuanced communicators with high relational awareness',
      'Creates environments of safety and thoughtfulness'
    ],
    challenges: [
      'May struggle with decisive, timely action',
      'Gut-level instinct and boldness can be lacking',
      'Shared blind spot around direct assertion and confrontation',
      'Can over-process before acting'
    ],
    advice: 'Practice trusting gut instincts alongside analysis and empathy. Set action deadlines and honor the wisdom of moving even when it does not feel fully ready.',
    matchFn: (c) => c.head >= 0.35 && c.heart >= 0.35 && c.gut < 0.2
  },
  {
    id: 'gut_and_head',
    name: 'The Gut and Head',
    description: 'A group with strong gut and head presence but minimal heart energy. The group combines decisive action with strategic analysis, creating an efficient, goal-oriented culture. But emotional attunement, warmth, and relational depth may be underdeveloped.',
    strengths: [
      'Strong strategic and instinctive intelligence',
      'Excellent at complex problem-solving under pressure',
      'Goal-oriented and efficient',
      'High capacity for both planning and execution'
    ],
    challenges: [
      'Emotional needs and relational repair can be neglected',
      'Warmth and empathy may feel foreign or inefficient',
      'Shared blind spot around feelings and interpersonal attunement',
      'Team culture can feel cold or transactional'
    ],
    advice: 'Schedule regular check-ins focused purely on how people are feeling, not what they are doing. Invest in team culture and emotional safety as strategic priorities.',
    matchFn: (c) => c.gut >= 0.35 && c.head >= 0.35 && c.heart < 0.2
  },
  {
    id: 'gut_dominant',
    name: 'The Gut Dominant',
    description: 'A group with a clear majority in the gut center. Instinct, body wisdom, and directness are the shared language. The group trusts its gut and moves with conviction — but may undervalue reflection and emotional attunement.',
    strengths: [
      'Strong instinctive intelligence and directness',
      'Comfortable with confrontation and boundary-setting',
      'Action-oriented and decisive',
      'Creates cultures of honesty and accountability'
    ],
    challenges: [
      'May overlook emotional and analytical dimensions',
      'Gut-led decisions can miss important nuance',
      'Shared blind spot around reflection and planning',
      'Can feel blunt or insensitive to heart and head types'
    ],
    advice: 'Build deliberate pauses for reflection before acting. Actively seek perspectives from heart- and head-centered voices, especially on people-related decisions.',
    matchFn: (c) => c.gut > 0.5 && c.heart <= 0.5 && c.head <= 0.5
  },
  {
    id: 'heart_dominant',
    name: 'The Heart Dominant',
    description: 'A group with a clear majority in the heart center. Emotion, relationship, and image are the organizing forces. The group is warm, attuned, and deeply relational — but may struggle with objectivity and impersonal decision-making.',
    strengths: [
      'Exceptional relational intelligence and empathy',
      'Strong shared commitment to people and community',
      'Excellent at emotional support and cultural cohesion',
      'Creates warm, inclusive environments'
    ],
    challenges: [
      'Objectivity and hard decisions can be avoided',
      'Image and perception may be over-managed',
      'Shared blind spot around detachment and impersonal reasoning',
      'Gut instincts and strategic thinking can be underdeveloped'
    ],
    advice: 'Practice making decisions based on data and principles alongside emotional intelligence. Build tolerance for disappointing people in service of what is right.',
    matchFn: (c) => c.heart > 0.5 && c.gut <= 0.5 && c.head <= 0.5
  },
  {
    id: 'head_dominant',
    name: 'The Head Dominant',
    description: 'A group with a clear majority in the head center. Thinking, planning, and strategy are the native mode. The group can map any terrain intellectually — but living in that map, acting on it, and feeling it can be challenges.',
    strengths: [
      'Exceptional analytical and strategic intelligence',
      'Comfortable with complexity, ambiguity, and nuance',
      'Excellent at research, forecasting, and systems thinking',
      'Creates cultures of rigor and curiosity'
    ],
    challenges: [
      'May intellectualize rather than act or feel',
      'Emotional and instinctive intelligence can be underdeveloped',
      'Shared blind spot around embodied action and relational warmth',
      'Decisions can be delayed indefinitely by analysis'
    ],
    advice: 'Set firm decision deadlines. Practice honoring emotional reactions and gut instincts as valuable data, not noise to be rationalized away.',
    matchFn: (c) => c.head > 0.5 && c.gut <= 0.5 && c.heart <= 0.5
  },
  {
    id: 'all_types_present',
    name: 'The Full Spectrum',
    description: 'A group representing all nine Enneagram types. This is extremely rare and represents the fullest possible range of human motivation, perception, and strategy. The potential is immense — and so is the complexity.',
    strengths: [
      'Access to the full range of human motivational intelligence',
      'No major collective blind spots by type',
      'Enormous diversity of perspective and approach',
      'Capable of addressing nearly any challenge'
    ],
    challenges: [
      'Communication across such different styles requires significant investment',
      'Finding shared language and values takes time',
      'Coordination costs are high',
      'Risk of fragmentation along type lines'
    ],
    advice: 'Invest heavily in shared language and shared purpose. Use the group\'s diversity as a deliberate tool — assign roles and tasks that play to each type\'s core strengths.',
    matchFn: () => false // Matched externally when all 9 types are present
  },
  {
    id: 'survivor_cluster',
    name: 'The Survivor Cluster',
    description: 'A group where SP and SX instincts are strong but SO is the shared repressed instinct. The group is intensely focused on personal security and deep one-on-one connection — but the wider social world, community, and group awareness are a persistent blind spot.',
    strengths: [
      'Strong personal loyalty and one-on-one depth',
      'Highly attuned to practical needs and survival',
      'Intense bonds within the group',
      'Self-sufficient and resourceful'
    ],
    challenges: [
      'May neglect broader social context and community needs',
      'Shared SO blind spot can cause political and social missteps',
      'Group can feel insular or clannish to outsiders',
      'Scaling beyond a small, tight-knit circle is difficult'
    ],
    advice: 'Deliberately practice zooming out to the wider social and community context. Assign someone to track external relationships and broader stakeholder needs.',
    matchFn: (c, h, i) => i.SP > 0.35 && i.SX > 0.35 && i.SO < 0.25
  },
  {
    id: 'social_engine',
    name: 'The Social Engine',
    description: 'A group where SP and SO instincts are strong but SX is the shared repressed instinct. The group is excellent at building stable, community-oriented structures — but depth, intensity, and transformative one-on-one connection can be avoided.',
    strengths: [
      'Strong at building sustainable community structures',
      'Practical and socially aware in equal measure',
      'Creates reliable, inclusive environments',
      'Excellent at long-term institutional stewardship'
    ],
    challenges: [
      'May avoid intensity and depth in relationships',
      'Shared SX blind spot around passion, chemistry, and transformation',
      'Can feel overly safe or predictable',
      'One-on-one relational depth may be lacking'
    ],
    advice: 'Create opportunities for deeper, more personal connection within the group. Make space for intensity and vulnerability alongside the practical and communal work.',
    matchFn: (c, h, i) => i.SP > 0.35 && i.SO > 0.35 && i.SX < 0.25
  },
  {
    id: 'intensity_chamber',
    name: 'The Intensity Chamber',
    description: 'A group where SX and SO instincts are strong but SP is the shared repressed instinct. The group lives for connection, community, and intensity — but basic self-care, personal resources, and practical stability are chronically neglected.',
    strengths: [
      'Deeply relational and community-oriented',
      'High intensity and passion in shared pursuits',
      'Excellent at creating powerful shared experiences',
      'Strong social awareness and interpersonal depth'
    ],
    challenges: [
      'Shared SP blind spot around self-care, resources, and stability',
      'Practical and logistical needs can be chronically neglected',
      'May burn hot and fast without sustainable structures',
      'Individual wellbeing can be sacrificed for group experience'
    ],
    advice: 'Build in structural support for practical needs — finances, health, logistics. Treat self-preservation not as selfish but as the foundation that makes intensity sustainable.',
    matchFn: (c, h, i) => i.SX > 0.35 && i.SO > 0.35 && i.SP < 0.25
  }
];

export function matchGroupArchetype(centerDist, harmonicDist, hornevianDist, instinctDist) {
  // centerDist: { gut: count, heart: count, head: count }
  // Returns the best matching archetype or null
  const total = Object.values(centerDist).reduce((s, v) => s + v, 0);
  if (total === 0) return null;

  const cPct = {
    gut: (centerDist.gut || 0) / total,
    heart: (centerDist.heart || 0) / total,
    head: (centerDist.head || 0) / total
  };
  const hPct = hornevianDist ? {
    assertive: (hornevianDist.assertive || 0) / total,
    compliant: (hornevianDist.compliant || 0) / total,
    withdrawn: (hornevianDist.withdrawn || 0) / total
  } : {};
  const iPct = instinctDist ? {
    SP: (instinctDist.SP || 0) / total,
    SX: (instinctDist.SX || 0) / total,
    SO: (instinctDist.SO || 0) / total
  } : {};

  // Check each archetype's match condition
  for (const archetype of GROUP_ARCHETYPES) {
    if (archetype.matchFn(cPct, hPct, iPct)) return archetype;
  }
  return GROUP_ARCHETYPES.find(a => a.id === 'round_table') || null;
}
