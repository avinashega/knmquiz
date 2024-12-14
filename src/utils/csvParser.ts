import { QuizQuestion } from "@/types/quiz";

export const parseCSVQuestions = (csvContent: string): QuizQuestion[] => {
  const lines = csvContent.split('\n').filter(line => line.trim());
  
  return lines.map((line, index) => {
    const [
      questionDutch,
      questionEnglish,
      option1Dutch,
      option2Dutch,
      option3Dutch,
      option4Dutch,
      answer
    ] = line.split(',').map(str => str.replace(/^"|"$/g, '').trim());

    // Map Dutch options to English (using the same options for now as they're proper nouns/places)
    const optionsDutch = [option1Dutch, option2Dutch, option3Dutch, option4Dutch];
    const optionsEnglish = [option1Dutch, option2Dutch, option3Dutch, option4Dutch];

    // Determine correct answer index based on the "option1", "option2" etc format
    const correctOptionIndex = parseInt(answer.replace('option', '')) - 1;

    return {
      id: index + 1,
      questionDutch,
      questionEnglish,
      answerDutch: optionsDutch[correctOptionIndex],
      answerEnglish: optionsEnglish[correctOptionIndex],
      optionsDutch,
      optionsEnglish,
      correctOptionIndex
    };
  });
};