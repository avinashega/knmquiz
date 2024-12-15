import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Card } from "./ui/card";
import { useToast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";
import { GameConfigForm } from "./game/GameConfigForm";
import { GameLobby } from "./game/GameLobby";
import { allQuestions, shuffleQuestions } from "@/data/quizData";
import { QuizQuestion } from "@/types/quiz";

interface Participant {
  id: string;
  name: string;
}

export const GameCreator = () => {
  const navigate = useNavigate();
  const [gameCode, setGameCode] = useState<string>("");
  const [gameId, setGameId] = useState<string>("");
  const [participants, setParticipants] = useState<Participant[]>([]);
  const { toast } = useToast();

  const handleGameCreated = async (numQuestions: number, timePerQuestion: number) => {
    try {
      // Generate a random 6-character code
      const code = Math.random().toString(36).substring(2, 8).toUpperCase();
      
      // Get random questions
      const selectedQuestions: QuizQuestion[] = shuffleQuestions(allQuestions).slice(0, numQuestions);
      
      // Convert questions to a plain object array for Supabase
      const questionsForDb = selectedQuestions.map(q => ({
        id: q.id,
        questionDutch: q.questionDutch,
        questionEnglish: q.questionEnglish,
        answerDutch: q.answerDutch,
        answerEnglish: q.answerEnglish,
        optionsDutch: q.optionsDutch,
        optionsEnglish: q.optionsEnglish,
        correctOptionIndex: q.correctOptionIndex
      }));
      
      // Create game in database
      const { data: game, error } = await supabase
        .from('games')
        .insert({
          code: code,
          num_questions: numQuestions,
          time_per_question: timePerQuestion,
          status: 'waiting',
          selected_questions: questionsForDb
        })
        .select()
        .single();

      if (error) {
        console.error('Error creating game:', error);
        throw error;
      }

      if (!game) {
        throw new Error('Failed to create game');
      }

      // Store creator status in localStorage
      localStorage.setItem(`game_${game.id}_creator`, 'true');
      
      // Update state
      setGameCode(code);
      setGameId(game.id);
      
      toast({
        title: "Game Created!",
        description: "Share the code with participants to join.",
      });

    } catch (error: any) {
      console.error('Error creating game:', error);
      toast({
        title: "Error",
        description: "Failed to create game. Please try again.",
        variant: "destructive",
      });
    }
  };

  const startGame = async () => {
    if (participants.length < 1) {
      toast({
        title: "Error",
        description: "Wait for participants to join",
        variant: "destructive",
      });
      return;
    }

    try {
      const { error } = await supabase
        .from('games')
        .update({ 
          status: 'playing',
          started_at: new Date().toISOString()
        })
        .eq('id', gameId);

      if (error) throw error;
      
      toast({
        title: "Starting Game",
        description: "The quiz will begin shortly...",
      });

      navigate(`/game/${gameCode}`);
    } catch (error) {
      console.error('Error starting game:', error);
      toast({
        title: "Error",
        description: "Failed to start game. Please try again.",
        variant: "destructive",
      });
    }
  };

  return (
    <Card className="p-6 max-w-md mx-auto">
      <h2 className="text-2xl font-bold mb-4">Create Multiplayer Quiz</h2>
      
      {!gameCode ? (
        <GameConfigForm onGameCreated={handleGameCreated} />
      ) : (
        <GameLobby
          gameId={gameId}
          gameCode={gameCode}
          participants={participants}
          onParticipantsChange={setParticipants}
          onStartGame={startGame}
          isCreator={true}
        />
      )}
    </Card>
  );
};