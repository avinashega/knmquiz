import { useState, useEffect } from "react";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";

interface GameContainerProps {
  gameCode: string;
  onGameData: (data: { id: string; status: string }) => void;
  onParticipantsData: (data: Array<{ id: string; name: string; score: number }>) => void;
}

export const GameContainer = ({ gameCode, onGameData, onParticipantsData }: GameContainerProps) => {
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
        onGameData(game);
        
        // Fetch initial participants data
        const { data: participantsData } = await supabase
          .from('participants')
          .select('id, name, score')
          .eq('game_id', game.id);

        if (participantsData) {
          console.log('Participants data:', participantsData);
          onParticipantsData(participantsData);
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
          filter: `game_id=eq.${payload?.new?.id}`,
        },
        (payload: any) => {
          console.log('Participant update:', payload);
          if (payload.new) {
            onParticipantsData(prev => {
              const existing = prev.find(p => p.id === payload.new.id);
              if (existing) {
                return prev.map(p => p.id === payload.new.id ? payload.new : p);
              }
              return [...prev, payload.new];
            });
          }
        }
      )
      .subscribe();

    return () => {
      gameChannel.unsubscribe();
      participantChannel.unsubscribe();
    };
  }, [gameCode, onGameData, onParticipantsData, toast]);

  return null;
};