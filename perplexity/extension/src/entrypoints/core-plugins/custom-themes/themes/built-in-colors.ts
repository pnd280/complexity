export type ColorPalette = {
  value: string;
  label?: string;
  color: {
    light: {
      super100: string;
      super200: string;
    };
    dark: {
      super100: string;
      super200: string;
    };
  };
};

export const cplxColors = [
  {
    value: "cplx-blue",
    label: "Signature Blue",
    color: {
      light: {
        super100: "59.28% 0.131 255.75",
        super200: "44.28% 0.131 255.75",
      },
      dark: {
        super100: "54.28% 0.131 255.75",
        super200: "74.28% 0.131 255.75",
      },
    },
  },
  {
    value: "cplx-shy-moment",
    label: "Shy Moment",
    color: {
      light: {
        super100: "95.00% 0.042 285.60",
        super200: "73.59% 0.141 285.60",
      },
      dark: {
        super100: "58.59% 0.127 285.60",
        super200: "83.59% 0.113 285.60",
      },
    },
  },
] as const satisfies ColorPalette[];

export const cometColors = [
  {
    value: "comet-hydra",
    label: "Hydra",
    color: {
      light: {
        super100: "94.94% .033 208.37",
        super200: "55.27% .086 208.61",
      },
      dark: {
        super100: "39.71% .062 207.67",
        super200: "71.92% .112 205.51",
      },
    },
  },
  {
    value: "comet-terra",
    label: "Terra",
    color: {
      light: {
        super100: "91.23% .05 48.15",
        super200: "52.75% .13 37.37",
      },
      dark: {
        super100: "43.01% .108 37.17",
        super200: "70.73% .133 38.31",
      },
    },
  },
  {
    value: "comet-jenova",
    label: "Jenova",
    color: {
      light: {
        super100: "93.28% .038 357.01",
        super200: "49.39% .109 9.38",
      },
      dark: {
        super100: "34.35% .079 9.21",
        super200: "84.44% .092 .32",
      },
    },
  },
  {
    value: "comet-rosa",
    label: "Rosa",
    color: {
      light: {
        super100: "88.55% .06 28.44",
        super200: "51.72% .199 21.85",
      },
      dark: {
        super100: "39.55% .16 22.99",
        super200: "68.18% .207 22.93",
      },
    },
  },
  {
    value: "comet-costa",
    label: "Costa",
    color: {
      light: {
        super100: "93.76% .048 72.24",
        super200: "65.87% .163 54.96",
      },
      dark: {
        super100: "51.37% .155 42.1",
        super200: "80.62% .151 67.71",
      },
    },
  },
  {
    value: "comet-altana",
    label: "Altana",
    color: {
      light: {
        super100: "95% .083 95.76",
        super200: "71.97% .149 81.37",
      },
      dark: {
        super100: "51.11% .109 73.59",
        super200: "80.51% .151 81.42",
      },
    },
  },
  {
    value: "comet-dalmasca",
    label: "Dalmasca",
    color: {
      light: {
        super100: "95.74% .076 97.14",
        super200: "69.87% .123 97.59",
      },
      dark: {
        super100: "47.82% .091 97.9",
        super200: "83.9% .132 96.6",
      },
    },
  },
  {
    value: "comet-gridania",
    label: "Gridania",
    color: {
      light: {
        super100: "95.46% .037 105.4",
        super200: "60.17% .065 108.2",
      },
      dark: {
        super100: "42.28% .047 108.27",
        super200: "75.63% .107 109.92",
      },
    },
  },
  {
    value: "comet-limsa",
    label: "Limsa",
    color: {
      light: {
        super100: "94.36% .042 217.16",
        super200: "53.86% .101 231.01",
      },
      dark: {
        super100: "36.01% .071 232.13",
        super200: "73.11% .113 232.51",
      },
    },
  },
  {
    value: "comet-kuja",
    label: "Kuja",
    color: {
      light: {
        super100: "94.87% .046 325.93",
        super200: "54.3% .097 316.69",
      },
      dark: {
        super100: "38% .079 316.84",
        super200: "72.5% .119 316.63",
      },
    },
  },
  {
    value: "comet-sylph",
    label: "Sylph",
    color: {
      light: {
        super100: "77.92% .012 71.87",
        super200: "27.99% .014 76.29",
      },
      dark: {
        super100: "58.21% .006 196.99",
        super200: "84.32% .008 207.14",
      },
    },
  },
] as const satisfies ColorPalette[];

export type BuiltInColorValue =
  | (typeof cplxColors)[number]["value"]
  | (typeof cometColors)[number]["value"];

export function isBuiltInColorValue(value: string): value is BuiltInColorValue {
  return (
    cplxColors.some((c) => c.value === value) ||
    cometColors.some((c) => c.value === value)
  );
}
