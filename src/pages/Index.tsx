import React, { useState } from "react";
import Navbar from "@/components/Navbar";
import { toast } from "sonner";
import { ModelResponse } from "@/components/ModelResponse";
import { useAIOrchestrator } from "@/hooks/use-ai-orchestrator";
import { ActionOptions } from "@/components/ActionOptions";
import AIModelsCard from "@/components/AIModelsCard";
import PromptForm from "@/components/PromptForm";
import PingPongExchangesList from "@/components/PingPongExchangesList";
import PingPongPrompt from "@/components/PingPongPrompt";
import PromptRefiner from "@/components/PromptRefiner";

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
  
  // Mock data for ping-pong exchanges (replace with actual Firebase data when connected)
  const mockExchanges = [
    {
      id: "1",
      input_prompt: "What is the capital of France?",
      output_response: "The capital of France is Paris. Paris is the largest city in France and serves as the country's political, economic, and cultural center.",
      timestamp_last_touched: "2024-06-13T10:30:00Z"
    },
    {
      id: "2", 
      input_prompt: "Explain quantum computing in simple terms",
      output_response: "Quantum computing is a type of computing that uses quantum mechanical phenomena to process information. Unlike classical computers that use bits (0 or 1), quantum computers use quantum bits or 'qubits' that can exist in multiple states simultaneously.",
      timestamp_last_touched: "2024-06-13T09:15:00Z"
    }
  ];
  
  const handleSubmitPrompt = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!prompt.trim()) {
      toast.error("Please enter a prompt first");
      return;
    }
    
    // TODO: Replace with actual Firebase write when Supabase is connected
    console.log("Writing to agent_task collection:", {
      agent_id: "mindpal",
      process_id: "pingpong_001", 
      blueprint_id: "pingpong_prompt_001",
      input_prompt: prompt,
      output_response: null,
      validated: false,
      timestamp_last_touched: new Date().toISOString()
    });
    
    toast.success("Prompt submitted to agent_task collection!");
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
        
        <div className="mt-8">
          <PromptRefiner onRefinedPromptReady={(refinedPrompt) => {
            console.log('Refined prompt ready:', refinedPrompt);
            toast.success('Refined prompt is ready for use!');
          }} />
        </div>
        
        <div className="mt-8">
          <PingPongPrompt />
        </div>
        
        <PingPongExchangesList exchanges={mockExchanges} />
        
        <div className="mt-6">
          <p>Navigate to the Software page to manage your API keys.</p>
          <p className="text-sm text-muted-foreground mt-2">
            Note: Please update the Firebase configuration in src/lib/firebase.ts with your actual Firebase project credentials.
          </p>
        </div>
      </div>
    </div>
  );
};

export default Index;
