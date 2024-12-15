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
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [score, setScore] = useState(0);
  const [isLoading, setIsLoading] = useState(true);
  const [isComplete, setIsComplete] = useState(false);
  const [participants, setParticipants] = useState<Array<{ id: string; name: string; score: number }>>([]);
  const [timePerQuestion, setTimePerQuestion] = useState(30);
  const [selectedQuestions, setSelectedQuestions] = useState<QuizQuestion[]>([]);
  const { toast } = useToast();

  useEffect(() => {
    const initializeQuiz = async () => {
      try {
        console.log('Initializing quiz for game:', gameId);
        const { data: game } = await supabase
          .from('games')
          .select('num_questions, time_per_question, current_question_index, selected_questions, status')
          .eq('id', gameId)
          .single();

        if (game) {
          console.log('Game settings:', game);
          setTimePerQuestion(game.time_per_question);
          setCurrentQuestionIndex(game.current_question_index || 0);
          
          if (game.status === 'completed') {
            setIsComplete(true);
          }

          // If questions are already selected, use them
          if (game.selected_questions && game.selected_questions.length > 0) {
            setSelectedQuestions(game.selected_questions);
          } else {
            // If no questions are selected yet, select them and update the game
            const shuffled = shuffleQuestions(allQuestions);
            const selected = shuffled.slice(0, game.num_questions);
            setSelectedQuestions(selected);
            
            const { error: updateError } = await supabase
              .from('games')
              .update({ selected_questions: selected })
              .eq('id', gameId);

            if (updateError) {
              console.error('Error updating selected questions:', updateError);
            }
          }
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

    // Subscribe to game updates
    const gameChannel = supabase
      .channel('game-updates')
      .on(
        'postgres_changes',
        {
          event: '*',
          schema: 'public',
          table: 'games',
          filter: `id=eq.${gameId}`,
        },
        (payload: any) => {
          console.log('Game update:', payload);
          const game = payload.new;
          if (game.status === 'completed') {
            setIsComplete(true);
          }
          setCurrentQuestionIndex(game.current_question_index || 0);
        }
      )
      .subscribe();

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
      gameChannel.unsubscribe();
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

  const handleNext = async () => {
    const nextIndex = currentQuestionIndex + 1;
    
    if (nextIndex < selectedQuestions.length) {
      try {
        const { error } = await supabase
          .from('games')
          .update({ current_question_index: nextIndex })
          .eq('id', gameId);

        if (error) {
          console.error('Error updating question index:', error);
        }
      } catch (error) {
        console.error('Error updating question index:', error);
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
            description: "Failed to update game status",
            variant: "destructive",
          });
        }
      } catch (error) {
        console.error('Error marking game as complete:', error);
      }
    }
  };

  if (isLoading) {
    return (
      <Card className="p-6 max-w-2xl mx-auto mt-8">
        <p className="text-center">Loading quiz questions...</p>
      </Card>
    );
  }

  if (!selectedQuestions.length) {
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
        total={selectedQuestions.length}
        score={score}
      />

      <QuizCard
        question={selectedQuestions[currentQuestionIndex]}
        language="dutch"
        onNext={handleNext}
        onScore={handleScore}
        timePerQuestion={timePerQuestion}
      />
    </div>
  );
};