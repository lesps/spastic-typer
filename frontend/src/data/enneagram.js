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

// ENN_BANK: 7 questions per type (63 total).
// pole: 1 = agreement favors this type. pole: -1 = agreement disfavors this type (reverse-scored).
// Used by the adaptive quiz: questions are shuffled and drawn fairly across types.
export const ENN_BANK = [
  // Type 1 — The Reformer
  // Targets: inner critic, moral imperative, felt sense of "should", frustration with imperfection
  { type: 1, text: 'I have a persistent internal sense of how things should be done, and it\'s hard to let go of.', pole: 1 },
  { type: 1, text: 'I often notice errors or flaws that others seem to overlook, and it bothers me that they don\'t see them.', pole: 1 },
  { type: 1, text: 'There is a voice in my head that constantly evaluates whether I\'m living up to my own standards.', pole: 1 },
  { type: 1, text: 'When I see something done sloppily, I feel an almost visceral discomfort — like something in the world is wrong that needs correcting.', pole: 1 },
  { type: 1, text: 'I find it very difficult to fully relax when I know something around me is unfinished or imperfect.', pole: 1 },
  { type: 1, text: 'I\'m generally comfortable with "good enough" — perfection isn\'t worth the extra energy.', pole: -1 },
  { type: 1, text: 'I feel a deep sense of personal responsibility to uphold what is right, even when no one else seems to care.', pole: 1 },

  // Type 2 — The Helper
  // Targets: need to be needed, pride in helping role, monitoring appreciation, difficulty with own needs
  { type: 2, text: 'I naturally tune into what other people need, often before they\'ve articulated it themselves.', pole: 1 },
  { type: 2, text: 'I feel most like myself when I know I\'ve made a meaningful difference in someone\'s life.', pole: 1 },
  { type: 2, text: 'When I check in with myself, I often realize I\'ve been so focused on others that I\'ve lost track of what I actually want.', pole: 1 },
  { type: 2, text: 'I notice myself monitoring whether the people I\'ve helped actually appreciated what I did for them.', pole: 1 },
  { type: 2, text: 'I often go out of my way to help, even when it comes at a real personal cost.', pole: 1 },
  { type: 2, text: 'Part of me believes that if I stopped being helpful and generous, people wouldn\'t have a reason to keep me in their lives.', pole: 1 },
  { type: 2, text: 'I find it easy to ask others for help when I need it, without feeling like I\'m burdening them.', pole: -1 },

  // Type 3 — The Achiever
  // Targets: goal orientation, image management, adapting persona, self-worth tied to results
  { type: 3, text: 'I feel most like myself when I\'m actively working toward a clear, measurable goal.', pole: 1 },
  { type: 3, text: 'I naturally adapt how I present myself to fit different social situations and audiences.', pole: 1 },
  { type: 3, text: 'Being seen as successful and competent matters deeply to me — more than I sometimes want to admit.', pole: 1 },
  { type: 3, text: 'I am very aware of how I come across to others and invest energy in managing that impression.', pole: 1 },
  { type: 3, text: 'I push myself hard to produce tangible results that other people can see and recognize.', pole: 1 },
  { type: 3, text: 'How other people perceive my accomplishments doesn\'t significantly affect how I feel about them.', pole: -1 },
  { type: 3, text: 'When I fail at something publicly, the shame cuts deeper than the practical consequences of the failure itself.', pole: 1 },

  // Type 4 — The Individualist
  // Targets: identity through differentness, emotional depth as value, longing, authenticity imperative
  { type: 4, text: 'I\'d rather be seen as unusual or even difficult than be seen as ordinary or forgettable.', pole: 1 },
  { type: 4, text: 'I\'m drawn to deep emotional experiences, even painful ones, because they feel more real and authentic than surface-level comfort.', pole: 1 },
  { type: 4, text: 'I have a rich inner world and spend a significant amount of time reflecting on my feelings and sense of identity.', pole: 1 },
  { type: 4, text: 'I long to be truly understood and recognized for who I uniquely am — not just for what I do.', pole: 1 },
  { type: 4, text: 'I sometimes feel an ache or longing for something I can\'t quite name or find.', pole: 1 },
  { type: 4, text: 'I\'m generally comfortable blending in with the crowd and don\'t need to stand out as different.', pole: -1 },
  { type: 4, text: 'There is something about my emotional life that feels fundamentally more intense or complex than what most people around me seem to experience.', pole: 1 },

  // Type 5 — The Investigator
  // Targets: resource conservation, competence through knowledge, boundary-guarding, detachment strategy
  { type: 5, text: 'I instinctively limit what I share with others — my time, my energy, my inner world — to preserve my capacity to think and function.', pole: 1 },
  { type: 5, text: 'I tend to observe and analyze situations thoroughly before participating or committing.', pole: 1 },
  { type: 5, text: 'I feel most competent and alive when I\'ve mastered a complex subject deeply enough that I could explain it to anyone.', pole: 1 },
  { type: 5, text: 'I feel most alive when I\'m learning something deeply or building a mental model of how something works.', pole: 1 },
  { type: 5, text: 'I guard my time, energy, and private space carefully — intrusions on these feel genuinely threatening.', pole: 1 },
  { type: 5, text: 'I\'m comfortable sharing my thoughts, feelings, and resources freely without worrying about being depleted.', pole: -1 },
  { type: 5, text: 'When I feel overwhelmed, my instinct is to pull back and think rather than to reach out or take action.', pole: 1 },

  // Type 6 — The Loyalist
  // Targets: anxiety/doubt cycle, testing reliability, scanning for threats, need for trusted authority
  { type: 6, text: 'I frequently anticipate what could go wrong and plan for worst-case scenarios before they happen.', pole: 1 },
  { type: 6, text: 'I pay close attention to whether people follow through on what they say — inconsistency between words and actions puts me on alert.', pole: 1 },
  { type: 6, text: 'I often seek reassurance or second opinions before making major decisions, even when I suspect I already know the answer.', pole: 1 },
  { type: 6, text: 'I am highly attuned to potential threats, hidden agendas, or inconsistencies that others don\'t seem to notice.', pole: 1 },
  { type: 6, text: 'Doubt and second-guessing myself is one of my most persistent ongoing experiences.', pole: 1 },
  { type: 6, text: 'I generally trust my own judgment and don\'t feel the need to check with others before committing to a decision.', pole: -1 },
  { type: 6, text: 'I mentally rehearse problems and prepare counterarguments or escape routes well before they\'re needed.', pole: 1 },

  // Type 7 — The Enthusiast
  // Targets: pain avoidance through options, reframing, FOMO, resistance to limitation
  { type: 7, text: 'I love exploring new ideas, plans, and possibilities — the more options on the table, the better I feel.', pole: 1 },
  { type: 7, text: 'I tend to reframe negatives into positives and move quickly past painful feelings rather than sitting with them.', pole: 1 },
  { type: 7, text: 'Having my options narrowed down or cut off feels genuinely distressing to me.', pole: 1 },
  { type: 7, text: 'I jump from one exciting thing to the next and resist being pinned down to a single commitment.', pole: 1 },
  { type: 7, text: 'I keep my schedule full because I hate the feeling of missing out on something good.', pole: 1 },
  { type: 7, text: 'I find it easy to sit with painful or uncomfortable feelings without trying to fix, reframe, or escape them.', pole: -1 },
  { type: 7, text: 'When life feels heavy or painful, my instinct is to find something fun, stimulating, or new to shift my attention.', pole: 1 },

  // Type 8 — The Challenger
  // Targets: control imperative, vulnerability avoidance, protective instinct, confrontation reflex
  { type: 8, text: 'I instinctively take charge in situations and feel deeply uncomfortable when someone else is controlling the outcome.', pole: 1 },
  { type: 8, text: 'I\'d rather someone be blunt with me — even if it stings — than sugarcoat or hold back what they really think.', pole: 1 },
  { type: 8, text: 'I have a strong protective instinct toward people I see as vulnerable or being taken advantage of.', pole: 1 },
  { type: 8, text: 'I push back immediately and forcefully when I feel disrespected or controlled.', pole: 1 },
  { type: 8, text: 'Showing vulnerability or weakness to others feels genuinely dangerous to me — even with people I trust.', pole: 1 },
  { type: 8, text: 'I\'m comfortable letting others take the lead and don\'t feel a need to control how things go.', pole: -1 },
  { type: 8, text: 'I would rather be respected for my strength and directness than liked for my warmth.', pole: 1 },

  // Type 9 — The Peacemaker
  // Targets: conflict avoidance, self-forgetting, inertia, merging with others' agendas
  { type: 9, text: 'I tend to go along with others\' preferences to maintain harmony, even when I have a different opinion.', pole: 1 },
  { type: 9, text: 'I often struggle with inertia — getting started on things is much harder than keeping them going once I begin.', pole: 1 },
  { type: 9, text: 'I find it genuinely difficult to identify what I want, separate from what the people around me want.', pole: 1 },
  { type: 9, text: 'When conflict is building around me, my instinct is to smooth things over rather than engage directly.', pole: 1 },
  { type: 9, text: 'I can lose myself in routines, comfort activities, or distractions to avoid facing difficult feelings or decisions.', pole: 1 },
  { type: 9, text: 'My own opinions and desires sometimes feel less real or less important than other people\'s.', pole: 1 },
  { type: 9, text: 'I have strong opinions and find it easy to assert them, even when others disagree.', pole: -1 },
];

