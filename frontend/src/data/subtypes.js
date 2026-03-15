export const SUBTYPES = {
  '1_SP': {
    name: 'Worry/Anxiety',
    nickname: 'The Perfectionist of Daily Life',
    description:
      "The SP 1 channels their inner critic into mastering practical domains — health, finances, home organization. Their anger is the most repressed of the 1 subtypes; it manifests as chronic worry and physical tension rather than outward irritation. They are often the 'counter-type' — the 1 that looks least like a 1 because their perfectionism is directed inward at self-sufficiency rather than outward at moral correction.",
    keyTraits: [
      'Meticulous self-management',
      'Anxiety about getting things wrong',
      'Frugality and material conscientiousness',
      'Repressed anger emerges as body tension',
    ],
    blindSpot:
      'May over-control personal habits while neglecting emotional needs. Can appear rigid or anxious to others who don\'t share their standards.',
    growthPath: 'Learning that imperfection in daily life is not a moral failing. Allowing spontaneity and mess.',
    commonMistype: '6 (shared anxiety pattern), 3 (shared self-improvement drive)',
  },
  '1_SX': {
    name: 'Zeal/Jealousy',
    nickname: 'The Reformer of Relationships',
    description:
      "The SX 1 directs their reforming energy toward their intimate partners and close relationships. They have a vision of the 'perfect relationship' and can become intensely frustrated when reality doesn't match. This is the most openly angry 1 subtype — their passion manifests as zeal for changing others to match their ideals. Can look like a 4 (intensity) or an 8 (directness).",
    keyTraits: [
      'Intense relationship standards',
      "Zeal for 'improving' partners",
      'Most openly angry 1',
      'Idealistic about intimacy',
    ],
    blindSpot:
      "Projects their inner critic onto partners. 'I'm not controlling, I'm helping you be your best self.'",
    growthPath:
      'Accepting partners as they are. Redirecting reform energy from others to self-awareness.',
    commonMistype: '4 (intensity), 8 (anger), 6 (counter-phobic energy)',
  },
  '1_SO': {
    name: 'Non-Adaptability/Rigidity',
    nickname: 'The Social Reformer',
    description:
      "The SO 1 focuses their perfectionism on social systems, organizations, and group norms. They are the 'textbook 1' — the crusader for justice, the one who writes the policy manual, the voice saying 'that's not how it should be done.' Their inner critic is projected onto society. They may become preachy or self-righteous when their social ideals are violated.",
    keyTraits: [
      'Crusader for social justice',
      "Strong opinions about 'the right way'",
      'Teacher/preacher energy',
      'Focus on collective standards',
    ],
    blindSpot: 'Self-righteousness masked as principle. Can alienate others with moral rigidity.',
    growthPath:
      'Distinguishing between personal standards and universal truths. Listening before correcting.',
    commonMistype: '8 (authority), 2 (helping orientation), 6 (rule-following)',
  },

  '2_SP': {
    name: 'Privilege/Me-First',
    nickname: 'The Charming Indispensable',
    description:
      'Counter-type. Least recognizable as a 2. Earns love through being charming and indispensable rather than selfless. Has a childlike, entitled quality. Seduces through being adorable rather than through service. Looks like a 7.',
    keyTraits: [
      'Childlike charm and warmth',
      'Earns love through being special/cute',
      'More entitled than other 2s',
      'Seduces through personality rather than service',
    ],
    blindSpot:
      'May not recognize their own need-seeking behavior because it looks like confidence rather than neediness.',
    growthPath:
      'Developing genuine self-sufficiency. Learning to ask directly for what they need.',
    commonMistype: '7 (positive affect), 3 (charm)',
  },
  '2_SX': {
    name: 'Seduction/Aggression',
    nickname: 'The Magnetic Helper',
    description:
      "The most emotionally intense 2. Uses personal magnetism and emotional power to bind specific individuals. 'I will make you need me.' Can be aggressive when love is threatened. Looks like an 8 or 4.",
    keyTraits: [
      'Intense personal magnetism',
      'Emotional power and manipulation',
      'Most aggressive of the 2 subtypes',
      'Binds specific people through intimacy',
    ],
    blindSpot:
      'Can become controlling or possessive in the name of care. May confuse intensity with love.',
    growthPath:
      "Learning that love doesn't require being indispensable. Trusting that genuine connection can exist without strings.",
    commonMistype: '8 (aggression), 4 (emotional intensity)',
  },
  '2_SO': {
    name: 'Ambition',
    nickname: 'The Strategic Helper',
    description:
      "Uses helping as a path to social influence and power. The 'power behind the throne.' Builds networks of obligation. Strategic about who they help. Can look like a 3 or 8.",
    keyTraits: [
      'Strategic relationship building',
      'Uses influence and connections for power',
      'Outwardly warm, inwardly calculating',
      'Builds networks of obligation',
    ],
    blindSpot:
      'May not admit how much they want recognition and power. Frames self-interest as service.',
    growthPath:
      'Acknowledging their own needs for recognition and influence. Separating genuine care from strategic help.',
    commonMistype: '3 (ambition), 8 (power-seeking)',
  },

  '3_SP': {
    name: 'Security/Workaholism',
    nickname: 'The Competent Workaholic',
    description:
      "Counter-type. The 3 that doesn't look vain — their image-management is about appearing competent and hardworking rather than glamorous. Workaholic. May deny being image-conscious at all. Looks like a 1 or 6.",
    keyTraits: [
      'Intense work ethic',
      'Denies vanity or image concern',
      'Competence-based identity',
      'Practical achiever rather than glamour-seeker',
    ],
    blindSpot:
      "May not recognize their own image-management. 'I'm not vain, I just have high standards.'",
    growthPath: 'Slowing down. Recognizing that their worth is not tied to productivity.',
    commonMistype: '1 (work ethic), 6 (responsibility)',
  },
  '3_SX': {
    name: 'Masculine/Feminine Image',
    nickname: 'The Charismatic Performer',
    description:
      "Projects an idealized gender or sexual image to attract. The 'trophy' partner. Success is measured by desirability to the target audience. More emotionally expressive than other 3s. Can look like a 2 or 7.",
    keyTraits: [
      'Projects idealized desirable image',
      'Success measured by attractiveness to others',
      'More emotionally expressive than other 3s',
      'Performs for specific audiences',
    ],
    blindSpot:
      'Confuses their image with their identity. Deep fear that the real self is not lovable.',
    growthPath:
      'Distinguishing between performance and authentic self-expression. Allowing vulnerability.',
    commonMistype: '2 (relating through charm), 7 (enthusiasm)',
  },
  '3_SO': {
    name: 'Prestige',
    nickname: 'The Status Achiever',
    description:
      "The 'textbook 3.' Seeks visible markers of success — titles, awards, social status. Adapts persona to match what each social context values. The chameleon. Most externally oriented 3.",
    keyTraits: [
      'Collects visible status symbols',
      'Expert social chameleon',
      'Outward achievement and recognition',
      'Adapts self to match what each group values',
    ],
    blindSpot:
      "Loses track of authentic self through constant persona-shifting. May not know who they are without an audience.",
    growthPath:
      'Staying consistent across contexts. Building identity not tied to external validation.',
    commonMistype: '8 (authority), 6 (institutional achievement)',
  },

  '4_SP': {
    name: 'Tenacity/Recklessness',
    nickname: 'The Stoic Sufferer',
    description:
      "Counter-type. Instead of expressing suffering outwardly, they endure it silently. Stoic. Internalizes pain and pushes through. Doesn't ask for help. Looks like a 1 (self-discipline) or 5 (withdrawal). The 'sunny 4' or 'tough 4.'",
    keyTraits: [
      'Stoic endurance of suffering',
      'Does not externalize emotional pain',
      'Pushes through without asking for help',
      'May appear more functional than other 4s',
    ],
    blindSpot:
      'Represses emotional needs until crisis. May dismiss therapy or emotional support as weakness.',
    growthPath:
      'Learning that asking for help is strength, not weakness. Allowing others to witness their pain.',
    commonMistype: '1 (self-discipline), 5 (withdrawal), 3 (pushing through)',
  },
  '4_SX': {
    name: 'Competition/Hate',
    nickname: 'The Intense Individualist',
    description:
      "The most intense and vocal 4. Externalizes envy as competition — 'I'll prove I'm special by being more intense/talented/deep than you.' Demands to be seen. Assertive, sometimes aggressive. Can look like an 8 or 3.",
    keyTraits: [
      'Externalizes envy as competition',
      'Demands to be seen and recognized',
      'Most assertive of the 4 subtypes',
      'Intensity as a form of self-assertion',
    ],
    blindSpot:
      'Envy disguised as ambition. May alienate others through competitiveness or emotional volatility.',
    growthPath:
      "Recognizing envy when it arises. Learning that others' success doesn't diminish their own worth.",
    commonMistype: '8 (assertion), 3 (competition)',
  },
  '4_SO': {
    name: 'Shame/Honor',
    nickname: 'The Suffering Witness',
    description:
      'Focuses their sense of deficiency on social belonging. Compares self to the group and always feels they come up short. Suffering is more public — they want others to witness and validate their pain. Can look like a 2 (desire for connection).',
    keyTraits: [
      'Public suffering and emotional display',
      'Compares self to the group constantly',
      'Wants others to witness and validate pain',
      'Shame as social comparison',
    ],
    blindSpot:
      "May use suffering as a bid for connection. 'If you see my pain, you'll love me.'",
    growthPath:
      "Finding belonging through contribution rather than suffering. Building identity beyond 'the one who suffers.'",
    commonMistype: '2 (desire for connection), 6 (comparison to group norms)',
  },

  '5_SP': {
    name: 'Castle/Home',
    nickname: 'The Fortress Builder',
    description:
      'The most withdrawn 5. Builds a literal and metaphorical fortress — needs absolute control over their physical space and resources. Hoards energy, time, and possessions. Minimalist. Looks most like a stereotypical 5.',
    keyTraits: [
      'Extreme resource hoarding (time, energy, space)',
      'Minimalist lifestyle',
      'Fierce need for private space',
      'Most withdrawn of the 5 subtypes',
    ],
    blindSpot:
      'Can become completely isolated, losing contact with the outer world and basic relationships.',
    growthPath:
      'Taking small risks with resources. Allowing others into their space without feeling depleted.',
    commonMistype: '9 (withdrawal), 1 (self-sufficiency)',
  },
  '5_SX': {
    name: 'Confidence/Sharing',
    nickname: 'The Trusted Confidant',
    description:
      'Counter-type. Seeks one intense relationship to share their inner world. Willing to be emotionally transparent with a chosen person. The most emotionally expressive 5. Chemistry-seeking. Can look like a 4.',
    keyTraits: [
      'Seeks one intense intellectual/emotional bond',
      'Willing to share inner world with trusted person',
      'Most emotionally expressive 5',
      'Chemistry and depth in relationships',
    ],
    blindSpot:
      "Can idealize the partner and then withdraw when reality doesn't match expectations.",
    growthPath:
      'Generalizing intimacy. Learning that multiple relationships can deepen rather than dilute connection.',
    commonMistype: '4 (intensity), 8 (confidence)',
  },
  '5_SO': {
    name: 'Totem/Symbols',
    nickname: 'The Intellectual Expert',
    description:
      "Seeks connection to groups through shared knowledge, ideals, or intellectual frameworks. The professor, the expert, the 'keeper of the sacred texts.' Connects to people through ideas rather than emotions. Can look like a 1 or 6.",
    keyTraits: [
      'Connects through shared knowledge and ideas',
      'Expert identity within groups',
      'Scholarly or intellectual role',
      'Uses frameworks to navigate social world',
    ],
    blindSpot:
      'Substitutes intellectual engagement for genuine emotional connection. May feel seen as a resource rather than a person.',
    growthPath:
      'Sharing personal feelings, not just ideas. Allowing others to know the person behind the expertise.',
    commonMistype: '1 (principled knowledge), 6 (group loyalty through expertise)',
  },

  '6_SP': {
    name: 'Warmth/Affection',
    nickname: 'The Friendly Ally',
    description:
      "Manages anxiety by building alliances and being warm/friendly. The 'phobic' expression — seeks safety through connection and affability. May look like a 2 (warmth) or 9 (going along to get along).",
    keyTraits: [
      'Warm and approachable demeanor',
      'Builds safety through alliances',
      'Anxiety managed through connection',
      'Phobic expression of fear',
    ],
    blindSpot:
      "May become dependent on others' reassurance. Can over-commit to relationships to maintain security.",
    growthPath:
      "Building internal sense of safety. Learning that warmth doesn't require constant approval-seeking.",
    commonMistype: '2 (warmth), 9 (agreeableness)',
  },
  '6_SX': {
    name: 'Strength/Beauty',
    nickname: 'The Counter-Phobic Rebel',
    description:
      "Counter-phobic. Manages fear by confronting it head-on. Intimidating. Projects strength to pre-empt threats. 'The best defense is a good offense.' Can look like an 8 (aggression) or 3 (projecting confidence).",
    keyTraits: [
      'Confronts fear head-on',
      'Projects strength and intimidation',
      'Challenges authority to test trustworthiness',
      'Most aggressive 6 subtype',
    ],
    blindSpot:
      'Aggression is fear in disguise. May exhaust themselves and others with constant testing and provocation.',
    growthPath: 'Recognizing the anxiety beneath the bravado. Learning to trust before testing.',
    commonMistype: '8 (aggression), 3 (confidence projection)',
  },
  '6_SO': {
    name: 'Duty/Obligation',
    nickname: 'The Loyal Soldier',
    description:
      "Manages anxiety through clear rules, hierarchies, and institutional belonging. The 'good soldier.' Follows the rulebook. Loyal to the system. Authority-referencing. Can look like a 1 (rule-following) or 3 (dutiful performance).",
    keyTraits: [
      'Rule-following and procedure-oriented',
      'Loyalty to institutions and hierarchies',
      'Manages anxiety through structure',
      'Authority-referencing decision making',
    ],
    blindSpot:
      "May follow rules even when they're unjust, to avoid the anxiety of deviation. Can become rigid and rule-bound.",
    growthPath:
      'Developing the capacity to question authority. Finding inner guidance beyond external rules.',
    commonMistype: '1 (rule-following), 3 (performing duty)',
  },

  '7_SP': {
    name: 'Wanting/Keeper of the Castle',
    nickname: 'The Practical Hedonist',
    description:
      "Creates elaborate networks of pleasure and security. Practical hedonist. Plans fun in advance. 'I'll make sure all my needs are covered.' The most grounded 7. Can look like a 3 (planning) or 5 (strategizing comfort).",
    keyTraits: [
      'Plans pleasure and variety in advance',
      'Material comfort-seeking',
      'Most grounded and practical 7',
      'Builds networks of options and experiences',
    ],
    blindSpot:
      'Can become gluttonous or self-indulgent under stress. The hedonic treadmill — always needing more stimulation.',
    growthPath:
      "Finding satisfaction in what's already here. Practicing stillness and depth rather than constant stimulation.",
    commonMistype: '3 (planning), 5 (strategizing)',
  },
  '7_SX': {
    name: 'Suggestibility/Fascination',
    nickname: 'The Enchanted Dreamer',
    description:
      'The dreamiest 7. Sees the world through rose-colored glasses applied to specific people and experiences. Falls in love with idealized visions. Enthusiastic to the point of losing touch with reality. Can look like a 4 (romanticizing).',
    keyTraits: [
      'Idealizes people and experiences',
      'Rose-colored glasses on intimate connections',
      'Fascinated by novelty and possibility',
      'Most emotionally intense 7',
    ],
    blindSpot:
      'Idealization leads to inevitable disappointment when reality intrudes. May cycle through relationships or interests quickly.',
    growthPath:
      'Developing tolerance for reality over fantasy. Learning that imperfect things can be deeply satisfying.',
    commonMistype: '4 (romanticizing), 2 (idealization of relationships)',
  },
  '7_SO': {
    name: 'Sacrifice/Counter-Gluttony',
    nickname: 'The Idealistic Contributor',
    description:
      "Counter-type. Channels desire into service. Delays personal gratification for the group. The 'selfless 7' who genuinely wants to contribute — but the underlying motivation is still to avoid pain/limitation. Can look like a 2 (service) or 1 (idealism).",
    keyTraits: [
      'Channels desire into service and contribution',
      'Delays personal gratification',
      'Idealistic and socially engaged',
      'Most self-denying 7 subtype',
    ],
    blindSpot:
      "Service can be another form of avoidance — staying busy with others' needs to avoid their own inner life.",
    growthPath:
      'Allowing themselves to receive. Recognizing that self-care is not selfishness.',
    commonMistype: '2 (service), 1 (idealism)',
  },

  '8_SP': {
    name: 'Survival/Satisfaction',
    nickname: 'The Territorial Pragmatist',
    description:
      "The most direct and material 8. Focused on getting their physical needs met — territory, resources, comfort. 'What's mine is mine.' Less concerned with power over people and more with power over circumstances. Looks like the stereotypical 8 in a domestic context.",
    keyTraits: [
      'Material and territorial focus',
      'Direct in getting needs met',
      'Physical comfort and resource security',
      'Less people-dominant, more circumstance-dominant',
    ],
    blindSpot:
      'Can appear blunt or demanding without realizing the impact. May prioritize own needs without considering others.',
    growthPath:
      'Developing awareness of how their territorial behavior affects relationships. Learning to share resources and space.',
    commonMistype: '6 (territorial anxiety), 1 (principled control)',
  },
  '8_SX': {
    name: 'Possession/Surrender',
    nickname: 'The Passionate Rebel',
    description:
      "The most emotionally intense 8. Possessive in relationships. The 'rebel' and 'provocateur.' Seeks to possess the other person entirely and paradoxically yearns to surrender to something overwhelming. Charismatic and dangerous. Can look like a 4 (intensity).",
    keyTraits: [
      'Possessive in intimate relationships',
      'Provokes and challenges as a form of testing',
      'Yearns to surrender to overwhelming power',
      'Most emotionally intense 8',
    ],
    blindSpot:
      'Intensity can become destructive. May push others away through the very possessiveness that seeks connection.',
    growthPath:
      'Learning that vulnerability is the path to the surrender they seek. Opening to tenderness.',
    commonMistype: '4 (emotional intensity), 3 (charisma)',
  },
  '8_SO': {
    name: 'Social Leadership/Solidarity',
    nickname: 'The Protective Leader',
    description:
      "Counter-type. Channels aggression into protecting the group. The 'anti-hero' leader. Uses power to defend the underdog. Loyal, protective, sometimes paternalistic. Can look like a 2 (protective) or 1 (principled).",
    keyTraits: [
      'Protects the weak and vulnerable',
      'Uses power for group benefit',
      'Loyal and fiercely protective',
      'Most other-oriented 8 subtype',
    ],
    blindSpot:
      'May become paternalistic — decides for others what they need without asking. Can be controlling in the name of protection.',
    growthPath:
      "Learning to empower rather than protect. Trusting others to handle their own lives.",
    commonMistype: '2 (protective care), 1 (principled advocacy)',
  },

  '9_SP': {
    name: 'Appetite/Comfort',
    nickname: 'The Comfort Seeker',
    description:
      "Merges with physical comfort — food, routine, sleep, familiar environments. Uses creature comforts to numb the existential anxiety of self-assertion. The most visibly 'lazy' or inertia-bound 9. Stubborn through passivity.",
    keyTraits: [
      'Creature comfort seeking (food, routine, sleep)',
      'Inertia and resistance to change',
      'Passivity as a form of stubbornness',
      'Numbs self through physical pleasures',
    ],
    blindSpot:
      'Comfort-seeking becomes a way to avoid the deeper work of self-assertion and genuine engagement with life.',
    growthPath:
      'Choosing discomfort deliberately. Taking action even when the body wants to settle.',
    commonMistype: '7 (comfort-seeking), 5 (withdrawal)',
  },
  '9_SX': {
    name: 'Union/Fusion',
    nickname: 'The Devoted Merger',
    description:
      "Merges with a partner or ideal person. Loses themselves in the relationship. The most accommodating in intimate relationships — takes on the partner's interests, opinions, even personality. Can look like a 2 (devoted to partner) or 4 (romantic longing).",
    keyTraits: [
      "Loses self in intimate relationships",
      "Takes on partner's identity and interests",
      'Deep devotion and accommodation',
      'Romantic merging and fusion',
    ],
    blindSpot:
      "Loses their own identity in relationships. May not know what they want separate from the partner.",
    growthPath:
      'Maintaining a sense of self within intimacy. Knowing and asserting their own preferences.',
    commonMistype: '2 (devotion), 4 (romantic longing)',
  },
  '9_SO': {
    name: 'Participation/Belonging',
    nickname: 'The Community Member',
    description:
      "Merges with the group. Takes on group identity and goes along with consensus. The 'good citizen.' Busy with social activities to avoid the inner work of self-assertion. Can look like a 6 (group loyalty) or 2 (community service).",
    keyTraits: [
      'Group identity and consensus-following',
      'Active social participation',
      "'Good citizen' persona",
      'Uses busyness to avoid self-assertion',
    ],
    blindSpot:
      'Mistakes participation for genuine belonging. May be well-liked but feel invisible and unimportant.',
    growthPath:
      'Developing individual voice within the group. Speaking a personal perspective even when it differs.',
    commonMistype: '6 (group loyalty), 2 (community service)',
  },
};
