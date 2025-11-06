import complexityBlue from "@/data/dashboard/themes/assets/complexity-blue.css?inline";
import shyMoment from "@/data/dashboard/themes/assets/shy-moment.css?inline";
import complexityBase from "@/data/dashboard/themes/assets/vibrant-base.css?inline";
import type { Theme } from "@/data/dashboard/themes/theme.types";

export type BuiltInThemeId = "complexity" | "complexity-shy-moment";

export const BUILTIN_THEME_REGISTRY: (Theme & { id: BuiltInThemeId })[] = [
  {
    id: "complexity",
    description: "Official Complexity Blue theme",
    css: complexityBase + "\n" + complexityBlue,
    displayBannerColors: ["44.28% 0.131 255.75", "74.28% 0.131 255.75"],
    config: {
      title: "Complexity Blue",
      fonts: {
        ui: "",
        mono: "",
      },
      accentColor: "",
      customCss: "",
      accentColorSelection: "built-in",
      builtInAccentColor: "cplx-blue",
      enhanceThreadTypography: true,
    },
  },
  {
    id: "complexity-shy-moment",
    description: "Official Complexity Purple theme",
    css: complexityBase + "\n" + shyMoment,
    displayBannerColors: ["73.59% 0.141 285.60", "83.59% 0.113 285.60"],
    config: {
      title: "Shy Moment",
      fonts: {
        ui: "",
        mono: "",
      },
      accentColor: "",
      customCss: "",
      accentColorSelection: "built-in",
      builtInAccentColor: "cplx-shy-moment",
      enhanceThreadTypography: true,
    },
  },
];
