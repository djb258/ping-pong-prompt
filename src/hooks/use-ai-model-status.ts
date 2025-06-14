
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
      console.log('Stored API keys:', storedKeys);
      
      if (storedKeys) {
        try {
          const apiKeys = JSON.parse(storedKeys);
          console.log('Parsed API keys:', apiKeys);
          
          const modelStatus: ModelAvailability = {
            chatgpt: false,
            perplexity: false,
            claude: false,
            gemini: false,
          };

          // Check each API key and map to model availability
          if (Array.isArray(apiKeys)) {
            apiKeys.forEach((keyObj: any) => {
              console.log('Processing key object:', keyObj);
              if (keyObj.key && keyObj.key.trim()) {
                const keyName = keyObj.name ? keyObj.name.toLowerCase() : '';
                console.log('Key name (lowercase):', keyName);
                
                if (keyName.includes('openai') || keyName.includes('chatgpt') || keyName.includes('gpt')) {
                  modelStatus.chatgpt = true;
                  console.log('Set ChatGPT to true');
                } else if (keyName.includes('perplexity')) {
                  modelStatus.perplexity = true;
                  console.log('Set Perplexity to true');
                } else if (keyName.includes('claude') || keyName.includes('anthropic')) {
                  modelStatus.claude = true;
                  console.log('Set Claude to true');
                } else if (keyName.includes('gemini') || keyName.includes('google')) {
                  modelStatus.gemini = true;
                  console.log('Set Gemini to true');
                }
              }
            });
          }

          console.log('Final model status:', modelStatus);
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
      } else {
        console.log('No API keys found in localStorage');
        setAvailableModels({
          chatgpt: false,
          perplexity: false,
          claude: false,
          gemini: false,
        });
      }
    };
    
    // Check on mount
    checkApiKeys();
    
    // Listen for storage changes to update when keys are added/removed
    const handleStorageChange = (e: StorageEvent) => {
      if (e.key === 'apiKeys') {
        console.log('Storage change detected for apiKeys');
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
