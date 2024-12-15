import { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import { GameJoiner } from "./GameJoiner";
import { QuizGameplay } from "./game/QuizGameplay";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";
import { Leaderboard } from "./Leaderboard";

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

        setGameId(game.id);
        setGameStatus(game.status);
        
        // Check if user is the creator of this game
        const isGameCreator = localStorage.getItem(`game_${game.id}_creator`) === 'true';
        setIsCreator(isGameCreator);
        
        // Only set participantId if not the creator
        if (!isGameCreator) {
          const storedParticipantId = localStorage.getItem(`game_${game.id}_participant`);
          if (storedParticipantId) {
            setParticipantId(storedParticipantId);
          }
        }

        // Fetch participants
        const { data: participantsData } = await supabase
          .from('participants')
          .select('id, name, score')
          .eq('game_id', game.id);

        if (participantsData) {
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
    let gameChannel;
    if (gameId) {
      gameChannel = supabase
        .channel('game-status-changes')
        .on(
          'postgres_changes',
          {
            event: '*',
            schema: 'public',
            table: 'games',
            filter: `id=eq.${gameId}`,
          },
          (payload: any) => {
            console.log('Game status changed:', payload);
            if (payload.new && payload.new.status) {
              setGameStatus(payload.new.status);
            }
          }
        )
        .subscribe();

      // Subscribe to participant updates
      const participantChannel = supabase
        .channel('participants-changes')
        .on(
          'postgres_changes',
          {
            event: '*',
            schema: 'public',
            table: 'participants',
            filter: `game_id=eq.${gameId}`,
          },
          (payload) => {
            const participant = payload.new as any;
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
        if (gameChannel) supabase.removeChannel(gameChannel);
        if (participantChannel) supabase.removeChannel(participantChannel);
      };
    }
  }, [gameCode, gameId, toast]);

  if (!gameId) {
    return null;
  }

  // If user is creator, show leaderboard
  if (isCreator) {
    return (
      <div className="container mx-auto px-4 py-8">
        <Leaderboard 
          participants={participants}
          currentParticipantId=""
        />
      </div>
    );
  }

  // If game hasn't started and user is not joined, show joiner
  if (gameStatus === 'waiting' && !participantId) {
    return <GameJoiner />;
  }

  // If user has joined and game is playing, show gameplay
  if (participantId && gameStatus === 'playing') {
    return <QuizGameplay gameId={gameId} participantId={participantId} />;
  }

  // If user has joined but game hasn't started, show waiting screen
  if (participantId && gameStatus === 'waiting') {
    return (
      <div className="container mx-auto px-4 py-8 text-center">
        <h2 className="text-2xl font-bold mb-4">Waiting for the game to start...</h2>
        <p className="text-gray-600">The quiz will begin when the host starts the game.</p>
      </div>
    );
  }

  return null;
};