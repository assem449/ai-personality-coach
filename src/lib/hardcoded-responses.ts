export interface HardcodedRecommendations {
  habits: Array<{ 
    title: string; 
    description: string; 
    category: string;
    frequency: string;
    goal: number;
    reasoning: string;
  }>;
  careerPaths: Array<{ 
    title: string; 
    description: string; 
    skills: string[];
    growthPotential: string;
    workStyle: string;
    reasoning: string;
  }>;
}

export interface HardcodedMBTIInsights {
  careers: string[];
  habits: string[];
  motivationTip: string;
  strengths: string[];
  challenges: string[];
  learningStyle: string;
}

// Comprehensive hardcoded recommendations for all MBTI types
export const HARDCODED_RECOMMENDATIONS: Record<string, HardcodedRecommendations> = {
  'INTJ': {
    habits: [
      { title: 'Strategic Planning Sessions', description: 'Dedicate 30 minutes daily to long-term planning and goal setting, which aligns with your natural strategic thinking.' },
      { title: 'Knowledge Deep-Dive', description: 'Spend time each day learning about a complex topic that interests you, leveraging your analytical nature.' },
      { title: 'Independent Reflection', description: 'Set aside quiet time for deep thinking and self-analysis, which helps you process information effectively.' }
    ],
    careerPaths: [
      { title: 'Strategic Consultant', description: 'Your analytical mind and ability to see big-picture strategies make you excellent at helping organizations plan for the future.' },
      { title: 'Research Scientist', description: 'Your love for complex problems and independent work style is perfect for scientific research and discovery.' },
      { title: 'Systems Architect', description: 'Your ability to design efficient, logical systems aligns perfectly with creating complex technical architectures.' }
    ]
  },
  'INTP': {
    habits: [
      { title: 'Problem-Solving Time', description: 'Dedicate time each day to solving complex puzzles or theoretical problems that engage your logical mind.' },
      { title: 'Knowledge Exploration', description: 'Follow your curiosity by researching new topics daily, which satisfies your thirst for understanding.' },
      { title: 'Creative Thinking Sessions', description: 'Allow yourself unstructured time to explore ideas and theories without pressure.' }
    ],
    careerPaths: [
      { title: 'Software Engineer', description: 'Your logical thinking and love for solving complex problems makes you excellent at programming and system design.' },
      { title: 'Philosopher/Academic', description: 'Your deep thinking and love for theoretical exploration is perfect for academic research and philosophical inquiry.' },
      { title: 'Data Scientist', description: 'Your analytical skills and ability to find patterns in complex data sets is ideal for data analysis and machine learning.' }
    ]
  },
  'ENTJ': {
    habits: [
      { title: 'Leadership Development', description: 'Practice decision-making and leadership skills daily through planning and organizing activities.' },
      { title: 'Goal Achievement Tracking', description: 'Set ambitious goals and track your progress systematically, which fuels your drive for success.' },
      { title: 'Strategic Networking', description: 'Build and maintain professional relationships that can help you achieve your long-term objectives.' }
    ],
    careerPaths: [
      { title: 'Executive/CEO', description: 'Your natural leadership abilities and strategic thinking make you excellent at running organizations and companies.' },
      { title: 'Management Consultant', description: 'Your ability to analyze problems and implement solutions is perfect for helping businesses improve.' },
      { title: 'Entrepreneur', description: 'Your drive, vision, and ability to execute make you well-suited for starting and growing your own business.' }
    ]
  },
  'ENTP': {
    habits: [
      { 
        title: 'Creative Problem Solving', 
        description: 'Challenge yourself with new problems daily to keep your innovative mind engaged and stimulated.',
        category: 'Productivity',
        frequency: 'Daily',
        goal: 1,
        reasoning: 'Your innovative thinking thrives on solving complex problems and finding creative solutions.'
      },
      { 
        title: 'Knowledge Synthesis', 
        description: 'Connect ideas from different fields to create new insights and solutions.',
        category: 'Learning',
        frequency: 'Weekly',
        goal: 3,
        reasoning: 'Your ability to see connections between different domains is a key strength.'
      },
      { 
        title: 'Adaptive Learning', 
        description: 'Embrace change and learn new skills regularly to satisfy your curiosity and adaptability.',
        category: 'Growth',
        frequency: 'Weekly',
        goal: 2,
        reasoning: 'Your adaptability and curiosity drive you to constantly learn and evolve.'
      }
    ],
    careerPaths: [
      { 
        title: 'Innovation Consultant', 
        description: 'Your ability to see possibilities and generate creative solutions makes you excellent at driving innovation.',
        skills: ['Strategic Thinking', 'Problem Solving', 'Communication', 'Innovation'],
        growthPotential: 'High',
        workStyle: 'Dynamic and collaborative',
        reasoning: 'Your natural ability to see possibilities and generate creative solutions aligns perfectly with innovation consulting.'
      },
      { 
        title: 'Entrepreneur/Startup Founder', 
        description: 'Your adaptability and ability to pivot quickly are perfect for the dynamic startup environment.',
        skills: ['Leadership', 'Risk Management', 'Adaptability', 'Vision'],
        growthPotential: 'Very High',
        workStyle: 'Autonomous and fast-paced',
        reasoning: 'Your adaptability and ability to think on your feet make you ideal for the startup world.'
      },
      { 
        title: 'Product Manager', 
        description: 'Your strategic thinking and ability to understand multiple perspectives help you create successful products.',
        skills: ['Product Strategy', 'User Research', 'Cross-functional Leadership', 'Analytics'],
        growthPotential: 'High',
        workStyle: 'Collaborative and strategic',
        reasoning: 'Your ability to understand multiple perspectives and think strategically is perfect for product management.'
      }
    ]
  },
  'INFJ': {
    habits: [
      { title: 'Creative Expression', description: 'Dedicate time to writing, art, or other creative pursuits that allow you to express your inner vision.' },
      { title: 'Deep Listening Practice', description: 'Practice active listening and empathy to strengthen your natural ability to understand others.' },
      { title: 'Personal Growth Reflection', description: 'Regularly reflect on your values and how you can make a positive impact on the world.' }
    ],
    careerPaths: [
      { title: 'Counselor/Therapist', description: 'Your empathy and insight into human nature make you excellent at helping others heal and grow.' },
      { title: 'Writer/Author', description: 'Your ability to understand complex human emotions and express them beautifully is perfect for creative writing.' },
      { title: 'Humanitarian Worker', description: 'Your desire to make a difference and help others aligns perfectly with humanitarian and social work.' }
    ]
  },
  'INFP': {
    habits: [
      { title: 'Creative Writing', description: 'Express your thoughts and feelings through writing, which helps you process your rich inner world.' },
      { title: 'Values-Based Decision Making', description: 'Make decisions based on your core values and what feels authentic to you.' },
      { title: 'Empathy Practice', description: 'Connect with others on a deep level and practice understanding different perspectives.' }
    ],
    careerPaths: [
      { title: 'Creative Professional', description: 'Your imagination and ability to express emotions make you excellent in creative fields like writing, art, or design.' },
      { title: 'Social Worker', description: 'Your empathy and desire to help others make you perfect for supporting people in need.' },
      { title: 'Teacher/Educator', description: 'Your patience and ability to inspire others make you excellent at teaching and mentoring.' }
    ]
  },
  'ENFJ': {
    habits: [
      { title: 'Relationship Building', description: 'Invest time in building and maintaining meaningful relationships with others.' },
      { title: 'Leadership Development', description: 'Practice inspiring and motivating others to achieve their goals.' },
      { title: 'Community Involvement', description: 'Get involved in community activities that allow you to make a positive impact.' }
    ],
    careerPaths: [
      { title: 'Human Resources Manager', description: 'Your ability to understand and motivate people makes you excellent at managing teams and organizational culture.' },
      { title: 'Teacher/Professor', description: 'Your passion for helping others learn and grow is perfect for education.' },
      { title: 'Non-profit Director', description: 'Your desire to make a difference and ability to inspire others is ideal for leading charitable organizations.' }
    ]
  },
  'ENFP': {
    habits: [
      { title: 'Creative Exploration', description: 'Allow yourself to explore new ideas and possibilities without feeling constrained.' },
      { title: 'Social Connection', description: 'Maintain meaningful relationships and seek out new connections that inspire you.' },
      { title: 'Passion Pursuit', description: 'Follow your interests and passions, even if they change frequently.' }
    ],
    careerPaths: [
      { title: 'Creative Director', description: 'Your imagination and ability to inspire others make you excellent at leading creative projects.' },
      { title: 'Marketing Specialist', description: 'Your ability to connect with people and generate enthusiasm is perfect for marketing and communications.' },
      { title: 'Life Coach', description: 'Your optimism and ability to see potential in others make you excellent at helping people achieve their dreams.' }
    ]
  },
  'ISTJ': {
    habits: [
      { title: 'Routine Establishment', description: 'Create and maintain consistent daily routines that help you stay organized and productive.' },
      { title: 'Detail Management', description: 'Practice paying attention to details and maintaining high standards in your work.' },
      { title: 'Reliability Building', description: 'Focus on being dependable and following through on your commitments.' }
    ],
    careerPaths: [
      { title: 'Project Manager', description: 'Your organizational skills and attention to detail make you excellent at managing complex projects.' },
      { title: 'Accountant/Financial Analyst', description: 'Your precision and reliability are perfect for financial and analytical roles.' },
      { title: 'Quality Assurance Specialist', description: 'Your attention to detail and commitment to standards make you excellent at ensuring quality.' }
    ]
  },
  'ISFJ': {
    habits: [
      { title: 'Service to Others', description: 'Find ways to help and support others in your daily life.' },
      { title: 'Practical Skill Development', description: 'Learn and practice practical skills that can help you and others.' },
      { title: 'Memory and Tradition', description: 'Preserve important memories and traditions that are meaningful to you and your community.' }
    ],
    careerPaths: [
      { title: 'Healthcare Professional', description: 'Your caring nature and attention to detail make you excellent in healthcare roles.' },
      { title: 'Administrative Assistant', description: 'Your organizational skills and desire to help others are perfect for administrative support.' },
      { title: 'Customer Service Manager', description: 'Your patience and ability to understand others\' needs make you excellent at customer service.' }
    ]
  },
  'ESTJ': {
    habits: [
      { title: 'Goal Setting and Achievement', description: 'Set clear, achievable goals and work systematically toward them.' },
      { title: 'Leadership Practice', description: 'Take on leadership roles and practice making decisions and organizing others.' },
      { title: 'Efficiency Optimization', description: 'Look for ways to improve processes and make things more efficient.' }
    ],
    careerPaths: [
      { title: 'Business Manager', description: 'Your organizational skills and ability to get things done make you excellent at managing businesses.' },
      { title: 'Military Officer', description: 'Your leadership abilities and respect for structure are perfect for military or law enforcement roles.' },
      { title: 'Operations Manager', description: 'Your ability to organize and optimize processes makes you excellent at operations management.' }
    ]
  },
  'ESFJ': {
    habits: [
      { title: 'Community Building', description: 'Create and maintain strong community connections and support networks.' },
      { title: 'Caregiving Practice', description: 'Find ways to care for and support others in your daily life.' },
      { title: 'Tradition Preservation', description: 'Maintain and celebrate traditions that bring people together.' }
    ],
    careerPaths: [
      { title: 'Nurse/Healthcare Worker', description: 'Your caring nature and practical skills make you excellent in healthcare.' },
      { title: 'Event Planner', description: 'Your organizational skills and ability to bring people together are perfect for event planning.' },
      { title: 'Sales Representative', description: 'Your people skills and ability to build relationships make you excellent at sales.' }
    ]
  },
  'ISTP': {
    habits: [
      { title: 'Hands-on Learning', description: 'Learn new skills through direct experience and practice.' },
      { title: 'Problem Solving', description: 'Tackle practical problems and find efficient solutions.' },
      { title: 'Adaptability Practice', description: 'Stay flexible and adapt to changing situations as they arise.' }
    ],
    careerPaths: [
      { title: 'Mechanic/Technician', description: 'Your practical skills and problem-solving abilities make you excellent at technical work.' },
      { title: 'Emergency Responder', description: 'Your ability to stay calm under pressure and solve problems quickly is perfect for emergency services.' },
      { title: 'Pilot/Aviator', description: 'Your technical skills and ability to handle complex systems make you excellent at flying.' }
    ]
  },
  'ISFP': {
    habits: [
      { title: 'Creative Expression', description: 'Express yourself through art, music, or other creative outlets.' },
      { title: 'Sensory Awareness', description: 'Pay attention to your senses and appreciate beauty in your surroundings.' },
      { title: 'Harmony Maintenance', description: 'Work to maintain peace and harmony in your relationships and environment.' }
    ],
    careerPaths: [
      { title: 'Artist/Designer', description: 'Your creativity and appreciation for beauty make you excellent in artistic and design fields.' },
      { title: 'Interior Designer', description: 'Your eye for aesthetics and ability to create harmonious spaces is perfect for interior design.' },
      { title: 'Massage Therapist', description: 'Your gentle nature and desire to help others feel good make you excellent at therapeutic work.' }
    ]
  },
  'ESTP': {
    habits: [
      { title: 'Action-Oriented Learning', description: 'Learn through doing and taking action rather than just reading or thinking.' },
      { title: 'Risk Assessment', description: 'Practice evaluating risks and opportunities in real-time situations.' },
      { title: 'Social Networking', description: 'Build and maintain a wide network of contacts and relationships.' }
    ],
    careerPaths: [
      { title: 'Entrepreneur', description: 'Your ability to spot opportunities and take action makes you excellent at starting businesses.' },
      { title: 'Sales Professional', description: 'Your people skills and ability to think on your feet are perfect for sales.' },
      { title: 'Athlete/Sports Professional', description: 'Your physical skills and competitive nature make you excellent in sports and athletics.' }
    ]
  },
  'ESFP': {
    habits: [
      { title: 'Social Connection', description: 'Maintain active social connections and enjoy time with friends and family.' },
      { title: 'Present Moment Awareness', description: 'Focus on enjoying and making the most of the present moment.' },
      { title: 'Helping Others', description: 'Find ways to help and support others in practical, hands-on ways.' }
    ],
    careerPaths: [
      { title: 'Entertainment Professional', description: 'Your outgoing nature and ability to entertain others make you excellent in entertainment.' },
      { title: 'Customer Service Representative', description: 'Your people skills and desire to help others are perfect for customer service.' },
      { title: 'Tour Guide', description: 'Your enthusiasm and ability to connect with people make you excellent at guiding and teaching others.' }
    ]
  }
};

