import { useEffect, useState } from "react";

import { fetchCommunityThemes, validateTheme } from "@/data/dashboard/themes/utils";
import type { Theme } from "@/data/dashboard/themes/theme.types";

export interface CommunityTheme extends Theme {
  isFromCommunity: boolean;
  source: string;
  fileName: string;
}

export interface UseCommunityThemesReturn {
  themes: CommunityTheme[];
  isLoading: boolean;
  error: string | null;
  refetch: () => Promise<void>;
}

/**
 * Custom hook to fetch and manage community themes
 */
export function useCommunityThemes(): UseCommunityThemesReturn {
  const [themes, setThemes] = useState<CommunityTheme[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchThemes = async () => {
    try {
      setIsLoading(true);
      setError(null);
      
      const communityThemes = await fetchCommunityThemes();
      
      // Validate themes and filter out invalid ones
      const validThemes = communityThemes.filter((theme) => {
        if (!validateTheme(theme)) {
          console.warn(`Invalid theme detected: ${theme.id || 'unknown'}`);
          return false;
        }
        return true;
      }) as CommunityTheme[];
      
      setThemes(validThemes);
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Failed to fetch community themes';
      setError(errorMessage);
      console.error('Error in useCommunityThemes:', err);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchThemes();
  }, []);

  return {
    themes,
    isLoading,
    error,
    refetch: fetchThemes,
  };
}
