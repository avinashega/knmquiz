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
  onAnswer?: (answer: { questionId: number; selectedOptionIndex: number; correct: boolean }) => void;
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
  hideAnswer = false,
  onAnswer 
}: QuizCardProps) => {
  const [selectedAnswer, setSelectedAnswer] = useState<string | null>(null);
  const [isAnswered, setIsAnswered] = useState(false);
  const [shuffledOptions, setShuffledOptions] = useState<ShuffledOption[]>([]);
  const [timeLeft, setTimeLeft] = useState(timePerQuestion);

  // Only shuffle options when the question changes
  useEffect(() => {
    const options = language === 'dutch' ? question.optionsDutch : question.optionsEnglish;
    const optionsWithIndex = options.map((text, index) => ({ text, originalIndex: index }));
    const shuffled = [...optionsWithIndex].sort(() => Math.random() - 0.5);
    
    setSelectedAnswer(null);
    setIsAnswered(false);
    setTimeLeft(timePerQuestion);
    setShuffledOptions(shuffled);
  }, [question.id, language, timePerQuestion]);

  // Handle timer
  useEffect(() => {
    if (isAnswered) return;

    const timer = setInterval(() => {
      setTimeLeft((prev) => {
        if (prev <= 1) {
          clearInterval(timer);
          onNext();
          return 0;
        }
        return prev - 1;
      });
    }, 1000);

    return () => clearInterval(timer);
  }, [isAnswered, onNext]);

  const handleAnswer = (option: ShuffledOption) => {
    if (isAnswered) return;
    
    setSelectedAnswer(option.text);
    setIsAnswered(true);
    
    const isCorrect = option.originalIndex === question.correctOptionIndex;
    if (isCorrect) {
      onScore();
    }

    // Call onAnswer with the answer details
    if (onAnswer) {
      onAnswer({
        questionId: question.id,
        selectedOptionIndex: option.originalIndex,
        correct: isCorrect
      });
    }
    
    setTimeout(onNext, 1000);
  };

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