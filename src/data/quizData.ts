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
  {
    id: 2,
    questionDutch: "Hoeveel provincies heeft Nederland en kun je er een paar noemen?",
    questionEnglish: "How many provinces does the Netherlands have, and can you name a few?",
    answerDutch: "Nederland heeft 12 provincies, zoals Noord-Holland, Zuid-Holland en Utrecht.",
    answerEnglish: "The Netherlands has 12 provinces, such as North Holland, South Holland, and Utrecht.",
    optionsDutch: [
      "Nederland heeft 12 provincies, zoals Noord-Holland, Zuid-Holland en Utrecht.",
      "Nederland heeft 10 provincies, zoals Brabant en Limburg.",
      "Nederland heeft 8 provincies, waaronder Amsterdam en Rotterdam.",
      "Nederland heeft 15 provincies, inclusief Vlaanderen."
    ],
    optionsEnglish: [
      "The Netherlands has 12 provinces, such as North Holland, South Holland, and Utrecht.",
      "The Netherlands has 10 provinces, such as Brabant and Limburg.",
      "The Netherlands has 8 provinces, including Amsterdam and Rotterdam.",
      "The Netherlands has 15 provinces, including Flanders."
    ],
    correctOptionIndex: 0
  },
  {
    id: 3,
    questionDutch: "Wat is de hoofdstad van Nederland en wat is de regeringszetel?",
    questionEnglish: "What is the capital of the Netherlands and where is the seat of government?",
    answerDutch: "De hoofdstad is Amsterdam, maar de regering zit in Den Haag.",
    answerEnglish: "The capital is Amsterdam, but the government is seated in The Hague.",
    optionsDutch: [
      "De hoofdstad is Amsterdam, maar de regering zit in Den Haag.",
      "De hoofdstad is Den Haag, waar ook de regering zit.",
      "De hoofdstad is Rotterdam, maar de regering zit in Amsterdam.",
      "De hoofdstad en regeringszetel zijn beide in Utrecht."
    ],
    optionsEnglish: [
      "The capital is Amsterdam, but the government is seated in The Hague.",
      "The capital is The Hague, where the government is also seated.",
      "The capital is Rotterdam, but the government is in Amsterdam.",
      "Both the capital and seat of government are in Utrecht."
    ],
    correctOptionIndex: 0
  },
  // ... Add more questions following the same pattern
];

export const shuffleQuestions = (questions: QuizQuestion[]): QuizQuestion[] => {
  return [...questions].sort(() => Math.random() - 0.5);
};