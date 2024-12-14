import { QuizQuestion } from "@/types/quiz";

export const historyQuestions: QuizQuestion[] = [
  {
    id: 11,
    questionDutch: "Wanneer werd Nederland een koninkrijk?",
    questionEnglish: "When did the Netherlands become a kingdom?",
    answerDutch: "Nederland werd een koninkrijk in 1815 onder Willem I.",
    answerEnglish: "The Netherlands became a kingdom in 1815 under William I.",
    optionsDutch: [
      "1815",
      "1789",
      "1848",
      "1900"
    ],
    optionsEnglish: [
      "1815",
      "1789",
      "1848",
      "1900"
    ],
    correctOptionIndex: 0
  },
  {
    id: 12,
    questionDutch: "Wat was de Nederlandse Gouden Eeuw?",
    questionEnglish: "What was the Dutch Golden Age?",
    answerDutch: "De 17e eeuw, toen Nederland een wereldmacht was in handel en kunst.",
    answerEnglish: "The 17th century, when the Netherlands was a world power in trade and art.",
    optionsDutch: [
      "De 17e eeuw",
      "De 16e eeuw",
      "De 18e eeuw",
      "De 19e eeuw"
    ],
    optionsEnglish: [
      "The 17th century",
      "The 16th century",
      "The 18th century",
      "The 19th century"
    ],
    correctOptionIndex: 0
  },
  // ... Add 8 more history questions
];