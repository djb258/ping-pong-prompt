
import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { useToast } from '@/components/ui/use-toast';
import { ModelResponse } from '@/components/ModelResponse';
import { ActionOptions } from '@/components/ActionOptions';
import { useAIOrchestrator } from '@/hooks/use-ai-orchestrator';

const Index = () => {
  const [userQuery, setUserQuery] = useState('');
  const [isExpanded, setIsExpanded] = useState(false);
  const { toast } = useToast();
  const { 
    processQuery, 
    loading, 
    modelResponse, 
    summaryPoints, 
    tacticalSummary,
    processingStage,
    handleActionSelection
  } = useAIOrchestrator();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!userQuery.trim()) {
      toast({
        title: "Empty Query",
        description: "Please enter a query to process.",
        variant: "destructive",
      });
      return;
    }
    
    await processQuery(userQuery);
  };

  return (
    <div className="container mx-auto p-4 max-w-4xl">
      <Card className="mb-8 bg-background shadow-lg">
        <CardHeader className="bg-primary/5">
          <CardTitle className="text-2xl font-bold">Barton Ping-Pong App</CardTitle>
          <CardDescription>
            AI Orchestration System
          </CardDescription>
        </CardHeader>
        <CardContent className="pt-6">
          <form onSubmit={handleSubmit} className="space-y-4">
            {isExpanded ? (
              <Textarea 
                value={userQuery}
                onChange={(e) => setUserQuery(e.target.value)}
                placeholder="Enter your query here..."
                className="w-full min-h-[150px]"
              />
            ) : (
              <div className="flex gap-2">
                <Input
                  value={userQuery}
                  onChange={(e) => setUserQuery(e.target.value)}
                  placeholder="Enter your query here..."
                  className="flex-1"
                />
                <Button
                  type="button"
                  variant="outline"
                  onClick={() => setIsExpanded(true)}
                  size="icon"
                >
                  ↕️
                </Button>
              </div>
            )}
            <div className="flex justify-end space-x-2">
              {isExpanded && (
                <Button 
                  type="button" 
                  variant="outline"
                  onClick={() => setIsExpanded(false)}
                >
                  Collapse
                </Button>
              )}
              <Button type="submit" disabled={loading}>
                {loading ? "Processing..." : "Submit"}
              </Button>
            </div>
          </form>
        </CardContent>
      </Card>

      {processingStage === 'initial' && userQuery && (
        <Card className="mb-6 border-primary/20">
          <CardHeader>
            <CardTitle className="text-lg">Initial Interpretation</CardTitle>
          </CardHeader>
          <CardContent>
            <p>I understand you want to know about: <strong>{userQuery}</strong></p>
            <p className="text-muted-foreground mt-2">Waiting for model response...</p>
          </CardContent>
        </Card>
      )}

      {modelResponse && processingStage === 'responseReceived' && (
        <>
          <ModelResponse 
            modelResponse={modelResponse} 
            summaryPoints={summaryPoints} 
            tacticalSummary={tacticalSummary} 
          />
          <ActionOptions onActionSelect={handleActionSelection} />
        </>
      )}
      
      {processingStage === 'deepResearch' && (
        <Card className="mb-6 border-primary/20">
          <CardHeader>
            <CardTitle className="text-lg">Deep Research Mode</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-muted-foreground">Conducting deeper research on your query. Please wait...</p>
          </CardContent>
        </Card>
      )}
    </div>
  );
};

export default Index;
