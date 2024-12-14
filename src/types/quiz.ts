export interface QuizQuestion {
  id: number;
  questionDutch: string;
  questionEnglish: string;
  answerDutch: string;
  answerEnglish: string;
  optionsDutch: string[];
  optionsEnglish: string[];
  correctOptionIndex: number;
}

export interface QuizState {
  currentQuestion: number;
  score: number;
  showAnswer: boolean;
  language: 'dutch' | 'english';
  questions: QuizQuestion[];
}