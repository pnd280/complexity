import usePopupSettings from '@/popup/hooks/usePopupSettings';

export default function useArtifactsSettings() {
  const { store } = usePopupSettings();

  if (!store) return;

  const {
    popupSettings: {
      qolTweaks: { markdownBlockEnhancedToolbar },
    },
    artifacts,
  } = store;

  return {
    mermaid: markdownBlockEnhancedToolbar && artifacts.mermaid,
  };
}
