import { Cpu, Infinity } from "lucide-react";
import { ReactNode, useCallback, useEffect } from "react";
import { useImmer } from "use-immer";

import { useQueryBoxStore } from "@/content-script/session-store/query-box";
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectLabel,
  SelectTrigger,
  SelectValue,
} from "@/shared/components/Select";
import Tooltip from "@/shared/components/Tooltip";
import UIUtils from "@/utils/UI";

import {
  groupedLanguageModelsByProvider,
  LanguageModel,
  languageModels,
} from "./";

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

  const [modelsLimits, setModelsLimits] = useImmer<
    Partial<Record<LanguageModel["code"], number | ReactNode>>
  >({});

  const value = useQueryBoxStore((state) => state.selectedLanguageModel);
  const setValue = useQueryBoxStore((state) => state.setSelectedLanguageModel);

  useEffect(() => {
    setModelsLimits((draft) => {
      if (draft === null) {
        draft = {};
      }

      languageModels.forEach((model) => {
        draft[model.code] = getModelLimit(model);
      });
    });
  }, [limit, opusLimit, getModelLimit, setModelsLimits]);

  return (
    <Select
      items={languageModels.map((model) => model.code)}
      value={[value]}
      onValueChange={(details) => {
        setValue(details.value[0] as LanguageModel["code"]);

        setTimeout(() => {
          UIUtils.getActiveQueryBoxTextarea({}).trigger("focus");
        }, 100);
      }}
    >
      <Tooltip
        content="Choose language model"
        positioning={{
          gutter: 8,
        }}
      >
        <SelectTrigger variant="ghost" className="!tw-px-0 !tw-py-0">
          <div className="tw-flex tw-min-h-8 !tw-w-fit tw-max-w-[200px] tw-select-none tw-items-center tw-justify-center tw-gap-2 !tw-px-2 tw-font-medium tw-transition-all tw-duration-300 tw-animate-in tw-zoom-in active:!tw-scale-95 [&_span]:tw-max-w-[150px]">
            <Cpu className="tw-size-4" />
            <SelectValue>
              {languageModels.find((model) => model.code === value)?.shortLabel}
            </SelectValue>
            <span className="!tw-self-start tw-text-[.5rem] tw-text-accent-foreground">
              {modelsLimits[value]}
            </span>
          </div>
        </SelectTrigger>
      </Tooltip>
      <SelectContent className="custom-scrollbar tw-max-h-[500px] tw-max-w-[200px] tw-overflow-auto tw-font-sans">
        {groupedLanguageModelsByProvider.map(([provider, models]) => (
          <SelectGroup key={provider}>
            <SelectLabel>{provider}</SelectLabel>
            {models.map((model) => (
              <Tooltip
                key={model.code}
                content={
                  value !== model.code ? modelsLimits[model.code] : undefined
                }
                positioning={{
                  placement: "right",
                  gutter: 10,
                }}
              >
                <SelectItem key={model.code} item={model.code}>
                  <div className="tw-flex tw-max-w-full tw-items-center tw-justify-around tw-gap-2">
                    {model.icon ? (
                      <div className="tw-text-[1.1rem]">{model.icon}</div>
                    ) : (
                      <Cpu className="tw-size-4" />
                    )}
                    <span className="tw-truncate">{model.label}</span>
                  </div>
                </SelectItem>
              </Tooltip>
            ))}
          </SelectGroup>
        ))}
      </SelectContent>
    </Select>
  );
}
