import { asyncLoaderRegistry } from "@/plugins/_core/async-dep-registry";
import { threadDomObserverStore } from "@/plugins/_core/dom-observers/thread/store";
import { getDomSelectorsRootService } from "@/plugins/_core/dom-selectors/service-init.loader";
import { getActiveQueryBox } from "@/plugins/_core/ui/groups/query-box/utils";
import styles from "@/plugins/drag-n-drop-file-to-upload-in-thread/styles.css?inline";
import { insertCss } from "@/utils/utils";

const DRAGOVER_EVENT = "dragover.cplx-file-upload";
const DROP_EVENT = "drop.cplx-file-upload";
const DRAGLEAVE_EVENT = "dragleave.cplx-file-upload";
const DRAGENTER_EVENT = "dragenter.cplx-file-upload";

let removeCss: (() => void) | null = null;
let $overlay: JQuery<HTMLElement> | null = null;

declare module "@/plugins/_core/async-dep-registry" {
  interface AsyncLoadersRegistry {
    "plugin:thread:dragAndDropFileToUploadInThread": void;
  }
}

export default function loader() {
  asyncLoaderRegistry.register({
    id: "plugin:thread:dragAndDropFileToUploadInThread",
    dependencies: ["cache:pluginsStates"],
    loader: ({ "cache:pluginsStates": pluginsStates }) => {
      if (!pluginsStates["thread:dragAndDropFileToUploadInThread"]) return;

      const cleanup = () => {
        $overlay?.remove();
        removeCss?.();
      };

      threadDomObserverStore.subscribe(
        (store) => store.$wrapper,
        ($wrapper) => {
          cleanup();

          if (!$wrapper || !$wrapper.length) return;

          if (
            !$wrapper.length ||
            $wrapper.attr(
              getDomSelectorsRootService().internalAttributes.THREAD
                .ATTACHMENT_DROP_ZONE,
            ) === "true"
          )
            return;

          $wrapper.attr(
            getDomSelectorsRootService().internalAttributes.THREAD
              .ATTACHMENT_DROP_ZONE,
            "true",
          );

          removeCss = insertCss({
            css: styles,
            id: "cplx-drag-n-drop-file-to-upload-in-thread",
          });

          $overlay = $(`
        <div data-cplx-component="${getDomSelectorsRootService().internalAttributes.THREAD.ATTACHMENT_DROP_ZONE}" class="cplx-file-upload-overlay">
          <div class="cplx-file-upload-overlay__content">
            <div>${t("plugin-drag-n-drop-file-to-upload-in-thread.dropZone.message")}</div>
          </div>
        </div>
      `).appendTo("body");

          let dragCounter = 0;

          $wrapper.on(DRAGENTER_EVENT, function (e) {
            const filesTypes = e.originalEvent?.dataTransfer?.types;
            if (filesTypes?.length == null || !filesTypes.includes("Files"))
              return;

            e.preventDefault();
            e.stopPropagation();

            dragCounter++;
            if (dragCounter === 1) {
              $overlay?.addClass("active");
            }
          });

          $wrapper.on(DRAGOVER_EVENT, function (e) {
            const filesTypes = e.originalEvent?.dataTransfer?.types;
            if (filesTypes?.length == null || !filesTypes.includes("Files"))
              return;

            e.preventDefault();
            e.stopPropagation();
          });

          $wrapper.on(DRAGLEAVE_EVENT, function (e) {
            e.preventDefault();
            e.stopPropagation();

            dragCounter--;
            if (dragCounter <= 0) {
              dragCounter = 0;
              $overlay?.removeClass("active");
            }
          });

          $wrapper.on(DROP_EVENT, function (e) {
            const files = e.originalEvent?.dataTransfer?.files;

            if (files?.length == null) return;

            e.preventDefault();
            e.stopPropagation();

            $overlay?.removeClass("active");
            dragCounter = 0;

            const $queryBox = getActiveQueryBox({ type: "follow-up" });
            const $fileInput = $queryBox.find('input[type="file"]');
            if (!$fileInput[0]) return;

            const dataTransfer = new DataTransfer();
            Array.from(files).forEach((file) => dataTransfer.items.add(file));

            $fileInput.prop("files", dataTransfer.files);
            $fileInput[0].dispatchEvent(new Event("change", { bubbles: true }));
          });
        },
        {
          equalityFn: deepEqual,
        },
      );
    },
  });
}
