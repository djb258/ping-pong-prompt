
import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Textarea } from '@/components/ui/textarea';
import { toast } from 'sonner';
import { db } from '@/lib/firebase';
import { doc, setDoc, getDoc } from 'firebase/firestore';
import { Loader2, Zap, Download } from 'lucide-react';

interface PromptRefinerProps {
  onRefinedPromptReady?: (prompt: string) => void;
}

const PromptRefiner: React.FC<PromptRefinerProps> = ({ onRefinedPromptReady }) => {
  const [userInput, setUserInput] = useState('');
  const [selectedBlueprint, setSelectedBlueprint] = useState('prompt_refiner_001');
  const [isRefining, setIsRefining] = useState(false);
  const [isPulling, setIsPulling] = useState(false);
  const [refinedPrompt, setRefinedPrompt] = useState('');

  const blueprintOptions = [
    { value: 'prompt_refiner_001', label: 'Basic Refinement' },
    { value: 'prompt_refiner_search_002', label: 'Search Optimized' },
    { value: 'prompt_refiner_creative_003', label: 'Creative Enhancement' },
    { value: 'prompt_refiner_technical_004', label: 'Technical Precision' }
  ];

  const pushToFirebase = async () => {
    if (!userInput.trim()) {
      toast.error('Please enter a prompt to refine');
      return;
    }

    setIsRefining(true);
    const timestamp = Date.now();
    const docId = `refiner_${timestamp}`;

    try {
      await setDoc(doc(db, 'agent_task', docId), {
        agent_id: 'prompt_refiner',
        process_id: 'refinement_process_001',
        blueprint_id: selectedBlueprint,
        input_prompt: userInput,
        output_response: '',
        validated: false,
        timestamp_last_touched: new Date().toISOString(),
        task_type: 'prompt_refinement'
      });

      toast.success('Prompt sent for refinement!');
      console.log('Prompt refinement task created:', docId);
      
      // Start polling for the refined result
      pollForRefinedPrompt(docId);

    } catch (error) {
      console.error('Error pushing to Firebase:', error);
      toast.error('Failed to send prompt for refinement');
      setIsRefining(false);
    }
  };

  const pollForRefinedPrompt = async (docId: string) => {
    const maxAttempts = 40; // Poll for 2 minutes max
    let attempts = 0;

    const poll = async () => {
      try {
        const docRef = doc(db, 'agent_task', docId);
        const docSnap = await getDoc(docRef);

        if (docSnap.exists()) {
          const data = docSnap.data();
          
          if (data.validated && data.output_response) {
            setRefinedPrompt(data.output_response);
            setIsRefining(false);
            toast.success('Refined prompt received!');
            
            if (onRefinedPromptReady) {
              onRefinedPromptReady(data.output_response);
            }
            return;
          }
        }

        attempts++;
        if (attempts < maxAttempts) {
          setTimeout(poll, 3000);
        } else {
          setIsRefining(false);
          toast.error('Timeout: Refinement took too long');
        }

      } catch (error) {
        console.error('Error polling for refined prompt:', error);
        setIsRefining(false);
        toast.error('Error checking refinement status');
      }
    };

    poll();
  };

  const pullFromFirebase = async () => {
    if (!refinedPrompt) {
      toast.error('No refined prompt available to pull');
      return;
    }

    setIsPulling(true);
    
    try {
      // Simulate pulling refined prompt (you can expand this logic)
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      toast.success('Refined prompt pulled successfully!');
      console.log('Pulled refined prompt:', refinedPrompt);
      
    } catch (error) {
      console.error('Error pulling refined prompt:', error);
      toast.error('Failed to pull refined prompt');
    } finally {
      setIsPulling(false);
    }
  };

  const handleReset = () => {
    setUserInput('');
    setRefinedPrompt('');
    setSelectedBlueprint('prompt_refiner_001');
  };

  return (
    <Card className="max-w-2xl mx-auto">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Zap className="h-5 w-5" />
          Prompt Refiner
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <div>
          <label className="block text-sm font-medium mb-2">
            Raw Prompt Input:
          </label>
          <Textarea
            value={userInput}
            onChange={(e) => setUserInput(e.target.value)}
            placeholder="Enter your raw prompt that needs refinement..."
            className="min-h-[80px]"
            disabled={isRefining}
          />
        </div>

        <div>
          <label className="block text-sm font-medium mb-2">
            Blueprint Selection:
          </label>
          <Select value={selectedBlueprint} onValueChange={setSelectedBlueprint} disabled={isRefining}>
            <SelectTrigger>
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              {blueprintOptions.map(option => (
                <SelectItem key={option.value} value={option.value}>
                  {option.label}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        <div className="flex gap-2">
          <Button 
            onClick={pushToFirebase} 
            disabled={isRefining || !userInput.trim()}
            className="flex-1"
          >
            {isRefining ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                Refining...
              </>
            ) : (
              <>
                <Zap className="mr-2 h-4 w-4" />
                Push & Refine
              </>
            )}
          </Button>
          
          <Button 
            onClick={pullFromFirebase} 
            variant="outline"
            disabled={isPulling || !refinedPrompt}
          >
            {isPulling ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                Pulling...
              </>
            ) : (
              <>
                <Download className="mr-2 h-4 w-4" />
                Pull Result
              </>
            )}
          </Button>
          
          <Button 
            onClick={handleReset} 
            variant="secondary"
            disabled={isRefining || isPulling}
          >
            Reset
          </Button>
        </div>

        {refinedPrompt && (
          <div>
            <label className="block text-sm font-medium mb-2">
              Refined Prompt:
            </label>
            <Textarea
              value={refinedPrompt}
              readOnly
              className="min-h-[100px] bg-gray-50"
            />
          </div>
        )}

        {isRefining && (
          <div className="flex items-center justify-center p-4 bg-blue-50 rounded-md">
            <Loader2 className="mr-2 h-4 w-4 animate-spin" />
            <span className="text-sm text-blue-700">
              Waiting for prompt refinement from Mindpal agent...
            </span>
          </div>
        )}
      </CardContent>
    </Card>
  );
};

export default PromptRefiner;
