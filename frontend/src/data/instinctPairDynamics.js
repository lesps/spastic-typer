// All 21 pairwise combinations of the 6 instinct stacks.
// Keys are canonicalized: alphabetically-first stack string comes first, separated by '__'.
// Use instinctPairKey(stackA, stackB) to look up any pair.

export const INSTINCT_PAIR_DYNAMICS = {
  // ─── SP/SO/SX ── SP/SX/SO ────────────────────────────────────────────────
  // Shared dominant (SP), different secondary
  'SP/SO/SX__SP/SX/SO': {
    compatibility: 'high',
    label: 'The Stable Explorers',
    dynamic: 'Both lead with self-preservation, so there is immediate common ground around practical needs, comfort, and resources. The difference shows in the secondary drive: SP/SX seeks intensity in the private sphere while SP/SO weaves those needs into a social fabric. Each understands the other\'s need for security but experiences it differently.',
    strength: 'Shared SP anchor creates mutual respect for boundaries and practical life. Neither will demand more intimacy or social obligation than the other can give.',
    challenge: 'The SP/SX person may find SP/SO too group-oriented and not intimate enough; SP/SO may find SP/SX too insular and neglectful of communal responsibilities.',
    tip: 'Agree on a rhythm of private time together and shared social engagement. Neither agenda cancels the other out — they are complementary expressions of the same SP core.'
  },

  // ─── SP/SX/SO ── SP/SX/SO ────────────────────────────────────────────────
  // Identical stacks
  'SP/SX/SO__SP/SX/SO': {
    compatibility: 'high',
    label: 'The Cozy Cocoon',
    dynamic: 'Two people with identical instinct stacks mirror each other closely. Both prioritize personal security first, then seek intensity in close relationships, with social belonging as a distant third. The result is a deeply comfortable, self-contained pairing that builds a rich private world together.',
    strength: 'Immediate understanding of each other\'s rhythms, needs, and priorities. No negotiation needed around the basic hierarchy of drives.',
    challenge: 'Shared blind spot around the social world — the pair can become an island, neglecting networks, community, and broader relationships that sustain long-term wellbeing.',
    tip: 'Periodically check in on your social health as a unit. Schedule group engagements before they feel necessary, not after they have been avoided too long.'
  },

  // ─── SP/SX/SO ── SX/SP/SO ────────────────────────────────────────────────
  // Shared dominant flipped: SP-first vs SX-first, both SO-last
  'SP/SX/SO__SX/SP/SO': {
    compatibility: 'high',
    label: 'The Magnetic Pair',
    dynamic: 'These two share the same repressed instinct (SO) and have their first two drives in opposite order. SP/SX leads with safety, then craves intensity; SX/SP leads with intensity, then seeks safety. There is a natural gravitational pull — each has what the other wants next — creating a dynamic, complementary bond.',
    strength: 'Natural complementarity: the SP/SX person grounds the SX/SP\'s intensity in practical reality, while the SX/SP person invites the SP/SX out of comfort and into aliveness.',
    challenge: 'Friction around timing: SX/SP wants to dive deep immediately; SP/SX needs security established before opening up. Neither\'s approach is wrong, but they can feel impatient with each other.',
    tip: 'SX/SP: give the SP/SX time to settle in before pushing for depth. SP/SX: trust that diving in together is not reckless — it is where this relationship wants to go.'
  },

  // ─── SP/SX/SO ── SX/SO/SP ────────────────────────────────────────────────
  // Opposing dominants (SP vs SX), different secondary
  'SP/SX/SO__SX/SO/SP': {
    compatibility: 'medium',
    label: 'The Spark and the Hearth',
    dynamic: 'SP/SX leads with security and values intensity within that safe container. SX/SO leads with intensity and weaves it through community. The SP/SX person can feel both attracted to the SX/SO\'s aliveness and overwhelmed by how relentlessly outward and social it becomes. Growth potential is high because each represents a genuinely different way of being alive.',
    strength: 'Each person expands the other\'s world — SP/SX gains access to community and social richness; SX/SO gains access to groundedness and private depth.',
    challenge: 'Fundamentally different orientations around security and sociality can cause repeated misattunements. The SP/SX needs to retreat; the SX/SO needs to engage.',
    tip: 'Establish clear agreements about alone time versus shared social engagement. Honor the differences as features rather than flaws — they are the source of the relationship\'s growth.'
  },

  // ─── SP/SX/SO ── SO/SP/SX ────────────────────────────────────────────────
  // Opposing dominants (SP vs SO), both have SX repressed
  'SO/SP/SX__SP/SX/SO': {
    compatibility: 'medium',
    label: 'The Anchor and the Village',
    dynamic: 'SP/SX leads with personal security and intimate intensity, while SO/SP leads with community and then grounds it in practical stability. Both have SX repressed — neither is naturally drawn to the raw intensity and chemistry of the SX world. This gives the pair a comfortable, relatively undramatic tone, but also a shared avoidance of the most transformative relational depths.',
    strength: 'Mutual respect for practical needs and social responsibilities. Neither person will demand the other open up in ways that feel invasive.',
    challenge: 'Shared SX repression means depth and transformation may be chronically avoided. The relationship can feel safe but stagnant over time.',
    tip: 'Deliberately create space for intensity and vulnerability together — practices, experiences, or conversations that go deeper than comfort usually allows.'
  },

  // ─── SP/SX/SO ── SO/SX/SP ────────────────────────────────────────────────
  // Opposing dominants (SP vs SO), different secondary
  'SO/SX/SP__SP/SX/SO': {
    compatibility: 'medium',
    label: 'The Homebody and the Ambassador',
    dynamic: 'SP/SX leads with personal security and private intensity. SO/SX leads with community and weaves intensity through social bonds. These are opposite first drives, creating the maximum range of perspectives. The SP/SX person builds an inner sanctuary; the SO/SX person builds a social cathedral. Each can expand the other\'s world significantly.',
    strength: 'Maximum complementarity — both gain access to a world they instinctively undervalue. The SP/SX gains social richness; the SO/SX gains private depth and groundedness.',
    challenge: 'Initial friction is highest of any pairing. Fundamentally different orientations around privacy versus community need explicit negotiation.',
    tip: 'Start by mapping each other\'s actual needs — not assumptions — around alone time, social engagement, and intimacy. Build explicit agreements rather than relying on intuition.'
  },

  // ─── SP/SO/SX ── SP/SO/SX ────────────────────────────────────────────────
  // Identical stacks
  'SP/SO/SX__SP/SO/SX': {
    compatibility: 'high',
    label: 'The Neighborhood Watch',
    dynamic: 'Two SP/SO types share a strong orientation around security, stability, and community. Both prioritize practical needs and social belonging while keeping intensity and depth as a distant third. The relationship is reliable, warm, and community-embedded — a partnership others lean on.',
    strength: 'Exceptional stability and shared values around practical life and social responsibility. Deep mutual understanding of each other\'s rhythms without negotiation.',
    challenge: 'Shared SX repression means the relationship may stay perpetually comfortable and avoid the kind of passionate depth that renews and transforms. Risk of a pleasant but stagnant plateau.',
    tip: 'Schedule experiences that deliberately push into new territory — travel, art, vulnerable conversations — to keep the relationship alive and growing beyond its comfort zone.'
  },

  // ─── SP/SO/SX ── SX/SP/SO ────────────────────────────────────────────────
  // SP-first vs SX-first
  'SP/SO/SX__SX/SP/SO': {
    compatibility: 'high',
    label: 'The Grounded and the Alive',
    dynamic: 'SP/SO leads with security and community; SX/SP leads with intensity and then grounds it in personal security. The SP/SO person offers stability and social context; the SX/SP person offers aliveness and depth. There is genuine complementarity and mutual attraction, though the pace and orientation are quite different.',
    strength: 'The SP/SO person creates the stable, socially embedded container in which the SX/SP person\'s intensity can be expressed safely. Neither overwhelms the other.',
    challenge: 'SP/SO may find SX/SP\'s intensity exhausting or threatening; SX/SP may find SP/SO\'s community-first orientation too diffuse and not personal enough.',
    tip: 'SX/SP: appreciate that the SP/SO\'s social groundedness is a gift, not a limitation. SP/SO: allow some of the SX/SP\'s intensity in — it is the relationship\'s source of vitality.'
  },

  // ─── SP/SO/SX ── SX/SO/SP ────────────────────────────────────────────────
  // SP-first vs SX-first, both SO-middle
  'SP/SO/SX__SX/SO/SP': {
    compatibility: 'medium',
    label: 'The Pragmatist and the Visionary',
    dynamic: 'Both place SO in the middle, meaning both care about community but neither leads or trails with it. SP/SO anchors everything in practical security; SX/SO anchors everything in passionate intensity. They share a social orientation that provides common ground, but their primary drives are in tension.',
    strength: 'Shared SO middle means both genuinely value community and can build meaningful social lives together without either feeling dragged.',
    challenge: 'SP/SO can feel like the SX/SO person is too ungrounded and resource-careless; SX/SO can feel like the SP/SO person is too cautious and lacks fire.',
    tip: 'Use the shared SO instinct as a bridge — build projects and communities together that honor both practical sustainability and passionate purpose.'
  },

  // ─── SP/SO/SX ── SO/SP/SX ────────────────────────────────────────────────
  // Adjacent and complementary, both SX-repressed
  'SO/SP/SX__SP/SO/SX': {
    compatibility: 'high',
    label: 'The Responsible Stewards',
    dynamic: 'SP/SO and SO/SP are adjacent stacks with flipped order. Both have the same top two drives and the same repressed instinct (SX). The SP/SO person grounds in personal security first; the SO/SP person grounds in community first. Both are reliable, community-oriented, and practical. There is a natural ease and shared language.',
    strength: 'Very high natural compatibility — both value stability and community without the intensity and volatility of SX. The relationship is comfortable, warm, and socially embedded.',
    challenge: 'The shared SX repression means depth, passion, and transformation are jointly avoided. The relationship risks becoming so comfortable it loses its edge.',
    tip: 'Commit together to periodic depth experiences — conversations, retreats, practices — that take you below the surface of the socially functional partnership you naturally build.'
  },

  // ─── SP/SO/SX ── SO/SX/SP ────────────────────────────────────────────────
  // SP-first vs SO-first, different secondary
  'SO/SX/SP__SP/SO/SX': {
    compatibility: 'medium',
    label: 'The Steward and the Catalyst',
    dynamic: 'SP/SO leads with practical security and grounds social life in it; SO/SX leads with community and infuses it with intensity. Both value social belonging, but from very different entry points. The SP/SO person may find the SO/SX person destabilizing; the SO/SX person may find the SP/SO person limiting.',
    strength: 'Shared SO instinct creates genuine common ground around community, relationships, and social responsibility.',
    challenge: 'SP brings stability that SX/SO finds constraining; SX brings intensity that SP/SO finds unsettling. The secondary difference creates friction in how community is actually experienced.',
    tip: 'Focus on the SO common ground — build shared social projects and communities where both feel meaningfully engaged, and let the differences in style be generative rather than divisive.'
  },

  // ─── SX/SP/SO ── SX/SP/SO ────────────────────────────────────────────────
  // Identical stacks
  'SX/SP/SO__SX/SP/SO': {
    compatibility: 'high',
    label: 'The Intense Alliance',
    dynamic: 'Two SX/SP people share the same priorities: depth and chemistry first, personal security second, social belonging a distant third. The result is a pair with extraordinary potential for passionate, transformative connection — contained in a practical, somewhat insular private world.',
    strength: 'Immediate and profound understanding of each other\'s needs for depth, privacy, and passionate engagement. No translation required.',
    challenge: 'Shared SO repression means the pair is a closed circuit — potentially very intense but isolated. Social myopia is the shared blind spot, and it can compound.',
    tip: 'Deliberately build social infrastructure beyond the two of you. Communities, friendships, and social roles are not distractions from your depth — they sustain it.'
  },

  // ─── SX/SP/SO ── SX/SO/SP ────────────────────────────────────────────────
  // Shared dominant (SX), different secondary
  'SX/SO/SP__SX/SP/SO': {
    compatibility: 'high',
    label: 'The Intensity Spectrum',
    dynamic: 'Both lead with SX intensity, creating immediate recognition and mutual attraction. The difference is in how they channel that intensity: SX/SP channels it inward into private, contained passion; SX/SO channels it outward into social connections and community. Each understands the SX core but experiences its expression differently.',
    strength: 'Shared SX dominant creates deep mutual recognition — both know what it is to lead with intensity and neither will pathologize the other for it.',
    challenge: 'SX/SP seeks depth in private; SX/SO seeks depth through the social world. Negotiating where and how depth gets expressed is the central challenge.',
    tip: 'Create both private intensity rituals and shared social experiences that carry meaning. Neither mode should be sacrificed for the other.'
  },

  // ─── SX/SP/SO ── SO/SP/SX ────────────────────────────────────────────────
  // Opposing dominants (SX vs SO), both SP-middle
  'SO/SP/SX__SX/SP/SO': {
    compatibility: 'medium',
    label: 'The Depth and the Breadth',
    dynamic: 'SX/SP leads with intensity and seeks private depth; SO/SP leads with community and seeks broad relational engagement. Both have SP in the middle, which creates a shared orientation around practical needs — a useful bridge. But their first drives are opposite, meaning their fundamental experience of what matters most is different.',
    strength: 'Shared SP middle creates practical common ground. Neither will neglect basic life management and both can rely on each other for stability.',
    challenge: 'SX/SP can experience SO/SP as socially scattered and insufficiently deep; SO/SP can experience SX/SP as too intense and exclusive.',
    tip: 'Lean on the shared SP practical layer to build day-to-day reliability. From that stable base, negotiate explicit time for SX depth and SO breadth without one consuming the other.'
  },

  // ─── SX/SP/SO ── SO/SX/SP ────────────────────────────────────────────────
  // Opposing dominants (SX vs SO), different secondary
  'SO/SX/SP__SX/SP/SO': {
    compatibility: 'medium',
    label: 'The Private Fire and the Public Hearth',
    dynamic: 'SX/SP brings private intensity and personal depth; SO/SX brings community-embedded passion and social aliveness. Both carry SX energy but express it in opposite directions — inward versus outward. The attraction is real but so is the fundamental difference in orientation.',
    strength: 'Mutual SX energy creates genuine intensity and passion in the connection. The SO/SX person can draw the SX/SP person outward; the SX/SP person can draw the SO/SX person inward.',
    challenge: 'SX/SP\'s need for exclusive depth can conflict with SO/SX\'s need to extend intensity across a wider social world. Each can feel diluted or suffocated by the other.',
    tip: 'Explicitly negotiate the balance between exclusive private depth and shared social intensity. Make clear agreements rather than assuming the other person intuits your needs.'
  },

  // ─── SX/SO/SP ── SX/SO/SP ────────────────────────────────────────────────
  // Identical stacks
  'SX/SO/SP__SX/SO/SP': {
    compatibility: 'high',
    label: 'The Passionate Community',
    dynamic: 'Two SX/SO people share the same intense, community-focused orientation. Both lead with passion and weave it through social bonds. The result is a dynamic, socially embedded relationship rich in shared purpose and collective energy. Personal security is the shared blind spot.',
    strength: 'Immediate understanding of each other\'s need for intensity, depth, and social embedding. Together, they build vibrant, meaningful communities.',
    challenge: 'Shared SP repression means practical needs, resources, and personal stability are jointly neglected. The relationship may be exhilarating but poorly resourced.',
    tip: 'Build in explicit accountability around practical life: finances, health, physical environment. Treat SP stability as the foundation that makes your intensity sustainable.'
  },

  // ─── SX/SO/SP ── SO/SP/SX ────────────────────────────────────────────────
  // Adjacent with complementary SX-first vs SO-first
  'SO/SP/SX__SX/SO/SP': {
    compatibility: 'medium',
    label: 'The Vision and the Village',
    dynamic: 'SX/SO leads with intense, transformative energy channeled through community; SO/SP leads with community grounded in practical stability. Both care about social belonging but lead with very different energies. The SX/SO person electrifies; the SO/SP person stabilizes. Together they can build vibrant and sustainable communities.',
    strength: 'Complementary social orientations: SX/SO provides the vision and intensity; SO/SP provides the structure and longevity.',
    challenge: 'SX/SO may find SO/SP too cautious and insufficiently passionate; SO/SP may find SX/SO too volatile and destabilizing.',
    tip: 'Frame each other\'s differences as complementary roles in shared projects: the catalyst and the architect. Each is incomplete without the other.'
  },

  // ─── SX/SO/SP ── SO/SX/SP ────────────────────────────────────────────────
  // Adjacent and complementary with flipped order
  'SO/SX/SP__SX/SO/SP': {
    compatibility: 'high',
    label: 'The Intensity Loop',
    dynamic: 'SX/SO and SO/SX are adjacent stacks with flipped order, both sharing SP as their repressed instinct. Both are intensely social and passionately engaged — the difference is whether intensity or community is the starting point. There is a natural affinity and shared language of passion and social engagement.',
    strength: 'High natural compatibility — both are energized by intensity and community, and neither will pathologize the other for neglecting personal security.',
    challenge: 'Shared SP repression means both will neglect practical life. The relationship can be electrifying but chronically under-resourced.',
    tip: 'Assign explicit responsibility for SP domains: finances, health, logistics. Do not wait until a crisis forces you to address the practical layer.'
  },

  // ─── SO/SP/SX ── SO/SP/SX ────────────────────────────────────────────────
  // Identical stacks
  'SO/SP/SX__SO/SP/SX': {
    compatibility: 'high',
    label: 'The Community Pillars',
    dynamic: 'Two SO/SP people share a deeply community-oriented, practically grounded orientation. Both lead with social belonging, ground it in personal stability, and share SX as their repressed instinct. The result is a reliable, community-embedded partnership that others look to for stability.',
    strength: 'Exceptionally aligned values and priorities. The relationship is stable, socially integrated, and oriented toward shared stewardship.',
    challenge: 'Shared SX repression means depth, intensity, and transformative connection are jointly avoided. The relationship can be wonderful and yet somehow never quite electric.',
    tip: 'Make a deliberate practice of going deeper together — vulnerability, creative risk, intense experiences — to keep the relationship vitalized beyond its natural comfort level.'
  },

  // ─── SO/SP/SX ── SO/SX/SP ────────────────────────────────────────────────
  // Adjacent with flipped secondary
  'SO/SP/SX__SO/SX/SP': {
    compatibility: 'high',
    label: 'The Social Architects',
    dynamic: 'Both lead with SO, meaning community is the shared foundation of everything. The difference is in the secondary: SO/SP channels community through practical stability; SO/SX channels community through intensity and depth. Both understand each other\'s primary social drive without needing to explain it.',
    strength: 'Shared SO dominant creates strong common ground around community, belonging, and social responsibility. Neither will pull the other away from their shared social world.',
    challenge: 'SO/SP can find SO/SX too emotionally volatile; SO/SX can find SO/SP too cautious and not passionate enough.',
    tip: 'Channel the shared SO energy into building communities and projects together. Let the SP/SX difference in secondary drive provide creative tension rather than friction.'
  },

  // ─── SO/SX/SP ── SO/SX/SP ────────────────────────────────────────────────
  // Identical stacks
  'SO/SX/SP__SO/SX/SP': {
    compatibility: 'high',
    label: 'The Passionate Tribe',
    dynamic: 'Two SO/SX people share an intensely community-oriented, passionately engaged orientation. Both lead with social belonging infused with intensity. The relationship is warm, vibrant, and socially expansive. SP is the shared repressed instinct.',
    strength: 'Immediate and profound alignment around what matters most: community, passion, and shared intensity. Together they build electrifying social worlds.',
    challenge: 'Shared SP repression means both will neglect practical life, resources, and individual wellbeing. The shared blind spot compounds rather than cancels.',
    tip: 'Build in explicit individual self-care practices. Schedule alone time, check in on personal resources, and honor the SP layer before it becomes a crisis.'
  }
};

export function instinctPairKey(stackA, stackB) {
  const a = Array.isArray(stackA) ? stackA.join('/') : stackA;
  const b = Array.isArray(stackB) ? stackB.join('/') : stackB;
  // Canonicalize: alphabetically smaller string first
  return a <= b ? `${a}__${b}` : `${b}__${a}`;
}
