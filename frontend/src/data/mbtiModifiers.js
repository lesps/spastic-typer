// MBTI modifier profiles — 16 entries (one per MBTI type)
// Used by generateCombinations.mjs to layer cognitive-function texture onto combination profiles

export const MBTI_MODIFIERS = {
  "INFP": {
    "cognitivePortrait": "INFPs lead with introverted Feeling, building a rich inner map of personal values against which every experience is measured. Their auxiliary Ne generates a constant stream of possibilities and meanings, making them imaginative idealists who see the world in terms of what could be rather than what is.",
    "workStyle": "They work best with autonomy and purpose, needing to feel that their efforts align with something meaningful. Routine without personal significance drains them quickly, while creative latitude or value-driven missions bring out their best.",
    "stressGrip": "Under grip stress, their inferior Te emerges as harsh self-criticism or clumsy, rigid attempts to impose order that feel out of character and exhausting."
  },
  "INFJ": {
    "cognitivePortrait": "INFJs lead with introverted Intuition, absorbing patterns across time and converging them into deep convictions about how things will unfold. Their auxiliary Fe keeps them attuned to the emotional undercurrents in every room, making them quietly powerful empaths who think in systems but feel in people.",
    "workStyle": "They prefer to work on problems with long-term significance, bringing vision and quiet persistence rather than quick pivots. They need both solitude to process and meaningful human connection to sustain motivation.",
    "stressGrip": "Under grip stress, inferior Se pulls them toward sensory overindulgence or an obsessive fixation on concrete details they normally rise above."
  },
  "INTP": {
    "cognitivePortrait": "INTPs lead with introverted Thinking, building precise internal frameworks that must be internally consistent before any conclusion is accepted. Their auxiliary Ne combs possibilities restlessly, making them creative problem-solvers who question assumptions others treat as settled.",
    "workStyle": "They excel at independent analysis and thrive when given complex problems with room to explore unconventional solutions. Bureaucracy, repetitive tasks, and premature closure on open questions frustrate them deeply.",
    "stressGrip": "Under grip stress, inferior Fe erupts as unexpected emotional outbursts or a spiral of feeling unloved and fundamentally misunderstood."
  },
  "INTJ": {
    "cognitivePortrait": "INTJs lead with introverted Intuition, synthesizing vast information into singular, confident visions of how things should be restructured. Their auxiliary Te drives them to execute those visions with precision, making them formidable strategic planners who are long on patience for their own goals and short on tolerance for inefficiency.",
    "workStyle": "They work best with high autonomy and clearly defined objectives, applying systematic effort toward outcomes they have personally committed to. They resist micromanagement intensely and perform at their peak when they control the method as well as the goal.",
    "stressGrip": "Under grip stress, inferior Se hijacks them into sensory excess or acute physical hypersensitivity, pulling them entirely out of their strategic comfort zone."
  },
  "ENFP": {
    "cognitivePortrait": "ENFPs lead with extraverted Intuition, scanning the world for connections, meanings, and possibilities with infectious enthusiasm. Their auxiliary Fi grounds this exploration in personal authenticity, ensuring that their many ideas and projects feel genuinely their own rather than performed.",
    "workStyle": "They thrive in dynamic environments where they can brainstorm, champion ideas, and connect people around shared possibilities. Rigid structure and repetitive tasks suppress their energy, while collaborative ideation and projects with human impact sustain it.",
    "stressGrip": "Under grip stress, inferior Si pulls them into obsessive rumination over past details, physical symptom fixation, or a sudden paralysis of routine."
  },
  "ENFJ": {
    "cognitivePortrait": "ENFJs lead with extraverted Feeling, reading emotional dynamics with precision and orchestrating interactions so that groups move toward harmony and shared purpose. Their auxiliary Ni gives them a strategic, almost prophetic sense of where people and situations are heading.",
    "workStyle": "They excel in roles where they can develop people, facilitate alignment, and pursue meaningful collective goals. They are natural mentors and coalition-builders but can overextend when they take on others' emotional burdens as their own responsibility.",
    "stressGrip": "Under grip stress, inferior Ti turns inward as relentless self-analysis, fault-finding, or cold logical detachment that surprises everyone who knows them as warm."
  },
  "ENTP": {
    "cognitivePortrait": "ENTPs lead with extraverted Intuition, generating ideas and arguments at speed and finding genuine joy in intellectual combat and creative disruption. Their auxiliary Ti gives them enough analytical rigor to back their provocations, making them compelling debaters who rarely run out of angles.",
    "workStyle": "They flourish in environments that reward creative problem-solving, tolerate unfinished experiments, and move quickly enough to keep them from getting bored. Predictable, rules-heavy contexts drain their energy while novel challenges invigorate them.",
    "stressGrip": "Under grip stress, inferior Fe floods them with uncharacteristic emotional sensitivity or drives a desperate, clumsy bid for connection and approval."
  },
  "ENTJ": {
    "cognitivePortrait": "ENTJs lead with extraverted Thinking, organizing people and resources around clearly defined objectives with decisive, systematic efficiency. Their auxiliary Ni gives their ambition a long horizon, letting them see structural opportunities where others see only noise.",
    "workStyle": "They perform best in leadership or high-agency roles where they can design systems, set direction, and hold others accountable to results. Ambiguity without authority frustrates them; clear goals with real stakes energize them.",
    "stressGrip": "Under grip stress, inferior Fi surfaces as sudden intense hurt, a wounded sense of personal betrayal, or an uncharacteristic emotional shutdown."
  },
  "ISFP": {
    "cognitivePortrait": "ISFPs lead with introverted Feeling, carrying an acute awareness of personal values and aesthetic beauty that shapes every choice they make. Their auxiliary Se grounds them in sensory presence, making them skilled at living fully in the moment and expressing feeling through craft, movement, or art rather than words.",
    "workStyle": "They work best in hands-on, creative environments that allow personal expression and real-time problem-solving. Bureaucracy, abstract theorizing, and competitive workplaces suppress their gifts while environments that honor craftsmanship draw them out.",
    "stressGrip": "Under grip stress, inferior Te expresses itself as harsh, critical self-judgment or clumsy attempts to control external circumstances with unusual rigidity."
  },
  "ISFJ": {
    "cognitivePortrait": "ISFJs lead with introverted Sensing, carrying a detailed, emotionally rich memory of past experiences and relationships that shapes how they care for people in the present. Their auxiliary Fe makes them attuned caretakers who register what others need before those needs are spoken.",
    "workStyle": "They excel in stable, service-oriented environments where reliability, attention to detail, and care for individuals are valued. They are dependable colleagues who remember preferences and quietly uphold standards, but they need appreciation to remain motivated long-term.",
    "stressGrip": "Under grip stress, inferior Ne floods them with catastrophic what-if thinking, sudden anxiety about future unknowns, or uncharacteristic suspicion."
  },
  "ISTP": {
    "cognitivePortrait": "ISTPs lead with introverted Thinking, building precise internal models of how mechanical and logical systems work. Their auxiliary Se keeps them experientially grounded, making them skilled troubleshooters who think on their feet and prefer direct action to extended deliberation.",
    "workStyle": "They thrive with real problems that require technical mastery, tactical thinking, and hands-on engagement. Meetings, politics, and abstract bureaucracy are obstacles; tangible challenges with clear feedback loops are their native environment.",
    "stressGrip": "Under grip stress, inferior Fe erupts as uncharacteristic emotional volatility, tearfulness, or an urgent, clumsy attempt to reconnect with others."
  },
  "ISTJ": {
    "cognitivePortrait": "ISTJs lead with introverted Sensing, drawing on a comprehensive archive of past experience to evaluate present situations against proven standards. Their auxiliary Te drives them to apply this knowledge systematically and efficiently, making them reliable stewards of process, duty, and tradition.",
    "workStyle": "They excel in structured environments where clear expectations, consistent processes, and concrete outcomes are valued. They are thorough, punctual, and resistant to change without demonstrated necessity.",
    "stressGrip": "Under grip stress, inferior Ne pulls them into catastrophic worst-case spiraling or a sudden, uncharacteristic scatter of half-formed anxious possibilities."
  },
  "ESFP": {
    "cognitivePortrait": "ESFPs lead with extraverted Sensing, engaging the world with full-throttle presence and an eye for what is vivid, immediate, and pleasurable. Their auxiliary Fi ensures this sensory enthusiasm is filtered through personal values, giving their expressiveness genuine warmth rather than mere performance.",
    "workStyle": "They flourish in dynamic, people-centered environments where they can entertain, engage, and respond to real-time needs. Long-range planning and abstract analysis are draining; present-moment problem-solving and human connection are energizing.",
    "stressGrip": "Under grip stress, inferior Ni pulls them into dark, tunnel-vision catastrophizing or an ominous sense that everything is about to collapse."
  },
  "ESFJ": {
    "cognitivePortrait": "ESFJs lead with extraverted Feeling, reading the social environment with precision and working to ensure that everyone feels included, appreciated, and cared for. Their auxiliary Si gives their care a practical, traditional character, connecting them to established ways of maintaining community and honoring what has worked before.",
    "workStyle": "They thrive in collaborative, people-focused environments where they can coordinate, support, and create a sense of shared belonging. They are organized, loyal, and genuinely invested in others' wellbeing, though they can struggle when their contributions are ignored.",
    "stressGrip": "Under grip stress, inferior Ti turns their warmth into cold, faultfinding criticism of both themselves and others."
  },
  "ESTP": {
    "cognitivePortrait": "ESTPs lead with extraverted Sensing, reading situations in real time and responding with sharp tactical instinct and an appetite for immediate impact. Their auxiliary Ti gives them the analytical edge to improvise intelligently rather than merely reactively.",
    "workStyle": "They thrive in fast-moving environments that reward improvisation, salesmanship, and physical or logistical problem-solving. Bureaucracy and hypothetical planning bore them; real-world challenges with visible stakes energize them.",
    "stressGrip": "Under grip stress, inferior Ni produces paranoid, conspiratorial thinking or a sudden, dark sense of meaninglessness beneath their normally confident surface."
  },
  "ESTJ": {
    "cognitivePortrait": "ESTJs lead with extraverted Thinking, organizing people and processes according to clear standards and established methods that have demonstrably worked. Their auxiliary Si anchors them in precedent and tradition, giving their authority a conservative, results-tested quality.",
    "workStyle": "They excel in leadership roles where they can establish order, enforce accountability, and move quickly from plan to execution. Ambiguity, inefficiency, and rule-breaking frustrate them; clear chains of command and measurable outcomes suit them perfectly.",
    "stressGrip": "Under grip stress, inferior Fi surfaces as intense personal hurt, unexpected emotional reactivity, or a sudden crisis of personal identity beneath their normally decisive exterior."
  }
};
