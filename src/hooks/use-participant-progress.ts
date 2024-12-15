import { useState, useEffect } from "react";
import { supabase } from "@/integrations/supabase/client";

interface ParticipantProgress {
  currentQuestionIndex: number;
  answers: any[];
}

export const useParticipantProgress = (gameId: string, participantId: string) => {
  const [progress, setProgress] = useState<ParticipantProgress | null>(null);

  useEffect(() => {
    const initializeProgress = async () => {
      try {
        // First check if progress exists
        const { data: existingProgress } = await supabase
          .from('participant_progress')
          .select('*')
          .eq('game_id', gameId)
          .eq('participant_id', participantId)
          .single();

        if (existingProgress) {
          setProgress({
            currentQuestionIndex: existingProgress.current_question_index,
            answers: existingProgress.answers || []
          });
        } else {
          // Create initial progress
          const { data: newProgress, error } = await supabase
            .from('participant_progress')
            .insert({
              game_id: gameId,
              participant_id: participantId,
              current_question_index: 0,
              answers: []
            })
            .select()
            .single();

          if (error) {
            console.error('Error creating progress:', error);
            return;
          }

          if (newProgress) {
            setProgress({
              currentQuestionIndex: newProgress.current_question_index,
              answers: newProgress.answers || []
            });
          }
        }
      } catch (error) {
        console.error('Error initializing participant progress:', error);
      }
    };

    initializeProgress();

    // Subscribe to progress updates
    const channel = supabase
      .channel('progress-updates')
      .on(
        'postgres_changes',
        {
          event: '*',
          schema: 'public',
          table: 'participant_progress',
          filter: `participant_id=eq.${participantId}`,
        },
        (payload: any) => {
          if (payload.new) {
            setProgress({
              currentQuestionIndex: payload.new.current_question_index,
              answers: payload.new.answers || []
            });
          }
        }
      )
      .subscribe();

    return () => {
      channel.unsubscribe();
    };
  }, [gameId, participantId]);

  const updateProgress = async (currentQuestionIndex: number, answer: any) => {
    try {
      const updatedAnswers = answer 
        ? [...(progress?.answers || []), answer]
        : (progress?.answers || []);

      const { data, error } = await supabase
        .from('participant_progress')
        .upsert({
          game_id: gameId,
          participant_id: participantId,
          current_question_index: currentQuestionIndex,
          answers: updatedAnswers
        })
        .select()
        .single();

      if (error) {
        console.error('Error updating progress:', error);
        return;
      }

      if (data) {
        setProgress({
          currentQuestionIndex: data.current_question_index,
          answers: data.answers || []
        });
      }
    } catch (error) {
      console.error('Error updating progress:', error);
    }
  };

  return { progress, updateProgress };
};