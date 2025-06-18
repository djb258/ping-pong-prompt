
import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { toast } from 'sonner';
import { Loader2, Send, CheckCircle, XCircle } from 'lucide-react';

const RenderPingPong: React.FC = () => {
  const [prompt, setPrompt] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [serverResponse, setServerResponse] = useState<string>('');
  const [responseStatus, setResponseStatus] = useState<'success' | 'error' | null>(null);

  const handleSendPrompt = async () => {
    if (!prompt.trim()) {
      toast.error('Please enter a prompt');
      return;
    }

    setIsLoading(true);
    setServerResponse('');
    setResponseStatus(null);

    try {
      const response = await fetch('https://render-endpoint.onrender.com', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ prompt }),
      });

      const responseText = await response.text();
      
      if (response.ok) {
        setServerResponse(responseText);
        setResponseStatus('success');
        toast.success('Prompt sent successfully!');
      } else {
        setServerResponse(`Error: ${response.status} - ${responseText}`);
        setResponseStatus('error');
        toast.error('Failed to send prompt');
      }
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Unknown error occurred';
      setServerResponse(`Network Error: ${errorMessage}`);
      setResponseStatus('error');
      toast.error('Network error occurred');
    } finally {
      setIsLoading(false);
    }
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !isLoading) {
      handleSendPrompt();
    }
  };

  return (
    <Card className="max-w-2xl mx-auto">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Send className="h-5 w-5" />
          Render Ping-Pong Prompt
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="flex gap-2">
          <Input
            value={prompt}
            onChange={(e) => setPrompt(e.target.value)}
            onKeyPress={handleKeyPress}
            placeholder="Enter your prompt here..."
            disabled={isLoading}
            className="flex-1"
          />
          <Button 
            onClick={handleSendPrompt} 
            disabled={isLoading || !prompt.trim()}
          >
            {isLoading ? (
              <Loader2 className="h-4 w-4 animate-spin" />
            ) : (
              <Send className="h-4 w-4" />
            )}
          </Button>
        </div>

        {serverResponse && (
          <div className={`p-4 rounded-md border ${
            responseStatus === 'success' 
              ? 'bg-green-50 border-green-200' 
              : 'bg-red-50 border-red-200'
          }`}>
            <div className="flex items-start gap-2">
              {responseStatus === 'success' ? (
                <CheckCircle className="h-5 w-5 text-green-600 mt-0.5 flex-shrink-0" />
              ) : (
                <XCircle className="h-5 w-5 text-red-600 mt-0.5 flex-shrink-0" />
              )}
              <div className="flex-1">
                <p className={`text-sm font-medium ${
                  responseStatus === 'success' ? 'text-green-800' : 'text-red-800'
                }`}>
                  Server Response:
                </p>
                <p className={`text-sm mt-1 ${
                  responseStatus === 'success' ? 'text-green-700' : 'text-red-700'
                }`}>
                  {serverResponse}
                </p>
              </div>
            </div>
          </div>
        )}

        {isLoading && (
          <div className="flex items-center justify-center p-4 bg-blue-50 rounded-md">
            <Loader2 className="mr-2 h-4 w-4 animate-spin" />
            <span className="text-sm text-blue-700">
              Sending to Render endpoint...
            </span>
          </div>
        )}
      </CardContent>
    </Card>
  );
};

export default RenderPingPong;
