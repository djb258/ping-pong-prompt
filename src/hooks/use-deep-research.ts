
import { useToast } from '@/components/ui/use-toast';
import { ModelAvailability } from '@/types/ai-orchestrator';

interface DeepResearchProps {
  loading: boolean;
  setLoading: (loading: boolean) => void;
  originalQuery: string;
  modelResponse: string;
  setModelResponse: (response: string) => void;
  setSummaryPoints: (points: string[]) => void;
  setTacticalSummary: (summary: string) => void;
  setProcessingStage: (stage: 'idle' | 'initial' | 'responseReceived' | 'deepResearch' | 'operational') => void;
  availableModels: ModelAvailability;
}

export const useDeepResearch = ({
  loading,
  setLoading,
  originalQuery,
  modelResponse,
  setModelResponse,
  setSummaryPoints,
  setTacticalSummary,
  setProcessingStage,
  availableModels,
}: DeepResearchProps) => {
  const { toast } = useToast();

  const handleDeepResearch = async (selectedModel: string) => {
    // Only proceed if a model is selected and appears to be connected
    if (!selectedModel || !availableModels[selectedModel]) {
      toast({
        title: 'Cannot perform deep research',
        description: `${selectedModel} is not connected. Please connect it first.`,
        variant: 'destructive'
      });
      return;
    }

    setLoading(true);
    setProcessingStage('deepResearch');
    
    try {
      toast({
        title: 'Deep Research Mode',
        description: `Triggering deep research using ${selectedModel}...`,
      });
      
      // Simulate deep research with the selected model
      await new Promise(resolve => setTimeout(resolve, 3000));
      
      // Fix: Update with deep research results - replacing function with direct string value
      const enhancedResponse = `${modelResponse}\n\nDEEP RESEARCH RESULTS FROM ${selectedModel.toUpperCase()}: Additional detailed information based on your query about "${originalQuery}".`;
      setModelResponse(enhancedResponse);
      
      setSummaryPoints([
        `${selectedModel} deep research finding 1: More detailed analysis on the topic.`,
        `${selectedModel} deep research finding 2: Additional expert perspectives on this subject.`,
        `${selectedModel} deep research finding 3: Contextual information and related concepts.`
      ]);
      setTacticalSummary(`Enhanced tactical summary with deeper insights from ${selectedModel} and more detailed strategic recommendations.`);
      
      toast({
        title: 'Deep Research Complete',
        description: `Enhanced information from ${selectedModel} is now available.`,
      });
    } catch (error) {
      console.error('Error during deep research:', error);
      toast({
        title: 'Deep Research Error',
        description: `Failed to complete deep research with ${selectedModel}.`,
        variant: 'destructive',
      });
    } finally {
      setLoading(false);
      setProcessingStage('responseReceived');
    }
  };

  return {
    handleDeepResearch
  };
};
