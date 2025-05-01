
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Check, X, Info, RefreshCw } from "lucide-react";
import { ApiKey } from "@/types/api-key";

interface ApiKeyListProps {
  apiKeys: ApiKey[];
  onCheckKey: (id: string) => void;
  onRefreshKey: (id: string) => void;
  onRemoveKey: (id: string) => void;
}

const ApiKeyList = ({ apiKeys, onCheckKey, onRefreshKey, onRemoveKey }: ApiKeyListProps) => {
  const getStatusIcon = (status: ApiKey["status"]) => {
    switch (status) {
      case "valid":
        return <Check className="text-green-500" />;
      case "invalid":
        return <X className="text-red-500" />;
      case "checking":
        return <div className="h-4 w-4 animate-spin rounded-full border-2 border-primary border-t-transparent" />;
      default:
        return <Info className="text-gray-500" />;
    }
  };

  const formatDate = (date: Date | null) => {
    if (!date) return "Never checked";
    return date.toLocaleString();
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>Your API Keys</CardTitle>
      </CardHeader>
      <CardContent>
        {apiKeys.length === 0 ? (
          <div className="text-center py-6 text-muted-foreground">
            No API keys added yet
          </div>
        ) : (
          <div className="space-y-4">
            {apiKeys.map((key) => (
              <div key={key.id} className="border rounded-md p-4">
                <div className="flex items-center justify-between">
                  <div>
                    <h3 className="font-medium">{key.name}</h3>
                    <p className="text-sm text-muted-foreground">
                      {key.key.substring(0, 3)}...{key.key.substring(key.key.length - 3)}
                    </p>
                    <p className="text-xs text-muted-foreground">
                      Last checked: {formatDate(key.lastChecked)}
                    </p>
                  </div>
                  <div className="flex items-center space-x-2">
                    <div className="flex items-center space-x-1">
                      {getStatusIcon(key.status)}
                      <span className="text-sm capitalize">{key.status}</span>
                    </div>
                    <Button 
                      variant="outline" 
                      size="sm"
                      onClick={() => onCheckKey(key.id)}
                      disabled={key.status === "checking"}
                    >
                      {key.status === "checking" ? "Checking..." : "Check"}
                    </Button>
                    <Button 
                      variant="outline" 
                      size="sm"
                      onClick={() => onRefreshKey(key.id)}
                      disabled={key.status === "checking"}
                    >
                      <RefreshCw className="h-4 w-4 mr-1" />
                      Refresh
                    </Button>
                    <Button 
                      variant="outline" 
                      size="sm"
                      onClick={() => onRemoveKey(key.id)}
                    >
                      Remove
                    </Button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </CardContent>
    </Card>
  );
};

export default ApiKeyList;
