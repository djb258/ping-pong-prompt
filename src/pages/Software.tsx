
import React, { useState, useEffect } from 'react';
import { toast } from "@/hooks/use-toast";
import Navbar from "@/components/Navbar";
import AddApiKeyForm from "@/components/api-key/AddApiKeyForm";
import ApiKeyList from "@/components/api-key/ApiKeyList";
import { ApiKey } from "@/types/api-key";
import { checkApiKey, refreshApiKey } from "@/services/apiKeyService";

const Software = () => {
  const [apiKeys, setApiKeys] = useState<ApiKey[]>([]);

  // Load API keys from localStorage on component mount
  useEffect(() => {
    const storedKeys = localStorage.getItem('apiKeys');
    if (storedKeys) {
      try {
        const parsedKeys = JSON.parse(storedKeys);
        setApiKeys(parsedKeys);
      } catch (error) {
        console.error('Error parsing stored API keys:', error);
      }
    }
  }, []);

  // Save API keys to localStorage whenever apiKeys state changes
  useEffect(() => {
    localStorage.setItem('apiKeys', JSON.stringify(apiKeys));
    console.log('Saved API keys to localStorage:', apiKeys);
  }, [apiKeys]);

  const handleAddApiKey = (newKey: ApiKey) => {
    setApiKeys([...apiKeys, newKey]);
  };

  const handleCheckApiKey = async (id: string) => {
    const keyToCheck = apiKeys.find(key => key.id === id);
    if (!keyToCheck) return;

    await checkApiKey(keyToCheck, (updatedKey) => {
      setApiKeys(apiKeys.map(key => 
        key.id === id ? updatedKey : key
      ));
    });
  };

  const handleRefreshApiKey = async (id: string) => {
    const keyToRefresh = apiKeys.find(key => key.id === id);
    if (!keyToRefresh) return;
    
    await refreshApiKey(keyToRefresh, (updatedKey) => {
      setApiKeys(apiKeys.map(key => 
        key.id === id ? updatedKey : key
      ));
    });
  };

  const handleRemoveApiKey = (id: string) => {
    const keyToRemove = apiKeys.find(key => key.id === id);
    if (!keyToRemove) return;
    
    setApiKeys(apiKeys.filter(key => key.id !== id));
    
    toast({
      title: "API Key Removed",
      description: `${keyToRemove.name} has been removed`,
    });
  };

  return (
    <div className="min-h-screen">
      <Navbar />
      <div className="container mx-auto py-8">
        <h1 className="text-3xl font-bold mb-6">Software API Keys</h1>
        
        <div className="grid gap-6 md:grid-cols-1 lg:grid-cols-2">
          <AddApiKeyForm onAddKey={handleAddApiKey} />
          <ApiKeyList 
            apiKeys={apiKeys} 
            onCheckKey={handleCheckApiKey}
            onRefreshKey={handleRefreshApiKey}
            onRemoveKey={handleRemoveApiKey}
          />
        </div>
      </div>
    </div>
  );
};

export default Software;
