
import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle, CardFooter } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { Check, X, Info } from "lucide-react";
import { toast } from "@/hooks/use-toast";

type ApiKey = {
  id: string;
  name: string;
  key: string;
  status: "valid" | "invalid" | "checking" | "unknown";
  lastChecked: Date | null;
};

const Software = () => {
  const [apiKeys, setApiKeys] = useState<ApiKey[]>([]);
  const [newKeyName, setNewKeyName] = useState('');
  const [newKeyValue, setNewKeyValue] = useState('');

  const addApiKey = () => {
    if (!newKeyName.trim() || !newKeyValue.trim()) {
      toast({
        title: "Error",
        description: "API key name and value are required",
        variant: "destructive",
      });
      return;
    }

    const newKey: ApiKey = {
      id: Date.now().toString(),
      name: newKeyName,
      key: newKeyValue,
      status: "unknown",
      lastChecked: null,
    };

    setApiKeys([...apiKeys, newKey]);
    setNewKeyName('');
    setNewKeyValue('');
    
    toast({
      title: "API Key Added",
      description: `${newKeyName} has been added successfully`,
    });
  };

  const checkApiKey = async (id: string) => {
    // Find the key to update
    const keyToCheck = apiKeys.find(key => key.id === id);
    if (!keyToCheck) return;

    // Update status to checking
    setApiKeys(apiKeys.map(key => 
      key.id === id ? { ...key, status: "checking" } : key
    ));

    // Simulate API check with a delay
    setTimeout(() => {
      // For demo purposes, alternate between valid and invalid
      const newStatus = Math.random() > 0.5 ? "valid" : "invalid";
      
      setApiKeys(apiKeys.map(key => 
        key.id === id ? { 
          ...key, 
          status: newStatus, 
          lastChecked: new Date() 
        } : key
      ));

      toast({
        title: "API Key Checked",
        description: `${keyToCheck.name} is ${newStatus}`,
        variant: newStatus === "valid" ? "default" : "destructive",
      });
    }, 1500);
  };

  const removeApiKey = (id: string) => {
    const keyToRemove = apiKeys.find(key => key.id === id);
    if (!keyToRemove) return;
    
    setApiKeys(apiKeys.filter(key => key.id !== id));
    
    toast({
      title: "API Key Removed",
      description: `${keyToRemove.name} has been removed`,
    });
  };

  const getStatusIcon = (status: ApiKey["status"]) => {
    switch (status) {
      case "valid":
        return <Check className="text-green-500" />;
      case "invalid":
        return <X className="text-red-500" />;
      case "checking":
        return <div className="h-4 w-4 animate-spin rounded-full border-2 border-primary border-t-transparent" />;
      default:
        return <Info className="text-gray-500" />;
    }
  };

  const formatDate = (date: Date | null) => {
    if (!date) return "Never checked";
    return date.toLocaleString();
  };

  return (
    <div className="container mx-auto py-8">
      <h1 className="text-3xl font-bold mb-6">Software API Keys</h1>
      
      <div className="grid gap-6 md:grid-cols-1 lg:grid-cols-2">
        <Card>
          <CardHeader>
            <CardTitle>Add New API Key</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="keyName">API Key Name</Label>
              <Input 
                id="keyName" 
                placeholder="Enter API key name (e.g., OpenAI, Perplexity)" 
                value={newKeyName}
                onChange={(e) => setNewKeyName(e.target.value)}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="keyValue">API Key Value</Label>
              <Input 
                id="keyValue" 
                placeholder="Enter your API key here" 
                type="password"
                value={newKeyValue}
                onChange={(e) => setNewKeyValue(e.target.value)}
              />
            </div>
          </CardContent>
          <CardFooter>
            <Button onClick={addApiKey}>Add API Key</Button>
          </CardFooter>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Your API Keys</CardTitle>
          </CardHeader>
          <CardContent>
            {apiKeys.length === 0 ? (
              <div className="text-center py-6 text-muted-foreground">
                No API keys added yet
              </div>
            ) : (
              <div className="space-y-4">
                {apiKeys.map((key) => (
                  <div key={key.id} className="border rounded-md p-4">
                    <div className="flex items-center justify-between">
                      <div>
                        <h3 className="font-medium">{key.name}</h3>
                        <p className="text-sm text-muted-foreground">
                          {key.key.substring(0, 3)}...{key.key.substring(key.key.length - 3)}
                        </p>
                        <p className="text-xs text-muted-foreground">
                          Last checked: {formatDate(key.lastChecked)}
                        </p>
                      </div>
                      <div className="flex items-center space-x-2">
                        <div className="flex items-center space-x-1">
                          {getStatusIcon(key.status)}
                          <span className="text-sm capitalize">{key.status}</span>
                        </div>
                        <Button 
                          variant="outline" 
                          size="sm"
                          onClick={() => checkApiKey(key.id)}
                          disabled={key.status === "checking"}
                        >
                          {key.status === "checking" ? "Checking..." : "Check"}
                        </Button>
                        <Button 
                          variant="outline" 
                          size="sm"
                          onClick={() => removeApiKey(key.id)}
                        >
                          Remove
                        </Button>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default Software;
