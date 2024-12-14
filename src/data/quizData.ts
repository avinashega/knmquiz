import { QuizQuestion } from "@/types/quiz";

export const quizQuestions: QuizQuestion[] = [
  {
    id: 1,
    questionDutch: "Waar in Europa ligt Nederland en met welke landen grenst het?",
    questionEnglish: "Where in Europe is the Netherlands located, and which countries does it border?",
    answerDutch: "Nederland ligt in Noordwest-Europa en grenst aan Duitsland in het oosten en België in het zuiden.",
    answerEnglish: "The Netherlands is located in northwestern Europe and borders Germany to the east and Belgium to the south.",
    optionsDutch: [
      "Nederland ligt in Noordwest-Europa en grenst aan Duitsland in het oosten en België in het zuiden.",
      "Nederland ligt in Zuid-Europa en grenst aan Frankrijk en Spanje.",
      "Nederland ligt in Oost-Europa en grenst aan Polen en Tsjechië.",
      "Nederland ligt in West-Europa en grenst alleen aan België."
    ],
    optionsEnglish: [
      "The Netherlands is located in northwestern Europe and borders Germany to the east and Belgium to the south.",
      "The Netherlands is located in southern Europe and borders France and Spain.",
      "The Netherlands is located in eastern Europe and borders Poland and the Czech Republic.",
      "The Netherlands is located in western Europe and only borders Belgium."
    ],
    correctOptionIndex: 0
  },
  // Add more questions with their options...
];

export const shuffleQuestions = (questions: QuizQuestion[]): QuizQuestion[] => {
  return [...questions].sort(() => Math.random() - 0.5);
};