// INSTINCT_BANK: 7 questions per instinct (21 total).
export const INSTINCT_BANK = [
  // SP — Self-Preservation
  { text: 'Physical comfort, health, and financial security are constant background concerns for me.', inst: 'sp' },
  { text: 'I carefully manage my resources and energy to make sure I\'m covered for what\'s ahead.', inst: 'sp' },
  { text: 'I have reliable routines and habits that keep my life functioning well, and disrupting them feels genuinely unsettling.', inst: 'sp' },
  { text: 'When stressed, my first move is to stabilize my physical situation — rest, eat, secure my environment.', inst: 'sp' },
  { text: 'I think often about whether I have enough — enough time, enough energy, enough resources — to handle what\'s coming.', inst: 'sp' },
  { text: 'I am drawn to situations that feel safe, grounded, and predictable over those that are exciting but unstable.', inst: 'sp' },
  { text: 'I rarely think about my physical comfort, health, or financial safety — those things tend to take care of themselves.', inst: 'sp', pole: -1 },

  // SX — Sexual / One-to-One
  { text: 'I am drawn to people, experiences, or ideas that feel electric or all-consuming — I want to be completely absorbed.', inst: 'sx' },
  { text: 'I\'m drawn to experiences that feel transformative, intense, or deeply intimate — even when they\'re risky.', inst: 'sx' },
  { text: 'I often become fixated on a specific person or experience that feels magnetically compelling to me.', inst: 'sx' },
  { text: 'When I connect with someone, I want to go deep fast — surface-level interaction feels almost physically unsatisfying.', inst: 'sx' },
  { text: 'I would rather have one relationship of extraordinary depth than many pleasant but moderate connections.', inst: 'sx' },
  { text: 'There is an intensity to how I engage with what matters to me that other people sometimes find overwhelming.', inst: 'sx' },
  { text: 'I don\'t need intensity or depth in my connections — I\'m content with pleasant, easy-going relationships.', inst: 'sx', pole: -1 },

  // SO — Social
  { text: 'I naturally track the dynamics of groups I\'m in — who\'s aligned with whom, what the unspoken rules are, where the tensions lie.', inst: 'so' },
  { text: 'Being part of a community and contributing to something larger than myself matters deeply to me.', inst: 'so' },
  { text: 'I feel most alive when I have a recognized role or purpose within a group.', inst: 'so' },
  { text: 'I instinctively read the social hierarchy in any room I enter — who has influence, who\'s on the outside.', inst: 'so' },
  { text: 'I feel a strong pull toward belonging and participating in a meaningful community or cause.', inst: 'so' },
  { text: 'I feel a sense of duty or responsibility toward the groups and communities I\'m part of.', inst: 'so' },
  { text: 'I don\'t pay much attention to social dynamics or group politics — they just don\'t register for me.', inst: 'so', pole: -1 },
];

