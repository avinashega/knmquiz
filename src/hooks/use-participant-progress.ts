import { useState, useEffect } from "react";
import { supabase } from "@/integrations/supabase/client";

interface ParticipantProgress {
  currentQuestionIndex: number;
  answers: any[];
}

export const useParticipantProgress = (gameId: string, participantId: string) => {
  const [progress, setProgress] = useState<ParticipantProgress | null>(null);

  useEffect(() => {
    const fetchProgress = async () => {
      const { data, error } = await supabase
        .from('participant_progress')
        .select('*')
        .eq('game_id', gameId)
        .eq('participant_id', participantId)
        .single();

      if (error && error.code !== 'PGRST116') { // PGRST116 is "not found" error
        console.error('Error fetching progress:', error);
        return;
      }

      if (!data) {
        // Create initial progress record
        const { data: newProgress, error: createError } = await supabase
          .from('participant_progress')
          .insert({
            game_id: gameId,
            participant_id: participantId,
            current_question_index: 0,
            answers: []
          })
          .select()
          .single();

        if (createError) {
          console.error('Error creating progress:', createError);
          return;
        }

        setProgress({
          currentQuestionIndex: newProgress.current_question_index,
          answers: newProgress.answers
        });
      } else {
        setProgress({
          currentQuestionIndex: data.current_question_index,
          answers: data.answers
        });
      }
    };

    fetchProgress();

    // Subscribe to progress updates
    const channel = supabase
      .channel('participant-progress')
      .on(
        'postgres_changes',
        {
          event: '*',
          schema: 'public',
          table: 'participant_progress',
          filter: `participant_id=eq.${participantId} AND game_id=eq.${gameId}`
        },
        (payload) => {
          console.log('Progress update:', payload);
          if (payload.new) {
            setProgress({
              currentQuestionIndex: payload.new.current_question_index,
              answers: payload.new.answers
            });
          }
        }
      )
      .subscribe();

    return () => {
      channel.unsubscribe();
    };
  }, [gameId, participantId]);

  const updateProgress = async (questionIndex: number, answer: any) => {
    const newAnswers = [...(progress?.answers || [])];
    newAnswers[questionIndex] = answer;

    const { error } = await supabase
      .from('participant_progress')
      .update({
        current_question_index: questionIndex,
        answers: newAnswers
      })
      .eq('game_id', gameId)
      .eq('participant_id', participantId);

    if (error) {
      console.error('Error updating progress:', error);
    }
  };

  return { progress, updateProgress };
};