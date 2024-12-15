import { useEffect, useState } from "react";
import { QuizQuestion } from "@/types/quiz";
import { Progress } from "@/components/ui/progress";

interface QuizCardProps {
  question: QuizQuestion;
  language: 'dutch' | 'english';
  onNext: () => void;
  onScore: () => void;
  timePerQuestion: number;
  hideAnswer?: boolean;
}

export const QuizCard = ({ 
  question, 
  language, 
  onNext, 
  onScore, 
  timePerQuestion,
  hideAnswer = false 
}: QuizCardProps) => {
  const [selectedAnswer, setSelectedAnswer] = useState<string | null>(null);
  const [isAnswered, setIsAnswered] = useState(false);
  const [timeLeft, setTimeLeft] = useState(timePerQuestion);

  useEffect(() => {
    // Reset timer when question changes
    setTimeLeft(timePerQuestion);
    setSelectedAnswer(null);
    setIsAnswered(false);

    const timer = setInterval(() => {
      setTimeLeft((prev) => {
        if (prev <= 1) {
          clearInterval(timer);
          if (!isAnswered) {
            handleNext();
          }
          return 0;
        }
        return prev - 1;
      });
    }, 1000);

    return () => clearInterval(timer);
  }, [question, timePerQuestion]);

  const handleAnswer = (answer: string) => {
    if (isAnswered) return;
    setSelectedAnswer(answer);
    setIsAnswered(true);
    const correctAnswer = question.optionsEnglish[question.correctOptionIndex];
    if (answer === correctAnswer) {
      onScore();
    }
  };

  const handleNext = () => {
    setSelectedAnswer(null);
    setIsAnswered(false);
    onNext();
  };

  // Get the appropriate question text and options based on language
  const questionText = language === 'dutch' ? question.questionDutch : question.questionEnglish;
  const options = language === 'dutch' ? question.optionsDutch : question.optionsEnglish;
  const correctAnswer = question.optionsEnglish[question.correctOptionIndex];

  const timerProgress = (timeLeft / timePerQuestion) * 100;

  return (
    <div className="bg-white p-6 rounded-lg shadow-md">
      <div className="mb-4 space-y-2">
        <div className="flex justify-between text-sm text-gray-600">
          <span>Time remaining: {timeLeft}s</span>
        </div>
        <Progress value={timerProgress} className="h-2" />
      </div>

      <h2 className="text-xl font-bold mb-4">{questionText}</h2>
      <div className="space-y-2">
        {options.map((answer) => (
          <button
            key={answer}
            className={`w-full text-left p-2 rounded-lg ${
              isAnswered && !hideAnswer
                ? answer === options[question.correctOptionIndex]
                  ? 'bg-green-500 text-white'
                  : selectedAnswer === answer
                  ? 'bg-red-500 text-white'
                  : 'bg-gray-200'
                : 'bg-gray-100 hover:bg-gray-200'
            }`}
            onClick={() => handleAnswer(answer)}
            disabled={isAnswered}
          >
            {answer}
          </button>
        ))}
      </div>
    </div>
  );
};