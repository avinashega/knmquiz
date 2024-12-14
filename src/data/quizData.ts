import { QuizQuestion } from "@/types/quiz";
import { historyQuestions } from "./quiz/history";
import { cultureQuestions } from "./quiz/culture";
import { geographyQuestions } from "./quiz/geography";
import { politicsQuestions } from "./quiz/politics";
import { sportsQuestions } from "./quiz/sports";
import { artQuestions } from "./quiz/art";
import { literatureQuestions } from "./quiz/literature";
import { scienceQuestions } from "./quiz/science";
import { technologyQuestions } from "./quiz/technology";
import { additionalQuestions } from "./quiz/additional";
import { baseQuestions } from "./quiz/base";

export const allQuestions = [
  ...baseQuestions,
  ...historyQuestions,
  ...cultureQuestions,
  ...geographyQuestions,
  ...politicsQuestions,
  ...sportsQuestions,
  ...artQuestions,
  ...literatureQuestions,
  ...scienceQuestions,
  ...technologyQuestions,
  ...additionalQuestions,
];

export const shuffleQuestions = (questions: QuizQuestion[]): QuizQuestion[] => {
  return [...questions].sort(() => Math.random() - 0.5);
};