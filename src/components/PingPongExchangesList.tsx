
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { ScrollArea } from '@/components/ui/scroll-area';
import { formatDistanceToNow } from 'date-fns';

interface PingPongExchange {
  id: string;
  input_prompt: string;
  output_response: string;
  timestamp_last_touched: string;
}

interface PingPongExchangesListProps {
  exchanges: PingPongExchange[];
  loading?: boolean;
}

const PingPongExchangesList: React.FC<PingPongExchangesListProps> = ({ 
  exchanges, 
  loading = false 
}) => {
  if (loading) {
    return (
      <Card className="mt-6">
        <CardHeader>
          <CardTitle>Ping-Pong Exchanges</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="text-center py-8 text-muted-foreground">
            Loading exchanges...
          </div>
        </CardContent>
      </Card>
    );
  }

  if (exchanges.length === 0) {
    return (
      <Card className="mt-6">
        <CardHeader>
          <CardTitle>Ping-Pong Exchanges</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="text-center py-8 text-muted-foreground">
            No validated exchanges found. Submit a prompt to get started!
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className="mt-6">
      <CardHeader>
        <CardTitle>Ping-Pong Exchanges ({exchanges.length})</CardTitle>
      </CardHeader>
      <CardContent>
        <ScrollArea className="h-[600px] w-full pr-4">
          <div className="space-y-4">
            {exchanges.map((exchange) => (
              <div 
                key={exchange.id} 
                className="border border-gray-200 rounded-lg p-4 bg-gray-50"
              >
                <div className="space-y-3">
                  <div>
                    <h4 className="font-semibold text-sm text-gray-700 mb-1">
                      Prompt:
                    </h4>
                    <p className="text-gray-900 bg-white p-3 rounded border">
                      {exchange.input_prompt}
                    </p>
                  </div>
                  
                  <div>
                    <h4 className="font-semibold text-sm text-gray-700 mb-1">
                      Response:
                    </h4>
                    <div className="text-gray-900 bg-white p-3 rounded border prose prose-sm max-w-none">
                      {exchange.output_response}
                    </div>
                  </div>
                  
                  <div className="flex justify-between items-center text-xs text-gray-500 pt-2 border-t">
                    <span>
                      <strong>Timestamp:</strong> {exchange.timestamp_last_touched}
                    </span>
                    <span>
                      {formatDistanceToNow(new Date(exchange.timestamp_last_touched), { 
                        addSuffix: true 
                      })}
                    </span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </ScrollArea>
      </CardContent>
    </Card>
  );
};

export default PingPongExchangesList;