// Comprehensive hardcoded MBTI insights
export const HARDCODED_MBTI_INSIGHTS: Record<string, HardcodedMBTIInsights> = {
  'ENTP': {
    careers: ['Innovation Consultant', 'Entrepreneur/Startup Founder', 'Product Manager'],
    habits: ['Creative Problem Solving', 'Knowledge Synthesis', 'Adaptive Learning'],
    motivationTip: 'Embrace your natural curiosity and use it to explore new possibilities. Your adaptability is your superpower.',
    strengths: ['Innovative thinking', 'Quick problem solving', 'Adaptability'],
    challenges: ['Following through on projects', 'Maintaining focus', 'Overthinking'],
    learningStyle: 'Learn best through hands-on experimentation and connecting ideas from different fields.'
  },
  'INTJ': {
    careers: ['Strategic Consultant', 'Research Scientist', 'Systems Architect'],
    habits: ['Strategic Planning', 'Knowledge Deep-Dive', 'Independent Reflection'],
    motivationTip: 'Focus on your long-term vision and use your strategic thinking to achieve your goals systematically.',
    strengths: ['Strategic thinking', 'Analytical skills', 'Independence'],
    challenges: ['Social interactions', 'Flexibility', 'Expressing emotions'],
    learningStyle: 'Learn best through independent study and understanding complex systems.'
  },
  'INFJ': {
    careers: ['Counselor/Therapist', 'Writer/Author', 'Humanitarian Worker'],
    habits: ['Creative Expression', 'Deep Listening', 'Personal Growth Reflection'],
    motivationTip: 'Use your empathy and insight to help others while staying true to your values and vision.',
    strengths: ['Empathy', 'Insight', 'Creativity'],
    challenges: ['Setting boundaries', 'Practical details', 'Self-care'],
    learningStyle: 'Learn best through meaningful connections and understanding underlying principles.'
  },
  'INFP': {
    careers: ['Creative Professional', 'Social Worker', 'Teacher/Educator'],
    habits: ['Creative Writing', 'Values-Based Decision Making', 'Empathy Practice'],
    motivationTip: 'Stay true to your values and use your creativity to make a positive impact on the world.',
    strengths: ['Creativity', 'Empathy', 'Authenticity'],
    challenges: ['Practical planning', 'Setting boundaries', 'Self-doubt'],
    learningStyle: 'Learn best through creative expression and personal connection to the material.'
  },
  'ENFJ': {
    careers: ['Human Resources Manager', 'Teacher/Professor', 'Non-profit Director'],
    habits: ['Relationship Building', 'Leadership Development', 'Community Involvement'],
    motivationTip: 'Use your natural ability to inspire and motivate others to create positive change.',
    strengths: ['Leadership', 'Empathy', 'Communication'],
    challenges: ['Taking care of yourself', 'Dealing with criticism', 'Overcommitment'],
    learningStyle: 'Learn best through teaching others and collaborative group activities.'
  },
  'ENFP': {
    careers: ['Creative Director', 'Marketing Specialist', 'Life Coach'],
    habits: ['Creative Exploration', 'Social Connection', 'Passion Pursuit'],
    motivationTip: 'Follow your passions and use your enthusiasm to inspire others to pursue their dreams.',
    strengths: ['Creativity', 'Enthusiasm', 'Adaptability'],
    challenges: ['Focus and follow-through', 'Practical details', 'Overcommitment'],
    learningStyle: 'Learn best through exploration and connecting new ideas to personal interests.'
  },
  'ISTJ': {
    careers: ['Project Manager', 'Accountant/Financial Analyst', 'Quality Assurance Specialist'],
    habits: ['Routine Establishment', 'Detail Management', 'Reliability Building'],
    motivationTip: 'Use your reliability and attention to detail to build trust and achieve consistent results.',
    strengths: ['Reliability', 'Organization', 'Attention to detail'],
    challenges: ['Flexibility', 'Expressing emotions', 'Change management'],
    learningStyle: 'Learn best through structured, step-by-step approaches with practical applications.'
  },
  'ISFJ': {
    careers: ['Healthcare Professional', 'Administrative Assistant', 'Customer Service Manager'],
    habits: ['Service to Others', 'Practical Skill Development', 'Memory and Tradition'],
    motivationTip: 'Use your caring nature and practical skills to help others and create stability.',
    strengths: ['Caring', 'Practical skills', 'Loyalty'],
    challenges: ['Self-care', 'Change', 'Conflict resolution'],
    learningStyle: 'Learn best through hands-on experience and practical, real-world applications.'
  },
  'ESTJ': {
    careers: ['Business Manager', 'Military Officer', 'Operations Manager'],
    habits: ['Goal Setting and Achievement', 'Leadership Practice', 'Efficiency Optimization'],
    motivationTip: 'Use your organizational skills and leadership abilities to create efficient, successful systems.',
    strengths: ['Organization', 'Leadership', 'Efficiency'],
    challenges: ['Flexibility', 'Empathy', 'Patience'],
    learningStyle: 'Learn best through structured, practical approaches with clear goals and outcomes.'
  },
  'ESFJ': {
    careers: ['Nurse/Healthcare Worker', 'Event Planner', 'Sales Representative'],
    habits: ['Community Building', 'Caregiving Practice', 'Tradition Preservation'],
    motivationTip: 'Use your people skills and caring nature to build strong communities and help others.',
    strengths: ['People skills', 'Caring', 'Organization'],
    challenges: ['Conflict', 'Change', 'Self-care'],
    learningStyle: 'Learn best through social interaction and practical, hands-on experience.'
  },
  'ISTP': {
    careers: ['Mechanic/Technician', 'Emergency Responder', 'Pilot/Aviator'],
    habits: ['Hands-on Learning', 'Problem Solving', 'Adaptability Practice'],
    motivationTip: 'Use your practical skills and problem-solving abilities to tackle real-world challenges.',
    strengths: ['Practical skills', 'Problem solving', 'Adaptability'],
    challenges: ['Long-term planning', 'Emotional expression', 'Commitment'],
    learningStyle: 'Learn best through hands-on experience and solving practical problems.'
  },
  'ISFP': {
    careers: ['Artist/Designer', 'Interior Designer', 'Massage Therapist'],
    habits: ['Creative Expression', 'Sensory Awareness', 'Harmony Maintenance'],
    motivationTip: 'Use your creativity and sensitivity to create beauty and harmony in the world.',
    strengths: ['Creativity', 'Sensitivity', 'Harmony'],
    challenges: ['Planning', 'Conflict', 'Self-promotion'],
    learningStyle: 'Learn best through creative expression and sensory, hands-on experiences.'
  },
  'ESTP': {
    careers: ['Entrepreneur', 'Sales Professional', 'Athlete/Sports Professional'],
    habits: ['Action-Oriented Learning', 'Risk Assessment', 'Social Networking'],
    motivationTip: 'Use your action-oriented nature and people skills to seize opportunities and achieve success.',
    strengths: ['Action-oriented', 'People skills', 'Risk-taking'],
    challenges: ['Planning', 'Patience', 'Follow-through'],
    learningStyle: 'Learn best through action and hands-on experience in real-world situations.'
  },
  'ESFP': {
    careers: ['Entertainment Professional', 'Customer Service Representative', 'Tour Guide'],
    habits: ['Social Connection', 'Present Moment Awareness', 'Helping Others'],
    motivationTip: 'Use your enthusiasm and people skills to bring joy and help others enjoy life.',
    strengths: ['Enthusiasm', 'People skills', 'Practicality'],
    challenges: ['Planning', 'Focus', 'Conflict'],
    learningStyle: 'Learn best through social interaction and hands-on, practical experience.'
  },
  'INTP': {
    careers: ['Software Engineer', 'Philosopher/Academic', 'Data Scientist'],
    habits: ['Problem-Solving Time', 'Knowledge Exploration', 'Creative Thinking Sessions'],
    motivationTip: 'Use your analytical mind and curiosity to solve complex problems and explore new ideas.',
    strengths: ['Analytical thinking', 'Curiosity', 'Independence'],
    challenges: ['Social interaction', 'Practical application', 'Emotional expression'],
    learningStyle: 'Learn best through independent study and understanding theoretical concepts.'
  },
  'ENTJ': {
    careers: ['Executive/CEO', 'Management Consultant', 'Entrepreneur'],
    habits: ['Leadership Development', 'Goal Achievement Tracking', 'Strategic Networking'],
    motivationTip: 'Use your leadership abilities and strategic thinking to achieve ambitious goals and inspire others.',
    strengths: ['Leadership', 'Strategic thinking', 'Efficiency'],
    challenges: ['Patience', 'Empathy', 'Flexibility'],
    learningStyle: 'Learn best through strategic planning and understanding systems and structures.'
  }
};

