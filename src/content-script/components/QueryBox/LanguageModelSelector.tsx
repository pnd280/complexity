import { Infinity } from "lucide-react";
import { useCallback, useEffect } from "react";
import { useImmer } from "use-immer";

import { useQueryBoxStore } from "@/content-script/session-store/query-box";
import { LanguageModel } from "@/types/ModelSelector";

import { languageModels } from "./";
import ModelSelector from "./ModelSelector";

export default function LanguageModelSelector() {
  const limit = useQueryBoxStore((state) => state.queryLimit);
  const opusLimit = useQueryBoxStore((state) => state.opusLimit);

  const getModelLimit = useCallback(
    (model: LanguageModel) => {
      if (model.code === "claude3opus") {
        return opusLimit;
      }

      if (model.code === "turbo") {
        return <Infinity className="tw-h-4 tw-w-3" />;
      }

      return limit;
    },
    [limit, opusLimit],
  );

  const [models, setModels] = useImmer<LanguageModel[]>(
    languageModels.map((model) => {
      return {
        ...model,
        tooltip: getModelLimit(model),
      };
    }),
  );

  const value = useQueryBoxStore((state) => state.selectedLanguageModel);
  const setValue = useQueryBoxStore((state) => state.setSelectedLanguageModel);

  useEffect(() => {
    setModels((draft) => {
      draft.forEach((model) => {
        model.tooltip = getModelLimit(model);
      });
    });
  }, [limit, opusLimit, setModels, getModelLimit]);

  return (
    <ModelSelector
      type="language"
      items={models}
      onValueChange={setValue}
      value={value}
    />
  );
}
