import { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import { QuizCard } from "./QuizCard";
import { QuizProgress } from "./QuizProgress";
import { Leaderboard } from "./Leaderboard";
import { allQuestions, shuffleQuestions } from "@/data/quizData";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";

export const GamePlay = () => {
  const { gameCode } = useParams();
  const [gameState, setGameState] = useState({
    currentQuestion: 0,
    score: 0,
    questions: shuffleQuestions(allQuestions).slice(0, 10),
    gameId: "",
    participantId: "",
    timePerQuestion: 30,
  });
  const [participants, setParticipants] = useState<{ id: string; name: string; score: number }[]>([]);
  const { toast } = useToast();

  useEffect(() => {
    const initializeGame = async () => {
      try {
        // Get game details
        const { data: game } = await supabase
          .from('games')
          .select('id, num_questions, time_per_question')
          .eq('code', gameCode)
          .single();

        if (game) {
          // Get participant details from localStorage
          const participantId = localStorage.getItem(`game_${game.id}_participant`);
          
          if (participantId) {
            setGameState(prev => ({
              ...prev,
              gameId: game.id,
              participantId,
              questions: shuffleQuestions(allQuestions).slice(0, game.num_questions),
              timePerQuestion: game.time_per_question,
            }));
          }
        }
      } catch (error) {
        console.error('Error initializing game:', error);
        toast({
          title: "Error",
          description: "Failed to initialize game",
          variant: "destructive",
        });
      }
    };

    initializeGame();
  }, [gameCode, toast]);

  // Subscribe to real-time updates for participants
  useEffect(() => {
    if (!gameState.gameId) return;

    const channel = supabase
      .channel('game_updates')
      .on(
        'postgres_changes',
        {
          event: '*',
          schema: 'public',
          table: 'participants',
          filter: `game_id=eq.${gameState.gameId}`,
        },
        (payload) => {
          // Update participants list
          supabase
            .from('participants')
            .select('*')
            .eq('game_id', gameState.gameId)
            .then(({ data }) => {
              if (data) {
                setParticipants(data);
              }
            });
        }
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, [gameState.gameId]);

  const handleNext = async () => {
    if (gameState.currentQuestion < gameState.questions.length - 1) {
      setGameState(prev => ({
        ...prev,
        currentQuestion: prev.currentQuestion + 1,
      }));
    } else {
      // Game finished
      try {
        await supabase
          .from('games')
          .update({ 
            status: 'finished',
            finished_at: new Date().toISOString()
          })
          .eq('id', gameState.gameId);

        toast({
          title: "Game Finished!",
          description: "Check the final scores!",
        });
      } catch (error) {
        console.error('Error finishing game:', error);
      }
    }
  };

  const handleScore = async () => {
    try {
      const { data } = await supabase
        .from('participants')
        .update({ 
          score: gameState.score + 1
        })
        .eq('id', gameState.participantId)
        .select()
        .single();

      if (data) {
        setGameState(prev => ({
          ...prev,
          score: prev.score + 1,
        }));
      }
    } catch (error) {
      console.error('Error updating score:', error);
    }
  };

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="max-w-3xl mx-auto">
        <div className="mb-8">
          <h2 className="text-2xl font-bold text-center mb-4">Game in Progress</h2>
          <Leaderboard 
            participants={participants}
            currentParticipantId={gameState.participantId}
          />
        </div>

        <QuizProgress
          current={gameState.currentQuestion}
          total={gameState.questions.length}
          score={gameState.score}
        />

        <QuizCard
          question={gameState.questions[gameState.currentQuestion]}
          language="dutch"
          onNext={handleNext}
          onScore={handleScore}
        />
      </div>
    </div>
  );
};
