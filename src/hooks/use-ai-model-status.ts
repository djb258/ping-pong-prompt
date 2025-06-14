
import { useState, useEffect } from 'react';
import { ModelAvailability } from '@/types/ai-orchestrator';

export const useAIModelStatus = () => {
  const [availableModels, setAvailableModels] = useState<ModelAvailability>({
    chatgpt: false,
    perplexity: false,
    claude: false,
    gemini: false,
  });

  // Check API keys from localStorage and update model availability
  useEffect(() => {
    const checkApiKeys = () => {
      const storedKeys = localStorage.getItem('apiKeys');
      
      if (storedKeys) {
        try {
          const apiKeys = JSON.parse(storedKeys);
          const modelStatus: ModelAvailability = {
            chatgpt: false,
            perplexity: false,
            claude: false,
            gemini: false,
          };

          // Check each API key and map to model availability
          apiKeys.forEach((keyObj: any) => {
            if (keyObj.key && keyObj.key.trim()) {
              const keyName = keyObj.name.toLowerCase();
              
              if (keyName.includes('openai') || keyName.includes('chatgpt') || keyName.includes('gpt')) {
                modelStatus.chatgpt = true;
              } else if (keyName.includes('perplexity')) {
                modelStatus.perplexity = true;
              } else if (keyName.includes('claude') || keyName.includes('anthropic')) {
                modelStatus.claude = true;
              } else if (keyName.includes('gemini') || keyName.includes('google')) {
                modelStatus.gemini = true;
              }
            }
          });

          setAvailableModels(modelStatus);
        } catch (error) {
          console.error('Error parsing API keys:', error);
          setAvailableModels({
            chatgpt: false,
            perplexity: false,
            claude: false,
            gemini: false,
          });
        }
      }
    };
    
    // Check on mount
    checkApiKeys();
    
    // Listen for storage changes to update when keys are added/removed
    const handleStorageChange = (e: StorageEvent) => {
      if (e.key === 'apiKeys') {
        checkApiKeys();
      }
    };
    
    window.addEventListener('storage', handleStorageChange);
    
    // Also check periodically in case localStorage is updated in the same tab
    const interval = setInterval(checkApiKeys, 2000);
    
    return () => {
      window.removeEventListener('storage', handleStorageChange);
      clearInterval(interval);
    };
  }, []);

  return {
    availableModels,
    setAvailableModels
  };
};
