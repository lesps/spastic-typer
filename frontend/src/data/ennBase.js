// Enneagram base profiles — 18 entries (9 types × 2 wings each)
// Used by generateCombinations.mjs to build full combination profiles

export const ENN_BASE = {
  "1w9": {
    "portrait": "The 1w9 carries a quiet moral authority, combining the Reformer\u2019s drive for correctness with the Peacemaker\u2019s need for inner calm. They are principled without being preachy, preferring to lead by example rather than lecture. Their inner critic is persistent but often turned inward, making them harder on themselves than on others.",
    "strengths": ["principled", "composed", "fair-minded", "self-disciplined"],
    "growthEdges": ["difficulty relaxing standards", "suppressed resentment", "emotional detachment"],
    "stressSummary": "Under stress, they withdraw and become coldly rigid, enforcing rules as a way to manage anxiety.",
    "growthSummary": "Growth comes from accepting imperfection in themselves and others and learning to act from serenity rather than duty."
  },
  "1w2": {
    "portrait": "The 1w2 merges the Reformer\u2019s idealism with the Helper\u2019s interpersonal warmth, producing someone who crusades for improvement with a personal, relational touch. They care deeply about doing right by people and can be charismatic advocates for causes that protect the vulnerable. Their inner critic is active but often projected outward as a desire to fix what others are doing wrong.",
    "strengths": ["idealistic", "warm", "persuasive", "conscientious"],
    "growthEdges": ["self-righteousness", "burning out from over-helping", "difficulty receiving criticism"],
    "stressSummary": "Under stress, they become controlling and moralistic, insisting others meet their high standards.",
    "growthSummary": "Growth arrives when they separate helping from approval-seeking and trust that imperfect action still has value."
  },
  "2w1": {
    "portrait": "The 2w1 blends the Helper\u2019s relational attunement with the Reformer\u2019s sense of duty, creating someone who gives not just out of affection but out of moral obligation to serve. They hold themselves to high standards of care and can be quietly judgmental when others fall short of the generosity they expect. Their service feels principled, even noble, but can tip into martyrdom.",
    "strengths": ["nurturing", "ethical", "reliable", "empathetic"],
    "growthEdges": ["suppressed needs", "critical undertone", "difficulty receiving care"],
    "stressSummary": "Under stress, they become resentful and silently critical, feeling their sacrifices are unappreciated.",
    "growthSummary": "Growth happens when they acknowledge their own needs without guilt and give freely rather than transactionally."
  },
  "2w3": {
    "portrait": "The 2w3 pairs the Helper\u2019s relational warmth with the Achiever\u2019s drive for recognition, making them an energetic, socially magnetic presence who thrives on being indispensable. They are natural networkers who remember names, feelings, and favors, weaving relationships into a web of mutual obligation. Their generosity is genuine but often mixed with a quiet desire to be admired for it.",
    "strengths": ["charismatic", "generous", "socially skilled", "motivated"],
    "growthEdges": ["attention-seeking", "people-pleasing", "identity tied to usefulness"],
    "stressSummary": "Under stress, they become possessive and image-conscious, performing care rather than expressing it.",
    "growthSummary": "Growth comes from separating their worth from what they do for others and building an identity that stands independently."
  },
  "3w2": {
    "portrait": "The 3w2 combines the Achiever\u2019s ambition with the Helper\u2019s relational instincts, producing a person who succeeds by inspiring and connecting with others. They are polished, persuasive, and genuinely interested in the people around them, which makes them effective leaders and collaborators. Their drive for success is always filtered through how they are perceived in relationships.",
    "strengths": ["ambitious", "charming", "people-focused", "adaptable"],
    "growthEdges": ["image management", "difficulty with vulnerability", "conflating love with performance"],
    "stressSummary": "Under stress, they overextend socially, trying to maintain every relationship while their authentic self recedes.",
    "growthSummary": "Growth comes from letting people see their struggles and discovering that connection deepens through honesty, not performance."
  },
  "3w4": {
    "portrait": "The 3w4 fuses the Achiever\u2019s goal-orientation with the Individualist\u2019s desire for authentic self-expression, creating someone who wants to succeed on their own distinctive terms. They are more introspective and emotionally complex than other Threes, often wrestling with questions of identity beneath a competent exterior. Their ambition is personal and meaningful, not merely social.",
    "strengths": ["driven", "creative", "self-aware", "original"],
    "growthEdges": ["shame-sensitivity", "comparing themselves to others", "oscillating between confidence and self-doubt"],
    "stressSummary": "Under stress, they withdraw into self-critical loops, questioning whether their achievements are truly authentic.",
    "growthSummary": "Growth arrives when they stop measuring authenticity against an ideal self and embrace the person they already are."
  },
  "4w3": {
    "portrait": "The 4w3 pairs the Individualist\u2019s depth and longing with the Achiever\u2019s drive to be seen and recognized, producing a person who channels their emotional intensity into ambitious creative or personal output. They want to be both singular and successful, craving acknowledgment that their uniqueness has real-world value. This can generate tremendous creative drive but also painful envy when recognition feels insufficient.",
    "strengths": ["expressive", "ambitious", "emotionally intelligent", "creative"],
    "growthEdges": ["envy and comparison", "identity fragility under criticism", "performing depth"],
    "stressSummary": "Under stress, they become competitive and image-driven, losing touch with the genuine feeling that originally motivated them.",
    "growthSummary": "Growth comes from creating for the work itself rather than for the validation it might bring."
  },
  "4w5": {
    "portrait": "The 4w5 merges the Individualist\u2019s emotional depth with the Investigator\u2019s need for understanding, creating a person who retreats into rich inner worlds and explores the furthest edges of human experience through thought, art, or solitary inquiry. They are intensely private and self-sufficient, suspicious of conventional life, and drawn to the strange and profound. Their inner landscape is vast but can become isolating.",
    "strengths": ["depth", "originality", "intellectual curiosity", "self-sufficient"],
    "growthEdges": ["withdrawal and isolation", "melancholic rumination", "difficulty engaging practically"],
    "stressSummary": "Under stress, they retreat entirely, becoming absorbed in private suffering and cutting off connection.",
    "growthSummary": "Growth comes from bringing their inner richness outward in relationship, letting others witness rather than only imagining their depth."
  },
  "5w4": {
    "portrait": "The 5w4 combines the Investigator\u2019s analytical detachment with the Individualist\u2019s emotional intensity and longing for meaning, producing a person who pursues knowledge not just intellectually but as a form of self-definition. They are drawn to unconventional ideas and aesthetic experiences, and their inner life is far richer than their reserved exterior suggests. They feel deeply but express little.",
    "strengths": ["analytical", "imaginative", "perceptive", "independent"],
    "growthEdges": ["emotional withholding", "romanticizing isolation", "difficulty with ordinary life"],
    "stressSummary": "Under stress, they become withdrawn and nihilistic, losing confidence in both their knowledge and their identity.",
    "growthSummary": "Growth comes from trusting that sharing their inner world with others will not diminish it."
  },
  "5w6": {
    "portrait": "The 5w6 blends the Investigator\u2019s drive for competence and knowledge with the Loyalist\u2019s concern for security and allegiance, producing a person who builds expertise as a defense against an unpredictable world. They are careful, methodical, and deeply loyal to a small trusted circle. Their thinking is systematic and they tend to prepare exhaustively for worst-case scenarios.",
    "strengths": ["thorough", "loyal", "strategic", "dependable"],
    "growthEdges": ["analysis paralysis", "anxiety about competence gaps", "difficulty with spontaneity"],
    "stressSummary": "Under stress, they become hypervigilant and scattered, unable to settle on a course of action.",
    "growthSummary": "Growth comes from acting despite uncertainty and discovering that real-world experience builds the confidence that analysis alone cannot."
  },
  "6w5": {
    "portrait": "The 6w5 pairs the Loyalist\u2019s vigilance and need for security with the Investigator\u2019s analytical self-sufficiency, creating a person who thinks carefully before trusting anyone or anything. They prepare meticulously, question authority rigorously, and build loyalty through demonstrated reliability rather than charm. Their skepticism protects them but can make intimacy slow to develop.",
    "strengths": ["perceptive", "prepared", "loyal", "intellectually rigorous"],
    "growthEdges": ["chronic doubt", "difficulty trusting without proof", "social guardedness"],
    "stressSummary": "Under stress, they become paranoid and isolating, convinced that danger is everywhere and no one is fully trustworthy.",
    "growthSummary": "Growth arrives when they learn that trust is built incrementally through action, not eliminated by analysis."
  },
  "6w7": {
    "portrait": "The 6w7 tempers the Loyalist\u2019s anxiety with the Enthusiast\u2019s warmth and optimism, producing a person who is sociable, funny, and self-deprecating about their own fears. They seek security through community and lighten serious situations with humor, but their underlying vigilance never fully rests. They are the friend who plans ahead, worries on behalf of the group, and then laughs about it afterward.",
    "strengths": ["warm", "witty", "community-oriented", "resourceful"],
    "growthEdges": ["avoidance through humor", "difficulty sitting with anxiety", "scattered attention"],
    "stressSummary": "Under stress, they become reactive and impulsive, self-medicating anxiety with stimulation or social noise.",
    "growthSummary": "Growth comes from turning inward to face anxiety directly rather than outrunning it through activity and connection."
  },
  "7w6": {
    "portrait": "The 7w6 pairs the Enthusiast\u2019s love of possibility with the Loyalist\u2019s need for belonging, creating someone who seeks adventure within the safety of trusted relationships. They are warm, funny, and socially invested, bringing others along on their explorations. Their anxiety is more visible than in other Sevens and they can be loyal to a fault when they find a group they trust.",
    "strengths": ["enthusiastic", "loyal", "spontaneous", "socially engaging"],
    "growthEdges": ["fear of missing out", "anxiety about commitment", "difficulty with endings"],
    "stressSummary": "Under stress, they become clingy and scattered, seeking reassurance while simultaneously planning escape routes.",
    "growthSummary": "Growth comes from staying present through discomfort and discovering that depth in relationships exceeds the thrill of novelty."
  },
  "7w8": {
    "portrait": "The 7w8 merges the Enthusiast\u2019s appetite for experience with the Challenger\u2019s boldness and assertion, creating a person of enormous energy, confidence, and appetite for life. They pursue pleasure, freedom, and impact with equal intensity and rarely back down from a challenge. They can be exhilarating to be around but may overwhelm others with the force of their will.",
    "strengths": ["bold", "energetic", "visionary", "resilient"],
    "growthEdges": ["excess and overreach", "difficulty tolerating limits", "bulldozing others"],
    "stressSummary": "Under stress, they become reckless and domineering, pushing harder when they should pause.",
    "growthSummary": "Growth comes from choosing depth over breadth and learning that slowing down amplifies rather than diminishes their impact."
  },
  "8w7": {
    "portrait": "The 8w7 combines the Challenger\u2019s raw power and protectiveness with the Enthusiast\u2019s love of life and expansiveness, producing a charismatic force of nature who leads boldly and lives fully. They are magnetic, direct, and unafraid to seize opportunity, often pulling others into their wake. Their energy is high and their appetite for experience nearly insatiable.",
    "strengths": ["bold", "charismatic", "strategic", "decisive"],
    "growthEdges": ["impatience with limits", "difficulty in vulnerability", "excess as avoidance"],
    "stressSummary": "Under stress, they escalate into confrontation and recklessness, mistaking intensity for control.",
    "growthSummary": "Growth comes from letting tenderness surface and discovering that real strength includes the willingness to be seen as human."
  },
  "8w9": {
    "portrait": "The 8w9 softens the Challenger\u2019s intensity with the Peacemaker\u2019s steadiness, producing a powerful but unhurried presence that commands respect without demanding it. They are quietly protective, deeply loyal, and slow to anger but formidable when aroused. Their authority is felt rather than announced, and they often become pillars of trust for the people around them.",
    "strengths": ["grounded", "protective", "authoritative", "calm under pressure"],
    "growthEdges": ["stubbornness", "passive accumulation of resentment", "difficulty with introspection"],
    "stressSummary": "Under stress, they become immovable and stonewalling, refusing to engage while pressure quietly builds.",
    "growthSummary": "Growth comes from naming their inner experience rather than acting from unexamined impulse and discovering that vulnerability deepens their authority."
  },
  "9w8": {
    "portrait": "The 9w8 pairs the Peacemaker\u2019s desire for harmony with the Challenger\u2019s underlying assertiveness, creating someone who appears easygoing but has a spine of iron when pushed. They mediate conflict skillfully and prefer peace, but when their limits are crossed they push back with surprising force. Their anger is real but slow to surface.",
    "strengths": ["grounded", "adaptable", "assertive when needed", "mediating"],
    "growthEdges": ["passive-aggressive expression", "difficulty initiating", "inertia despite capability"],
    "stressSummary": "Under stress, they stubbornly dig in and withdraw, becoming immovable while resentment accumulates silently.",
    "growthSummary": "Growth comes from claiming their own priorities proactively rather than waiting until anger forces them to act."
  },
  "9w1": {
    "portrait": "The 9w1 blends the Peacemaker\u2019s inclusive calm with the Reformer\u2019s quiet sense of moral order, creating someone who seeks harmony not just socially but ethically. They have a deep, if unexpressed, sense of how things ought to be and can be quietly principled without being combative. Their inner life is richer and more ordered than their placid exterior suggests.",
    "strengths": ["principled", "peaceful", "fair", "steady"],
    "growthEdges": ["suppressed opinion", "conflict avoidance masking judgment", "difficulty asserting priorities"],
    "stressSummary": "Under stress, they become silently critical and withdrawn, judging others internally while presenting a calm face.",
    "growthSummary": "Growth comes from voicing their values and preferences before withdrawal becomes the only language available to them."
  }
};
