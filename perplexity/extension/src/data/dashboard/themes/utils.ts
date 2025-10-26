import type { Oklch } from "culori";
import { oklch } from "culori";
import dedent from "dedent";
import type { DeepRequired } from "react-hook-form";

import vibrantBaseCss from "@/data/dashboard/themes/assets/vibrant-base.css?inline";
import {
  cometColors,
  cplxColors,
} from "@/data/dashboard/themes/built-in-colors";
import type { Theme } from "@/data/dashboard/themes/theme.types";
import type { ThemeFormValues } from "@/data/dashboard/themes/theme.types";

export const initialValues: DeepRequired<ThemeFormValues> = {
  title: "Untitled Theme",
  fonts: { ui: "", mono: "" },
  accentColor: "",
  builtInAccentColor: "cplx-blue",
  accentColorSelection: "built-in",
  enhanceThreadTypography: false,
  customCss: "",
};

type ThemeDataResult = Pick<Theme, "css" | "displayBannerColors">;
type ColorPaletteForAccent = Parameters<typeof generateAccentColorOverrides>[0];

export function generateThemeData(
  data: ThemeFormValues,
  defaultValues: DeepRequired<ThemeFormValues>,
): ThemeDataResult {
  const cssParts: string[] = [];
  let displayBannerColors: string[] = [];

  let accentPalette: ColorPaletteForAccent | undefined;

  if (data.accentColorSelection === "custom" && data.accentColor) {
    accentPalette = generatePalette(data.accentColor);
  } else if (data.accentColorSelection === "built-in") {
    const color = [...cplxColors, ...cometColors].find(
      (c) => c.value === data.builtInAccentColor,
    );

    invariant(color, "[ThemesUtils] Invalid context");
    accentPalette = color.color;
  }

  if (accentPalette) {
    cssParts.push(generateAccentColorOverrides(accentPalette));
    displayBannerColors = [
      accentPalette.light.super200,
      accentPalette.dark.super200,
    ];
  }

  const fontUiData = {
    uiFont: data.fonts.ui ?? defaultValues.fonts.ui,
    monoFont: data.fonts.mono ?? defaultValues.fonts.mono,
  };

  if (
    fontUiData.uiFont ||
    fontUiData.monoFont ||
    data.enhanceThreadTypography
  ) {
    cssParts.push(generateUiFontsOverrides(fontUiData));
  }

  if (data.enhanceThreadTypography) {
    cssParts.push(vibrantBaseCss);
  }

  if (data.customCss) {
    cssParts.push(data.customCss);
  }

  return {
    css: cssParts.join("\n"),
    displayBannerColors,
  };
}

/**
 * Fetch community themes from the complexity-themes repository
 */
export async function fetchCommunityThemes(): Promise<Theme[]> {
  try {
    const response = await fetch(
      'https://api.github.com/repos/Dreadfxl/complexity-themes/contents/themes'
    );
    
    if (!response.ok) {
      throw new Error(`Failed to fetch community themes: ${response.statusText}`);
    }
    
    const files = await response.json();
    
    // Filter only JSON files
    const jsonFiles = files.filter((file: any) => 
      file.name.endsWith('.json') && file.type === 'file'
    );
    
    const themePromises = jsonFiles.map(async (file: any) => {
      try {
        const themeResponse = await fetch(file.download_url);
        if (!themeResponse.ok) {
          console.warn(`Failed to fetch theme: ${file.name}`);
          return null;
        }
        const themeData = await themeResponse.json();
        
        // Add community metadata
        return {
          ...themeData,
          isFromCommunity: true,
          source: 'community',
          fileName: file.name,
        } as Theme & { isFromCommunity: boolean; source: string; fileName: string };
      } catch (error) {
        console.warn(`Error parsing theme ${file.name}:`, error);
        return null;
      }
    });
    
    const themes = await Promise.all(themePromises);
    return themes.filter((theme): theme is Theme => theme !== null);
  } catch (error) {
    console.error('Error fetching community themes:', error);
    return [];
  }
}

/**
 * Validate a theme object against the expected schema
 */
export function validateTheme(theme: any): theme is Theme {
  return (
    typeof theme === 'object' &&
    theme !== null &&
    typeof theme.id === 'string' &&
    /^[a-zA-Z0-9-]+$/.test(theme.id) &&
    typeof theme.title === 'string' &&
    theme.title.length > 0 &&
    Array.isArray(theme.displayBannerColors) &&
    theme.displayBannerColors.length > 0 &&
    theme.displayBannerColors.every((color: any) => 
      typeof color === 'string' && /^#([0-9A-Fa-f]{6}|[0-9A-Fa-f]{3})$/.test(color)
    ) &&
    typeof theme.css === 'string'
  );
}

type ColorPalette = {
  light: {
    super100: string;
    super200: string;
  };
  dark: {
    super100: string;
    super200: string;
  };
};

export function generateAccentColorOverrides({ light, dark }: ColorPalette) {
  invariant(light.super100, "[ThemesUtils] Invalid context");
  invariant(light.super200, "[ThemesUtils] Invalid context");
  invariant(dark.super100, "[ThemesUtils] Invalid context");
  invariant(dark.super200, "[ThemesUtils] Invalid context");

  return dedent`
    ::selection {
      color: var(--primary);
      background: --alpha(var(--primary) / 30%);
    }
  
    body {
      --super-bg-color: ${light.super100};
      --super-color: ${light.super200};
      --dark-super-bg-color: ${dark.super100};
      --dark-super-color: ${dark.super200};

      --primary: oklch(${light.super200});
      --ring: oklch(${light.super200});

      caret-color: var(--primary);
    }

    :root[data-color-scheme="dark"] body {
        --primary: oklch(${dark.super200});
        --ring: oklch(${dark.super200});

        --super-bg-color: var(--dark-super-bg-color);
        --super-color: var(--dark-super-color);
      }
  `;
}

type FontOverridesOptions = {
  uiFont: string;
  monoFont: string;
};

export function generateUiFontsOverrides({
  uiFont,
  monoFont,
}: FontOverridesOptions) {
  if (!uiFont && !monoFont) {
    return "";
  }

  return dedent`
    body {
      ${uiFont ? `--font-fk-grotesk: "${uiFont}";` : ""}
      ${uiFont ? `--font-fk-grotesk-neue: "${uiFont}";` : ""}
      ${monoFont ? `--font-berkeley-mono: "${monoFont}";` : ""}
    }
  `;
}

export function generatePalette(baseHex: string): ColorPalette {
  const baseOklch = oklch(baseHex);

  invariant(baseOklch, "[ThemesUtils] Invalid context");

  return {
    light: {
      super100: formatOklch({
        ...baseOklch,
        l: Math.min(0.95, baseOklch.l + 0.25),
        c: baseOklch.c * 0.3,
      }),
      super200: formatOklch({
        ...baseOklch,
        c: baseOklch.c || 0,
      }),
    },
    dark: {
      super100: formatOklch({
        ...baseOklch,
        l: Math.max(0.3, baseOklch.l - 0.15),
        c: (baseOklch.c || 0) * 0.9,
      }),
      super200: formatOklch({
        ...baseOklch,
        l: Math.max(0.7, baseOklch.l + 0.1),
        c: (baseOklch.c || 0) * 0.8,
      }),
    },
  };
}

export function hexToOklchString(hex: string): string {
  const color = oklch(hex);

  if (!color) throw new Error("Invalid color");

  return formatOklch(color);
}

function formatOklch(color: Oklch) {
  return `${(color.l * 100).toFixed(2)}% ${color.c.toFixed(4)} ${color.h?.toFixed(1)}`;
}
