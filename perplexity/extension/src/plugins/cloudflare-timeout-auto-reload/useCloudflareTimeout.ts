import usePplxUserSettings from "@/hooks/usePplxUserSettings";

export default function useCloudflareTimeout() {
  const { failureReason } = usePplxUserSettings();

  const isSessionTimeout = failureReason?.message === "Cloudflare timeout";

  const handleReload = () => {
    console.log("Session timeout (most likely cloudflare), refreshing page");

    window.location.reload();
  };

  return { isSessionTimeout, handleReload };
}
