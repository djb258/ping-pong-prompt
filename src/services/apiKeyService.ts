
import { ApiKey } from "@/types/api-key";
import { toast } from "@/hooks/use-toast";

export const checkApiKey = async (
  apiKey: ApiKey, 
  updateCallback: (key: ApiKey) => void
): Promise<void> => {
  // Update status to checking
  updateCallback({ ...apiKey, status: "checking" });

  // Simulate API check with a delay
  return new Promise((resolve) => {
    setTimeout(() => {
      // For demo purposes, alternate between valid and invalid
      const newStatus: ApiKey["status"] = Math.random() > 0.5 ? "valid" : "invalid";
      
      const updatedKey: ApiKey = { 
        ...apiKey, 
        status: newStatus, 
        lastChecked: new Date() 
      };
      
      updateCallback(updatedKey);

      toast({
        title: "API Key Checked",
        description: `${apiKey.name} is ${newStatus}`,
        variant: newStatus === "valid" ? "default" : "destructive",
      });

      resolve();
    }, 1500);
  });
};

export const refreshApiKey = async (
  apiKey: ApiKey,
  updateCallback: (key: ApiKey) => void
): Promise<void> => {
  // Update status to checking
  updateCallback({ ...apiKey, status: "checking" });

  // Simulate API refresh with a delay
  return new Promise((resolve) => {
    setTimeout(() => {
      const refreshedKeyValue = `refreshed_${Date.now()}_${Math.random().toString(36).substring(2, 10)}`;
      
      const updatedKey: ApiKey = { 
        ...apiKey, 
        key: refreshedKeyValue,
        status: "valid" as ApiKey["status"], 
        lastChecked: new Date() 
      };
      
      updateCallback(updatedKey);

      toast({
        title: "API Key Refreshed",
        description: `${apiKey.name} has been refreshed successfully`,
      });

      resolve();
    }, 1500);
  });
};