export const INSTINCT_DISAMBIG = {
  'sp-so': [
    { text: 'When depleted, I focus on rest, food, and physical comfort before reconnecting socially.', favors: 'sp' },
    { text: 'I would rather have a secure, stable life than a widely recognized role in my community.', favors: 'sp' },
    { text: 'I think more often about my savings, health, and safety than about my standing in social groups.', favors: 'sp' },
    { text: 'I am more motivated by finding my place in a community than by ensuring my personal resources are solid.', favors: 'so' },
    { text: 'Being respected and included by a group matters more to me than having all my material needs perfectly covered.', favors: 'so' },
  ],
  'sp-sx': [
    { text: 'I prefer a reliable routine and physical comfort over intense experiences that might disrupt my stability.', favors: 'sp' },
    { text: 'When I meet someone new, I focus more on whether they are safe and trustworthy than on the chemistry between us.', favors: 'sp' },
    { text: 'I generally avoid situations that feel risky or destabilizing, even if they might be exciting.', favors: 'sp' },
    { text: 'I am drawn to experiences that feel electric or transformative, even at some cost to my security.', favors: 'sx' },
    { text: 'I would rather have one all-consuming connection than a perfectly stable, comfortable life.', favors: 'sx' },
  ],
  'so-sx': [
    { text: 'I care more about my role in a group or community than about having one deeply intense relationship.', favors: 'so' },
    { text: 'Group dynamics and where I stand socially interest me more than finding intense personal chemistry.', favors: 'so' },
    { text: 'I am more concerned with contributing to a community than with finding someone who truly gets me on a deep level.', favors: 'so' },
    { text: 'I feel most alive in a powerful one-on-one connection, not when I am part of a group.', favors: 'sx' },
    { text: 'I would rather have a profound bond with one person than be widely liked and respected in a community.', favors: 'sx' },
  ],
};

