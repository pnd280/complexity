import usePopupSettings from '@/popup/hooks/usePopupSettings';

export default function useArtifactsSettings() {
  const { store } = usePopupSettings();

  if (!store) return;

  const {
    popupSettings: {
      qolTweaks: { MarkdownBlockToolbar },
    },
    artifacts,
  } = store;

  return {
    mermaid: MarkdownBlockToolbar && artifacts.mermaid,
  };
}
