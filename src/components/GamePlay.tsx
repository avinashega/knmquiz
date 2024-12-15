import { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import { GameJoiner } from "./GameJoiner";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";

export const GamePlay = () => {
  const { gameCode } = useParams();
  const [gameId, setGameId] = useState<string | null>(null);
  const [participantId, setParticipantId] = useState<string | null>(null);
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
        
        // Check if user has already joined this game
        const storedParticipantId = localStorage.getItem(`game_${game.id}_participant`);
        if (storedParticipantId) {
          setParticipantId(storedParticipantId);
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
  }, [gameCode, toast]);

  // If we don't have a participantId yet, show the join form
  if (!participantId) {
    return <GameJoiner />;
  }

  // TODO: Implement the actual quiz gameplay component
  return (
    <div className="p-4">
      <h1>Game in progress</h1>
      <p>Game Code: {gameCode}</p>
      <p>Participant ID: {participantId}</p>
    </div>
  );
};