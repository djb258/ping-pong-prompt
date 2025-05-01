
import React from "react";
import Navbar from "@/components/Navbar";

const Index = () => {
  return (
    <div className="min-h-screen">
      <Navbar />
      <div className="container mx-auto py-8">
        <h1 className="text-3xl font-bold">Welcome to Barton Ping-Pong App</h1>
        <p className="mt-4">
          This application helps manage prompts, route them through AI models, and provide structured responses.
        </p>
        <div className="mt-6">
          <p>Navigate to the Software page to manage your API keys.</p>
        </div>
      </div>
    </div>
  );
};

export default Index;
