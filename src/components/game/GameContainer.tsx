import { useState, useEffect } from "react";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";

interface Participant {
  id: string;
  name: string;
  score: number;
}

interface GameContainerProps {
  gameCode: string;
  onGameData: (data: { id: string; status: string }) => void;
  onParticipantsData: (data: Participant[]) => void;
}

export const GameContainer = ({ gameCode, onGameData, onParticipantsData }: GameContainerProps) => {
  const { toast } = useToast();
  const [currentGameId, setCurrentGameId] = useState<string | null>(null);
  const [participants, setParticipants] = useState<Participant[]>([]);

  const fetchParticipants = async (gameId: string) => {
    try {
      const { data, error } = await supabase
        .from('participants')
        .select('id, name, score')
        .eq('game_id', gameId);

      if (error) {
        console.error('Error fetching participants:', error);
        throw error;
      }

      if (data) {
        setParticipants(data);
        onParticipantsData(data);
      }
    } catch (error: any) {
      console.error('Error in fetchParticipants:', error);
      toast({
        title: "Error",
        description: "Failed to fetch participants data. Please refresh the page.",
        variant: "destructive",
      });
    }
  };

  useEffect(() => {
    const checkGameStatus = async () => {
      if (!gameCode) return;

      try {
        const { data: game, error } = await supabase
          .from('games')
          .select('id, status')
          .eq('code', gameCode)
          .single();

        if (error) {
          console.error('Error fetching game:', error);
          toast({
            title: "Error",
            description: "Failed to fetch game data",
            variant: "destructive",
          });
          return;
        }

        if (!game) {
          toast({
            title: "Error",
            description: "Game not found",
            variant: "destructive",
          });
          return;
        }

        console.log('Game data:', game);
        setCurrentGameId(game.id);
        onGameData(game);
        
        // Fetch initial participants data
        await fetchParticipants(game.id);
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
          if (payload.new) {
            console.log('Setting new game status:', payload.new.status);
            onGameData(payload.new);
            
            if (payload.new.status === 'playing') {
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
          filter: `game_id=eq.${currentGameId}`,
        },
        async (participantPayload: any) => {
          console.log('Participant update:', participantPayload);
          if (participantPayload.new) {
            // Fetch all participants again to ensure consistency
            await fetchParticipants(currentGameId!);
          }
        }
      )
      .subscribe();

    return () => {
      gameChannel.unsubscribe();
      participantChannel.unsubscribe();
    };
  }, [gameCode, onGameData, toast, currentGameId]);

  return null;
};