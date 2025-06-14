
import React from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Bot } from "lucide-react";

interface AIModelsCardProps {
  availableModels: Record<string, boolean>;
}

const AIModelsCard: React.FC<AIModelsCardProps> = ({ availableModels }) => {
  // Filter to only show connected models
  const connectedModels = Object.entries(availableModels).filter(([_, isConnected]) => isConnected);
  
  // Model descriptions
  const modelDescriptions: Record<string, string> = {
    chatgpt: "Initial prompt processing and final summary generation",
    perplexity: "Deep research and additional context gathering", 
    claude: "Deep research and additional context gathering",
    gemini: "Deep research and additional context gathering"
  };

  if (connectedModels.length === 0) {
    return (
      <Card className="mt-6 max-w-2xl mx-auto bg-slate-50">
        <CardHeader>
          <CardTitle className="flex items-center">
            <Bot className="mr-2 h-5 w-5" />
            Connected LLM Models
          </CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-sm text-gray-600">
            No AI models are currently connected. Please add your API keys in the Software page to enable AI functionality.
          </p>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className="mt-6 max-w-2xl mx-auto bg-slate-50">
      <CardHeader>
        <CardTitle className="flex items-center">
          <Bot className="mr-2 h-5 w-5" />
          Connected LLM Models
        </CardTitle>
      </CardHeader>
      <CardContent>
        <p className="text-sm mb-3">
          The following AI models are connected and ready for use:
        </p>
        <div className="space-y-2">
          {connectedModels.map(([modelName, _]) => (
            <div key={modelName} className="flex items-center justify-between gap-2 p-2 border rounded bg-white">
              <div className="flex items-center gap-2">
                <div className="font-medium capitalize">{modelName}</div>
                <div className="text-sm text-gray-600">{modelDescriptions[modelName]}</div>
              </div>
              <Badge variant="success" className="ml-auto">
                Connected
              </Badge>
            </div>
          ))}
          <p className="text-xs text-gray-500 mt-2">
            The Ping-Pong feature routes your prompt through ChatGPT and your selected model to provide comprehensive responses
          </p>
        </div>
      </CardContent>
    </Card>
  );
};

export default AIModelsCard;
