import { create } from "zustand";

interface ExportStore {
  isExporting: boolean;
  lastExport: string | null;
  setIsExporting: (isExporting: boolean) => void;
  setLastExport: (content: string) => void;
}

export const useExportStore = create<ExportStore>((set) => ({
  isExporting: false,
  lastExport: null,
  setIsExporting: (isExporting) => set({ isExporting }),
  setLastExport: (content) => set({ lastExport: content }),
}));
