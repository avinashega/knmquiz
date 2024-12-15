import { useState } from "react";
import { Card } from "@/components/ui/card";
import { QuizProgress } from "@/components/QuizProgress";
import { supabase } from "@/integrations/supabase/client";
import { QuizQuestion } from "@/types/quiz";
import { QuizCard } from "../QuizCard";
import { Leaderboard } from "../Leaderboard";
import { useParticipantProgress } from "@/hooks/use-participant-progress";
import { QuizState } from "./QuizState";

interface QuizGameplayProps {
  gameId: string;
  participantId: string;
}

export const QuizGameplay = ({ gameId, participantId }: QuizGameplayProps) => {
  const [score, setScore] = useState(0);
  const [isComplete, setIsComplete] = useState(false);
  const [participants, setParticipants] = useState<Array<{ id: string; name: string; score: number }>>([]);
  const [timePerQuestion, setTimePerQuestion] = useState(30);
  const [selectedQuestions, setSelectedQuestions] = useState<QuizQuestion[]>([]);
  const { progress, updateProgress } = useParticipantProgress(gameId, participantId);

  const handleScore = async () => {
    const newScore = score + 1;
    setScore(newScore);
    
    try {
      const { error } = await supabase
        .from('participants')
        .update({ score: newScore })
        .eq('id', participantId);

      if (error) {
        console.error('Error updating score:', error);
      }
    } catch (error) {
      console.error('Error updating score:', error);
    }
  };

  const handleNext = async () => {
    const nextIndex = (progress?.currentQuestionIndex || 0) + 1;
    
    if (nextIndex < selectedQuestions.length) {
      await updateProgress(nextIndex, null);
    } else {
      setIsComplete(true);
      try {
        const { error } = await supabase
          .from('games')
          .update({ 
            status: 'completed',
            finished_at: new Date().toISOString()
          })
          .eq('id', gameId);

        if (error) {
          console.error('Error marking game as complete:', error);
        }
      } catch (error) {
        console.error('Error marking game as complete:', error);
      }
    }
  };

  if (!selectedQuestions.length) {
    return (
      <Card className="p-6 max-w-2xl mx-auto mt-8">
        <p className="text-center">Loading questions...</p>
      </Card>
    );
  }

  if (isComplete) {
    return (
      <div className="container mx-auto px-4 py-8">
        <h2 className="text-2xl font-bold text-center mb-8">Quiz Complete!</h2>
        <Leaderboard 
          participants={participants}
          currentParticipantId={participantId}
        />
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <QuizState
        gameId={gameId}
        onQuestionsLoaded={setSelectedQuestions}
        onGameComplete={() => setIsComplete(true)}
      />

      <QuizProgress
        current={progress?.currentQuestionIndex || 0}
        total={selectedQuestions.length}
        score={score}
      />

      {progress && selectedQuestions[progress.currentQuestionIndex] && (
        <QuizCard
          question={selectedQuestions[progress.currentQuestionIndex]}
          language="dutch"
          onNext={handleNext}
          onScore={handleScore}
          timePerQuestion={timePerQuestion}
        />
      )}
    </div>
  );
};