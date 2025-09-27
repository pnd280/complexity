import { FaHtml5 } from "react-icons/fa";

import FaFileTypePdf from "@/components/icons/FaFileTypePdf";
import FaMarkdown from "@/components/icons/FaMarkdown";

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
    icon: FaHtml5,
    isDisabled: true,
  },
] as const;

export type ExportOption = (typeof EXPORT_OPTIONS)[number];
