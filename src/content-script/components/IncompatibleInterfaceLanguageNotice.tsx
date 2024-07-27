import $ from "jquery";
import { useEffect } from "react";

import { useToast } from "@/shared/components/shadcn/ui/use-toast";
import { isDomNode } from "@/utils/utils";

import useWaitForElement from "../hooks/useWaitForElement";

export function IncompatibleInterfaceLanguageNotice() {
  const { toast } = useToast();

  const { element, isWaiting } = useWaitForElement({
    id: "languageSelect",
    selector: "#interface-language-select",
  });

  useEffect(() => {
    if (!isDomNode(element) || !$(element).length) return;

    const $select = $(element);
    if ($select.length) {
      if ($select.val() !== "en-US") {
        toast({
          variant: "destructive",
          title: "⚠️ Unsupported Language",
          description: (
            <span>
              The extension is only available in{" "}
              <span className="tw-font-bold">English.</span>
            </span>
          ),
        });
      }
    }
  }, [element, isWaiting, toast]);

  return null;
}
