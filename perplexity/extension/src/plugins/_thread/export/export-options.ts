import TablerBrandHtml5 from "~icons/tabler/brand-html5";
import TablerFileTypePdf from "~icons/tabler/file-type-pdf";
import TablerMarkdown from "~icons/tabler/markdown";

export const EXPORT_OPTIONS = [
  {
    label: "Markdown",
    value: "markdown",
    icon: TablerMarkdown,
    isDisabled: false,
  },
  {
    label: "PDF (soon)",
    value: "pdf",
    icon: TablerFileTypePdf,
    isDisabled: true,
  },
  {
    label: "Formatted text (soon)",
    value: "html",
    icon: TablerBrandHtml5,
    isDisabled: true,
  },
] as const;

export type ExportOption = (typeof EXPORT_OPTIONS)[number];
