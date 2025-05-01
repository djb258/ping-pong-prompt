
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';

type ActionType = 'refine' | 'sendToGemini' | 'goDeep' | 'sendToNick' | 'email';

interface ActionOptionsProps {
  onActionSelect: (action: ActionType) => void;
}

export const ActionOptions: React.FC<ActionOptionsProps> = ({ onActionSelect }) => {
  return (
    <Card className="mb-6">
      <CardHeader>
        <CardTitle className="text-lg">Recommended Actions</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="flex flex-wrap gap-3">
          <Button 
            variant="outline" 
            onClick={() => onActionSelect('refine')}
            className="flex-grow"
          >
            1. Refine Further
          </Button>
          
          <Button 
            variant="outline" 
            onClick={() => onActionSelect('sendToGemini')}
            className="flex-grow"
          >
            2. Send to Gemini
          </Button>
          
          <Button 
            variant="outline" 
            onClick={() => onActionSelect('goDeep')}
            className="flex-grow"
          >
            3. Go Deep
          </Button>
          
          <Button 
            variant="outline" 
            onClick={() => onActionSelect('sendToNick')}
            className="flex-grow"
          >
            4. Send to Operational Nick
          </Button>
          
          <Button 
            variant="outline" 
            onClick={() => onActionSelect('email')}
            className="flex-grow"
          >
            5. Email Summary
          </Button>
        </div>
      </CardContent>
    </Card>
  );
};
