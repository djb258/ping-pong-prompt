
import { useState } from 'react';
import { useToast } from '@/components/ui/use-toast';
import { ProcessingStage } from '@/types/ai-orchestrator';

export const useQueryProcessor = () => {
  const [loading, setLoading] = useState(false);
  const [processingStage, setProcessingStage] = useState<ProcessingStage>('idle');
  const [originalQuery, setOriginalQuery] = useState('');
  const [modelResponse, setModelResponse] = useState('');
  const [summaryPoints, setSummaryPoints] = useState<string[]>([]);
  const [tacticalSummary, setTacticalSummary] = useState('');
  const { toast } = useToast();

  const processQuery = async (query: string, selectedModel: string = 'perplexity') => {
    // Reset state
    setModelResponse('');
    setSummaryPoints([]);
    setTacticalSummary('');
    
    // Store the original query
    setOriginalQuery(query);
    
    // Set loading and show initial interpretation
    setLoading(true);
    setProcessingStage('initial');
    
    try {
      // In a real implementation, this would wait for an external model response
      // For now, simulate a delay before receiving a response
      await new Promise(resolve => setTimeout(resolve, 2000));
      
      // Simulate receiving a model response with the selected model name
      const simulatedResponse = `This is a simulated response to your query: "${query}" using ChatGPT and ${selectedModel}. In a real implementation, this would be the response from the selected AI models.`;
      
      // Process the model response
      setModelResponse(simulatedResponse);
      setSummaryPoints([
        `This is the first key point extracted from the ${selectedModel} response.`,
        `This is the second key point from the AI analysis using ${selectedModel}.`,
        `This is the third key point summarizing important information from ${selectedModel}.`
      ]);
      setTacticalSummary(`This is a tactical summary of the response from ${selectedModel}, offering structured next steps based on the AI model output.`);
      
      // Update the processing stage
      setProcessingStage('responseReceived');
    } catch (error) {
      console.error('Error processing query:', error);
      toast({
        title: 'Error',
        description: 'Failed to process your query. Please try again.',
        variant: 'destructive',
      });
    } finally {
      setLoading(false);
    }
  };

  return {
    loading,
    processingStage,
    originalQuery,
    modelResponse,
    summaryPoints,
    tacticalSummary,
    setProcessingStage,
    processQuery,
    setLoading,
    setModelResponse,
    setSummaryPoints,
    setTacticalSummary
  };
};
