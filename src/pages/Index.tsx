
import React, { useState } from "react";
import Navbar from "@/components/Navbar";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { toast } from "sonner";
import { Search } from "lucide-react";

const Index = () => {
  const [prompt, setPrompt] = useState("");
  
  const handleSubmitPrompt = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!prompt.trim()) {
      toast.error("Please enter a prompt first");
      return;
    }
    
    // Handle prompt submission - for now just show a toast
    toast.success("Prompt submitted: " + prompt);
    console.log("Prompt submitted:", prompt);
  };

  return (
    <div className="min-h-screen">
      <Navbar />
      <div className="container mx-auto py-8">
        <h1 className="text-3xl font-bold">Welcome to Barton Ping-Pong App</h1>
        <p className="mt-4">
          This application helps manage prompts, route them through AI models, and provide structured responses.
        </p>
        
        <Card className="mt-8 max-w-2xl mx-auto">
          <CardHeader>
            <CardTitle>Enter Your Prompt</CardTitle>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmitPrompt} className="space-y-4">
              <div className="flex flex-col space-y-2">
                <Input
                  placeholder="Type your prompt here..."
                  value={prompt}
                  onChange={(e) => setPrompt(e.target.value)}
                  className="flex-1"
                />
              </div>
              <Button type="submit" className="w-full">
                <Search className="mr-2 h-4 w-4" />
                Submit Prompt
              </Button>
            </form>
          </CardContent>
        </Card>
        
        <div className="mt-6">
          <p>Navigate to the Software page to manage your API keys.</p>
        </div>
      </div>
    </div>
  );
};

export default Index;
