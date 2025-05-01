
export type ApiKey = {
  id: string;
  name: string;
  key: string;
  status: "valid" | "invalid" | "checking" | "unknown";
  lastChecked: Date | null;
};
