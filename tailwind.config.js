/* eslint-disable no-undef */
/** @type {import('tailwindcss').Config} */
module.exports = {
  darkMode: ["class"],
  content: ["./src/**/*.{html,js,jsx,ts,tsx}"],
  prefix: "tw-",
  theme: {
    container: {
      center: true,
      padding: "2rem",
      screens: {
        "2xl": "1400px",
      },
    },
    fontFamily: {
      sans: "var(--ui-font)",
      mono: "var(--mono-font)",
    },
    extend: {
      typography: {
        DEFAULT: {
          css: {
            "--tw-prose-body": "var(--foreground)",
            "--tw-prose-headings": "var(--accent-foreground)",
            "--tw-prose-lead": "var(--foreground-darker)",
            "--tw-prose-links": "var(--primary)",
            "--tw-prose-bold": "var(--accent-foreground)",
            "--tw-prose-counters": "var(--foreground-darker)",
            "--tw-prose-bullets": "var(--foreground-darker)",
            "--tw-prose-hr": "var(--border)",
            "--tw-prose-quotes": "var(--primary)",
            "--tw-prose-quote-borders": "var(--border)",
            "--tw-prose-captions": "var(--foreground-darker)",
            "--tw-prose-code": "var(--primary)",
            "--tw-prose-pre-code": "var(--foreground)",
            "--tw-prose-pre-bg": "var(--background)",
            "--tw-prose-th-borders": "var(--border)",
            "--tw-prose-td-borders": "var(--border)",
            "--tw-prose-invert-body": "var(--foreground)",
            "--tw-prose-invert-headings": "var(--primary)",
            "--tw-prose-invert-lead": "var(--foreground-darker)",
            "--tw-prose-invert-links": "var(--primary)",
            "--tw-prose-invert-bold": "var(--accent-foreground)",
            "--tw-prose-invert-counters": "var(--foreground-darker)",
            "--tw-prose-invert-bullets": "var(--foreground-darker)",
            "--tw-prose-invert-hr": "var(--border)",
            "--tw-prose-invert-quotes": "var(--primary)",
            "--tw-prose-invert-quote-borders": "var(--border)",
            "--tw-prose-invert-captions": "var(--foreground-darker)",
            "--tw-prose-invert-code": "var(--primary)",
            "--tw-prose-invert-pre-code": "var(--foreground)",
            "--tw-prose-invert-pre-bg": "var(--background)",
            "--tw-prose-invert-th-borders": "var(--border)",
            "--tw-prose-invert-td-borders": "var(--border)",
          },
        },
      },
      boxShadow: {
        "bottom-lg": "0 8px 10px -10px rgba(0, 0, 0, 0.5)",
      },
      colors: {
        border: {
          DEFAULT: "var(--border)",
          darker: "var(--border-darker)",
        },
        input: "var(--input)",
        ring: "var(--ring)",
        background: "var(--background)",
        foreground: {
          DEFAULT: "var(--foreground)",
          darker: "var(--foreground-darker)",
        },
        primary: {
          DEFAULT: "var(--primary)",
          foreground: "var(--primary-foreground)",
        },
        secondary: {
          DEFAULT: "var(--secondary)",
          foreground: "var(--secondary-foreground)",
        },
        destructive: {
          DEFAULT: "var(--destructive)",
          foreground: "var(--destructive-foreground)",
        },
        muted: {
          DEFAULT: "var(--muted)",
          foreground: "var(--muted-foreground)",
        },
        accent: {
          DEFAULT: "var(--accent)",
          foreground: "var(--accent-foreground)",
          "foreground-darker": "var(--accent-foreground-darker)",
        },
        popover: {
          DEFAULT: "var(--popover)",
          foreground: "var(--popover-foreground)",
        },
        card: {
          DEFAULT: "var(--card)",
          foreground: "var(--card-foreground)",
        },
      },
      borderRadius: {
        lg: "var(--radius)",
        md: "calc(var(--radius) - 2px)",
        sm: "calc(var(--radius) - 4px)",
      },
    },
  },
  plugins: [require("tailwindcss-animate"), require("@tailwindcss/typography")],
};
