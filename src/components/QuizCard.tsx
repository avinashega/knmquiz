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

interface ShuffledOption {
  text: string;
  originalIndex: number;
}

export const QuizCard = ({ 
  question, 
  language = 'dutch',
  onNext, 
  onScore, 
  timePerQuestion,
  hideAnswer = false 
}: QuizCardProps) => {
  const [selectedAnswer, setSelectedAnswer] = useState<string | null>(null);
  const [isAnswered, setIsAnswered] = useState(false);
  const [timeLeft, setTimeLeft] = useState(timePerQuestion);
  const [shuffledOptions, setShuffledOptions] = useState<ShuffledOption[]>([]);

  useEffect(() => {
    // Reset timer and shuffle options when question changes
    setTimeLeft(timePerQuestion);
    setSelectedAnswer(null);
    setIsAnswered(false);

    // Shuffle options while maintaining the mapping to correct answer
    const options = language === 'dutch' ? question.optionsDutch : question.optionsEnglish;
    const optionsWithIndex = options.map((text, index) => ({ text, originalIndex: index }));
    const shuffled = [...optionsWithIndex].sort(() => Math.random() - 0.5);
    setShuffledOptions(shuffled);

    const timer = setInterval(() => {
      setTimeLeft((prev) => {
        if (prev <= 1) {
          clearInterval(timer);
          if (!isAnswered) {
            // Mark as answered but with no selection to indicate timeout
            setIsAnswered(true);
            handleNext();
          }
          return 0;
        }
        return prev - 1;
      });
    }, 1000);

    return () => clearInterval(timer);
  }, [question, timePerQuestion]);

  const handleAnswer = (option: ShuffledOption) => {
    if (isAnswered) return;
    setSelectedAnswer(option.text);
    setIsAnswered(true);
    if (option.originalIndex === question.correctOptionIndex) {
      onScore();
    }
  };

  const handleNext = () => {
    setSelectedAnswer(null);
    setIsAnswered(false);
    onNext();
  };

  // Get the appropriate question text based on language
  const questionText = language === 'dutch' ? question.questionDutch : question.questionEnglish;
  const timerProgress = (timeLeft / timePerQuestion) * 100;

  return (
    <div className="bg-white p-6 rounded-lg shadow-md">
      <div className="mb-4 space-y-2">
        <div className="flex justify-between text-sm text-gray-600">
          <span>Resterende tijd: {timeLeft}s</span>
        </div>
        <Progress value={timerProgress} className="h-2" />
      </div>

      <h2 className="text-xl font-bold mb-4">{questionText}</h2>
      <div className="space-y-2">
        {shuffledOptions.map((option) => (
          <button
            key={option.text}
            className={`w-full text-left p-2 rounded-lg ${
              isAnswered && !hideAnswer
                ? option.originalIndex === question.correctOptionIndex
                  ? 'bg-green-500 text-white'
                  : selectedAnswer === option.text
                  ? 'bg-red-500 text-white'
                  : 'bg-gray-200'
                : 'bg-gray-100 hover:bg-gray-200'
            }`}
            onClick={() => handleAnswer(option)}
            disabled={isAnswered}
          >
            {option.text}
          </button>
        ))}
      </div>
    </div>
  );
};