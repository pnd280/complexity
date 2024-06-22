import usePopupSettings from '@/popup/hooks/usePopupSettings';

export default function useArtifactsSettings() {
  const { store } = usePopupSettings();

  if (!store) return;

  const {
    popupSettings: {
      qolTweaks: { codeBlockEnhancedToolbar },
    },
    artifacts,
  } = store;

  return {
    mermaid: codeBlockEnhancedToolbar && artifacts.mermaid,
  };
}
