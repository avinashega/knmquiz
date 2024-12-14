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

export const baseQuestions: QuizQuestion[] = [
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
  {
    id: 4,
    questionDutch: "Wat is de nationale bloem van Nederland?",
    questionEnglish: "What is the national flower of the Netherlands?",
    answerDutch: "De tulp is het nationale bloem symbool van Nederland.",
    answerEnglish: "The tulip is the national flower symbol of the Netherlands.",
    optionsDutch: [
      "De tulp",
      "De roos",
      "De lelie",
      "De zonnebloem"
    ],
    optionsEnglish: [
      "The tulip",
      "The rose",
      "The lily",
      "The sunflower"
    ],
    correctOptionIndex: 0
  },
  {
    id: 5,
    questionDutch: "Wanneer is Koningsdag in Nederland?",
    questionEnglish: "When is King's Day in the Netherlands?",
    answerDutch: "Koningsdag wordt gevierd op 27 april, de verjaardag van Koning Willem-Alexander.",
    answerEnglish: "King's Day is celebrated on April 27th, King Willem-Alexander's birthday.",
    optionsDutch: [
      "27 april",
      "30 april",
      "5 mei",
      "31 augustus"
    ],
    optionsEnglish: [
      "April 27th",
      "April 30th",
      "May 5th",
      "August 31st"
    ],
    correctOptionIndex: 0
  },
  {
    id: 6,
    questionDutch: "Wat is de hoogste berg van Nederland?",
    questionEnglish: "What is the highest point in the Netherlands?",
    answerDutch: "De Vaalserberg in Limburg is met 322,7 meter het hoogste punt van Nederland.",
    answerEnglish: "The Vaalserberg in Limburg is the highest point in the Netherlands at 322.7 meters.",
    optionsDutch: [
      "De Vaalserberg",
      "De Zugspitze",
      "De Mont Blanc",
      "De Kilimanjaro"
    ],
    optionsEnglish: [
      "The Vaalserberg",
      "The Zugspitze",
      "The Mont Blanc",
      "The Kilimanjaro"
    ],
    correctOptionIndex: 0
  },
  {
    id: 7,
    questionDutch: "Welk percentage van Nederland ligt onder zeeniveau?",
    questionEnglish: "What percentage of the Netherlands lies below sea level?",
    answerDutch: "Ongeveer 26% van Nederland ligt onder zeeniveau.",
    answerEnglish: "Approximately 26% of the Netherlands lies below sea level.",
    optionsDutch: [
      "26%",
      "50%",
      "75%",
      "10%"
    ],
    optionsEnglish: [
      "26%",
      "50%",
      "75%",
      "10%"
    ],
    correctOptionIndex: 0
  },
  {
    id: 8,
    questionDutch: "Wat is de grootste haven van Europa?",
    questionEnglish: "What is the largest port in Europe?",
    answerDutch: "De haven van Rotterdam is de grootste haven van Europa.",
    answerEnglish: "The Port of Rotterdam is the largest port in Europe.",
    optionsDutch: [
      "Rotterdam",
      "Amsterdam",
      "Antwerpen",
      "Hamburg"
    ],
    optionsEnglish: [
      "Rotterdam",
      "Amsterdam",
      "Antwerp",
      "Hamburg"
    ],
    correctOptionIndex: 0
  },
  {
    id: 9,
    questionDutch: "Welke Nederlandse schilder sneed zijn eigen oor af?",
    questionEnglish: "Which Dutch painter cut off his own ear?",
    answerDutch: "Vincent van Gogh sneed een deel van zijn oor af tijdens een psychische crisis.",
    answerEnglish: "Vincent van Gogh cut off part of his ear during a mental health crisis.",
    optionsDutch: [
      "Vincent van Gogh",
      "Rembrandt van Rijn",
      "Johannes Vermeer",
      "Piet Mondriaan"
    ],
    optionsEnglish: [
      "Vincent van Gogh",
      "Rembrandt van Rijn",
      "Johannes Vermeer",
      "Piet Mondrian"
    ],
    correctOptionIndex: 0
  },
  {
    id: 10,
    questionDutch: "Wat is de nationale sport van Nederland?",
    questionEnglish: "What is the national sport of the Netherlands?",
    answerDutch: "Voetbal wordt beschouwd als de nationale sport van Nederland.",
    answerEnglish: "Football (soccer) is considered the national sport of the Netherlands.",
    optionsDutch: [
      "Voetbal",
      "Hockey",
      "Schaatsen",
      "Volleybal"
    ],
    optionsEnglish: [
      "Football (soccer)",
      "Hockey",
      "Ice skating",
      "Volleyball"
    ],
    correctOptionIndex: 0
  }
];

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
];

export const shuffleQuestions = (questions: QuizQuestion[]): QuizQuestion[] => {
  return [...questions].sort(() => Math.random() - 0.5);
};
