// mbtiStressFlow.js
// Describes each MBTI type's flow state (dominant function in full expression)
// and grip stress experience (inferior function takeover under severe stress).
//
// Flow state: conditions under which the dominant function operates freely.
// Grip stress: inferior function hijacks behavior when stress exceeds the type's
// coping capacity — responses become exaggerated, uncharacteristic, and hard to control.

export const MBTI_STRESS_FLOW = {
  INFP: {
    // Dom: Fi | Inf: Te
    inFlow: {
      description:
        'Creating freely. Connecting authentically. Living in alignment with values. Time disappears.',
      triggers: [
        'Meaningful creative work',
        'Deep 1-on-1 conversations',
        'Nature immersion',
        'Values-aligned community',
      ],
      observable:
        'Warm, engaged, articulate about feelings, productive in bursts, generous with time and energy',
    },
    underStress: {
      description:
        'Grip experience: inferior Te takes over. The gentle INFP becomes uncharacteristically harsh, critical, and obsessed with external metrics.',
      triggers: [
        'Forced inauthenticity',
        'Prolonged conflict',
        'Feeling misunderstood',
        'Bureaucratic environments',
        'Values violations',
      ],
      observable:
        'Withdrawn, then suddenly sharp/critical. Black-and-white judgments. Obsessive organizing. "Everything is broken and it\'s everyone\'s fault."',
      recoveryPath:
        'Return to Fi through art, journaling, or nature. Give yourself permission to feel without fixing. One trusted conversation.',
    },
  },

  INFJ: {
    // Dom: Ni | Inf: Se
    inFlow: {
      description:
        'Visioning with clarity. Helping someone transform. The inner narrative feels coherent and purposeful. Insight arrives fully formed.',
      triggers: [
        'Meaningful one-on-one work',
        'Writing or deep creative projects',
        'Guiding others through major life transitions',
        'Quiet uninterrupted thinking time',
      ],
      observable:
        'Intense focus, fluid writing or speaking, uncanny perceptiveness, radiates calm certainty, seems to see around corners',
    },
    underStress: {
      description:
        'Grip experience: inferior Se takes over. The normally future-focused INFJ becomes overwhelmed by sensory input and may act with sudden, uncharacteristic impulsivity.',
      triggers: [
        'Chronic overstimulation',
        'Feeling trapped with no exit',
        'Repeated betrayals of trust',
        'Being forced to live inauthentically',
        'Physical illness or deprivation',
      ],
      observable:
        'Sensory overload and irritability, reckless indulgence (binge eating, reckless spending, substance use), explosive anger unlike their usual reserve, then deep shame afterward.',
      recoveryPath:
        'Reduce sensory input — quiet, darkness, solitude. Gentle physical activity. Reestablish the inner narrative with journaling. Time, not advice.',
    },
  },

  INTP: {
    // Dom: Ti | Inf: Fe
    inFlow: {
      description:
        'A clean logical problem to solve. Complete autonomy. The internal framework clicks into place and analysis runs on its own.',
      triggers: [
        'Complex abstract problem with no fixed answer',
        'Unstructured exploration time',
        'Stimulating intellectual peer',
        'Complete freedom from social obligations',
      ],
      observable:
        'Deeply absorbed, rapid idea generation, articulate and precise, seemingly effortless analysis, dismissive of irrelevant interruptions',
    },
    underStress: {
      description:
        'Grip experience: inferior Fe takes over. The typically detached INTP has sudden emotional eruptions or becomes desperately people-pleasing in ways that feel foreign and embarrassing.',
      triggers: [
        'Feeling incompetent or publicly humiliated',
        'Prolonged social isolation',
        'Persistent interpersonal conflict with no resolution',
        'Work that feels meaningless',
        'Being dismissed or invalidated',
      ],
      observable:
        'Emotional outbursts completely out of character — crying, rage, or excessive over-sharing. Or the inverse: suddenly desperate to please everyone, abandoning all critical judgment.',
      recoveryPath:
        'Acknowledge the emotional experience without over-analyzing it. Physical movement helps. Brief, low-stakes social contact (not deep processing). Return to a small, solvable problem.',
    },
  },

  INTJ: {
    // Dom: Ni | Inf: Se
    inFlow: {
      description:
        'Strategic clarity. Executing a well-formed plan. Seeing the path no one else can see and moving along it with complete autonomy.',
      triggers: [
        'Complex long-range problem requiring strategic thinking',
        'Autonomy and authority over execution',
        'Working with other highly competent people',
        'Environment free of inefficiency and politics',
      ],
      observable:
        'Intense focus, decisive action, long stretches of silent productivity, cutting through complexity with apparent ease, visibly energized by obstacles others find paralyzing',
    },
    underStress: {
      description:
        'Grip experience: inferior Se takes over. The usually disciplined INTJ abandons their long-term vision and plunges into impulsive sensory indulgence or becomes obsessed with irrelevant physical details.',
      triggers: [
        'Repeated failure of the plan',
        'Feeling incompetent despite maximum effort',
        'Chronic unpredictability and chaos',
        'Loss of control over outcomes',
        'Physical depletion from overwork',
      ],
      observable:
        'Binge behavior (food, alcohol, compulsive purchasing, overexercise). Sudden obsession with environmental imperfections. Abandoning the vision entirely for short-term pleasure. Deep shame afterward.',
      recoveryPath:
        'Structured physical activity rather than sedentary indulgence. Rebuild the vision in writing. Limit decisions. Re-engage Ni through strategic reading or long walks.',
    },
  },

  ISFP: {
    // Dom: Fi | Inf: Te
    inFlow: {
      description:
        'Creating something beautiful. Being fully present in a sensory experience. Acting on what feels right, unquestioned and unrestricted.',
      triggers: [
        'Hands-on creative work with full artistic freedom',
        'Being in nature',
        'Deep, authentic connection with a close person',
        'Physical mastery of a craft or skill',
      ],
      observable:
        'Quiet joy, fluid physical expression, generosity with time, warmth and openness, remarkable skill made to look effortless',
    },
    underStress: {
      description:
        'Grip experience: inferior Te takes over. The usually gentle ISFP becomes sharply critical, fault-finding, and driven to impose order in ways that feel compulsive and unlike themselves.',
      triggers: [
        'Values being attacked or mocked',
        'Prolonged conflict with no resolution',
        'Feeling incompetent or unappreciated',
        'Environments that crush creative expression',
        'Betrayal by someone trusted',
      ],
      observable:
        'Sudden sharp criticism of people and situations. Obsessive organizing or list-making. Harsh judgments delivered bluntly. "Everything is wrong and I need to fix all of it right now."',
      recoveryPath:
        'Return to a creative or physical activity with no outcome pressure. Nature. Quiet. Let the Fi values re-anchor without forcing a resolution.',
    },
  },

  ISFJ: {
    // Dom: Si | Inf: Ne
    inFlow: {
      description:
        'Supporting people who appreciate it. Familiar, reliable routines. Being the person others can count on completely.',
      triggers: [
        'Clear expectations and defined role',
        'Caring for people who express genuine gratitude',
        'Ordered, harmonious environment',
        'Meaningful tradition and familiar ritual',
      ],
      observable:
        'Calm warmth, quiet competence, exceptional attentiveness to others\' needs, reliable and unhurried, deeply present in practical care',
    },
    underStress: {
      description:
        'Grip experience: inferior Ne takes over. The typically stable ISFJ becomes overwhelmed by worst-case scenarios, catastrophizing freely and seeing dark possibilities everywhere.',
      triggers: [
        'Responsibilities that exceed their capacity to fulfill',
        'Feeling taken for granted or unappreciated',
        'Major unexpected change',
        'Conflict with no resolution path',
        'Persistent uncertainty about a loved one\'s wellbeing',
      ],
      observable:
        'Anxious spiraling — "what if" scenarios multiply rapidly. May verbalize catastrophic predictions. Unusual irritability. Inability to focus on present tasks. Physical symptoms of anxiety.',
      recoveryPath:
        'Restore routine. Concrete reassurance — specific facts, not general comfort. A practical task completed successfully. Quiet time with someone safe.',
    },
  },

  ISTP: {
    // Dom: Ti | Inf: Fe
    inFlow: {
      description:
        'A real problem demanding immediate, skillful action. No bureaucracy, no meetings, just the problem and the tools to fix it.',
      triggers: [
        'Hands-on technical challenge',
        'Crisis requiring calm, fast problem-solving',
        'Physical mastery task',
        'Complete autonomy over approach and execution',
      ],
      observable:
        'Economical movement and speech, calm under pressure others find overwhelming, elegant practical solutions, deep focus, minimal ego about process',
    },
    underStress: {
      description:
        'Grip experience: inferior Fe erupts. The usually composed ISTP has sudden emotional outbursts — intense feelings pour out in ways they cannot control and deeply regret.',
      triggers: [
        'Feeling deeply misunderstood or unfairly judged',
        'Prolonged emotional demands with no resolution',
        'Forced helplessness in a crisis they could fix',
        'Betrayal by someone they trusted',
        'Chronic overstimulation',
      ],
      observable:
        'Sudden tearfulness or explosive rage, completely out of character. May over-share personal feelings in a raw, unfiltered way. Withdraws immediately afterward with intense shame.',
      recoveryPath:
        'Physical activity — the body processes what words cannot. Solitude without pressure to perform. Return to a small, manageable technical problem.',
    },
  },

  ISTJ: {
    // Dom: Si | Inf: Ne
    inFlow: {
      description:
        'A clearly defined task with established standards. Executing with precision. Being the person the system depends on.',
      triggers: [
        'Structured work with clear expectations',
        'Responsibility that rewards thoroughness',
        'Trusted institutional role',
        'Environment where past experience is valued',
      ],
      observable:
        'Methodical, precise, dependable, unhurried, quietly satisfied with work well done, visibly trusted by others',
    },
    underStress: {
      description:
        'Grip experience: inferior Ne takes over. The normally steady ISTJ begins seeing conspiracies, catastrophizing wildly, and unable to stop the imagination from generating worst-case scenarios.',
      triggers: [
        'Overwhelming responsibility with unclear standards',
        'Feeling their competence is being questioned',
        'Major unexpected disruption to an established system',
        'Pressure to break rules they respect',
        'Feeling unsupported after years of reliable service',
      ],
      observable:
        'Unusual anxiety and scattered thinking. Dark, catastrophic predictions delivered seriously. May accuse others of hidden motives. Obsessive over minor inconsistencies. Out-of-character paranoia.',
      recoveryPath:
        'Re-establish a routine immediately. Concrete evidence that counters the catastrophe narrative. Physical work with tangible results. Trusted person who can provide factual reassurance.',
    },
  },

  ENFP: {
    // Dom: Ne | Inf: Si
    inFlow: {
      description:
        'Connecting ideas across domains. Seeing the possibility in people. A conversation that keeps opening into new territory. Everything feels alive with meaning.',
      triggers: [
        'Creative brainstorming with engaged collaborators',
        'Deep conversation exploring big ideas or personal truth',
        'Working on a project that feels genuinely meaningful',
        'Freedom to improvise without fixed constraints',
      ],
      observable:
        'Rapidly generating ideas, high energy and warmth, making unexpected connections, inspiring others without trying, magnetic and fully present',
    },
    underStress: {
      description:
        'Grip experience: inferior Si takes over. The usually expansive ENFP becomes uncharacteristically focused on small details, physical symptoms, and an oppressive sense of the past.',
      triggers: [
        'Prolonged loss of autonomy',
        'Feeling their values and ideas are fundamentally unwelcome',
        'Overwhelming commitments with no escape',
        'Chronic exhaustion from giving too much',
        'Repeated disappointment in key relationships',
      ],
      observable:
        'Obsessive focus on minor physical details or symptoms (hypochondria spikes). Replaying past failures in exhausting detail. Inability to access optimism or see possibilities. Unusual rigidity.',
      recoveryPath:
        'Reconnect with the body gently — rest, nourishment, movement. Limit decisions. One meaningful conversation. Remind yourself of past times the future opened up again.',
    },
  },

  ENFJ: {
    // Dom: Fe | Inf: Ti
    inFlow: {
      description:
        'Helping someone become who they\'re meant to be. Unifying a group around a shared vision. Being the catalyst that transforms what was stuck.',
      triggers: [
        'Mentoring or coaching work with visible impact',
        'Leadership of a values-driven group or movement',
        'Facilitating meaningful connection between people',
        'Work that combines vision with community',
      ],
      observable:
        'Radiant warmth and energy, articulate and inspiring, reading the group\'s needs with uncanny accuracy, drawing out the best in others without apparent effort',
    },
    underStress: {
      description:
        'Grip experience: inferior Ti takes over. The usually warm ENFJ withdraws suddenly and becomes cold, analytically detached, and intent on finding logical fault with everything and everyone.',
      triggers: [
        'Feeling taken advantage of after years of giving',
        'Betrayal by someone they deeply trusted',
        'Prolonged conflict that threatens the group',
        'Being dismissed or publicly undermined',
        'Exhaustion from chronic over-responsibility',
      ],
      observable:
        'Unusual coldness and withdrawal. Relentless internal analysis searching for the flaw in every person and plan. Hyper-critical and dismissive. May cut people off abruptly and seemingly without feeling.',
      recoveryPath:
        'Time alone without anyone to care for. Re-establish connection to their own feelings before re-engaging others. Gentle physical care. A trusted person who asks about them, not about the group.',
    },
  },

  ENTP: {
    // Dom: Ne | Inf: Si
    inFlow: {
      description:
        'A conceptual problem with no obvious answer and full freedom to play with it. Debate that stretches every assumption. The satisfaction of the unexpected connection.',
      triggers: [
        'Complex unsolved problem with many angles',
        'Sparring intellectually with a peer who can keep up',
        'Brainstorming with autonomy and no premature closure',
        'Novel environments and fresh stimulation',
      ],
      observable:
        'Rapid-fire ideation, energized by opposition rather than deflated by it, making unexpected leaps, clearly enjoying themselves, pulling others into their enthusiasm',
    },
    underStress: {
      description:
        'Grip experience: inferior Si takes over. The normally restless ENTP becomes obsessively fixated on minor details, falls into nostalgic depression, and may develop hypochondriac fixations.',
      triggers: [
        'Sustained meaningless routine with no end in sight',
        'Feeling fundamentally incompetent at something they care about',
        'Chronic isolation without intellectual stimulation',
        'Being locked into an identity or role they never chose',
        'Exhaustion after sustained overstimulation',
      ],
      observable:
        'Unusual obsession with routine or minor details. Replaying past mistakes in loops. Physical health anxiety that escalates. Nostalgia for a past that probably wasn\'t that good. Flat affect, loss of wit.',
      recoveryPath:
        'One stimulating conversation to break the loop. Physical movement. Let go of the detail — zoom out. Reconnect with a project that genuinely excites.',
    },
  },

  ENTJ: {
    // Dom: Te | Inf: Fi
    inFlow: {
      description:
        'A high-stakes problem that requires the best of strategic thinking and decisive leadership. Building something that will outlast the moment.',
      triggers: [
        'Clear authority to execute a complex strategy',
        'High-performing team that delivers',
        'Problem that requires integration of systems and people',
        'Environment that rewards competence over politics',
      ],
      observable:
        'Decisive, energizing to others, relentlessly productive, makes complexity look simple, commands attention without demanding it',
    },
    underStress: {
      description:
        'Grip experience: inferior Fi takes over. The usually commanding ENTJ becomes unexpectedly emotionally fragile, erupts with intense personal feelings, or slides into victim-like self-pity.',
      triggers: [
        'Repeated failure after maximum effort',
        'Feeling fundamentally undervalued as a person, not just a performer',
        'Betrayal by a trusted partner or subordinate',
        'Having their competence or integrity publicly questioned',
        'Sustained loss of control over outcomes',
      ],
      observable:
        'Unexpected tearfulness or rage with a personal, wounded quality. "No one appreciates what I do." Unusual sensitivity to small slights. Sulking. May make dramatic self-sacrificing statements.',
      recoveryPath:
        'Acknowledgment that the feeling is real, not a weakness. Physical exertion. One honest conversation with someone they genuinely trust. Reconnect with values beneath the achievement.',
    },
  },

  ESFP: {
    // Dom: Se | Inf: Ni
    inFlow: {
      description:
        'Being fully present in a moment that\'s alive with sensation, connection, and joy. Performing. Creating experience for others. Complete absorption in what is happening right now.',
      triggers: [
        'Performance, celebration, or social experience with genuine energy',
        'Creative work that is immediate and sensory',
        'Physical adventure or challenge',
        'Being surrounded by people who are genuinely enjoying themselves',
      ],
      observable:
        'Radiant presence, spontaneous and generous, lighting up the room without effort, warmly responsive to everyone around them, fully alive and immediate',
    },
    underStress: {
      description:
        'Grip experience: inferior Ni takes over. The usually joyful ESFP develops dark, obsessive theories about hidden meanings and inevitable catastrophes that they cannot shake.',
      triggers: [
        'Sustained meaninglessness — going through motions with no genuine experience',
        'Feeling unseen or deeply misunderstood by people they love',
        'Loss that cannot be resolved with action or connection',
        'Chronic suppression of their authentic self',
        'Prolonged conflict with no sensory resolution',
      ],
      observable:
        'Paranoid interpretations of events — "everyone is against me," or dark inevitabilities. Compulsive symbolic meaning-making from small signs. Withdrawal from the social world they normally love.',
      recoveryPath:
        'Return to direct sensory experience without symbolic weight — physical movement, music, food, nature. A joyful person who doesn\'t need anything from them. Let the dark narrative go rather than analyzing it.',
    },
  },

  ESFJ: {
    // Dom: Fe | Inf: Ti
    inFlow: {
      description:
        'Taking care of people who receive it with gratitude. Being the center that holds the group together. Making everyone feel seen and included.',
      triggers: [
        'Caring for people who express genuine appreciation',
        'Hosting, organizing, or facilitating social events',
        'Being a trusted and central member of a community',
        'Work that makes a direct, visible difference to people',
      ],
      observable:
        'Warm, energized, socially fluid, anticipating others\' needs before they\'re expressed, radiating care and belonging',
    },
    underStress: {
      description:
        'Grip experience: inferior Ti takes over. The usually warm ESFJ withdraws into cold logical analysis, nitpicking every situation and person with unusual detachment.',
      triggers: [
        'Feeling deeply unappreciated after sustained sacrifice',
        'Social rejection or public humiliation',
        'Group conflict that they cannot resolve',
        'Having their loyalty or sincerity questioned',
        'Prolonged demands from everyone with support from no one',
      ],
      observable:
        'Sudden coldness and withdrawal. Unusually critical and fault-finding. Dissecting people\'s motivations with cold logic rather than warmth. May cut people off without the relational repair they usually prioritize.',
      recoveryPath:
        'Allow someone else to take care of them for once. Low-stimulation environment. Small social interaction that asks nothing of them. Time to process feelings before being asked to manage anyone else\'s.',
    },
  },

  ESTP: {
    // Dom: Se | Inf: Ni
    inFlow: {
      description:
        'Immediate action in a high-stakes situation. Reading the room in real time and moving faster than everyone else. The problem solved before others have assessed it.',
      triggers: [
        'High-pressure, real-time problem requiring fast action',
        'Entrepreneurial or competitive challenge',
        'Physical or tactical mastery',
        'Environments that reward speed, confidence, and adaptability',
      ],
      observable:
        'Calm and decisive under pressure, quick-reading of people and situations, fluid improvisation, energizes others with their momentum',
    },
    underStress: {
      description:
        'Grip experience: inferior Ni takes over. The usually action-oriented ESTP becomes paralyzed by catastrophic predictions and dark, obsessive visions of inevitable terrible outcomes.',
      triggers: [
        'Sustained powerlessness in a situation they cannot act their way out of',
        'Loss that cannot be addressed through action',
        'Physical deterioration or mortality confrontation',
        'Feeling fundamentally trapped with no tactical exit',
        'Betrayal that reveals their read of a person was entirely wrong',
      ],
      observable:
        'Uncharacteristic paralysis. Dark, catastrophic predictions delivered with unusual certainty. Obsession with symbolic meaning or dark possibilities. May express nihilism or determinism that seems foreign to them.',
      recoveryPath:
        'Physical action — any action. Break the prediction loop with a concrete next step, however small. Talk to someone who is energetic and pragmatic, not analytical. Momentum restores perspective.',
    },
  },

  ESTJ: {
    // Dom: Te | Inf: Fi
    inFlow: {
      description:
        'Organizing a complex operation and executing it flawlessly. Being the reliable authority that everyone can depend on. Upholding standards that matter.',
      triggers: [
        'Clear leadership role with real responsibility',
        'Complex logistical or operational challenge',
        'Team that respects authority and delivers results',
        'Environment where standards are taken seriously',
      ],
      observable:
        'Decisive, organized, clear in communication, energized by execution rather than drained by it, commands respect through demonstrated competence',
    },
    underStress: {
      description:
        'Grip experience: inferior Fi takes over. The usually stoic ESTJ becomes unusually sensitive to personal slights, broods over feeling unappreciated, and sulks with an intensity that surprises everyone who knows them.',
      triggers: [
        'Sustained ingratitude after years of reliable service',
        'Having their integrity questioned publicly',
        'Feeling their authority undermined or bypassed',
        'Major personal loss with no clear resolution action',
        'Prolonged isolation from meaningful work',
      ],
      observable:
        'Emotional sensitivity completely out of proportion. Feeling fundamentally unvalued as a person. Sulking or withdrawing behind a mask of cold formality. May make cutting remarks about their own sacrifice.',
      recoveryPath:
        'Genuine acknowledgment of their contribution — specific, not generic. Physical activity with measurable output. Return to a defined role with clear results. One honest conversation that isn\'t about the organization.',
    },
  },
};
