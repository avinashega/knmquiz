export interface QuizQuestion {
  id: number;
  questionDutch: string;
  questionEnglish: string;
  answerDutch: string;
  answerEnglish: string;
}

export interface QuizState {
  currentQuestion: number;
  score: number;
  showAnswer: boolean;
  language: 'dutch' | 'english';
  questions: QuizQuestion[];
}