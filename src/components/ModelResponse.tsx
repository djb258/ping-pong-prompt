
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Separator } from '@/components/ui/separator';

interface ModelResponseProps {
  modelResponse: string;
  summaryPoints: string[];
  tacticalSummary: string;
}

export const ModelResponse: React.FC<ModelResponseProps> = ({ 
  modelResponse, 
  summaryPoints,
  tacticalSummary
}) => {
  return (
    <Card className="mb-6">
      <CardHeader>
        <CardTitle className="text-lg">AI Response Summary</CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <div>
          <h3 className="font-medium text-sm text-muted-foreground mb-2">KEY POINTS:</h3>
          <ul className="list-disc pl-5 space-y-1">
            {summaryPoints.map((point, index) => (
              <li key={index}>{point}</li>
            ))}
          </ul>
        </div>
        
        <Separator />
        
        <div>
          <h3 className="font-medium text-sm text-muted-foreground mb-2">TACTICAL SUMMARY:</h3>
          <p>{tacticalSummary}</p>
        </div>
        
        <Separator />
        
        <div>
          <h3 className="font-medium text-sm text-muted-foreground mb-2">FULL RESPONSE:</h3>
          <div className="bg-muted/50 p-3 rounded-md text-sm max-h-[300px] overflow-y-auto">
            {modelResponse}
          </div>
        </div>
      </CardContent>
    </Card>
  );
};
