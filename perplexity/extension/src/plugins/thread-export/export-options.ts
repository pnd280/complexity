import FaFileTypePdf from "@/components/icons/FaFileTypePdf";
import FaMarkdown from "@/components/icons/FaMarkdown";

import TablerBrandHtml5 from "~icons/tabler/brand-html5";

export const EXPORT_OPTIONS = [
  {
    label: "Markdown",
    value: "markdown",
    icon: FaMarkdown,
    isDisabled: false,
  },
  {
    label: "PDF (soon)",
    value: "pdf",
    icon: FaFileTypePdf,
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
