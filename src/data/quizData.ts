import { QuizQuestion } from "@/types/quiz";

export const quizQuestions: QuizQuestion[] = [
  {
    id: 1,
    questionDutch: "Waar in Europa ligt Nederland en met welke landen grenst het?",
    questionEnglish: "Where in Europe is the Netherlands located, and which countries does it border?",
    answerDutch: "Nederland ligt in Noordwest-Europa en grenst aan Duitsland in het oosten en België in het zuiden.",
    answerEnglish: "The Netherlands is located in northwestern Europe and borders Germany to the east and Belgium to the south.",
  },
  // ... Add more questions (first 20 for now, can add more later)
];

export const shuffleQuestions = (questions: QuizQuestion[]): QuizQuestion[] => {
  return [...questions].sort(() => Math.random() - 0.5);
};