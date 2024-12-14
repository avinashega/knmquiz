import { QuizQuestion } from "@/types/quiz";
import csvData from './quiz-data.csv?raw';
import { parseCSVQuestions } from "@/utils/csvParser";

export const allQuestions = parseCSVQuestions(csvData);

export const shuffleQuestions = (questions: QuizQuestion[]): QuizQuestion[] => {
  return [...questions].sort(() => Math.random() - 0.5);
};