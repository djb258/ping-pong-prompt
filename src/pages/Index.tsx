
import React, { useState } from "react";
import Navbar from "@/components/Navbar";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { toast } from "sonner";
import { Search, ArrowRight, MessageSquare, Bot, Database } from "lucide-react";
import { ModelResponse } from "@/components/ModelResponse";
import { useAIOrchestrator } from "@/hooks/use-ai-orchestrator";
import { 
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue 
} from "@/components/ui/select";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import { ActionOptions } from "@/components/ActionOptions";

const Index = () => {
  const [prompt, setPrompt] = useState("");
  const [selectedModel, setSelectedModel] = useState("perplexity");
  const {
    loading,
    processingStage,
    modelResponse,
    summaryPoints,
    tacticalSummary,
    processQuery,
    handleDeepResearch,
    handleActionSelection,
    availableModels,
  } = useAIOrchestrator();
  
  const handleSubmitPrompt = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!prompt.trim()) {
      toast.error("Please enter a prompt first");
      return;
    }
    
    // Handle prompt submission - for now just show a toast
    toast.success("Prompt submitted: " + prompt);
    console.log("Prompt submitted:", prompt);
  };

  const handlePingPong = () => {
    if (!prompt.trim()) {
      toast.error("Please enter a prompt first");
      return;
    }
    
    // Process the query using the AI Orchestrator with the selected model
    processQuery(prompt, selectedModel);
    toast.success(`Processing your prompt through ChatGPT and ${selectedModel}...`);
  };

  const handleDeepResearchClick = () => {
    if (!prompt.trim()) {
      toast.error("Please enter a prompt first");
      return;
    }
    
    // If no response yet, do a regular query first
    if (processingStage === 'idle') {
      processQuery(prompt, selectedModel);
      toast.success(`First processing your prompt with ${selectedModel}, then performing deep research...`);
      setTimeout(() => handleDeepResearch(selectedModel), 3000); // Wait for initial processing
    } else {
      // If we already have a response, go straight to deep research
      handleDeepResearch(selectedModel);
    }
  };

  return (
    <div className="min-h-screen">
      <Navbar />
      <div className="container mx-auto py-8">
        <h1 className="text-3xl font-bold">Welcome to Barton Ping-Pong App</h1>
        <p className="mt-4">
          This application helps manage prompts, route them through AI models, and provide structured responses.
        </p>
        
        {/* AI Models Information Card */}
        <Card className="mt-6 max-w-2xl mx-auto bg-slate-50">
          <CardHeader>
            <CardTitle className="flex items-center">
              <Bot className="mr-2 h-5 w-5" />
              AI Models
            </CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-sm mb-3">
              This application uses multiple AI models for prompt processing and refinement:
            </p>
            <div className="space-y-2">
              <div className="flex items-center justify-between gap-2 p-2 border rounded bg-white">
                <div className="flex items-center gap-2">
                  <div className="font-medium">ChatGPT</div>
                  <div className="text-sm text-gray-600">Initial prompt processing and final summary generation</div>
                </div>
                <Badge variant={availableModels.chatgpt ? "success" : "destructive"} className="ml-auto">
                  {availableModels.chatgpt ? "Connected" : "Not Connected"}
                </Badge>
              </div>
              {Object.entries(availableModels).filter(([key]) => key !== "chatgpt").map(([key, isAvailable]) => (
                <div key={key} className="flex items-center justify-between gap-2 p-2 border rounded bg-white">
                  <div className="flex items-center gap-2">
                    <div className="font-medium capitalize">{key}</div>
                    <div className="text-sm text-gray-600">Deep research and additional context gathering</div>
                  </div>
                  <Badge variant={isAvailable ? "success" : "destructive"} className="ml-auto">
                    {isAvailable ? "Connected" : "Not Connected"}
                  </Badge>
                </div>
              ))}
              <p className="text-xs text-gray-500 mt-2">
                The Ping-Pong feature routes your prompt through ChatGPT and your selected model to provide comprehensive responses
              </p>
            </div>
          </CardContent>
        </Card>
        
        <Card className="mt-8 max-w-2xl mx-auto">
          <CardHeader>
            <CardTitle>Enter Your Prompt</CardTitle>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmitPrompt} className="space-y-4">
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
                  onClick={handlePingPong} 
                  variant="secondary" 
                  className="flex-1"
                  disabled={loading}
                >
                  <MessageSquare className="mr-2 h-4 w-4" />
                  Ping-Pong AI
                </Button>
                <Button 
                  type="button" 
                  onClick={handleDeepResearchClick} 
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
        
        {processingStage !== 'idle' && (
          <div className="mt-6 max-w-3xl mx-auto">
            <ModelResponse 
              modelResponse={modelResponse} 
              summaryPoints={summaryPoints} 
              tacticalSummary={tacticalSummary} 
            />
            
            {processingStage === 'responseReceived' && (
              <ActionOptions onActionSelect={handleActionSelection} />
            )}
          </div>
        )}
        
        <div className="mt-6">
          <p>Navigate to the Software page to manage your API keys.</p>
        </div>
      </div>
    </div>
  );
};

export default Index;
