

import {
  ImageModel,
  LanguageModel,
} from "@/content-script/components/QueryBox";
import useFetchUserSettings from "@/content-script/hooks/useFetchUserSettings";
import {
  initQueryBoxStore,
  useQueryBoxStore,
} from "@/content-script/session-store/query-box";

export default function useInitQueryBoxSessionStore() {
  const isInitialized = useRef(false);

  const { data: userSettings } = useFetchUserSettings();

  const { setQueryLimit, setOpusLimit, setImageCreateLimit, setO1Limit } =
    useQueryBoxStore((state) => state);

  useEffect(() => {
    if (userSettings != null) {
      if (!isInitialized.current) {
        initQueryBoxStore({
          imageModel:
            userSettings.defaultImageGenerationModel as ImageModel["code"],
          languageModel: userSettings.defaultModel as LanguageModel["code"],
        });

        isInitialized.current = true;
      }

      setQueryLimit(userSettings.gpt4Limit);
      setOpusLimit(userSettings.opusLimit);
      setO1Limit(userSettings.o1Limit);
      setImageCreateLimit(userSettings.createLimit);
    }
  }, [
    setImageCreateLimit,
    setOpusLimit,
    setQueryLimit,
    setO1Limit,
    userSettings,
  ]);
}
