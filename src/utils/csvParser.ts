import { QuizQuestion } from "@/types/quiz";

export const parseCSVQuestions = (csvContent: string): QuizQuestion[] => {
  // Skip the header row and filter out empty lines
  const lines = csvContent.split('\n').filter(line => line.trim() && !line.startsWith('question'));
  
  return lines.map((line, index) => {
    const [
      questionDutch,
      questionEnglish,
      option1,
      option2,
      option3,
      option4,
      answer
    ] = line.split('|').map(str => str.trim());

    const optionsDutch = [option1, option2, option3, option4];
    const optionsEnglish = [option1, option2, option3, option4];

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