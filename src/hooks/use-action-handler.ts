
import { useState } from 'react';
import { useToast } from '@/components/ui/use-toast';
import { ActionType } from '@/types/ai-orchestrator';

interface ActionHandlerProps {
  setLoading: (loading: boolean) => void;
  setProcessingStage: (stage: 'idle' | 'initial' | 'responseReceived' | 'deepResearch' | 'operational') => void;
  originalQuery: string;
  setModelResponse: (response: string) => void;
  setSummaryPoints: (points: string[]) => void;
  setTacticalSummary: (summary: string) => void;
  tacticalSummary: string;
  summaryPoints: string[];
}

export const useActionHandler = ({
  setLoading,
  setProcessingStage,
  originalQuery,
  setModelResponse,
  setSummaryPoints,
  setTacticalSummary,
  tacticalSummary,
  summaryPoints,
}: ActionHandlerProps) => {
  const { toast } = useToast();

  const handleActionSelection = async (action: ActionType) => {
    setLoading(true);
    
    try {
      switch (action) {
        case 'refine':
          toast({
            title: 'Refine Query',
            description: 'Please modify your query and submit again for refinement.',
          });
          setProcessingStage('idle');
          break;
          
        case 'sendToGemini':
          toast({
            title: 'Sending to Gemini',
            description: 'Your query is being sent to Gemini for execution.',
          });
          await new Promise(resolve => setTimeout(resolve, 1500));
          toast({
            title: 'Sent to Gemini',
            description: 'Your query has been successfully sent to Gemini.',
          });
          break;
          
        case 'goDeep':
          setProcessingStage('deepResearch');
          toast({
            title: 'Deep Research Mode',
            description: 'Triggering deep research on your query.',
          });
          
          // Simulate deep research
          await new Promise(resolve => setTimeout(resolve, 3000));
          
          // Fix: Update with deep research results - replacing function with direct string value
          const updatedResponse = `${originalQuery}\n\nDEEP RESEARCH RESULTS: Additional detailed information based on your query about "${originalQuery}".`;
          setModelResponse(updatedResponse);
          
          setSummaryPoints([
            'Deep research finding 1: More detailed analysis on the topic.',
            'Deep research finding 2: Additional expert perspectives on this subject.',
            'Deep research finding 3: Contextual information and related concepts.'
          ]);
          setTacticalSummary('Enhanced tactical summary with deeper insights and more detailed strategic recommendations.');
          setProcessingStage('responseReceived');
          
          toast({
            title: 'Deep Research Complete',
            description: 'Enhanced information is now available.',
          });
          break;
          
        case 'sendToNick':
          setProcessingStage('operational');
          toast({
            title: 'Sending to Operational Nick',
            description: 'Your query is being routed for processing and logging.',
          });
          
          // Simulate sending to Operational Nick
          await new Promise(resolve => setTimeout(resolve, 1500));
          
          // Format the output as JSON
          const operationalOutput = {
            query: originalQuery,
            summary: tacticalSummary,
            action_items: summaryPoints,
            status: 'complete'
          };
          
          console.log('Sending to Operational Nick:', JSON.stringify(operationalOutput, null, 2));
          
          toast({
            title: 'Sent to Operational Nick',
            description: 'Your data has been successfully routed for processing.',
          });
          break;
          
        case 'email':
          toast({
            title: 'Email Summary',
            description: 'Enter recipient email to share this summary.',
          });
          // In a real app, this would open a modal to enter email details
          break;
      }
    } catch (error) {
      console.error('Error handling action:', error);
      toast({
        title: 'Action Error',
        description: 'Failed to process your selected action.',
        variant: 'destructive',
      });
    } finally {
      setLoading(false);
    }
  };

  return {
    handleActionSelection
  };
};
