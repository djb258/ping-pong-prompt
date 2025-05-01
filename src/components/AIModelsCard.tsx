
import React from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Bot } from "lucide-react";

interface AIModelsCardProps {
  availableModels: Record<string, boolean>;
}

const AIModelsCard: React.FC<AIModelsCardProps> = ({ availableModels }) => {
  return (
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
  );
};

export default AIModelsCard;
