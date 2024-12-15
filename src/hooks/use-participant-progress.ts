import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from './use-toast';

interface Progress {
  currentQuestionIndex: number;
  answers: any[];
}

export const useParticipantProgress = (gameId: string, participantId: string) => {
  const [progress, setProgress] = useState<Progress | null>(null);
  const { toast } = useToast();

  useEffect(() => {
    const fetchProgress = async () => {
      try {
        const { data, error } = await supabase
          .from('participant_progress')
          .select('current_question_index, answers')
          .eq('game_id', gameId)
          .eq('participant_id', participantId)
          .single();

        if (error) {
          console.error('Error fetching progress:', error);
          return;
        }

        if (data) {
          setProgress({
            currentQuestionIndex: data.current_question_index,
            answers: Array.isArray(data.answers) ? data.answers : []
          });
        }
      } catch (error) {
        console.error('Error fetching progress:', error);
      }
    };

    fetchProgress();

    // Subscribe to progress updates
    const channel = supabase
      .channel(`progress-${participantId}`)
      .on(
        'postgres_changes',
        {
          event: '*',
          schema: 'public',
          table: 'participant_progress',
          filter: `participant_id=eq.${participantId}`,
        },
        (payload: any) => {
          console.log('Progress update:', payload);
          if (payload.new) {
            setProgress({
              currentQuestionIndex: payload.new.current_question_index,
              answers: Array.isArray(payload.new.answers) ? payload.new.answers : []
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
      let answers = progress?.answers || [];
      if (answer !== null) {
        answers = [...answers];
        answers[currentQuestionIndex] = answer;
      }

      const { error } = await supabase
        .from('participant_progress')
        .upsert({
          participant_id: participantId,
          game_id: gameId,
          current_question_index: currentQuestionIndex,
          answers: answers
        });

      if (error) {
        console.error('Error updating progress:', error);
        toast({
          title: "Error",
          description: "Failed to update progress",
          variant: "destructive",
        });
        return;
      }

      setProgress({
        currentQuestionIndex,
        answers
      });
    } catch (error) {
      console.error('Error updating progress:', error);
      toast({
        title: "Error",
        description: "Failed to update progress",
        variant: "destructive",
      });
    }
  };

  return {
    progress,
    updateProgress
  };
};