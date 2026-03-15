// mbtiDevelopment.js
// Describes how each MBTI type's cognitive stack develops across life stages.
// Development order mirrors the function stack: dominant is strongest from youth,
// auxiliary flourishes in young adulthood, tertiary emerges at midlife,
// and the inferior integrates in mature development.

export const MBTI_DEVELOPMENT = {
  INFP: {
    // Stack: Fi (dom) → Ne (aux) → Si (tert) → Te (inf)
    childhood:
      'Often felt different from peers. Rich inner fantasy life. May have been labeled "too sensitive." Found solace in books, art, or nature.',
    adolescence:
      'Identity exploration intensifies. Strong reactions to perceived injustice. May struggle with the structure of school. Creative output increases.',
    youngAdult:
      'Auxiliary Ne flourishes — period of exploration, idealism, and possibility. May struggle with career direction (too many interests). Relationships deepen.',
    midlife:
      'Tertiary Si develops — growing appreciation for routine, tradition, and grounding. May reconnect with family or cultural roots. The "settling" phase.',
    maturity:
      'Inferior Te integrates — can now organize, execute, and assert boundaries without losing authenticity. The fully developed INFP is both a dreamer and a doer.',
  },

  INFJ: {
    // Stack: Ni (dom) → Fe (aux) → Ti (tert) → Se (inf)
    childhood:
      'Intensely private and perceptive. Had strong, often uncanny intuitions about people and situations. May have felt like an outsider who understood others better than they were understood.',
    adolescence:
      'Auxiliary Fe awakens — a deep desire to help, connect, and be understood. Strong moral convictions begin forming. May be drawn to counseling, writing, or advocacy roles.',
    youngAdult:
      'Ni and Fe work in tandem to build a vision for a meaningful life and pursue it with quiet determination. Relationships are deep and selective. Boundaries can be hard to maintain.',
    midlife:
      'Tertiary Ti emerges — a growing need to think things through independently and critique even cherished beliefs. May pull back from relationships to develop a more personal intellectual framework.',
    maturity:
      'Inferior Se integrates — becomes more present, embodied, and able to enjoy sensory experience without guilt. The mature INFJ balances visionary idealism with groundedness in the here and now.',
  },

  INTP: {
    // Stack: Ti (dom) → Ne (aux) → Si (tert) → Fe (inf)
    childhood:
      'Highly curious and internally active. Often questioned rules and found the social world confusing or exhausting. May have been seen as quiet, odd, or precociously analytical.',
    adolescence:
      'Ti sharpens — arguments are dissected, inconsistencies noticed, systems built in the mind. May feel alienated from peers who seem uninterested in ideas. Academic performance is uneven but peaks in areas of passion.',
    youngAdult:
      'Auxiliary Ne ignites — a period of intense intellectual exploration across many domains. Ideas multiply faster than they can be completed. Careers and relationships may feel constraining.',
    midlife:
      'Tertiary Si develops — growing appreciation for expertise built over time, established routines, and the value of depth over novelty. May revisit and refine foundational ideas rather than chasing new ones.',
    maturity:
      'Inferior Fe integrates — becomes more emotionally expressive and capable of warmth without feeling exposed. The mature INTP can lead, collaborate, and connect without abandoning intellectual rigor.',
  },

  INTJ: {
    // Stack: Ni (dom) → Te (aux) → Fi (tert) → Se (inf)
    childhood:
      'Independent and self-directed from an early age. Had a powerful inner sense of how things should be. Often found peers unsophisticated or authority figures illogical. Preferred competence over connection.',
    adolescence:
      'Ni sharpens into a laser-focus on long-term goals. Te begins asserting itself as a drive to build, execute, and demonstrate competence. May struggle with school systems that reward compliance over insight.',
    youngAdult:
      'Te fully activates — relentless pursuit of goals, systems thinking, and measurable achievement. May sacrifice relationships and self-care in service of the vision. Reputation for being cold or arrogant.',
    midlife:
      'Tertiary Fi surfaces — a growing awareness of personal values, emotional needs, and the question of whether the goals pursued are actually meaningful. A period of questioning and internal recalibration.',
    maturity:
      'Inferior Se integrates — learns to inhabit the present, appreciate aesthetic and sensory experience, and act spontaneously without anxiety. The mature INTJ is still strategic, but no longer imprisoned by the plan.',
  },

  ISFP: {
    // Stack: Fi (dom) → Se (aux) → Ni (tert) → Te (inf)
    childhood:
      'Gentle, sensitive, and acutely aware of beauty and fairness. Often expressed deep feelings through art, music, or movement rather than words. Avoided conflict and needed a safe, harmonious environment.',
    adolescence:
      'Se awakens — a deepening engagement with the physical world through sensation, craft, and aesthetic experience. Identity is expressed through personal style, art, and lived experience rather than ideas or achievement.',
    youngAdult:
      'Fi and Se work together to create a deeply authentic, present-centered life. Relationships are intense and personal. May resist conventional career paths in favor of work that feels meaningful and expressive.',
    midlife:
      'Tertiary Ni emerges — a growing capacity for pattern recognition, long-term thinking, and a sense of personal purpose that goes beyond the immediate. May begin mentoring others or deepening a spiritual life.',
    maturity:
      'Inferior Te integrates — develops the ability to organize, set goals, and follow through on commitments without abandoning the soft, values-led core. The mature ISFP is both deeply authentic and effectively capable.',
  },

  ISFJ: {
    // Stack: Si (dom) → Fe (aux) → Ti (tert) → Ne (inf)
    childhood:
      'Loyal, observant, and deeply attached to family and familiar routines. Excellent memory for personal details and past experiences. Was often the responsible, caring child who noticed what others needed.',
    adolescence:
      'Fe strengthens — a growing need to contribute, belong, and maintain harmony in social groups. Takes on caretaking roles naturally. Strong sense of duty forms around family and community expectations.',
    youngAdult:
      'Si and Fe combine to create a reliable, warm, and deeply committed presence in relationships and work. May sacrifice personal needs for others. Often underestimated due to quiet demeanor.',
    midlife:
      'Tertiary Ti develops — a growing capacity for critical thinking and independent judgment. May begin to question obligations accepted uncritically in youth. Starts setting boundaries with more confidence.',
    maturity:
      'Inferior Ne integrates — becomes more open to change, possibility, and the unfamiliar. The mature ISFJ retains their warmth and reliability while developing genuine curiosity and flexibility.',
  },

  ISTP: {
    // Stack: Ti (dom) → Se (aux) → Ni (tert) → Fe (inf)
    childhood:
      'Independent, observant, and mechanically curious from an early age. Preferred doing to talking. Often took things apart to understand how they worked. Resisted arbitrary rules and emotional demands.',
    adolescence:
      'Ti sharpens as a drive to master systems, techniques, and physical skills. Se engages through action-oriented hobbies — sports, mechanics, crafts, or hands-on exploration. May be seen as detached or unemotional.',
    youngAdult:
      'Ti and Se in full partnership — a period of skilled mastery, pragmatic problem-solving, and real-time engagement with the world. Excels in high-stakes, hands-on environments. Relationships are casual but genuine.',
    midlife:
      'Tertiary Ni emerges — a growing interest in the deeper meaning behind patterns and a longer time horizon for decisions. May find themselves becoming more strategic and reflective than they expected.',
    maturity:
      'Inferior Fe integrates — emotional intelligence deepens. Develops the ability to acknowledge and express feelings, and to support others without feeling compromised. The mature ISTP is both masterful and human.',
  },

  ISTJ: {
    // Stack: Si (dom) → Te (aux) → Fi (tert) → Ne (inf)
    childhood:
      'Dutiful, reliable, and highly attentive to how things were done before. Thrived with clear expectations and consistent routines. Often the responsible child who could be counted on completely.',
    adolescence:
      'Te strengthens — achievement, structure, and following through on commitments become central to identity. Hard-working and methodical. May struggle with change, ambiguity, or peers who seem irresponsible.',
    youngAdult:
      'Si and Te in full alignment — a period of steady, disciplined building of career, reputation, and family. Deeply reliable and capable. May be rigid about how things "should" be done.',
    midlife:
      'Tertiary Fi surfaces — a gradual reckoning with personal values, emotional needs, and whether the life built is truly satisfying. May begin to differentiate between duty and genuine desire.',
    maturity:
      'Inferior Ne integrates — becomes more open to possibility, change, and creative alternatives. The mature ISTJ retains their precision and dependability while developing genuine adaptability and imagination.',
  },

  ENFP: {
    // Stack: Ne (dom) → Fi (aux) → Te (tert) → Si (inf)
    childhood:
      'Enthusiastic, imaginative, and socially magnetic from an early age. Full of ideas and energy. May have been labeled "too much" or scattered. Connected deeply with people and thrived on novelty.',
    adolescence:
      'Ne blazes — possibilities multiply, identities shift, interests multiply. Deeply empathetic and idealistic. May feel constrained by structure and rebel against institutions that feel limiting.',
    youngAdult:
      'Auxiliary Fi matures — the exuberant idealism of youth becomes anchored in a growing awareness of core values. Relationships become more intentional. The question shifts from "what is possible?" to "what matters?"',
    midlife:
      'Tertiary Te develops — a growing capacity to organize, execute, and build structures that make the vision real. May find themselves taking on leadership roles or managing systems they once would have dismissed.',
    maturity:
      'Inferior Si integrates — develops the ability to ground themselves in routine, honor past experience, and sustain effort without burning out. The mature ENFP is still expansive and inspiring, but now has roots.',
  },

  ENFJ: {
    // Stack: Fe (dom) → Ni (aux) → Se (tert) → Ti (inf)
    childhood:
      'Warm, attuned, and socially gifted from very early. Noticed and responded to others\' emotions naturally. Often played the role of mediator, encourager, or social architect among peers.',
    adolescence:
      'Fe and Ni combine — a vision for what people and communities could become begins forming. Deeply concerned with injustice. May take on leadership roles in school or activist contexts.',
    youngAdult:
      'A period of expansive social investment — building relationships, leading groups, and pursuing a mission. Can overextend in service of others. Learning where personal care ends and self-sacrifice begins.',
    midlife:
      'Tertiary Se develops — a growing appreciation for the concrete, the present, and the aesthetic. May develop new interests in physical craft, nature, or embodied experience. Becomes more grounded and direct.',
    maturity:
      'Inferior Ti integrates — develops the capacity for independent critical thinking and honest intellectual scrutiny. The mature ENFJ can disagree, analyze, and set limits without losing their warmth or vision.',
  },

  ENTP: {
    // Stack: Ne (dom) → Ti (aux) → Fe (tert) → Si (inf)
    childhood:
      'Relentlessly curious, quick-witted, and often a handful for authority. Loved debate, hypotheticals, and finding loopholes. May have been seen as a troublemaker who was also clearly brilliant.',
    adolescence:
      'Ne in overdrive — challenging every assumption, playing devil\'s advocate, exploring every idea as a game. Ti begins sharpening — arguments must be internally consistent, not just creative.',
    youngAdult:
      'Ne and Ti in full collaboration — a period of restless intellectual productivity. Starts many projects, debates everything, and thrives in environments that reward quick thinking and unconventional ideas.',
    midlife:
      'Tertiary Fe develops — interpersonal intelligence grows. Realizes that ideas need audiences, and that moving people matters as much as being right. Leadership becomes more sophisticated and less combative.',
    maturity:
      'Inferior Si integrates — develops the capacity for follow-through, consistency, and honoring commitments made in the past. The mature ENTP is still inventive and irreverent, but now reliable and complete.',
  },

  ENTJ: {
    // Stack: Te (dom) → Ni (aux) → Se (tert) → Fi (inf)
    childhood:
      'Natural leader who took charge of situations from an early age. Confident, competitive, and results-oriented. May have been seen as bossy. Had a strong sense of how things should be organized.',
    adolescence:
      'Te sharpens — drive to achieve, lead, and build is intense. Ni begins forming a long-range vision that anchors the ambition. Academic and extracurricular excellence pursued relentlessly.',
    youngAdult:
      'A period of intense achievement — career-building, strategic networking, and visible accomplishment. Can appear ruthless or insensitive. Excellent under pressure, but may struggle to slow down.',
    midlife:
      'Tertiary Se develops — a growing capacity to engage with the present, appreciate sensory experience, and act spontaneously. May soften and become more comfortable with pleasure, recreation, and the unexpected.',
    maturity:
      'Inferior Fi integrates — emotional self-awareness deepens. Develops genuine empathy, an appreciation for personal values beyond achievement, and the capacity for vulnerability. The mature ENTJ is powerful and human.',
  },

  ESFP: {
    // Stack: Se (dom) → Fi (aux) → Te (tert) → Ni (inf)
    childhood:
      'Vibrant, social, and fully alive in the present moment. Loved play, performance, and sensory experience. Charming and people-oriented, with a natural talent for reading a room and bringing energy to it.',
    adolescence:
      'Se blazes — deeply engaged with appearance, experience, social dynamics, and performance. Fi begins asserting a personal sense of what feels right and wrong beneath the social surface.',
    youngAdult:
      'Se and Fi in partnership — a period of authentic self-expression, rich social life, and values-driven choices about relationships and lifestyle. Career paths tend to follow passion over planning.',
    midlife:
      'Tertiary Te develops — a growing drive to organize, accomplish, and build something lasting. May take on managerial or entrepreneurial roles. Learning to balance spontaneity with follow-through.',
    maturity:
      'Inferior Ni integrates — develops the capacity for long-term thinking, pattern recognition, and a sense of deeper purpose. The mature ESFP is still fully alive and present, but now guided by a meaningful vision.',
  },

  ESFJ: {
    // Stack: Fe (dom) → Si (aux) → Ne (tert) → Ti (inf)
    childhood:
      'Sociable, caring, and deeply attuned to social expectations. Thrived when belonging and contributing to a harmonious group. Noticed what others needed and naturally moved to provide it.',
    adolescence:
      'Fe and Si combine — strong investment in social belonging, tradition, and being a reliable presence in the lives of others. School roles, family duties, and peer relationships are central.',
    youngAdult:
      'A period of community-building and relationship investment. Deeply committed to friends, family, and institutions. May struggle to distinguish personal desires from social obligations.',
    midlife:
      'Tertiary Ne emerges — a growing curiosity about possibilities, new ideas, and perspectives beyond the familiar. May become interested in travel, education, or causes that feel expansive and novel.',
    maturity:
      'Inferior Ti integrates — develops the capacity for independent analysis and honest critical thinking. The mature ESFJ retains deep warmth while becoming able to hold firm in disagreement and evaluate objectively.',
  },

  ESTP: {
    // Stack: Se (dom) → Ti (aux) → Fe (tert) → Ni (inf)
    childhood:
      'Bold, energetic, and immediately engaged with the world around them. Loved action, competition, and being in the thick of things. May have been labeled impulsive or a risk-taker.',
    adolescence:
      'Se in full force — sports, social dominance, hands-on challenges, and immediate experience are primary. Ti begins forming — an instinct for tactics, analysis, and figuring out how systems can be exploited.',
    youngAdult:
      'Se and Ti working together — period of high-impact action, real-time problem-solving, and confidence in fast-moving environments. May cut corners on relationships or long-term planning.',
    midlife:
      'Tertiary Fe develops — emotional intelligence grows. Realizes that people aren\'t just means to ends, and that how they are treated matters. Leadership becomes more collaborative and persuasive.',
    maturity:
      'Inferior Ni integrates — develops the capacity for strategic foresight, deeper meaning, and commitment to a long-term vision. The mature ESTP is still dynamic and direct, but now guided by wisdom, not just momentum.',
  },

  ESTJ: {
    // Stack: Te (dom) → Si (aux) → Ne (tert) → Fi (inf)
    childhood:
      'Orderly, responsible, and clear about expectations from an early age. Respected authority and expected others to do the same. Had strong opinions about how things should be done and was not shy about expressing them.',
    adolescence:
      'Te sharpens — achievement, structure, and leadership roles become central. Si reinforces loyalty to tradition, proven methods, and institutional standards. A clear sense of duty and hierarchy forms.',
    youngAdult:
      'A period of building — career advancement, family formation, and establishing a reliable place in the community. Deeply dependable and productive. May struggle with those who seem irresponsible or unconventional.',
    midlife:
      'Tertiary Ne emerges — a growing openness to new ideas, creative approaches, and perspectives outside the established order. May begin questioning some traditions and become more intellectually curious.',
    maturity:
      'Inferior Fi integrates — emotional self-awareness and personal values come into focus. Develops genuine empathy and the capacity to act from feeling rather than just duty. The mature ESTJ is principled and fully human.',
  },
};
