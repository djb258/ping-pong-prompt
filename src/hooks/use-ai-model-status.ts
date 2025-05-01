
import { useState, useEffect } from 'react';
import { ModelAvailability } from '@/types/ai-orchestrator';

export const useAIModelStatus = () => {
  const [availableModels, setAvailableModels] = useState<ModelAvailability>({
    chatgpt: false,
    perplexity: false,
    claude: false,
    gemini: false,
  });

  // Load API keys on mount - in a real app, this would check stored API keys
  useEffect(() => {
    // Simulate retrieving and checking API keys
    const checkApiKeys = async () => {
      // This would actually fetch from localStorage, API, or context in a real app
      // Changed to show all services as initially disconnected until API keys are added
      const mockApiStatus = {
        chatgpt: false,
        perplexity: false,
        claude: false, 
        gemini: false,
      };
      
      setAvailableModels(mockApiStatus);
    };
    
    checkApiKeys();
  }, []);

  return {
    availableModels,
    setAvailableModels
  };
};
