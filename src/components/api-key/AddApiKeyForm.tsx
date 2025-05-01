
import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle, CardFooter } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { toast } from "@/hooks/use-toast";
import { ApiKey } from "@/types/api-key";

interface AddApiKeyFormProps {
  onAddKey: (key: ApiKey) => void;
}

const AddApiKeyForm = ({ onAddKey }: AddApiKeyFormProps) => {
  const [newKeyName, setNewKeyName] = useState('');
  const [newKeyValue, setNewKeyValue] = useState('');

  const handleAddKey = () => {
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

    onAddKey(newKey);
    setNewKeyName('');
    setNewKeyValue('');
    
    toast({
      title: "API Key Added",
      description: `${newKeyName} has been added successfully`,
    });
  };

  return (
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
        <Button onClick={handleAddKey}>Add API Key</Button>
      </CardFooter>
    </Card>
  );
};

export default AddApiKeyForm;
