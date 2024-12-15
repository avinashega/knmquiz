import { useState, useEffect } from "react";
import { supabase } from "@/integrations/supabase/client";
import { QuizQuestion } from "@/types/quiz";
import { useToast } from "@/hooks/use-toast";

interface QuizStateProps {
  gameId: string;
  onQuestionsLoaded: (questions: QuizQuestion[]) => void;
  onGameComplete: () => void;
}

export const QuizState = ({ gameId, onQuestionsLoaded, onGameComplete }: QuizStateProps) => {
  const [isLoading, setIsLoading] = useState(true);
  const { toast } = useToast();

  useEffect(() => {
    const initializeQuiz = async () => {
      try {
        const { data: game, error } = await supabase
          .from('games')
          .select('selected_questions, status')
          .eq('id', gameId)
          .single();

        if (error) throw error;

        if (game) {
          if (game.status === 'completed') {
            onGameComplete();
          }
          
          // Validate and convert the selected_questions data
          if (game.selected_questions && Array.isArray(game.selected_questions)) {
            const questions = game.selected_questions as any[];
            const validQuestions = questions.every(q => 
              typeof q.id === 'number' &&
              typeof q.questionDutch === 'string' &&
              typeof q.questionEnglish === 'string' &&
              typeof q.answerDutch === 'string' &&
              typeof q.answerEnglish === 'string' &&
              Array.isArray(q.optionsDutch) &&
              Array.isArray(q.optionsEnglish) &&
              typeof q.correctOptionIndex === 'number'
            );

            if (validQuestions && questions.length > 0) {
              console.log('Valid questions loaded:', questions);
              onQuestionsLoaded(questions as QuizQuestion[]);
            } else {
              console.error('Invalid question format:', questions);
              throw new Error('Invalid question format in data');
            }
          } else {
            console.error('Invalid selected_questions data:', game.selected_questions);
            throw new Error('No valid questions data available');
          }
        }
        setIsLoading(false);
      } catch (error: any) {
        console.error('Error initializing quiz:', error);
        toast({
          title: "Error",
          description: error.message || "Failed to load quiz questions",
          variant: "destructive",
        });
        setIsLoading(false);
      }
    };

    initializeQuiz();

    // Subscribe to game updates
    const channel = supabase
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
            onGameComplete();
          }
        }
      )
      .subscribe();

    return () => {
      channel.unsubscribe();
    };
  }, [gameId, onQuestionsLoaded, onGameComplete, toast]);

  if (isLoading) {
    return <p className="text-center">Loading quiz questions...</p>;
  }

  return null;
};