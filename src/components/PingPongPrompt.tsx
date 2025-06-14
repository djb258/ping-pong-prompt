
import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { toast } from 'sonner';
import { db } from '@/lib/firebase';
import { doc, setDoc, getDoc } from 'firebase/firestore';
import { Loader2, Send } from 'lucide-react';

const PingPongPrompt: React.FC = () => {
  const [prompt, setPrompt] = useState('');
  const [response, setResponse] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [documentId, setDocumentId] = useState('');

  const sendPrompt = async () => {
    if (!prompt.trim()) {
      toast.error('Please enter a prompt');
      return;
    }

    setIsLoading(true);
    setResponse('');
    
    const timestamp = Date.now();
    const docId = `prompt_${timestamp}`;
    setDocumentId(docId);

    try {
      // Write to Firebase agent_task collection
      await setDoc(doc(db, 'agent_task', docId), {
        agent_id: 'lovable_dev_ui',
        process_id: 'pingpong_test_001',
        blueprint_id: 'pingpong_prompt_001',
        input_prompt: prompt,
        output_response: '',
        validated: false,
        timestamp_last_touched: new Date().toISOString()
      });

      toast.success('Prompt sent! Waiting for response...');
      
      // Start polling for response
      pollForResponse(docId);

    } catch (error) {
      console.error('Error sending prompt:', error);
      toast.error('Failed to send prompt');
      setIsLoading(false);
    }
  };

  const pollForResponse = async (docId: string) => {
    const maxAttempts = 60; // Poll for 3 minutes max (60 attempts * 3 seconds)
    let attempts = 0;

    const poll = async () => {
      try {
        const docRef = doc(db, 'agent_task', docId);
        const docSnap = await getDoc(docRef);

        if (docSnap.exists()) {
          const data = docSnap.data();
          
          if (data.validated && data.output_response) {
            setResponse(data.output_response);
            setIsLoading(false);
            toast.success('Response received!');
            return;
          }
        }

        attempts++;
        if (attempts < maxAttempts) {
          setTimeout(poll, 3000); // Poll every 3 seconds
        } else {
          setIsLoading(false);
          toast.error('Timeout: No response received within 3 minutes');
        }

      } catch (error) {
        console.error('Error polling for response:', error);
        setIsLoading(false);
        toast.error('Error checking for response');
      }
    };

    poll();
  };

  const handleReset = () => {
    setPrompt('');
    setResponse('');
    setDocumentId('');
  };

  return (
    <Card className="max-w-2xl mx-auto">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Send className="h-5 w-5" />
          Ping-Pong Prompt Tester
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <div>
          <label className="block text-sm font-medium mb-2">
            Enter your prompt:
          </label>
          <Input
            value={prompt}
            onChange={(e) => setPrompt(e.target.value)}
            placeholder="What color is the sky on a clear day?"
            disabled={isLoading}
          />
        </div>

        <div className="flex gap-2">
          <Button 
            onClick={sendPrompt} 
            disabled={isLoading || !prompt.trim()}
            className="flex-1"
          >
            {isLoading ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                Waiting for response...
              </>
            ) : (
              <>
                <Send className="mr-2 h-4 w-4" />
                Send Prompt
              </>
            )}
          </Button>
          
          <Button 
            onClick={handleReset} 
            variant="outline"
            disabled={isLoading}
          >
            Reset
          </Button>
        </div>

        {documentId && (
          <div className="text-sm text-muted-foreground">
            Document ID: {documentId}
          </div>
        )}

        {(response || isLoading) && (
          <div>
            <label className="block text-sm font-medium mb-2">
              Response:
            </label>
            <Textarea
              value={isLoading ? 'Polling for response...' : response}
              readOnly
              placeholder="Response will appear here..."
              className="min-h-[100px] bg-gray-50"
            />
          </div>
        )}

        {isLoading && (
          <div className="flex items-center justify-center p-4 bg-blue-50 rounded-md">
            <Loader2 className="mr-2 h-4 w-4 animate-spin" />
            <span className="text-sm text-blue-700">
              Checking Firebase every 3 seconds for Mindpal response...
            </span>
          </div>
        )}
      </CardContent>
    </Card>
  );
};

export default PingPongPrompt;
