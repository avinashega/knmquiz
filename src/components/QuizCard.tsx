import { useEffect, useState } from "react";
import { QuizQuestion } from "@/types/quiz";

interface QuizCardProps {
  question: QuizQuestion;
  language: 'dutch' | 'english';
  onNext: () => void;
  onScore: () => void;
  hideAnswer?: boolean;
}

export const QuizCard = ({ question, language, onNext, onScore, hideAnswer = false }: QuizCardProps) => {
  const [selectedAnswer, setSelectedAnswer] = useState<string | null>(null);
  const [isAnswered, setIsAnswered] = useState(false);

  const handleAnswer = (answer: string) => {
    setSelectedAnswer(answer);
    setIsAnswered(true);
    if (answer === question.correct_answer) {
      onScore();
    }
  };

  const handleNext = () => {
    setSelectedAnswer(null);
    setIsAnswered(false);
    onNext();
  };

  return (
    <div className="bg-white p-6 rounded-lg shadow-md">
      <h2 className="text-xl font-bold mb-4">{question.question}</h2>
      <div className="space-y-2">
        {question.answers.map((answer) => (
          <button
            key={answer}
            className={`w-full text-left p-2 rounded-lg ${isAnswered ? (answer === question.correct_answer ? 'bg-green-500 text-white' : (selectedAnswer === answer ? 'bg-red-500 text-white' : 'bg-gray-200')) : 'bg-gray-100 hover:bg-gray-200'}`}
            onClick={() => handleAnswer(answer)}
            disabled={isAnswered}
          >
            {answer}
          </button>
        ))}
      </div>
      {isAnswered && (
        <div className="mt-4">
          <button className="bg-blue-500 text-white px-4 py-2 rounded" onClick={handleNext}>
            Next Question
          </button>
        </div>
      )}
    </div>
  );
};
