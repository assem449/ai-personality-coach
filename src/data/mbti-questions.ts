export interface MBTIQuestion {
  id: number;
  question: string;
  dimension: 'EI' | 'SN' | 'TF' | 'JP';
  optionA: {
    text: string;
    value: 'E' | 'S' | 'T' | 'J';
  };
  optionB: {
    text: string;
    value: 'I' | 'N' | 'F' | 'P';
  };
}

export const mbtiQuestions: MBTIQuestion[] = [
  {
    id: 1,
    question: "How do you prefer to spend your free time?",
    dimension: 'EI',
    optionA: {
      text: "Going out with friends and meeting new people",
      value: 'E'
    },
    optionB: {
      text: "Staying home and enjoying quiet activities",
      value: 'I'
    }
  },
  {
    id: 2,
    question: "When making decisions, do you prefer to:",
    dimension: 'SN',
    optionA: {
      text: "Focus on concrete facts and details",
      value: 'S'
    },
    optionB: {
      text: "Consider possibilities and future implications",
      value: 'N'
    }
  },
  {
    id: 3,
    question: "In conflicts, you tend to:",
    dimension: 'TF',
    optionA: {
      text: "Analyze the situation logically and objectively",
      value: 'T'
    },
    optionB: {
      text: "Consider how people feel and maintain harmony",
      value: 'F'
    }
  },
  {
    id: 4,
    question: "You prefer to:",
    dimension: 'JP',
    optionA: {
      text: "Plan ahead and stick to schedules",
      value: 'J'
    },
    optionB: {
      text: "Keep options open and be spontaneous",
      value: 'P'
    }
  }
];

export function calculateMBTI(answers: Record<string, string>): string {
  const scores = {
    E: 0, I: 0,
    S: 0, N: 0,
    T: 0, F: 0,
    J: 0, P: 0
  };

  // Count answers for each dimension
  Object.values(answers).forEach(answer => {
    if (answer in scores) {
      scores[answer as keyof typeof scores]++;
    }
  });

  // Determine MBTI type
  const type = [
    scores.E > scores.I ? 'E' : 'I',
    scores.S > scores.N ? 'S' : 'N',
    scores.T > scores.F ? 'T' : 'F',
    scores.J > scores.P ? 'J' : 'P'
  ].join('');

  return type;
} 