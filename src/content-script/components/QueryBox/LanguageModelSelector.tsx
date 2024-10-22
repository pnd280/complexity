import { createListCollection } from "@ark-ui/react";
import { ReactNode } from "react";
import { LuCpu as Cpu, LuInfinity as Infinity } from "react-icons/lu";
import { useImmer } from "use-immer";

import {
  LanguageModel,
  groupedLanguageModelsByProvider,
  languageModelIcons,
} from "@/content-script/components/QueryBox";
import { languageModels } from "@/content-script/components/QueryBox/consts";
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
import { isReactNode } from "@/types/utils.types";
import UiUtils from "@/utils/UiUtils";

export default function LanguageModelSelector() {
  const limit = useQueryBoxStore((state) => state.queryLimit);
  const opusLimit = useQueryBoxStore((state) => state.opusLimit);
  const o1Limit = useQueryBoxStore((state) => state.o1Limit);

  const getModelLimit = useCallback(
    (model: LanguageModel) => {
      switch (model.code) {
        case "claude3opus":
          return opusLimit;
        case "o1":
          return o1Limit;
        case "turbo":
          return <Infinity className="tw-h-4 tw-w-3" />;
        default:
          return limit;
      }
    },
    [limit, opusLimit, o1Limit],
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
  }, [limit, opusLimit, o1Limit, getModelLimit, setModelsLimits]);

  return (
    <Select
      collection={createListCollection({
        items: languageModels.map((model) => model.code),
      })}
      value={[value]}
      onValueChange={(details) => {
        setValue(details.value[0] as LanguageModel["code"]);

        setTimeout(() => {
          UiUtils.getActiveQueryBoxTextarea({}).trigger("focus");
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
          <div className="tw-flex tw-min-h-8 !tw-w-fit tw-max-w-[200px] tw-select-none tw-items-center tw-justify-center tw-gap-2 !tw-px-2 tw-font-medium tw-transition-all tw-duration-300 tw-animate-in tw-fade-in active:!tw-scale-95 [&_span]:tw-max-w-[150px]">
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
      <SelectContent className="custom-scrollbar tw-max-h-[40svh] tw-max-w-[200px] tw-overflow-auto tw-font-sans">
        {groupedLanguageModelsByProvider.map(([provider, models]) => (
          <SelectGroup key={provider}>
            <SelectLabel>{provider}</SelectLabel>
            {models.map((model) => (
              <Tooltip
                key={model.code}
                content={modelsLimits[model.code]}
                disabled={value === model.code}
                positioning={{
                  placement: "right",
                  gutter: 10,
                }}
              >
                <SelectItem key={model.code} item={model.code}>
                  <div className="tw-flex tw-max-w-full tw-items-center tw-justify-around tw-gap-2">
                    {isReactNode(languageModelIcons[model.code]) ? (
                      <div className="tw-text-[1.1rem]">
                        {languageModelIcons[model.code]}
                      </div>
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
