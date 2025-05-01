
import { useState, useEffect } from 'react';
import { useToast } from '@/components/ui/use-toast';
import { ApiKey } from '@/types/api-key';

type ProcessingStage = 'idle' | 'initial' | 'responseReceived' | 'deepResearch' | 'operational';
type ActionType = 'refine' | 'sendToGemini' | 'goDeep' | 'sendToNick' | 'email';
type ModelAvailability = Record<string, boolean>;

export const useAIOrchestrator = () => {
  const [loading, setLoading] = useState(false);
  const [processingStage, setProcessingStage] = useState<ProcessingStage>('idle');
  const [originalQuery, setOriginalQuery] = useState('');
  const [modelResponse, setModelResponse] = useState('');
  const [summaryPoints, setSummaryPoints] = useState<string[]>([]);
  const [tacticalSummary, setTacticalSummary] = useState('');
  const [availableModels, setAvailableModels] = useState<ModelAvailability>({
    chatgpt: false, // Changed to false to properly reflect the initial disconnected state
    perplexity: false,
    claude: false,
    gemini: false,
  });
  const { toast } = useToast();

  // Load API keys on mount - in a real app, this would check stored API keys
  useEffect(() => {
    // Simulate retrieving and checking API keys
    const checkApiKeys = async () => {
      // This would actually fetch from localStorage, API, or context in a real app
      // Changed to show all services as initially disconnected until API keys are added
      const mockApiStatus = {
        chatgpt: false, // Changed to false to show as disconnected
        perplexity: false,
        claude: false, 
        gemini: false,
      };
      
      setAvailableModels(mockApiStatus);
    };
    
    checkApiKeys();
  }, []);

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
      
      // Update with deep research results specifically mentioning it's from the selected model
      setModelResponse(prevResponse => 
        `${prevResponse}\n\nDEEP RESEARCH RESULTS FROM ${selectedModel.toUpperCase()}: Additional detailed information based on your query about "${originalQuery}".`
      );
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
          
          // Update with deep research results
          setModelResponse(prevResponse => 
            `${prevResponse}\n\nDEEP RESEARCH RESULTS: Additional detailed information based on your query about "${originalQuery}".`
          );
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
    loading,
    processingStage,
    originalQuery,
    modelResponse,
    summaryPoints,
    tacticalSummary,
    processQuery,
    handleDeepResearch,
    handleActionSelection,
    availableModels,
  };
};
