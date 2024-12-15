import { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import { GameJoiner } from "./GameJoiner";
import { QuizGameplay } from "./game/QuizGameplay";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";
import { Leaderboard } from "./Leaderboard";
import { WaitingRoom } from "./game/WaitingRoom";

export const GamePlay = () => {
  const { gameCode } = useParams();
  const [gameId, setGameId] = useState<string | null>(null);
  const [participantId, setParticipantId] = useState<string | null>(null);
  const [isCreator, setIsCreator] = useState(false);
  const [gameStatus, setGameStatus] = useState<string>('waiting');
  const [participants, setParticipants] = useState<Array<{ id: string; name: string; score: number }>>([]);
  const { toast } = useToast();

  useEffect(() => {
    const checkGameStatus = async () => {
      if (!gameCode) return;

      try {
        const { data: game, error } = await supabase
          .from('games')
          .select('id, status')
          .eq('code', gameCode)
          .single();

        if (error) throw error;

        if (!game) {
          toast({
            title: "Error",
            description: "Game not found",
            variant: "destructive",
          });
          return;
        }

        console.log('Game data:', game);
        setGameId(game.id);
        setGameStatus(game.status);
        
        const isGameCreator = localStorage.getItem(`game_${game.id}_creator`) === 'true';
        setIsCreator(isGameCreator);
        console.log('Is creator:', isGameCreator);
        
        if (!isGameCreator) {
          const storedParticipantId = localStorage.getItem(`game_${game.id}_participant`);
          if (storedParticipantId) {
            setParticipantId(storedParticipantId);
          }
        }

        // Fetch initial participants data
        const { data: participantsData } = await supabase
          .from('participants')
          .select('id, name, score')
          .eq('game_id', game.id);

        if (participantsData) {
          console.log('Participants data:', participantsData);
          setParticipants(participantsData);
        }
      } catch (error: any) {
        console.error('Error checking game status:', error);
        toast({
          title: "Error",
          description: error.message || "Failed to check game status",
          variant: "destructive",
        });
      }
    };

    checkGameStatus();

    // Subscribe to game status changes
    const gameChannel = supabase
      .channel(`game-status-${gameCode}`)
      .on(
        'postgres_changes',
        {
          event: '*',
          schema: 'public',
          table: 'games',
          filter: `code=eq.${gameCode}`,
        },
        (payload: any) => {
          console.log('Game status changed:', payload);
          if (payload.new && payload.new.status) {
            console.log('Setting new game status:', payload.new.status);
            setGameStatus(payload.new.status);
            
            if (payload.new.status === 'playing') {
              // Initialize participant progress when game starts
              if (participantId) {
                initializeParticipantProgress(payload.new.id, participantId);
              }
              toast({
                title: "Game Started!",
                description: "The quiz is now beginning...",
              });
            }
          }
        }
      )
      .subscribe();

    // Subscribe to participant updates
    const participantChannel = supabase
      .channel(`participant-updates-${gameCode}`)
      .on(
        'postgres_changes',
        {
          event: '*',
          schema: 'public',
          table: 'participants',
          filter: gameId ? `game_id=eq.${gameId}` : undefined,
        },
        (payload: any) => {
          console.log('Participant update:', payload);
          const participant = payload.new;
          setParticipants(prev => {
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
  }, [gameCode, gameId, participantId, toast]);

  const initializeParticipantProgress = async (gameId: string, participantId: string) => {
    try {
      const { error } = await supabase
        .from('participant_progress')
        .upsert({
          participant_id: participantId,
          game_id: gameId,
          current_question_index: 0,
          answers: []
        });

      if (error) {
        console.error('Error initializing participant progress:', error);
        toast({
          title: "Error",
          description: "Failed to initialize quiz progress",
          variant: "destructive",
        });
      }
    } catch (error) {
      console.error('Error initializing participant progress:', error);
    }
  };

  if (!gameId) {
    return null;
  }

  // Show leaderboard for completed games
  if (gameStatus === 'completed') {
    return (
      <div className="container mx-auto px-4 py-8">
        <h2 className="text-2xl font-bold text-center mb-8">Game Complete!</h2>
        <Leaderboard 
          participants={participants}
          currentParticipantId={participantId || ""}
        />
      </div>
    );
  }

  if (isCreator && gameStatus === 'playing') {
    return (
      <div className="container mx-auto px-4 py-8">
        <h2 className="text-2xl font-bold mb-4">Game in Progress</h2>
        <Leaderboard 
          participants={participants}
          currentParticipantId={participantId || ""}
        />
      </div>
    );
  }

  if (isCreator && gameStatus === 'waiting') {
    return (
      <div className="container mx-auto px-4 py-8">
        <h2 className="text-2xl font-bold mb-4">Waiting Room</h2>
        <Leaderboard 
          participants={participants}
          currentParticipantId={participantId || ""}
        />
      </div>
    );
  }

  if (gameStatus === 'waiting' && !participantId) {
    return <GameJoiner />;
  }

  if (participantId && gameStatus === 'playing') {
    return <QuizGameplay gameId={gameId} participantId={participantId} />;
  }

  if (participantId && gameStatus === 'waiting') {
    return <WaitingRoom participants={participants} />;
  }

  return null;
};