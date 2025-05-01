
import React, { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Label } from "@/components/ui/label";
import { Search, MessageSquare, Database } from "lucide-react";
import { toast } from "sonner";

interface PromptFormProps {
  loading: boolean;
  availableModels: Record<string, boolean>;
  onSubmitPrompt: (e: React.FormEvent) => void;
  onPingPong: () => void;
  onDeepResearch: () => void;
  prompt: string;
  setPrompt: (prompt: string) => void;
  selectedModel: string;
  setSelectedModel: (model: string) => void;
}

const PromptForm: React.FC<PromptFormProps> = ({
  loading,
  availableModels,
  onSubmitPrompt,
  onPingPong,
  onDeepResearch,
  prompt,
  setPrompt,
  selectedModel,
  setSelectedModel,
}) => {
  return (
    <Card className="mt-8 max-w-2xl mx-auto">
      <CardHeader>
        <CardTitle>Enter Your Prompt</CardTitle>
      </CardHeader>
      <CardContent>
        <form onSubmit={onSubmitPrompt} className="space-y-4">
          <div className="flex flex-col space-y-2">
            <Input
              placeholder="Type your prompt here..."
              value={prompt}
              onChange={(e) => setPrompt(e.target.value)}
              className="flex-1"
            />
          </div>
          
          <div className="bg-slate-50 p-4 rounded-md">
            <h3 className="text-sm font-medium mb-3">Select Secondary AI Model</h3>
            <RadioGroup 
              value={selectedModel} 
              onValueChange={setSelectedModel}
              className="grid grid-cols-1 sm:grid-cols-2 gap-2"
            >
              {Object.entries(availableModels).filter(([key]) => key !== "chatgpt").map(([key, isAvailable]) => (
                <div key={key} className="flex items-center space-x-2">
                  <RadioGroupItem value={key} id={key} disabled={!isAvailable} />
                  <Label htmlFor={key} className="capitalize flex items-center gap-2">
                    {key}
                    <span className={`h-2 w-2 rounded-full ${isAvailable ? 'bg-green-500' : 'bg-red-500'}`}></span>
                  </Label>
                </div>
              ))}
            </RadioGroup>
          </div>
          
          <div className="flex flex-col md:flex-row space-y-3 md:space-y-0 md:space-x-4">
            <Button type="submit" className="flex-1">
              <Search className="mr-2 h-4 w-4" />
              Submit Prompt
            </Button>
            <Button 
              type="button" 
              onClick={onPingPong} 
              variant="secondary" 
              className="flex-1"
              disabled={loading}
            >
              <MessageSquare className="mr-2 h-4 w-4" />
              Ping-Pong AI
            </Button>
            <Button 
              type="button" 
              onClick={onDeepResearch} 
              variant="outline" 
              className="flex-1"
              disabled={loading || (!availableModels[selectedModel])}
            >
              <Database className="mr-2 h-4 w-4" />
              Deep Research
            </Button>
          </div>
        </form>
      </CardContent>
    </Card>
  );
};

export default PromptForm;
