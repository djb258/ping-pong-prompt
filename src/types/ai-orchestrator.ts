
export type ProcessingStage = 'idle' | 'initial' | 'responseReceived' | 'deepResearch' | 'operational';
export type ActionType = 'refine' | 'sendToGemini' | 'goDeep' | 'sendToNick' | 'email';
export type ModelAvailability = Record<string, boolean>;
