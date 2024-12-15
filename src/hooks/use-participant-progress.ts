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

    // Subscribe to progress updates with debouncing
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
    if (!gameId || !participantId) {
      console.error('Missing gameId or participantId');
      return;
    }

    try {
      // Update local state immediately for optimistic updates
      const updatedAnswers = progress?.answers ? [...progress.answers] : [];
      if (answer !== null) {
        updatedAnswers[currentQuestionIndex] = answer;
      }
      
      setProgress({
        currentQuestionIndex,
        answers: updatedAnswers
      });

      const { error } = await supabase
        .from('participant_progress')
        .upsert({
          participant_id: participantId,
          game_id: gameId,
          current_question_index: currentQuestionIndex,
          answers: updatedAnswers
        }, {
          onConflict: 'participant_id,game_id'
        });

      if (error) {
        console.error('Error updating progress:', error);
        toast({
          title: "Error",
          description: "Failed to update progress",
          variant: "destructive",
        });
        // Revert optimistic update on error
        if (progress) {
          setProgress(progress);
        }
        return;
      }
    } catch (error) {
      console.error('Error updating progress:', error);
      toast({
        title: "Error",
        description: "Failed to update progress",
        variant: "destructive",
      });
      // Revert optimistic update on error
      if (progress) {
        setProgress(progress);
      }
    }
  };

  return {
    progress,
    updateProgress
  };
};