import CommonSelectors from "@/content-script/components/QueryBox/CommonSelectors";
import {
  MainQueryBoxContextProvider,
  FollowUpQueryBoxContextProvider,
} from "@/content-script/components/QueryBox/context";
import ImageModelSelector from "@/content-script/components/QueryBox/ImageModelSelector";
import useFetchUserSettings from "@/content-script/hooks/useFetchUserSettings";
import useInitQueryBoxSessionStore from "@/content-script/hooks/useInitQueryBoxSessionStore";
import useQueryBoxObserver from "@/content-script/hooks/useQueryBoxObserver";
import useCplxGeneralSettings from "@/cplx-user-settings/hooks/useCplxGeneralSettings";
import Portal from "@/shared/components/Portal";

export default function QueryBox() {
  const { settings } = useCplxGeneralSettings();

  const { spaceNFocus, imageGenModel, languageModel } =
    settings?.queryBoxSelectors || {};

  const {
    data: userSettings,
    isLoading: isLoadingUserSettings,
    refetch: refetchUserSettings,
    error: userSettingsFetchError,
  } = useFetchUserSettings();

  useInitQueryBoxSessionStore();

  const hasActivePplxSub =
    userSettings &&
    (userSettings.subscriptionStatus === "active" ||
      userSettings.subscriptionStatus === "trialing");

  const [containers, setContainers] = useState<HTMLElement[]>([]);
  const [followUpContainers, setFollowUpContainers] = useState<HTMLElement[]>(
    [],
  );
  const [imageGenPopoverContainer, setImageGenPopoverContainer] =
    useState<HTMLElement>();

  const memoizedSetContainers = useCallback((newContainer: HTMLElement) => {
    setContainers((prevContainers) =>
      [...prevContainers, newContainer].filter((x) => document.contains(x)),
    );
  }, []);

  const memoizedSetFollowUpContainers = useCallback(
    (newContainer: HTMLElement) => {
      setFollowUpContainers((prevFollowUpContainers) =>
        [...prevFollowUpContainers, newContainer].filter((x) =>
          document.contains(x),
        ),
      );
    },
    [],
  );

  useQueryBoxObserver({
    setContainers: memoizedSetContainers,
    setFollowUpContainers: memoizedSetFollowUpContainers,
    setImageGenPopoverContainer,
    refetchUserSettings,
  });

  const isReady =
    (!!userSettings && !isLoadingUserSettings) || !!userSettingsFetchError;

  const selectors = (
    <CommonSelectors
      isReady={isReady}
      hasActivePplxSub={!!hasActivePplxSub}
      focus={!!spaceNFocus}
      space={!!spaceNFocus}
      languageModel={!!languageModel}
    />
  );

  const followUpSelectors = (
    <CommonSelectors
      isReady={isReady}
      hasActivePplxSub={!!hasActivePplxSub}
      focus={!!spaceNFocus}
      languageModel={!!languageModel}
    />
  );

  return (
    <>
      {containers.map((container, index) => (
        <Portal key={index} container={container}>
          <MainQueryBoxContextProvider>{selectors}</MainQueryBoxContextProvider>
        </Portal>
      ))}
      {followUpContainers.map((container, index) => (
        <Portal key={index} container={container}>
          <FollowUpQueryBoxContextProvider>
            {followUpSelectors}
          </FollowUpQueryBoxContextProvider>
        </Portal>
      ))}
      {imageGenPopoverContainer && (
        <Portal container={imageGenPopoverContainer}>
          <div className="tw-mb-2 tw-w-max">
            {imageGenModel && <ImageModelSelector />}
          </div>
        </Portal>
      )}
    </>
  );
}