// Default fallback for unknown MBTI types
export const DEFAULT_RECOMMENDATIONS: HardcodedRecommendations = {
  habits: [
    { 
      title: 'Daily Reflection', 
      description: 'Take time each day to reflect on your experiences and personal growth.',
      category: 'Wellness',
      frequency: 'Daily',
      goal: 1,
      reasoning: 'Regular reflection helps you understand yourself better and track your personal growth.'
    },
    { 
      title: 'Goal Setting', 
      description: 'Set clear, achievable goals that align with your values and personality.',
      category: 'Productivity',
      frequency: 'Weekly',
      goal: 3,
      reasoning: 'Clear goals provide direction and motivation for your personal development journey.'
    },
    { 
      title: 'Learning Time', 
      description: 'Dedicate time to learning something new that interests you.',
      category: 'Learning',
      frequency: 'Weekly',
      goal: 2,
      reasoning: 'Continuous learning keeps your mind engaged and helps you grow personally and professionally.'
    }
  ],
  careerPaths: [
    { 
      title: 'Personal Development', 
      description: 'Focus on roles that allow you to grow and develop your unique strengths.',
      skills: ['Self-Awareness', 'Growth Mindset', 'Adaptability', 'Communication'],
      growthPotential: 'High',
      workStyle: 'Flexible and growth-oriented',
      reasoning: 'Roles that emphasize personal development align with your desire for growth and self-improvement.'
    },
    { 
      title: 'Creative Expression', 
      description: 'Consider careers that let you express your creativity and individuality.',
      skills: ['Creativity', 'Innovation', 'Self-Expression', 'Problem Solving'],
      growthPotential: 'High',
      workStyle: 'Creative and autonomous',
      reasoning: 'Creative roles allow you to express your unique perspective and innovative thinking.'
    },
    { 
      title: 'Helping Others', 
      description: 'Look for opportunities to help others while using your natural talents.',
      skills: ['Empathy', 'Communication', 'Problem Solving', 'Patience'],
      growthPotential: 'Medium',
      workStyle: 'Collaborative and service-oriented',
      reasoning: 'Helping others provides meaningful work that aligns with your values and strengths.'
    }
  ]
};

export const DEFAULT_MBTI_INSIGHTS: HardcodedMBTIInsights = {
  careers: ['Career Counselor', 'Human Resources', 'Personal Development Coach'],
  habits: ['Daily reflection', 'Goal setting', 'Regular self-assessment'],
  motivationTip: 'Focus on your unique strengths and use them to overcome challenges.',
  strengths: ['Self-awareness', 'Empathy', 'Growth mindset'],
  challenges: ['Overthinking', 'Perfectionism', 'Self-doubt'],
  learningStyle: 'Learn best through hands-on experience and personal reflection.'
};

// Helper functions
export function getHardcodedRecommendations(mbtiType: string): HardcodedRecommendations {
  return HARDCODED_RECOMMENDATIONS[mbtiType] || DEFAULT_RECOMMENDATIONS;
}

export function getHardcodedMBTIInsights(mbtiType: string): HardcodedMBTIInsights {
  return HARDCODED_MBTI_INSIGHTS[mbtiType] || DEFAULT_MBTI_INSIGHTS;
} 