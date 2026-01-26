import { useCommandMenuStore } from "@/plugins/command-menu/store";

export default function CommandSidecar() {
  return useCommandMenuStore((store) => store.sidecar.items);
}
