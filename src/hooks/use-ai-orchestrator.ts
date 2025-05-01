
import { useQueryProcessor } from './use-query-processor';
import { useAIModelStatus } from './use-ai-model-status';
import { useDeepResearch } from './use-deep-research';
import { useActionHandler } from './use-action-handler';
import { ActionType } from '@/types/ai-orchestrator';

export const useAIOrchestrator = () => {
  const {
    loading,
    processingStage,
    originalQuery,
    modelResponse,
    summaryPoints,
    tacticalSummary,
    setProcessingStage,
    processQuery,
    setLoading,
    setModelResponse,
    setSummaryPoints,
    setTacticalSummary
  } = useQueryProcessor();

  const { availableModels, setAvailableModels } = useAIModelStatus();

  const { handleDeepResearch } = useDeepResearch({
    loading,
    setLoading,
    originalQuery,
    modelResponse,
    setModelResponse,
    setSummaryPoints,
    setTacticalSummary,
    setProcessingStage,
    availableModels,
  });

  const { handleActionSelection } = useActionHandler({
    setLoading,
    setProcessingStage,
    originalQuery,
    setModelResponse,
    setSummaryPoints,
    setTacticalSummary,
    tacticalSummary,
    summaryPoints,
  });

  return {
    loading,
    processingStage,
    originalQuery,
    modelResponse,
    summaryPoints,
    tacticalSummary,
    processQuery,
    handleDeepResearch,
    handleActionSelection,
    availableModels,
  };
};