export const ENN_DISAMBIG = {
  '1-6': [
    { text: 'My inner sense of right and wrong guides me more than external rules or authority figures.', favors: 1 },
    { text: 'I feel a deep personal responsibility to correct errors and uphold standards — independent of others\' approval.', favors: 1 },
    { text: 'I often look to trusted people or systems to validate my decisions before acting.', favors: 6 },
    { text: 'Doubt and second-guessing myself is one of my most consistent ongoing challenges.', favors: 6 },
    { text: 'Once I determine something is right, I commit fully without needing external confirmation.', favors: 1 },
  ],
  '2-9': [
    { text: 'I help others because I genuinely believe they need me specifically — and I feel proud of that role.', favors: 2 },
    { text: 'I tend to merge with others\' preferences so completely that I lose track of my own wants.', favors: 9 },
    { text: 'I know what I need emotionally, even if I rarely ask for it directly.', favors: 2 },
    { text: 'Conflict genuinely disturbs my equilibrium — I\'d rather go along than create friction.', favors: 9 },
    { text: 'I feel a quiet pride in being the one others turn to for support and connection.', favors: 2 },
  ],
  '3-7': [
    { text: 'I care deeply about how competent and successful I appear to others.', favors: 3 },
    { text: 'I often chase new experiences or projects to avoid boredom or discomfort.', favors: 7 },
    { text: 'I strategically adapt my presentation to succeed in whatever context I\'m in.', favors: 3 },
    { text: 'I strongly prefer keeping my options open rather than committing to a single path.', favors: 7 },
    { text: 'Completing and delivering measurable results matters more to me than the experience of the journey.', favors: 3 },
  ],
  '4-5': [
    { text: 'My emotional experience is rich and complex, and it shapes much of my sense of identity.', favors: 4 },
    { text: 'My primary focus is understanding and making sense of the world through intellectual analysis.', favors: 5 },
    { text: 'I long to be truly understood and feel that very few people can actually see me clearly.', favors: 4 },
    { text: 'I withdraw into thought and analysis when overwhelmed, preferring to observe before engaging.', favors: 5 },
    { text: 'I strongly identify with my emotional depth and sense of being fundamentally different from others.', favors: 4 },
  ],
  '6-9': [
    { text: 'Active anxiety and worst-case thinking are regular features of my mental life.', favors: 6 },
    { text: 'I tend to minimize problems and prefer not to dwell on what could go wrong.', favors: 9 },
    { text: 'I regularly question whether people I trust are truly reliable and on my side.', favors: 6 },
    { text: 'I find it genuinely hard to mobilize myself and get started on things I care about.', favors: 9 },
    { text: 'I mentally rehearse problems and prepare counterarguments or escape routes before they arise.', favors: 6 },
  ],
  '8-3': [
    { text: 'I need to feel in direct control of situations — being seen as successful is secondary.', favors: 8 },
    { text: 'What others think of my image, status, and reputation matters significantly to how I operate.', favors: 3 },
    { text: 'I push back immediately and forcefully when I feel disrespected, challenged, or controlled.', favors: 8 },
    { text: 'I carefully calibrate my presentation and persona to win people over and advance my goals.', favors: 3 },
    { text: 'I would rather be respected for my power and authenticity than liked for my image.', favors: 8 },
  ],
  '1-4': [
    { text: 'My primary drive is to improve and correct things that fall short of how they should be.', favors: 1 },
    { text: 'My primary drive is to express my authentic inner experience and be understood for who I am.', favors: 4 },
    { text: 'I have a persistent inner critic that evaluates whether I\'ve met my own standards.', favors: 1 },
    { text: 'I have a persistent sense of longing for something I can\'t quite name or find.', favors: 4 },
    { text: 'I feel most grounded when I\'ve acted with integrity and done things the right way.', favors: 1 },
  ],

  // --- NEW DISAMBIGUATION SETS ---

  '1-3': [
    // Both driven and high-standards. 1's standards come from moral imperative; 3's come from wanting to win.
    { text: 'I hold high standards because doing things correctly is a moral obligation, regardless of whether anyone notices.', favors: 1 },
    { text: 'I hold high standards because producing excellent results is how I prove my worth and earn recognition.', favors: 3 },
    { text: 'When I fail at something, the worst part is knowing I didn\'t live up to what was right — not how it looked to others.', favors: 1 },
    { text: 'When I fail at something, the worst part is how it makes me look — the loss of credibility and status.', favors: 3 },
    { text: 'I would rather do something slowly and correctly than quickly and impressively.', favors: 1 },
  ],

  '2-3': [
    // Both heart center, both image-conscious. 2 earns love through service; 3 earns admiration through achievement.
    { text: 'When nobody is watching, I default to helping and supporting the people around me.', favors: 2 },
    { text: 'When nobody is watching, I default to working on my goals and advancing my position.', favors: 3 },
    { text: 'My self-worth comes primarily from being needed and valued by the people in my life.', favors: 2 },
    { text: 'My self-worth comes primarily from my track record of achievements and successes.', favors: 3 },
    { text: 'I am more afraid of being unloved than of being unsuccessful.', favors: 2 },
  ],

  '2-6': [
    // Both compliant group. 2 helps to be loved; 6 helps to maintain alliance and safety.
    { text: 'I help others because I want them to feel cared for and to see me as someone they can count on emotionally.', favors: 2 },
    { text: 'I help others because building reliable alliances is how I create safety and security in an unpredictable world.', favors: 6 },
    { text: 'I am confident I know what others need — my attunement to people is one of my greatest strengths.', favors: 2 },
    { text: 'I often doubt whether I\'m making the right call, even when helping others — I second-guess my own judgment.', favors: 6 },
    { text: 'When someone I care about pulls away, my first feeling is hurt and rejection, not suspicion about why.', favors: 2 },
  ],

  '3-6': [
    // Stress arrow pair. 6 in stress → 3 patterns. Also both can be hard-working and image-conscious.
    { text: 'My drive to achieve feels natural and energizing — it\'s who I am at my core, not a response to pressure.', favors: 3 },
    { text: 'My drive to achieve tends to spike under stress or threat — it\'s how I cope with anxiety, not my resting state.', favors: 6 },
    { text: 'I am fundamentally confident in my ability to succeed — setbacks slow me down but don\'t shake my self-belief.', favors: 3 },
    { text: 'Under my productive exterior, there is a persistent current of anxiety and self-doubt that I manage constantly.', favors: 6 },
    { text: 'I adapt my image to win — it\'s strategic and feels like a strength, not a coping mechanism.', favors: 3 },
  ],

  '4-9': [
    // Both withdrawn. 4 amplifies emotional experience; 9 dampens it.
    { text: 'My inner emotional life is vivid, complex, and sometimes overwhelming — I feel things intensely.', favors: 4 },
    { text: 'My inner life is generally calm and even — strong emotions tend to wash over me or get smoothed out quickly.', favors: 9 },
    { text: 'I have a very clear sense of who I am and what makes me different — even if others don\'t understand it.', favors: 4 },
    { text: 'I find it genuinely hard to say who I really am or what I deeply want, separate from what\'s expected of me.', favors: 9 },
    { text: 'I am more likely to intensify my feelings than to minimize them when something hurts.', favors: 4 },
  ],

  '5-9': [
    // Both detach, both can appear calm and undemanding. 5 detaches to conserve and think; 9 detaches to avoid disturbance.
    { text: 'I withdraw deliberately to protect my energy and focus — I know exactly what I\'m retreating to do.', favors: 5 },
    { text: 'I withdraw because engaging feels like too much effort — I slide into passivity without really deciding to.', favors: 9 },
    { text: 'I have strong, specific intellectual interests that I pursue actively and with intensity.', favors: 5 },
    { text: 'I tend to go along with whatever is happening around me rather than pursuing my own agenda.', favors: 9 },
    { text: 'I feel most like myself when I am alone with a complex problem or subject to master.', favors: 5 },
  ],

  '5-6': [
    // Both head center. 5 deals with fear by mastering knowledge; 6 deals with fear by seeking certainty/allies.
    { text: 'When I feel uncertain, I research and analyze until I understand the situation well enough to act independently.', favors: 5 },
    { text: 'When I feel uncertain, I look for trusted people or frameworks to validate my thinking before I commit.', favors: 6 },
    { text: 'I am more concerned with having complete understanding than with having support or backup.', favors: 5 },
    { text: 'I am more concerned with knowing who I can trust and rely on than with mastering every detail myself.', favors: 6 },
    { text: 'My fear manifests as detachment and withdrawal — I pull inward to think.', favors: 5 },
  ],

  '7-8': [
    // Both assertive. 7 avoids pain through options/reframing; 8 avoids vulnerability through control/domination.
    { text: 'When something threatens me, my instinct is to find a way around it — reframe it, escape it, or redirect.', favors: 7 },
    { text: 'When something threatens me, my instinct is to confront it head-on and overpower it.', favors: 8 },
    { text: 'I avoid pain primarily by keeping my options open and staying positive.', favors: 7 },
    { text: 'I avoid vulnerability primarily by projecting strength and never letting anyone see me as weak.', favors: 8 },
    { text: 'I would rather have freedom and exciting possibilities than power and control over my environment.', favors: 7 },
  ],

  '1-2': [
    // Both compliant. 1w2/2w1 confusion. 1's anger comes from things being wrong; 2's anger comes from not being appreciated.
    { text: 'My frustration comes from seeing things done incorrectly — the error itself bothers me, regardless of who made it.', favors: 1 },
    { text: 'My frustration comes from feeling unappreciated after I\'ve given a lot to help someone.', favors: 2 },
    { text: 'I hold myself to strict standards and feel most guilty when I fall short of my own principles.', favors: 1 },
    { text: 'I pride myself on being the person others turn to, and I feel most hurt when that role goes unacknowledged.', favors: 2 },
    { text: 'My helpfulness comes from a sense of duty and correctness, not from a need to be personally valued.', favors: 1 },
  ],

  '8-9': [
    // Adjacent types, commonly confused especially 9w8 vs 8w9. Both can appear calm and grounded.
    { text: 'My calm exterior comes from genuine inner peace — I don\'t feel much internal intensity or anger.', favors: 9 },
    { text: 'My calm exterior is deliberate restraint — underneath it, I am intense, and people feel my presence.', favors: 8 },
    { text: 'I struggle to access and express my own anger — it tends to leak out sideways or get suppressed entirely.', favors: 9 },
    { text: 'I have easy, direct access to my anger and I\'m comfortable expressing it when something crosses my line.', favors: 8 },
    { text: 'I would rather keep the peace than assert what I want, even if it means I lose out.', favors: 9 },
  ],

  '3-9': [
    // Both can appear easygoing and adaptable. 3 adapts strategically; 9 adapts to avoid conflict.
    { text: 'I adapt to different situations strategically — I know what persona will be most effective and I deploy it deliberately.', favors: 3 },
    { text: 'I adapt to different situations because it\'s easier to merge with what\'s around me than to assert my own agenda.', favors: 9 },
    { text: 'I have clear personal ambitions and I work hard to achieve them, even when the path is uncomfortable.', favors: 3 },
    { text: 'I find it hard to mobilize myself toward goals — I lose momentum easily and default to the path of least resistance.', favors: 9 },
    { text: 'When people describe me as easygoing, they\'re seeing a persona I\'ve chosen — not my actual inner state.', favors: 3 },
  ],
};

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

// Hornevian groups: assertive (3,7,8), compliant (1,2,6), withdrawn (4,5,9)
export const ENN_HORNEVIAN = { 1: 'compliant', 2: 'compliant', 3: 'assertive', 4: 'withdrawn', 5: 'withdrawn', 6: 'compliant', 7: 'assertive', 8: 'assertive', 9: 'withdrawn' };
