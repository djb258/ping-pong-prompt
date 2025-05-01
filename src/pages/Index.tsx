
import React, { useState } from "react";
import Navbar from "@/components/Navbar";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { toast } from "sonner";
import { Search, ArrowRight, MessageSquare } from "lucide-react";
import { ModelResponse } from "@/components/ModelResponse";
import { useAIOrchestrator } from "@/hooks/use-ai-orchestrator";

const Index = () => {
  const [prompt, setPrompt] = useState("");
  const {
    loading,
    processingStage,
    modelResponse,
    summaryPoints,
    tacticalSummary,
    processQuery,
    handleActionSelection,
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
    
    // Process the query using the AI Orchestrator
    processQuery(prompt);
    toast.success("Processing your prompt through AI models...");
  };

  return (
    <div className="min-h-screen">
      <Navbar />
      <div className="container mx-auto py-8">
        <h1 className="text-3xl font-bold">Welcome to Barton Ping-Pong App</h1>
        <p className="mt-4">
          This application helps manage prompts, route them through AI models, and provide structured responses.
        </p>
        
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
              <div className="flex space-x-4">
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
              <Card className="mb-6">
                <CardContent className="pt-6">
                  <h3 className="font-medium mb-4">Next Actions:</h3>
                  <div className="flex flex-wrap gap-2">
                    <Button 
                      variant="outline" 
                      onClick={() => handleActionSelection('refine')}
                      disabled={loading}
                    >
                      Refine Prompt
                    </Button>
                    <Button 
                      variant="outline"
                      onClick={() => handleActionSelection('goDeep')}
                      disabled={loading}
                    >
                      Go Deeper
                    </Button>
                    <Button 
                      variant="outline"
                      onClick={() => handleActionSelection('sendToGemini')}
                      disabled={loading}
                    >
                      Send to Gemini
                    </Button>
                    <Button 
                      variant="outline"
                      onClick={() => handleActionSelection('sendToNick')}
                      disabled={loading}
                    >
                      Send to Nick
                    </Button>
                    <Button 
                      variant="outline"
                      onClick={() => handleActionSelection('email')}
                      disabled={loading}
                    >
                      Email Summary
                    </Button>
                  </div>
                </CardContent>
              </Card>
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
