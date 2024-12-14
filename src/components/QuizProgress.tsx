import { Progress } from "@/components/ui/progress";

interface QuizProgressProps {
  current: number;
  total: number;
  score: number;
}

export const QuizProgress = ({ current, total, score }: QuizProgressProps) => {
  const progress = (current / total) * 100;

  return (
    <div className="w-full max-w-2xl mx-auto mb-8 space-y-2">
      <div className="flex justify-between text-sm text-gray-600">
        <span>Question {current + 1} of {total}</span>
        <span>Score: {score}</span>
      </div>
      <Progress value={progress} className="h-2" />
    </div>
  );
};