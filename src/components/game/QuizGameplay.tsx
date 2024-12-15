import { useState, useEffect } from "react";
import { Card } from "@/components/ui/card";
import { QuizProgress } from "@/components/QuizProgress";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";
import { allQuestions, shuffleQuestions } from "@/data/quizData";
import { QuizQuestion } from "@/types/quiz";
import { QuizCard } from "../QuizCard";
import { Leaderboard } from "../Leaderboard";

interface QuizGameplayProps {
  gameId: string;
  participantId: string;
}

export const QuizGameplay = ({ gameId, participantId }: QuizGameplayProps) => {
  const [questions, setQuestions] = useState<QuizQuestion[]>([]);
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [score, setScore] = useState(0);
  const [isLoading, setIsLoading] = useState(true);
  const [isComplete, setIsComplete] = useState(false);
  const [participants, setParticipants] = useState<Array<{ id: string; name: string; score: number }>>([]);
  const { toast } = useToast();

  useEffect(() => {
    const initializeQuiz = async () => {
      try {
        console.log('Initializing quiz for game:', gameId);
        const { data: game } = await supabase
          .from('games')
          .select('num_questions')
          .eq('id', gameId)
          .single();

        if (game) {
          console.log('Game settings:', game);
          const shuffled = shuffleQuestions(allQuestions);
          setQuestions(shuffled.slice(0, game.num_questions));
        }
        setIsLoading(false);
      } catch (error) {
        console.error('Error initializing quiz:', error);
        toast({
          title: "Error",
          description: "Failed to load quiz questions",
          variant: "destructive",
        });
        setIsLoading(false);
      }
    };

    initializeQuiz();

    // Subscribe to participant updates
    const participantChannel = supabase
      .channel('participant-updates')
      .on(
        'postgres_changes',
        {
          event: '*',
          schema: 'public',
          table: 'participants',
          filter: `game_id=eq.${gameId}`,
        },
        (payload: any) => {
          console.log('Participant update:', payload);
          setParticipants(prev => {
            const participant = payload.new;
            const existing = prev.find(p => p.id === participant.id);
            if (existing) {
              return prev.map(p => p.id === participant.id ? participant : p);
            }
            return [...prev, participant];
          });
        }
      )
      .subscribe();

    return () => {
      participantChannel.unsubscribe();
    };
  }, [gameId, toast]);

  const handleScore = async () => {
    const newScore = score + 1;
    setScore(newScore);
    
    try {
      console.log('Updating score for participant:', participantId);
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

  const handleNext = () => {
    if (currentQuestionIndex < questions.length - 1) {
      setCurrentQuestionIndex(prev => prev + 1);
    } else {
      setIsComplete(true);
    }
  };

  if (isLoading) {
    return (
      <Card className="p-6 max-w-2xl mx-auto mt-8">
        <p className="text-center">Loading quiz questions...</p>
      </Card>
    );
  }

  if (!questions.length) {
    return (
      <Card className="p-6 max-w-2xl mx-auto mt-8">
        <p className="text-center">No questions available.</p>
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
      <QuizProgress
        current={currentQuestionIndex}
        total={questions.length}
        score={score}
      />

      <QuizCard
        question={questions[currentQuestionIndex]}
        language="english"
        onNext={handleNext}
        onScore={handleScore}
      />
    </div>
  );
};