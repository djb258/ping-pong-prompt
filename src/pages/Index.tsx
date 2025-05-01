
import React, { useState } from "react";
import Navbar from "@/components/Navbar";
import { toast } from "sonner";
import { ModelResponse } from "@/components/ModelResponse";
import { useAIOrchestrator } from "@/hooks/use-ai-orchestrator";
import { ActionOptions } from "@/components/ActionOptions";
import AIModelsCard from "@/components/AIModelsCard";
import PromptForm from "@/components/PromptForm";

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
    
    toast.success("Prompt submitted: " + prompt);
    console.log("Prompt submitted:", prompt);
  };

  const handlePingPong = () => {
    if (!prompt.trim()) {
      toast.error("Please enter a prompt first");
      return;
    }
    
    processQuery(prompt, selectedModel);
    toast.success(`Processing your prompt through ChatGPT and ${selectedModel}...`);
  };

  const handleDeepResearchClick = () => {
    if (!prompt.trim()) {
      toast.error("Please enter a prompt first");
      return;
    }
    
    if (processingStage === 'idle') {
      processQuery(prompt, selectedModel);
      toast.success(`First processing your prompt with ${selectedModel}, then performing deep research...`);
      setTimeout(() => handleDeepResearch(selectedModel), 3000);
    } else {
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
        
        <AIModelsCard availableModels={availableModels} />
        
        <PromptForm
          loading={loading}
          availableModels={availableModels}
          onSubmitPrompt={handleSubmitPrompt}
          onPingPong={handlePingPong}
          onDeepResearch={handleDeepResearchClick}
          prompt={prompt}
          setPrompt={setPrompt}
          selectedModel={selectedModel}
          setSelectedModel={setSelectedModel}
        />
        
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
