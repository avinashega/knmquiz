import { useState, useEffect } from "react";
import { Card } from "@/components/ui/card";
import { QuizProgress } from "@/components/QuizProgress";
import { supabase } from "@/integrations/supabase/client";
import { QuizQuestion } from "@/types/quiz";
import { QuizCard } from "../QuizCard";
import { Leaderboard } from "../Leaderboard";
import { useParticipantProgress } from "@/hooks/use-participant-progress";
import { QuizState } from "./QuizState";
import { useToast } from "@/hooks/use-toast";

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
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [timeLeft, setTimeLeft] = useState(timePerQuestion);
  const { progress, updateProgress } = useParticipantProgress(gameId, participantId);
  const { toast } = useToast();

  useEffect(() => {
    // Subscribe to game updates for synchronized timing
    const channel = supabase
      .channel(`game-timing-${gameId}`)
      .on(
        'postgres_changes',
        {
          event: '*',
          schema: 'public',
          table: 'games',
          filter: `id=eq.${gameId}`,
        },
        (payload: any) => {
          const game = payload.new;
          if (game) {
            setCurrentQuestionIndex(game.current_question_index || 0);
            if (game.status === 'completed') {
              setIsComplete(true);
            }
          }
        }
      )
      .subscribe();

    return () => {
      channel.unsubscribe();
    };
  }, [gameId]);

  useEffect(() => {
    // Timer effect
    const timer = setInterval(async () => {
      setTimeLeft((prev) => {
        if (prev <= 1) {
          // Time's up for this question
          handleNext();
          return timePerQuestion;
        }
        return prev - 1;
      });
    }, 1000);

    return () => clearInterval(timer);
  }, [timePerQuestion, currentQuestionIndex]);

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
        toast({
          title: "Error",
          description: "Failed to update score",
          variant: "destructive",
        });
      }
    } catch (error) {
      console.error('Error updating score:', error);
    }
  };

  const handleNext = async () => {
    const nextIndex = currentQuestionIndex + 1;
    
    if (nextIndex < selectedQuestions.length) {
      try {
        const { error } = await supabase
          .from('games')
          .update({ 
            current_question_index: nextIndex,
          })
          .eq('id', gameId);

        if (error) throw error;
        
        await updateProgress(nextIndex, null);
        setTimeLeft(timePerQuestion);
      } catch (error) {
        console.error('Error updating question index:', error);
        toast({
          title: "Error",
          description: "Failed to update question progress",
          variant: "destructive",
        });
      }
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
          toast({
            title: "Error",
            description: "Failed to complete the game",
            variant: "destructive",
          });
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
        current={currentQuestionIndex}
        total={selectedQuestions.length}
        score={score}
      />

      {selectedQuestions[currentQuestionIndex] && (
        <QuizCard
          question={selectedQuestions[currentQuestionIndex]}
          language="dutch"
          onNext={handleNext}
          onScore={handleScore}
          timePerQuestion={timeLeft}
        />
      )}
    </div>
  );
};