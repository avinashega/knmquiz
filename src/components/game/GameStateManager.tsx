import { useState, useEffect } from "react";
import { GameJoiner } from "../GameJoiner";
import { QuizGameplay } from "./QuizGameplay";
import { WaitingRoom } from "./WaitingRoom";
import { Leaderboard } from "../Leaderboard";
import { supabase } from "@/integrations/supabase/client";

interface GameStateManagerProps {
  gameId: string;
  gameStatus: string;
  participants: Array<{ id: string; name: string; score: number }>;
  isCreator: boolean;
  participantId: string | null;
}

export const GameStateManager = ({ 
  gameId, 
  gameStatus, 
  participants, 
  isCreator, 
  participantId 
}: GameStateManagerProps) => {
  
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
      }
    } catch (error) {
      console.error('Error initializing participant progress:', error);
    }
  };

  useEffect(() => {
    if (gameStatus === 'playing' && participantId) {
      initializeParticipantProgress(gameId, participantId);
    }
  }, [gameStatus, gameId, participantId]);

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