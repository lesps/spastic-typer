// Cross-system synergy and tension rules
// Covers Enneagram x MBTI, Enneagram x Instinct, and MBTI x Instinct pairings
// Used by generateCombinations.mjs to add nuanced notes to combination profiles

export const CROSS_RULES = [

  // ─── Enneagram × MBTI ──────────────────────────────────────────────────────

  {
    "type": "enn_mbti",
    "ennType": "4",
    "mbtiType": "INFP",
    "synergy": "Both systems reinforce a deep, inward orientation toward personal meaning, producing someone whose identity is built from carefully tended inner values and an almost poetic relationship with their own emotional landscape.",
    "tension": "The double-depth of Fi-dominant MBTI and the Four\u2019s longing can create self-referential loops where suffering feels more authentic than resolution, making forward movement genuinely difficult."
  },
  {
    "type": "enn_mbti",
    "ennType": "5",
    "mbtiType": "INTP",
    "synergy": "The Five\u2019s drive for autonomous mastery and the INTP\u2019s Ti-Ne framework align perfectly, producing a mind that is tireless at building internally consistent models of how the world works.",
    "tension": "Both systems share a tendency to deprioritize emotional and relational life, which can compound into profound isolation that neither the Enneagram nor the cognitive stack alone would predict."
  },
  {
    "type": "enn_mbti",
    "ennType": "1",
    "mbtiType": "ISTJ",
    "synergy": "The One\u2019s internalized moral standard and the ISTJ\u2019s Si-Te framework both value proven methods, duty, and correctness, creating someone of exceptional reliability and principled consistency.",
    "tension": "The combination can calcify into inflexibility, with the One\u2019s inner critic and the ISTJ\u2019s respect for precedent mutually reinforcing resistance to necessary change or creative deviation."
  },
  {
    "type": "enn_mbti",
    "ennType": "8",
    "mbtiType": "ENTJ",
    "synergy": "The Eight\u2019s drive for power and self-determination aligns naturally with the ENTJ\u2019s Te-Ni command architecture, producing a leader of formidable vision, decisiveness, and strategic confidence.",
    "tension": "Both systems amplify assertiveness and control-orientation, which can make it difficult for this person to collaborate as an equal or recognize when their certainty has outpaced the evidence."
  },
  {
    "type": "enn_mbti",
    "ennType": "2",
    "mbtiType": "ENFJ",
    "synergy": "The Two\u2019s relational attunement and the ENFJ\u2019s Fe-Ni stack both orient powerfully toward reading and serving others, creating a deeply empathic presence with real strategic capacity for human development.",
    "tension": "The overlap between the Two\u2019s pride defense and the ENFJ\u2019s external image orientation can make authentic vulnerability extremely difficult, with each system reinforcing the other\u2019s tendency to present as capable rather than needy."
  },
  {
    "type": "enn_mbti",
    "ennType": "3",
    "mbtiType": "ENTJ",
    "synergy": "The Three\u2019s achievement orientation and image-management combine with the ENTJ\u2019s Te-Ni efficiency and vision to produce a formidably productive person who pursues ambitious goals with both strategic clarity and social polish.",
    "tension": "Both systems can make it difficult to access genuine feeling, with the Three\u2019s identity suspension and the ENTJ\u2019s inferior Fi conspiring to keep authentic emotional life buried beneath performance and output."
  },
  {
    "type": "enn_mbti",
    "ennType": "6",
    "mbtiType": "ISFJ",
    "synergy": "The Six\u2019s loyalty and need for security align with the ISFJ\u2019s Si-Fe caretaking orientation, creating someone who is dependable, community-anchored, and deeply invested in the wellbeing of a trusted inner circle.",
    "tension": "Both systems can amplify anxious vigilance and difficulty asserting individual needs, producing a pattern of self-effacement that is hard to interrupt without sustained external encouragement."
  },
  {
    "type": "enn_mbti",
    "ennType": "9",
    "mbtiType": "INFP",
    "synergy": "The Nine\u2019s receptive, merging quality and the INFP\u2019s Fi-Ne idealism both lean toward acceptance and possibility, creating a person of great warmth and imaginative empathy.",
    "tension": "The combination deepens the risk of self-erasure, with the Nine\u2019s agenda-blending and the INFP\u2019s identity-through-values both making it hard to assert a clear, persistent self in conflict situations."
  },
  {
    "type": "enn_mbti",
    "ennType": "7",
    "mbtiType": "ENTP",
    "synergy": "The Seven\u2019s relentless appetite for possibility and the ENTP\u2019s Ne-Ti generative intelligence combine into one of the most intellectually energetic and creatively restless profiles imaginable.",
    "tension": "Both systems share a powerful avoidance of boredom and limitation, compounding the difficulty of sustained commitment, depth in relationships, or follow-through on projects once the initial excitement fades."
  },
  {
    "type": "enn_mbti",
    "ennType": "4",
    "mbtiType": "INFJ",
    "synergy": "The Four\u2019s emotional depth and desire for authentic selfhood combine with the INFJ\u2019s Ni-Fe pattern-recognition and empathic attunement, creating a profoundly insightful person with an uncanny ability to see beneath the surface of people and situations.",
    "tension": "The Four\u2019s tendency to idealize and the INFJ\u2019s door-slam potential can intersect in painful ways when reality fails to match the inner vision, leading to cycles of withdrawal and disillusionment."
  },
  {
    "type": "enn_mbti",
    "ennType": "5",
    "mbtiType": "INTJ",
    "synergy": "The Five\u2019s knowledge-hoarding and boundary-setting pair with the INTJ\u2019s Ni-Te vision and strategic execution, producing someone who builds deep expertise and applies it with singular, long-horizon purpose.",
    "tension": "Both systems prioritize internal authority over external input, which can create an echo chamber where overconfidence in one\u2019s own model goes unchallenged until real-world friction forces a correction."
  },
  {
    "type": "enn_mbti",
    "ennType": "1",
    "mbtiType": "INTJ",
    "synergy": "The One\u2019s perfectionism and the INTJ\u2019s Ni-Te architecture both drive toward an idealized vision executed with relentless precision, creating a person of extraordinary standard-setting capacity and strategic follow-through.",
    "tension": "The combination can breed arrogance, with the One\u2019s certainty about what is correct fused with the INTJ\u2019s confidence in their own analysis, making genuine openness to feedback rare and difficult."
  },
  {
    "type": "enn_mbti",
    "ennType": "2",
    "mbtiType": "INFJ",
    "synergy": "The Two\u2019s interpersonal warmth and the INFJ\u2019s Ni-Fe visionary empathy create a counselor archetype of unusual depth, able to both sense and strategically support others\u2019 long-term development.",
    "tension": "Both systems can make boundary-setting extraordinarily difficult, with the Two\u2019s pride around giving and the INFJ\u2019s Fe-driven accommodation conspiring to suppress personal needs until burnout or a dramatic withdrawal breaks the pattern."
  },
  {
    "type": "enn_mbti",
    "ennType": "3",
    "mbtiType": "ESTP",
    "synergy": "The Three\u2019s adaptive image-management and the ESTP\u2019s Se-Ti real-time tactical instinct combine into one of the most socially agile and situationally effective profiles, able to read rooms and close gaps with equal skill.",
    "tension": "Both systems reward performance and result over depth and authenticity, which can make genuine vulnerability or introspective reckoning feel threatening rather than necessary."
  },
  {
    "type": "enn_mbti",
    "ennType": "6",
    "mbtiType": "INTP",
    "synergy": "The Six\u2019s vigilant questioning and the INTP\u2019s Ti-Ne analytical skepticism align in a relentless pursuit of logical rigor and worst-case preparation, producing someone who stress-tests ideas with unusual thoroughness.",
    "tension": "Both systems amplify doubt, which can paralyze decision-making as every conclusion generates a new round of objections and the person cannot reach the threshold of certainty they require to act."
  },
  {
    "type": "enn_mbti",
    "ennType": "7",
    "mbtiType": "ENFP",
    "synergy": "The Seven\u2019s enthusiasm for experience and the ENFP\u2019s Ne-Fi generative energy create a person of irrepressible optimism and creative vision who can genuinely inspire others toward expansive possibilities.",
    "tension": "Both systems can make sustained focus extremely difficult, with the Seven\u2019s reframing of limitation and the ENFP\u2019s attention-hopping compounding into a pattern where many things are started and few are completed."
  },
  {
    "type": "enn_mbti",
    "ennType": "8",
    "mbtiType": "ESTP",
    "synergy": "The Eight\u2019s raw directness and physical confidence pair with the ESTP\u2019s Se-Ti tactical sharpness to create a person of extraordinary situational dominance and real-time impact.",
    "tension": "Both systems can short-circuit empathy and long-term planning in favor of immediate action and control, making it hard for this person to slow down, listen, or consider impact beyond the present moment."
  },
  {
    "type": "enn_mbti",
    "ennType": "9",
    "mbtiType": "ISFP",
    "synergy": "The Nine\u2019s receptive calm and the ISFP\u2019s Fi-Se sensory presence combine in a person of unusual warmth and aesthetic sensitivity who creates harmony through genuine acceptance rather than strategic management.",
    "tension": "Both systems make assertion and conflict extremely uncomfortable, which can result in important needs going unexpressed for so long that quiet resentment poisons relationships the person values deeply."
  },
  {
    "type": "enn_mbti",
    "ennType": "1",
    "mbtiType": "ESTJ",
    "synergy": "The One\u2019s moral precision and the ESTJ\u2019s Te-Si standards enforcement reinforce each other into a formidable capacity for maintaining systems, quality, and accountability at scale.",
    "tension": "Both systems can make this person relentlessly critical of deviation from correct procedure, producing an interpersonal rigidity that alienates the very people they are trying to improve."
  },
  {
    "type": "enn_mbti",
    "ennType": "5",
    "mbtiType": "INFP",
    "synergy": "The Five\u2019s intellectual detachment and the INFP\u2019s Fi-Ne depth combine in a person who explores inner and outer worlds with unusual independence and generates creative work of singular, idiosyncratic vision.",
    "tension": "Both systems prioritize internal experience over external engagement, which can compound into significant withdrawal from relationships and practical life that is hard to interrupt from within."
  },
  {
    "type": "enn_mbti",
    "ennType": "2",
    "mbtiType": "ESFJ",
    "synergy": "The Two\u2019s desire to give and be loved aligns with the ESFJ\u2019s Fe-Si warmth and community-maintenance orientation, creating a highly engaged social caretaker who genuinely thrives on making others feel at home.",
    "tension": "Both systems can make receiving care feel almost as uncomfortable as withholding it, with the Two\u2019s pride and the ESFJ\u2019s social role expectations combining to suppress honest acknowledgment of personal need."
  },
  {
    "type": "enn_mbti",
    "ennType": "3",
    "mbtiType": "ENFJ",
    "synergy": "The Three\u2019s achievement drive and the ENFJ\u2019s Fe-Ni people-development orientation combine in a leader who pursues ambitious goals while maintaining genuine, strategic investment in the people around them.",
    "tension": "Both systems risk confusing performance with presence, and this person may find that genuine emotional intimacy feels less safe than the managed warmth of their public or professional role."
  },
  {
    "type": "enn_mbti",
    "ennType": "4",
    "mbtiType": "ISFP",
    "synergy": "The Four\u2019s emotional intensity and the ISFP\u2019s Fi-Se sensory groundedness combine in a person who expresses depth through immediate, embodied creative acts rather than abstract or verbal processing.",
    "tension": "Both systems can make comparison and envy acute, with the Four\u2019s longing for a special identity and the ISFP\u2019s sensitivity to external judgments intersecting painfully when the person feels unseen or undervalued."
  },
  {
    "type": "enn_mbti",
    "ennType": "6",
    "mbtiType": "ESTJ",
    "synergy": "The Six\u2019s need for security through reliable structures and the ESTJ\u2019s Te-Si enforcement of proven systems reinforce each other into a highly organized, rule-respecting person who builds and sustains institutional trust.",
    "tension": "Both systems can make the person resistant to necessary innovation, with the Six\u2019s threat-detection and the ESTJ\u2019s precedent-respect combining into a posture that labels change as danger."
  },
  {
    "type": "enn_mbti",
    "ennType": "7",
    "mbtiType": "ESFP",
    "synergy": "The Seven\u2019s joy-seeking and the ESFP\u2019s Se-Fi sensory engagement and spontaneous warmth create a person of infectious energy who draws others into celebration of the present moment.",
    "tension": "Both systems can make sitting with pain, limitation, or boredom nearly impossible, which can prevent the depth of processing needed for genuine growth and stable relationships."
  },
  {
    "type": "enn_mbti",
    "ennType": "8",
    "mbtiType": "INTJ",
    "synergy": "The Eight\u2019s will-to-power and the INTJ\u2019s Ni-Te strategic architecture combine into one of the most formidable long-range planning and execution profiles, capable of sustained, single-minded pursuit of large objectives.",
    "tension": "Both systems can make the person intensely certain of their own judgment and deeply resistant to feedback, which can lead to strategic blindspots that only become visible after significant damage has been done."
  },
  {
    "type": "enn_mbti",
    "ennType": "9",
    "mbtiType": "ISTP",
    "synergy": "The Nine\u2019s quiet adaptability and the ISTP\u2019s Ti-Se detached effectiveness combine in a person who handles practical problems with economy and skill while maintaining a calm, non-reactive presence that others find stabilizing.",
    "tension": "Both systems make emotional disclosure and self-advocacy difficult, which can lead to chronic under-communication of needs that quietly destabilizes otherwise functional relationships."
  },
  {
    "type": "enn_mbti",
    "ennType": "1",
    "mbtiType": "ENFJ",
    "synergy": "The One\u2019s idealism and the ENFJ\u2019s Fe-Ni people-orientation combine in a passionate reformer who pursues higher standards through genuine investment in individuals rather than cold enforcement.",
    "tension": "The One\u2019s inner critic and the ENFJ\u2019s external accountability drive can create a person who holds both themselves and others to standards so high that relationships become quietly exhausting."
  },
  {
    "type": "enn_mbti",
    "ennType": "6",
    "mbtiType": "ENFJ",
    "synergy": "The Six\u2019s loyalty and the ENFJ\u2019s Fe-Ni community-building orientation combine in someone who is deeply invested in the safety and cohesion of their group and works strategically to maintain it.",
    "tension": "Both systems can produce people-pleasing behavior that suppresses honest disagreement, making conflict avoidance a default even when directness would serve the relationship far better."
  },
  {
    "type": "enn_mbti",
    "ennType": "4",
    "mbtiType": "ENFP",
    "synergy": "The Four\u2019s longing for authentic selfhood and the ENFP\u2019s Ne-Fi generative enthusiasm combine in a person of vivid imagination and emotional expressiveness who pursues both meaning and possibility with equal passion.",
    "tension": "Both systems can amplify the gap between idealized vision and imperfect reality, with the Four\u2019s melancholy and the ENFP\u2019s frustrated idealism feeding each other into cycles of inspiration followed by deflation."
  },
  {
    "type": "enn_mbti",
    "ennType": "3",
    "mbtiType": "ISTP",
    "synergy": "The Three\u2019s results-orientation and the ISTP\u2019s Ti-Se tactical efficiency combine in a person who achieves through competent action rather than social maneuvering, with a quiet, understated confidence that commands respect.",
    "tension": "Both systems suppress emotional expression, which can make this person appear more self-sufficient than they are and leave relationships starved of the vulnerability needed for genuine intimacy."
  },

  // ─── Enneagram × Instinct ──────────────────────────────────────────────────

  {
    "type": "enn_inst",
    "ennType": "1",
    "instStack": "SP/SX/SO",
    "synergy": "The One\u2019s self-discipline pairs with the SP drive for personal security and resource management, producing a person of exceptional self-reliance and principled autonomy who lives according to their own precisely calibrated standards.",
    "tension": "The SX charge added to the One\u2019s critical eye can create an intense, demanding quality in close relationships that the partner experiences as exhausting perfectionism applied specifically to them."
  },
  {
    "type": "enn_inst",
    "ennType": "2",
    "instStack": "SO/SX/SP",
    "synergy": "The Two\u2019s relational giving aligns with SO\u2019s group-orientation and SX\u2019s intensity, creating a person who pours themselves into both community care and passionate one-on-one devotion simultaneously.",
    "tension": "The suppressed SP in this stack means personal material needs and self-care routines are chronically deprioritized, often leading to physical depletion masked by relational and social busyness."
  },
  {
    "type": "enn_inst",
    "ennType": "3",
    "instStack": "SO/SP/SX",
    "synergy": "The Three\u2019s achievement drive and image-management align naturally with SO\u2019s social role orientation, producing a highly effective public performer who excels at maintaining the right reputation in the right communities.",
    "tension": "The deprioritized SX means intimate partners rarely experience the Three\u2019s full emotional presence, with performance and social positioning consistently crowding out genuine one-on-one depth."
  },
  {
    "type": "enn_inst",
    "ennType": "4",
    "instStack": "SX/SP/SO",
    "synergy": "The Four\u2019s longing for unique authentic connection fuses with the SX drive for intense merger, producing someone for whom love is a consuming and transformative experience that defines their sense of self.",
    "tension": "The deprioritized SO means this person may feel profoundly alienated from groups and social convention, intensifying the Four\u2019s already-present sense of being fundamentally different from ordinary life."
  },
  {
    "type": "enn_inst",
    "ennType": "5",
    "instStack": "SP/SX/SO",
    "synergy": "The Five\u2019s resource-conservation and the SP drive for self-sufficiency reinforce each other powerfully, creating a person of remarkable autonomy and endurance who can sustain themselves on minimal external input.",
    "tension": "The SX influence adds a hidden longing for intense connection that conflicts with the Five\u2019s detachment, producing an oscillation between withdrawal and sudden, overwhelming intimacy."
  },
  {
    "type": "enn_inst",
    "ennType": "6",
    "instStack": "SO/SP/SX",
    "synergy": "The Six\u2019s need for security through community aligns with the SO drive for group belonging and the SP drive for stable personal resources, creating a dutiful, community-anchored person of real practical reliability.",
    "tension": "The deprioritized SX means this person may struggle with intimate intensity and passionate one-on-one connection, keeping relationships warm but carefully controlled."
  },
  {
    "type": "enn_inst",
    "ennType": "7",
    "instStack": "SX/SO/SP",
    "synergy": "The Seven\u2019s appetite for experience fuses with SX intensity and SO social magnetism, creating a person of extraordinary relational energy who can light up any room and pull others into their orbit of enthusiasm.",
    "tension": "The neglected SP means practical self-care and resource management are perpetually in chaos beneath a vibrant and exciting surface, producing instability that accelerates in long-term relationships."
  },
  {
    "type": "enn_inst",
    "ennType": "8",
    "instStack": "SX/SP/SO",
    "synergy": "The Eight\u2019s power and protection drive pairs with SX intensity and SP self-sufficiency, creating a formidable, fiercely autonomous person who protects their chosen intimate partner with extraordinary loyalty and force.",
    "tension": "The neglected SO means group belonging and social reputation feel irrelevant or even suspicious to them, which can create friction in professional or community contexts that require diplomatic social investment."
  },
  {
    "type": "enn_inst",
    "ennType": "9",
    "instStack": "SP/SO/SX",
    "synergy": "The Nine\u2019s peaceful merging tendency aligns with SP\u2019s steady self-maintenance and SO\u2019s group harmony orientation, producing a calm, reliable community member who sustains peace through consistent, low-drama presence.",
    "tension": "The deprioritized SX means the Nine in this stack may avoid the very depth of one-on-one intensity that would bring them most alive, settling for comfortable but somewhat surface-level connection."
  },
  {
    "type": "enn_inst",
    "ennType": "2",
    "instStack": "SX/SP/SO",
    "synergy": "The Two\u2019s relational giving combines with the SX drive for intense connection, creating a passionately devoted partner who invests everything in the chosen person and experiences relationships as total and defining.",
    "tension": "The neglected SO means this person may withdraw from broader community and focus so intensely on one primary relationship that other social ties atrophy, heightening dependency dynamics."
  },
  {
    "type": "enn_inst",
    "ennType": "4",
    "instStack": "SO/SX/SP",
    "synergy": "The Four\u2019s search for unique identity combines with SO\u2019s group-awareness and SX\u2019s intensity, producing someone who seeks to stand out within community and be recognized as singular among their peers.",
    "tension": "The neglected SP means practical life management is frequently chaotic, with the Four\u2019s emotional needs and social desires consuming resources needed for basic stability."
  },
  {
    "type": "enn_inst",
    "ennType": "5",
    "instStack": "SX/SP/SO",
    "synergy": "The Five\u2019s intellectual depth fuses with SX intensity in a person who forms rare, but profoundly meaningful connections built around shared intellectual or philosophical exploration rather than social convention.",
    "tension": "This pairing creates a person who desperately wants deep one-on-one connection but lacks the relational tools to initiate or sustain it, resulting in prolonged solitude punctuated by intense but fragile bonds."
  },
  {
    "type": "enn_inst",
    "ennType": "6",
    "instStack": "SX/SO/SP",
    "synergy": "The Six\u2019s loyalty aligns with SX\u2019s devotion and SO\u2019s community care, creating someone who forms intense, committed bonds within a trusted group and defends both the individuals and the collective with fierce dedication.",
    "tension": "The neglected SP can leave this person physically and materially precarious, pouring resources into relationships and group concerns while neglecting the personal foundation that would sustain their giving long-term."
  },
  {
    "type": "enn_inst",
    "ennType": "7",
    "instStack": "SP/SX/SO",
    "synergy": "The Seven\u2019s love of experience is grounded by SP\u2019s resource-awareness and enriched by SX intensity, producing a person who pursues pleasure and adventure with more sustainability and deeper one-on-one engagement than other Seven stacks.",
    "tension": "The neglected SO means this person may appear socially adept but is actually investing far less in group belonging than their enthusiasm suggests, leaving communities feeling charmed but not truly known by them."
  },
  {
    "type": "enn_inst",
    "ennType": "1",
    "instStack": "SO/SP/SX",
    "synergy": "The One\u2019s principled idealism aligns with the SO drive for community standards and the SP drive for reliable personal conduct, creating a person who upholds collective norms with genuine moral commitment.",
    "tension": "The deprioritized SX means the One in this stack may appear principled but emotionally distant in intimate relationships, with their energy going to community standards rather than passionate personal connection."
  },
  {
    "type": "enn_inst",
    "ennType": "3",
    "instStack": "SX/SP/SO",
    "synergy": "The Three\u2019s achievement drive fuses with SX\u2019s intensity, producing someone who pursues success as a form of personal magnetism, wanting to be desirable and compelling to the people who matter most to them.",
    "tension": "The neglected SO means group reputation and community roles matter less than this stack would normally predict for a Three, which can confuse observers who expect the typical socially-oriented Three presentation."
  },
  {
    "type": "enn_inst",
    "ennType": "8",
    "instStack": "SO/SP/SX",
    "synergy": "The Eight\u2019s power and protection drive aligns with SO\u2019s community leadership and SP\u2019s resource management, producing a person who builds and defends communities with genuine authority and practical competence.",
    "tension": "The deprioritized SX means this Eight may appear warmer and more publicly generous than other Eights while keeping intimate partners at a carefully managed distance."
  },
  {
    "type": "enn_inst",
    "ennType": "9",
    "instStack": "SX/SO/SP",
    "synergy": "The Nine\u2019s merging tendency fuses with SX intensity and SO warmth, creating a quietly magnetic person who is deeply attuned to both their intimate partner and the emotional undercurrents of their broader community.",
    "tension": "The neglected SP means this Nine often neglects practical self-maintenance and material stability, deferring to others\u2019 agendas so thoroughly that their own resources and wellbeing quietly erode."
  },
  {
    "type": "enn_inst",
    "ennType": "6",
    "instStack": "SP/SX/SO",
    "synergy": "The Six\u2019s security-seeking combines with SP\u2019s self-reliance and SX\u2019s intimate loyalty, producing a person who builds security through deep personal mastery and one trusted intimate bond rather than group membership.",
    "tension": "The neglected SO means the Six in this stack may lack the broader community anchors that typically provide security, making the one intimate bond carry more psychological weight than any single relationship can sustain."
  },
  {
    "type": "enn_inst",
    "ennType": "2",
    "instStack": "SP/SO/SX",
    "synergy": "The Two\u2019s care orientation aligns with SP\u2019s practical nurturing and SO\u2019s community caretaking, producing a grounded, reliable helper who sustains others through consistent practical action rather than emotional intensity.",
    "tension": "The deprioritized SX means intimate partners may experience this Two as warm but somewhat measured, with the passionate one-on-one depth of the relationship harder to access than the consistent everyday care."
  },

  // ─── MBTI × Instinct ───────────────────────────────────────────────────────

  {
    "type": "mbti_inst",
    "mbtiType": "INFJ",
    "instStack": "SO/SX/SP",
    "synergy": "The INFJ\u2019s Ni-Fe visionary empathy aligns powerfully with SO\u2019s community orientation and SX\u2019s depth, creating a person who reads collective dynamics with precision and invests in both community vision and intimate one-on-one connection.",
    "tension": "The neglected SP means practical life management and personal resource stewardship are often sacrificed to relational and social investment, with physical depletion a chronic background condition."
  },
  {
    "type": "mbti_inst",
    "mbtiType": "INFP",
    "instStack": "SX/SP/SO",
    "synergy": "The INFP\u2019s Fi-Ne authenticity-seeking and the SX drive for intense singular connection reinforce each other in a person who needs love to feel total, unique, and meaning-laden rather than comfortable or socially integrated.",
    "tension": "The neglected SO means this person may feel profoundly isolated from group life and conventional social belonging, which the INFP\u2019s already-strong sense of difference compounds into persistent alienation."
  },
  {
    "type": "mbti_inst",
    "mbtiType": "INTP",
    "instStack": "SP/SX/SO",
    "synergy": "The INTP\u2019s Ti-Ne analytical self-sufficiency aligns with SP\u2019s independence and SX\u2019s depth, producing a person who builds intellectual mastery and then channels it into rare, intensely meaningful connections.",
    "tension": "Both the INTP cognitive stack and the SP/SX combination can make group belonging feel artificial and unnecessary, producing genuine disengagement from social life that can shade into isolation."
  },
  {
    "type": "mbti_inst",
    "mbtiType": "INTJ",
    "instStack": "SX/SP/SO",
    "synergy": "The INTJ\u2019s Ni-Te strategic vision fused with SX\u2019s intensity creates a person who pursues their long-range goals with the same consuming focus they bring to intimate connection, making them formidably single-minded in all domains.",
    "tension": "The neglected SO means this person may appear indifferent to social approval and community standing in ways that create professional friction, even when their actual work quality is exceptional."
  },
  {
    "type": "mbti_inst",
    "mbtiType": "ENFP",
    "instStack": "SO/SX/SP",
    "synergy": "The ENFP\u2019s Ne-Fi possibility generation aligns with SO\u2019s group inspiration orientation and SX\u2019s relational intensity, producing a charismatic idealist who can rally communities and light up intimate bonds with equal energy.",
    "tension": "The neglected SP means practical self-care, financial management, and physical maintenance are perpetually deprioritized beneath the ENFP\u2019s relational and social investments, often creating a beautiful but somewhat precarious life."
  },
  {
    "type": "mbti_inst",
    "mbtiType": "ENFJ",
    "instStack": "SO/SP/SX",
    "synergy": "The ENFJ\u2019s Fe-Ni community-building and the SO drive for social role effectiveness align precisely, creating a natural leader and developer of people who operates with strategic warmth and genuine investment in collective wellbeing.",
    "tension": "The deprioritized SX means intimate partners may experience this ENFJ as publicly warm and interpersonally skilled but privately less available for the vulnerable, unguarded connection they crave."
  },
  {
    "type": "mbti_inst",
    "mbtiType": "ENTP",
    "instStack": "SX/SO/SP",
    "synergy": "The ENTP\u2019s Ne-Ti generative intelligence fused with SX\u2019s intensity and SO\u2019s social engagement creates an intellectually magnetic person who sparks ideas and connections across both intimate and group contexts with irresistible energy.",
    "tension": "The neglected SP means this person regularly ignores practical needs, logistics, and resource management, creating a chaotic personal infrastructure beneath their vibrant intellectual and social life."
  },
  {
    "type": "mbti_inst",
    "mbtiType": "ENTJ",
    "instStack": "SP/SO/SX",
    "synergy": "The ENTJ\u2019s Te-Ni efficiency and vision aligns with SP\u2019s resource competence and SO\u2019s institutional leadership, creating a person who builds and manages organizations with both strategic clarity and practical durability.",
    "tension": "The deprioritized SX means intimate partners may find this ENTJ consistently available as a provider and planner but rarely accessible at the level of personal vulnerability and emotional depth."
  },
  {
    "type": "mbti_inst",
    "mbtiType": "ISFP",
    "instStack": "SX/SP/SO",
    "synergy": "The ISFP\u2019s Fi-Se sensory authenticity aligns with SX\u2019s one-on-one intensity and SP\u2019s present-moment self-sufficiency, creating a person of deep personal integrity who expresses love through full physical and creative presence.",
    "tension": "The neglected SO means this person may withdraw from group life so completely that friendships atrophy and they become dependent on a single intimate relationship for all social nourishment."
  },
  {
    "type": "mbti_inst",
    "mbtiType": "ISFJ",
    "instStack": "SO/SP/SX",
    "synergy": "The ISFJ\u2019s Si-Fe caretaking and community memory align with SO\u2019s group-orientation and SP\u2019s practical nurturing, creating a steady, dependable pillar of community who maintains bonds through consistent, detail-rich care.",
    "tension": "The deprioritized SX means this person may be experienced as warm and reliably present but emotionally measured in intimate relationships, with passionate depth harder to access than everyday tenderness."
  },
  {
    "type": "mbti_inst",
    "mbtiType": "ISTP",
    "instStack": "SP/SX/SO",
    "synergy": "The ISTP\u2019s Ti-Se tactical independence aligns with SP\u2019s self-reliance and SX\u2019s depth preference, producing a person who shows up fully only when practical competence meets genuine one-on-one trust.",
    "tension": "The neglected SO can make this person appear aloof or indifferent to group dynamics, creating professional friction in team contexts even when their individual contributions are excellent."
  },
  {
    "type": "mbti_inst",
    "mbtiType": "ISTJ",
    "instStack": "SP/SO/SX",
    "synergy": "The ISTJ\u2019s Si-Te reliability and procedural discipline align with SP\u2019s practical independence and SO\u2019s institutional stewardship, producing a person who upholds systems and communities through rigorous, consistent effort.",
    "tension": "The deprioritized SX means intimate partners often experience this ISTJ as a devoted provider and reliable partner but may struggle to access the emotional intensity and vulnerability that make a relationship feel fully alive."
  },
  {
    "type": "mbti_inst",
    "mbtiType": "ESFP",
    "instStack": "SX/SO/SP",
    "synergy": "The ESFP\u2019s Se-Fi sensory warmth aligns with SX\u2019s relational intensity and SO\u2019s social magnetism, creating an irresistible, fully-present person who makes both intimate partners and groups feel genuinely celebrated.",
    "tension": "The neglected SP means practical life management is chronically chaotic for this combination, with immediate relational and experiential priorities consistently displacing material and logistical responsibility."
  },
  {
    "type": "mbti_inst",
    "mbtiType": "ESFJ",
    "instStack": "SO/SX/SP",
    "synergy": "The ESFJ\u2019s Fe-Si community caretaking aligns with SO\u2019s group-investment and SX\u2019s relational intensity, creating a person who anchors communities with warmth and also forms deep, loyal one-on-one bonds within them.",
    "tension": "The neglected SP means this person tends to give their practical and emotional resources to others before themselves, creating a quiet personal depletion that is hard to acknowledge because it conflicts with their caretaker identity."
  },
  {
    "type": "mbti_inst",
    "mbtiType": "ESTP",
    "instStack": "SP/SX/SO",
    "synergy": "The ESTP\u2019s Se-Ti tactical immediacy aligns with SP\u2019s physical mastery and SX\u2019s intensity, producing a person of exceptional real-world impact who brings full competitive energy to both practical domains and close relationships.",
    "tension": "The neglected SO means this person may be highly skilled at individual performance and intimate connection while remaining oddly indifferent to group dynamics, community standing, or collective morale."
  },
  {
    "type": "mbti_inst",
    "mbtiType": "ESTJ",
    "instStack": "SO/SP/SX",
    "synergy": "The ESTJ\u2019s Te-Si authority and the SO drive for institutional leadership align in a person who builds, maintains, and enforces the systems that communities depend on with consistent competence and genuine civic investment.",
    "tension": "The deprioritized SX means intimate relationships receive the ESTJ\u2019s residual energy rather than their focused attention, often producing a partner who feels respected and provided for but not deeply seen or chosen."
  },
  {
    "type": "mbti_inst",
    "mbtiType": "INFJ",
    "instStack": "SX/SP/SO",
    "synergy": "The INFJ\u2019s Ni-Fe depth aligns with SX\u2019s one-on-one intensity and SP\u2019s careful self-maintenance, creating a person who invests their full visionary empathy into a single profound relationship while maintaining principled self-sufficiency.",
    "tension": "The neglected SO means this INFJ may retreat from the broader social world almost entirely, losing the community context that normally grounds and validates their insight."
  },
  {
    "type": "mbti_inst",
    "mbtiType": "ENTP",
    "instStack": "SP/SO/SX",
    "synergy": "The ENTP\u2019s Ne-Ti generative intelligence aligns with SP\u2019s self-reliance and SO\u2019s community engagement, creating a person who develops independent expertise and then deploys it to disrupt and improve institutional systems.",
    "tension": "The deprioritized SX means this combination is more comfortable disrupting systems and engaging communities than sustaining the vulnerable, emotionally reciprocal intimacy of a deep one-on-one bond."
  },
  {
    "type": "mbti_inst",
    "mbtiType": "INFP",
    "instStack": "SO/SP/SX",
    "synergy": "The INFP\u2019s Fi-Ne authenticity and the SO drive for community contribution combine in a person who quietly advocates for values-aligned change within communities, finding meaning in belonging to something larger than their private inner world.",
    "tension": "The deprioritized SX can leave this INFP\u2019s intimate relationships somewhat emotionally measured, surprising partners who expect the type\u2019s characteristic intensity and emotional depth to be readily available."
  },
  {
    "type": "mbti_inst",
    "mbtiType": "INTJ",
    "instStack": "SO/SP/SX",
    "synergy": "The INTJ\u2019s Ni-Te strategic architecture aligns with SO\u2019s institutional leadership and SP\u2019s resource competence, creating a person who builds long-term systems for community benefit with unusual practical intelligence.",
    "tension": "The deprioritized SX means this INTJ is more publicly engaged than the stereotype suggests but still maintains careful walls against the intimate vulnerability that would complete the picture of genuine connection."
  },
  {
    "type": "mbti_inst",
    "mbtiType": "ISFJ",
    "instStack": "SX/SO/SP",
    "synergy": "The ISFJ\u2019s Si-Fe relational memory aligns with SX\u2019s intensity and SO\u2019s community warmth, creating a person who forms rare, intensely loyal bonds within a community and tends them with extraordinary care and long emotional memory.",
    "tension": "The neglected SP means this person\u2019s own material and physical needs are consistently the last priority, with caretaking of others consuming the personal resources that sustain their ability to keep giving."
  }
];

export function findCrossRule(params) {
  // params: { ennType, mbtiType?, instStack? }
  // Returns matching rules as array
  return CROSS_RULES.filter(r => {
    if (params.ennType && r.ennType && r.ennType !== params.ennType) return false;
    if (params.mbtiType && r.mbtiType && r.mbtiType !== params.mbtiType) return false;
    if (params.instStack && r.instStack && r.instStack !== params.instStack) return false;
    return true;
  });
}
